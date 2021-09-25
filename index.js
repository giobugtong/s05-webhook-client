const tableContainer = document.getElementById("table-container");
const tableBody = document.getElementById("table-body");
const errorMsg = document.getElementById("error-msg");
const fetchBtn = document.getElementById("fetch-btn");
const spinner = document.getElementById("spinner");

let payload = JSON.parse(localStorage.getItem("payload")) || [];

const setPayload = data => {
    payload.push(data);
    localStorage.setItem("payload", JSON.stringify(payload));
}

const fetchData = () => {
    tableContainer.className = "d-none";
    spinner.className="spinner-grow mx-auto d-block"
    fetch("https://s05-webhook-api.herokuapp.com/result")
    .then(res => res.json())
    .then(data => {
        if (data.id && payload.length > 0) {
            if (data.id !== payload[payload.length - 1].id) {
                setPayload(data)
            }
        } else if (data.id) {
            setPayload(data);
        } else {
            console.warn("Fetch Error!", data)
        }
    })
    .then(() => {
        dataCheck()
        spinner.className="d-none"

    })
}

const populateTable = array => {
    if (array.length > 0) {
        for (let i = 0; i < array.length; i++) {
            let newRow = tableBody.insertRow(-1);
            let counter = newRow.insertCell(0);
            let timestamp = newRow.insertCell(1);
            let actor = newRow.insertCell(2);
            let action = newRow.insertCell(3);
            let resource = newRow.insertCell(4);
            let status = newRow.insertCell(5);
            
            counter.innerHTML = i + 1;
            timestamp.innerHTML = `${array[i].created_at.slice(0,10)} ${array[i].created_at.slice(11,19)}`;
            actor.innerHTML = array[i].actor.email;
            action.innerHTML = array[i].action;
            resource.innerHTML = array[i].resource;
            status.innerHTML = array[i].data.status;
            status.className = status.innerHTML == "succeeded" ? "font-weight-bold text-success" : "font-weight-bold text-danger"
        }

    }
}

const dataCheck = () => {
    if (payload.length > 0 && payload[0].id) {
        tableContainer.className = "";
        errorMsg.innerHTML = "";
        populateTable(payload);
    } else {
        tableContainer.className = "d-none";
        spinner.className="d-none"
        errorMsg.innerHTML = `No data received. Try refreshing the page. You may also simulate data by posting to <a class="text-light" href="https://s05-webhook-api.herokuapp.com/" target="_blank">https://s05-webhook-api.herokuapp.com/</a>`
    }
}

fetchBtn.addEventListener("click", () => location.reload())

window.onload = () => {
    fetchData();
}