(function () {
    function ready(callback) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", callback);
        } else {
            callback();
        }
    }

    function normalize(value) {
        return String(value || "").toLowerCase().trim();
    }

    function initMenu() {
        var button = document.querySelector("[data-menu-button]");
        var nav = document.querySelector("[data-mobile-nav]");
        if (!button || !nav) {
            return;
        }
        button.addEventListener("click", function () {
            nav.classList.toggle("is-open");
        });
    }

    function initFilters() {
        var area = document.querySelector("[data-filter-area]");
        var list = document.querySelector("[data-card-list]");
        if (!area || !list) {
            return;
        }
        var input = area.querySelector("[data-filter-input]");
        var region = area.querySelector("[data-region-filter]");
        var type = area.querySelector("[data-type-filter]");
        var year = area.querySelector("[data-year-filter]");
        var cards = Array.prototype.slice.call(list.querySelectorAll(".movie-card"));
        var params = new URLSearchParams(window.location.search);
        var q = params.get("q");
        if (q && input) {
            input.value = q;
        }
        function apply() {
            var query = normalize(input && input.value);
            var regionValue = normalize(region && region.value);
            var typeValue = normalize(type && type.value);
            var yearValue = normalize(year && year.value);
            cards.forEach(function (card) {
                var haystack = normalize([
                    card.dataset.title,
                    card.dataset.region,
                    card.dataset.type,
                    card.dataset.year,
                    card.dataset.genre,
                    card.textContent
                ].join(" "));
                var pass = true;
                if (query && haystack.indexOf(query) === -1) {
                    pass = false;
                }
                if (regionValue && normalize(card.dataset.region) !== regionValue) {
                    pass = false;
                }
                if (typeValue && normalize(card.dataset.type) !== typeValue) {
                    pass = false;
                }
                if (yearValue && normalize(card.dataset.year) !== yearValue) {
                    pass = false;
                }
                card.classList.toggle("is-filter-hidden", !pass);
            });
        }
        [input, region, type, year].forEach(function (control) {
            if (control) {
                control.addEventListener("input", apply);
                control.addEventListener("change", apply);
            }
        });
        apply();
    }

    function initPlayer() {
        var shell = document.querySelector(".video-shell[data-video]");
        if (!shell) {
            return;
        }
        var video = shell.querySelector("video");
        var overlay = shell.querySelector(".player-overlay");
        var url = shell.getAttribute("data-video");
        var hls = null;
        function hideOverlay() {
            if (overlay) {
                overlay.classList.add("is-hidden");
            }
        }
        function playVideo() {
            if (!video || !url) {
                return;
            }
            hideOverlay();
            video.controls = true;
            if (!shell.dataset.ready) {
                if (video.canPlayType("application/vnd.apple.mpegurl")) {
                    video.src = url;
                } else if (window.Hls && window.Hls.isSupported()) {
                    hls = new window.Hls({
                        enableWorker: true,
                        lowLatencyMode: true
                    });
                    hls.loadSource(url);
                    hls.attachMedia(video);
                    hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
                        var parsedPlay = video.play();
                        if (parsedPlay && parsedPlay.catch) {
                            parsedPlay.catch(function () {});
                        }
                    });
                } else {
                    video.src = url;
                }
                shell.dataset.ready = "1";
            }
            var attempt = video.play();
            if (attempt && attempt.catch) {
                attempt.catch(function () {});
            }
        }
        if (overlay) {
            overlay.addEventListener("click", playVideo);
        }
        video.addEventListener("click", function () {
            if (video.paused) {
                playVideo();
            }
        });
        window.addEventListener("pagehide", function () {
            if (hls) {
                hls.destroy();
            }
        });
    }

    ready(function () {
        initMenu();
        initFilters();
        initPlayer();
    });
})();
