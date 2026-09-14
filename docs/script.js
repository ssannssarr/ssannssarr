// =========================================
// CURRENT YEAR
// =========================================

const year = document.getElementById("year");

if (year) {
    year.textContent = new Date().getFullYear();
}


// =========================================
// SCROLL REVEAL
// =========================================

const revealElements = document.querySelectorAll(
    ".section, .project-card, .contact"
);

const observer = new IntersectionObserver(
    (entries, observer) => {
        entries.forEach((entry) => {

            if (!entry.isIntersecting) {
                return;
            }

            entry.target.classList.add("visible");

            observer.unobserve(entry.target);
        });
    },
    {
        threshold: 0.08
    }
);

revealElements.forEach((element) => {
    observer.observe(element);
});


// =========================================
// ACTIVE NAVIGATION
// =========================================

const sections = document.querySelectorAll(
    "section[id]"
);

const navLinks = document.querySelectorAll(
    ".nav-links a"
);

const sectionObserver = new IntersectionObserver(
    (entries) => {

        entries.forEach((entry) => {

            if (!entry.isIntersecting) {
                return;
            }

            const id = entry.target.getAttribute("id");

            navLinks.forEach((link) => {

                const href = link.getAttribute("href");

                link.classList.toggle(
                    "active",
                    href === `#${id}`
                );

            });

        });

    },
    {
        rootMargin: "-40% 0px -50% 0px"
    }
);

sections.forEach((section) => {
    sectionObserver.observe(section);
});
