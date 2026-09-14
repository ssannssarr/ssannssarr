// =========================================
// CURRENT YEAR
// =========================================

const year = document.getElementById("year");

if (year) {
    year.textContent = new Date().getFullYear();
}


// =========================================
// MENU
// =========================================

const menuButton = document.getElementById("menuButton");
const navLinks = document.getElementById("navLinks");

if (menuButton && navLinks) {

    menuButton.addEventListener("click", () => {

        const isOpen =
            navLinks.classList.toggle("open");

        menuButton.classList.toggle(
            "open",
            isOpen
        );

        menuButton.setAttribute(
            "aria-expanded",
            String(isOpen)
        );

    });


    navLinks.querySelectorAll("a").forEach((link) => {

        link.addEventListener("click", () => {

            navLinks.classList.remove("open");

            menuButton.classList.remove("open");

            menuButton.setAttribute(
                "aria-expanded",
                "false"
            );

        });

    });

}


// =========================================
// SCROLL REVEAL
// =========================================

const revealElements = document.querySelectorAll(
    ".section, .project-card, .contact"
);

const revealObserver = new IntersectionObserver(
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
    revealObserver.observe(element);
});


// =========================================
// ACTIVE NAVIGATION
// =========================================

const sections = document.querySelectorAll(
    "section[id]"
);

const sectionLinks = document.querySelectorAll(
    ".nav-links a"
);

const activeObserver = new IntersectionObserver(
    (entries) => {

        entries.forEach((entry) => {

            if (!entry.isIntersecting) {
                return;
            }

            const id =
                entry.target.getAttribute("id");

            sectionLinks.forEach((link) => {

                const href =
                    link.getAttribute("href");

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
    activeObserver.observe(section);
});
