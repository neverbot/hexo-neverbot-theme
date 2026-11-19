'use strict';

// Adds width, height and loading="lazy" to the images of each post, so the
// browser reserves their space before they arrive and does not download the
// ones far below the fold. The first image of a post is left eager, since it
// may be the largest element on screen. Dimensions are read from the image
// files at build time; remote images only get the lazy loading.

const fs = require('fs');
const path = require('path');

const cache = new Map();

function readJpeg(buffer) {
  let offset = 2;
  while (offset + 9 < buffer.length) {
    if (buffer[offset] !== 0xff) return null;
    const marker = buffer[offset + 1];
    if (marker === 0xd8 || (marker >= 0xd0 && marker <= 0xd7) || marker === 0x01) {
      offset += 2;
      continue;
    }
    const length = buffer.readUInt16BE(offset + 2);
    const isFrame = marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker);
    if (isFrame) {
      return { height: buffer.readUInt16BE(offset + 5), width: buffer.readUInt16BE(offset + 7) };
    }
    offset += 2 + length;
  }
  return null;
}

function readWebp(buffer) {
  const chunk = buffer.toString('ascii', 12, 16);
  if (chunk === 'VP8 ') {
    return { width: buffer.readUInt16LE(26) & 0x3fff, height: buffer.readUInt16LE(28) & 0x3fff };
  }
  if (chunk === 'VP8L') {
    const bits = buffer.readUInt32LE(21);
    return { width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1 };
  }
  if (chunk === 'VP8X') {
    return { width: buffer.readUIntLE(24, 3) + 1, height: buffer.readUIntLE(27, 3) + 1 };
  }
  return null;
}

function readSize(buffer) {
  if (buffer.length < 30) return null;
  if (buffer[0] === 0x89 && buffer.toString('ascii', 1, 4) === 'PNG') {
    return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
  }
  if (buffer.toString('ascii', 0, 3) === 'GIF') {
    return { width: buffer.readUInt16LE(6), height: buffer.readUInt16LE(8) };
  }
  if (buffer[0] === 0xff && buffer[1] === 0xd8) {
    return readJpeg(buffer);
  }
  if (buffer.toString('ascii', 0, 4) === 'RIFF' && buffer.toString('ascii', 8, 12) === 'WEBP') {
    return readWebp(buffer);
  }
  return null;
}

function imageSize(file) {
  if (cache.has(file)) return cache.get(file);
  let size;
  try {
    size = readSize(fs.readFileSync(file));
  } catch {
    size = null;
  }
  if (size && !(size.width > 0 && size.height > 0)) size = null;
  cache.set(file, size);
  return size;
}

function localFile(src, data, hexo) {
  if (!src || /^([a-z]+:)?\/\//i.test(src) || src.startsWith('data:')) return null;

  let pathname;
  try {
    pathname = decodeURIComponent(src.split(/[?#]/)[0]);
  } catch {
    return null;
  }

  const candidates = [];
  const postPath = data.path ? '/' + data.path.replace(/index\.html$/, '') : null;

  if (data.asset_dir) {
    if (postPath && pathname.startsWith(postPath)) {
      candidates.push(path.join(data.asset_dir, pathname.slice(postPath.length)));
    } else if (!pathname.startsWith('/')) {
      candidates.push(path.join(data.asset_dir, pathname));
    }
  }
  if (pathname.startsWith('/')) {
    candidates.push(path.join(hexo.source_dir, pathname));
  } else if (data.source) {
    candidates.push(path.join(hexo.source_dir, path.dirname(data.source), pathname));
  }

  return candidates.find((file) => fs.existsSync(file)) || null;
}

hexo.extend.filter.register(
  'after_post_render',
  function (data) {
    if (!data.content || !data.content.includes('<img')) return data;

    let first = true;

    data.content = data.content.replace(/<img\b[^>]*>/gi, (tag) => {
      let result = tag;
      const isFirst = first;
      first = false;

      if (!/\swidth=/i.test(tag) && !/\sheight=/i.test(tag)) {
        const src = (tag.match(/\ssrc=["']([^"']+)["']/i) || [])[1];
        const file = localFile(src, data, this);
        const size = file && imageSize(file);
        if (size) {
          result = result.replace(/^<img\b/i, `<img width="${size.width}" height="${size.height}"`);
        }
      }

      if (!isFirst && !/\sloading=/i.test(tag)) {
        result = result.replace(/^<img\b/i, '<img loading="lazy"');
      }

      return result;
    });

    return data;
  },
  20,
);
