document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');

    // ===== Hamburger Menu Toggle =====
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    // ===== Active Link hervorheben =====
    function setActiveLink() {
        const navLinks = document.querySelectorAll('.nav-menu a');
        const currentFile = window.location.pathname.split('/').pop() || 'HTMLPage1.html';

        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');

            if (href === currentFile) {
                link.classList.add('active');
            }
        });
    }

    setActiveLink();
});