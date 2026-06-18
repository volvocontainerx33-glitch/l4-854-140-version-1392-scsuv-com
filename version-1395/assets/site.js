
(function () {
  function ready(callback) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback);
    } else {
      callback();
    }
  }

  function normalize(value) {
    return (value || '').toString().trim().toLowerCase();
  }

  function initNavigation() {
    var toggle = document.querySelector('[data-nav-toggle]');
    var nav = document.querySelector('[data-main-nav]');

    if (!toggle || !nav) {
      return;
    }

    toggle.addEventListener('click', function () {
      nav.classList.toggle('is-open');
    });
  }

  function initHeaderSearch() {
    document.querySelectorAll('[data-search-form]').forEach(function (form) {
      form.addEventListener('submit', function (event) {
        event.preventDefault();
        var input = form.querySelector('input[name="search"]');
        var action = form.getAttribute('data-search-action') || 'movies.html';
        var query = input ? input.value.trim() : '';
        var url = action;

        if (query) {
          url += (url.indexOf('?') === -1 ? '?' : '&') + 'search=' + encodeURIComponent(query);
        }

        window.location.href = url;
      });
    });
  }

  function initHeroCarousel() {
    var carousel = document.querySelector('[data-hero-carousel]');

    if (!carousel) {
      return;
    }

    var slides = Array.prototype.slice.call(carousel.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(carousel.querySelectorAll('[data-hero-dot]'));
    var index = 0;
    var timer = null;

    function showSlide(nextIndex) {
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === index);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === index);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        showSlide(index + 1);
      }, 5200);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        showSlide(Number(dot.getAttribute('data-hero-dot')) || 0);
        start();
      });
    });

    carousel.addEventListener('mouseenter', stop);
    carousel.addEventListener('mouseleave', start);
    showSlide(0);
    start();
  }

  function initFilters() {
    var grid = document.querySelector('[data-filter-grid]');

    if (!grid) {
      return;
    }

    var cards = Array.prototype.slice.call(grid.querySelectorAll('[data-movie-card]'));
    var searchInput = document.querySelector('[data-filter-search]');
    var selects = Array.prototype.slice.call(document.querySelectorAll('[data-filter-select]'));
    var sortSelect = document.querySelector('[data-sort-select]');
    var clearButton = document.querySelector('[data-clear-filters]');
    var resultCount = document.querySelector('[data-result-count]');
    var params = new URLSearchParams(window.location.search);

    function applyParams() {
      if (searchInput && params.get('search')) {
        searchInput.value = params.get('search');
      }

      selects.forEach(function (select) {
        var key = select.getAttribute('data-filter-select');
        var value = params.get(key);

        if (value) {
          var match = Array.prototype.slice.call(select.options).some(function (option) {
            return option.value === value;
          });

          if (match) {
            select.value = value;
          }
        }
      });
    }

    function sortCards(visibleCards) {
      var sortValue = sortSelect ? sortSelect.value : 'default';
      var sorted = visibleCards.slice();

      sorted.sort(function (a, b) {
        if (sortValue === 'rating') {
          return Number(b.dataset.rating) - Number(a.dataset.rating);
        }
        if (sortValue === 'views') {
          return Number(b.dataset.views) - Number(a.dataset.views);
        }
        if (sortValue === 'year') {
          return normalize(b.dataset.year).localeCompare(normalize(a.dataset.year), 'zh-Hans-CN');
        }
        return Number(a.dataset.index) - Number(b.dataset.index);
      });

      sorted.forEach(function (card) {
        grid.appendChild(card);
      });
    }

    function runFilter() {
      var keyword = normalize(searchInput ? searchInput.value : '');
      var activeFilters = {};

      selects.forEach(function (select) {
        var key = select.getAttribute('data-filter-select');
        activeFilters[key] = normalize(select.value);
      });

      var visibleCards = [];

      cards.forEach(function (card) {
        var haystack = normalize([
          card.dataset.title,
          card.dataset.region,
          card.dataset.type,
          card.dataset.year,
          card.dataset.genre,
          card.dataset.tags
        ].join(' '));
        var matchesKeyword = !keyword || haystack.indexOf(keyword) !== -1;
        var matchesFilters = Object.keys(activeFilters).every(function (key) {
          var value = activeFilters[key];
          if (!value) {
            return true;
          }
          return normalize(card.dataset[key]).indexOf(value) !== -1;
        });
        var visible = matchesKeyword && matchesFilters;

        card.style.display = visible ? '' : 'none';

        if (visible) {
          visibleCards.push(card);
        }
      });

      sortCards(visibleCards);

      if (resultCount) {
        resultCount.textContent = visibleCards.length.toString();
      }
    }

    applyParams();

    if (searchInput) {
      searchInput.addEventListener('input', runFilter);
    }

    selects.forEach(function (select) {
      select.addEventListener('change', runFilter);
    });

    if (sortSelect) {
      sortSelect.addEventListener('change', runFilter);
    }

    if (clearButton) {
      clearButton.addEventListener('click', function () {
        if (searchInput) {
          searchInput.value = '';
        }
        selects.forEach(function (select) {
          select.value = '';
        });
        if (sortSelect) {
          sortSelect.value = 'default';
        }
        runFilter();
      });
    }

    runFilter();
  }

  function initPlayer() {
    var video = document.querySelector('.movie-player[data-src]');
    var startButton = document.querySelector('[data-player-start]');
    var status = document.querySelector('[data-player-status]');

    if (!video || !startButton) {
      return;
    }

    var initialized = false;

    function setStatus(message) {
      if (status) {
        status.textContent = message;
      }
    }

    function playVideo() {
      var playPromise = video.play();

      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(function () {
          setStatus('浏览器阻止了自动播放，请再次点击播放器播放。');
        });
      }
    }

    function loadSource() {
      var source = video.getAttribute('data-src');

      if (!source) {
        setStatus('未找到播放源。');
        return;
      }

      if (initialized) {
        startButton.classList.add('is-hidden');
        playVideo();
        return;
      }

      initialized = true;
      setStatus('正在初始化 HLS 播放源...');

      if (window.Hls && window.Hls.isSupported()) {
        var hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: false,
          backBufferLength: 90
        });

        hls.loadSource(source);
        hls.attachMedia(video);
        hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
          startButton.classList.add('is-hidden');
          setStatus('播放源加载完成，正在播放。');
          playVideo();
        });
        hls.on(window.Hls.Events.ERROR, function (event, data) {
          if (data && data.fatal) {
            setStatus('播放源加载遇到问题，请刷新页面或稍后再试。');
          }
        });
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = source;
        startButton.classList.add('is-hidden');
        setStatus('浏览器原生支持 HLS，正在播放。');
        playVideo();
      } else {
        video.src = source;
        startButton.classList.add('is-hidden');
        setStatus('已尝试直接加载 m3u8 播放源。');
        playVideo();
      }
    }

    startButton.addEventListener('click', loadSource);
    video.addEventListener('play', function () {
      startButton.classList.add('is-hidden');
    });
    video.addEventListener('pause', function () {
      if (!video.ended && video.currentTime === 0) {
        startButton.classList.remove('is-hidden');
      }
    });
  }

  ready(function () {
    initNavigation();
    initHeaderSearch();
    initHeroCarousel();
    initFilters();
    initPlayer();
  });
})();
