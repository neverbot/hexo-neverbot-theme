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
  var base_url = config.url;
  if (config.url.charAt(config.url.length - 1) !== '/') base_url += '/';

  return (
    '<link rel="canonical" href="' +
    base_url +
    page.canonical_path.replace('index.html', '').toLowerCase() +
    '"/>'
  );
});
