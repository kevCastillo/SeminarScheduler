// theme-switcher.js - Handles theme switching between light and dark modes

document.addEventListener('DOMContentLoaded', function () {
    // Get theme toggle button
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) return;

    // Check if user has a saved theme preference
    const savedTheme = localStorage.getItem('seminarSchedulerTheme');

    // Apply theme immediately when page loads to prevent flickering
    if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        updateToggleIcon(true);
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
        updateToggleIcon(false);
    }

    // Add click event listener to toggle button
    themeToggle.addEventListener('click', function () {
        // Check current theme
        const currentTheme = document.documentElement.getAttribute('data-theme');

        // Toggle theme
        if (currentTheme === 'light') {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('seminarSchedulerTheme', 'dark');
            updateToggleIcon(true);
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('seminarSchedulerTheme', 'light');
            updateToggleIcon(false);
        }
    });

    // Helper function to update toggle button icon
    function updateToggleIcon(isDark) {
        // Using Unicode characters instead of Font Awesome
        // to avoid potential loading issues
        if (isDark) {
            themeToggle.innerHTML = '☀️'; // Sun emoji for dark mode (switch to light)
        } else {
            themeToggle.innerHTML = '🌙'; // Moon emoji for light mode (switch to dark)
        }
    }
});

function updateCalendarTheme(isDark) {
    if (window.calendar) {
        const calendarEl = document.getElementById('calendar');
        if (calendarEl) {
            if (isDark) {
                calendarEl.classList.add('fc-theme-dark');
                calendarEl.classList.remove('fc-theme-standard');
            } else {
                calendarEl.classList.add('fc-theme-standard');
                calendarEl.classList.remove('fc-theme-dark');
            }
            // Force redraw
            window.calendar.updateSize();
        }
    }
}

// Modify your theme toggle function
themeToggle.addEventListener('click', function () {
    // Check current theme
    const currentTheme = document.documentElement.getAttribute('data-theme');

    // Toggle theme
    if (currentTheme === 'light') {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('seminarSchedulerTheme', 'dark');
        updateToggleIcon(true);
        updateCalendarTheme(true);
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('seminarSchedulerTheme', 'light');
        updateToggleIcon(false);
        updateCalendarTheme(false);
    }
});

// Also update the initial loading:
if (savedTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    updateToggleIcon(true);
    // Wait for calendar to initialize
    setTimeout(() => updateCalendarTheme(true), 500);
} else {
    document.documentElement.setAttribute('data-theme', 'light');
    updateToggleIcon(false);
    // Wait for calendar to initialize
    setTimeout(() => updateCalendarTheme(false), 500);
}

// Critical: Apply theme immediately before DOM is fully loaded to prevent flashing
(function () {
    const savedTheme = localStorage.getItem('seminarSchedulerTheme');
    if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
    }
})();