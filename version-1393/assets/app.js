(function() {
  var toggle = document.querySelector('[data-menu-toggle]');
  var mobileMenu = document.querySelector('[data-mobile-menu]');
  if (toggle && mobileMenu) {
    toggle.addEventListener('click', function() {
      mobileMenu.classList.toggle('open');
    });
  }

  var searchInput = document.getElementById('movieSearch');
  var clearSearch = document.getElementById('clearSearch');
  var movieGrid = document.getElementById('movieGrid');
  var notice = document.getElementById('searchNotice');
  var chips = Array.prototype.slice.call(document.querySelectorAll('[data-filter]'));
  var activeFilter = '';

  function normalize(value) {
    return String(value || '').toLowerCase().replace(/\s+/g, '');
  }

  function applySearch() {
    if (!movieGrid) {
      return;
    }
    var keyword = normalize(searchInput ? searchInput.value : '');
    var cards = Array.prototype.slice.call(movieGrid.querySelectorAll('.movie-card'));
    var visible = 0;
    cards.forEach(function(card) {
      var haystack = normalize([
        card.getAttribute('data-title'),
        card.getAttribute('data-category'),
        card.getAttribute('data-region'),
        card.getAttribute('data-genre'),
        card.getAttribute('data-year'),
        card.textContent
      ].join(' '));
      var category = card.getAttribute('data-category') || '';
      var matchKeyword = !keyword || haystack.indexOf(keyword) !== -1;
      var matchFilter = !activeFilter || category === activeFilter;
      var show = matchKeyword && matchFilter;
      card.style.display = show ? '' : 'none';
      if (show) {
        visible += 1;
      }
    });
    if (notice) {
      notice.hidden = visible !== 0;
    }
  }

  if (searchInput) {
    searchInput.addEventListener('input', applySearch);
  }

  if (clearSearch) {
    clearSearch.addEventListener('click', function() {
      if (searchInput) {
        searchInput.value = '';
      }
      activeFilter = '';
      chips.forEach(function(chip) {
        chip.classList.toggle('active', chip.getAttribute('data-filter') === '');
      });
      applySearch();
    });
  }

  chips.forEach(function(chip) {
    chip.addEventListener('click', function() {
      activeFilter = chip.getAttribute('data-filter') || '';
      chips.forEach(function(item) {
        item.classList.toggle('active', item === chip);
      });
      applySearch();
    });
  });
}());
