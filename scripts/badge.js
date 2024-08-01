hexo.extend.tag.register(
  'badge',
  function (args) {
    const [color, content] = args;

    return '<span class="badge" style="background-color:' + color + '">' + content + '</span>';
  },
  { ends: false, async: false },
);
