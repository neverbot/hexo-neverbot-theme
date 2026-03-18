(function () {
  'use strict';

  function shuffleChildren(ul) {
    const items = Array.from(ul.children);

    // Fisher-Yates shuffle
    for (let i = items.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      ul.appendChild(items[j]);
      items[j] = items[i];
    }
  }

  window.addEventListener('load', function () {
    document.querySelectorAll('.sidebar ul').forEach(shuffleChildren);
  });
})();
