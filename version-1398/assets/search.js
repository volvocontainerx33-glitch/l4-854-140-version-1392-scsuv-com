(function(){
var input=document.getElementById('global-search');
var button=document.getElementById('global-search-btn');
var results=document.getElementById('search-results');
var summary=document.getElementById('search-summary');
function esc(s){return String(s||'').replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function card(m){return '<article class="movie-card"><a class="card-link" href="'+esc(m.url)+'"><div class="poster-frame"><img src="'+esc(m.img)+'" alt="'+esc(m.title)+'" loading="lazy"><span class="year-badge">'+esc(m.year)+'</span><span class="type-badge">'+esc(m.type)+'</span></div><div class="card-body"><h3>'+esc(m.title)+'</h3><p>'+esc(m.line)+'</p><div class="card-meta"><span>'+esc(m.region)+'</span><span>'+esc(m.genre)+'</span></div><div class="tag-row"><span>'+esc(m.category)+'</span></div></div></a></article>'}
function render(){var q=(input.value||'').trim().toLowerCase();var list=(window.MOVIE_INDEX||[]).filter(function(m){if(!q)return true;return [m.title,m.year,m.region,m.type,m.genre,m.tags,m.line,m.category].join(' ').toLowerCase().indexOf(q)>-1}).slice(0,120);results.innerHTML=list.map(card).join('');summary.textContent=q?(list.length?'为你找到相关影片':'没有找到匹配影片'):'输入关键词开始查找影片'}
var params=new URLSearchParams(location.search);input.value=params.get('q')||'';button.addEventListener('click',render);input.addEventListener('input',render);input.addEventListener('keydown',function(e){if(e.key==='Enter'){e.preventDefault();render()}});render();
})();