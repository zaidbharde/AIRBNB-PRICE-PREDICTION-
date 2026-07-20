/* =============================================
   main.js — Dark Toggle, Receipt Items, Stamp, Counter
   ============================================= */

(function () {
    'use strict';

    var reducedMotion = document.documentElement.classList.contains('reduce-motion');
    var html = document.documentElement;

    /* =============================================
       THEME TOGGLE
       ============================================= */
    var toggle = document.getElementById('themeToggle');
    if (toggle) {
        var icon = toggle.querySelector('i');

        function setIcon(t) {
            icon.className = t === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }

        setIcon(html.getAttribute('data-theme'));

        toggle.addEventListener('click', function () {
            var current = html.getAttribute('data-theme');
            var next = current === 'dark' ? 'light' : 'dark';
            html.setAttribute('data-theme', next);
            localStorage.setItem('theme', next);
            setIcon(next);
        });
    }

    /* =============================================
       RECEIPT ITEMS
       ============================================= */
    var fields = [
        { id: 'city',           icon: 'fa-location-dot',   label: 'City' },
        { id: 'property_type',  icon: 'fa-building',       label: 'Type' },
        { id: 'room_type',      icon: 'fa-door-open',      label: 'Room' },
        { id: 'bed_type',       icon: 'fa-bed',            label: 'Bed Type' },
        { id: 'bedrooms',       icon: 'fa-door-closed',    label: 'Bedrooms' },
        { id: 'beds',           icon: 'fa-bed',            label: 'Beds' },
        { id: 'bathrooms',      icon: 'fa-bath',           label: 'Baths' },
        { id: 'accommodates',   icon: 'fa-users',          label: 'Guests' },
        { id: 'cancellation_policy', icon: 'fa-rotate-left', label: 'Cancel' },
        { id: 'cleaning_fee',   icon: 'fa-sparkles',       label: 'Cleaning' },
        { id: 'instant_bookable', icon: 'fa-bolt',         label: 'Instant' },
        { id: 'host_identity_verified', icon: 'fa-shield-halved', label: 'Verified' },
        { id: 'host_has_profile_pic', icon: 'fa-camera',   label: 'Profile Pic' },
        { id: 'host_response_rate', icon: 'fa-clock',      label: 'Response Rate' },
        { id: 'review_scores_rating', icon: 'fa-star',     label: 'Rating' },
        { id: 'number_of_reviews', icon: 'fa-comments',    label: 'Reviews' },
        { id: 'amenities',      icon: 'fa-list-check',      label: 'Amenities' },
    ];

    var listEl = document.getElementById('rcptItems');
    var numEl = document.getElementById('rcptNum');

    function updateReceipt() {
        var hasItems = false;
        var html = '';

        for (var i = 0; i < fields.length; i++) {
            var el = document.getElementById(fields[i].id);
            if (!el) continue;
            var val = el.value;
            if (val === '' || val === '0' || val === '0.0') continue;
            hasItems = true;

            var display = val;
            if (display.length > 24) display = display.substring(0, 22) + '…';

            html += '<div class="rcpt-line">';
            html += '<i class="fas ' + fields[i].icon + ' line-icon"></i>';
            html += '<span class="line-label">' + fields[i].label + '</span>';
            html += '<span class="line-dots"></span>';
            html += '<span class="line-val">' + display + '</span>';
            html += '</div>';
        }

        if (numEl) {
            var n = String(Math.floor(Math.random() * 90000) + 10000);
            numEl.textContent = '#' + n;
        }

        listEl.innerHTML = hasItems ? html : '<div class="rcpt-empty">Enter listing details above</div>';
    }

    function bindFormChanges() {
        var form = document.getElementById('predictionForm');
        if (!form) return;
        var inputs = form.querySelectorAll('select, input');
        for (var i = 0; i < inputs.length; i++) {
            inputs[i].addEventListener('change', updateReceipt);
            inputs[i].addEventListener('input', updateReceipt);
        }
        updateReceipt();
    }

    /* =============================================
       STAMP ANIMATION (on page load if result exists)
       ============================================= */
    function animateStamp() {
        var stampWrap = document.getElementById('stampWrap');
        var totalEl = document.getElementById('rcptTotal');
        var dividerEl = document.getElementById('totalDivider');
        var amountEl = document.getElementById('totalAmount');
        var mobilePrice = document.getElementById('mobilePrice');

        if (!amountEl) return;

        var val = parseFloat(amountEl.textContent.trim());
        if (isNaN(val) || val <= 0) return;

        // Show elements
        if (stampWrap) stampWrap.style.display = '';
        if (totalEl) totalEl.style.display = '';
        if (dividerEl) dividerEl.style.display = '';

        // Animate price counter
        if (!reducedMotion) {
            amountEl.textContent = '0.00';
            var startTime = null;
            var duration = 1200;

            function step(ts) {
                if (!startTime) startTime = ts;
                var progress = Math.min((ts - startTime) / duration, 1);
                var eased = 1 - Math.pow(1 - progress, 3);
                var current = eased * val;
                amountEl.textContent = current.toFixed(2);
                if (mobilePrice) {
                    mobilePrice.textContent = '$' + current.toFixed(2);
                }
                if (progress < 1) {
                    requestAnimationFrame(step);
                } else {
                    amountEl.textContent = val.toFixed(2);
                    if (mobilePrice) {
                        mobilePrice.textContent = '$' + val.toFixed(2);
                    }
                }
            }

            requestAnimationFrame(step);
        } else {
            amountEl.textContent = val.toFixed(2);
            if (mobilePrice) {
                mobilePrice.textContent = '$' + val.toFixed(2);
            }
        }
    }

    /* =============================================
       FORM SUBMIT LOADING STATE
       ============================================= */
    function bindSubmit() {
        var form = document.getElementById('predictionForm');
        var btn = document.getElementById('predictBtn');
        var mobileBtn = document.getElementById('mobilePredictBtn');

        if (!form) return;

        function setLoading() {
            if (btn) {
                btn.querySelector('.btn-text').style.display = 'none';
                btn.querySelector('.btn-loading').style.display = '';
                btn.disabled = true;
            }
            if (mobileBtn) {
                mobileBtn.disabled = true;
                mobileBtn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i>';
            }
        }

        form.addEventListener('submit', setLoading);

        if (mobileBtn) {
            mobileBtn.addEventListener('click', function () {
                form.submit();
            });
        }
    }

    /* =============================================
       INIT
       ============================================= */
    document.addEventListener('DOMContentLoaded', function () {
        bindFormChanges();
        bindSubmit();
        animateStamp();
    });

})();
