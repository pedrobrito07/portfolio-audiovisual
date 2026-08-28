/* =========================================================
   CALENDÁRIO DE DISPONIBILIDADE
========================================================= */

const GOOGLE_CALENDAR_ID =
    "5d05baccdfa514c7f31349cc08f624a673977382db449d741a004399c586c570@group.calendar.google.com";

const GOOGLE_API_KEY =
    "AIzaSyAKmq-wO2h_oMWzLBzN_wmbbk-ZbbrFmy8";


let availabilityEvents = [];

let currentCalendarDate =
    new Date();


/* =========================================================
   INICIALIZAÇÃO
========================================================= */

async function initAvailabilityCalendar() {

    const calendar =
        document.getElementById(
            "availability-calendar"
        );

    if (!calendar) return;


    await loadAvailabilityEvents();

    renderAvailabilityCalendar();

    setupCalendarNavigation();

    setupWhatsAppButton();

}


/* =========================================================
   BUSCAR EVENTOS DO GOOGLE
========================================================= */

async function loadAvailabilityEvents() {

    try {

        const now =
            new Date();

        const start =
            new Date(
                now.getFullYear(),
                now.getMonth() - 1,
                1
            );

        const end =
            new Date(
                now.getFullYear(),
                now.getMonth() + 13,
                0
            );


        const url =
            "https://www.googleapis.com/calendar/v3/calendars/" +
            encodeURIComponent(
                GOOGLE_CALENDAR_ID
            ) +
            "/events?" +

            new URLSearchParams({

                key:
                    GOOGLE_API_KEY,

                timeMin:
                    start.toISOString(),

                timeMax:
                    end.toISOString(),

                singleEvents:
                    "true",

                orderBy:
                    "startTime"

            });


        const response =
            await fetch(url);


        if (!response.ok) {

            throw new Error(
                "Erro ao acessar Google Calendar"
            );

        }


        const data =
            await response.json();


        availabilityEvents =
            data.items || [];


    } catch (error) {

        console.error(
            "Erro no calendário:",
            error
        );

        availabilityEvents = [];

    }

}


/* =========================================================
   RENDERIZAR CALENDÁRIO
========================================================= */

function renderAvailabilityCalendar() {

    const calendar =
        document.getElementById(
            "availability-calendar"
        );

    const monthTitle =
        document.getElementById(
            "calendar-month"
        );


    if (!calendar) return;


    calendar.innerHTML = "";


    const year =
        currentCalendarDate.getFullYear();

    const month =
        currentCalendarDate.getMonth();


    const firstDay =
        new Date(
            year,
            month,
            1
        ).getDay();


    const daysInMonth =
        new Date(
            year,
            month + 1,
            0
        ).getDate();


    const monthName =
        currentCalendarDate.toLocaleDateString(
            "pt-BR",
            {
                month: "long",
                year: "numeric"
            }
        );


    monthTitle.textContent =
        monthName;


    /* ESPAÇOS ANTES DO PRIMEIRO DIA */

    for (
        let i = 0;
        i < firstDay;
        i++
    ) {

        const empty =
            document.createElement(
                "div"
            );

        empty.className =
            "calendar-day empty";

        calendar.appendChild(
            empty
        );

    }


    /* DIAS */

    for (
        let day = 1;
        day <= daysInMonth;
        day++
    ) {

        const date =
            new Date(
                year,
                month,
                day
            );


        const dateString =
            formatDate(date);


        const cell =
            document.createElement(
                "div"
            );

        cell.className =
            "calendar-day";


        const number =
            document.createElement(
                "div"
            );

        number.className =
            "calendar-number";

        number.textContent =
            day;


        cell.appendChild(
            number
        );


        /* EVENTOS DO DIA */

        const events =
            getEventsForDate(
                dateString
            );


        if (
            events.length > 0
        ) {

            const event =
                events[0];


            const status =
                getEventStatus(
                    event
                );


            cell.classList.add(
                status
            );


            const eventTitle =
                document.createElement(
                    "div"
                );


            eventTitle.className =
                "calendar-event";


            eventTitle.textContent =
                event.summary ||
                "Ocupado";


            cell.appendChild(
                eventTitle
            );


            cell.title =
                event.summary ||
                "Ocupado";

        }
        else {

            cell.classList.add(
                "available"
            );

            cell.title =
                "Disponível";

        }


        /* HOJE */

        const today =
            new Date();


        if (
            date.getDate() ===
                today.getDate() &&

            date.getMonth() ===
                today.getMonth() &&

            date.getFullYear() ===
                today.getFullYear()
        ) {

            cell.classList.add(
                "today"
            );

        }


        calendar.appendChild(
            cell
        );

    }

}


/* =========================================================
   EVENTOS DO DIA
========================================================= */

function getEventsForDate(dateString) {

    return availabilityEvents.filter(event => {

        const start =
            event.start?.date ||
            event.start?.dateTime;

        const end =
            event.end?.date ||
            event.end?.dateTime;

        if (!start) return false;


        /*
         * EVENTO DE DIA INTEIRO
         *
         * O Google retorna datas como:
         * 2026-08-30
         *
         * Não devemos usar new Date()
         * nesse caso, pois isso pode converter
         * para UTC e mudar o dia.
         */

        if (event.start?.date) {

            const eventStart =
                event.start.date;

            const eventEnd =
                event.end?.date ||
                event.start.date;


            return (
                dateString >= eventStart &&
                dateString < eventEnd
            );

        }


        /*
         * EVENTO COM HORÁRIO
         */

        const eventStart =
            new Date(start);

        const eventEnd =
            new Date(end);


        const year =
            eventStart.getFullYear();

        const month =
            String(
                eventStart.getMonth() + 1
            ).padStart(2, "0");

        const day =
            String(
                eventStart.getDate()
            ).padStart(2, "0");


        const eventStartDate =
            `${year}-${month}-${day}`;


        const endDateObj =
            new Date(
                eventEnd.getTime() - 1
            );


        const endYear =
            endDateObj.getFullYear();

        const endMonth =
            String(
                endDateObj.getMonth() + 1
            ).padStart(2, "0");

        const endDay =
            String(
                endDateObj.getDate()
            ).padStart(2, "0");


        const eventEndDate =
            `${endYear}-${endMonth}-${endDay}`;


        return (
            dateString >= eventStartDate &&
            dateString <= eventEndDate
        );

    });

}


/* =========================================================
   STATUS
========================================================= */

function getEventStatus(
    event
) {

    const title =
        (
            event.summary ||
            ""
        ).toLowerCase();


    if (
        title.includes("reservado") ||
        title.includes("pendente")
    ) {

        return "pending";

    }


    return "busy";

}


/* =========================================================
   FORMATAR DATA
========================================================= */

function formatDate(
    date
) {

    const year =
        date.getFullYear();

    const month =
        String(
            date.getMonth() + 1
        ).padStart(2, "0");

    const day =
        String(
            date.getDate()
        ).padStart(2, "0");


    return `${year}-${month}-${day}`;

}


/* =========================================================
   NAVEGAÇÃO
========================================================= */

function setupCalendarNavigation() {

    const previous =
        document.getElementById(
            "calendar-prev"
        );

    const next =
        document.getElementById(
            "calendar-next"
        );


    if (previous) {

        previous.addEventListener(
            "click",
            () => {

                currentCalendarDate.setMonth(
                    currentCalendarDate.getMonth() - 1
                );

                renderAvailabilityCalendar();

            }
        );

    }


    if (next) {

        next.addEventListener(
            "click",
            () => {

                currentCalendarDate.setMonth(
                    currentCalendarDate.getMonth() + 1
                );

                renderAvailabilityCalendar();

            }
        );

    }

}


/* =========================================================
   WHATSAPP
========================================================= */

function setupWhatsAppButton() {

    const button =
        document.getElementById(
            "availability-whatsapp"
        );


    if (!button) return;


    const phone =
        "SEU_NUMERO_AQUI";


    const message =
        "Olá Pedro! Vi sua agenda de disponibilidade no site e gostaria de solicitar um orçamento para um evento.";


    button.href =
        "https://wa.me/" +
        phone +
        "?text=" +
        encodeURIComponent(
            message
        );

}


/* =========================================================
   DOM READY
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    initAvailabilityCalendar
);