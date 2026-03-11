/**
 * Responsive Master Layout Scripts
 * This script handles the mobile hamburger menu interaction.
 */

document.addEventListener('DOMContentLoaded', () => {
    const menuBtn = document.getElementById('mobile-menu-btn');
    const mainNav = document.getElementById('main-nav');

    // Toggle the mobile navigation menu
    menuBtn.addEventListener('click', () => {
        // We toggle an 'is-open' class which changes the max-height in our CSS.
        mainNav.classList.toggle('is-open');

        // Update accessibility attributes
        const isExpanded = menuBtn.getAttribute('aria-expanded') === 'true';
        menuBtn.setAttribute('aria-expanded', !isExpanded);
    });

    // Close menu when a link is clicked (useful for single page layouts)
    const navLinks = mainNav.querySelectorAll('a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mainNav.classList.contains('is-open')) {
                mainNav.classList.remove('is-open');
                menuBtn.setAttribute('aria-expanded', 'false');
            }
        });
    });
});
