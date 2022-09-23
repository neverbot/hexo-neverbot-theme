
;(function(){

  let textMessages = [ 'Master Chief Officer',
                       'Imaginaut',
                       'Mad Scientist',
                       'Software Artisan',
                       'I\'m (often) awesome',
                       'Game Designer',
                       'Indisciplinado, asocial y perezoso' ];
  let currentMessage = '';
  let currentMessageAction = 0; // 0 removing characters, 1 adding characters

  let init = function() {

    let random = Math.floor(Math.random() * textMessages.length);
    $('#text-animated').html(textMessages[ random ]);
    currentMessage = textMessages[ random ];

    window.setTimeout(typer, 3000);
  };

  let typer = function() {
    let showing = $('#text-animated').html();

    // removing characters
    if (currentMessageAction === 0)
    {
      if (showing.length <= 0)
      {
        random = Math.floor(Math.random()*textMessages.length);
        currentMessage = textMessages[ random ];
        currentMessageAction = 1;
        setTimeout(typer, 1000);
      }
      else
      {
        showing = showing.substring(0, showing.length - 1);
        $('#text-animated').html( showing );
        setTimeout(typer, 50 + Math.floor(Math.random() * 150));
      }
    }
    // adding characters
    else
    {
      if (showing.length < currentMessage.length)
      {
        showing = currentMessage.substring(0, showing.length + 1);
        $('#text-animated').html( showing );
        setTimeout(typer, 50 + Math.floor(Math.random() * 150));
      }
      else
      {
        currentMessageAction = 0;
        setTimeout(typer, 3000);
      }
    }
  };

  $(window).on('load', function() {

    init();

    $('.icon').on('click', function(event) {
      // ignore current panel
      if ($(this).hasClass('active') === true)
        return;

      let origin = $(this);

      // select the panel with the same data-key
      let panel = $('.panel').filter(function() {
        return $(this).data('key') == origin.data('key');
      });

      // if there is a destination panel
      if (panel.length > 0)
      {
        event.preventDefault();

        // hide active panel
        $('.panel.active').fadeOut(250, function() {
          // show the panel with the same data-key
          panel.fadeIn(250);          
        });

        $('.icon.active').removeClass('active');
        $('.panel.active').removeClass('active');
        panel.addClass('active');
        $(this).addClass('active');
      }
    });
  });

})();
