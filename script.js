// ===== DriveEase — Car Rental & Self-Drive Booking Service =====
// Global Scripts: Nav, Auth, Dashboard, Animations, Utilities

(function () {
    'use strict';

    // ============================================================
    // SETTINGS RESTORE (runs immediately)
    // ============================================================
    (function restoreSettings() {
        const html = document.documentElement;
        const savedDark = localStorage.getItem('dr-dark-mode');
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (savedDark === 'true' || (!savedDark && prefersDark)) {
            html.classList.add('dark');
        }
        if (localStorage.getItem('dr-rtl') === 'true') {
            html.setAttribute('dir', 'rtl');
        }
        // Update toggle icons after load
        document.addEventListener('DOMContentLoaded', updateThemeIcons);
    })();

    function updateThemeIcons() {
        const isDark = document.documentElement.classList.contains('dark');
        document.querySelectorAll('.dark-toggle').forEach(btn => {
            const icon = btn.querySelector('i, svg');
            if (icon && icon.tagName === 'I') {
                icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
            }
        });
    }

    // ============================================================
    // DARK MODE TOGGLE
    // ============================================================
    document.addEventListener('click', function (e) {
        const btn = e.target.closest('.dark-toggle');
        if (!btn) return;
        const html = document.documentElement;
        const isDark = html.classList.toggle('dark');
        localStorage.setItem('dr-dark-mode', isDark ? 'true' : 'false');
        updateThemeIcons();
    });

    // ============================================================
    // RTL TOGGLE
    // ============================================================
    document.addEventListener('click', function (e) {
        const btn = e.target.closest('.rtl-toggle');
        if (!btn) return;
        const html = document.documentElement;
        const isRTL = html.getAttribute('dir') === 'rtl';
        html.setAttribute('dir', isRTL ? 'ltr' : 'rtl');
        localStorage.setItem('dr-rtl', isRTL ? 'false' : 'true');
    });

    // ============================================================
    // PASSWORD TOGGLE
    // ============================================================
    document.addEventListener('click', function (e) {
        const btn = e.target.closest('.toggle-password');
        if (!btn) return;
        const wrapper = btn.closest('.input-wrapper');
        const input = wrapper && wrapper.querySelector('input');
        if (input) {
            const isText = input.type === 'text';
            input.type = isText ? 'password' : 'text';
            const icon = btn.querySelector('i');
            if (icon) icon.className = isText ? 'fa-solid fa-eye' : 'fa-solid fa-eye-slash';
        }
    });

    // ============================================================
    // ANIMATE ON SCROLL
    // ============================================================
    document.addEventListener('DOMContentLoaded', function () {
        const elements = document.querySelectorAll('.animate-on-scroll');
        if (!elements.length) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // stagger children within same parent
                    const siblings = entry.target.parentElement.querySelectorAll('.animate-on-scroll');
                    let delay = 0;
                    siblings.forEach(sib => {
                        if (sib === entry.target) {
                            setTimeout(() => sib.classList.add('visible'), delay);
                        }
                    });
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

        elements.forEach(el => observer.observe(el));
    });

    // ============================================================
    // COUNTER ANIMATION
    // ============================================================
    function animateCounter(el) {
        const target = parseFloat(el.dataset.target || el.textContent.replace(/[^0-9.]/g, ''));
        const suffix = el.dataset.suffix || '';
        const prefix = el.dataset.prefix || '';
        const duration = 1600;
        const steps = 55;
        const increment = target / steps;
        let current = 0;
        const isInt = Number.isInteger(target);
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            el.textContent = prefix + (isInt ? Math.round(current).toLocaleString() : current.toFixed(1)) + suffix;
        }, duration / steps);
    }

    document.addEventListener('DOMContentLoaded', function () {
        document.querySelectorAll('[data-counter]').forEach(el => {
            const observer = new IntersectionObserver(entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        animateCounter(el);
                        observer.unobserve(el);
                    }
                });
            }, { threshold: 0.5 });
            observer.observe(el);
        });
    });

    // ============================================================
    // MOBILE NAV TOGGLE
    // ============================================================
    document.addEventListener('DOMContentLoaded', function () {
        const hamburger = document.querySelector('.hamburger');
        const mobileNav = document.querySelector('.mobile-nav');

        if (hamburger && mobileNav) {
            hamburger.addEventListener('click', function () {
                hamburger.classList.toggle('open');
                mobileNav.classList.toggle('open');
            });

            // Close when link clicked
            mobileNav.querySelectorAll('.mobile-nav-link').forEach(link => {
                link.addEventListener('click', () => {
                    hamburger.classList.remove('open');
                    mobileNav.classList.remove('open');
                });
            });
        }
    });

    // ============================================================
    // NAVBAR ACTIVE STATE
    // ============================================================
    document.addEventListener('DOMContentLoaded', function () {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(link => {
            const href = link.getAttribute('href');
            if (href === currentPage || (currentPage === '' && href === 'index.html')) {
                link.classList.add('active');
            }
        });
    });

    // ============================================================
    // DASHBOARD SIDEBAR TOGGLE
    // ============================================================
    document.addEventListener('DOMContentLoaded', function () {
        const sidebarToggle = document.getElementById('sidebar-toggle');
        const sidebar = document.querySelector('.sidebar');
        const overlay = document.querySelector('.sidebar-overlay');

        if (sidebarToggle && sidebar) {
            sidebarToggle.addEventListener('click', () => {
                sidebar.classList.toggle('open');
                if (overlay) overlay.classList.toggle('show');
            });
        }

        if (overlay && sidebar) {
            overlay.addEventListener('click', () => {
                sidebar.classList.remove('open');
                overlay.classList.remove('show');
            });
        }

        // Sidebar active link
        const currentPage = window.location.pathname.split('/').pop() || 'dashboard.html';
        document.querySelectorAll('.sidebar-link').forEach(link => {
            const href = link.getAttribute('href');
            if (href === currentPage) {
                link.classList.add('active');
            }
        });
    });

    // ============================================================
    // DASHBOARD NOTIFICATION PANEL
    // ============================================================
    document.addEventListener('DOMContentLoaded', function () {
        const notifBtn = document.getElementById('notif-btn');
        const notifPanel = document.getElementById('notif-panel');
        const markAll = document.getElementById('notif-mark-all');

        if (notifBtn && notifPanel) {
            notifBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                notifPanel.classList.toggle('hidden');
                // Close profile menu if open
                const pm = document.getElementById('profile-menu');
                if (pm) pm.classList.add('hidden');
            });

            document.addEventListener('click', () => notifPanel.classList.add('hidden'));
            notifPanel.addEventListener('click', e => e.stopPropagation());
        }

        if (markAll) {
            markAll.addEventListener('click', () => {
                document.querySelectorAll('.notif-item.unread').forEach(item => {
                    item.classList.remove('unread');
                });
                const dot = document.querySelector('.notif-dot');
                if (dot) dot.style.display = 'none';
            });
        }
    });

    // ============================================================
    // PROFILE DROPDOWN
    // ============================================================
    document.addEventListener('DOMContentLoaded', function () {
        const profileBtn = document.getElementById('profile-btn');
        const profileMenu = document.getElementById('profile-menu');

        if (profileBtn && profileMenu) {
            profileBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                profileMenu.classList.toggle('hidden');
                // Close notif panel
                const np = document.getElementById('notif-panel');
                if (np) np.classList.add('hidden');
            });

            document.addEventListener('click', () => profileMenu.classList.add('hidden'));
            profileMenu.addEventListener('click', e => e.stopPropagation());
        }
    });


    // ============================================================
    // TABS
    // ============================================================
    document.addEventListener('DOMContentLoaded', function () {
        document.querySelectorAll('.tab-bar').forEach(tabBar => {
            const buttons = tabBar.querySelectorAll('.tab-btn');
            buttons.forEach(btn => {
                btn.addEventListener('click', () => {
                    buttons.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    const target = btn.dataset.tab;
                    const container = tabBar.closest('[data-tabs]') || document;
                    container.querySelectorAll('[data-tab-content]').forEach(panel => {
                        panel.classList.toggle('hidden', panel.dataset.tabContent !== target);
                    });
                });
            });
        });
    });

    // ============================================================
    // SMOOTH SEARCH DATE VALIDATION
    // ============================================================
    document.addEventListener('DOMContentLoaded', function () {
        const pickupDate = document.getElementById('pickup-date');
        const returnDate = document.getElementById('return-date');

        if (pickupDate && returnDate) {
            const today = new Date().toISOString().split('T')[0];
            pickupDate.min = today;
            returnDate.min = today;

            pickupDate.addEventListener('change', () => {
                returnDate.min = pickupDate.value;
                if (returnDate.value && returnDate.value < pickupDate.value) {
                    returnDate.value = pickupDate.value;
                }
            });
        }
    });

    // ============================================================
    // NAVBAR SCROLL SHADOW
    // ============================================================
    window.addEventListener('scroll', function () {
        const navbar = document.querySelector('.navbar');
        if (!navbar) return;
        if (window.scrollY > 20) {
            navbar.style.boxShadow = '0 2px 20px rgba(15, 22, 41, 0.12)';
        } else {
            navbar.style.boxShadow = 'none';
        }
    });

    // ============================================================
    // TOOLTIP (simple)
    // ============================================================
    document.addEventListener('DOMContentLoaded', function () {
        document.querySelectorAll('[data-tooltip]').forEach(el => {
            el.style.position = 'relative';
            el.addEventListener('mouseenter', function () {
                const tip = document.createElement('div');
                tip.className = '_dr-tooltip';
                tip.textContent = el.dataset.tooltip;
                tip.style.cssText = `position:absolute;bottom:calc(100% + 6px);left:50%;transform:translateX(-50%);background:#0F1629;color:#fff;padding:5px 10px;border-radius:6px;font-size:0.75rem;white-space:nowrap;pointer-events:none;z-index:999;`;
                el.appendChild(tip);
            });
            el.addEventListener('mouseleave', function () {
                const tip = el.querySelector('._dr-tooltip');
                if (tip) tip.remove();
            });
        });
    });

    // ============================================================
    // FORM VALIDATION HELPERS
    // ============================================================
    window.showFormError = function (fieldId, message) {
        const field = document.getElementById(fieldId);
        if (!field) return;
        field.style.borderColor = 'var(--error)';
        let err = field.parentElement.querySelector('._field-error');
        if (!err) {
            err = document.createElement('p');
            err.className = '_field-error';
            err.style.cssText = 'color:var(--error);font-size:0.78rem;margin-top:4px;';
            field.parentElement.appendChild(err);
        }
        err.textContent = message;
    };

    window.clearFormError = function (fieldId) {
        const field = document.getElementById(fieldId);
        if (!field) return;
        field.style.borderColor = '';
        const err = field.parentElement.querySelector('._field-error');
        if (err) err.remove();
    };

})();

// ============================================================
// COMING SOON COUNTDOWN
// ============================================================
(function initCountdown() {
    const container = document.getElementById('countdown-container');
    if (!container) return;

    const targetDate = new Date(Date.now() + 21 * 24 * 60 * 60 * 1000);

    function update() {
        const now = new Date();
        const diff = targetDate - now;
        if (diff <= 0) {
            container.innerHTML = '<p style="color:var(--primary);font-size:1.2rem;font-weight:700;text-transform:uppercase;letter-spacing:0.15em;">We\'re Live!</p>';
            return;
        }
        const d = Math.floor(diff / 86400000);
        const h = Math.floor((diff % 86400000) / 3600000);
        const m = Math.floor((diff % 3600000) / 60000);
        const s = Math.floor((diff % 60000) / 1000);
        const fmt = n => String(n).padStart(2, '0');
        const el = id => document.getElementById(id);
        if (el('cd-days')) el('cd-days').textContent = fmt(d);
        if (el('cd-hours')) el('cd-hours').textContent = fmt(h);
        if (el('cd-mins')) el('cd-mins').textContent = fmt(m);
        if (el('cd-secs')) el('cd-secs').textContent = fmt(s);
    }

    update();
    setInterval(update, 1000);
})();

// ============================================================
// NOTIFY FORM (Coming Soon)
// ============================================================
function submitNotify(e) {
    e.preventDefault();
    const form = document.getElementById('cs-form');
    const success = document.getElementById('cs-success');
    if (form) form.classList.add('hidden');
    if (success) success.classList.remove('hidden');
}
