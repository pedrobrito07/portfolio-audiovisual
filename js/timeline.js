async function initTimeline() {

    const container =
        document.getElementById(
            "timeline"
        );

    if (!container) return;


    const data =
        await loadJSON(
            "./content/timeline.json"
        );


    if (
        !Array.isArray(data) ||
        data.length === 0
    ) {

        container.innerHTML = `
            <p style="color:#888">
                Adicione sua trajetória em
                content/timeline.json
            </p>
        `;

        return;
    }


    const fragment =
        document.createDocumentFragment();


    data.forEach(
        (item, index) => {

            if (index % 2 === 0) {

                const row =
                    document.createElement(
                        "div"
                    );

                row.className =
                    "timeline-row";


                const left =
                    createTimelineCard(
                        item
                    );


                const right =
                    document.createElement(
                        "div"
                    );


                row.appendChild(left);
                row.appendChild(right);

                fragment.appendChild(row);

            }

        }
    );


    container.appendChild(
        fragment
    );


    addTimelineReveal();
}


/* =========================================================
   CARD
========================================================= */

function createTimelineCard(item) {

    const card =
        document.createElement(
            "article"
        );

    card.className =
        "timeline-card reveal";


    card.innerHTML = `

        <span class="timeline-dot"></span>

        <span class="timeline-year">
            ${escapeHTML(item.year || "")}
        </span>

        <h3 class="timeline-title">
            ${escapeHTML(item.title || "")}
        </h3>

        ${
            item.description
            ?
            `
            <p class="timeline-description">
                ${escapeHTML(item.description)}
            </p>
            `
            :
            ""
        }

        ${
            item.image
            ?
            `
            <img
                class="timeline-image"
                src="assets/images/timeline/${escapeAttribute(item.image)}"
                alt="${escapeAttribute(item.title || "Experiência")}"
                loading="lazy"
            >
            `
            :
            ""
        }

    `;


    return card;
}


/* =========================================================
   REVEAL DA TIMELINE
========================================================= */

function addTimelineReveal() {

    const elements =
        document.querySelectorAll(
            ".timeline .reveal"
        );


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
                threshold: .1
            }
        );


    elements.forEach(
        element =>
            observer.observe(element)
    );
}


/* =========================================================
   ESCAPE
========================================================= */

function escapeHTML(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


function escapeAttribute(value) {
    return escapeHTML(value);
}


/* =========================================================
   START
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    initTimeline
);