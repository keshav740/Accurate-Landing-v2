// Mobile Menu Logic
const mobileBtn = document.getElementById("mobile-btn");
const mobileMenu = document.getElementById("mobile-menu");
const menuIcon = document.getElementById("menu-icon");
// Select all buttons that are headers for sub-menus
const dropdownBtns = document.querySelectorAll(".mobile-dropdown-btn");

if (mobileBtn && mobileMenu) {
    // 1. MAIN MENU TOGGLE: Opens/Closes the entire mobile sidebar
    mobileBtn.addEventListener("click", () => {
        const isHidden = mobileMenu.classList.toggle("hidden");

        // Switch between Hamburger (lines) and Close (X) icons
        // Note: menuIcon needs to be defined within the button or selected correctly if it exists.
        // Assuming the SVG inside the button is what we want to swap or menu-icon ID is present
        // Based on original code, there was a potential bug if 'menu-icon' ID wasn't on the SVG.
        // Let's assume the button content itself is being swapped or we target the SVG.
        // ORIGINAL CODE USED: const menuIcon = document.getElementById("menu-icon");
        // But the HTML showed: <button id="mobile-btn"> <svg ...> </svg> </button>
        // Use mobileBtn.innerHTML to swap if menuIcon is null

        const content = !isHidden ?
            `<svg class="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>` :
            `<svg class="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>`;

        mobileBtn.innerHTML = content;
    });
}

// 2. SUB-MENU ACCORDION: Handles opening nested links (About, Programs, etc.)
dropdownBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
        const subMenu = btn.nextElementSibling; // The div containing the links
        const icon = btn.querySelector(".rotate-icon"); // The chevron arrow

        // OPTIONAL: Close all other open sub-menus first (Accordion Effect)
        dropdownBtns.forEach((otherBtn) => {
            if (otherBtn !== btn) {
                otherBtn.nextElementSibling.classList.add("hidden");
                const otherIcon = otherBtn.querySelector(".rotate-icon");
                if (otherIcon) otherIcon.style.transform = "rotate(0deg)";
            }
        });

        // Toggle the clicked sub-menu
        const isNowOpen = subMenu.classList.toggle("hidden");

        // Rotate the arrow icon (180 degrees if open, 0 if closed)
        if (icon) {
            icon.style.transform = isNowOpen ? "rotate(0deg)" : "rotate(180deg)";
        }
    });
});

// 3. AUTO-CLEANUP: Closes mobile menu if user rotates device to Desktop view
window.addEventListener("resize", () => {
    if (window.innerWidth >= 1280) {
        // xl breakpoint matches your Tailwind class
        if (mobileMenu) mobileMenu.classList.add("hidden");
        if (mobileBtn) mobileBtn.innerHTML = `<svg class="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>`;
    }
});


// Tab Switching Logic
function tabSwitch(event, id) {
    // Hide all content panes
    document.querySelectorAll(".tab-pane").forEach((pane) => pane.classList.add("hidden"));

    // Reset all tabs
    document.querySelectorAll(".prog-tab").forEach((tab) => {
        tab.classList.remove("active");
        tab.style.transform = "";
    });

    // Show selected content
    const targetPane = document.getElementById(id);
    if (targetPane) {
        targetPane.classList.remove("hidden");
        if (window.innerWidth >= 1024) {
            // Smooth scroll only on desktop
            targetPane.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    }

    // Activate clicked tab
    const btn = event.currentTarget;
    btn.classList.add("active");
    btn.style.transform = "translateY(-1px)";
}

// Mobile touch scroll enhancement for Tabs
let startX = 0,
    scrollLeft = 0;
const tabContainer = document.querySelector(".no-scrollbar");
if (tabContainer) {
    tabContainer.addEventListener("touchstart", (e) => {
        startX = e.touches[0].pageX - tabContainer.offsetLeft;
        scrollLeft = tabContainer.scrollLeft;
    });
    tabContainer.addEventListener("touchmove", (e) => {
        const x = e.touches[0].pageX - tabContainer.offsetLeft;
        const walk = (x - startX) * 2;
        tabContainer.scrollLeft = scrollLeft - walk;
    });
}


// Accordion / Vertical Tabs Logic
const panels = document.querySelectorAll(".accordion-item");

panels.forEach((panel) => {
    panel.addEventListener("click", () => {
        // Remove active class and reset flex
        panels.forEach((p) => {
            p.classList.remove("active", "flex-[5]");
            p.classList.add("flex-[0.5]");
        });

        // Add active class and expand clicked panel
        panel.classList.add("active", "flex-[5]");
        panel.classList.remove("flex-[0.5]");
    });
});


// Testimonial / Slider Logic
const slider = document.getElementById("slider");
const currentIndexEl = document.getElementById("current-index");
const totalCountEl = document.getElementById("total-count");
const slides = document.querySelectorAll(".slide-item");

if (slider && currentIndexEl && totalCountEl && slides.length > 0) {
    // 1. Initialize Total Count
    const totalSlides = slides.length;
    totalCountEl.innerText = totalSlides.toString().padStart(2, "0");

    window.scrollSlider = function (dir) {
        // Calculate width dynamically (first slide width + gap)
        const slideWidth = slides[0].offsetWidth + 24;
        slider.scrollBy({
            left: dir === "next" ? slideWidth : -slideWidth,
            behavior: "smooth",
        });
    }

    // 2. Update Current Index on Scroll
    slider.addEventListener("scroll", () => {
        const slideWidth = slides[0].offsetWidth + 24;
        // Calculate which slide is currently in view
        const index = Math.round(slider.scrollLeft / slideWidth) + 1;

        // Ensure index stays within bounds [1, totalSlides]
        const safeIndex = Math.min(Math.max(index, 1), totalSlides);
        currentIndexEl.innerText = safeIndex.toString().padStart(2, "0");
    });

    // Auto Scroll Logic for Global Minds Slider
    let sliderInterval;
    function startSliderAuto() {
        clearInterval(sliderInterval);
        sliderInterval = setInterval(() => {
            const slideWidth = slides[0].offsetWidth + 24;
            // Check if reached the end (approximate)
            if (slider.scrollLeft + slider.clientWidth >= slider.scrollWidth - 10) {
                slider.scrollTo({ left: 0, behavior: "smooth" });
            } else {
                scrollSlider("next");
            }
        }, 3000);
    }

    startSliderAuto();

    // Pause on interactions
    slider.addEventListener("mouseenter", () => clearInterval(sliderInterval));
    slider.addEventListener("mouseleave", startSliderAuto);
    slider.addEventListener("touchstart", () => clearInterval(sliderInterval));
    slider.addEventListener("touchend", startSliderAuto);
}


// Testimonial Detail View Logic
const testimonials = [
    {
        title: 'SAAS Group Dubai <span class="text-[#0052cc]">1.30₹CR</span>',
        body: '"Lots of credit goes to the faculty who helped me balance sports and studies."',
        name: "Randhir Kumar",
        img: "https://www.accurate.in/img/student/student-12.png",
    },
    {
        title: 'Watermelon Dubai <span class="text-[#0052cc]">72₹LPA</span>',
        body: '"The placement cell at Accurate provided me the platform to reach my goals."',
        name: "Saquib Jawed",
        img: "https://www.accurate.in/img/student/student-3.png",
    },
    {
        title: 'Hewlett PackardUnited Kingdom <span class="text-[#0052cc]">50₹LPA</span>',
        body: '"The industry-focused curriculum made all the difference in my career path."',
        name: "Kalpana Chauhan",
        img: "https://www.accurate.in/img/student/student-2.png",
    },
];

let currentTestimonialIndex = 0;

window.updateTestimonial = function (index) {
    currentTestimonialIndex = index;
    const data = testimonials[index];

    const titleEl = document.getElementById("display-title");
    const bodyEl = document.getElementById("display-body");
    const nameEl = document.getElementById("display-name");
    const imgEl = document.getElementById("display-image");

    if (titleEl) titleEl.innerHTML = data.title;
    if (bodyEl) bodyEl.innerText = data.body;
    if (nameEl) nameEl.innerText = data.name;
    if (imgEl) imgEl.src = data.img;

    for (let i = 0; i < testimonials.length; i++) {
        const thumb = document.getElementById(`thumb-${i}`);
        const line = document.getElementById(`line-${i}`);
        const dot = document.getElementById(`dot-${i}`);

        if (i === index) {
            if (thumb) thumb.classList.add("active-thumb");
            if (line) line.style.width = "100%";
            if (dot) {
                dot.classList.replace("bg-gray-300", "bg-[#0052cc]");
                dot.classList.add("w-6");
            }
        } else {
            if (thumb) thumb.classList.remove("active-thumb");
            if (line) line.style.width = "0%";
            if (dot) {
                dot.classList.replace("bg-[#0052cc]", "bg-gray-300");
                dot.classList.remove("w-6");
            }
        }
    }
}

window.nextSlide = function () {
    currentTestimonialIndex = (currentTestimonialIndex + 1) % testimonials.length;
    updateTestimonial(currentTestimonialIndex);
}

window.prevSlide = function () {
    currentTestimonialIndex = (currentTestimonialIndex - 1 + testimonials.length) % testimonials.length;
    updateTestimonial(currentTestimonialIndex);
}


// Institutional Portfolio Slider (GSAP)
const portfolioImages = [
    "https://www.accurate.in/img/diksharambh-orientation-event-collage.webp",
    "https://www.accurate.in/img/international-exposure/singapore-visit.webp",
    "https://www.accurate.in/img/devi-award.webp",
    "https://www.accurate.in/img/most-admired-law-college.webp",
    "https://www.accurate.in/img/accurate-naac-banner.webp",
];

let portfolioIndex = 0;
const slideElements = document.querySelectorAll(".slide img");

function updatePortfolioSlides() {
    if (slideElements.length === 0) return;

    slideElements[0].src = portfolioImages[portfolioIndex % portfolioImages.length];
    slideElements[1].src = portfolioImages[(portfolioIndex + 1) % portfolioImages.length];
    slideElements[2].src = portfolioImages[(portfolioIndex + 2) % portfolioImages.length];

    if (typeof gsap !== 'undefined') {
        gsap.fromTo(
            ".slide",
            { x: 100, opacity: 0, scale: 0.95 },
            {
                x: 0,
                opacity: 1,
                scale: 1,
                duration: 0.8,
                ease: "power3.out",
                stagger: 0.1,
            }
        );
    }
}

const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");

if (nextBtn) {
    nextBtn.addEventListener("click", () => {
        portfolioIndex++;
        updatePortfolioSlides();
    });
}

if (prevBtn) {
    prevBtn.addEventListener("click", () => {
        portfolioIndex--;
        if (portfolioIndex < 0) portfolioIndex = portfolioImages.length - 1;
        updatePortfolioSlides();
    });
}

// Auto slide for Portfolio
// Check if slideElements exist before starting interval to avoid errors on pages without this slider
if (slideElements.length > 0) {
    setInterval(() => {
        portfolioIndex++;
        updatePortfolioSlides();
    }, 3000);


    updatePortfolioSlides();
}

// Swiper Initialization
// Note: There were two Swiper initializations in the original file targeting the same class .mySwiper
// The second one might override the first. Keeping both for fidelity, but consider refactoring.

// First Swiper Config (Detailed)
if (document.querySelector(".mySwiper")) {
    const swiper1 = new Swiper(".mySwiper", {
        // Infinite and Autoplay settings
        loop: true,
        speed: 1000,
        autoplay: {
            delay: 1000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
        },
        // Layout settings
        slidesPerView: 1.2,
        centeredSlides: true,
        spaceBetween: 40,
        // Interaction
        grabCursor: true,
        // Navigation & Pagination
        navigation: {
            nextEl: ".swiper-button-next-btn",
            prevEl: ".swiper-button-prev-btn",
        },
        pagination: {
            el: ".swiper-pagination",
            clickable: true,
            dynamicBullets: true,
        },
        // Responsive Breakpoints
        breakpoints: {
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
            1440: { slidesPerView: 3.5 },
        },
    });
}

// Second Swiper Config (Basic) - This may override the previous if targeting same elements
// Commenting out to prefer the detailed one unless specific behavior is needed.
/*
var swiper2 = new Swiper(".mySwiper", {
    loop: true,
    autoplay: {
        delay: 3500,
        disableOnInteraction: false,
    },
    pagination: {
        el: ".swiper-pagination",
        clickable: true,
    },
});
*/
