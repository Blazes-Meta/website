document.addEventListener("DOMContentLoaded", () => {
    const containers = document.querySelectorAll(".start-container");

    if (containers.length > 1) {
        let hasScrolled = false;

        window.addEventListener("scroll", () => {
            if (!hasScrolled && window.scrollY > 0) {
                hasScrolled = true;

                // Scrollt zum zweiten Startcontainer
                containers[1].scrollIntoView({
                    behavior: "smooth"
                });
            }
        });
    }
});
