(function(){
document.querySelectorAll('[data-player]').forEach(function(box){
var video=box.querySelector('video');
var overlay=box.querySelector('.play-overlay');
var src=box.getAttribute('data-stream');
var ready=false;
function attach(){
if(ready)return;
if(video.canPlayType('application/vnd.apple.mpegurl')){video.src=src;ready=true;return}
if(window.Hls&&window.Hls.isSupported()){var hls=new Hls({maxBufferLength:45});hls.loadSource(src);hls.attachMedia(video);ready=true;return}
video.src=src;ready=true;
}
function start(){attach();if(overlay)overlay.classList.add('hidden');video.controls=true;var p=video.play();if(p&&p.catch)p.catch(function(){})}
if(overlay)overlay.addEventListener('click',start);
video.addEventListener('click',function(){if(!ready)start()});
box.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();start()}});
box.tabIndex=0;
});
})();