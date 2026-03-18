// hexo.extend.injector.register('head_end', () => {
//   let base_url = hexo.config.url;
//   if (hexo.config.url.charAt(hexo.config.url.length - 1) !== '/') base_url += '/';

//   return (
//     '<link rel="canonical" href="' +
//     base_url +
//     page.canonical_path.replace('index.html', '').toLowerCase() +
//     '"/>'
//   );
// });

hexo.extend.helper.register('autoCanonical', function (config, page) {
  let base_url = config.url;

  // add slash to the base url, except in the home (root dir)
  if (base_url.charAt(base_url.length - 1) !== '/' && page.canonical_path != 'index.html')
    base_url += '/';

  return (
    '<link rel="canonical" href="' +
    base_url +
    page.canonical_path.replace('index.html', '').toLowerCase() +
    '"/>'
  );
});
