/**
 * HOSTEL LAUNDRY SLOT MANAGER - JAVASCRIPT
 * Vanilla JavaScript • Zero External Dependencies • 100% Functionable
 */

(function () {
  'use strict';

  // --- 1. Initial State & Data Definitions ---
  const TIME_SLOTS = [
    '06:00 AM - 07:30 AM',
    '07:30 AM - 09:00 AM',
    '09:00 AM - 10:30 AM',
    '10:30 AM - 12:00 PM',
    '12:00 PM - 01:30 PM',
    '01:30 PM - 03:00 PM',
    '03:00 PM - 04:30 PM',
    '04:30 PM - 06:00 PM',
    '06:00 PM - 07:30 PM',
    '07:30 PM - 09:00 PM',
    '09:00 PM - 10:30 PM'
  ];

  const INITIAL_MACHINES = [
    {
      id: 'WM-101',
      name: 'Washer 101',
      type: 'Front Load',
      capacity: '7 kg',
      block: 'Block A',
      location: 'Block A - Ground Floor Laundry Hall',
      status: 'Available',
      specs: ['45m Eco Cycle', 'Hot Water', 'Sanitized']
    },
    {
      id: 'WM-102',
      name: 'Washer 102',
      type: 'Front Load',
      capacity: '8 kg',
      block: 'Block A',
      location: 'Block A - Ground Floor Laundry Hall',
      status: 'Available',
      specs: ['Express Wash', 'Steam Clean', 'Low Noise']
    },
    {
      id: 'WM-103',
      name: 'Washer 103',
      type: 'Top Load',
      capacity: '8 kg',
      block: 'Block A',
      location: 'Block A - 1st Floor Wash Annex',
      status: 'Booked',
      specs: ['Heavy Agitator', 'Quick Spin', 'Sanitized']
    },
    {
      id: 'WM-104',
      name: 'Washer 104',
      type: 'Heavy Duty Combo',
      capacity: '10 kg',
      block: 'Block A',
      location: 'Block A - 1st Floor Wash Annex',
      status: 'Out of Service',
      specs: ['Bedding Special', 'Dryer Built-in', 'Under Repair'],
      oosReason: 'Drum belt replacement scheduled by maintenance team'
    },
    {
      id: 'WM-201',
      name: 'Washer 201',
      type: 'Front Load',
      capacity: '7 kg',
      block: 'Block B',
      location: 'Block B - Ground Floor Room 12',
      status: 'Available',
      specs: ['Gentle Spin', 'Eco Friendly', 'Sanitized']
    },
    {
      id: 'WM-202',
      name: 'Washer 202',
      type: 'Top Load',
      capacity: '9 kg',
      block: 'Block B',
      location: 'Block B - 1st Floor Balcony Wing',
      status: 'Booked',
      specs: ['Rapid 30m Cycle', 'Double Rinse', 'Hot Water']
    },
    {
      id: 'WM-203',
      name: 'Washer 203',
      type: 'Front Load',
      capacity: '6 kg',
      block: 'Block B',
      location: 'Block B - 2nd Floor Laundry Corner',
      status: 'Available',
      specs: ['Silent Inverter', 'Anti-Allergy', 'Sanitized']
    },
    {
      id: 'WM-301',
      name: 'Washer 301',
      type: 'Heavy Duty Combo',
      capacity: '10 kg',
      block: 'Basement',
      location: 'Central Basement Laundry Center',
      status: 'Available',
      specs: ['Duvet Specialist', 'Steam Sanitizer', 'High Spin']
    },
    {
      id: 'WM-302',
      name: 'Washer 302',
      type: 'Top Load',
      capacity: '7 kg',
      block: 'Basement',
      location: 'Central Basement Laundry Center',
      status: 'Out of Service',
      specs: ['Dual Pulse', 'Auto Detergent', 'Under Repair'],
      oosReason: 'Water intake valve inspection in progress'
    },
    {
      id: 'WM-303',
      name: 'Washer 303',
      type: 'Front Load',
      capacity: '8 kg',
      block: 'Basement',
      location: 'Central Basement Laundry Center',
      status: 'Available',
      specs: ['TurboWash 360', 'Fabric Guard', 'Sanitized']
    }
  ];

  // Helper date functions
  function formatDateISO(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  function formatDisplayDate(dateStr) {
    const parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;
    const date = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
  }

  const today = new Date();
  const todayISO = formatDateISO(today);

  // Initial seed bookings for today
  const INITIAL_BOOKINGS = [
    {
      id: 'HW-8491',
      studentName: 'Rahul Sharma',
      roomNo: 'A-102',
      rollNo: '2024CS112',
      machineId: 'WM-103',
      date: todayISO,
      timeSlot: '09:00 AM - 10:30 AM',
      cycleType: 'Normal Cotton',
      createdAt: '2026-10-09 07:15 AM',
      status: 'Upcoming'
    },
    {
      id: 'HW-8492',
      studentName: 'Priya Nair',
      roomNo: 'B-214',
      rollNo: '2024EE045',
      machineId: 'WM-202',
      date: todayISO,
      timeSlot: '10:30 AM - 12:00 PM',
      cycleType: 'Quick Express',
      createdAt: '2026-10-09 08:30 AM',
      status: 'Upcoming'
    },
    {
      id: 'HW-8493',
      studentName: 'David Chen',
      roomNo: 'A-305',
      rollNo: '2023ME091',
      machineId: 'WM-101',
      date: todayISO,
      timeSlot: '03:00 PM - 04:30 PM',
      cycleType: 'Bedding / Sheets',
      createdAt: '2026-10-09 09:10 AM',
      status: 'Upcoming'
    }
  ];

  // Load from LocalStorage or initialize
  let machines = [];
  try {
    const savedMachines = localStorage.getItem('hostel_laundry_machines');
    machines = savedMachines ? JSON.parse(savedMachines) : JSON.parse(JSON.stringify(INITIAL_MACHINES));
  } catch (e) {
    machines = JSON.parse(JSON.stringify(INITIAL_MACHINES));
  }

  let bookings = [];
  try {
    const savedBookings = localStorage.getItem('hostel_laundry_bookings');
    bookings = savedBookings ? JSON.parse(savedBookings) : JSON.parse(JSON.stringify(INITIAL_BOOKINGS));
  } catch (e) {
    bookings = JSON.parse(JSON.stringify(INITIAL_BOOKINGS));
  }

  function saveState() {
    try {
      localStorage.setItem('hostel_laundry_machines', JSON.stringify(machines));
      localStorage.setItem('hostel_laundry_bookings', JSON.stringify(bookings));
    } catch (e) {
      console.warn('Storage error', e);
    }
  }

  // --- 2. State & Variables ---
  let selectedDate = todayISO;
  let selectedSlot = '07:30 AM - 09:00 AM';
  let selectedMachineId = 'WM-101';
  let machineSearchQuery = '';
  let machineStatusFilter = 'ALL';
  let machineTypeFilter = 'ALL';
  let machineBlockFilter = 'ALL';
  let bookingSearchQuery = '';
  let bookingStatusFilter = 'ALL';
  let pendingCancelBookingId = null;

  // Intro washer simulation state
  let washerSpinningFast = false;
  let currentWashModeIndex = 0;
  const washModes = [
    { name: 'COTTON 40°', time: '45 MIN', speed: '800 RPM' },
    { name: 'EXPRESS 30°', time: '28 MIN', speed: '1000 RPM' },
    { name: 'HEAVY 60°', time: '60 MIN', speed: '1200 RPM' },
    { name: 'DELICATE 20°', time: '35 MIN', speed: '600 RPM' }
  ];

  // --- 3. DOM Elements Cache ---
  const el = {
    // Nav
    mobileMenuBtn: document.getElementById('mobile-menu-btn'),
    mobileNavDrawer: document.getElementById('mobile-nav-drawer'),
    navBookingsCount: document.getElementById('nav-bookings-count'),
    mobileBookingsCount: document.getElementById('mobile-bookings-count'),
    navBookBtn: document.getElementById('nav-book-btn'),

    // Hero / Intro Washer
    washerDisplayMode: document.getElementById('washer-display-mode'),
    washerDisplayTime: document.getElementById('washer-display-time'),
    washerDrumInner: document.getElementById('washer-drum-inner'),
    washerKnob: document.getElementById('washer-knob'),
    washerSpinBtn: document.getElementById('washer-spin-btn'),
    washerBubbleBtn: document.getElementById('washer-bubble-btn'),
    washerCycleBtn: document.getElementById('washer-cycle-btn'),
    washerDoor: document.getElementById('washer-door'),
    bubbleContainer: document.getElementById('bubble-container'),
    heroBookCta: document.getElementById('hero-book-cta'),
    heroExploreCta: document.getElementById('hero-explore-cta'),

    // Dashboard metrics
    statTotal: document.getElementById('stat-total'),
    statAvailable: document.getElementById('stat-available'),
    statBooked: document.getElementById('stat-booked'),
    statOos: document.getElementById('stat-oos'),
    occupancyPercentText: document.getElementById('occupancy-percent-text'),
    progressAvail: document.getElementById('progress-avail'),
    progressBooked: document.getElementById('progress-booked'),
    progressOos: document.getElementById('progress-oos'),
    quickBlockFilters: document.getElementById('quick-block-filters'),

    // Machine listing
    machineSearchInput: document.getElementById('machine-search-input'),
    machineSearchClearBtn: document.getElementById('machine-search-clear-btn'),
    machineStatusFilter: document.getElementById('machine-status-filter'),
    machineTypeFilter: document.getElementById('machine-type-filter'),
    resetFiltersBtn: document.getElementById('reset-filters-btn'),
    machinesGrid: document.getElementById('machines-grid'),
    machinesCountDisplay: document.getElementById('machines-count-display'),
    machineEmptyState: document.getElementById('machine-empty-state'),
    emptySearchTerm: document.getElementById('empty-search-term'),
    emptyStateResetBtn: document.getElementById('empty-state-reset-btn'),

    // Booking form & slot selector
    dayChoiceBtns: document.querySelectorAll('.day-choice-btn'),
    customDateInput: document.getElementById('custom-date-input'),
    slotsGrid: document.getElementById('slots-grid'),
    selectedSlotLabel: document.getElementById('selected-slot-label'),
    bookingForm: document.getElementById('booking-form'),
    formStudentName: document.getElementById('form-student-name'),
    formRoomNo: document.getElementById('form-room-no'),
    formMachineSelect: document.getElementById('form-machine-select'),
    formCycleSelect: document.getElementById('form-cycle-select'),
    formDateDisplay: document.getElementById('form-date-display'),
    formSlotDisplay: document.getElementById('form-slot-display'),
    summaryMachine: document.getElementById('summary-machine'),
    summaryDate: document.getElementById('summary-date'),
    summarySlot: document.getElementById('summary-slot'),
    submitBookingBtn: document.getElementById('submit-booking-btn'),
    resetBookingBtn: document.getElementById('reset-booking-btn'),

    // My Bookings
    bookingSearchInput: document.getElementById('booking-search-input'),
    bookingFilterStatus: document.getElementById('booking-filter-status'),
    bookingsGrid: document.getElementById('bookings-grid'),
    bookingsEmptyState: document.getElementById('bookings-empty-state'),
    bookingsEmptyResetBtn: document.getElementById('bookings-empty-reset-btn'),

    // Modals
    doubleBookingModal: document.getElementById('double-booking-modal'),
    dbModalConflictMachine: document.getElementById('db-conflict-machine'),
    dbModalConflictDate: document.getElementById('db-conflict-date'),
    dbModalConflictSlot: document.getElementById('db-conflict-slot'),
    dbModalConflictStudent: document.getElementById('db-conflict-student'),
    dbModalAltChips: document.getElementById('db-alt-chips'),
    dbModalDismissBtn: document.getElementById('db-modal-dismiss-btn'),
    dbModalCloseTopBtn: document.getElementById('db-modal-close-top'),

    cancelModal: document.getElementById('cancel-modal'),
    cancelModalDetails: document.getElementById('cancel-modal-details'),
    cancelConfirmBtn: document.getElementById('cancel-confirm-btn'),
    cancelDismissBtn: document.getElementById('cancel-dismiss-btn'),

    passModal: document.getElementById('pass-modal'),
    passModalContent: document.getElementById('pass-modal-content'),
    passPrintBtn: document.getElementById('pass-print-btn'),
    passCloseBtn: document.getElementById('pass-close-btn'),

    reportIssueModal: document.getElementById('report-issue-modal'),
    reportModalCloseBtn: document.getElementById('report-modal-close-btn'),
    reportCancelBtn: document.getElementById('report-cancel-btn'),
    reportSubmitBtn: document.getElementById('report-submit-btn'),
    reportMachineSelect: document.getElementById('report-machine-select'),
    reportIssueDesc: document.getElementById('report-issue-desc'),
    footerReportBtn: document.getElementById('footer-report-btn'),

    // Utilities
    toastContainer: document.getElementById('toast-container'),
    scrollTopBtn: document.getElementById('scroll-top-btn')
  };

  // --- 4. Toast Notification Utility ---
  function showToast(message, type = 'info') {
    if (!el.toastContainer) return;
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    let iconSvg = '';
    if (type === 'success') {
      iconSvg = `<svg width="20" height="20" fill="none" stroke="#10b981" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>`;
    } else if (type === 'error') {
      iconSvg = `<svg width="20" height="20" fill="none" stroke="#ef4444" stroke-width="2.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4m0 4h.01"/></svg>`;
    } else {
      iconSvg = `<svg width="20" height="20" fill="none" stroke="#38bdf8" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path stroke-linecap="round" stroke-linejoin="round" d="M12 16v-4m0-4h.01"/></svg>`;
    }

    toast.innerHTML = `${iconSvg}<span>${message}</span>`;
    el.toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      setTimeout(() => toast.remove(), 300);
    }, 3800);
  }

  // --- 5. Status Calculation & Double Booking Verification ---
  /**
   * Returns whether a machine is booked for a specific date and timeSlot
   */
  function isMachineBookedFor(machineId, date, slot) {
    return bookings.some(b => b.machineId === machineId && b.date === date && b.timeSlot === slot);
  }

  /**
   * Returns booking record for a machine at a specific date and slot
   */
  function getBookingRecord(machineId, date, slot) {
    return bookings.find(b => b.machineId === machineId && b.date === date && b.timeSlot === slot);
  }

  /**
   * Determine machine's dynamic status
   * If machine is Out of Service, it stays Out of Service.
   * If it has a booking for the chosen date & slot, it's Booked.
   * Otherwise, Available.
   */
  function getMachineEffectiveStatus(machine, date = selectedDate, slot = selectedSlot) {
    if (machine.status === 'Out of Service') return 'Out of Service';
    if (isMachineBookedFor(machine.id, date, slot)) return 'Booked';
    return 'Available';
  }

  // --- 6. Render Dashboard Metrics ---
  function renderDashboard() {
    const total = machines.length;
    let oosCount = 0;
    let bookedCount = 0;
    let availableCount = 0;

    machines.forEach(m => {
      if (m.status === 'Out of Service') {
        oosCount++;
      } else if (isMachineBookedFor(m.id, selectedDate, selectedSlot)) {
        bookedCount++;
      } else {
        availableCount++;
      }
    });

    if (el.statTotal) el.statTotal.textContent = total;
    if (el.statAvailable) el.statAvailable.textContent = availableCount;
    if (el.statBooked) el.statBooked.textContent = bookedCount;
    if (el.statOos) el.statOos.textContent = oosCount;

    // Occupancy bar
    const availPercent = Math.round((availableCount / total) * 100);
    const bookedPercent = Math.round((bookedCount / total) * 100);
    const oosPercent = Math.round((oosCount / total) * 100);

    if (el.occupancyPercentText) {
      el.occupancyPercentText.textContent = `${availPercent}% Ready for Laundry`;
    }
    if (el.progressAvail) el.progressAvail.style.width = `${availPercent}%`;
    if (el.progressBooked) el.progressBooked.style.width = `${bookedPercent}%`;
    if (el.progressOos) el.progressOos.style.width = `${oosPercent}%`;

    // Update nav counters
    const activeCount = bookings.length;
    if (el.navBookingsCount) el.navBookingsCount.textContent = activeCount;
    if (el.mobileBookingsCount) el.mobileBookingsCount.textContent = activeCount;
  }

  // --- 7. Render Machine Listing ---
  function renderMachines() {
    if (!el.machinesGrid) return;

    // Filter machines
    const filtered = machines.filter(m => {
      const effStatus = getMachineEffectiveStatus(m, selectedDate, selectedSlot);

      // Search query (number or location)
      const q = machineSearchQuery.trim().toLowerCase();
      if (q) {
        const matchesId = m.id.toLowerCase().includes(q);
        const matchesName = m.name.toLowerCase().includes(q);
        const matchesLoc = m.location.toLowerCase().includes(q);
        const matchesBlock = m.block.toLowerCase().includes(q);
        if (!matchesId && !matchesName && !matchesLoc && !matchesBlock) return false;
      }

      // Status filter
      if (machineStatusFilter !== 'ALL' && effStatus.toUpperCase() !== machineStatusFilter.toUpperCase()) {
        return false;
      }

      // Type filter
      if (machineTypeFilter !== 'ALL' && m.type.toLowerCase() !== machineTypeFilter.toLowerCase()) {
        return false;
      }

      // Block filter
      if (machineBlockFilter !== 'ALL' && !m.block.toLowerCase().includes(machineBlockFilter.toLowerCase())) {
        return false;
      }

      return true;
    });

    if (el.machinesCountDisplay) {
      el.machinesCountDisplay.innerHTML = `Showing <strong>${filtered.length}</strong> of ${machines.length} machines`;
    }

    if (filtered.length === 0) {
      el.machinesGrid.innerHTML = '';
      if (el.machineEmptyState) {
        el.machineEmptyState.style.display = 'flex';
        if (el.emptySearchTerm) {
          el.emptySearchTerm.textContent = machineSearchQuery.trim() ? `"${machineSearchQuery.trim()}"` : 'selected filters';
        }
      }
      return;
    }

    if (el.machineEmptyState) {
      el.machineEmptyState.style.display = 'none';
    }

    el.machinesGrid.innerHTML = filtered.map(m => {
      const status = getMachineEffectiveStatus(m, selectedDate, selectedSlot);
      let statusClass = 'status-available';
      let badgeClass = 'badge-available';
      let statusLabel = 'Available';
      let statusIcon = `<svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>`;
      let btnHtml = '';

      if (status === 'Out of Service') {
        statusClass = 'status-oos';
        badgeClass = 'badge-oos';
        statusLabel = 'Out of Service';
        statusIcon = `<svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 9l-6 6m0-6l6 6"/></svg>`;
        btnHtml = `
          <button class="btn btn-secondary btn-block btn-sm" disabled title="${m.oosReason || 'Under maintenance'}">
            <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>
            Maintenance Unavailable
          </button>
        `;
      } else if (status === 'Booked') {
        statusClass = 'status-booked';
        badgeClass = 'badge-booked';
        statusLabel = 'Booked';
        statusIcon = `<svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`;
        btnHtml = `
          <button class="btn btn-secondary btn-block btn-sm action-book-machine-btn" data-machine-id="${m.id}" title="Select machine to view alternate slots">
            <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            Slot Occupied • Pick Another Slot
          </button>
        `;
      } else {
        // Available
        btnHtml = `
          <button class="btn btn-primary btn-block btn-sm action-book-machine-btn" data-machine-id="${m.id}">
            <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/></svg>
            Select & Book Machine
          </button>
        `;
      }

      const specsChips = m.specs.map(s => `<span class="spec-chip">${s}</span>`).join('');

      return `
        <div class="machine-card ${statusClass}">
          <div class="machine-card-header">
            <div class="machine-id-group">
              <div class="machine-icon-wrap">
                <svg width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <rect x="4" y="2" width="16" height="20" rx="3"/>
                  <circle cx="12" cy="13" r="5"/>
                  <path d="M12 15a2 2 0 100-4 2 2 0 000 4z"/>
                  <circle cx="8" cy="6" r="1" fill="currentColor"/>
                </svg>
              </div>
              <div>
                <h3 class="machine-number">${m.id}</h3>
                <span class="machine-type-tag">${m.type} • ${m.capacity}</span>
              </div>
            </div>
            <span class="status-pill ${badgeClass}">
              ${statusIcon}
              ${statusLabel}
            </span>
          </div>

          <div class="machine-location-row">
            <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
            <span>${m.location}</span>
          </div>

          <div class="machine-features-pills">
            ${specsChips}
          </div>

          <div class="machine-card-footer">
            ${btnHtml}
          </div>
        </div>
      `;
    }).join('');

    // Attach click listeners to machine book buttons
    el.machinesGrid.querySelectorAll('.action-book-machine-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const machineId = btn.getAttribute('data-machine-id');
        selectMachineAndScroll(machineId);
      });
    });
  }

  // --- 8. Date and Time Selection Handlers ---
  function initDatePickers() {
    // Configure date picker bounds
    if (el.customDateInput) {
      el.customDateInput.min = todayISO;
      const maxDate = new Date();
      maxDate.setDate(maxDate.getDate() + 7);
      el.customDateInput.max = formatDateISO(maxDate);
      el.customDateInput.value = selectedDate;

      el.customDateInput.addEventListener('change', (e) => {
        if (e.target.value) {
          updateSelectedDate(e.target.value);
        }
      });
    }

    // Set dates for the 3 quick buttons
    const dayNames = ['Today', 'Tomorrow', 'Day After'];
    el.dayChoiceBtns.forEach((btn, index) => {
      const d = new Date();
      d.setDate(d.getDate() + index);
      const iso = formatDateISO(d);
      btn.setAttribute('data-date', iso);

      const nameEl = btn.querySelector('.day-name');
      const dateEl = btn.querySelector('.day-date');
      if (nameEl) nameEl.textContent = dayNames[index];
      if (dateEl) {
        dateEl.textContent = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      }

      btn.addEventListener('click', () => {
        updateSelectedDate(iso);
      });
    });

    updateSelectedDate(selectedDate);
  }

  function updateSelectedDate(newDate) {
    selectedDate = newDate;
    if (el.customDateInput) el.customDateInput.value = selectedDate;

    el.dayChoiceBtns.forEach(btn => {
      if (btn.getAttribute('data-date') === selectedDate) {
        btn.classList.add('selected');
      } else {
        btn.classList.remove('selected');
      }
    });

    const displayStr = formatDisplayDate(selectedDate);
    if (el.formDateDisplay) el.formDateDisplay.textContent = displayStr;
    if (el.summaryDate) el.summaryDate.textContent = displayStr;

    renderTimeSlots();
    renderDashboard();
    renderMachines();
  }

  function renderTimeSlots() {
    if (!el.slotsGrid) return;

    el.slotsGrid.innerHTML = TIME_SLOTS.map(slot => {
      const isOccupied = isMachineBookedFor(selectedMachineId, selectedDate, slot);
      const isSelected = selectedSlot === slot;
      let slotClass = isOccupied ? 'occupied' : 'free';
      if (isSelected) slotClass += ' selected';

      const tagText = isOccupied ? 'Taken' : 'Open';

      return `
        <button type="button" class="slot-pill ${slotClass}" data-slot="${slot}" ${isOccupied ? 'title="Machine is currently booked for this slot"' : ''}>
          <span class="slot-time-text">${slot}</span>
          <span class="slot-status-tag">${isSelected ? 'Chosen' : tagText}</span>
        </button>
      `;
    }).join('');

    // Attach slot click listener
    el.slotsGrid.querySelectorAll('.slot-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        const slot = btn.getAttribute('data-slot');
        selectSlot(slot);
      });
    });

    if (el.selectedSlotLabel) el.selectedSlotLabel.textContent = selectedSlot;
    if (el.formSlotDisplay) el.formSlotDisplay.textContent = selectedSlot;
    if (el.summarySlot) el.summarySlot.textContent = selectedSlot;
  }

  function selectSlot(slot) {
    selectedSlot = slot;
    renderTimeSlots();
    renderDashboard();
    renderMachines();
  }

  function selectMachineAndScroll(machineId) {
    selectedMachineId = machineId;
    if (el.formMachineSelect) {
      el.formMachineSelect.value = machineId;
    }
    updateMachineSummary();
    renderTimeSlots();
    renderDashboard();
    renderMachines();

    // Scroll smoothly to booking form
    const bookSection = document.getElementById('book-slot');
    if (bookSection) {
      bookSection.scrollIntoView({ behavior: 'smooth' });
    }
  }

  function updateMachineSummary() {
    const m = machines.find(item => item.id === selectedMachineId);
    if (m && el.summaryMachine) {
      el.summaryMachine.textContent = `${m.id} (${m.type} • ${m.capacity})`;
    }
  }

  // Populate Machine Selection Dropdown in Form
  function populateMachineDropdown() {
    if (!el.formMachineSelect) return;
    el.formMachineSelect.innerHTML = machines.map(m => {
      const oos = m.status === 'Out of Service' ? ' [OUT OF SERVICE]' : '';
      return `<option value="${m.id}" ${m.status === 'Out of Service' ? 'data-oos="true"' : ''}>${m.id} - ${m.type} (${m.location})${oos}</option>`;
    }).join('');

    el.formMachineSelect.value = selectedMachineId;
    updateMachineSummary();

    el.formMachineSelect.addEventListener('change', (e) => {
      selectedMachineId = e.target.value;
      updateMachineSummary();
      renderTimeSlots();
      renderMachines();
    });
  }

  // --- 9. Prevent Double Booking & Red Warning Pop-Up Logic ---
  function showDoubleBookingModal(machineId, date, slot, conflictingBooking) {
    if (!el.doubleBookingModal) return;

    const m = machines.find(x => x.id === machineId) || { id: machineId, name: 'Machine' };
    if (el.dbModalConflictMachine) el.dbModalConflictMachine.textContent = `${m.id} (${m.type || 'Washer'})`;
    if (el.dbModalConflictDate) el.dbModalConflictDate.textContent = formatDisplayDate(date);
    if (el.dbModalConflictSlot) el.dbModalConflictSlot.textContent = slot;
    if (el.dbModalConflictStudent) {
      el.dbModalConflictStudent.textContent = conflictingBooking
        ? `${conflictingBooking.studentName} (Room ${conflictingBooking.roomNo})`
        : 'Another Student';
    }

    // Find available alternative machines for that exact date & time slot
    const altMachines = machines.filter(item => {
      return item.id !== machineId &&
             item.status !== 'Out of Service' &&
             !isMachineBookedFor(item.id, date, slot);
    });

    if (el.dbModalAltChips) {
      if (altMachines.length > 0) {
        el.dbModalAltChips.innerHTML = altMachines.map(alt => `
          <button type="button" class="alt-machine-chip action-btn" data-alt-id="${alt.id}">
            Book ${alt.id} (${alt.type})
          </button>
        `).join('');

        el.dbModalAltChips.querySelectorAll('.alt-machine-chip').forEach(chip => {
          chip.addEventListener('click', () => {
            const chosenId = chip.getAttribute('data-alt-id');
            selectMachineAndScroll(chosenId);
            hideDoubleBookingModal();
            showToast(`Switched to ${chosenId}. Slot is open for booking!`, 'info');
          });
        });
      } else {
        el.dbModalAltChips.innerHTML = `<span style="font-size: 0.8125rem; color: #991b1b;">All other machines are also fully booked for this time slot. Please pick an alternative time slot.</span>`;
      }
    }

    el.doubleBookingModal.classList.add('active');
  }

  function hideDoubleBookingModal() {
    if (el.doubleBookingModal) {
      el.doubleBookingModal.classList.remove('active');
    }
  }

  // --- 10. Form Validation & Booking Submission ---
  function setupBookingForm() {
    if (!el.bookingForm) return;

    el.bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const studentName = el.formStudentName ? el.formStudentName.value.trim() : '';
      const roomNo = el.formRoomNo ? el.formRoomNo.value.trim() : '';
      const cycleType = el.formCycleSelect ? el.formCycleSelect.value : 'Normal Cotton';
      const machineId = selectedMachineId;
      const date = selectedDate;
      const slot = selectedSlot;

      let hasError = false;

      // Validation 1: Student Name
      const nameError = document.getElementById('name-error');
      if (!studentName) {
        el.formStudentName.classList.add('input-error');
        if (nameError) nameError.classList.add('visible');
        hasError = true;
      } else {
        el.formStudentName.classList.remove('input-error');
        if (nameError) nameError.classList.remove('visible');
      }

      // Validation 2: Room Number
      const roomError = document.getElementById('room-error');
      if (!roomNo) {
        el.formRoomNo.classList.add('input-error');
        if (roomError) roomError.classList.add('visible');
        hasError = true;
      } else {
        el.formRoomNo.classList.remove('input-error');
        if (roomError) roomError.classList.remove('visible');
      }

      if (hasError) {
        showToast('Please fill in all required fields.', 'error');
        return;
      }

      // Validation 3: Check Out of Service
      const targetMachine = machines.find(m => m.id === machineId);
      if (!targetMachine || targetMachine.status === 'Out of Service') {
        showToast(`Machine ${machineId} is currently out of service. Please pick an available machine.`, 'error');
        return;
      }

      // Validation 4: PREVENT DOUBLE BOOKING (Critical Requirement)
      const existingConflict = getBookingRecord(machineId, date, slot);
      if (existingConflict) {
        // Trigger Red Warning Pop-Up!
        showDoubleBookingModal(machineId, date, slot, existingConflict);
        return;
      }

      // Success: Create new booking record
      const randomCode = Math.floor(1000 + Math.random() * 9000);
      const newBooking = {
        id: `HW-${randomCode}`,
        studentName,
        roomNo,
        rollNo: `HOSTEL-${roomNo.replace(/\s+/g, '')}`,
        machineId,
        date,
        timeSlot: slot,
        cycleType,
        createdAt: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        status: 'Upcoming'
      };

      bookings.unshift(newBooking);
      saveState();

      // Update UI
      showToast(`Success! Machine ${machineId} reserved for ${formatDisplayDate(date)} (${slot}).`, 'success');
      renderDashboard();
      renderMachines();
      renderTimeSlots();
      renderBookings();

      // Reset text inputs
      if (el.formStudentName) el.formStudentName.value = '';
      if (el.formRoomNo) el.formRoomNo.value = '';

      // Scroll to bookings section to show newly created reservation
      const myBookingsSection = document.getElementById('my-bookings');
      if (myBookingsSection) {
        myBookingsSection.scrollIntoView({ behavior: 'smooth' });
      }
    });

    if (el.resetBookingBtn) {
      el.resetBookingBtn.addEventListener('click', () => {
        if (el.formStudentName) el.formStudentName.value = '';
        if (el.formRoomNo) el.formRoomNo.value = '';
        document.querySelectorAll('.input-error').forEach(input => input.classList.remove('input-error'));
        document.querySelectorAll('.field-error-msg').forEach(msg => msg.classList.remove('visible'));
        showToast('Booking form cleared.', 'info');
      });
    }
  }

  // --- 11. My Bookings Listing & Cancellation ---
  function renderBookings() {
    if (!el.bookingsGrid) return;

    const filtered = bookings.filter(b => {
      // Search filter
      const q = bookingSearchQuery.trim().toLowerCase();
      if (q) {
        const matchesName = b.studentName.toLowerCase().includes(q);
        const matchesRoom = b.roomNo.toLowerCase().includes(q);
        const matchesId = b.id.toLowerCase().includes(q);
        const matchesMachine = b.machineId.toLowerCase().includes(q);
        if (!matchesName && !matchesRoom && !matchesId && !matchesMachine) return false;
      }

      // Status filter
      if (bookingStatusFilter !== 'ALL' && b.status.toUpperCase() !== bookingStatusFilter.toUpperCase()) {
        return false;
      }

      return true;
    });

    if (filtered.length === 0) {
      el.bookingsGrid.innerHTML = '';
      if (el.bookingsEmptyState) el.bookingsEmptyState.style.display = 'flex';
      return;
    }

    if (el.bookingsEmptyState) el.bookingsEmptyState.style.display = 'none';

    el.bookingsGrid.innerHTML = filtered.map(b => {
      const machine = machines.find(m => m.id === b.machineId) || { id: b.machineId, location: 'Hostel Block' };

      return `
        <div class="booking-card">
          <div class="booking-card-top">
            <span class="booking-code">${b.id}</span>
            <span class="booking-status-badge booking-status-active">
              <span class="pulse-dot"></span>
              ${b.status}
            </span>
          </div>

          <div class="booking-details-list">
            <div class="detail-line">
              <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <rect x="4" y="2" width="16" height="20" rx="3"/>
                <circle cx="12" cy="13" r="5"/>
              </svg>
              <div>
                <strong>${b.machineId}</strong> <span>• ${machine.location}</span>
              </div>
            </div>

            <div class="detail-line">
              <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
              </svg>
              <div>
                <strong>${b.studentName}</strong> <span>(Room ${b.roomNo})</span>
              </div>
            </div>

            <div class="detail-line">
              <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              <div>
                <strong>${formatDisplayDate(b.date)}</strong>
              </div>
            </div>

            <div class="detail-line">
              <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
              <div>
                <strong>${b.timeSlot}</strong> <span>• ${b.cycleType}</span>
              </div>
            </div>
          </div>

          <div class="booking-card-actions">
            <button type="button" class="btn btn-secondary btn-sm action-view-pass" data-booking-id="${b.id}">
              <svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
              </svg>
              View Pass
            </button>

            <button type="button" class="btn btn-danger btn-sm action-cancel-booking" data-booking-id="${b.id}" style="margin-left: auto;">
              <svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
              </svg>
              Cancel Slot
            </button>
          </div>
        </div>
      `;
    }).join('');

    // Attach Pass & Cancel button handlers
    el.bookingsGrid.querySelectorAll('.action-view-pass').forEach(btn => {
      btn.addEventListener('click', () => {
        const bId = btn.getAttribute('data-booking-id');
        openBookingPassModal(bId);
      });
    });

    el.bookingsGrid.querySelectorAll('.action-cancel-booking').forEach(btn => {
      btn.addEventListener('click', () => {
        const bId = btn.getAttribute('data-booking-id');
        openCancelModal(bId);
      });
    });
  }

  // Cancel Booking Modal
  function openCancelModal(bookingId) {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking || !el.cancelModal) return;

    pendingCancelBookingId = bookingId;
    if (el.cancelModalDetails) {
      el.cancelModalDetails.innerHTML = `
        <strong>Reference: ${booking.id}</strong><br>
        Machine: <strong>${booking.machineId}</strong> on <strong>${formatDisplayDate(booking.date)}</strong><br>
        Slot: <strong>${booking.timeSlot}</strong><br>
        Student: <strong>${booking.studentName} (Room ${booking.roomNo})</strong>
      `;
    }

    el.cancelModal.classList.add('active');
  }

  function hideCancelModal() {
    if (el.cancelModal) el.cancelModal.classList.remove('active');
    pendingCancelBookingId = null;
  }

  function confirmCancelBooking() {
    if (!pendingCancelBookingId) return;

    const b = bookings.find(item => item.id === pendingCancelBookingId);
    if (b) {
      const machineId = b.machineId;
      bookings = bookings.filter(item => item.id !== pendingCancelBookingId);
      saveState();

      hideCancelModal();
      showToast(`Booking ${b.id} for ${machineId} cancelled. Slot is now free!`, 'success');

      renderDashboard();
      renderMachines();
      renderTimeSlots();
      renderBookings();
    }
  }

  // Booking Pass Modal
  function openBookingPassModal(bookingId) {
    const b = bookings.find(item => item.id === bookingId);
    if (!b || !el.passModal || !el.passModalContent) return;

    const m = machines.find(item => item.id === b.machineId) || { id: b.machineId, location: 'Hostel Hall' };

    el.passModalContent.innerHTML = `
      <div class="pass-ticket">
        <div class="pass-header">
          <div>
            <span class="pass-seal">HOSTEL LAUNDRY E-PASS</span>
            <h4 style="font-size: 1.15rem; font-weight: 800; color: #0f172a;">${b.id}</h4>
          </div>
          <span class="status-pill badge-available">CONFIRMED</span>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; font-size: 0.875rem;">
          <div>
            <span style="color: #64748b; font-size: 0.75rem; font-weight: 700;">STUDENT</span><br>
            <strong>${b.studentName}</strong>
          </div>
          <div>
            <span style="color: #64748b; font-size: 0.75rem; font-weight: 700;">ROOM NO</span><br>
            <strong>${b.roomNo}</strong>
          </div>
          <div>
            <span style="color: #64748b; font-size: 0.75rem; font-weight: 700;">MACHINE</span><br>
            <strong>${b.machineId}</strong>
          </div>
          <div>
            <span style="color: #64748b; font-size: 0.75rem; font-weight: 700;">CYCLE</span><br>
            <strong>${b.cycleType}</strong>
          </div>
          <div style="grid-column: 1 / -1;">
            <span style="color: #64748b; font-size: 0.75rem; font-weight: 700;">DATE & TIME SLOT</span><br>
            <strong style="color: #2563eb;">${formatDisplayDate(b.date)} • ${b.timeSlot}</strong>
          </div>
          <div style="grid-column: 1 / -1;">
            <span style="color: #64748b; font-size: 0.75rem; font-weight: 700;">LOCATION</span><br>
            <span>${m.location}</span>
          </div>
        </div>

        <div class="qr-visual-placeholder">
          <svg width="74" height="74" viewBox="0 0 24 24" fill="none" stroke="#0f172a" stroke-width="1.8">
            <rect x="3" y="3" width="7" height="7"/>
            <rect x="14" y="3" width="7" height="7"/>
            <rect x="3" y="14" width="7" height="7"/>
            <rect x="14" y="14" width="3" height="3"/>
            <rect x="18" y="18" width="3" height="3"/>
            <rect x="14" y="18" width="3" height="3"/>
            <rect x="18" y="14" width="3" height="3"/>
          </svg>
        </div>

        <div style="text-align: center; font-size: 0.75rem; color: #64748b;">
          Present this pass to the Hostel Laundry Warden if requested.
        </div>
      </div>
    `;

    el.passModal.classList.add('active');
  }

  function hidePassModal() {
    if (el.passModal) el.passModal.classList.remove('active');
  }

  // --- 12. Interactive Intro Animation (Washing Machine Simulator) ---
  function setupIntroSimulator() {
    // 1. Toggle Fast Spin
    if (el.washerSpinBtn) {
      el.washerSpinBtn.addEventListener('click', () => {
        washerSpinningFast = !washerSpinningFast;
        if (washerSpinningFast) {
          el.washerDrumInner.classList.add('fast-spin');
          el.washerSpinBtn.classList.add('active');
          el.washerSpinBtn.innerHTML = `
            <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
            Normal Spin
          `;
          if (el.washerDisplayMode) el.washerDisplayMode.textContent = 'HIGH SPIN 1400';
          spawnBubbles(8);
          showToast('Washer drum set to High Speed Spin!', 'info');
        } else {
          el.washerDrumInner.classList.remove('fast-spin');
          el.washerSpinBtn.classList.remove('active');
          el.washerSpinBtn.innerHTML = `
            <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/><path d="M15.91 11.6l-6-3.46A1 1 0 008.5 9v6a1 1 0 001.41.86l6-3.46a1 1 0 000-1.8z"/></svg>
            Start Fast Spin
          `;
          const currentMode = washModes[currentWashModeIndex];
          if (el.washerDisplayMode) el.washerDisplayMode.textContent = currentMode.name;
        }
      });
    }

    // 2. Spawn Bubbles Button
    if (el.washerBubbleBtn) {
      el.washerBubbleBtn.addEventListener('click', () => {
        spawnBubbles(14);
        showToast('Fresh detergent soap bubbles injected into drum!', 'info');
      });
    }

    // 3. Cycle Mode Button
    if (el.washerCycleBtn) {
      el.washerCycleBtn.addEventListener('click', () => {
        currentWashModeIndex = (currentWashModeIndex + 1) % washModes.length;
        const mode = washModes[currentWashModeIndex];

        if (el.washerDisplayMode) el.washerDisplayMode.textContent = mode.name;
        if (el.washerDisplayTime) el.washerDisplayTime.textContent = mode.time;

        // Rotate Knob
        if (el.washerKnob) {
          el.washerKnob.style.transform = `rotate(${currentWashModeIndex * 90}deg)`;
        }

        spawnBubbles(5);
        showToast(`Simulator cycle changed to ${mode.name}`, 'info');
      });
    }

    // 4. Click on washer door directly
    if (el.washerDoor) {
      el.washerDoor.addEventListener('click', () => {
        spawnBubbles(10);
        el.washerDrumInner.classList.add('fast-spin');
        setTimeout(() => {
          if (!washerSpinningFast) {
            el.washerDrumInner.classList.remove('fast-spin');
          }
        }, 1200);
      });
    }
  }

  function spawnBubbles(count) {
    if (!el.bubbleContainer) return;

    for (let i = 0; i < count; i++) {
      const bubble = document.createElement('div');
      bubble.className = 'bubble';
      const size = Math.floor(Math.random() * 18) + 8;
      bubble.style.width = `${size}px`;
      bubble.style.height = `${size}px`;
      bubble.style.left = `${Math.floor(Math.random() * 85) + 5}%`;
      bubble.style.animationDuration = `${(Math.random() * 1.5 + 1.2).toFixed(1)}s`;
      bubble.style.animationDelay = `${(Math.random() * 0.4).toFixed(1)}s`;

      el.bubbleContainer.appendChild(bubble);

      setTimeout(() => {
        bubble.remove();
      }, 3000);
    }
  }

  // --- 13. Search and Filter Event Listeners ---
  function setupSearchAndFilters() {
    // Search input
    if (el.machineSearchInput) {
      el.machineSearchInput.addEventListener('input', (e) => {
        machineSearchQuery = e.target.value;
        if (el.machineSearchClearBtn) {
          if (machineSearchQuery.length > 0) {
            el.machineSearchClearBtn.classList.add('visible');
          } else {
            el.machineSearchClearBtn.classList.remove('visible');
          }
        }
        renderMachines();
      });
    }

    // Clear search button
    if (el.machineSearchClearBtn) {
      el.machineSearchClearBtn.addEventListener('click', () => {
        if (el.machineSearchInput) el.machineSearchInput.value = '';
        machineSearchQuery = '';
        el.machineSearchClearBtn.classList.remove('visible');
        renderMachines();
      });
    }

    // Status filter dropdown
    if (el.machineStatusFilter) {
      el.machineStatusFilter.addEventListener('change', (e) => {
        machineStatusFilter = e.target.value;
        renderMachines();
      });
    }

    // Type filter dropdown
    if (el.machineTypeFilter) {
      el.machineTypeFilter.addEventListener('change', (e) => {
        machineTypeFilter = e.target.value;
        renderMachines();
      });
    }

    // Reset filters button
    if (el.resetFiltersBtn) {
      el.resetFiltersBtn.addEventListener('click', resetAllMachineFilters);
    }

    // Empty state reset button
    if (el.emptyStateResetBtn) {
      el.emptyStateResetBtn.addEventListener('click', resetAllMachineFilters);
    }

    // Quick block filter buttons
    if (el.quickBlockFilters) {
      el.quickBlockFilters.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          el.quickBlockFilters.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          machineBlockFilter = btn.getAttribute('data-block');
          renderMachines();

          // Scroll down to machine list
          const machinesSection = document.getElementById('machines');
          if (machinesSection) machinesSection.scrollIntoView({ behavior: 'smooth' });
        });
      });
    }

    // My Bookings search and filter
    if (el.bookingSearchInput) {
      el.bookingSearchInput.addEventListener('input', (e) => {
        bookingSearchQuery = e.target.value;
        renderBookings();
      });
    }

    if (el.bookingFilterStatus) {
      el.bookingFilterStatus.addEventListener('change', (e) => {
        bookingStatusFilter = e.target.value;
        renderBookings();
      });
    }

    if (el.bookingsEmptyResetBtn) {
      el.bookingsEmptyResetBtn.addEventListener('click', () => {
        if (el.bookingSearchInput) el.bookingSearchInput.value = '';
        if (el.bookingFilterStatus) el.bookingFilterStatus.value = 'ALL';
        bookingSearchQuery = '';
        bookingStatusFilter = 'ALL';
        renderBookings();

        // Scroll to booking form
        const bookSection = document.getElementById('book-slot');
        if (bookSection) bookSection.scrollIntoView({ behavior: 'smooth' });
      });
    }
  }

  function resetAllMachineFilters() {
    if (el.machineSearchInput) el.machineSearchInput.value = '';
    if (el.machineSearchClearBtn) el.machineSearchClearBtn.classList.remove('visible');
    if (el.machineStatusFilter) el.machineStatusFilter.value = 'ALL';
    if (el.machineTypeFilter) el.machineTypeFilter.value = 'ALL';

    machineSearchQuery = '';
    machineStatusFilter = 'ALL';
    machineTypeFilter = 'ALL';
    machineBlockFilter = 'ALL';

    if (el.quickBlockFilters) {
      el.quickBlockFilters.querySelectorAll('.filter-btn').forEach(b => {
        if (b.getAttribute('data-block') === 'ALL') b.classList.add('active');
        else b.classList.remove('active');
      });
    }

    renderMachines();
    showToast('Machine search and filters reset.', 'info');
  }

  // --- 14. Navigation & Modals Event Listeners ---
  function setupNavigationAndModals() {
    // Mobile hamburger menu toggle
    if (el.mobileMenuBtn && el.mobileNavDrawer) {
      el.mobileMenuBtn.addEventListener('click', () => {
        el.mobileNavDrawer.classList.toggle('open');
      });

      // Close mobile menu when link is clicked
      el.mobileNavDrawer.querySelectorAll('.mobile-nav-link').forEach(link => {
        link.addEventListener('click', () => {
          el.mobileNavDrawer.classList.remove('open');
        });
      });
    }

    // Nav "Book a Slot" Quick Button
    if (el.navBookBtn) {
      el.navBookBtn.addEventListener('click', () => {
        const bookSec = document.getElementById('book-slot');
        if (bookSec) bookSec.scrollIntoView({ behavior: 'smooth' });
        if (el.formStudentName) el.formStudentName.focus();
      });
    }

    // Hero buttons
    if (el.heroBookCta) {
      el.heroBookCta.addEventListener('click', () => {
        const bookSec = document.getElementById('book-slot');
        if (bookSec) bookSec.scrollIntoView({ behavior: 'smooth' });
      });
    }

    if (el.heroExploreCta) {
      el.heroExploreCta.addEventListener('click', () => {
        const machinesSec = document.getElementById('machines');
        if (machinesSec) machinesSec.scrollIntoView({ behavior: 'smooth' });
      });
    }

    // Red Double Booking Modal Close Buttons
    if (el.dbModalDismissBtn) el.dbModalDismissBtn.addEventListener('click', hideDoubleBookingModal);
    if (el.dbModalCloseTopBtn) el.dbModalCloseTopBtn.addEventListener('click', hideDoubleBookingModal);

    // Cancel Modal Buttons
    if (el.cancelConfirmBtn) el.cancelConfirmBtn.addEventListener('click', confirmCancelBooking);
    if (el.cancelDismissBtn) el.cancelDismissBtn.addEventListener('click', hideCancelModal);

    // Pass Modal Buttons
    if (el.passCloseBtn) el.passCloseBtn.addEventListener('click', hidePassModal);
    if (el.passPrintBtn) {
      el.passPrintBtn.addEventListener('click', () => {
        window.print();
      });
    }

    // Report Maintenance Issue Modal
    if (el.footerReportBtn && el.reportIssueModal) {
      el.footerReportBtn.addEventListener('click', () => {
        if (el.reportMachineSelect) {
          el.reportMachineSelect.innerHTML = machines.map(m => `
            <option value="${m.id}">${m.id} - ${m.location}</option>
          `).join('');
        }
        el.reportIssueModal.classList.add('active');
      });
    }

    if (el.reportModalCloseBtn) el.reportModalCloseBtn.addEventListener('click', hideReportModal);
    if (el.reportCancelBtn) el.reportCancelBtn.addEventListener('click', hideReportModal);
    if (el.reportSubmitBtn) {
      el.reportSubmitBtn.addEventListener('click', () => {
        const mId = el.reportMachineSelect ? el.reportMachineSelect.value : 'WM-101';
        const desc = el.reportIssueDesc ? el.reportIssueDesc.value.trim() : '';

        if (!desc) {
          showToast('Please briefly describe the malfunction.', 'error');
          return;
        }

        // Mark machine as Out of Service
        const target = machines.find(m => m.id === mId);
        if (target) {
          target.status = 'Out of Service';
          target.oosReason = desc;
          saveState();
        }

        hideReportModal();
        if (el.reportIssueDesc) el.reportIssueDesc.value = '';
        showToast(`Report logged. ${mId} status updated to Out of Service. Maintenance notified!`, 'success');
        renderDashboard();
        renderMachines();
        renderTimeSlots();
      });
    }

    function hideReportModal() {
      if (el.reportIssueModal) el.reportIssueModal.classList.remove('active');
    }

    // Scroll to top button
    if (el.scrollTopBtn) {
      window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
          el.scrollTopBtn.classList.add('visible');
        } else {
          el.scrollTopBtn.classList.remove('visible');
        }
      });

      el.scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
  }

  // --- 15. Initial Bootstrapping ---
  function init() {
    initDatePickers();
    populateMachineDropdown();
    renderDashboard();
    renderMachines();
    renderTimeSlots();
    renderBookings();
    setupBookingForm();
    setupSearchAndFilters();
    setupNavigationAndModals();
    setupIntroSimulator();

    // Initial gentle bubble animation
    setTimeout(() => spawnBubbles(6), 600);
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
