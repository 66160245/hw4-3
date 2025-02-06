document.getElementById("create-form").addEventListener("submit", function (event) {
    event.preventDefault();


    const appointment = {
        id: Date.now().toString(),
        title: document.getElementById("input-title").value,
        date: document.getElementById("input-date").value,
        startTime: document.getElementById("start-time").value,
        endTime: document.getElementById("end-time").value,
        status: "confirmed"

    };
    createAppointment(appointment);
});

function createAppointment(appointment) {

    let newAppointment = JSON.parse(localStorage.getItem("appointData")) || [];

    newAppointment.push(appointment);

    localStorage.setItem("appointData", JSON.stringify(newAppointment));

    showData();


}


function checkTimeConflict(id, date, startTime, endTime) {
    let newAppointment = JSON.parse(localStorage.getItem("appointData")) || [];
    return newAppointment.some(app =>
        app.date === date &&
        app.id !== id &&
        (
            (startTime >= app.startTime && startTime < app.endTime) ||
            (endTime > app.startTime && endTime <= app.endTime) ||
            (startTime <= app.startTime && endTime >= app.endTime)
        )
    );
}

function cancelAppointment(id) {
    let newAppointment = JSON.parse(localStorage.getItem("appointData")) || [];
    newAppointment = newAppointment.map(app =>
        app.id === id ? { ...app, status: "cancelled" } : app
    );

    localStorage.setItem("appointData", JSON.stringify(newAppointment));

    showData();

}

function getUpcomingAppointments() {
    let today = new Date().toISOString().split("T")[0];
    return (JSON.parse(localStorage.getItem("appointData")) || []).filter(app => app.date >= today);
}

function clearCancel(id) {
    let clear = JSON.parse(localStorage.getItem("appointData")) || [];

    let newData = clear.filter(data => data.status !== "cancel" && data.status !== "cancelled");

    localStorage.setItem("appointData", JSON.stringify(newData));

    showData();
}

function showData() {
    let list = JSON.parse(localStorage.getItem("appointData")) || [];
    const appContrainer = document.getElementById("appDisplay");
    appContrainer.innerHTML = "";

    let now = new Date();
    let currentDate = now.toISOString().split("T")[0];
    let currentTime = now.toTimeString().split(" ")[0].substring(0, 5);
    list = list.filter(app =>
        app.date > currentDate || (app.date === currentDate && app.endTime > currentTime)
    );
    list.sort((a, b) => {
        if (a.date !== b.date) {
            return a.date.localeCompare(b.date);
        }
        return a.startTime.localeCompare(b.startTime);
    });

    list.forEach((appointment) => {
        const appList = document.createElement("div");

        const checkTime = checkTimeConflict(appointment.id, appointment.date, appointment.startTime, appointment.endTime);

        appList.style.color = checkTime ? "red" : "black";
        const cancelled = appointment.status === "cancelled" ? "line-through text-gray-400" : "";


        appList.innerHTML = `
        <div id="show-box" style="${cancelled}">
            <p><strong>TITLE:</strong> ${appointment.title}</p>
            <p><strong>DATE:</strong> ${appointment.date}</p>
            <p<strong>START TIME:</strong> ${appointment.startTime}</p>
            <p><strong>END TIME:</strong> ${appointment.endTime}</p>
            <p><strong>STATUS :</strong> ${appointment.status}</p>
            <button id="cancel" onclick=" cancelAppointment('${appointment.id}')">CANCEL</button>
            <hr>
            </div>
        `;
        appContrainer.appendChild(appList);
    });


}

showData();
showData(getUpcomingAppointments());