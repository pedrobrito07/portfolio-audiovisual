/* =========================================================
   CONFIGURAÇÃO
========================================================= */

let siteConfig = {};


/* =========================================================
   CARREGAR JSON
========================================================= */

async function loadJSON(file) {

    try {

        const response = await fetch(file);

        if (!response.ok) {
            throw new Error(
                `Erro ao carregar ${file}`
            );
        }

        return await response.json();

    } catch (error) {

        console.error(error);

        return {};
    }
}


/* =========================================================
   CONFIG
========================================================= */

async function loadConfig() {

    siteConfig = await loadJSON(
        "./content/config.json"
    );

    if (!siteConfig) return;


    const name =
        siteConfig.name || "SEU NOME";

    const profession =
        siteConfig.profession || "Técnico de Som";


    document.title =
        `${name} | ${profession}`;


    setText(
        "logo-name",
        name
    );

    setText(
        "hero-name",
        name
    );

    setText(
        "hero-profession",
        profession
    );

    setText(
        "footer-name",
        name
    );

    setText(
        "footer-profession",
        profession
    );

    setText(
        "copyright-name",
        name
    );


    const whatsapp =
        siteConfig.whatsapp || "";

    const instagram =
        siteConfig.instagram || "";

    const youtube =
        siteConfig.youtube || "";

    const email =
        siteConfig.email || "";


    const whatsappLink =
        document.getElementById(
            "whatsapp-link"
        );

    if (whatsappLink && whatsapp) {

        whatsappLink.href =
            `https://wa.me/${whatsapp}`;
    }


    const instagramLink =
        document.getElementById(
            "instagram-link"
        );

    const footerInstagram =
        document.getElementById(
            "footer-instagram"
        );

    if (instagramLink) {
        instagramLink.href =
            instagram;
    }

    if (footerInstagram) {
        footerInstagram.href =
            instagram;
    }


    const footerYoutube =
        document.getElementById(
            "footer-youtube"
        );

    if (footerYoutube) {
        footerYoutube.href =
            youtube;
    }


    setText(
        "email-address",
        email
    );

    setText(
        "current-year",
        new Date().getFullYear()
    );
}


/* =========================================================
   TEXTO
========================================================= */

function setText(id, value) {

    const element =
        document.getElementById(id);

    if (element && value !== undefined) {
        element.textContent = value;
    }
}


/* =========================================================
   MENU
========================================================= */

function initMenu() {

    const toggle =
        document.getElementById(
            "menu-toggle"
        );

    const navigation =
        document.getElementById(
            "navigation"
        );

    if (!toggle || !navigation) return;


    toggle.addEventListener(
        "click",
        () => {

            const opened =
                navigation.classList.toggle(
                    "open"
                );

            toggle.classList.toggle(
                "active",
                opened
            );

            toggle.setAttribute(
                "aria-expanded",
                opened
            );

            document.body.classList.toggle(
                "menu-open",
                opened
            );
        }
    );


    navigation
        .querySelectorAll("a")
        .forEach(link => {

            link.addEventListener(
                "click",
                () => {

                    navigation.classList.remove(
                        "open"
                    );

                    toggle.classList.remove(
                        "active"
                    );

                    toggle.setAttribute(
                        "aria-expanded",
                        "false"
                    );

                    document.body.classList.remove(
                        "menu-open"
                    );
                }
            );

        });
}


/* =========================================================
   HEADER
========================================================= */

function initHeader() {

    const header =
        document.getElementById(
            "header"
        );

    if (!header) return;


    function updateHeader() {

        if (window.scrollY > 40) {

            header.classList.add(
                "scrolled"
            );

        } else {

            header.classList.remove(
                "scrolled"
            );
        }
    }


    window.addEventListener(
        "scroll",
        updateHeader,
        { passive: true }
    );

    updateHeader();
}


/* =========================================================
   REVEAL
========================================================= */

function initReveal() {

    const elements =
        document.querySelectorAll(
            ".reveal"
        );


    if (!("IntersectionObserver" in window)) {

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
                threshold: .12
            }
        );


    elements.forEach(
        element =>
            observer.observe(element)
    );
}


/* =========================================================
   COPIAR EMAIL
========================================================= */

function initCopyEmail() {

    const button =
        document.getElementById(
            "copy-email"
        );

    const emailElement =
        document.getElementById(
            "email-address"
        );

    const toast =
        document.getElementById(
            "toast"
        );

    if (
        !button ||
        !emailElement
    ) return;


    button.addEventListener(
        "click",
        async () => {

            const email =
                emailElement.textContent.trim();


            try {

                await navigator.clipboard.writeText(
                    email
                );

                showToast(
                    "E-mail copiado!"
                );

            } catch {

                showToast(
                    "Não foi possível copiar."
                );
            }

        }
    );
}


/* =========================================================
   TOAST
========================================================= */

function showToast(message) {

    const toast =
        document.getElementById(
            "toast"
        );

    if (!toast) return;

    toast.textContent =
        message;

    toast.classList.add(
        "show"
    );


    setTimeout(
        () => {

            toast.classList.remove(
                "show"
            );

        },
        2500
    );
}


/* =========================================================
   INICIALIZAÇÃO
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        await loadConfig();

        initMenu();

        initHeader();

        initReveal();

        initCopyEmail();

    }
);