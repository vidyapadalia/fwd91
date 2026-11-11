

function showPaymentOptions() {
    let category = document.getElementById("category").value;

    document.getElementById("hostellerOptions").style.display =
        category == "Hosteller" ? "block" : "none";

    document.getElementById("dayScholarOptions").style.display =
        category == "Day Scholar" ? "block" : "none";
}


function registerStudent() {
    let name = document.getElementById("studentName").value.trim();
    let enrollment = document.getElementById("enrollment").value.trim();
    let email = document.getElementById("email").value.trim();
    let category = document.getElementById("category").value;

    if (!name || !enrollment || !email || !category) {
        alert("Please fill all the details");
        return;
    }

    let students = JSON.parse(localStorage.getItem("students")) || [];

    if (students.some(s => s.enrollment == enrollment)) {
        alert("Student already registered!");
        return;
    }

    let plan = category == "Hosteller"
        ? document.getElementById("messPlan").value
        : "0";

    let wallet = {
    breakfast: 0,
    lunch: 0,
    dinner: 0
};

if (category == "Hosteller") {
    wallet.breakfast = Math.round(Number(plan) * 500 / 19);
    wallet.lunch = Math.round(Number(plan) * 700 / 19);
    wallet.dinner = Number(plan) -
        wallet.breakfast - wallet.lunch;
} else {
    let amount = Number(document.getElementById("initialRecharge").value) || 0;

    wallet.breakfast = amount;
}

    if (category == "Hosteller") {
        wallet.breakfast = Math.round(Number(plan) * 500 / 19 * 100) / 100;
        wallet.lunch = Math.round(Number(plan) * 700 / 19 * 100) / 100;
        wallet.dinner = Number(plan) -
            wallet.breakfast - wallet.lunch;
    }

    let student = {
        name: name,
        enrollment: enrollment,
        email: email,
        category: category,
        plan: category == "Hosteller"
            ? (plan == "3400" ? "Veg" : "Non-Veg")
            : "Day Scholar",
        wallet: wallet,
        transactions: []
    };

    students.push(student);

    localStorage.setItem("students", JSON.stringify(students));
    localStorage.setItem("currentStudent", enrollment);

    alert("Registration Successful!");

    showWallet(enrollment);
}

function showWallet(enrollment) {
    let students = JSON.parse(localStorage.getItem("students")) || [];
    let student = students.find(s => s.enrollment == enrollment);

    if (!student) return;

    document.getElementById("walletSection").style.display = "block";

    document.getElementById("breakfastBalance").innerHTML =
        student.wallet.breakfast.toFixed(2);

    document.getElementById("lunchBalance").innerHTML =
        student.wallet.lunch.toFixed(2);

    document.getElementById("dinnerBalance").innerHTML =
        student.wallet.dinner.toFixed(2);

    let history = document.getElementById("transactionHistory");
    history.innerHTML = "";

    student.transactions.forEach(t => {
        history.innerHTML += "<li>" + t + "</li>";
    });
}

function addMoney() {
    let enrollment = localStorage.getItem("currentStudent");
    let amount = Number(document.getElementById("rechargeAmount").value);
    let meal = document.getElementById("walletMeal").value;

    if (!enrollment || amount <= 0 || !Number.isFinite(amount)) {
        alert("Please enter a valid recharge amount");
        return;
    }

    let students = JSON.parse(localStorage.getItem("students")) || [];
    let student = students.find(s => s.enrollment == enrollment);

    if (!student) return;

    student.wallet[meal] =
        Math.round((student.wallet[meal] + amount) * 100) / 100;

    student.transactions.push(
        "Added ₹" + amount.toFixed(2) + " to " + meal
    );

    localStorage.setItem("students", JSON.stringify(students));

    document.getElementById("rechargeAmount").value = "";

    showWallet(enrollment);

    alert("Money added successfully!");
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

    let veg = students.filter(s => s.plan == "Veg").length;
    let nonVeg = students.filter(s => s.plan == "Non-Veg").length;

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

if (document.getElementById("walletSection")) {
    let enrollment = localStorage.getItem("currentStudent");

    if (enrollment) {
        showWallet(enrollment);
    }
}



function addMoney() {
    let amount = Number(document.getElementById("rechargeAmount").value);

    if (amount <= 0 || !Number.isFinite(amount)) {
        alert("Please enter a valid amount");
        return;
    }

    let balance = Number(localStorage.getItem("walletBalance")) || 0;
    balance = balance + amount;

    localStorage.setItem("walletBalance", balance);

    document.getElementById("walletBalance").innerHTML = balance;
    document.getElementById("rechargeAmount").value = "";

    alert("Money added successfully!");
}

function registerStudent() {
    let name = document.getElementById("studentName").value;
    let enrollment = document.getElementById("enrollment").value;
    let email = document.getElementById("email").value;
    let category = document.getElementById("category").value;

    if (name == "" || enrollment == "" || email == "" || category == "") {
        alert("Please fill all the details");
        return;
    }

    let students = JSON.parse(localStorage.getItem("students")) || [];

    if (students.some(student => student.enrollment == enrollment)) {
        alert("Student already registered!");
        return;
    }

    let student = {
        name: name,
        enrollment: enrollment,
        email: email,
        category: category,
        plan: category == "Hosteller"
            ? (document.getElementById("messPlan").value == "3400"
                ? "Veg" : "Non-Veg")
            : "Day Scholar",
        wallet: category == "Day Scholar"
            ? Number(localStorage.getItem("walletBalance")) || 0
            : 0
    };

    students.push(student);
    localStorage.setItem("students", JSON.stringify(students));

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
