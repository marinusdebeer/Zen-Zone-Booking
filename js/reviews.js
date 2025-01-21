// reviews.js

document.addEventListener("DOMContentLoaded", () => {
  initializeReviewsNavigation();
  makeReviewsClickable();
});


function makeReviewsClickable() {
  const googleBusinessURL = "https://maps.app.goo.gl/EyMWdSuMsExvrxaG7"; // Your Google Business Profile URL
  const reviewCards = document.querySelectorAll(".review");

  reviewCards.forEach((card) => {
    card.addEventListener("click", (e) => {
      // Prevent redirect if the click is on a button or link inside the card
      if (
        e.target.closest("button") ||
        e.target.closest("a") ||
        e.target.tagName.toLowerCase() === "label"
      ) {
        return; // Do nothing, allowing the button/link to function normally
      }

      // Open the Google Business Profile in a new tab
      window.open(googleBusinessURL, "_blank", "noopener,noreferrer");
    });

    // Optional: Enhance Accessibility by allowing keyboard navigation
    card.setAttribute("tabindex", "0"); // Make the card focusable
    card.setAttribute("role", "button"); // Indicate the role

    // Handle 'Enter' and 'Space' key presses
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        window.open(googleBusinessURL, "_blank", "noopener,noreferrer");
      }
    });
  });
}
/**
 * Setup Navigation Arrows Functionality
 */
function initializeReviewsNavigation() {
  const leftArrow = document.querySelector(".reviews-nav.left");
  const rightArrow = document.querySelector(".reviews-nav.right");
  const reviewsContainer = document.querySelector(".reviews-container");

  if (!leftArrow || !rightArrow || !reviewsContainer) {
    console.error("Reviews navigation elements not found.");
    return;
  }

  /**
   * Calculate the amount to scroll based on review card width and gap
   * @returns {number} Scroll amount in pixels
   */
  const calculateScrollAmount = () => {
    const reviewCard = reviewsContainer.querySelector(".review");
    if (reviewCard) {
      const cardStyle = window.getComputedStyle(reviewCard);
      const cardWidth = reviewCard.offsetWidth;
      const gap = parseInt(cardStyle.marginRight) || 20; // Default gap if not set
      return cardWidth + gap;
    }
    return 320; // Fallback value if no review cards found
  };

  let scrollAmount = calculateScrollAmount();

  /**
   * Update scroll amount on window resize
   */
  window.addEventListener("resize", () => {
    scrollAmount = calculateScrollAmount();
    updateArrowsVisibility();
  });

  /**
   * Event listener for left arrow
   */
  leftArrow.addEventListener("click", () => {
    reviewsContainer.scrollBy({
      left: -scrollAmount,
      behavior: "smooth",
    });
  });

  /**
   * Event listener for right arrow
   */
  rightArrow.addEventListener("click", () => {
    reviewsContainer.scrollBy({
      left: scrollAmount,
      behavior: "smooth",
    });
  });

  /**
   * Function to update the visibility of navigation arrows based on scroll position
   */
  const updateArrowsVisibility = () => {
    const maxScrollLeft = reviewsContainer.scrollWidth - reviewsContainer.clientWidth;
    leftArrow.style.display = reviewsContainer.scrollLeft > 0 ? "flex" : "none";
    rightArrow.style.display = reviewsContainer.scrollLeft < maxScrollLeft ? "flex" : "none";
  };

  /**
   * Initial arrow visibility
   */
  updateArrowsVisibility();

  /**
   * Update arrow visibility on scroll
   */
  reviewsContainer.addEventListener("scroll", updateArrowsVisibility);

  /**
   * Keyboard Accessibility: Allow navigation via Enter or Space keys
   */
  const handleKeyDown = (event, direction) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      reviewsContainer.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  leftArrow.addEventListener("keydown", (event) => handleKeyDown(event, "left"));
  rightArrow.addEventListener("keydown", (event) => handleKeyDown(event, "right"));
}
