
(function () {
  var menuToggle = document.querySelector('[data-menu-toggle]');
  var mobilePanel = document.querySelector('[data-mobile-panel]');

  if (menuToggle && mobilePanel) {
    menuToggle.addEventListener('click', function () {
      mobilePanel.classList.toggle('open');
    });
  }

  document.querySelectorAll('[data-search-form]').forEach(function (form) {
    form.addEventListener('submit', function (event) {
      var input = form.querySelector('input[name="q"]');
      var value = input ? input.value.trim() : '';
      if (!value) {
        event.preventDefault();
        if (input) {
          input.focus();
        }
        return;
      }
      event.preventDefault();
      window.location.href = './search.html?q=' + encodeURIComponent(value);
    });
  });

  document.querySelectorAll('[data-hero-carousel]').forEach(function (carousel) {
    var slides = Array.prototype.slice.call(carousel.querySelectorAll('[data-slide]'));
    var dots = Array.prototype.slice.call(carousel.querySelectorAll('[data-slide-dot]'));
    var prev = carousel.querySelector('[data-slide-prev]');
    var next = carousel.querySelector('[data-slide-next]');
    var index = 0;
    var timer = null;

    function show(nextIndex) {
      if (!slides.length) {
        return;
      }
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('active', i === index);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('active', i === index);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5200);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
      }
    }

    if (prev) {
      prev.addEventListener('click', function () {
        show(index - 1);
        start();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        show(index + 1);
        start();
      });
    }

    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        show(i);
        start();
      });
    });

    carousel.addEventListener('mouseenter', stop);
    carousel.addEventListener('mouseleave', start);
    show(0);
    start();
  });

  var urlParams = new URLSearchParams(window.location.search);
  var query = urlParams.get('q') || '';

  document.querySelectorAll('.js-filter-input').forEach(function (input) {
    var section = input.closest('.content-section') || document;
    var list = section.querySelector('[data-card-list]') || document;
    var cards = Array.prototype.slice.call(list.querySelectorAll('.movie-card'));
    var emptyState = section.querySelector('[data-empty-state]');
    var chips = Array.prototype.slice.call(section.querySelectorAll('[data-filter-value]'));
    var activeType = 'all';

    if (query && input.classList.contains('js-query-input')) {
      input.value = query;
    }

    function normalize(value) {
      return String(value || '').toLowerCase().replace(/\s+/g, ' ').trim();
    }

    function run() {
      var terms = normalize(input.value).split(' ').filter(Boolean);
      var visible = 0;

      cards.forEach(function (card) {
        var text = normalize(card.getAttribute('data-keywords'));
        var type = card.getAttribute('data-type') || '';
        var matchesText = terms.every(function (term) {
          return text.indexOf(term) !== -1;
        });
        var matchesType = activeType === 'all' || type === activeType;
        var show = matchesText && matchesType;
        card.classList.toggle('hidden-by-filter', !show);
        if (show) {
          visible += 1;
        }
      });

      if (emptyState) {
        emptyState.classList.toggle('show', visible === 0);
      }
    }

    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        activeType = chip.getAttribute('data-filter-value') || 'all';
        chips.forEach(function (item) {
          item.classList.toggle('active', item === chip);
        });
        run();
      });
    });

    input.addEventListener('input', run);
    run();
  });
})();
