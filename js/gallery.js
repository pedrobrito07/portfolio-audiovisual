let galleryItems = [];

let currentGalleryIndex = 0;


/* =========================================================
   INIT
========================================================= */

async function initGallery() {

    const gallery =
        document.getElementById(
            "gallery"
        );

    if (!gallery) return;


    const data =
        await loadJSON(
            "./content/gallery.json"
        );


    galleryItems =
        Array.isArray(data)
            ? data
            : [];


    renderGallery();

    initLightbox();
}


/* =========================================================
   RENDER
========================================================= */

function renderGallery() {

    const gallery =
        document.getElementById(
            "gallery"
        );

    if (!gallery) return;


    gallery.innerHTML = "";


    if (galleryItems.length === 0) {

        gallery.innerHTML = `
            <p style="color:#888">
                Adicione suas fotos em
                content/gallery.json
            </p>
        `;

        return;
    }


    galleryItems.forEach(
        (item, index) => {

            const element =
                document.createElement(
                    "button"
                );

            element.type =
                "button";

            element.className =
                "gallery-item reveal";


            const image =
                document.createElement(
                    "img"
                );


            image.src =
                `assets/images/gallery/${item.image}`;


            image.alt =
                item.alt ||
                item.caption ||
                "Foto de evento";


            image.loading =
                "lazy";


            element.appendChild(
                image
            );


            element.addEventListener(
                "click",
                () => {

                    currentGalleryIndex =
                        index;

                    openLightbox();
                }
            );


            gallery.appendChild(
                element
            );

        }
    );


    initGalleryReveal();
}


/* =========================================================
   REVEAL
========================================================= */

function initGalleryReveal() {

    const elements =
        document.querySelectorAll(
            ".gallery .reveal"
        );


    if (
        !("IntersectionObserver" in window)
    ) {

        elements.forEach(
            element =>
                element.classList.add(
                    "visible"
                )
        );

        return;
    }


    const observer =
        new IntersectionObserver(
            entries => {

                entries.forEach(
                    entry => {

                        if (
                            entry.isIntersecting
                        ) {

                            entry.target.classList.add(
                                "visible"
                            );

                            observer.unobserve(
                                entry.target
                            );
                        }

                    }
                );

            },
            {
                threshold: .05
            }
        );


    elements.forEach(
        element =>
            observer.observe(element)
    );
}


/* =========================================================
   LIGHTBOX
========================================================= */

function initLightbox() {

    const lightbox =
        document.getElementById(
            "lightbox"
        );

    const close =
        document.getElementById(
            "lightbox-close"
        );

    const previous =
        document.getElementById(
            "lightbox-prev"
        );

    const next =
        document.getElementById(
            "lightbox-next"
        );


    close?.addEventListener(
        "click",
        closeLightbox
    );


    previous?.addEventListener(
        "click",
        previousImage
    );


    next?.addEventListener(
        "click",
        nextImage
    );


    lightbox?.addEventListener(
        "click",
        event => {

            if (
                event.target === lightbox
            ) {

                closeLightbox();
            }
        }
    );


    document.addEventListener(
        "keydown",
        event => {

            if (
                !lightbox?.classList.contains(
                    "open"
                )
            ) return;


            if (
                event.key === "Escape"
            ) {

                closeLightbox();

            } else if (
                event.key === "ArrowLeft"
            ) {

                previousImage();

            } else if (
                event.key === "ArrowRight"
            ) {

                nextImage();
            }

        }
    );
}


/* =========================================================
   OPEN
========================================================= */

function openLightbox() {

    const lightbox =
        document.getElementById(
            "lightbox"
        );


    if (!lightbox) return;


    updateLightbox();


    lightbox.classList.add(
        "open"
    );


    lightbox.setAttribute(
        "aria-hidden",
        "false"
    );


    document.body.style.overflow =
        "hidden";
}


/* =========================================================
   CLOSE
========================================================= */

function closeLightbox() {

    const lightbox =
        document.getElementById(
            "lightbox"
        );


    if (!lightbox) return;


    lightbox.classList.remove(
        "open"
    );


    lightbox.setAttribute(
        "aria-hidden",
        "true"
    );


    document.body.style.overflow =
        "";
}


/* =========================================================
   UPDATE
========================================================= */

function updateLightbox() {

    const item =
        galleryItems[
            currentGalleryIndex
        ];


    if (!item) return;


    const image =
        document.getElementById(
            "lightbox-image"
        );

    const caption =
        document.getElementById(
            "lightbox-caption"
        );


    image.src =
        `assets/images/gallery/${item.image}`;


    image.alt =
        item.alt ||
        item.caption ||
        "Foto";


    caption.textContent =
        item.caption || "";
}


/* =========================================================
   NEXT
========================================================= */

function nextImage() {

    if (!galleryItems.length) return;


    currentGalleryIndex++;


    if (
        currentGalleryIndex >=
        galleryItems.length
    ) {

        currentGalleryIndex = 0;
    }


    updateLightbox();
}


/* =========================================================
   PREVIOUS
========================================================= */

function previousImage() {

    if (!galleryItems.length) return;


    currentGalleryIndex--;


    if (
        currentGalleryIndex < 0
    ) {

        currentGalleryIndex =
            galleryItems.length - 1;
    }


    updateLightbox();
}


document.addEventListener(
    "DOMContentLoaded",
    initGallery
);