function sidebar() {
  $('.sidebar ul').each(function () {
    // get current ul
    var $ul = $(this);
    // get array of list items in current ul
    var $liArr = $ul.children('li');

    // sort array of list items in current ul randomly
    $liArr
      .sort(function () {
        return 0.5 - Math.random();
      })
      // append list items to ul
      .appendTo($ul);
  });
}

// hack to wait until the DOM is really loaded

// Helper function
// const domReady = (cb) => {
//   document.readyState === 'interactive' || document.readyState === 'complete'
//     ? cb()
//     : document.addEventListener('DOMContentLoaded', cb);
// };

$(window).on('load', function () {
  // domReady(galleries);
  sidebar();
});
