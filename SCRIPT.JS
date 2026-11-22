// MESSCARD - Smart Mess Card Management System

function getStudents() {
    return JSON.parse(localStorage.getItem("students")) || [];
}

function saveStudents(students) {
    localStorage.setItem("students", JSON.stringify(students));
}

function getCurrentStudent() {
    let enrollment = localStorage.getItem("currentStudent");
    let students = getStudents();

    for (let i = 0; i < students.length; i++) {
        if (students[i].enrollment == enrollment) {
            return students[i];
        }
    }
    return null;
}

function todayDate() {
    let d = new Date();
    return d.getFullYear() + "-" +
        String(d.getMonth() + 1).padStart(2, "0") + "-" +
        String(d.getDate()).padStart(2, "0");
}


// STUDENT REGISTRATION

function generateQR() {
    let name = document.getElementById("studentName").value.trim();
    let enrollment = document.getElementById("enrollment").value.trim();
    let email = document.getElementById("email").value.trim();
    let type = document.getElementById("studentType").value;

    let plan = "";
    let fee = 0;
    let wallet = 0;

    if (!name || !enrollment || !email || !type) {
        alert("Please fill all details");
        return;
    }

    if (type == "Hosteller") {
        plan = document.getElementById("messPlan").value;

        if (plan == "") {
            alert("Please select your mess plan");
            return;
        }

        fee = Number(plan);
    }
    else if (type == "Day Scholar") {
        wallet = Number(document.getElementById("dayRecharge").value);

        if (!Number.isFinite(wallet) || wallet <= 0) {
            alert("Please enter a valid recharge amount");
            return;
        }
    }

    let students = getStudents();

    for (let i = 0; i < students.length; i++) {
        if (students[i].enrollment == enrollment) {
            alert("Enrollment number already registered");
            return;
        }
    }

    let student = {
        name: name,
        enrollment: enrollment,
        email: email,
        studentType: type,
        plan: type == "Hosteller" ?
            (fee == 3400 ? "Veg" : "Non-Veg") : "Day Scholar",
        monthlyFee: fee,
        balance: fee,
        wallet: wallet,
        meals: []
    };

    students.push(student);
    saveStudents(students);

    localStorage.setItem("currentStudent", enrollment);

    let successMessage = document.getElementById("registrationMessage");

    if (successMessage) {
        successMessage.innerText = "Student registered successfully!";
        successMessage.style.color = "green";
    }

    alert("Student registered successfully!");
}


// STUDENT DASHBOARD

function loadStudentDashboard() {
    let student = getCurrentStudent();
    if (!student) return;

    function set(id, value) {
        let el = document.getElementById(id);
        if (el) el.innerText = value;
    }

    set("dashboardName", student.name);
    set("dashboardEnrollment", student.enrollment);
    set("dashboardType", student.studentType);
    set("dashboardPlan", student.plan);

    set("dashboardBalance", "₹" +
        (student.studentType == "Hosteller" ?
        student.balance : student.wallet));

    set("balanceType", student.studentType == "Hosteller" ?
        "Subscription Balance" : "Wallet Balance");

    set("breakfastCharge",
        student.studentType == "Hosteller" ?
        (student.plan == "Veg" ? "₹29.82" : "₹33.33") : "₹50");

    let lunchPrice = "₹70";

    if (student.studentType == "Hosteller") {
        lunchPrice = student.plan == "Veg" ? "₹41.75" : "₹46.67";
    } else {
        let day = new Date().getDay();
        lunchPrice = (day == 1 || day == 3 || day == 5) ?
            "₹80 (Non-Veg)" : "₹70 (Veg)";
    }

    set("lunchCharge", lunchPrice);

    set("dinnerCharge",
        student.studentType == "Hosteller" ?
        (student.plan == "Veg" ? "₹41.75" : "₹46.67") : "₹70");
}


// MY CARD

function loadMyCard() {
    let student = getCurrentStudent();
    if (!student) return;

    function set(id, value) {
        let el = document.getElementById(id);
        if (el) el.innerText = value;
    }

    set("cardName", student.name);
    set("cardEnrollment", student.enrollment);
    set("cardType", student.studentType);
    set("cardPlan", student.plan);

    let qr = document.getElementById("studentQR");

    if (qr) {
        qr.innerHTML = "";
        new QRCode(qr, student.enrollment);
    }
}


// WALLET

function loadWallet() {
    let student = getCurrentStudent();
    if (!student) return;

    function set(id, value) {
        let el = document.getElementById(id);
        if (el) el.innerText = value;
    }

    let hosteller = document.getElementById("hostellerWallet");
    let dayScholar = document.getElementById("dayScholarWallet");

    if (student.studentType == "Hosteller") {
        if (hosteller) hosteller.style.display = "block";
        if (dayScholar) dayScholar.style.display = "none";

        set("walletPlan", student.plan);
        set("walletFee", "₹" + student.monthlyFee);
        set("walletBalance", "₹" + student.balance);

        set("walletBreakfast",
            student.plan == "Veg" ? "₹29.82" : "₹33.33");

        set("walletLunch",
            student.plan == "Veg" ? "₹41.75" : "₹46.67");

        set("walletDinner",
            student.plan == "Veg" ? "₹41.75" : "₹46.67");
    }

    else {
        if (hosteller) hosteller.style.display = "none";
        if (dayScholar) dayScholar.style.display = "block";

        set("dayWalletBalance", "₹" + student.wallet);
        set("walletBreakfast", "₹50");

        let day = new Date().getDay();

        set("walletLunch",
            (day == 1 || day == 3 || day == 5) ?
            "₹80 (Non-Veg)" : "₹70 (Veg)");

        set("walletDinner", "₹70");
    }
}


// DAY SCHOLAR RECHARGE

function rechargeWallet() {
    let student = getCurrentStudent();
    let input = document.getElementById("rechargeAmount");
    let amount = Number(input ? input.value : 0);

    if (!student || student.studentType != "Day Scholar") {
        alert("Day Scholar wallet not found");
        return;
    }

    if (!Number.isFinite(amount) || amount <= 0) {
        alert("Enter a valid recharge amount");
        return;
    }

    student.wallet = Number(student.wallet) + amount;

    let students = getStudents();

    for (let i = 0; i < students.length; i++) {
        if (students[i].enrollment == student.enrollment) {
            students[i] = student;
        }
    }

    saveStudents(students);

    let balance = document.getElementById("dayWalletBalance");
    if (balance) balance.innerText = "₹" + student.wallet;

    if (input) input.value = "";

    alert("Wallet recharged successfully");
}


// STAFF COMMON MEAL QR

function generateStaffQR() {
    let select = document.getElementById("staffMeal");
    let meal = select ? select.value : "";

    let qrBox = document.getElementById("staffQR");
    let message = document.getElementById("staffMessage");

    if (!meal) {
        if (message) message.innerText = "Please select a meal";
        return;
    }

    if (!qrBox) return;

    let payload = "MESSCARD|" + meal + "|" + todayDate();

    qrBox.innerHTML = "";

    new QRCode(qrBox, {
        text: payload,
        width: 220,
        height: 220
    });

    if (message) {
        message.innerText =
            meal + " QR generated for today. All students use this same QR.";
    }

    localStorage.setItem("activeMealQR", payload);
}


// SCAN STAFF QR

let scannedMeal = "";
let scannedDate = "";

function onMealQRScanned(decodedText) {
    let parts = decodedText.split("|");
    let message = document.getElementById("verificationMessage");

    if (parts.length != 3 || parts[0] != "MESSCARD") {
        if (message) message.innerText = "Invalid MESSCARD QR code";
        return;
    }

    scannedMeal = parts[1];
    scannedDate = parts[2];

    let mealSelect = document.getElementById("verifyMeal");

    if (mealSelect) mealSelect.value = scannedMeal;

    if (message) {
        message.innerText =
            "QR scanned: " + scannedMeal +
            ". Enter your enrollment number and verify.";
    }
}


// VERIFY MEAL

function verifyMeal() {
    let enrollmentInput = document.getElementById("verifyEnrollment");
    let mealSelect = document.getElementById("verifyMeal");
    let message = document.getElementById("verificationMessage");

    let enrollment = enrollmentInput ?
        enrollmentInput.value.trim() : "";

    let meal = scannedMeal ||
        (mealSelect ? mealSelect.value : "");

    let date = scannedDate || todayDate();

    if (!enrollment) {
        if (message) message.innerText = "Enter your enrollment number";
        return;
    }

    if (!meal) {
        if (message) message.innerText = "Scan the staff meal QR first";
        return;
    }

    if (date != todayDate()) {
        if (message) message.innerText =
            "This QR is expired. Please scan today's meal QR.";

        scannedMeal = "";
        scannedDate = "";
        return;
    }

    let students = getStudents();
    let student = null;

    for (let i = 0; i < students.length; i++) {
        if (students[i].enrollment == enrollment) {
            student = students[i];
            break;
        }
    }

    if (!student) {
        if (message) message.innerText =
            "Student not found. Please register first.";
        return;
    }

    if (!student.meals) student.meals = [];

    for (let i = 0; i < student.meals.length; i++) {
        if (student.meals[i].meal == meal &&
            student.meals[i].date == date) {

            if (message) message.innerText =
                "This meal has already been verified today.";

            return;
        }
    }

    let amount = 0;

    if (student.studentType == "Hosteller") {

        if (student.plan == "Veg") {
            amount = meal == "Breakfast" ? 29.82 : 41.75;
        } else {
            amount = meal == "Breakfast" ? 33.33 : 46.67;
        }

        if (Number(student.balance) < amount) {
            if (message) message.innerText =
                "Insufficient subscription balance.";
            return;
        }

        student.balance =
            Number((Number(student.balance) - amount).toFixed(2));
    }

    else {
        if (meal == "Breakfast") amount = 50;
        else if (meal == "Dinner") amount = 70;
        else if (meal == "Lunch") {
            let day = new Date().getDay();
            amount = (day == 1 || day == 3 || day == 5) ? 80 : 70;
        }

        if (Number(student.wallet) < amount) {
            if (message) message.innerText =
                "Insufficient wallet balance. Please recharge.";
            return;
        }

        student.wallet = Number(student.wallet) - amount;
    }

    student.meals.push({
        name: student.name,
        enrollment: student.enrollment,
        meal: meal,
        date: date,
        amount: amount,
        status: "Verified"
    });

    for (let i = 0; i < students.length; i++) {
        if (students[i].enrollment == enrollment) {
            students[i] = student;
        }
    }

    saveStudents(students);

    if (message) message.innerText =
        "Meal verified! ₹" + amount.toFixed(2) +
        " deducted. You may close this page.";

    if (enrollmentInput) enrollmentInput.value = "";

    scannedMeal = "";
    scannedDate = "";
}


// MEAL HISTORY

function loadMealHistory() {
    let student = getCurrentStudent();
    if (!student) return;

    if (!student.meals) student.meals = [];

    let table = document.getElementById("mealHistoryTable");
    if (!table) return;

    let total = 0;
    table.innerHTML = "";

    for (let i = 0; i < student.meals.length; i++) {
        let meal = student.meals[i];
        total += Number(meal.amount);

        table.innerHTML +=
            "<tr><td>" + meal.date + "</td>" +
            "<td>" + meal.meal + "</td>" +
            "<td>₹" + Number(meal.amount).toFixed(2) + "</td>" +
            "<td>" + meal.status + "</td></tr>";
    }

    let totalMeals = document.getElementById("totalMeals");
    let totalDeducted = document.getElementById("totalDeducted");

    if (totalMeals) totalMeals.innerText = student.meals.length;
    if (totalDeducted) totalDeducted.innerText = "₹" + total.toFixed(2);

    if (student.meals.length == 0) {
        table.innerHTML =
            "<tr><td colspan='4'>No meal records available yet.</td></tr>";
    }
}


// STAFF DASHBOARD

function loadStaffDashboard() {
    let students = getStudents();
    let meals = [];

    for (let i = 0; i < students.length; i++) {
        for (let j = 0; j < (students[i].meals || []).length; j++) {
            meals.push(students[i].meals[j]);
        }
    }

    function set(id, value) {
        let el = document.getElementById(id);
        if (el) el.innerText = value;
    }

    set("staffTotalMeals", meals.length);

    let breakfast = 0;
    let lunch = 0;
    let dinner = 0;

    for (let i = 0; i < meals.length; i++) {
        if (meals[i].meal == "Breakfast") breakfast++;
        if (meals[i].meal == "Lunch") lunch++;
        if (meals[i].meal == "Dinner") dinner++;
    }

    set("staffBreakfast", breakfast);
    set("staffLunch", lunch);
    set("staffDinner", dinner);

    let table = document.getElementById("staffRecords");
    if (!table) return;

    table.innerHTML = "";

    for (let i = 0; i < meals.length; i++) {
        table.innerHTML +=
            "<tr><td>" + meals[i].name + "</td>" +
            "<td>" + meals[i].enrollment + "</td>" +
            "<td>" + meals[i].meal + "</td>" +
            "<td>" + meals[i].date + "</td>" +
            "<td>₹" + meals[i].amount + "</td>" +
            "<td>" + meals[i].status + "</td></tr>";
    }

    if (meals.length == 0) {
        table.innerHTML =
            "<tr><td colspan='6'>No meal records available.</td></tr>";
    }
}


// ADMIN DASHBOARD

function loadDashboard() {
    let students = getStudents();
    let veg = 0;
    let nonVeg = 0;

    let table = document.getElementById("studentTable");
    if (table) table.innerHTML = "";

    for (let i = 0; i < students.length; i++) {
        if (students[i].plan == "Veg") veg++;
        else if (students[i].plan == "Non-Veg") nonVeg++;

        if (table) {
            table.innerHTML +=
                "<tr><td>" + students[i].name + "</td>" +
                "<td>" + students[i].enrollment + "</td>" +
                "<td>" + students[i].studentType + "</td>" +
                "<td>" + students[i].plan + "</td></tr>";
        }
    }

    function set(id, value) {
        let el = document.getElementById(id);
        if (el) el.innerText = value;
    }

    set("totalStudents", students.length);
    set("vegStudents", veg);
    set("nonVegStudents", nonVeg);

    if (table && !students.length) {
        table.innerHTML =
            "<tr><td colspan='4'>No students registered yet.</td></tr>";
    }
}


// ADMIN LOGIN

function adminLogin() {
    let id = document.getElementById("adminId").value;
    let password = document.getElementById("adminPassword").value;

    if (id == "admin" && password == "1234") {
        window.location.href = "ADMIN-DASHBOARD.HTML";
    } else {
        alert("Incorrect Admin ID or Password");
    }
}


// STAFF LOGIN

function staffLogin() {
    let id = document.getElementById("staffId").value;
    let password = document.getElementById("staffPassword").value;

    if (id == "staff" && password == "1234") {
        window.location.href = "VERIFICATION.HTML";
    } else {
        alert("Incorrect Staff ID or Password");
    }
}


// REGISTRATION FIELD TOGGLE

function updateRegistrationFields() {
    let type = document.getElementById("studentType").value;

    let hostellerFields = document.getElementById("hostellerFields");
    let dayScholarFields = document.getElementById("dayScholarFields");

    if (hostellerFields)
        hostellerFields.style.display =
            type == "Hosteller" ? "block" : "none";

    if (dayScholarFields)
        dayScholarFields.style.display =
            type == "Day Scholar" ? "block" : "none";
}


// QR CAMERA SCANNER

function startMealScanner() {
    if (typeof Html5Qrcode == "undefined") {
        let msg = document.getElementById("verificationMessage");

        if (msg) msg.innerText =
            "QR scanner library could not load. Refresh and try again.";

        return;
    }

    let scanner = new Html5Qrcode("qrReader");

    scanner.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: 220 },
        (decodedText) => {
            onMealQRScanned(decodedText);
            scanner.stop().catch(() => {});
        }
    ).catch(() => {
        let msg = document.getElementById("verificationMessage");

        if (msg) msg.innerText =
            "Camera could not start. Allow camera access and use HTTPS.";
    });
}


// PAGE INITIALIZATION

if (document.getElementById("dashboardName")) loadStudentDashboard();
if (document.getElementById("cardName")) loadMyCard();
if (document.getElementById("hostellerWallet")) loadWallet();
if (document.getElementById("mealHistoryTable")) loadMealHistory();
if (document.getElementById("staffRecords")) loadStaffDashboard();
if (document.getElementById("studentTable")) loadDashboard();