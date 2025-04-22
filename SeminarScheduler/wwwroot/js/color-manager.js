// color-manager.js - Handles color scheme management for calendar events

// Store color schemes in local storage for persistence
const COLOR_SCHEMES_KEY = 'seminarSchedulerColorSchemes';

// Default color schemes if none exist in storage
const defaultColorSchemes = [
    { categoryName: 'Computer Science', backgroundColor: '#4e73df', textColor: 'white' },
    { categoryName: 'Mathematics', backgroundColor: '#1cc88a', textColor: 'white' },
    { categoryName: 'English', backgroundColor: '#f6c23e', textColor: 'white' },
    { categoryName: 'History', backgroundColor: '#36b9cc', textColor: 'white' },
    { categoryName: 'Conflict', backgroundColor: '#e74a3b', textColor: 'white' }
];

// Initialize color schemes from storage or defaults
function initColorSchemes() {
    let colorSchemes = JSON.parse(localStorage.getItem(COLOR_SCHEMES_KEY));
    if (!colorSchemes) {
        colorSchemes = defaultColorSchemes;
        saveColorSchemes(colorSchemes);
    }
    return colorSchemes;
}

// Save color schemes to local storage
function saveColorSchemes(colorSchemes) {
    localStorage.setItem(COLOR_SCHEMES_KEY, JSON.stringify(colorSchemes));
}

// Update the color legend in the UI
function updateColorLegend() {
    const colorSchemes = initColorSchemes();
    const legendContainer = document.getElementById('colorLegendContainer');
    if (!legendContainer) return;

    legendContainer.innerHTML = '';

    colorSchemes.forEach((scheme, index) => {
        const legendItem = document.createElement('div');
        legendItem.className = 'legend-item d-flex align-items-center mb-2 p-2 rounded';
        legendItem.style.cursor = 'pointer';
        legendItem.style.transition = 'background-color 0.2s ease';

        // Make the entire row clickable
        legendItem.setAttribute('data-index', index);
        legendItem.addEventListener('click', function () {
            const index = this.getAttribute('data-index');
            openColorEditor(index);
        });

        // Hover effect
        legendItem.addEventListener('mouseenter', function () {
            this.style.backgroundColor = '#f8f9fa';
        });

        legendItem.addEventListener('mouseleave', function () {
            this.style.backgroundColor = 'transparent';
        });

        legendItem.innerHTML = `
            <div class="color-box rounded" style="width: 24px; height: 24px; background-color: ${scheme.backgroundColor}; margin-right: 12px; border: 1px solid #dee2e6;"></div>
            <span class="category-name flex-grow-1">${scheme.categoryName}</span>
            <i class="fas fa-edit edit-icon" style="font-size: 0.9rem; opacity: 0.6;"></i>
        `;

        legendContainer.appendChild(legendItem);
    });
}

// Update the legend to show only departments present in current events
function updateVisibleDepartments() {
    // Get unique departments from visible events
    const eventsToShow = filteredEvents.length > 0 ? filteredEvents : allEvents;
    const departments = [...new Set(eventsToShow.map(event => event.extendedProps.department))].filter(Boolean);

    // Always include the Conflict category
    if (!departments.includes('Conflict')) {
        departments.push('Conflict');
    }

    // Call color manager to update legend
    if (typeof window.updateColorLegendWithFiltered === 'function') {
        window.updateColorLegendWithFiltered(departments);
    }
}

// Open the color editor modal
function openColorEditor(index) {
    const colorSchemes = initColorSchemes();
    const scheme = colorSchemes[index];

    if (!scheme) {
        console.error("No color scheme found at index:", index);
        return;
    }

    console.log("Opening color editor for:", scheme);

    // Set values in the modal
    document.getElementById('currentSchemeIndex').value = index;
    document.getElementById('editCategoryName').value = scheme.categoryName;
    document.getElementById('editBackgroundColor').value = scheme.backgroundColor;
    document.getElementById('editTextColor').value = scheme.textColor;

    // Show preview
    updateColorPreview();

    // Show the modal using Bootstrap
    const modalElement = document.getElementById('colorEditorModal');
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
}

// Update color preview in the editor
function updateColorPreview() {
    const backgroundColor = document.getElementById('editBackgroundColor').value;
    const textColor = document.getElementById('editTextColor').value;
    const previewBox = document.getElementById('colorPreview');

    // Set background and text color
    previewBox.style.backgroundColor = backgroundColor;
    previewBox.style.color = textColor;

    // Add border for visibility in dark mode
    previewBox.style.border = "1px solid var(--border-color)";
}

// Save changes from the editor
function saveColorChanges() {
    const index = parseInt(document.getElementById('currentSchemeIndex').value);
    const categoryName = document.getElementById('editCategoryName').value;
    const backgroundColor = document.getElementById('editBackgroundColor').value;
    const textColor = document.getElementById('editTextColor').value;

    // Validate inputs
    if (!categoryName.trim()) {
        alert('Category name cannot be empty');
        return;
    }

    const colorSchemes = initColorSchemes();

    if (index >= 0 && index < colorSchemes.length) {
        colorSchemes[index] = { categoryName, backgroundColor, textColor };
        saveColorSchemes(colorSchemes);
        updateColorLegend();

        // Update calendar events if calendar is initialized
        if (window.calendar) {
            const events = window.calendar.getEvents();
            events.forEach(event => {
                if (event.extendedProps && event.extendedProps.department === categoryName) {
                    applyColorSchemeToEvent(event, categoryName);
                }
            });
        }
    }

    // Close the modal
    const modalElement = document.getElementById('colorEditorModal');
    const modal = bootstrap.Modal.getInstance(modalElement);
    modal.hide();
}

// Reset color schemes to default
function resetColorSchemes() {
    if (confirm('Reset all colors to default values?')) {
        saveColorSchemes(defaultColorSchemes);
        updateColorLegend();

        // Refresh all events to apply default colors
        if (window.calendar) {
            const events = window.calendar.getEvents();
            events.forEach(event => {
                if (event.extendedProps && event.extendedProps.department) {
                    applyColorSchemeToEvent(event, event.extendedProps.department);
                }
            });
        }
    }
}

// Apply color scheme to calendar event based on category
function applyColorSchemeToEvent(event, category) {
    const colorSchemes = initColorSchemes();
    const scheme = colorSchemes.find(s => s.categoryName === category);

    if (scheme) {
        event.setProp('backgroundColor', scheme.backgroundColor);
        event.setProp('textColor', scheme.textColor);
    } else if (colorSchemes.length > 0) {
        // If category not found, use the first available color scheme
        event.setProp('backgroundColor', colorSchemes[0].backgroundColor);
        event.setProp('textColor', colorSchemes[0].textColor);
    }
}

// Filter color schemes to only show departments that are in use
function updateColorLegendWithFiltered(departments) {
    const colorSchemes = initColorSchemes();
    const legendContainer = document.getElementById('colorLegendContainer');
    if (!legendContainer) return;

    legendContainer.innerHTML = '';

    // Filter color schemes to only show relevant departments
    const relevantSchemes = departments.length > 0
        ? colorSchemes.filter(scheme => departments.includes(scheme.categoryName))
        : colorSchemes;

    relevantSchemes.forEach((scheme, index) => {
        // Find the actual index in the full color schemes array
        const actualIndex = colorSchemes.findIndex(s => s.categoryName === scheme.categoryName);

        const legendItem = document.createElement('div');
        legendItem.className = 'legend-item d-flex align-items-center mb-2 p-2 rounded';
        legendItem.style.cursor = 'pointer';
        legendItem.style.transition = 'background-color 0.2s ease';

        // Make the entire row clickable with the correct index
        legendItem.setAttribute('data-index', actualIndex);
        legendItem.addEventListener('click', function () {
            const index = this.getAttribute('data-index');
            openColorEditor(parseInt(index));
        });

        // Hover effect
        legendItem.addEventListener('mouseenter', function () {
            this.style.backgroundColor = '#f8f9fa';
        });

        legendItem.addEventListener('mouseleave', function () {
            this.style.backgroundColor = 'transparent';
        });

        legendItem.innerHTML = `
            <div class="color-box rounded" style="width: 24px; height: 24px; background-color: ${scheme.backgroundColor}; margin-right: 12px; border: 1px solid #dee2e6;"></div>
            <span class="category-name flex-grow-1">${scheme.categoryName}</span>
            <i class="fas fa-edit edit-icon" style="font-size: 0.9rem; opacity: 0.6;"></i>
        `;

        legendContainer.appendChild(legendItem);
    });
}

// Add a new color scheme for a department
function addColorScheme(categoryName, backgroundColor, textColor) {
    const colorSchemes = initColorSchemes();

    // Check if scheme already exists
    const existingIndex = colorSchemes.findIndex(s => s.categoryName === categoryName);

    if (existingIndex >= 0) {
        // Update existing scheme
        colorSchemes[existingIndex] = { categoryName, backgroundColor, textColor };
    } else {
        // Add new scheme
        colorSchemes.push({ categoryName, backgroundColor, textColor });
    }

    saveColorSchemes(colorSchemes);
    updateColorLegend();
}

// Generate a random color
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// Get contrasting text color (black or white)
function getContrastColor(hexColor) {
    // Convert hex to RGB
    const r = parseInt(hexColor.substr(1, 2), 16);
    const g = parseInt(hexColor.substr(3, 2), 16);
    const b = parseInt(hexColor.substr(5, 2), 16);

    // Calculate luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

    // Return black for light colors, white for dark colors
    return luminance > 0.5 ? '#000000' : '#ffffff';
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    // Initialize the color legend
    updateColorLegend();

    // Add event listeners for color editor
    document.getElementById('editBackgroundColor').addEventListener('input', updateColorPreview);
    document.getElementById('editTextColor').addEventListener('input', updateColorPreview);
    document.getElementById('saveColorChanges').addEventListener('click', saveColorChanges);
    document.getElementById('resetToDefaultColors').addEventListener('click', resetColorSchemes);
});

document.addEventListener('DOMContentLoaded', function () {
    // Initialize the color legend
    updateColorLegend();

    // Ensure Conflict category exists
    const colorSchemes = initColorSchemes();
    const conflictScheme = colorSchemes.find(s => s.categoryName === 'Conflict');

    if (!conflictScheme) {
        // Add conflict category
        addColorScheme('Conflict', '#e74a3b', '#ffffff');
    }

    // Add event listeners for color editor
    document.getElementById('editBackgroundColor').addEventListener('input', updateColorPreview);
    document.getElementById('editTextColor').addEventListener('input', updateColorPreview);
    document.getElementById('saveColorChanges').addEventListener('click', saveColorChanges);
    document.getElementById('resetToDefaultColors').addEventListener('click', resetColorSchemes);
});



// Make functions available globally
window.applyColorSchemeToEvent = applyColorSchemeToEvent;
window.updateColorLegend = updateColorLegend;
window.updateColorLegendWithFiltered = updateColorLegendWithFiltered;
window.openColorEditor = openColorEditor;
window.resetColorSchemes = resetColorSchemes;
window.addColorScheme = addColorScheme;