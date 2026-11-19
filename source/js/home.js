(function () {
  'use strict';

  const textMessages = [
    'Master Chief Officer',
    'Imaginaut',
    'Mad Scientist',
    'Software Artisan',
    "I'm (often) awesome",
    'Game Designer',
    'Indisciplinado, asocial y perezoso',
    'World Builder',
  ];

  const textAnimated = document.getElementById('text-animated');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let currentMessage = '';
  let currentMessageAction = 0; // 0 removing, 1 adding

  function randomMessage() {
    return textMessages[Math.floor(Math.random() * textMessages.length)];
  }

  function randomDelay() {
    return 50 + Math.floor(Math.random() * 150);
  }

  function typer() {
    const showing = textAnimated.textContent;

    if (currentMessageAction === 0) {
      // removing characters
      if (showing.length <= 0) {
        currentMessage = randomMessage();
        currentMessageAction = 1;
        setTimeout(typer, 1000);
      } else {
        textAnimated.textContent = showing.substring(0, showing.length - 1);
        setTimeout(typer, randomDelay());
      }
    } else {
      // adding characters
      if (showing.length < currentMessage.length) {
        textAnimated.textContent = currentMessage.substring(0, showing.length + 1);
        setTimeout(typer, randomDelay());
      } else {
        currentMessageAction = 0;
        setTimeout(typer, 3000);
      }
    }
  }

  function fadeOut(el) {
    return new Promise(function (resolve) {
      let done = false;

      function finish() {
        if (done) return;
        done = true;
        el.removeEventListener('transitionend', finish);
        el.style.display = 'none';
        resolve();
      }

      if (reducedMotion.matches) {
        finish();
        return;
      }

      el.style.transition = 'opacity 250ms';
      el.style.opacity = '0';
      el.addEventListener('transitionend', finish);
      // transitionend never fires if the transition is cancelled or disabled
      setTimeout(finish, 400);
    });
  }

  function fadeIn(el) {
    if (reducedMotion.matches) {
      el.style.transition = '';
      el.style.opacity = '';
      el.style.display = '';
      return;
    }
    el.style.opacity = '0';
    el.style.display = '';
    // force reflow before transitioning
    void el.offsetHeight;
    el.style.transition = 'opacity 250ms';
    el.style.opacity = '1';
  }

  function initPanelNavigation() {
    const icons = document.querySelectorAll('.icon[data-key]');
    const panels = document.querySelectorAll('.panel');

    icons.forEach(function (icon) {
      icon.addEventListener('click', function (event) {
        if (icon.classList.contains('active')) return;

        const key = icon.dataset.key;
        const target = Array.from(panels).find(function (p) {
          return p.dataset.key === key;
        });

        if (!target) return;
        event.preventDefault();

        const activePanel = document.querySelector('.panel.active');
        const activeIcon = document.querySelector('.icon.active');

        if (activePanel) {
          fadeOut(activePanel).then(function () {
            activePanel.classList.remove('active');
            target.classList.add('active');
            fadeIn(target);
          });
        } else {
          target.classList.add('active');
          fadeIn(target);
        }

        if (activeIcon) activeIcon.classList.remove('active');
        icon.classList.add('active');
      });
    });
  }

  initPanelNavigation();

  if (textAnimated && !reducedMotion.matches) {
    currentMessage = textAnimated.textContent;
    setTimeout(typer, 3000);
  }
})();
