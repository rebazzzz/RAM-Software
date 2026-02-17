// ============================================
// RAM Software - Book Call Page JavaScript
// ============================================

/**
 * Booking Page Calendar and Form Functionality
 */
const BookingPage = {
  currentDate: new Date(),
  selectedDate: null,
  unavailableDates: [], // Dates that are unavailable
  attachedFiles: [], // Store uploaded files
  autoSaveInterval: null,
  currentStep: 1,
  totalSteps: 3,

  init() {
    this.initCalendar();
    this.initForm();
    this.initStepNavigation();
    this.loadUnavailableDates();
    this.initCharacterCounter();
    this.initFileUpload();
    this.initAutoSave();
    this.loadSavedFormData();
    this.updateProgressIndicator();
  },

  /**
   * Initialize the calendar
   */
  initCalendar() {
    this.renderCalendar();

    // Month navigation
    document.getElementById("prev-month")?.addEventListener("click", () => {
      this.currentDate.setMonth(this.currentDate.getMonth() - 1);
      this.renderCalendar();
    });

    document.getElementById("next-month")?.addEventListener("click", () => {
      this.currentDate.setMonth(this.currentDate.getMonth() + 1);
      this.renderCalendar();
    });
  },

  /**
   * Render the calendar grid
   */
  renderCalendar() {
    const calendar = document.getElementById("calendar");
    const monthLabel = document.getElementById("current-month");
    if (!calendar || !monthLabel) return;

    // Update month label
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    monthLabel.textContent = `${monthNames[this.currentDate.getMonth()]} ${this.currentDate.getFullYear()}`;

    // Clear existing days (keep headers)
    const headers = calendar.querySelectorAll(".text-center");
    calendar.innerHTML = "";
    headers.forEach((h) => calendar.appendChild(h));

    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();

    // Get first day of month and total days
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Adjust for Monday start (0 = Sunday, so we need to shift)
    const startOffset = firstDay === 0 ? 6 : firstDay - 1;

    // Previous month days
    const prevMonthDays = new Date(year, month, 0).getDate();
    for (let i = startOffset - 1; i >= 0; i--) {
      const day = prevMonthDays - i;
      const btn = this.createDayButton(day, true);
      calendar.appendChild(btn);
    }

    // Current month days
    const today = new Date();
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const isToday = date.toDateString() === today.toDateString();
      const isUnavailable = this.isDateUnavailable(date);
      const isSelected =
        this.selectedDate &&
        date.toDateString() === this.selectedDate.toDateString();

      const btn = this.createDayButton(
        day,
        false,
        isToday,
        isUnavailable,
        isSelected,
      );

      if (!isUnavailable) {
        btn.addEventListener("click", () => this.selectDate(date, btn));
      }

      calendar.appendChild(btn);
    }

    // Next month days to fill grid
    const totalCells = startOffset + daysInMonth;
    const remainingCells = 42 - totalCells; // 6 rows * 7 days

    for (let day = 1; day <= remainingCells; day++) {
      const btn = this.createDayButton(day, true);
      calendar.appendChild(btn);
    }
  },

  /**
   * Create a calendar day button
   */
  createDayButton(
    day,
    isOtherMonth,
    isToday = false,
    isUnavailable = false,
    isSelected = false,
  ) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "calendar-day";
    btn.textContent = day;

    if (isOtherMonth) {
      btn.classList.add("text-gray-300");
      btn.disabled = true;
    } else if (isUnavailable) {
      btn.classList.add("text-gray-400", "cursor-not-allowed");
      btn.disabled = true;
      btn.title = "Not available";
    } else if (isSelected) {
      btn.classList.add("selected");
    } else if (isToday) {
      btn.classList.add("today");
    }

    return btn;
  },

  /**
   * Check if a date is unavailable
   */
  isDateUnavailable(date) {
    const day = date.getDay();
    // Weekend check (0 = Sunday, 6 = Saturday)
    if (day === 0 || day === 6) return true;

    // Past date check
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date < today) return true;

    // Check against unavailable dates array
    return this.unavailableDates.some(
      (unavailable) =>
        new Date(unavailable).toDateString() === date.toDateString(),
    );
  },

  /**
   * Handle date selection
   */
  selectDate(date, btnElement) {
    // Remove previous selection
    document.querySelectorAll(".calendar-day.selected").forEach((el) => {
      el.classList.remove("selected");
    });

    // Add selection to clicked button
    btnElement.classList.add("selected");

    // Store selected date
    this.selectedDate = date;
    document.getElementById("selected-date").value = date
      .toISOString()
      .split("T")[0];

    // Show time slots (simplified - in real app would show available times)
    this.showTimeSlots(date);
  },

  /**
   * Show available time slots for selected date
   */
  showTimeSlots(date) {
    // Remove existing time slots
    const existingSlots = document.getElementById("time-slots");
    if (existingSlots) existingSlots.remove();

    // Create time slots container
    const slotsContainer = document.createElement("div");
    slotsContainer.id = "time-slots";
    slotsContainer.className =
      "mt-6 pt-6 border-t border-gray-100 dark:border-gray-800 animate-fade-in";

    const times = ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"];

    slotsContainer.innerHTML = `
      <h4 class="font-bold text-sm mb-4">Available Times</h4>
      <div class="grid grid-cols-3 gap-2">
        ${times
          .map(
            (time) => `
          <button type="button" class="time-slot py-2 px-3 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-medium hover:border-primary hover:text-primary transition-colors" data-time="${time}">
            ${time}
          </button>
        `,
          )
          .join("")}
      </div>
    `;

    // Insert after calendar
    const calendarContainer = document.getElementById("calendar").parentElement;
    calendarContainer.parentElement.insertBefore(
      slotsContainer,
      calendarContainer.nextSibling,
    );

    // Add click handlers
    slotsContainer.querySelectorAll(".time-slot").forEach((slot) => {
      slot.addEventListener("click", (e) => {
        slotsContainer.querySelectorAll(".time-slot").forEach((s) => {
          s.classList.remove("bg-primary", "text-white", "border-primary");
          s.classList.add("border-gray-200", "dark:border-gray-700");
        });
        e.target.classList.remove("border-gray-200", "dark:border-gray-700");
        e.target.classList.add("bg-primary", "text-white", "border-primary");

        // Store selected time
        const selectedTime = e.target.dataset.time;
        document.getElementById("selected-date").value =
          `${date.toISOString().split("T")[0]}T${selectedTime}`;
      });
    });
  },

  /**
   * Load unavailable dates from API or local storage
   */
  loadUnavailableDates() {
    // Simulate loading unavailable dates
    // In production, this would fetch from your booking API
    const today = new Date();
    this.unavailableDates = [
      // Block out next 2 days as example
      new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() + 1,
      ).toISOString(),
      new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() + 2,
      ).toISOString(),
    ];
  },

  /**
   * Initialize step navigation
   */
  initStepNavigation() {
    // Next buttons
    document.getElementById("next-step-1")?.addEventListener("click", () => {
      if (this.validateStep(1)) {
        this.goToStep(2);
      }
    });

    document.getElementById("next-step-2")?.addEventListener("click", () => {
      if (this.validateStep(2)) {
        this.goToStep(3);
      }
    });

    // Previous buttons
    document
      .getElementById("prev-step-2")
      ?.addEventListener("click", () => this.goToStep(1));
    document
      .getElementById("prev-step-2-btn")
      ?.addEventListener("click", () => this.goToStep(1));
    document
      .getElementById("prev-step-3")
      ?.addEventListener("click", () => this.goToStep(2));
    document
      .getElementById("prev-step-3-btn")
      ?.addEventListener("click", () => this.goToStep(2));
  },

  /**
   * Navigate to a specific step
   */
  goToStep(step) {
    // Hide all steps
    document.querySelectorAll(".form-step").forEach((el) => {
      el.classList.add("hidden");
    });

    // Show target step
    const targetStep = document.getElementById(`step-${step}`);
    if (targetStep) {
      targetStep.classList.remove("hidden");
      targetStep.classList.add("animate-fade-in");
    }

    // Update step labels
    for (let i = 1; i <= this.totalSteps; i++) {
      const label = document.getElementById(`step-label-${i}`);
      if (label) {
        if (i === step) {
          label.classList.add("text-primary", "font-bold");
          label.classList.remove("text-muted");
        } else if (i < step) {
          label.classList.add("text-green-500");
          label.classList.remove("text-primary", "font-bold", "text-muted");
        } else {
          label.classList.add("text-muted");
          label.classList.remove("text-primary", "font-bold", "text-green-500");
        }
      }
    }

    // Update progress bar
    const progress = (step / this.totalSteps) * 100;
    const progressBar = document.getElementById("form-progress");
    if (progressBar) {
      progressBar.style.width = `${progress}%`;
    }

    this.currentStep = step;
    this.saveFormData(); // Save progress when changing steps
  },

  /**
   * Validate a specific step
   */
  validateStep(step) {
    const stepElement = document.getElementById(`step-${step}`);
    if (!stepElement) return false;

    let isValid = true;
    const requiredFields = stepElement.querySelectorAll(
      "input[required], textarea[required]",
    );

    requiredFields.forEach((field) => {
      if (!this.validateField(field)) {
        isValid = false;
      }
    });

    // Special validation for step 2 (service type)
    if (step === 2) {
      const serviceTypes = stepElement.querySelectorAll(
        'input[name="serviceType"]:checked',
      );
      if (serviceTypes.length === 0) {
        RAMSoftware.Utils.showToast(
          "Please select at least one service type.",
          "error",
        );
        isValid = false;
      }
    }

    if (!isValid) {
      RAMSoftware.Utils.showToast(
        "Please fill in all required fields before continuing.",
        "error",
      );
    }

    return isValid;
  },

  /**
   * Initialize form handling
   */
  initForm() {
    const form = document.getElementById("booking-form");
    if (!form) return;

    // Real-time validation on input
    form.querySelectorAll("input, textarea, select").forEach((field) => {
      field.addEventListener("input", () => {
        this.validateField(field);
      });
      field.addEventListener("blur", () => this.validateField(field));
    });

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      // Check honeypot (spam protection)
      const honeypot = document.getElementById("website-url");
      if (honeypot && honeypot.value) {
        console.log("Spam detected");
        return;
      }

      // Validate final step
      if (!this.validateStep(3)) {
        return;
      }

      // Validate date selection
      if (!this.selectedDate) {
        RAMSoftware.Utils.showToast(
          "Please select a date and time for your call.",
          "error",
        );
        return;
      }

      const submitBtn = document.getElementById("submit-btn");
      const originalText = submitBtn.innerHTML;

      // Show loading state
      submitBtn.disabled = true;
      submitBtn.innerHTML =
        '<span class="animate-spin inline-block mr-2">⟳</span> Processing...';

      try {
        // Collect comprehensive form data
        const formData = this.collectFormData();

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // Clear saved form data
        localStorage.removeItem("bookingFormData");

        // Show success message
        RAMSoftware.Utils.showToast(
          "Your project inquiry has been submitted! We'll be in touch within 24 hours.",
          "success",
        );

        // Reset form and go back to step 1
        form.reset();
        this.selectedDate = null;
        this.attachedFiles = [];
        this.updateFileList();
        document.querySelectorAll(".calendar-day.selected").forEach((el) => {
          el.classList.remove("selected");
        });
        const timeSlots = document.getElementById("time-slots");
        if (timeSlots) timeSlots.remove();
        this.goToStep(1);

        // In production, you would send this to your backend
        console.log("Booking data:", formData);
      } catch (error) {
        RAMSoftware.Utils.showToast(
          "Something went wrong. Please try again.",
          "error",
        );
        console.error("Booking error:", error);
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }
    });
  },

  /**
   * Validate a single field
   */
  validateField(field) {
    const value = field.value.trim();
    let isValid = true;

    // Remove previous error state
    field.classList.remove("border-red-500");

    // Required field validation
    if (field.hasAttribute("required") && !value) {
      isValid = false;
    }

    // Email validation
    if (field.type === "email" && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        isValid = false;
      }
    }

    // URL validation
    if (field.type === "url" && value) {
      try {
        new URL(value);
      } catch {
        isValid = false;
      }
    }

    // Phone validation (basic)
    if (field.type === "tel" && value) {
      const phoneRegex = /^[\d\s\-\+\(\)]+$/;
      if (!phoneRegex.test(value) || value.length < 10) {
        isValid = false;
      }
    }

    if (!isValid) {
      field.classList.add("border-red-500");
    }

    return isValid;
  },

  /**
   * Validate entire form
   */
  validateForm() {
    const form = document.getElementById("booking-form");
    let isValid = true;

    form
      .querySelectorAll("input[required], textarea[required]")
      .forEach((field) => {
        if (!this.validateField(field)) {
          isValid = false;
        }
      });

    return isValid;
  },

  /**
   * Collect all form data
   */
  collectFormData() {
    const form = document.getElementById("booking-form");
    const serviceTypes = Array.from(
      form.querySelectorAll('input[name="serviceType"]:checked'),
    ).map((cb) => cb.value);

    return {
      // Contact Information
      fullName: document.getElementById("fullName").value,
      email: document.getElementById("email").value,
      companyName: document.getElementById("companyName").value,
      jobTitle: document.getElementById("jobTitle").value,
      phone: document.getElementById("phone").value,
      website: document.getElementById("website").value,

      // Project Details
      serviceTypes: serviceTypes,
      budget: document.getElementById("budget").value,
      timeline: document.getElementById("timeline").value,
      teamSize: document.getElementById("teamSize").value,
      techStack: document.getElementById("techStack").value,
      projectDescription: document.getElementById("project").value,

      // Additional Context
      referralSource: document.getElementById("referral").value,
      contactTime: document.getElementById("contactTime").value,
      urgencyLevel:
        form.querySelector('input[name="urgency"]:checked')?.value || "medium",
      attachments: this.attachedFiles.map((f) => f.name),

      // Meeting Details
      selectedDate: document.getElementById("selected-date").value,
      submittedAt: new Date().toISOString(),
    };
  },

  /**
   * Initialize character counter for project description
   */
  initCharacterCounter() {
    const textarea = document.getElementById("project");
    const counter = document.getElementById("char-count");
    if (!textarea || !counter) return;

    textarea.addEventListener("input", () => {
      const length = textarea.value.length;
      counter.textContent = `${length} chars`;

      if (length < 50) {
        counter.classList.add("text-red-500");
        counter.classList.remove("text-muted", "text-green-500");
      } else if (length >= 50 && length < 200) {
        counter.classList.add("text-green-500");
        counter.classList.remove("text-muted", "text-red-500");
      } else {
        counter.classList.add("text-muted");
        counter.classList.remove("text-red-500", "text-green-500");
      }
    });
  },

  /**
   * Initialize file upload handling
   */
  initFileUpload() {
    const fileInput = document.getElementById("attachments");
    if (!fileInput) return;

    fileInput.addEventListener("change", (e) => {
      const files = Array.from(e.target.files);
      const maxSize = 10 * 1024 * 1024; // 10MB
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "image/png",
        "image/jpeg",
        "application/vnd.ms-powerpoint",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      ];

      files.forEach((file) => {
        // Check file size
        if (file.size > maxSize) {
          RAMSoftware.Utils.showToast(
            `${file.name} exceeds 10MB limit.`,
            "error",
          );
          return;
        }

        // Check file type
        if (!allowedTypes.includes(file.type)) {
          RAMSoftware.Utils.showToast(
            `${file.name} is not a supported file type.`,
            "error",
          );
          return;
        }

        // Add to attached files
        this.attachedFiles.push(file);
      });

      this.updateFileList();

      // Reset input to allow selecting same files again
      fileInput.value = "";
    });
  },

  /**
   * Update file list display
   */
  updateFileList() {
    const fileList = document.getElementById("file-list");
    if (!fileList) return;

    if (this.attachedFiles.length === 0) {
      fileList.innerHTML = "";
      return;
    }

    fileList.innerHTML = this.attachedFiles
      .map(
        (file, index) => `
        <div class="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm">
          <div class="flex items-center gap-2 overflow-hidden">
            <span class="material-symbols-outlined text-primary text-base">description</span>
            <span class="truncate">${file.name}</span>
            <span class="text-muted text-xs">(${(file.size / 1024 / 1024).toFixed(2)} MB)</span>
          </div>
          <button type="button" onclick="BookingPage.removeFile(${index})" class="text-red-500 hover:text-red-700 p-1">
            <span class="material-symbols-outlined text-base">close</span>
          </button>
        </div>
      `,
      )
      .join("");
  },

  /**
   * Remove a file from the list
   */
  removeFile(index) {
    this.attachedFiles.splice(index, 1);
    this.updateFileList();
  },

  /**
   * Initialize auto-save functionality
   */
  initAutoSave() {
    // Auto-save every 30 seconds
    this.autoSaveInterval = setInterval(() => {
      this.saveFormData();
    }, 30000);

    // Save on page unload
    window.addEventListener("beforeunload", () => {
      this.saveFormData();
    });
  },

  /**
   * Save form data to localStorage
   */
  saveFormData() {
    const form = document.getElementById("booking-form");
    if (!form) return;

    const formData = {};
    form.querySelectorAll("input, textarea, select").forEach((field) => {
      if (field.type === "checkbox") {
        if (field.name) {
          if (!formData[field.name]) formData[field.name] = [];
          if (field.checked) formData[field.name].push(field.value);
        }
      } else if (field.type === "radio") {
        if (field.checked) {
          formData[field.name] = field.value;
        }
      } else if (field.type !== "file" && field.id !== "website-url") {
        formData[field.id || field.name] = field.value;
      }
    });

    localStorage.setItem("bookingFormData", JSON.stringify(formData));

    // Show auto-save indicator
    const indicator = document.getElementById("auto-save-indicator");
    if (indicator) {
      indicator.classList.remove("opacity-0");
      setTimeout(() => {
        indicator.classList.add("opacity-0");
      }, 2000);
    }
  },

  /**
   * Load saved form data from localStorage
   */
  loadSavedFormData() {
    const saved = localStorage.getItem("bookingFormData");
    if (!saved) return;

    try {
      const formData = JSON.parse(saved);
      const form = document.getElementById("booking-form");

      Object.entries(formData).forEach(([key, value]) => {
        const field =
          document.getElementById(key) || form.querySelector(`[name="${key}"]`);
        if (!field) return;

        if (Array.isArray(value)) {
          // Handle checkboxes
          value.forEach((val) => {
            const checkbox = form.querySelector(
              `[name="${key}"][value="${val}"]`,
            );
            if (checkbox) checkbox.checked = true;
          });
        } else if (field.type === "radio") {
          const radio = form.querySelector(`[name="${key}"][value="${value}"]`);
          if (radio) radio.checked = true;
        } else {
          field.value = value;
        }
      });

      // Update character counter if project description exists
      const projectDesc = document.getElementById("project");
      if (projectDesc && projectDesc.value) {
        projectDesc.dispatchEvent(new Event("input"));
      }

      this.updateProgressIndicator();
    } catch (error) {
      console.error("Error loading saved form data:", error);
    }
  },

  /**
   * Update progress indicator based on current step
   */
  updateProgressIndicator() {
    // Progress is now based on current step in multi-step form
    const progress = (this.currentStep / this.totalSteps) * 100;
    const progressBar = document.getElementById("form-progress");
    if (progressBar) {
      progressBar.style.width = `${progress}%`;
    }

    // Update step labels
    for (let i = 1; i <= this.totalSteps; i++) {
      const label = document.getElementById(`step-label-${i}`);
      if (label) {
        if (i === this.currentStep) {
          label.classList.add("text-primary", "font-bold");
          label.classList.remove("text-muted", "text-green-500");
        } else if (i < this.currentStep) {
          label.classList.add("text-green-500");
          label.classList.remove("text-primary", "font-bold", "text-muted");
        } else {
          label.classList.add("text-muted");
          label.classList.remove("text-primary", "font-bold", "text-green-500");
        }
      }
    }
  },
};

// Initialize when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  BookingPage.init();
});
