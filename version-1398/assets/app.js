(function(){
var body=document.body;
var toggle=document.querySelector('.menu-toggle');
if(toggle){toggle.addEventListener('click',function(){body.classList.toggle('nav-open')})}
var hero=document.querySelector('[data-hero]');
if(hero){
var slides=[].slice.call(hero.querySelectorAll('.hero-slide'));
var dots=[].slice.call(hero.querySelectorAll('[data-hero-dot]'));
var index=0;
function show(i){index=(i+slides.length)%slides.length;slides.forEach(function(s,n){s.classList.toggle('is-active',n===index)});dots.forEach(function(d,n){d.classList.toggle('is-active',n===index)})}
dots.forEach(function(d,n){d.addEventListener('click',function(){show(n)})});
if(slides.length>1){setInterval(function(){show(index+1)},5200)}
}
document.querySelectorAll('[data-filter-panel]').forEach(function(panel){
var wrap=panel.parentElement;
var cards=[].slice.call(wrap.querySelectorAll('[data-card]'));
var search=panel.querySelector('[data-filter-search]');
var year=panel.querySelector('[data-filter-year]');
var region=panel.querySelector('[data-filter-region]');
var type=panel.querySelector('[data-filter-type]');
var reset=panel.querySelector('[data-filter-reset]');
var empty=wrap.querySelector('[data-no-results]');
function fill(select,attr){
var values=[];
cards.forEach(function(c){var v=c.getAttribute(attr)||'';if(v&&values.indexOf(v)<0)values.push(v)});
values.sort().reverse().forEach(function(v){var o=document.createElement('option');o.value=v;o.textContent=v;select.appendChild(o)})
}
fill(year,'data-year');fill(region,'data-region');fill(type,'data-type');
function apply(){
var q=(search.value||'').trim().toLowerCase();var y=year.value;var r=region.value;var t=type.value;var shown=0;
cards.forEach(function(c){var text=[c.getAttribute('data-title'),c.getAttribute('data-genre'),c.getAttribute('data-region'),c.getAttribute('data-type'),c.getAttribute('data-year')].join(' ').toLowerCase();var ok=(!q||text.indexOf(q)>-1)&&(!y||c.getAttribute('data-year')===y)&&(!r||c.getAttribute('data-region')===r)&&(!t||c.getAttribute('data-type')===t);c.classList.toggle('is-hidden',!ok);if(ok)shown++});
if(empty)empty.classList.toggle('show',shown===0)
}
[search,year,region,type].forEach(function(el){el.addEventListener(el.tagName==='INPUT'?'input':'change',apply)});
reset.addEventListener('click',function(){search.value='';year.value='';region.value='';type.value='';apply()});
})
})();