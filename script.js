// ========================================================
// LPU ASSIGNMENT TRACKER - JAVASCRIPT
// Made by Rahul Sharma, B.Tech CSE, Lovely Professional University
// ========================================================

// Key names for localStorage
var STORAGE_KEY = 'lpu_assignments';
var THEME_KEY = 'lpu_dark_mode';

// Global array to store all assignments
var assignments = [];

// DOM Element references
var assignmentForm = document.getElementById('assignmentForm');
var editIdInput = document.getElementById('editId');
var subjectNameInput = document.getElementById('subjectName');
var courseCodeInput = document.getElementById('courseCode');
var assignmentTypeInput = document.getElementById('assignmentType');
var assignmentTitleInput = document.getElementById('assignmentTitle');
var deadlineInput = document.getElementById('deadline');
var priorityInput = document.getElementById('priority');
var notesInput = document.getElementById('notes');

var formTitle = document.getElementById('formTitle');
var submitBtn = document.getElementById('submitBtn');
var cancelEditBtn = document.getElementById('cancelEditBtn');
var formAlert = document.getElementById('formAlert');

var assignmentsContainer = document.getElementById('assignmentsContainer');
var emptyState = document.getElementById('emptyState');
var noResultsState = document.getElementById('noResultsState');

var searchInput = document.getElementById('searchInput');
var clearSearchBtn = document.getElementById('clearSearchBtn');
var statusFilter = document.getElementById('statusFilter');
var subjectFilter = document.getElementById('subjectFilter');
var sortBy = document.getElementById('sortBy');
var resultsCount = document.getElementById('resultsCount');

var clearAllBtn = document.getElementById('clearAllBtn');
var resetSamplesBtn = document.getElementById('resetSamplesBtn');
var themeToggleBtn = document.getElementById('themeToggleBtn');
var dueSoonBanner = document.getElementById('dueSoonBanner');
var dueSoonCount = document.getElementById('dueSoonCount');

var statTotal = document.getElementById('statTotal');
var statPending = document.getElementById('statPending');
var statSubmitted = document.getElementById('statSubmitted');
var statOverdue = document.getElementById('statOverdue');

var progressBarFill = document.getElementById('progressBarFill');
var progressPercentage = document.getElementById('progressPercentage');
var progressCaption = document.getElementById('progressCaption');


// ========================================================
// 1. LOCAL STORAGE FUNCTIONS
// ========================================================

// get data from localStorage
function getStoredAssignments() {
  var storedData = localStorage.getItem(STORAGE_KEY);
  if (storedData) {
    try {
      return JSON.parse(storedData);
    } catch (e) {
      console.error('Error parsing stored assignments', e);
      return null;
    }
  }
  return null;
}

// save data to localStorage
function saveAssignments() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(assignments));
}


// ========================================================
// 2. SAMPLE DATA GENERATOR (For first-time load)
// ========================================================

// Helper to convert Date object to local YYYY-MM-DDTHH:MM string
function formatDateForInput(date) {
  var year = date.getFullYear();
  var month = String(date.getMonth() + 1).padStart(2, '0');
  var day = String(date.getDate()).padStart(2, '0');
  var hours = String(date.getHours()).padStart(2, '0');
  var minutes = String(date.getMinutes()).padStart(2, '0');
  return year + '-' + month + '-' + day + 'T' + hours + ':' + minutes;
}

// Create sample assignments with relative dates so countdowns are always live
function createSampleAssignments() {
  var now = new Date();

  // Assignment 1: Due in 16 hours (Triggers Due Soon banner!)
  var date1 = new Date(now.getTime() + 16 * 60 * 60 * 1000);

  // Assignment 2: Due in 3 days
  var date2 = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);

  // Assignment 3: Due in 6 days
  var date3 = new Date(now.getTime() + 6 * 24 * 60 * 60 * 1000);

  // Assignment 4: Overdue by 1.5 days
  var date4 = new Date(now.getTime() - 36 * 60 * 60 * 1000);

  // Assignment 5: Already submitted
  var date5 = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000);

  return [
    {
      id: 'lpu_' + (Date.now() + 1),
      subject: 'Data Structures',
      code: 'CSE121',
      title: 'Binary Search Tree Implementation',
      type: 'CA1',
      deadline: formatDateForInput(date1),
      priority: 'High',
      notes: 'Upload C++ source code ZIP and output screenshot on UMS portal before 5:00 PM.',
      submitted: false
    },
    {
      id: 'lpu_' + (Date.now() + 2),
      subject: 'Front End Web Development',
      code: 'INT219',
      title: 'Responsive Student Portfolio Website',
      type: 'CA2',
      deadline: formatDateForInput(date2),
      priority: 'Medium',
      notes: 'Must use semantic HTML, flexbox/grid, and deploy on GitHub pages.',
      submitted: false
    },
    {
      id: 'lpu_' + (Date.now() + 3),
      subject: 'Software Engineering',
      code: 'CSE320',
      title: 'UMS Redesign SRS Document & Diagrams',
      type: 'Project',
      deadline: formatDateForInput(date3),
      priority: 'High',
      notes: 'Group project submission. Include Use Case and Class Diagrams in IEEE format.',
      submitted: false
    },
    {
      id: 'lpu_' + (Date.now() + 4),
      subject: 'Discrete Mathematics',
      code: 'MTH166',
      title: 'Graph Theory & Recurrence Relations',
      type: 'CA3',
      deadline: formatDateForInput(date4),
      priority: 'High',
      notes: 'Handwritten assignment scanned to PDF under 5MB.',
      submitted: false
    },
    {
      id: 'lpu_' + (Date.now() + 5),
      subject: 'Engineering Physics',
      code: 'PHY110',
      title: 'Optics & Laser Diffraction Experiment File',
      type: 'Lab File',
      deadline: formatDateForInput(date5),
      priority: 'Low',
      notes: 'Teacher signature verified in Block 34 Physics lab.',
      submitted: true
    }
  ];
}


// ========================================================
// 3. DATE & COUNTDOWN HELPERS
// ========================================================

// Format date nicely for card display: e.g. "20 Oct 2026, 05:30 PM"
function formatDisplayDate(dateString) {
  if (!dateString) return 'No deadline';
  var date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;

  var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var day = date.getDate();
  var month = months[date.getMonth()];
  var year = date.getFullYear();

  var hours = date.getHours();
  var minutes = String(date.getMinutes()).padStart(2, '0');
  var ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // '0' should be '12'

  return day + ' ' + month + ' ' + year + ', ' + hours + ':' + minutes + ' ' + ampm;
}

// Calculate countdown details: remaining hours, label, badge class, and status
function getCountdownInfo(deadlineString, isSubmitted) {
  if (isSubmitted) {
    return {
      statusClass: 'status-submitted',
      badgeClass: 'countdown-submitted',
      text: 'Submitted ✅',
      isOverdue: false,
      hoursLeft: 999999
    };
  }

  var deadline = new Date(deadlineString);
  var now = new Date();
  var diffMs = deadline.getTime() - now.getTime();
  var diffHours = diffMs / (1000 * 60 * 60);

  // If past deadline
  if (diffMs < 0) {
    var overdueMs = Math.abs(diffMs);
    var overdueDays = Math.floor(overdueMs / (1000 * 60 * 60 * 24));
    var overdueHours = Math.floor((overdueMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    var overdueText = 'Overdue by ';
    if (overdueDays > 0) {
      overdueText += overdueDays + (overdueDays === 1 ? ' day ' : ' days ');
      if (overdueHours > 0) {
        overdueText += overdueHours + ' hr';
      }
    } else {
      var overdueMinutes = Math.floor((overdueMs % (1000 * 60 * 60)) / (1000 * 60));
      if (overdueHours > 0) {
        overdueText += overdueHours + (overdueHours === 1 ? ' hr' : ' hrs');
      } else {
        overdueText += Math.max(1, overdueMinutes) + ' mins';
      }
    }

    return {
      statusClass: 'status-overdue',
      badgeClass: 'countdown-overdue',
      text: '⚠️ ' + overdueText,
      isOverdue: true,
      hoursLeft: diffHours
    };
  }

  // Not overdue yet - calculate remaining time
  var days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  var hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  var minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

  var timeText = '';
  if (days > 0) {
    timeText = days + (days === 1 ? ' day ' : ' days ') + hours + ' hrs left';
  } else if (hours > 0) {
    timeText = hours + (hours === 1 ? ' hr ' : ' hrs ') + minutes + ' mins left';
  } else {
    timeText = Math.max(1, minutes) + ' mins left';
  }

  // Color code: due within 48 hours gets orange
  if (diffHours <= 48) {
    return {
      statusClass: 'status-due-soon',
      badgeClass: 'countdown-due-soon',
      text: '⏰ ' + timeText,
      isOverdue: false,
      hoursLeft: diffHours
    };
  }

  // Normal remaining
  return {
    statusClass: 'status-normal',
    badgeClass: 'countdown-normal',
    text: '⏰ ' + timeText,
    isOverdue: false,
    hoursLeft: diffHours
  };
}


// ========================================================
// 4. STATS & PROGRESS BAR
// ========================================================

function updateDashboardStats() {
  var total = assignments.length;
  var submitted = 0;
  var pending = 0;
  var overdue = 0;
  var dueWithin24Hrs = 0;

  var now = new Date();

  for (var i = 0; i < assignments.length; i++) {
    var item = assignments[i];
    if (item.submitted) {
      submitted++;
    } else {
      pending++;
      var deadline = new Date(item.deadline);
      var diffMs = deadline.getTime() - now.getTime();
      var diffHours = diffMs / (1000 * 60 * 60);

      if (diffMs < 0) {
        overdue++;
      } else if (diffHours <= 24) {
        dueWithin24Hrs++;
      }
    }
  }

  // Update stat numbers
  statTotal.textContent = total;
  statPending.textContent = pending;
  statSubmitted.textContent = submitted;
  statOverdue.textContent = overdue;

  // Update progress bar
  var percentage = total > 0 ? Math.round((submitted / total) * 100) : 0;
  progressBarFill.style.width = percentage + '%';
  progressPercentage.textContent = percentage + '%';
  progressCaption.textContent = submitted + ' of ' + total + ' assignments submitted';

  // Toggle green color when 100% complete
  if (percentage === 100 && total > 0) {
    progressBarFill.style.backgroundColor = 'var(--color-success)';
  } else {
    progressBarFill.style.backgroundColor = 'var(--lpu-orange)';
  }

  // Due soon banner logic
  if (dueWithin24Hrs > 0) {
    dueSoonCount.textContent = dueWithin24Hrs;
    dueSoonBanner.classList.remove('hidden');
  } else {
    dueSoonBanner.classList.add('hidden');
  }
}


// ========================================================
// 5. SUBJECT FILTER DROPDOWN SYNC
// ========================================================

function populateSubjectFilter() {
  var currentSelected = subjectFilter.value;
  var subjects = [];

  // Extract unique subjects
  for (var i = 0; i < assignments.length; i++) {
    var subj = assignments[i].subject.trim();
    if (subj && subjects.indexOf(subj) === -1) {
      subjects.push(subj);
    }
  }

  subjects.sort();

  // Clear existing options except "all"
  subjectFilter.innerHTML = '<option value="all">All Subjects</option>';

  for (var j = 0; j < subjects.length; j++) {
    var opt = document.createElement('option');
    opt.value = subjects[j];
    opt.textContent = subjects[j];
    subjectFilter.appendChild(opt);
  }

  // Preserve previous selection if still available
  if (subjects.indexOf(currentSelected) !== -1) {
    subjectFilter.value = currentSelected;
  } else {
    subjectFilter.value = 'all';
  }
}


// ========================================================
// 6. RENDER ASSIGNMENT CARDS
// ========================================================

function renderAssignments() {
  // Update the stats first
  updateDashboardStats();

  // If no assignments exist at all in storage
  if (assignments.length === 0) {
    assignmentsContainer.innerHTML = '';
    emptyState.classList.remove('hidden');
    noResultsState.classList.add('hidden');
    resultsCount.textContent = '0 assignments';
    return;
  } else {
    emptyState.classList.add('hidden');
  }

  // Filter assignments
  var searchQuery = searchInput.value.toLowerCase().trim();
  var statusValue = statusFilter.value;
  var subjectValue = subjectFilter.value;
  var sortValue = sortBy.value;

  var filtered = [];
  var now = new Date();

  for (var i = 0; i < assignments.length; i++) {
    var item = assignments[i];

    // Search filter: title, subject, or course code
    var matchSearch = true;
    if (searchQuery) {
      var inTitle = item.title.toLowerCase().indexOf(searchQuery) !== -1;
      var inSubject = item.subject.toLowerCase().indexOf(searchQuery) !== -1;
      var inCode = item.code.toLowerCase().indexOf(searchQuery) !== -1;
      matchSearch = inTitle || inSubject || inCode;
    }

    // Status filter
    var matchStatus = true;
    var deadlineDate = new Date(item.deadline);
    var isItemOverdue = !item.submitted && deadlineDate.getTime() < now.getTime();

    if (statusValue === 'pending') {
      matchStatus = !item.submitted;
    } else if (statusValue === 'submitted') {
      matchStatus = item.submitted;
    } else if (statusValue === 'overdue') {
      matchStatus = isItemOverdue;
    }

    // Subject filter
    var matchSubject = true;
    if (subjectValue !== 'all') {
      matchSubject = item.subject.toLowerCase() === subjectValue.toLowerCase();
    }

    if (matchSearch && matchStatus && matchSubject) {
      filtered.push(item);
    }
  }

  // Sort assignments
  filtered.sort(function(a, b) {
    if (sortValue === 'deadline-asc') {
      return new Date(a.deadline) - new Date(b.deadline);
    } else if (sortValue === 'deadline-desc') {
      return new Date(b.deadline) - new Date(a.deadline);
    } else if (sortValue === 'priority-desc') {
      var weight = { 'High': 3, 'Medium': 2, 'Low': 1 };
      var diff = (weight[b.priority] || 0) - (weight[a.priority] || 0);
      if (diff !== 0) return diff;
      return new Date(a.deadline) - new Date(b.deadline);
    } else if (sortValue === 'title-asc') {
      return a.title.localeCompare(b.title);
    }
    return 0;
  });

  // Check if search/filter returned empty
  if (filtered.length === 0) {
    assignmentsContainer.innerHTML = '';
    noResultsState.classList.remove('hidden');
    resultsCount.textContent = 'Showing 0 assignments';
    return;
  } else {
    noResultsState.classList.add('hidden');
  }

  resultsCount.textContent = 'Showing ' + filtered.length + ' of ' + assignments.length + ' assignments';

  // Build HTML for each assignment card
  var html = '';

  for (var k = 0; k < filtered.length; k++) {
    var assign = filtered[k];
    var countdown = getCountdownInfo(assign.deadline, assign.submitted);

    // Determine priority class
    var priorityClass = 'priority-medium';
    if (assign.priority === 'High') priorityClass = 'priority-high';
    if (assign.priority === 'Low') priorityClass = 'priority-low';

    // Formatted deadline
    var formattedDate = formatDisplayDate(assign.deadline);

    // Escape text helper for safety
    var safeTitle = escapeHTML(assign.title);
    var safeSubject = escapeHTML(assign.subject);
    var safeCode = escapeHTML(assign.code);
    var safeNotes = assign.notes ? escapeHTML(assign.notes) : '';

    html += '<div class="assignment-card ' + countdown.statusClass + '" data-id="' + assign.id + '">';
    
    // Top Row: Code, Subject, Badges
    html += '  <div class="card-top-row">';
    html += '    <div class="course-meta">';
    html += '      <span class="badge-code">' + safeCode + '</span>';
    html += '      <span class="subject-title">' + safeSubject + '</span>';
    html += '    </div>';
    html += '    <div class="badges-group">';
    html += '      <span class="badge badge-type">' + assign.type + '</span>';
    html += '      <span class="badge ' + priorityClass + '">' + assign.priority + ' Priority</span>';
    html += '    </div>';
    html += '  </div>';

    // Title
    html += '  <h3 class="assignment-heading">' + safeTitle + '</h3>';

    // Deadline & Live Countdown Row
    html += '  <div class="card-deadline-row">';
    html += '    <div class="deadline-text">';
    html += '      <span>📅</span> ' + formattedDate;
    html += '    </div>';
    html += '    <div class="countdown-badge ' + countdown.badgeClass + '">';
    html +=        countdown.text;
    html += '    </div>';
    html += '  </div>';

    // Notes (if available)
    if (safeNotes) {
      html += '  <div class="card-notes">📝 ' + safeNotes + '</div>';
    }

    // Card Bottom Row: Actions
    html += '  <div class="card-bottom-row">';
    html += '    <label class="status-toggle-label">';
    html += '      <input type="checkbox" class="status-checkbox" data-id="' + assign.id + '" ' + (assign.submitted ? 'checked' : '') + '>';
    html += '      <span>' + (assign.submitted ? 'Submitted ✅' : 'Mark as Submitted') + '</span>';
    html += '    </label>';
    html += '    <div class="action-buttons">';
    html += '      <button class="btn-action btn-action-edit" data-id="' + assign.id + '" title="Edit Assignment">✏️ Edit</button>';
    html += '      <button class="btn-action btn-action-delete" data-id="' + assign.id + '" title="Delete Assignment">🗑️ Delete</button>';
    html += '    </div>';
    html += '  </div>';

    html += '</div>';
  }

  assignmentsContainer.innerHTML = html;
}

// Simple HTML escaping helper
function escapeHTML(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}


// ========================================================
// 7. FORM HANDLING (ADD & EDIT)
// ========================================================

// Friendly form error notification
function showFormAlert(message, type) {
  formAlert.textContent = message;
  formAlert.className = 'alert-message alert-' + (type || 'danger');
  formAlert.classList.remove('hidden');

  // Auto hide after 4 seconds
  setTimeout(function() {
    formAlert.classList.add('hidden');
  }, 4000);
}

// Reset form back to Add mode
function resetForm() {
  assignmentForm.reset();
  editIdInput.value = '';
  formTitle.textContent = '➕ Add New Assignment';
  submitBtn.textContent = 'Add Assignment ➕';
  cancelEditBtn.classList.add('hidden');
  formAlert.classList.add('hidden');
}

// Handle Form Submission
function handleFormSubmit(e) {
  e.preventDefault();

  // Get field values
  var subject = subjectNameInput.value.trim();
  var code = courseCodeInput.value.trim().toUpperCase();
  var type = assignmentTypeInput.value;
  var title = assignmentTitleInput.value.trim();
  var deadline = deadlineInput.value;
  var priority = priorityInput.value;
  var notes = notesInput.value.trim();
  var editId = editIdInput.value;

  // Validate required fields
  if (!subject || !code || !title || !deadline) {
    showFormAlert('⚠️ Please fill in all required fields (Subject, Course Code, Title, Deadline)!', 'danger');
    return;
  }

  // Check if we are updating an existing assignment or adding new
  if (editId) {
    // Find assignment by id
    var foundIndex = -1;
    for (var i = 0; i < assignments.length; i++) {
      if (assignments[i].id === editId) {
        foundIndex = i;
        break;
      }
    }

    if (foundIndex !== -1) {
      assignments[foundIndex].subject = subject;
      assignments[foundIndex].code = code;
      assignments[foundIndex].type = type;
      assignments[foundIndex].title = title;
      assignments[foundIndex].deadline = deadline;
      assignments[foundIndex].priority = priority;
      assignments[foundIndex].notes = notes;

      saveAssignments();
      populateSubjectFilter();
      renderAssignments();
      resetForm();
      showFormAlert('✅ Assignment updated successfully!', 'success');
    }
  } else {
    // Create new assignment
    var newAssignment = {
      id: 'lpu_' + Date.now(),
      subject: subject,
      code: code,
      type: type,
      title: title,
      deadline: deadline,
      priority: priority,
      notes: notes,
      submitted: false
    };

    assignments.unshift(newAssignment);
    saveAssignments();
    populateSubjectFilter();
    renderAssignments();
    resetForm();
    showFormAlert('🎉 Assignment added successfully!', 'success');
  }
}

// Edit assignment: populate form fields
function startEditAssignment(id) {
  var itemToEdit = null;
  for (var i = 0; i < assignments.length; i++) {
    if (assignments[i].id === id) {
      itemToEdit = assignments[i];
      break;
    }
  }

  if (!itemToEdit) return;

  // Fill form
  editIdInput.value = itemToEdit.id;
  subjectNameInput.value = itemToEdit.subject;
  courseCodeInput.value = itemToEdit.code;
  assignmentTypeInput.value = itemToEdit.type;
  assignmentTitleInput.value = itemToEdit.title;
  deadlineInput.value = itemToEdit.deadline;
  priorityInput.value = itemToEdit.priority;
  notesInput.value = itemToEdit.notes || '';

  // Change UI to Edit mode
  formTitle.textContent = '✏️ Edit Assignment';
  submitBtn.textContent = 'Update Assignment 💾';
  cancelEditBtn.classList.remove('hidden');

  // Smooth scroll into form view
  assignmentForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
  subjectNameInput.focus();
}

// Delete assignment with confirmation popup
function deleteAssignment(id) {
  var confirmDelete = confirm('Are you sure you want to delete this assignment?');
  if (!confirmDelete) return;

  var newAssignments = [];
  for (var i = 0; i < assignments.length; i++) {
    if (assignments[i].id !== id) {
      newAssignments.push(assignments[i]);
    }
  }

  assignments = newAssignments;
  saveAssignments();
  populateSubjectFilter();
  renderAssignments();

  // If in edit mode for this item, reset form
  if (editIdInput.value === id) {
    resetForm();
  }
}

// Toggle submitted status
function toggleAssignmentStatus(id) {
  for (var i = 0; i < assignments.length; i++) {
    if (assignments[i].id === id) {
      assignments[i].submitted = !assignments[i].submitted;
      break;
    }
  }

  saveAssignments();
  renderAssignments();
}


// ========================================================
// 8. EVENT DELEGATION & LISTENERS
// ========================================================

// Handle clicks inside assignments container (edit, delete, toggle)
assignmentsContainer.addEventListener('click', function(e) {
  var target = e.target;

  // Edit button
  if (target.classList.contains('btn-action-edit')) {
    var editId = target.getAttribute('data-id');
    startEditAssignment(editId);
    return;
  }

  // Delete button
  if (target.classList.contains('btn-action-delete')) {
    var deleteId = target.getAttribute('data-id');
    deleteAssignment(deleteId);
    return;
  }
});

// Handle checkbox toggle change
assignmentsContainer.addEventListener('change', function(e) {
  if (e.target.classList.contains('status-checkbox')) {
    var toggleId = e.target.getAttribute('data-id');
    toggleAssignmentStatus(toggleId);
  }
});

// Form submit event
assignmentForm.addEventListener('submit', handleFormSubmit);

// Cancel edit button
cancelEditBtn.addEventListener('click', resetForm);

// Search input events
searchInput.addEventListener('input', function() {
  if (searchInput.value.trim().length > 0) {
    clearSearchBtn.classList.remove('hidden');
  } else {
    clearSearchBtn.classList.add('hidden');
  }
  renderAssignments();
});

// Clear search button
clearSearchBtn.addEventListener('click', function() {
  searchInput.value = '';
  clearSearchBtn.classList.add('hidden');
  searchInput.focus();
  renderAssignments();
});

// Filter change events
statusFilter.addEventListener('change', renderAssignments);
subjectFilter.addEventListener('change', renderAssignments);
sortBy.addEventListener('change', renderAssignments);

// Clear All button with confirmation
clearAllBtn.addEventListener('click', function() {
  if (assignments.length === 0) return;
  var confirmClear = confirm('Are you sure you want to clear all assignments? This cannot be undone.');
  if (confirmClear) {
    assignments = [];
    saveAssignments();
    populateSubjectFilter();
    renderAssignments();
    resetForm();
  }
});

// Reset / Load Sample Data button
resetSamplesBtn.addEventListener('click', function() {
  var confirmReset = confirm('Load default LPU sample assignments? Any existing list will be replaced with samples.');
  if (confirmReset) {
    assignments = createSampleAssignments();
    saveAssignments();
    populateSubjectFilter();
    renderAssignments();
    resetForm();
  }
});


// ========================================================
// 9. DARK MODE THEME TOGGLE
// ========================================================

function applyTheme(isDark) {
  if (isDark) {
    document.body.classList.add('dark-mode');
    themeToggleBtn.textContent = '☀️ Light Mode';
    localStorage.setItem(THEME_KEY, 'dark');
  } else {
    document.body.classList.remove('dark-mode');
    themeToggleBtn.textContent = '🌙 Dark Mode';
    localStorage.setItem(THEME_KEY, 'light');
  }
}

themeToggleBtn.addEventListener('click', function() {
  var isCurrentlyDark = document.body.classList.contains('dark-mode');
  applyTheme(!isCurrentlyDark);
});

function initTheme() {
  var savedTheme = localStorage.getItem(THEME_KEY);
  if (savedTheme === 'dark') {
    applyTheme(true);
  } else {
    applyTheme(false);
  }
}


// ========================================================
// 10. INITIALIZATION & LIVE COUNTDOWN TIMER
// ========================================================

function initApp() {
  // 1. Initialize dark mode
  initTheme();

  // 2. Load assignments from localStorage or create sample data on first load
  var stored = getStoredAssignments();
  if (stored && Array.isArray(stored)) {
    assignments = stored;
  } else {
    // First time visitor - seed sample data
    assignments = createSampleAssignments();
    saveAssignments();
  }

  // 3. Set default deadline in form to tomorrow 5:00 PM
  var defaultDeadline = new Date();
  defaultDeadline.setDate(defaultDeadline.getDate() + 1);
  defaultDeadline.setHours(17, 0, 0, 0);
  deadlineInput.value = formatDateForInput(defaultDeadline);

  // 4. Populate subject filter & render assignments
  populateSubjectFilter();
  renderAssignments();

  // 5. Auto refresh countdowns every 60 seconds without reloading page
  setInterval(function() {
    renderAssignments();
  }, 60000);
}

// Start app when DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);
