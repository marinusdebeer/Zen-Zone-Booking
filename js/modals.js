// modals.js

document.addEventListener("DOMContentLoaded", () => {
  loadModals()
    .then(() => {
      setupModalEventListeners();
      // Dispatch the custom event after modals are loaded
      const modalsLoadedEvent = new Event("modalsLoaded");
      document.dispatchEvent(modalsLoadedEvent);
    })
    .catch((error) => console.error("Error loading modals:", error));
});

/**
 * Load modals.html and append its content to the body
 */
function loadModals() {
  return fetch("modals.html")
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Failed to load modals.html: ${response.status} ${response.statusText}`);
      }
      return response.text();
    })
    .then((data) => {
      const modalContainer = document.createElement("div");
      modalContainer.innerHTML = data;
      document.body.appendChild(modalContainer);
    });
}

/**
 * Setup Event Listeners for Modal Interactions
 */
function setupModalEventListeners() {

  // Function to open a modal
  window.openModal = function (modalId) {
    const modalBg = document.getElementById(modalId);
    if (modalBg) {
      modalBg.style.display = "flex";
      document.body.classList.add("modal-open");
      trapFocus(modalBg);
    } else {
      console.warn(`Modal with ID "${modalId}" not found.`);
    }
  };

  // Function to close a modal
  window.closeModal = function (modalBg) {
    if (modalBg) {
      modalBg.style.display = "none";
      document.body.classList.remove("modal-open");
      releaseFocus();
    }
  };

  // Setup open modal buttons (buttons with IDs starting with 'open' or class 'book-now')
  const openModalButtons = document.querySelectorAll("[id^='open'], .book-now");
  openModalButtons.forEach((button) => {
    button.addEventListener("click", () => {
      let modalId = "";

      // Special handling for 'openModal' and 'openModal2' to open 'modalBg'
      if (button.id === "openModal" || button.id === "openModal2" || button.classList.contains("book-now")) {
        modalId = "modalBg";
      } else {
        // Remove 'open' prefix and lowercase the first character
        const baseId = button.id.replace(/^open/, ""); // e.g., 'TermsModal'
        modalId = baseId.charAt(0).toLowerCase() + baseId.slice(1); // e.g., 'termsModal'
      }

      openModal(modalId);
    });
  });

  // Setup close modal buttons (elements with class 'modal-close')
  const closeModalButtons = document.querySelectorAll(".modal-close");
  closeModalButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const modalBg = button.closest(".modal-bg");
      if (modalBg) {
        closeModal(modalBg);
      }
    });
  });

  // Close modal when clicking outside the modal content
  const modalBgs = document.querySelectorAll(".modal-bg");
  modalBgs.forEach((modalBg) => {
    modalBg.addEventListener("click", (e) => {
      if (e.target === modalBg) {
        closeModal(modalBg);
      }
    });
  });

  // Close modal on Escape key press
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      const openModals = document.querySelectorAll(".modal-bg[style*='display: flex']");
      openModals.forEach((modalBg) => {
        closeModal(modalBg);
      });
    }
  });

  // Setup event listeners for "Learn More" service buttons
  const learnMoreButtons = document.querySelectorAll(".learn-more-btn");
  learnMoreButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const service = button.getAttribute("data-service");
      const modalId = `serviceModal${service}`;
      openModal(modalId);
    });
  });

  // Setup event listeners for "Read More" blog buttons
  const readMoreBlogButtons = document.querySelectorAll(".learn-more-blog-btn");
  readMoreBlogButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const blog = button.getAttribute("data-blog");
      const modalId = `blogModal${blog}`;
      openModal(modalId);
    });
  });

  // Setup event listeners for "Book Now" buttons within service modals
  const bookNowButtons = document.querySelectorAll(".cta-button.book-now");
  bookNowButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const serviceModal = button.closest(".service-modal");
      if (serviceModal) {
        // Get service name from the modal’s <h2>
        const serviceName = serviceModal.querySelector("h2").innerText;
        // Close the current service modal
        closeModal(serviceModal);
        // Open booking modal
        openModal("modalBg");
        // Pre-fill the service selection
        const serviceSelect = document.getElementById("service");
        if (serviceSelect) {
          serviceSelect.value = serviceName;
        }
      }
    });
  });
  
  document.getElementById('name').addEventListener('blur', async function() {
    const userInput = this.value;
  
    if (!userInput.trim()) return;
  
    const data = { input: userInput };
  
    try {
      const response = await fetch('https://script.google.com/macros/s/AKfycbwWg_vtKuY4D2oYkFnkiM8dHtnzCA-hI4rohd_Ca37OElkDEqTgl4SckYrUyzJyhKGF/exec', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
  
      if (response.ok) {
        console.log('Data sent successfully!');
      } else {
        console.error('Failed to send data.');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  });
  
}

/**
 * Trap focus within the modal for accessibility
 */
let focusedElementBeforeModal;

function trapFocus(modal) {
  const focusableElementsString =
    'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex="0"], [contenteditable]';
  const focusableElements = modal.querySelectorAll(focusableElementsString);

  if (focusableElements.length === 0) return;

  const firstFocusableElement = focusableElements[0];
  const lastFocusableElement = focusableElements[focusableElements.length - 1];

  focusedElementBeforeModal = document.activeElement;

  function handleFocus(e) {
    if (e.key !== "Tab") return;

    if (e.shiftKey) {
      // Shift + Tab
      if (document.activeElement === firstFocusableElement) {
        e.preventDefault();
        lastFocusableElement.focus();
      }
    } else {
      // Tab
      if (document.activeElement === lastFocusableElement) {
        e.preventDefault();
        firstFocusableElement.focus();
      }
    }
  }

  modal.addEventListener("keydown", handleFocus);
  firstFocusableElement.focus();

  // Store the handler to remove later
  modal._handleFocus = handleFocus;
}

/**
 * Release focus and return to the previously focused element
 */
function releaseFocus() {
  const modal = document.querySelector(".modal-bg[style*='display: flex']");
  if (modal && modal._handleFocus) {
    modal.removeEventListener("keydown", modal._handleFocus);
    if (focusedElementBeforeModal) focusedElementBeforeModal.focus();
  }
}
