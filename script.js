document.getElementById("create-form").addEventListener("submit", function (event) {
    event.preventDefault();


    const appointment = {
        id: Date.now().toString(),
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

    let newAppointment = JSON.parse(localStorage.getItem("appointData")) || [];

    newAppointment.push(appointment);

    localStorage.setItem("appointData", JSON.stringify(newAppointment));

    showData();


}

function checkTimeConflict(date, startTime, endTime) {
    let newAppointment = JSON.parse(localStorage.getItem("appointData")) || [];
    return newAppointment.some(app =>
        app.date === date &&
        (
            (startTime >= app.startTime && startTime < app.endTime) ||
            (endTime > app.startTime && endTime <= app.endTime) ||
            (startTime <= app.startTime && endTime >= app.endTime)
        )
    );
}

function cancelAppointment(id){
    let newAppointment = JSON.parse(localStorage.getItem("appointData")) || [];
    newAppointment = newAppointment.map(app =>
        app.id === id ? { ...app, status: "cancelled" } : app
    );

    localStorage.setItem("appointData",JSON.stringify(newAppointment));

    showData();

}

function showData() {
    let list = JSON.parse(localStorage.getItem("appointData")) || [];
    const appContrainer = document.getElementById("appDisplay");
    appContrainer.innerHTML = "";

    list.forEach((appointment) => {
        const appList = document.createElement("li");
        appList.style.color = checkTimeConflict(appointment.date,appointment.startTime,appointment.endTime) ? "red" : "black";
        appList.innerHTML = `
            <p><strong>TITLE:</strong> ${appointment.title}</p>
            <p><strong>DATE:</strong> ${appointment.date}</p>
            <p><strong>START TIME:</strong> ${appointment.startTime}</p>
            <p><strong>END TIME:</strong> ${appointment.endTime}</p>
            <p><strong>STATUS :</strong> ${appointment.status}</p>
            <button onclick=" cancelAppointment('${appointment.id}')">CANCLE</button>
            <hr>
        `;
        appContrainer.appendChild(appList);
    });


}