Array.from(document.querySelectorAll(".mini-column, .mini-column2, .slideshow-gallery"))
    .filter((group) => group.classList.contains("slideshow-gallery") || !group.closest(".slideshow-gallery"))
    .forEach((group) => {
        const isGallery = group.classList.contains("slideshow-gallery");

        const wrappers = Array.from(group.children);
        const imageOnly = isGallery || (wrappers.length > 0 && wrappers.every((wrapper) => {
            const images = Array.from(wrapper.children);
            return wrapper.textContent.trim() === ""
                && images.length > 0
                && images.every((child) => child.tagName === "IMG");
        }));

        if (!imageOnly) return;

        const images = Array.from(group.querySelectorAll("img"));
        if (images.length < 2) return;

        group.classList.add("slideshow");
        group.setAttribute("role", "region");
        group.setAttribute("aria-label", "Image slideshow");

        const viewport = document.createElement("div");
        viewport.className = "slideshow-viewport";

        images.forEach((image, index) => {
            const slide = document.createElement("div");
            slide.className = "slideshow-image";
            slide.hidden = index !== 0;
            slide.appendChild(image);
            viewport.appendChild(slide);
        });

        group.replaceChildren(viewport);

        const controls = document.createElement("div");
        controls.className = "slideshow-controls";

        const previous = document.createElement("button");
        previous.type = "button";
        previous.textContent = "Previous";
        previous.setAttribute("aria-label", "Previous image");

        const count = document.createElement("span");
        count.className = "slideshow-count";
        count.setAttribute("aria-live", "polite");

        const next = document.createElement("button");
        next.type = "button";
        next.textContent = "Next";
        next.setAttribute("aria-label", "Next image");

        controls.append(previous, count, next);
        group.appendChild(controls);

        const slides = Array.from(viewport.children);
        let current = 0;

        const showSlide = (index) => {
            current = (index + slides.length) % slides.length;
            slides.forEach((slide, slideIndex) => {
                slide.hidden = slideIndex !== current;
                slide.classList.toggle("is-active", slideIndex === current);
            });
            count.textContent = `${current + 1} / ${slides.length}`;
        };

        previous.addEventListener("click", () => showSlide(current - 1));
        next.addEventListener("click", () => showSlide(current + 1));
        showSlide(0);
    });
