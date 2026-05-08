'use strict';

const navbar     = document.getElementById('navbar');
const burger     = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');
const navLinks   = document.querySelectorAll('.nav-link, .mobile-link');

function handleNavbarScroll() {
    const scrolled = window.scrollY > 20;
    navbar.classList.toggle('scrolled', scrolled);
}

window.addEventListener('scroll', handleNavbarScroll, { passive: true });
handleNavbarScroll();

function toggleMobileMenu() {
    const isOpen = burger.classList.toggle('open');
    mobileMenu.classList.toggle('open', isOpen);
    burger.setAttribute('aria-expanded', isOpen);
    mobileMenu.setAttribute('aria-hidden', !isOpen);

    document.body.style.overflow = isOpen ? 'hidden' : '';
}

function closeMobileMenu() {
    burger.classList.remove('open');
    mobileMenu.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
    mobileMenu.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
}

burger.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMobileMenu();
});

navLinks.forEach(link => {
    link.addEventListener('click', closeMobileMenu);
});

document.addEventListener('click', (e) => {
    if (mobileMenu.classList.contains('open') &&
        !navbar.contains(e.target)) {
        closeMobileMenu();
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMobileMenu();
});

const sections = document.querySelectorAll('section[id]');

function updateActiveLink() {
    const scrollY = window.scrollY + 100;

    sections.forEach(section => {
        const sectionTop    = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId     = section.getAttribute('id');

        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}` ||
                    (sectionId === 'home' && link.getAttribute('href') === 'index.html')) {
                    link.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', updateActiveLink, { passive: true });


function initScrollAnimations() {
    const animatables = document.querySelectorAll(
        '.stat-card, .feature-card, .contact-box'
    );

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    animatables.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(el);
    });

    document.head.insertAdjacentHTML('beforeend', `
        <style>
            .stat-card.visible,
            .feature-card.visible,
            .contact-box.visible {
                opacity: 1 !important;
                transform: translateY(0) !important;
            }
        </style>
    `);
}

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const offset = parseInt(getComputedStyle(document.documentElement)
                    .getPropertyValue('--nav-h')) || 64;
                const top = target.getBoundingClientRect().top + window.scrollY - offset - 8;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });
}


function initHeroAnimations() {
    const heroEls = document.querySelectorAll('.animate-fade-up, .animate-scale');
    heroEls.forEach(el => {
        el.style.opacity = '';
        el.style.transform = '';
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initHeroAnimations();
    initScrollAnimations();
    initSmoothScroll();

    document.querySelectorAll('.feature-card').forEach((card, i) => {
        card.style.transitionDelay = `${i * 80}ms`;
    });

    document.querySelectorAll('.stat-card').forEach((card, i) => {
        card.style.transitionDelay = `${i * 60}ms`;
    });
});