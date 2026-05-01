document.addEventListener('DOMContentLoaded', function() {

    // ===========================
    // Page Fade-In
    // ===========================

    requestAnimationFrame(function() {
        document.body.classList.add('is-loaded');
    });

    // ===========================
    // Theme Switching
    // ===========================
    
    const themeToggle = document.querySelector('.theme-toggle');
    const lightIcon = document.querySelector('.light-icon');
    const darkIcon = document.querySelector('.dark-icon');
    const htmlElement = document.documentElement;
    
    function initTheme() {
        const savedTheme = localStorage.getItem('theme');
        
        if (savedTheme) {
            htmlElement.setAttribute('data-theme', savedTheme);
            updateThemeIcon(savedTheme);
        } else {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            const theme = prefersDark ? 'dark' : 'light';
            htmlElement.setAttribute('data-theme', theme);
            updateThemeIcon(theme);
        }
    }
    
    function updateThemeIcon(theme) {
        if (theme === 'dark') {
            lightIcon.style.display = 'none';
            darkIcon.style.display = 'block';
        } else {
            lightIcon.style.display = 'block';
            darkIcon.style.display = 'none';
        }
    }
    
    function toggleTheme() {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    }
    
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    
    initTheme();
    
    // ===========================
    // Mobile Navigation
    // ===========================
    
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            
            const spans = navToggle.querySelectorAll('span');
            if (navMenu.classList.contains('active')) {
                spans[0].style.transform = 'translateY(7px) rotate(45deg)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
        
        document.addEventListener('click', function(event) {
            if (!navToggle.contains(event.target) && !navMenu.contains(event.target)) {
                navMenu.classList.remove('active');
                const spans = navToggle.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
    }
    
    // ===========================
    // Project Filtering
    // ===========================
    
    const filterChips = document.querySelectorAll('.filter-chip');
    const projectCards = document.querySelectorAll('.project-card');
    
    if (filterChips.length > 0 && projectCards.length > 0) {
        filterChips.forEach(chip => {
            chip.addEventListener('click', function() {
                const filter = this.getAttribute('data-filter');
                
                filterChips.forEach(c => c.classList.remove('active'));
                this.classList.add('active');
                
                projectCards.forEach(card => {
                    const categories = card.getAttribute('data-category');
                    const shouldShow = filter === 'all' || (categories && categories.includes(filter));
                    card.classList.toggle('is-hidden', !shouldShow);
                });
            });
        });
    }
    
    // ===========================
    // Active Page Indicator
    // ===========================
    
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        if (linkHref === currentPage || 
            (currentPage === '' && linkHref === 'index.html') ||
            (currentPage === 'index.html' && linkHref === 'index.html')) {
            if (!link.hasAttribute('target')) {
                link.classList.add('active');
            }
        }
    });
    
    // ===========================
    // Grid Layout Controls
    // ===========================
    
    const gridControlConfigs = [
        { value: '1', label: '1 column', className: 'grid-btn grid-btn-mobile' },
        { value: '2', label: '2 columns', className: 'grid-btn' },
        { value: '3', label: '3 columns', className: 'grid-btn grid-btn-desktop' },
        { value: '4', label: '4 columns', className: 'grid-btn grid-btn-desktop' },
    ];

    document.querySelectorAll('.grid-controls').forEach(container => {
        if (container.children.length > 0) return;
        gridControlConfigs.forEach(cfg => {
            const btn = document.createElement('button');
            btn.className = cfg.className;
            btn.setAttribute('data-grid-value', cfg.value);
            btn.setAttribute('aria-label', cfg.label);
            const img = document.createElement('img');
            img.src = 'Icons/grid ' + cfg.value + '.svg';
            img.alt = cfg.label;
            btn.appendChild(img);
            container.appendChild(btn);
        });
    });

    const gridButtons = document.querySelectorAll('.grid-btn');
    
    if (gridButtons.length > 0) {
        gridButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                const gridValue = this.getAttribute('data-grid-value');
                const projectCard = this.closest('.project-card');
                
                if (projectCard && gridValue) {
                    const figures = projectCard.querySelectorAll('.project-images figure');
                    figures.forEach(fig => {
                        fig.style.opacity = '0';
                        fig.style.transform = 'scale(0.97)';
                    });

                    setTimeout(() => {
                        projectCard.setAttribute('data-grid', gridValue);
                        figures.forEach(fig => {
                            fig.style.opacity = '';
                            fig.style.transform = '';
                        });
                    }, 200);
                    
                    const siblingButtons = projectCard.querySelectorAll('.grid-btn');
                    siblingButtons.forEach(btn => btn.classList.remove('active'));
                    this.classList.add('active');
                }
            });
        });
    }
    
    // ===========================
    // Clickable Project Cards
    // ===========================

    document.querySelectorAll('.project-card[data-href]').forEach(card => {
        card.addEventListener('click', function(e) {
            if (e.target.closest('.grid-controls')) return;
            window.location.href = this.dataset.href;
        });
    });

    // ===========================
    // Responsive Grid Defaults
    // ===========================
    
    function setResponsiveGridDefaults() {
        const isMobile = window.innerWidth <= 768;
        const projectCards = document.querySelectorAll('.project-card');
        
        projectCards.forEach(card => {
            const gridControls = card.querySelector('.grid-controls');
            if (!gridControls) return;
            
            const buttons = gridControls.querySelectorAll('.grid-btn');
            const defaultValue = isMobile ? '2' : '4';
            
            card.setAttribute('data-grid', defaultValue);
            
            buttons.forEach(btn => {
                const btnValue = btn.getAttribute('data-grid-value');
                if (btnValue === defaultValue) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });
        });
    }
    
    setResponsiveGridDefaults();
    
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(setResponsiveGridDefaults, 250);
    });

    // ===========================
    // Scroll-Triggered Fade Animations
    // ===========================
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, { threshold: 0 });

    document.querySelectorAll('.fade-in-up').forEach(el => observer.observe(el));
});
