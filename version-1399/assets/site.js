(function () {
  const menuButton = document.querySelector("[data-menu-button]");
  const mobilePanel = document.querySelector("[data-mobile-panel]");

  if (menuButton && mobilePanel) {
    menuButton.addEventListener("click", function () {
      mobilePanel.classList.toggle("is-open");
    });
  }

  const slider = document.querySelector("[data-hero-slider]");
  if (slider) {
    const slides = Array.from(slider.querySelectorAll(".hero-slide"));
    const dots = Array.from(document.querySelectorAll(".hero-dot"));
    const prev = document.querySelector("[data-hero-prev]");
    const next = document.querySelector("[data-hero-next]");
    let active = 0;

    function showSlide(index) {
      active = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("is-active", slideIndex === active);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("is-active", dotIndex === active);
      });
    }

    dots.forEach(function (dot, index) {
      dot.addEventListener("click", function () {
        showSlide(index);
      });
    });

    if (prev) {
      prev.addEventListener("click", function () {
        showSlide(active - 1);
      });
    }

    if (next) {
      next.addEventListener("click", function () {
        showSlide(active + 1);
      });
    }

    if (slides.length > 1) {
      window.setInterval(function () {
        showSlide(active + 1);
      }, 5200);
    }
  }

  const searchInput = document.querySelector("[data-search-input]");
  const typeFilter = document.querySelector("[data-type-filter]");
  const grid = document.querySelector("[data-searchable-grid]");
  const noResult = document.querySelector("[data-no-result]");

  if (searchInput && grid) {
    const params = new URLSearchParams(window.location.search);
    const query = params.get("q");
    if (query) {
      searchInput.value = query;
    }

    const cards = Array.from(grid.querySelectorAll("[data-movie-card]"));

    function applyFilter() {
      const text = searchInput.value.trim().toLowerCase();
      const typeValue = typeFilter ? typeFilter.value : "";
      let visibleCount = 0;

      cards.forEach(function (card) {
        const haystack = (card.getAttribute("data-search") || "").toLowerCase();
        const typeMatch = !typeValue || haystack.indexOf(typeValue.toLowerCase()) !== -1;
        const textMatch = !text || haystack.indexOf(text) !== -1;
        const visible = typeMatch && textMatch;
        card.style.display = visible ? "" : "none";
        if (visible) {
          visibleCount += 1;
        }
      });

      if (noResult) {
        noResult.style.display = visibleCount ? "none" : "block";
      }
    }

    searchInput.addEventListener("input", applyFilter);
    if (typeFilter) {
      typeFilter.addEventListener("change", applyFilter);
    }
    applyFilter();
  }
})();
