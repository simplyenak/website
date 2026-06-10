// Chip-cloud random accent rotation
// Injects its own styles + rotates accent chips every 10s
(function () {
  // Inject chip-accent CSS if not already present
  if (!document.getElementById('chip-accent-style')) {
    var style = document.createElement('style');
    style.id = 'chip-accent-style';
    style.textContent =
      '.chip-accent {\n' +
      '  border-color: #ffa333 !important;\n' +
      '  color: #ffa333 !important;\n' +
      '}\n' +
      '.chip-accent:hover {\n' +
      '  background-color: #ffa333 !important;\n' +
      '  border-color: #ffa333 !important;\n' +
      '  color: #000000 !important;\n' +
      '}\n';
    document.head.appendChild(style);
  }

  var CHIPS_PER_ROUND = 5;
  var INTERVAL_MS = 10000;

  function activateRandom() {
    var cloud = document.getElementById('chip-cloud');
    if (!cloud) return;
    var chips = cloud.querySelectorAll('.chip');
    if (chips.length === 0) return;

    // Remove existing accent from all chips
    for (var i = 0; i < chips.length; i++) {
      chips[i].classList.remove('chip-accent');
    }

    // Build pool of indices and shuffle (Fisher-Yates)
    var pool = [];
    for (var i = 0; i < chips.length; i++) {
      pool.push(i);
    }
    for (var i = pool.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = pool[i];
      pool[i] = pool[j];
      pool[j] = tmp;
    }

    // Pick up to CHIPS_PER_ROUND random chips
    var count = Math.min(CHIPS_PER_ROUND, pool.length);
    for (var k = 0; k < count; k++) {
      chips[pool[k]].classList.add('chip-accent');
    }
  }

  // Wait for DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      setTimeout(activateRandom, 500);
    });
  } else {
    setTimeout(activateRandom, 500);
  }

  // Repeat every INTERVAL_MS
  setInterval(activateRandom, INTERVAL_MS);
})();
