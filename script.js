
function generateQR() {
    let name = document.getElementById("studentName").value;
    let enrollment = document.getElementById("enrollment").value;
    let email = document.getElementById("email").value;
    let plan = document.getElementById("messPlan").value;

    if (name == "" || enrollment == "" || email == "") {
        alert("Please fill all the details");
        return;
    }

    let students = JSON.parse(localStorage.getItem("students")) || [];

    let exists = students.some(student => student.enrollment == enrollment);

    if (exists) {
        alert("Student already registered!");
        return;
    }

    let student = {
        name: name,
        enrollment: enrollment,
        email: email,
        plan: plan == "3400" ? "Veg" : "Non-Veg"
    };

    students.push(student);

    localStorage.setItem("students", JSON.stringify(students));

    document.getElementById("qrcode").innerHTML = "";

    new QRCode(document.getElementById("qrcode"), {
        text: enrollment,
        width: 150,
        height: 150
    });

    alert("Registration Successful!");
}






function generateStaffQR() {
    let meal = document.getElementById("staffMeal").value;

    let today = new Date().toDateString();

    let qrData = "MESSCARD|" + meal + "|" + today;

    document.getElementById("staffQR").innerHTML = "";

    new QRCode(document.getElementById("staffQR"), {
        text: qrData,
        width: 180,
        height: 180
    });

    document.getElementById("staffMessage").innerHTML =
        meal + " QR Code Generated Successfully!";
}


function staffLogin() {
    let id = document.getElementById("staffId").value;
    let password = document.getElementById("staffPassword").value;

    if (id == "" || password == "") {
        alert("Please enter Staff ID and Password");
    } else {
        window.location.href = "verification.html";
    }
}

function adminLogin() {
    let id = document.getElementById("adminId").value;
    let password = document.getElementById("adminPassword").value;

    if (id == "" || password == "") {
        alert("Please enter Admin ID and Password");
    } else {
        window.location.href = "dashboard.html";
    }
}


function loadDashboard() {
    let students = JSON.parse(localStorage.getItem("students")) || [];

    let veg = students.filter(student => student.plan == "Veg").length;
    let nonVeg = students.filter(student => student.plan == "Non-Veg").length;

    document.getElementById("totalStudents").innerHTML = students.length;
    document.getElementById("vegStudents").innerHTML = veg;
    document.getElementById("nonVegStudents").innerHTML = nonVeg;

    let table = document.getElementById("studentTable");

    table.innerHTML = "";

    students.forEach(student => {
        table.innerHTML += `
            <tr>
                <td>${student.name}</td>
                <td>${student.enrollment}</td>
                <td>${student.email}</td>
                <td>${student.plan}</td>
            </tr>
        `;
    });
}

if (document.getElementById("studentTable")) {
    loadDashboard();
}
