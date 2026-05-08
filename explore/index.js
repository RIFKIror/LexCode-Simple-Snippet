'use strict';

const navbar      = document.getElementById('navbar');
const burger      = document.getElementById('burger');
const mobileMenu  = document.getElementById('mobileMenu');
const searchInput = document.getElementById('searchInput');
const searchBtn   = document.getElementById('searchBtn');
const cardsGrid   = document.getElementById('cardsGrid');
const resultCount = document.getElementById('resultCount');
const emptyState  = document.getElementById('emptyState');
const filterTags  = document.querySelectorAll('.filter-tag');
const viewBtns    = document.querySelectorAll('.view-btn');
const allCards    = document.querySelectorAll('.snippet-card');


window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });


function closeMobileMenu() {
    burger.classList.remove('open');
    mobileMenu.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
}

burger.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = burger.classList.toggle('open');
    mobileMenu.classList.toggle('open', isOpen);
    burger.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
});

document.addEventListener('click', (e) => {
    if (mobileMenu.classList.contains('open') && !navbar.contains(e.target)) {
        closeMobileMenu();
    }
});

document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', closeMobileMenu);
});

document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeMobileMenu();
});


let currentFilter = 'all';
let currentQuery  = '';

function updateCards() {
    let visibleCount = 0;

    allCards.forEach(card => {
        const title = card.querySelector('.card-title')?.textContent.toLowerCase() ?? '';
        const desc  = card.querySelector('.card-desc')?.textContent.toLowerCase() ?? '';
        const tags  = [...card.querySelectorAll('.tag')].map(t => t.textContent.toLowerCase()).join(' ');
        const lang  = card.dataset.lang ?? '';

        const matchesQuery  = !currentQuery ||
            title.includes(currentQuery) ||
            desc.includes(currentQuery)  ||
            tags.includes(currentQuery);

        const matchesFilter = currentFilter === 'all' || lang === currentFilter;

        const isVisible = matchesQuery && matchesFilter;

        card.classList.toggle('hidden', !isVisible);

        if (isVisible) {
            visibleCount++;
            card.style.animationDelay = `${visibleCount * 50}ms`;
        }
    });

    const unit = visibleCount === 1 ? 'snippet' : 'snippets';
    resultCount.textContent = `${visibleCount} ${unit} found`;

    // Empty state
    emptyState.hidden = visibleCount > 0;
    cardsGrid.style.display = visibleCount > 0 ? 'grid' : 'none';
}

let searchTimer;
searchInput.addEventListener('input', () => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
        currentQuery = searchInput.value.trim().toLowerCase();
        updateCards();
    }, 200);
});

searchBtn.addEventListener('click', () => {
    currentQuery = searchInput.value.trim().toLowerCase();
    updateCards();
});

searchInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
        clearTimeout(searchTimer);
        currentQuery = searchInput.value.trim().toLowerCase();
        updateCards();
    }
});

filterTags.forEach(tag => {
    tag.addEventListener('click', () => {
        filterTags.forEach(t => t.classList.remove('active'));
        tag.classList.add('active');
        currentFilter = tag.dataset.filter;
        updateCards();
    });
});

viewBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        viewBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const view = btn.dataset.view;
        if (view === 'list') {
            cardsGrid.classList.add('view-list');
        } else {
            cardsGrid.classList.remove('view-list');
        }
    });
});

function initCardAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                const el = entry.target;
                el.style.opacity    = '1';
                el.style.transform  = 'translateY(0)';
                observer.unobserve(el);
            }
        });
    }, { threshold: 0.08, rootMargin: '0px 0px -20px 0px' });

    allCards.forEach((card, i) => {
        card.style.opacity   = '0';
        card.style.transform = 'translateY(24px)';
        card.style.transition = `opacity 0.45s ease ${i * 60}ms, transform 0.45s ease ${i * 60}ms`;
        observer.observe(card);
    });
}

document.addEventListener('keydown', (e) => {
    if (e.key === '/' && document.activeElement !== searchInput) {
        e.preventDefault();
        searchInput.focus();
    }
});


document.addEventListener('DOMContentLoaded', () => {
    initCardAnimations();
    updateCards();
    setTimeout(() => {
        searchInput.focus();
    }, 600);
});
