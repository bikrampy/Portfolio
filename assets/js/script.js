// =========================================
// PART 1: Mobile Menu Toggle
// =========================================
const menuBtn = document.getElementById("menu-btn");
const mobileMenu = document.getElementById("mobile-menu");

if (menuBtn && mobileMenu) {
  menuBtn.addEventListener("click", () => {
    mobileMenu.classList.toggle("hidden");
  });
}

// =========================================
// PART 2: Smooth Scrolling & Active Link
// =========================================
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav-link");

const observerOptions = { threshold: 0.3 };

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute("id");
      navLinks.forEach((link) => {
        link.classList.remove("text-white", "font-semibold");
        link.classList.add("text-slate-300");
        if (link.getAttribute("href") === "#" + id) {
          link.classList.remove("text-slate-300");
          link.classList.add("text-white", "font-semibold");
        }
      });
    }
  });
}, observerOptions);

sections.forEach((section) => observer.observe(section));

// =========================================
// PART 3: Timeline "Elevator" Logic
// =========================================
function initTimeline(timelineEl) {
  const dot = timelineEl.querySelector(".timeline-dot");
  const steps = Array.from(timelineEl.querySelectorAll(".roadmap-step"));

  if (!dot || steps.length === 0) return;

  function getStepCenters() {
    const timelineRect = timelineEl.getBoundingClientRect();
    return steps.map((step) => {
      const stepRect = step.getBoundingClientRect();
      return (stepRect.top + stepRect.bottom) / 2 - timelineRect.top;
    });
  }

  function updateDotPosition() {
    const centers = getStepCenters();
    const timelineRect = timelineEl.getBoundingClientRect();
    const viewportMiddle = window.innerHeight / 2 - timelineRect.top;

    let bestIndex = 0;
    let minDistance = Infinity;

    centers.forEach((center, index) => {
      const dist = Math.abs(center - viewportMiddle);
      if (dist < minDistance) {
        minDistance = dist;
        bestIndex = index;
      }
    });

    const targetY =
      centers[Math.max(0, Math.min(bestIndex, centers.length - 1))];
    dot.style.top = `${targetY}px`;

    // Highlight active text
    steps.forEach((step, i) => {
      const textDiv =
        step.querySelector(".text-white") || step.firstElementChild;
      if (textDiv) {
        if (i === bestIndex) {
          textDiv.classList.add("text-primary-blue");
          textDiv.classList.remove("text-white");
        } else {
          textDiv.classList.remove("text-primary-blue");
          textDiv.classList.add("text-white");
        }
      }
    });
  }

  window.addEventListener("scroll", updateDotPosition);
  window.addEventListener("resize", updateDotPosition);
  updateDotPosition();
}
document.querySelectorAll(".timeline").forEach(initTimeline);

// =========================================
// PART 4: REAL EMAILJS FUNCTIONALITY
// =========================================
const form = document.getElementById("contact-form");
const sendBtn = document.getElementById("send-btn"); // Ensure your button has id="send-btn"
const statusText = document.getElementById("contact-status");

if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault(); // Stop page reload

    // 1. UI Feedback: "Sending..."
    const originalBtnText = sendBtn ? sendBtn.innerText : "Send message";
    // if (sendBtn) sendBtn.innerText = "Sending...";
    if (statusText) statusText.innerText = "Sending...";

    // 2. Prepare Data (Using IDs: name, mail, message)
    let params = {
      name: document.getElementById("name").value,
      mail: document.getElementById("mail").value,
      message: document.getElementById("message").value,
    };

    // 3. Send to EmailJS
    emailjs
      .send("service_dzgm7ng", "template_20anflh", params)
      .then(function (res) {
        // SUCCESS
        console.log("Success", res.status);

        // Reset Form and UI
        form.reset();
        // if (sendBtn) sendBtn.innerText = "Message Sent";
        if (statusText) statusText.innerText = "Thanks!";

        // Revert button text after 3 seconds
        setTimeout(() => {
          if (sendBtn) sendBtn.innerText = originalBtnText;
          if (statusText) statusText.innerText = "";
        }, 3000);
      })
      .catch(function (err) {
        // ERROR
        console.error("Failed", err);

        // if (sendBtn) sendBtn.innerText = "Retry";
        if (statusText) statusText.innerText = "Failed.";
      });
  });
}

// =========================================
// PART 5: INFINITE LOOP TYPEWRITER
// =========================================
const phrases = ["Hi, I am Bikram.", "Python Programmer.", "Web Developer."];

const el = document.getElementById("typewriter");

let loopIndex = 0;
let isDeleting = false;
let charIndex = 0;

function typeEffect() {
  if (!el) return;

  // Get current phrase (modulus operator % ensures we loop back to 0 after the last item)
  const currentPhrase = phrases[loopIndex % phrases.length];

  // Logic: Determine what text to show based on if we are deleting or typing
  if (isDeleting) {
    charIndex--;
    el.textContent = currentPhrase.substring(0, charIndex);
  } else {
    charIndex++;
    el.textContent = currentPhrase.substring(0, charIndex);
  }

  // Speed Control
  let typeSpeed = isDeleting ? 50 : 100; // Deleting is faster (50ms) than typing (100ms)

  // SCENARIO 1: Finished Typing the phrase
  if (!isDeleting && charIndex === currentPhrase.length) {
    typeSpeed = 2000; // Wait 2 seconds before deleting
    isDeleting = true;
  }
  // SCENARIO 2: Finished Deleting the phrase
  else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    loopIndex++; // Move to next phrase
    typeSpeed = 500; // small pause before typing next one
  }

  setTimeout(typeEffect, typeSpeed);
}

// Start the loop
window.addEventListener("load", typeEffect);

// Footer Year
document.getElementById("year").textContent = new Date().getFullYear();

// =========================================
// PART 6: PRELOADER LOGIC & INIT
// =========================================
window.addEventListener("load", () => {
  // 1. Start the Typewriter (from previous step)
  typeEffect();

  // 2. Handle the Preloader
  const loader = document.getElementById("preloader");
  if (loader) {
    // Keep loader visible for at least 1.5 seconds so it looks cool
    setTimeout(() => {
      // Fade out
      loader.classList.add("opacity-0", "pointer-events-none");

      // Remove from HTML completely after fade finishes (700ms)
      setTimeout(() => {
        loader.remove();
      }, 700);
    }, 1500);
  }
});
