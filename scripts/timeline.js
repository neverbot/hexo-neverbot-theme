hexo.extend.tag.register(
  'year',
  function (args, content) {
    const [badge, title, subtitle, last] = args;

    /* eslint-disable */
    return '<div class="timeline-node' + (last ? ' last' : '') + '">' +
            '<div class="timeline-line"></div>' +
            (badge.trim().length ? '<div class="timeline-time">' + badge + '</div>' : '') +
            '<div class="timeline-circle"></div>' +
            '<div class="timeline-body">' +
              '<div class="timeline-title">' + hexo.render.renderSync({ text: title, engine: 'markdown' }) + '</div>' +
              '<div class="timeline-subtitle">' + hexo.render.renderSync({ text: subtitle, engine: 'markdown' }) + '</div>' +
              '<div class="timeline-content">' + hexo.render.renderSync({ text: content, engine: 'markdown' }) + '</div>' +
            '</div>' +
          '</div>';
    /* eslint-enable */
  },
  { ends: true, async: false },
);

hexo.extend.tag.register(
  'timeline',
  function (args, content) {
    const [classes] = args;

    return (
      '<div class="timeline' +
      (classes ? ' ' + classes : '') +
      '">' +
      hexo.render.renderSync({ text: content, engine: 'markdown' }) +
      '</div>'
    );
  },
  { ends: true, async: false },
);
