hexo.extend.tag.register(
  'youtube',
  function (args) {
    const [id] = args;

    return (
      '<div id="player" class="js-player" data-plyr-provider="youtube" data-plyr-embed-id="' +
      id +
      '"></div>'
    );
  },
  { ends: false, async: false },
);
