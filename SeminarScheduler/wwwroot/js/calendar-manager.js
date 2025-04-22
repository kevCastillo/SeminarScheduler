// Initialize variables to store event data
let allEvents = [];
let filteredEvents = [];

// DOM-Ready function
document.addEventListener('DOMContentLoaded', function () {
    // Initialize calendar
    initializeCalendar();

    // Set up event listeners
    setupEventListeners();

    // Load events from localStorage
    loadEvents();

    // Load unique locations to filter dropdown
    updateLocationFilter();
});

// Initialize the calendar
function initializeCalendar() {
    const calendarEl = document.getElementById('calendar');
    window.calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'timeGridWeek',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: ''
        },
        slotMinTime: '08:00:00',
        slotMaxTime: '18:00:00',
        allDaySlot: false,
        editable: true,
        selectable: true,
        selectMirror: true,
        dayMaxEvents: true,
        events: allEvents,
        // Apply colors to events when they are rendered
        eventDidMount: function (info) {
            if (info.event.extendedProps.department) {
                window.applyColorSchemeToEvent(info.event, info.event.extendedProps.department);
            }
        },
        // Handle date selection - open the modal to create a new event
        select: function (info) {
            // Format the times for display
            const startTime = new Date(info.startStr);
            const endTime = new Date(info.endStr);

            // Check if this is a multi-day selection
            const isMultiDay = startTime.getDate() !== endTime.getDate() ||
                startTime.getMonth() !== endTime.getMonth() ||
                startTime.getFullYear() !== endTime.getFullYear();

            // If multi-day, adjust end time to be on the same day
            let adjustedEndStr = info.endStr;
            if (isMultiDay) {
                // Set end time to end of start day
                const adjustedEnd = new Date(startTime);
                adjustedEnd.setHours(18, 0, 0); // Set to 6:00 PM
                adjustedEndStr = adjustedEnd.toISOString();
            }

            // Now open the modal with formatted times
            openEventModal(null, info.startStr, adjustedEndStr);
        },
        // Handle event click - open the modal to edit an existing event
        eventClick: function (info) {
            openEventModal(info.event);
        }
    });

    // Render the calendar
    window.calendar.render();
}

// Set up event listeners
function setupEventListeners() {
    // Event modal listeners
    document.getElementById('event-department').addEventListener('change', function () {
        const otherField = document.getElementById('event-department-other');
        otherField.style.display = this.value === 'other' ? 'block' : 'none';
    });

    document.getElementById('event-faculty').addEventListener('change', function () {
        const otherField = document.getElementById('event-faculty-other');
        otherField.style.display = this.value === 'other' ? 'block' : 'none';
    });

    document.getElementById('event-recurring').addEventListener('change', function () {
        const recurringOptions = document.getElementById('recurring-options');
        recurringOptions.style.display = this.checked ? 'block' : 'none';
    });

    document.getElementById('save-event').addEventListener('click', saveEvent);
    document.getElementById('delete-event').addEventListener('click', deleteEvent);

    // Filter button listeners
    document.getElementById('apply-filters').addEventListener('click', applyFilters);

    // Button handlers for view switching
    document.getElementById('btn-month').addEventListener('click', function () {
        window.calendar.changeView('dayGridMonth');
        updateButtonState('btn-month');
    });

    document.getElementById('btn-week').addEventListener('click', function () {
        window.calendar.changeView('timeGridWeek');
        updateButtonState('btn-week');
    });

    document.getElementById('btn-day').addEventListener('click', function () {
        window.calendar.changeView('timeGridDay');
        updateButtonState('btn-day');
    });

    // CSV import/export listeners
    document.getElementById('btn-export-csv').addEventListener('click', exportToCsv);
    document.getElementById('csv-upload').addEventListener('change', importFromCsv);
}

// Helper function to update button active state
function updateButtonState(activeId) {
    document.getElementById('btn-month').classList.remove('active');
    document.getElementById('btn-week').classList.remove('active');
    document.getElementById('btn-day').classList.remove('active');
    document.getElementById(activeId).classList.add('active');
}

// Open event modal (for add or edit)
function openEventModal(event, startStr, endStr) {
    const modal = new bootstrap.Modal(document.getElementById('eventModal'));
    const form = document.getElementById('event-form');
    const deleteBtn = document.getElementById('delete-event');
    const modalTitle = document.getElementById('eventModalLabel');

    // Reset form
    form.reset();
    document.getElementById('event-department-other').style.display = 'none';
    document.getElementById('event-faculty-other').style.display = 'none';
    document.getElementById('recurring-options').style.display = 'none';

    if (event) {
        // Edit existing event
        modalTitle.textContent = 'Edit Class';
        deleteBtn.style.display = 'block';

        // Fill form with event data
        document.getElementById('event-id').value = event.id;
        document.getElementById('event-title').value = event.title;

        // Handle department
        const department = event.extendedProps.department || '';
        const departmentSelect = document.getElementById('event-department');

        if (department && Array.from(departmentSelect.options).some(opt => opt.value === department)) {
            departmentSelect.value = department;
        } else if (department) {
            departmentSelect.value = 'other';
            document.getElementById('event-department-other').value = department;
            document.getElementById('event-department-other').style.display = 'block';
        }

        // Set times
        document.getElementById('event-start').value = event.start.toISOString().slice(0, 16);
        document.getElementById('event-end').value = event.end ? event.end.toISOString().slice(0, 16) : '';

        // Handle faculty
        const faculty = event.extendedProps.faculty || '';
        const facultySelect = document.getElementById('event-faculty');

        if (faculty && Array.from(facultySelect.options).some(opt => opt.value === faculty)) {
            facultySelect.value = faculty;
        } else if (faculty) {
            facultySelect.value = 'other';
            document.getElementById('event-faculty-other').value = faculty;
            document.getElementById('event-faculty-other').style.display = 'block';
        }

        // Set other fields
        document.getElementById('event-location').value = event.extendedProps.location || '';
        document.getElementById('event-description').value = event.extendedProps.description || '';

        // Handle recurring events
        if (event.extendedProps.recurring) {
            document.getElementById('event-recurring').checked = true;
            document.getElementById('recurring-options').style.display = 'block';
            document.getElementById('recurring-frequency').value = event.extendedProps.recurringFrequency || 'weekly';
            document.getElementById('recurring-until').value = event.extendedProps.recurringUntil || '';
        }
    } else {
        // Create new event
        modalTitle.textContent = 'Add New Class';
        deleteBtn.style.display = 'none';
        document.getElementById('event-id').value = '';

        // Set start and end times if provided
        if (startStr) {
            document.getElementById('event-start').value = new Date(startStr).toISOString().slice(0, 16);
        }
        if (endStr) {
            document.getElementById('event-end').value = new Date(endStr).toISOString().slice(0, 16);
        }
    }

    modal.show();
}

// Save event (create or update)
function saveEvent() {
    const form = document.getElementById('event-form');

    // Basic validation
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    // Get form values
    const eventId = document.getElementById('event-id').value || generateEventId();
    const title = document.getElementById('event-title').value;

    // Get department (handle 'other' option)
    let department = document.getElementById('event-department').value;
    if (department === 'other') {
        department = document.getElementById('event-department-other').value;
    }

    const start = document.getElementById('event-start').value;
    const end = document.getElementById('event-end').value;

    // Get faculty (handle 'other' option)
    let faculty = document.getElementById('event-faculty').value;
    if (faculty === 'other') {
        faculty = document.getElementById('event-faculty-other').value;
    }

    const location = document.getElementById('event-location').value;
    const description = document.getElementById('event-description').value;

    // Handle recurring options
    const recurring = document.getElementById('event-recurring').checked;
    const recurringFrequency = recurring ? document.getElementById('recurring-frequency').value : null;
    const recurringUntil = recurring ? document.getElementById('recurring-until').value : null;

    // Create event object
    const eventData = {
        id: eventId,
        title: title,
        start: start,
        end: end,
        extendedProps: {
            department: department,
            faculty: faculty,
            location: location,
            description: description,
            recurring: recurring,
            recurringFrequency: recurringFrequency,
            recurringUntil: recurringUntil
        }
    };

    // Find if event already exists
    const existingEventIndex = allEvents.findIndex(e => e.id === eventId);

    if (existingEventIndex >= 0) {
        // Update existing event
        allEvents[existingEventIndex] = eventData;
    } else {
        // Add new event
        allEvents.push(eventData);

        // Generate recurring events if needed
        if (recurring && recurringUntil) {
            createRecurringEvents(eventData);
        }
    }

    // Ensure department has a color scheme
    ensureDepartmentHasColorScheme(department);

    // Save to localStorage
    saveEvents();

    // Refresh calendar
    renderCalendarEvents();
    setTimeout(detectConflicts, 100);

    // Update location filter
    updateLocationFilter();

    // Close modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('eventModal'));
    modal.hide();
}

// Make sure department has a color scheme
function ensureDepartmentHasColorScheme(department) {
    if (!department) return;

    // Get current color schemes
    const colorSchemes = JSON.parse(localStorage.getItem('seminarSchedulerColorSchemes')) || [];

    // Check if department already exists in color schemes
    const schemeExists = colorSchemes.some(scheme => scheme.categoryName === department);

    if (!schemeExists && typeof window.addColorScheme === 'function') {
        // Generate a random color
        const bgColor = window.getRandomColor ? window.getRandomColor() : '#' + Math.floor(Math.random() * 16777215).toString(16);
        const textColor = window.getContrastColor ? window.getContrastColor(bgColor) : '#ffffff';

        // Add new color scheme
        window.addColorScheme(department, bgColor, textColor);
    }
}

// Generate recurring events based on a template event
function createRecurringEvents(templateEvent) {
    const frequency = templateEvent.extendedProps.recurringFrequency;
    const until = new Date(templateEvent.extendedProps.recurringUntil);
    const startDate = new Date(templateEvent.start);
    const endDate = new Date(templateEvent.end);
    const duration = endDate - startDate; // in milliseconds

    let daysToAdd = 0;
    switch (frequency) {
        case 'weekly':
            daysToAdd = 7;
            break;
        case 'biweekly':
            daysToAdd = 14;
            break;
        case 'monthly':
            daysToAdd = 30; // Approximate, will be replaced with more accurate logic
            break;
    }

    // Start from the next occurrence
    let currentStart = new Date(startDate);
    currentStart.setDate(currentStart.getDate() + daysToAdd);

    while (currentStart <= until) {
        const currentEnd = new Date(currentStart.getTime() + duration);

        // Create a recurring instance
        const recurringEvent = {
            id: generateEventId(),
            title: templateEvent.title,
            start: currentStart.toISOString(),
            end: currentEnd.toISOString(),
            extendedProps: {
                ...templateEvent.extendedProps,
                recurringParentId: templateEvent.id
            }
        };

        allEvents.push(recurringEvent);

        // Move to next occurrence
        if (frequency === 'monthly') {
            // For monthly, add one month
            currentStart.setMonth(currentStart.getMonth() + 1);
        } else {
            // For weekly/biweekly, add days
            currentStart.setDate(currentStart.getDate() + daysToAdd);
        }
    }
}

// Delete an event
function deleteEvent() {
    const eventId = document.getElementById('event-id').value;

    if (confirm('Are you sure you want to delete this event?')) {
        // Remove event from array
        allEvents = allEvents.filter(e => e.id !== eventId);

        // Save to localStorage
        saveEvents();

        // Refresh calendar
        renderCalendarEvents();

        // Close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('eventModal'));
        modal.hide();
    }
}

// Apply filters to calendar events
function applyFilters() {
    const departmentFilter = document.getElementById('filter-department').value;
    const facultyFilter = document.getElementById('filter-faculty').value;
    const locationFilter = document.getElementById('filter-location').value;

    filteredEvents = allEvents.filter(event => {
        const matchesDepartment = !departmentFilter || event.extendedProps.department === departmentFilter;
        const matchesFaculty = !facultyFilter || event.extendedProps.faculty === facultyFilter;
        const matchesLocation = !locationFilter || event.extendedProps.location === locationFilter;

        return matchesDepartment && matchesFaculty && matchesLocation;
    });

    renderCalendarEvents();
}

// Render events on calendar
function renderCalendarEvents() {
    // Use filtered events if available, otherwise use all events
    const eventsToShow = filteredEvents.length > 0 ? filteredEvents : allEvents;

    // Remove all events
    window.calendar.removeAllEvents();

    // Add events to calendar
    window.calendar.addEventSource(eventsToShow);

    // Detect and highlight conflicts
    detectConflicts();

    // Update color legend to reflect visible departments
    updateVisibleDepartments();
}

// Update the legend to show only departments present in current events
function updateVisibleDepartments() {
    // Get unique departments from visible events
    const eventsToShow = filteredEvents.length > 0 ? filteredEvents : allEvents;
    const departments = [...new Set(eventsToShow.map(event => event.extendedProps.department))].filter(Boolean);

    // Call color manager to update legend
    if (typeof window.updateColorLegendWithFiltered === 'function') {
        window.updateColorLegendWithFiltered(departments);
    }
}

// Update location filter dropdown with unique locations
function updateLocationFilter() {
    const locationSelect = document.getElementById('filter-location');
    const currentValue = locationSelect.value;

    // Clear existing options except the first one
    while (locationSelect.options.length > 1) {
        locationSelect.remove(1);
    }

    // Get unique locations
    const locations = [...new Set(allEvents.map(e => e.extendedProps.location))].filter(Boolean).sort();

    // Add options
    locations.forEach(location => {
        const option = document.createElement('option');
        option.value = location;
        option.textContent = location;
        locationSelect.appendChild(option);
    });

    // Restore previous value if it exists
    if (currentValue && locations.includes(currentValue)) {
        locationSelect.value = currentValue;
    }
}

// Save events to localStorage
function saveEvents() {
    localStorage.setItem('seminarSchedulerEvents', JSON.stringify(allEvents));
}

// Load events from localStorage
function loadEvents() {
    const savedEvents = localStorage.getItem('seminarSchedulerEvents');
    if (savedEvents) {
        allEvents = JSON.parse(savedEvents);

        // Convert string dates to Date objects for proper rendering
        allEvents.forEach(event => {
            event.start = event.start;
            event.end = event.end;
        });

        // Render events
        renderCalendarEvents();
    }
}

// Generate a unique event ID
function generateEventId() {
    return 'event_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
}

// Export calendar events to CSV
function exportToCsv() {
    // Define CSV headers
    const headers = [
        'Title', 'Department', 'Start Time', 'End Time',
        'Faculty', 'Location', 'Description', 'Recurring',
        'Frequency', 'Until'
    ];

    // Convert events to CSV format
    const rows = allEvents.map(event => [
        event.title,
        event.extendedProps.department || '',
        event.start,
        event.end,
        event.extendedProps.faculty || '',
        event.extendedProps.location || '',
        event.extendedProps.description || '',
        event.extendedProps.recurring ? 'Yes' : 'No',
        event.extendedProps.recurringFrequency || '',
        event.extendedProps.recurringUntil || ''
    ]);

    // Add headers to rows
    rows.unshift(headers);

    // Convert to CSV string
    let csvContent = rows.map(row =>
        row.map(cell => {
            // Escape commas and quotes
            if (cell && typeof cell === 'string' && (cell.includes(',') || cell.includes('"'))) {
                return `"${cell.replace(/"/g, '""')}"`;
            }
            return cell;
        }).join(',')
    ).join('\n');

    // Create blob and download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'seminar_schedule.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// This function detects conflicts between events
function detectConflicts() {
    // Get all events
    const events = window.calendar.getEvents();

    // Reset all conflict flags
    events.forEach(event => {
        if (event.extendedProps && event.extendedProps.isConflict) {
            event.setExtendedProp('isConflict', false);
            // Reset border color if it was previously set for conflict
            event.setProp('borderColor', null);
        }
    });

    // Check for conflicts
    for (let i = 0; i < events.length; i++) {
        for (let j = i + 1; j < events.length; j++) {
            const eventA = events[i];
            const eventB = events[j];

            // Skip if comparing events with same parent (recurring events)
            if (eventA.extendedProps.recurringParentId === eventB.id ||
                eventB.extendedProps.recurringParentId === eventA.id) {
                continue;
            }

            // Check for room conflicts (same location and overlapping time)
            if (eventA.extendedProps.location &&
                eventB.extendedProps.location &&
                eventA.extendedProps.location === eventB.extendedProps.location) {

                // Check for time overlap
                if (eventA.start < eventB.end && eventA.end > eventB.start) {
                    // Mark both events as conflicts
                    eventA.setExtendedProp('isConflict', true);
                    eventB.setExtendedProp('isConflict', true);

                    // Highlight conflicts with red border
                    eventA.setProp('borderColor', '#e74a3b');
                    eventB.setProp('borderColor', '#e74a3b');
                }
            }

            // Check for faculty conflicts (same faculty and overlapping time)
            if (eventA.extendedProps.faculty &&
                eventB.extendedProps.faculty &&
                eventA.extendedProps.faculty === eventB.extendedProps.faculty) {

                // Check for time overlap
                if (eventA.start < eventB.end && eventA.end > eventB.start) {
                    // Mark both events as conflicts
                    eventA.setExtendedProp('isConflict', true);
                    eventB.setExtendedProp('isConflict', true);

                    // Highlight conflicts with red border
                    eventA.setProp('borderColor', '#e74a3b');
                    eventB.setProp('borderColor', '#e74a3b');
                }
            }
        }
    }
}

// Import events from CSV file
function importFromCsv(event) {
    const file = event.target.files[0];

    if (file) {
        const reader = new FileReader();

        reader.onload = function (e) {
            const content = e.target.result;

            // Parse CSV using PapaParse
            Papa.parse(content, {
                header: true,
                skipEmptyLines: true,
                complete: function (results) {
                    if (results.data && results.data.length > 0) {
                        // Ask user if they want to replace or append
                        const importAction = confirm(
                            'Do you want to replace all existing events with imported ones?\n\n' +
                            'Click OK to replace all events.\n' +
                            'Click Cancel to append imported events to existing ones.'
                        );

                        if (importAction) {
                            // Replace all events
                            allEvents = [];
                        }

                        // Process imported data
                        let importedCount = 0;
                        results.data.forEach(row => {
                            // Skip invalid rows
                            if (!row.Title || !row['Start Time']) return;

                            const department = row.Department || '';
                            const recurring = row.Recurring === 'Yes';

                            const eventData = {
                                id: generateEventId(),
                                title: row.Title,
                                start: row['Start Time'],
                                end: row['End Time'],
                                extendedProps: {
                                    department: department,
                                    faculty: row.Faculty || '',
                                    location: row.Location || '',
                                    description: row.Description || '',
                                    recurring: recurring
                                }
                            };

                            // Add recurring properties if needed
                            if (recurring) {
                                eventData.extendedProps.recurringFrequency = row.Frequency || 'weekly';
                                eventData.extendedProps.recurringUntil = row.Until || '';
                            }

                            allEvents.push(eventData);
                            importedCount++;

                            // Ensure the department has a color scheme
                            ensureDepartmentHasColorScheme(department);
                        });

                        // Save to localStorage
                        saveEvents();

                        // Update location filter
                        updateLocationFilter();

                        // Refresh calendar
                        renderCalendarEvents();

                        alert(`Successfully imported ${importedCount} events.`);
                    } else {
                        alert('No valid data found in the CSV file.');
                    }

                    // Reset file input
                    document.getElementById('csv-upload').value = '';
                },
                error: function (error) {
                    console.error('Error parsing CSV:', error);
                    alert('Error parsing CSV file. Please make sure the file is in correct format.');

                    // Reset file input
                    document.getElementById('csv-upload').value = '';
                }
            });
        };

        reader.readAsText(file);
    }
}