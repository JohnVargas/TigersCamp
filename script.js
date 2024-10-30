// Datos iniciales
const weekendsLong = ["2023-12-02", "2024-01-06"];
const holidays = ["2023-11-01", "2023-11-02", "2023-12-25"];
const availability = {};
let selectedDays = [];

// Renderizar calendario dinámico para selección de usuario
function renderDynamicCalendar() {
    const dynamicCalendar = document.getElementById("dynamicCalendar");
    dynamicCalendar.innerHTML = "";
    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setMonth(startDate.getMonth() + 2);

    while (startDate <= endDate) {
        const dayEl = document.createElement("div");
        dayEl.className = "day";
        dayEl.textContent = startDate.getDate();
        dayEl.dataset.date = startDate.toISOString().split("T")[0];

        // Identificar fines de semana, fines de semana largos y feriados
        if (startDate.getDay() === 0 || startDate.getDay() === 6) {
            dayEl.classList.add("available");
        }
        if (weekendsLong.includes(dayEl.dataset.date)) {
            dayEl.classList.add("weekend-long");
        }
        if (holidays.includes(dayEl.dataset.date)) {
            dayEl.classList.add("holiday");
        }

        // Seleccionar días
        dayEl.addEventListener("click", () => {
            dayEl.classList.toggle("selected");
            const date = dayEl.dataset.date;
            if (selectedDays.includes(date)) {
                selectedDays = selectedDays.filter(d => d !== date);
            } else {
                selectedDays.push(date);
            }
        });

        dynamicCalendar.appendChild(dayEl);
        startDate.setDate(startDate.getDate() + 1);
    }
}

// Enviar disponibilidad del usuario
function submitAvailability() {
    const name = document.getElementById("name").value;
    if (!name) return alert("Por favor ingresa tu nombre");
    availability[name] = selectedDays;
    selectedDays = [];
    renderDynamicCalendar();
    updateAggregateCalendar();
}

// Renderizar calendario agregado con mapa de calor
function updateAggregateCalendar() {
    const aggregateCalendar = document.getElementById("aggregateCalendar");
    aggregateCalendar.innerHTML = "";
    const datesCount = {};

    // Contar disponibilidad en cada fecha
    Object.values(availability).forEach(days => {
        days.forEach(date => {
            datesCount[date] = (datesCount[date] || 0) + 1;
        });
    });

    // Renderizar calendario agregado con "mapa de calor"
    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setMonth(startDate.getMonth() + 2);

    while (startDate <= endDate) {
        const dayEl = document.createElement("div");
        dayEl.className = "day aggregate";
        dayEl.textContent = startDate.getDate();
        const date = startDate.toISOString().split("T")[0];

        // Agregar clase de mapa de calor según la cantidad de personas disponibles
        const count = datesCount[date] || 0;
        dayEl.classList.add(`aggregate-${Math.min(count, 4)}`);

        aggregateCalendar.appendChild(dayEl);
        startDate.setDate(startDate.getDate() + 1);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    renderDynamicCalendar();
    updateAggregateCalendar();
});
