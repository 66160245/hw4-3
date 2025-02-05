document.getElementById("create-form").addEventListener("submit", function (event) {
    event.preventDefault();


    const appointment = {
        title: document.getElementById("input-title").value,
        date: document.getElementById("input-date").value,
        startTime: document.getElementById("start-time").value,
        endTime: document.getElementById("end-time").value,
        status: "confirm"

    };
    createAppointment(appointment);
});

function createAppointment(appointment) {

    if (checkTimeConflict(appointment.date, appointment.startTime, appointment.endTime)) {
        return;
    }

    let appointments = JSON.parse(localStorage.getItem("appointData")) || [];

    appointments.push(appointment);

    localStorage.setItem("appointData", JSON.stringify(appointments));

    showData();


}

function checkTimeConflict(date, startTime, endTime) {
    let appointments = JSON.parse(localStorage.getItem("appointData")) || [];
    return appointments.some(app =>
        app.date === date &&
        (
            (startTime >= app.startTime && startTime < app.endTime) ||
            (endTime > app.startTime && endTime <= app.endTime) ||
            (startTime <= app.startTime && endTime >= app.endTime)
        )
    );
}

function showData() {
    const list = JSON.parse(localStorage.getItem("appointData")) || [];
    const appContrainer = document.getElementById("appDisplay");
    appContrainer.innerHTML = "";

    list.forEach((appointment) => {
        const appList = document.createElement("li");
        appList.innerHTML = `
            <p><strong>TITLE:</strong> ${appointment.title}</p>
            <p><strong>DATE:</strong> ${appointment.date}</p>
            <p><strong>START TIME:</strong> ${appointment.startTime}</p>
            <p><strong>END TIME:</strong> ${appointment.endTime}</p>
            <hr>
        `;
        appContrainer.appendChild(appList);
    });


}