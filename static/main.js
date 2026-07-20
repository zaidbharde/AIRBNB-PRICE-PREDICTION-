(function () {
  'use strict';

  /* ============================= THEME ============================= */
  var html = document.documentElement;
  var themeToggle = document.getElementById('themeToggle');
  var themeToggleMobile = document.getElementById('themeToggleMobile');
  var themeIcon = themeToggle && themeToggle.querySelector('i');
  var themeIconMobile = themeToggleMobile && themeToggleMobile.querySelector('i');

  function setTheme(theme) {
    html.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    var icon = theme === 'dark' ? 'fa-sun' : 'fa-moon';
    if (themeIcon) themeIcon.className = 'fas ' + icon;
    if (themeIconMobile) themeIconMobile.className = 'fas ' + icon;
    rebuildCharts();
  }

  function toggleTheme() {
    setTheme(html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
  }

  if (themeToggle) themeToggle.addEventListener('click', toggleTheme);
  if (themeToggleMobile) themeToggleMobile.addEventListener('click', toggleTheme);

  /* ============================= MOBILE MENU ============================= */
  var hamburger = document.getElementById('hamburger');
  var mobileMenu = document.getElementById('mobileMenu');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', function () {
      hamburger.classList.toggle('active');
      mobileMenu.classList.toggle('open');
    });
    mobileMenu.querySelectorAll('.mobile-link').forEach(function (link) {
      link.addEventListener('click', function () {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('open');
      });
    });
  }

  /* ============================= NAVBAR SCROLL ============================= */
  var navbar = document.getElementById('navbar');
  var navScrolled = false;
  window.addEventListener('scroll', function () {
    var s = window.scrollY > 50;
    if (s !== navScrolled) { navScrolled = s; if (navbar) navbar.classList.toggle('scrolled', s); }
  }, { passive: true });

  /* ============================= SCROLL TO TOP ============================= */
  var scrollBtn = document.getElementById('scrollTop');
  var stVis = false;
  window.addEventListener('scroll', function () {
    var v = window.scrollY > 400;
    if (v !== stVis) { stVis = v; if (scrollBtn) scrollBtn.classList.toggle('visible', v); }
  }, { passive: true });
  if (scrollBtn) scrollBtn.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });

  /* ============================= SMOOTH SCROLL ANCHORS ============================= */
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var target = document.querySelector(link.getAttribute('href'));
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
    });
  });

  /* ============================= LOADING OVERLAY ============================= */
  var form = document.getElementById('pf');
  var overlay = document.getElementById('loadingOverlay');
  var loadingBar = document.getElementById('loadingBarFill');
  var predBtn = document.getElementById('predBtn');
  var btTxt = predBtn && predBtn.querySelector('.bt-txt');
  var btLoad = predBtn && predBtn.querySelector('.bt-load');
  var loadText = document.getElementById('loadingText');
  var messages = [
    'AI is analyzing your property...',
    'Crunching market data...',
    'Comparing similar listings...',
    'Almost there...',
    'Finalizing estimate...'
  ];

  if (form && overlay) {
    form.addEventListener('submit', function () {
      overlay.classList.add('active');
      if (btTxt) btTxt.style.display = 'none';
      if (btLoad) btLoad.style.display = 'inline';
      var p = 0, mi = 0;
      var interval = setInterval(function () {
        p += 2 + Math.random() * 5;
        if (p >= 90) { p = 90; clearInterval(interval); }
        if (loadingBar) loadingBar.style.width = Math.min(p, 90) + '%';
        if (p > 20 && mi < messages.length - 1) {
          mi++;
          if (loadText) loadText.textContent = messages[mi];
        }
      }, 150);
    });
  }

  /* ============================= STAT COUNTERS ============================= */
  var counters = document.querySelectorAll('.s-num[data-t]');
  if (counters.length) {
    var counterObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          var target = parseInt(el.getAttribute('data-t'), 10);
          animateCounter(el, target);
          counterObs.unobserve(el);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(function (c) { counterObs.observe(c); });
  }

  function animateCounter(el, target) {
    var dur = 1500, start = performance.now();
    function tick(now) {
      var t = Math.min((now - start) / dur, 1);
      var ease = 1 - Math.pow(1 - t, 3);
      el.textContent = Math.floor(ease * target);
      if (t < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  /* ============================= RESULT DASHBOARD ============================= */
  var rAmt = document.getElementById('rAmt');
  if (rAmt) {
    var price = parseFloat(rAmt.textContent.replace(/[^0-9.]/g, '')) || 0;
    var element;

    element = document.getElementById('revNight');
    if (element) element.textContent = '$' + price.toFixed(2);
    element = document.getElementById('revMonth');
    if (element) element.textContent = '$' + (price * 30).toFixed(2);
    element = document.getElementById('revYear');
    if (element) element.textContent = '$' + (price * 365).toFixed(2);

    var gFill = document.getElementById('gFill');
    var gDot = document.getElementById('gDot');
    var maxP = 500;
    var pct = Math.min((price / maxP) * 100, 100);
    setTimeout(function () {
      if (gFill) gFill.style.width = pct + '%';
      if (gDot) gDot.style.left = 'calc(' + pct + '% - ' + (pct / 100 * 16) + 'px)';
    }, 300);

    var featObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var fill = entry.target;
          var w = parseInt(fill.getAttribute('data-w'), 10) || 0;
          fill.style.width = w + '%';
          featObs.unobserve(fill);
        }
      });
    }, { threshold: 0.3 });
    document.querySelectorAll('.feat-fill[data-w]').forEach(function (f) { featObs.observe(f); });

    saveToHistory(price);
  }

  /* ============================= PREDICTION HISTORY ============================= */
  function getHistory() {
    try { return JSON.parse(localStorage.getItem('predHist')) || []; } catch (e) { return []; }
  }

  function setHistory(h) {
    localStorage.setItem('predHist', JSON.stringify(h));
  }

  function saveToHistory(price) {
    var propType = document.getElementById('property_type');
    var city = document.getElementById('city');
    var h = getHistory();
    h.unshift({
      id: Date.now(),
      date: new Date().toLocaleString(),
      property: propType ? propType.value : 'N/A',
      location: city ? city.value : 'N/A',
      price: '$' + price.toFixed(2),
      confidence: '96%'
    });
    if (h.length > 50) h.length = 50;
    setHistory(h);
    renderHistory();
  }

  function renderHistory(filter) {
    var tbody = document.getElementById('histBody');
    if (!tbody) return;
    var h = getHistory();
    if (filter) {
      var f = filter.toLowerCase();
      h = h.filter(function (r) { return r.property.toLowerCase().indexOf(f) !== -1 || r.location.toLowerCase().indexOf(f) !== -1; });
    }
    if (!h.length) {
      tbody.innerHTML = '<tr><td colspan="6" class="hist-empty">' + (filter ? 'No matching records.' : 'No predictions yet. Use the form above to get started.') + '</td></tr>';
      return;
    }
    tbody.innerHTML = h.map(function (r) {
      return '<tr><td>' + r.date + '</td><td>' + r.property + '</td><td>' + r.location + '</td><td><strong>' + r.price + '</strong></td><td>' + r.confidence + '</td><td><button class="hist-del" data-id="' + r.id + '"><i class="fas fa-trash-can"></i></button></td></tr>';
    }).join('');
    tbody.querySelectorAll('.hist-del').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var hh = getHistory();
        hh = hh.filter(function (r) { return r.id !== parseInt(btn.getAttribute('data-id'), 10); });
        setHistory(hh);
        var searchEl = document.getElementById('histSearch');
        renderHistory(searchEl ? searchEl.value : '');
        showToast('Prediction removed');
      });
    });
  }

  var histSearch = document.getElementById('histSearch');
  if (histSearch) {
    histSearch.addEventListener('input', function () { renderHistory(histSearch.value); });
  }

  document.getElementById('exportBtn') && document.getElementById('exportBtn').addEventListener('click', function () {
    var h = getHistory();
    if (!h.length) { showToast('No history to export'); return; }
    var rows = [['Date', 'Property', 'Location', 'Price', 'Confidence']];
    h.forEach(function (r) { rows.push([r.date, r.property, r.location, r.price, r.confidence]); });
    var csv = rows.map(function (r) { return r.map(function (c) { return '"' + c + '"'; }).join(','); }).join('\n');
    var blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url; a.download = 'predictions.csv'; a.click();
    URL.revokeObjectURL(url);
    showToast('CSV exported');
  });

  document.getElementById('clearHistBtn') && document.getElementById('clearHistBtn').addEventListener('click', function () {
    if (!getHistory().length) { showToast('History is already empty'); return; }
    if (confirm('Clear all prediction history?')) {
      setHistory([]);
      renderHistory();
      showToast('History cleared');
    }
  });

  renderHistory();

  /* ============================= CHARTS ============================= */
  var chartInstances = [];

  function isDark() { return html.getAttribute('data-theme') === 'dark'; }

  function makeOpts(dark) {
    return {
      responsive: true, maintainAspectRatio: false,
      plugins: {
        legend: { labels: { color: dark ? '#94A3B8' : '#64748B', font: { size: 11 } } }
      },
      scales: {
        x: { ticks: { color: dark ? '#94A3B8' : '#64748B', font: { size: 10 } }, grid: { display: false } },
        y: { ticks: { color: dark ? '#94A3B8' : '#64748B', font: { size: 10 } }, grid: { color: dark ? 'rgba(45,51,69,0.3)' : 'rgba(0,0,0,0.05)' } }
      }
    };
  }

  function rebuildCharts() {
    chartInstances.forEach(function (c) { c.destroy(); });
    chartInstances = [];
    initCharts();
  }

  function initCharts() {
    if (typeof Chart === 'undefined') return;
    try {
      var dark = isDark();
      var opts = makeOpts(dark);
      var colors = ['#FF5A5F', '#006CE4', '#7C3AED', '#10B981', '#F59E0B'];
      var alphas = colors.map(function (c) { return c + '33'; });
      var ctx;

      ctx = document.getElementById('priceChart');
      if (ctx) {
        ctx = ctx.getContext('2d');
        chartInstances.push(new Chart(ctx, {
          type: 'bar',
          data: {
            labels: ['$0-50', '$50-100', '$100-150', '$150-200', '$200-300', '$300-500'],
            datasets: [{ label: 'Listings', data: [12, 28, 35, 18, 15, 7], backgroundColor: alphas[0], borderColor: colors[0], borderWidth: 2, borderRadius: 4 }]
          },
          options: opts
        }));
      }

      ctx = document.getElementById('locationChart');
      if (ctx) {
        ctx = ctx.getContext('2d');
        chartInstances.push(new Chart(ctx, {
          type: 'radar',
          data: {
            labels: ['NYC', 'LA', 'SF', 'Boston', 'Chicago', 'DC'],
            datasets: [
              { label: 'Avg Price', data: [220, 195, 250, 185, 170, 210], borderColor: colors[0], backgroundColor: alphas[0], fill: true, tension: 0.3 },
              { label: 'Demand', data: [95, 88, 92, 78, 82, 85], borderColor: colors[1], backgroundColor: alphas[1], fill: true, tension: 0.3 }
            ]
          },
          options: {
            responsive: true, maintainAspectRatio: false,
            scales: {
              r: {
                ticks: { backdropColor: 'transparent', color: dark ? '#94A3B8' : '#64748B' },
                grid: { color: dark ? 'rgba(45,51,69,0.3)' : 'rgba(0,0,0,0.05)' }
              }
            },
            plugins: opts.plugins
          }
        }));
      }

      ctx = document.getElementById('reviewChart');
      if (ctx) {
        ctx = ctx.getContext('2d');
        chartInstances.push(new Chart(ctx, {
          type: 'line',
          data: {
            labels: ['2.0', '2.5', '3.0', '3.5', '4.0', '4.5', '5.0'],
            datasets: [{ label: 'Avg Price', data: [60, 80, 105, 140, 180, 220, 250], borderColor: colors[2], backgroundColor: alphas[2], fill: true, tension: 0.4, pointBackgroundColor: colors[2] }]
          },
          options: opts
        }));
      }

      ctx = document.getElementById('propertyChart');
      if (ctx) {
        ctx = ctx.getContext('2d');
        chartInstances.push(new Chart(ctx, {
          type: 'doughnut',
          data: {
            labels: ['Apartment', 'House', 'Condo', 'B&B', 'Boat', 'Bungalow'],
            datasets: [{ data: [35, 25, 18, 10, 5, 7], backgroundColor: colors, borderWidth: 2, borderColor: dark ? '#1A1F2E' : '#FFFFFF' }]
          },
          options: {
            responsive: true, maintainAspectRatio: false,
            cutout: '65%',
            plugins: {
              legend: { labels: { color: dark ? '#94A3B8' : '#64748B', font: { size: 11 } }, position: 'bottom' }
            }
          }
        }));
      }
    } catch (e) { /* ponytail: chart init errors silently ignored */ }
  }

  initCharts();

  /* ============================= SHARE ============================= */
  document.getElementById('shareBtn') && document.getElementById('shareBtn').addEventListener('click', function () {
    var price = rAmt ? rAmt.textContent : 'N/A';
    var text = '🏠 My Airbnb is estimated at ' + price + ' per night!';
    if (navigator.share) { navigator.share({ title: 'Airbnb Price Estimate', text: text }).catch(function () {}); }
    else {
      navigator.clipboard.writeText(text).then(function () { showToast('Copied to clipboard!'); }).catch(function () { showToast('Share failed'); });
    }
  });

  /* ============================= FAV / SAVE ============================= */
  document.getElementById('favBtn') && document.getElementById('favBtn').addEventListener('click', function () {
    showToast('Prediction saved to history');
  });

  /* ============================= TOAST ============================= */
  function showToast(msg) {
    var el = document.getElementById('toast');
    var msgEl = document.getElementById('toastMsg');
    if (!el || !msgEl) return;
    msgEl.textContent = msg;
    el.classList.add('show');
    clearTimeout(el._toastTimer);
    el._toastTimer = setTimeout(function () { el.classList.remove('show'); }, 3000);
  }

  /* ============================= FORM RESET ============================= */
  document.getElementById('rstBtn') && document.getElementById('rstBtn').addEventListener('click', function () {
    if (form) form.reset();
  });

  window.showToast = showToast;
})();
