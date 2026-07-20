/* =============================================
   main.js — Theme, Counters, Gauge, Toast, Scroll, Form
   ============================================= */

(function () {
    'use strict';

    var REDUCED = document.documentElement.classList.contains('reduce-motion');
    var html = document.documentElement;

    /* =============================================
       THEME TOGGLE
       ============================================= */
    var toggle = document.getElementById('themeToggle');
    var toggleMobile = document.getElementById('themeToggleMobile');

    function setIcon(btn, t) {
        if (!btn) return;
        var i = btn.querySelector('i');
        if (i) i.className = t === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }

    function switchTheme(t) {
        html.setAttribute('data-theme', t);
        localStorage.setItem('theme', t);
        setIcon(toggle, t);
        setIcon(toggleMobile, t);
    }

    var initial = html.getAttribute('data-theme');
    setIcon(toggle, initial);
    setIcon(toggleMobile, initial);

    function onToggleClick() {
        var current = html.getAttribute('data-theme');
        switchTheme(current === 'dark' ? 'light' : 'dark');
    }

    if (toggle) toggle.addEventListener('click', onToggleClick);
    if (toggleMobile) toggleMobile.addEventListener('click', onToggleClick);

    /* =============================================
       MOBILE MENU
       ============================================= */
    var hamburger = document.getElementById('hamburger');
    var mobileMenu = document.getElementById('mobileMenu');
    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', function () {
            this.classList.toggle('active');
            mobileMenu.classList.toggle('open');
        });
        mobileMenu.querySelectorAll('.mobile-link').forEach(function (link) {
            link.addEventListener('click', function () {
                hamburger.classList.remove('active');
                mobileMenu.classList.remove('open');
            });
        });
    }

    /* =============================================
       NAVBAR SCROLL
       ============================================= */
    var navbar = document.getElementById('navbar');
    if (navbar) {
        window.addEventListener('scroll', function () {
            navbar.classList.toggle('scrolled', window.scrollY > 20);
        }, { passive: true });
    }

    /* =============================================
       ANIMATED COUNTERS (Intersection Observer)
       ============================================= */
    var statNums = document.querySelectorAll('.stat-num');
    if (statNums.length > 0 && 'IntersectionObserver' in window) {
        var counted = false;

        var observer = new IntersectionObserver(function (entries) {
            if (entries[0].isIntersecting && !counted) {
                counted = true;
                statNums.forEach(function (el) {
                    var target = parseInt(el.getAttribute('data-target'), 10);
                    animateCounter(el, target);
                });
                observer.disconnect();
            }
        }, { threshold: 0.5 });

        observer.observe(document.querySelector('.stats-grid'));
    }

    function animateCounter(el, target) {
        if (REDUCED) { el.textContent = target; return; }

        var start = performance.now();
        var duration = 1500;

        function step(now) {
            var progress = Math.min((now - start) / duration, 1);
            var eased = 1 - Math.pow(1 - progress, 3);
            var current = Math.round(eased * target);
            el.textContent = current;
            if (progress < 1) requestAnimationFrame(step);
            else el.textContent = target;
        }
        requestAnimationFrame(step);
    }

    /* =============================================
       RESULT GAUGE ANIMATION
       ============================================= */
    function animateGauge() {
        var fill = document.getElementById('gaugeFill');
        var dot = document.getElementById('gaugeDot');
        var amount = document.getElementById('resultAmount');
        if (!fill || !amount) return;

        var val = parseFloat(amount.textContent.trim());
        if (isNaN(val) || val <= 0) return;

        var MAX = 500;
        var pct = Math.min(Math.max(val / MAX, 0), 1) * 100;

        if (REDUCED) {
            fill.style.width = pct + '%';
            if (dot) dot.style.left = pct + '%';
            return;
        }

        setTimeout(function () {
            fill.style.width = pct + '%';
            if (dot) dot.style.left = pct + '%';
        }, 400);

        // Animate price amount
        if (!REDUCED) {
            var targetVal = val;
            amount.textContent = '0.00';
            var startTime = null;
            var duration = 1400;

            function stepPrice(ts) {
                if (!startTime) startTime = ts;
                var progress = Math.min((ts - startTime) / duration, 1);
                var eased = 1 - Math.pow(1 - progress, 3);
                var current = eased * targetVal;
                amount.textContent = current.toFixed(2);
                if (progress < 1) requestAnimationFrame(stepPrice);
                else amount.textContent = targetVal.toFixed(2);
            }
            requestAnimationFrame(stepPrice);
        }
    }

    /* =============================================
       TOAST
       ============================================= */
    function showToast(msg, icon) {
        var toast = document.getElementById('toast');
        var msgEl = document.getElementById('toastMsg');
        if (!toast || !msgEl) return;
        var iconEl = toast.querySelector('i');
        if (iconEl && icon) iconEl.className = 'fas ' + icon;
        msgEl.textContent = msg || '';
        toast.classList.add('show');
        setTimeout(function () { toast.classList.remove('show'); }, 3000);
    }

    /* =============================================
       SCROLL TO TOP
       ============================================= */
    var scrollTop = document.getElementById('scrollTop');
    if (scrollTop) {
        window.addEventListener('scroll', function () {
            scrollTop.classList.toggle('visible', window.scrollY > 600);
        }, { passive: true });

        scrollTop.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    /* =============================================
       FORM RESET
       ============================================= */
    var resetBtn = document.getElementById('resetBtn');
    var form = document.getElementById('predictionForm');
    if (resetBtn && form) {
        resetBtn.addEventListener('click', function () {
            form.reset();
            showToast('Form has been reset', 'fa-rotate-left');
        });
    }

    /* =============================================
       FORM SUBMIT
       ============================================= */
    var predictBtn = document.getElementById('predictBtn');
    if (form) {
        // Set initial values for floating label selects
        form.querySelectorAll('select').forEach(function (sel) {
            if (sel.value) sel.setAttribute('data-has-value', 'true');
        });

        form.addEventListener('submit', function () {
            if (predictBtn) {
                predictBtn.querySelector('.btn-text').style.display = 'none';
                predictBtn.querySelector('.btn-loading').style.display = 'inline-flex';
                predictBtn.disabled = true;
            }
        });
    }

    /* =============================================
       SMOOTH SCROLL FOR NAV LINKS
       ============================================= */
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            var target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    /* =============================================
       INIT
       ============================================= */
    document.addEventListener('DOMContentLoaded', function () {
        // Show welcome toast
        setTimeout(function () { showToast('Ready to predict! Fill in the details below.', 'fa-wand-magic-sparkles'); }, 500);

        // Animate gauge if result exists
        animateGauge();
    });

})();
