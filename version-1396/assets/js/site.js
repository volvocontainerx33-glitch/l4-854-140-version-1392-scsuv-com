(function () {
    var mobileButton = document.querySelector(".mobile-toggle");
    var mobileNav = document.getElementById("mobileNav");

    if (mobileButton && mobileNav) {
        mobileButton.addEventListener("click", function () {
            var open = mobileNav.classList.toggle("is-open");
            mobileButton.setAttribute("aria-expanded", open ? "true" : "false");
        });
    }

    var hero = document.querySelector("[data-hero-slider]");
    if (hero) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll(".hero-slide"));
        var dots = Array.prototype.slice.call(document.querySelectorAll("[data-hero-dot]"));
        var prev = document.querySelector("[data-hero-prev]");
        var next = document.querySelector("[data-hero-next]");
        var index = 0;
        var timer = null;

        function showSlide(nextIndex) {
            if (!slides.length) {
                return;
            }
            index = (nextIndex + slides.length) % slides.length;
            slides.forEach(function (slide, i) {
                slide.classList.toggle("is-active", i === index);
            });
            dots.forEach(function (dot, i) {
                dot.classList.toggle("is-active", i === index);
            });
        }

        function startTimer() {
            if (timer) {
                window.clearInterval(timer);
            }
            timer = window.setInterval(function () {
                showSlide(index + 1);
            }, 5200);
        }

        if (prev) {
            prev.addEventListener("click", function () {
                showSlide(index - 1);
                startTimer();
            });
        }

        if (next) {
            next.addEventListener("click", function () {
                showSlide(index + 1);
                startTimer();
            });
        }

        dots.forEach(function (dot, i) {
            dot.addEventListener("click", function () {
                showSlide(i);
                startTimer();
            });
        });

        showSlide(0);
        startTimer();
    }

    var grid = document.querySelector("[data-filter-grid]");
    if (grid) {
        var cards = Array.prototype.slice.call(grid.querySelectorAll("[data-movie-card]"));
        var input = document.getElementById("movieFilter");
        var region = document.getElementById("regionFilter");
        var type = document.getElementById("typeFilter");
        var sort = document.getElementById("sortFilter");
        var empty = document.querySelector("[data-empty-state]");
        var params = new URLSearchParams(window.location.search);
        var initialQuery = params.get("q");

        if (input && initialQuery) {
            input.value = initialQuery;
        }

        function normalize(value) {
            return String(value || "").trim().toLowerCase();
        }

        function getText(card) {
            return normalize([
                card.dataset.title,
                card.dataset.region,
                card.dataset.type,
                card.dataset.genre,
                card.dataset.tags,
                card.textContent
            ].join(" "));
        }

        function applyFilters() {
            var query = normalize(input ? input.value : "");
            var regionValue = region ? region.value : "";
            var typeValue = type ? type.value : "";
            var visible = 0;
            var sorted = cards.slice();

            if (sort && sort.value !== "default") {
                sorted.sort(function (a, b) {
                    if (sort.value === "rating") {
                        return Number(b.dataset.rating || 0) - Number(a.dataset.rating || 0);
                    }
                    if (sort.value === "year") {
                        return Number(b.dataset.year || 0) - Number(a.dataset.year || 0);
                    }
                    if (sort.value === "views") {
                        return Number(b.dataset.views || 0) - Number(a.dataset.views || 0);
                    }
                    return 0;
                });
                sorted.forEach(function (card) {
                    grid.appendChild(card);
                });
            }

            sorted.forEach(function (card) {
                var matchQuery = !query || getText(card).indexOf(query) !== -1;
                var matchRegion = !regionValue || card.dataset.region === regionValue;
                var matchType = !typeValue || card.dataset.type === typeValue;
                var show = matchQuery && matchRegion && matchType;
                card.style.display = show ? "" : "none";
                if (show) {
                    visible += 1;
                }
            });

            if (empty) {
                empty.classList.toggle("is-visible", visible === 0);
            }
        }

        [input, region, type, sort].forEach(function (control) {
            if (control) {
                control.addEventListener("input", applyFilters);
                control.addEventListener("change", applyFilters);
            }
        });

        applyFilters();
    }
})();
