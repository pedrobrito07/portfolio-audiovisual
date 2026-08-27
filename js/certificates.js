let certificates = [];

let currentCertificate = 0;


/* =========================================================
   INIT
========================================================= */

async function initCertificates() {

    const track =
        document.getElementById(
            "certificates-track"
        );

    if (!track) return;


    const data =
        await loadJSON(
            "./content/certificates.json"
        );


    certificates =
        Array.isArray(data)
            ? data
            : [];


    renderCertificates();

    initCertificateControls();
}


/* =========================================================
   RENDER
========================================================= */

function renderCertificates() {

    const track =
        document.getElementById(
            "certificates-track"
        );

    const dots =
        document.getElementById(
            "cert-dots"
        );


    if (!track) return;


    track.innerHTML = "";

    if (dots) {
        dots.innerHTML = "";
    }


    if (certificates.length === 0) {

        track.innerHTML = `
            <p style="color:#888">
                Adicione certificados em
                content/certificates.json
            </p>
        `;

        return;
    }


    certificates.forEach(
        (certificate, index) => {

            const card =
                document.createElement(
                    "article"
                );

            card.className =
                "certificate-card";


            card.innerHTML = `

                <div class="certificate-image">

                    <img
                        src="assets/images/certificates/${escapeAttribute(certificate.image || "placeholder.jpg")}"
                        alt="${escapeAttribute(certificate.title || "Certificado")}"
                        loading="lazy"
                    >

                </div>

                <div class="certificate-info">

                    <h3>
                        ${escapeHTML(certificate.title || "")}
                    </h3>

                    <p>
                        ${escapeHTML(certificate.institution || "")}
                        ${
                            certificate.year
                            ? ` • ${escapeHTML(certificate.year)}`
                            : ""
                        }
                    </p>

                    ${
                        certificate.pdf
                        ?
                        `
                        <div class="certificate-actions">

                            <a
                                href="assets/images/certificates/${escapeAttribute(certificate.pdf)}"
                                target="_blank"
                                rel="noopener"
                            >
                                VER CERTIFICADO ↗
                            </a>

                        </div>
                        `
                        :
                        ""
                    }

                </div>

            `;


            track.appendChild(card);


            if (dots) {

                const dot =
                    document.createElement(
                        "span"
                    );

                dot.className =
                    "slider-dot";

                if (index === 0) {
                    dot.classList.add(
                        "active"
                    );
                }

                dot.addEventListener(
                    "click",
                    () => {

                        currentCertificate =
                            index;

                        updateCertificates();
                    }
                );


                dots.appendChild(dot);
            }

        }
    );


    updateCertificates();
}


/* =========================================================
   CONTROLES
========================================================= */

function initCertificateControls() {

    const previous =
        document.getElementById(
            "cert-prev"
        );

    const next =
        document.getElementById(
            "cert-next"
        );


    previous?.addEventListener(
        "click",
        () => {

            currentCertificate--;

            if (
                currentCertificate < 0
            ) {

                currentCertificate =
                    certificates.length - 1;
            }

            updateCertificates();
        }
    );


    next?.addEventListener(
        "click",
        () => {

            currentCertificate++;

            if (
                currentCertificate >=
                certificates.length
            ) {

                currentCertificate = 0;
            }

            updateCertificates();
        }
    );
}


/* =========================================================
   UPDATE
========================================================= */

function updateCertificates() {

    const cards =
        document.querySelectorAll(
            ".certificate-card"
        );

    const dots =
        document.querySelectorAll(
            "#cert-dots .slider-dot"
        );


    if (!cards.length) return;


    const isMobile =
        window.innerWidth <= 800;


    const visible =
        isMobile
            ? 1
            : window.innerWidth <= 1000
                ? 2
                : 3;


    cards.forEach(
        (card, index) => {

            const position =
                index -
                currentCertificate;


            if (
                position >= 0 &&
                position < visible
            ) {

                card.style.display =
                    "block";

            } else {

                card.style.display =
                    "none";
            }

        }
    );


    dots.forEach(
        (dot, index) => {

            dot.classList.toggle(
                "active",
                index === currentCertificate
            );
        }
    );
}


window.addEventListener(
    "resize",
    updateCertificates
);


document.addEventListener(
    "DOMContentLoaded",
    initCertificates
);