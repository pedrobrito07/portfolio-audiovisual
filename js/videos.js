async function initVideos() {

    const container =
        document.getElementById(
            "videos-grid"
        );

    if (!container) return;


    const data =
        await loadJSON(
            "./content/videos.json"
        );


    if (
        !Array.isArray(data) ||
        data.length === 0
    ) {

        container.innerHTML = `
            <p style="color:#888">
                Adicione seus vídeos em
                content/videos.json
            </p>
        `;

        return;
    }


    data.forEach(
        video => {

            const id =
                getYouTubeID(
                    video.youtube
                );


            if (!id) return;


            const card =
                document.createElement(
                    "article"
                );

            card.className =
                "video-card reveal";


            card.innerHTML = `

                <div class="video-frame">

                    <iframe
                        src="https://www.youtube.com/embed/${encodeURIComponent(id)}"
                        title="${escapeAttribute(video.title || "Vídeo")}"
                        loading="lazy"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowfullscreen
                    ></iframe>

                </div>

                <div class="video-info">

                    <h3>
                        ${escapeHTML(video.title || "")}
                    </h3>

                    ${
                        video.description
                        ?
                        `
                        <p>
                            ${escapeHTML(video.description)}
                        </p>
                        `
                        :
                        ""
                    }

                </div>

            `;


            container.appendChild(
                card
            );
        }
    );


    observeVideos();
}


/* =========================================================
   YOUTUBE ID
========================================================= */

function getYouTubeID(url) {

    if (!url) return null;


    const patterns = [

        /youtu\.be\/([^?&]+)/,

        /youtube\.com\/watch\?v=([^?&]+)/,

        /youtube\.com\/embed\/([^?&]+)/,

        /youtube\.com\/shorts\/([^?&]+)/

    ];


    for (
        const pattern of patterns
    ) {

        const match =
            url.match(pattern);


        if (match) {
            return match[1];
        }
    }


    return null;
}


/* =========================================================
   REVEAL
========================================================= */

function observeVideos() {

    const elements =
        document.querySelectorAll(
            ".videos .reveal"
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
                threshold: .1
            }
        );


    elements.forEach(
        element =>
            observer.observe(element)
    );
}


document.addEventListener(
    "DOMContentLoaded",
    initVideos
);