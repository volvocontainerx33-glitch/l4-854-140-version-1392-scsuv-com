(function () {
    window.MoviePlayer = {
        boot: function (source) {
            var video = document.getElementById("movie-player");
            var overlay = document.querySelector("[data-player-overlay]");
            var button = document.querySelector("[data-player-button]");
            var started = false;
            var hls = null;

            if (!video || !source) {
                return;
            }

            function attach() {
                if (started) {
                    return;
                }

                started = true;

                if (video.canPlayType("application/vnd.apple.mpegurl")) {
                    video.src = source;
                    return;
                }

                if (window.Hls && window.Hls.isSupported()) {
                    hls = new window.Hls({
                        enableWorker: true,
                        lowLatencyMode: true
                    });
                    hls.loadSource(source);
                    hls.attachMedia(video);
                    return;
                }

                video.src = source;
            }

            function reveal() {
                if (overlay) {
                    overlay.classList.add("is-hidden");
                }
            }

            function restore() {
                if (overlay) {
                    overlay.classList.remove("is-hidden");
                }
            }

            function play() {
                attach();
                reveal();
                var action = video.play();
                if (action && typeof action.catch === "function") {
                    action.catch(function () {
                        restore();
                    });
                }
            }

            if (overlay) {
                overlay.addEventListener("click", play);
            }

            if (button) {
                button.addEventListener("click", function (event) {
                    event.preventDefault();
                    event.stopPropagation();
                    play();
                });
            }

            video.addEventListener("click", function () {
                if (video.paused) {
                    play();
                }
            });

            window.addEventListener("pagehide", function () {
                if (hls && typeof hls.destroy === "function") {
                    hls.destroy();
                }
            });
        }
    };
})();
