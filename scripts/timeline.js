hexo.extend.tag.register('year', function (args, content) {
  const [left, up, right, last] = args

  return '<div class="timeline-node">' +
          '<div class="timeline-version">' + up + '</div>' +
          '<div class="timeline-body">' +
            '<div class="timeline-time">' + left + '</div>' +
            (!last ? '<div class="timeline-line"></div>' : '') +
            '<div class="timeline-circle"></div>' +
            '<div class="timeline-title">' + hexo.render.renderSync({ text: right, engine: 'markdown' }) + '</div>' +
          '</div>' +
          '<div>' + hexo.render.renderSync({ text: content, engine: 'markdown' }) + '</div>' +
        '</div>'
}, { ends: true, async: false })

hexo.extend.tag.register('timeline', function (args, content) {
  return '<div class="timeline">' + hexo.render.renderSync({ text: content, engine: 'markdown' }) + '</div>'
}, { ends: true, async: false })
