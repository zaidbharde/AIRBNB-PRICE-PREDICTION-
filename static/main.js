/* =============================================
   main.js — Gauge, Form Reader, Animations
   ============================================= */

(function () {
    'use strict';

    var MAX_PRICE = 500;
    var reducedMotion = document.documentElement.classList.contains('reduce-motion');

    /* ---- Helpers ---- */
    function $(sel, ctx) { return (ctx || document).querySelector(sel); }
    function $$(sel, ctx) { return Array.from((ctx || document).querySelectorAll(sel)); }

    /* ---- Gauge ---- */
    var gaugeFill = $('#gaugeFill');
    var gaugeNeedle = $('#gaugeNeedle');

    function setGauge(price) {
        var pct = Math.min(Math.max(price / MAX_PRICE, 0), 1) * 100;
        if (reducedMotion) {
            gaugeFill.style.transition = 'none';
            gaugeNeedle.style.transition = 'none';
        }
        gaugeFill.style.width = pct + '%';
        gaugeNeedle.style.left = pct + '%';
        gaugeNeedle.classList.add('active');
    }

    /* ---- Price Tag ---- */
    function getPriceTag(price) {
        if (price < 80) return { text: 'Budget', cls: 'tag-budget', icon: 'fa-tag' };
        if (price < 180) return { text: 'Moderate', cls: 'tag-moderate', icon: 'fa-minus' };
        if (price < 320) return { text: 'Premium', cls: 'tag-premium', icon: 'fa-arrow-up' };
        return { text: 'Luxury', cls: 'tag-luxury', icon: 'fa-gem' };
    }

    function applyPriceTag(price) {
        var tag = getPriceTag(price);
        var el = $('#priceTag');
        if (!el) return;
        el.className = 'price-tag ' + tag.cls;
        el.innerHTML = '<i class="fas ' + tag.icon + '"></i> ' + tag.text;
    }

    /* ---- Animate Price Counter ---- */
    function animatePrice(target) {
        var el = $('#priceAmount');
        var mobileEl = $('#mobilePrice');
        if (!el) return;

        var display = $('#priceDisplay');
        var placeholder = $('#panelPlaceholder');
        if (display) display.style.display = '';
        if (placeholder) placeholder.style.display = 'none';

        if (reducedMotion) {
            el.textContent = target.toFixed(2);
            if (mobileEl) mobileEl.textContent = '$' + target.toFixed(2);
            setGauge(target);
            applyPriceTag(target);
            return;
        }

        var start = performance.now();
        var duration = 1200;

        function step(now) {
            var progress = Math.min((now - start) / duration, 1);
            var eased = 1 - Math.pow(1 - progress, 3);
            var current = eased * target;
            el.textContent = current.toFixed(2);
            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                el.textContent = target.toFixed(2);
            }
        }

        setGauge(target);
        applyPriceTag(target);
        requestAnimationFrame(step);

        if (mobileEl) {
            mobileEl.textContent = '$' + target.toFixed(2);
        }
    }

    /* ---- Live Factors ---- */
    var fieldMap = {
        city: { icon: 'fa-location-dot', label: 'City' },
        property_type: { icon: 'fa-building', label: 'Type' },
        room_type: { icon: 'fa-door-open', label: 'Room' },
        bedrooms: { icon: 'fa-door-closed', label: 'Beds' },
        beds: { icon: 'fa-bed', label: 'Bed Count' },
        bathrooms: { icon: 'fa-bath', label: 'Baths' },
        accommodates: { icon: 'fa-users', label: 'Sleeps' },
        instant_bookable: { icon: 'fa-bolt', label: 'Instant' },
        cancellation_policy: { icon: 'fa-rotate-left', label: 'Cancel' }
    };

    var boolLabels = { t: 'Yes', f: 'No', True: 'Yes', False: 'No' };

    function readFactors() {
        var factors = [];
        var keys = Object.keys(fieldMap);
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            var el = document.getElementById(key);
            if (!el) continue;
            var val = el.value;
            if (!val || val === '0' || val === '0.0') continue;
            var cfg = fieldMap[key];
            var display = boolLabels[val] || val;
            factors.push(
                '<li class="factor-item">' +
                '<span><i class="fas ' + cfg.icon + '"></i> <span class="factor-name">' + cfg.label + '</span></span>' +
                '<span class="factor-val">' + display + '</span>' +
                '</li>'
            );
        }
        var list = $('#factorsList');
        if (!list) return;
        if (factors.length === 0) {
            list.innerHTML = '<li class="factor-empty">Enter details to see factors</li>';
        } else {
            list.innerHTML = factors.join('');
        }
    }

    /* ---- Bind Form Changes ---- */
    function bindForm() {
        var form = $('#predictionForm');
        if (!form) return;
        var inputs = form.querySelectorAll('select, input[type="number"]');
        for (var i = 0; i < inputs.length; i++) {
            inputs[i].addEventListener('input', readFactors);
            inputs[i].addEventListener('change', readFactors);
        }
        readFactors();
    }

    /* ---- Button Loading State ---- */
    function bindSubmit() {
        var form = $('#predictionForm');
        var btn = $('#predictBtn');
        var mobileBtn = $('#mobilePredictBtn');
        if (!form) return;

        function setLoading() {
            if (btn) {
                btn.querySelector('.btn-predict-text').style.display = 'none';
                btn.querySelector('.btn-predict-loading').style.display = '';
                btn.disabled = true;
            }
        }

        form.addEventListener('submit', function () {
            setLoading();
        });

        if (mobileBtn) {
            mobileBtn.addEventListener('click', function () {
                setLoading();
            });
        }
    }

    /* ---- Init ---- */
    document.addEventListener('DOMContentLoaded', function () {
        bindForm();
        bindSubmit();

        /* If result exists on page load, animate it in */
        var priceEl = $('#priceAmount');
        if (priceEl && priceEl.textContent.trim()) {
            var val = parseFloat(priceEl.textContent.trim());
            if (!isNaN(val)) {
                priceEl.textContent = '0.00';
                setTimeout(function () {
                    animatePrice(val);
                }, 300);
            }
        }
    });

})();
