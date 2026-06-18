(function () {
  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  function normalize(value) {
    return String(value || "").trim().toLowerCase();
  }

  ready(function () {
    var menuButton = document.querySelector("[data-menu-toggle]");
    var mobilePanel = document.querySelector("[data-mobile-panel]");

    if (menuButton && mobilePanel) {
      menuButton.addEventListener("click", function () {
        mobilePanel.classList.toggle("open");
      });
    }

    document.querySelectorAll(".site-search-form").forEach(function (form) {
      form.addEventListener("submit", function (event) {
        var input = form.querySelector("input[name='q']");
        var value = input ? input.value.trim() : "";
        if (!value) {
          event.preventDefault();
          window.location.href = "./search.html";
        }
      });
    });

    setupHero();
    setupFilters();
    setupSearchPage();
  });

  function setupHero() {
    var hero = document.querySelector("[data-hero]");
    if (!hero) {
      return;
    }

    var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
    var prev = hero.querySelector("[data-hero-prev]");
    var next = hero.querySelector("[data-hero-next]");
    var index = 0;
    var timer = null;

    function show(nextIndex) {
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("active", slideIndex === index);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("active", dotIndex === index);
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
        timer = null;
      }
    }

    if (prev) {
      prev.addEventListener("click", function () {
        show(index - 1);
        start();
      });
    }

    if (next) {
      next.addEventListener("click", function () {
        show(index + 1);
        start();
      });
    }

    dots.forEach(function (dot) {
      dot.addEventListener("click", function () {
        show(Number(dot.getAttribute("data-hero-dot")) || 0);
        start();
      });
    });

    hero.addEventListener("mouseenter", stop);
    hero.addEventListener("mouseleave", start);
    start();
  }

  function setupFilters() {
    var filterRoot = document.querySelector("[data-filter-root]");
    if (!filterRoot) {
      return;
    }

    var input = filterRoot.querySelector("[data-filter-input]");
    var region = filterRoot.querySelector("[data-filter-region]");
    var type = filterRoot.querySelector("[data-filter-type]");
    var year = filterRoot.querySelector("[data-filter-year]");
    var cards = Array.prototype.slice.call(filterRoot.querySelectorAll("[data-movie-card]"));
    var count = filterRoot.querySelector("[data-filter-count]");

    function update() {
      var query = normalize(input && input.value);
      var selectedRegion = normalize(region && region.value);
      var selectedType = normalize(type && type.value);
      var selectedYear = normalize(year && year.value);
      var visible = 0;

      cards.forEach(function (card) {
        var text = normalize(card.getAttribute("data-search"));
        var cardRegion = normalize(card.getAttribute("data-region"));
        var cardType = normalize(card.getAttribute("data-type"));
        var cardYear = normalize(card.getAttribute("data-year"));
        var matched = true;

        if (query && text.indexOf(query) === -1) {
          matched = false;
        }
        if (selectedRegion && cardRegion !== selectedRegion) {
          matched = false;
        }
        if (selectedType && cardType !== selectedType) {
          matched = false;
        }
        if (selectedYear && cardYear !== selectedYear) {
          matched = false;
        }

        card.style.display = matched ? "" : "none";
        if (matched) {
          visible += 1;
        }
      });

      if (count) {
        count.textContent = "当前显示 " + visible + " 部影片";
      }
    }

    [input, region, type, year].forEach(function (element) {
      if (element) {
        element.addEventListener("input", update);
        element.addEventListener("change", update);
      }
    });

    update();
  }

  function setupSearchPage() {
    var root = document.querySelector("[data-search-page]");
    if (!root || !Array.isArray(window.SITE_MOVIES)) {
      return;
    }

    var params = new URLSearchParams(window.location.search);
    var q = params.get("q") || "";
    var input = root.querySelector("[data-search-input]");
    var region = root.querySelector("[data-search-region]");
    var type = root.querySelector("[data-search-type]");
    var year = root.querySelector("[data-search-year]");
    var results = root.querySelector("[data-search-results]");
    var count = root.querySelector("[data-search-count]");
    var empty = root.querySelector("[data-search-empty]");

    if (input) {
      input.value = q;
    }

    function render() {
      var query = normalize(input && input.value);
      var selectedRegion = normalize(region && region.value);
      var selectedType = normalize(type && type.value);
      var selectedYear = normalize(year && year.value);
      var matched = window.SITE_MOVIES.filter(function (movie) {
        var text = normalize(movie.title + " " + movie.region + " " + movie.type + " " + movie.genre + " " + movie.tags.join(" ") + " " + movie.year);
        if (query && text.indexOf(query) === -1) {
          return false;
        }
        if (selectedRegion && normalize(movie.region) !== selectedRegion) {
          return false;
        }
        if (selectedType && normalize(movie.type) !== selectedType) {
          return false;
        }
        if (selectedYear && normalize(movie.year) !== selectedYear) {
          return false;
        }
        return true;
      });

      if (count) {
        count.textContent = "找到 " + matched.length + " 部影片";
      }

      if (empty) {
        empty.classList.toggle("show", matched.length === 0);
      }

      if (results) {
        results.innerHTML = matched.slice(0, 240).map(movieCardTemplate).join("");
      }
    }

    [input, region, type, year].forEach(function (element) {
      if (element) {
        element.addEventListener("input", render);
        element.addEventListener("change", render);
      }
    });

    render();
  }

  function movieCardTemplate(movie) {
    var tags = movie.tags.slice(0, 4).map(function (tag) {
      return "<span>" + escapeHtml(tag) + "</span>";
    }).join("");

    return [
      "<article class=\"movie-card\">",
      "  <a class=\"poster-link\" href=\"" + escapeHtml(movie.url) + "\" aria-label=\"观看 " + escapeHtml(movie.title) + "\">",
      "    <img src=\"" + escapeHtml(movie.cover) + "\" alt=\"" + escapeHtml(movie.title) + "\" loading=\"lazy\">",
      "    <span class=\"poster-shade\"></span>",
      "    <span class=\"poster-meta\">" + escapeHtml(movie.year) + "</span>",
      "  </a>",
      "  <div class=\"card-body\">",
      "    <div class=\"card-kicker\"><span>" + escapeHtml(movie.region) + "</span><span>" + escapeHtml(movie.type) + "</span></div>",
      "    <h3><a href=\"" + escapeHtml(movie.url) + "\">" + escapeHtml(movie.title) + "</a></h3>",
      "    <p>" + escapeHtml(movie.oneLine) + "</p>",
      "    <div class=\"tag-row\">" + tags + "</div>",
      "  </div>",
      "</article>"
    ].join("\n");
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  window.initMoviePlayer = function (sourceUrl) {
    var video = document.getElementById("moviePlayer");
    var overlay = document.querySelector("[data-player-overlay]");
    var playButton = document.querySelector("[data-player-play]");
    var started = false;
    var hlsInstance = null;

    if (!video || !sourceUrl) {
      return;
    }

    function attachSource() {
      if (started) {
        return;
      }
      started = true;

      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = sourceUrl;
      } else if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new window.Hls({
          enableWorker: true,
          lowLatencyMode: false
        });
        hlsInstance.loadSource(sourceUrl);
        hlsInstance.attachMedia(video);
      } else {
        video.src = sourceUrl;
      }
    }

    function play() {
      attachSource();
      if (overlay) {
        overlay.classList.add("hidden");
      }
      video.controls = true;
      var playPromise = video.play();
      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(function () {
          if (overlay) {
            overlay.classList.remove("hidden");
          }
        });
      }
    }

    if (overlay) {
      overlay.addEventListener("click", play);
    }

    if (playButton) {
      playButton.addEventListener("click", function (event) {
        event.stopPropagation();
        play();
      });
    }

    video.addEventListener("click", function () {
      if (!started) {
        play();
      }
    });

    window.addEventListener("beforeunload", function () {
      if (hlsInstance) {
        hlsInstance.destroy();
      }
    });
  };
})();
