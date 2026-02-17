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

  init() {
    this.initCalendar();
    this.initForm();
    this.loadUnavailableDates();
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
   * Initialize form handling
   */
  initForm() {
    const form = document.getElementById("booking-form");
    if (!form) return;

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      // Validate date selection
      if (!this.selectedDate) {
        RAMSoftware.Utils.showToast(
          "Please select a date and time for your call.",
          "error",
        );
        return;
      }

      const submitBtn = form.querySelector('[type="submit"]');
      const originalText = submitBtn.innerHTML;

      // Show loading state
      submitBtn.disabled = true;
      submitBtn.innerHTML =
        '<span class="animate-spin inline-block mr-2">⟳</span> Processing...';

      try {
        // Collect form data
        const formData = {
          name: document.getElementById("fullName").value,
          email: document.getElementById("email").value,
          website: document.getElementById("website").value,
          project: document.getElementById("project").value,
          date: document.getElementById("selected-date").value,
        };

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Show success message
        RAMSoftware.Utils.showToast(
          "Your strategy call has been booked! Check your email for confirmation.",
          "success",
        );

        // Reset form
        form.reset();
        this.selectedDate = null;
        document.querySelectorAll(".calendar-day.selected").forEach((el) => {
          el.classList.remove("selected");
        });
        const timeSlots = document.getElementById("time-slots");
        if (timeSlots) timeSlots.remove();

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

    // Real-time validation
    const emailInput = document.getElementById("email");
    if (emailInput) {
      emailInput.addEventListener("blur", () => {
        if (
          emailInput.value &&
          !RAMSoftware.Utils.isValidEmail(emailInput.value)
        ) {
          emailInput.classList.add("border-red-500");
          RAMSoftware.Utils.showToast(
            "Please enter a valid email address",
            "error",
          );
        } else {
          emailInput.classList.remove("border-red-500");
        }
      });
    }
  },
};

// Initialize when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  BookingPage.init();
});
