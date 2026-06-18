(function () {
    var menuButton = document.querySelector('[data-menu-toggle]');
    var mobileMenu = document.querySelector('[data-mobile-menu]');

    if (menuButton && mobileMenu) {
        menuButton.addEventListener('click', function () {
            mobileMenu.classList.toggle('is-open');
        });
    }

    var hero = document.querySelector('[data-hero]');

    if (hero) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
        var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
        var current = 0;

        function showSlide(index) {
            if (!slides.length) {
                return;
            }

            current = (index + slides.length) % slides.length;

            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('is-active', slideIndex === current);
            });

            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('is-active', dotIndex === current);
            });
        }

        dots.forEach(function (dot, dotIndex) {
            dot.addEventListener('click', function () {
                showSlide(dotIndex);
            });
        });

        setInterval(function () {
            showSlide(current + 1);
        }, 5200);
    }

    function normalize(value) {
        return String(value || '').trim().toLowerCase();
    }

    function bindSearch(input) {
        input.addEventListener('input', function () {
            var keyword = normalize(input.value);
            var area = input.closest('main') || document;
            var cards = area.querySelectorAll('.movie-card, .category-overview-card');

            cards.forEach(function (card) {
                var haystack = normalize(card.getAttribute('data-title') || card.textContent);
                card.classList.toggle('is-hidden', keyword && haystack.indexOf(keyword) === -1);
            });
        });
    }

    document.querySelectorAll('[data-card-search]').forEach(bindSearch);
})();
