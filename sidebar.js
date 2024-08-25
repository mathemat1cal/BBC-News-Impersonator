// sidebar.js

document.addEventListener('DOMContentLoaded', function() {
    const toggleButton = document.createElement('button');
    toggleButton.id = 'sidebar-toggle';
    toggleButton.textContent = '☰'; // Unicode character for hamburger menu
    document.body.insertBefore(toggleButton, document.body.firstChild);

    const sidebar = document.querySelector('.sidebar');
    const toggleSidebar = () => {
        sidebar.classList.toggle('collapsed');
    };

    toggleButton.addEventListener('click', toggleSidebar);
});

window.onscroll = function() {
    const header = document.querySelector('header');
    if (window.pageYOffset > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
};





