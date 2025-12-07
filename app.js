const db = {
    classes: {
        // classId
        "cls1": { id: "cls1", name: "Class 1" },
        "cls2": { id: "cls2", name: "Class 2" }
    },

    sections: {
        // sectionId
        "sec1": { id: "sec1", classId: "cls1", name: "Section A" },
        "sec2": { id: "sec2", classId: "cls1", name: "Section B" },
        "sec3": { id: "sec3", classId: "cls2", name: "Section A" },
    },

    students: {
        // studentId
        "stu1": {
            id: "stu1",
            sectionId: "sec3",
            name: "Ali",
            className: "Class 2",
            sectionName: "Section A",
            roll: 1,
            age: 12,
            gender: "male",
            phone: "0300-1234567",
            address: "Lahore"
        },

        "stu2": {
            id: "stu2",
            sectionId: "sec2",
            name: "Ayesha",
            className: "Class 1",
            sectionName: "Section B",
            roll: 2,
            age: 11,
            gender: "female",
            phone: "0300-9876543",
            address: "Karachi"
        },
        "stu3": {
            id: "stu3",
            sectionId: "sec3",
            name: "Noman",
            className: "Class 2",
            sectionName: "Section A",
            roll: 2,
            age: 11,
            gender: "female",
            phone: "0300-9876543",
            address: "Karachi"
        },
        "stu4": {
            id: "stu4",
            sectionId: "sec1",
            name: "Usman",
            className: "Class 1",
            sectionName: "Section A",
            roll: 2,
            age: 11,
            gender: "female",
            phone: "0300-9876543",
            address: "Karachi"
        }
    },

    attendance: {
    }

};
const existingDb = localStorage.getItem('db');
if (!existingDb) {
    localStorage.setItem('db', JSON.stringify(db));
}

function addStudent(sectionId, info) {
    const id = "stu" + Date.now();
    const db = JSON.parse(localStorage.getItem('db'));
    db.students[id] = { id, sectionId, ...info };
    localStorage.setItem('db', JSON.stringify(db));
    console.log(db.students);
}

var addStudentBtn = document.getElementById('addstudentBtn');
addStudentBtn?.addEventListener('click', function (e) {
    e.preventDefault();
    console.log('Add Student button clicked');
    const sectionId = document.getElementById('section').value;
    const name = document.getElementById('name').value;
    const roll = parseInt(document.getElementById('roll').value);
    const age = parseInt(document.getElementById('age').value);
    const phone = document.getElementById('phone').value;
    const address = document.getElementById('address').value;
    const gender = document.getElementById('gender').value;
    if (!sectionId || !name || isNaN(roll) || isNaN(age) || !phone || !address || !gender) {
        alert('Please fill in all fields correctly.');
        return;
    }
    if (roll <= 0 || !Number.isInteger(roll) || db.students && Object.values(db.students).some(student => student.sectionId === sectionId && student.roll === roll)) {
        alert('Please enter a valid and unique roll number.');
        return;
    }
    const sectionName = db.sections[sectionId].name;
    const className = db.classes[db.sections[sectionId].classId].name;
    const info = { name, className, sectionName, roll, age, gender, phone, address };
    addStudent(sectionId, info);
    alert('Student added successfully!');
});

const classId = document.getElementById('class');
console.log(classId);
classId?.addEventListener('change', function () {
    const selectedClassId = this.value;
    const sectionSelect = document.getElementById('section');
    sectionSelect.innerHTML = '<option value="">Select Section</option>';
    for (const sectionId in db.sections) {
        const section = db.sections[sectionId];
        if (section.classId === selectedClassId) {
            const option = document.createElement('option');
            option.value = section.id;
            option.textContent = section.name;
            sectionSelect.appendChild(option);
        }
    }
});
let onloadTodayAttendance = function () {
    const todayAttendance = document.getElementById("todays-attendanece");
    const db = JSON.parse(localStorage.getItem('db'));
    const todayDate = new Date().toISOString().split('T')[0];
    const todayAttcheck = db.attendance
    const totalStudents = document.getElementById("total-students");
    const presentStudent = document.getElementById("total-present");
    const absentStudent = document.getElementById("total-absent");
    const numberOfStudents = Object.keys(db.students).length;
    let totalPresent = 0;
    let totalAbsent = 0;
    let todayAttendanceStudents = "";

    totalStudents.innerText = numberOfStudents;

    for (const date in todayAttcheck) {
        if (date == todayDate) {
            // console.log("yes", date)
            for (const sec in todayAttcheck[date]) {
                for (const stu in todayAttcheck[date][sec]) {
                    for (const stuId in todayAttcheck[date][sec][stu]) {
                        let secctionName = (db.students[stuId].sectionName).replace("Section ", "");
                        let className = (db.students[stuId].className).replace("Class ", "");
                        todayAttendanceStudents += `<tr>
                        <td>${db.students[stuId].roll}</td>
                        <td>${db.students[stuId].name}</td>
                        <td>${className}-${secctionName}</td>
                        <td>${todayDate}</td>
                        <td><span class="${todayAttcheck[date][sec][stu][stuId] === 'Present' ? 'status-present' : 'status-absent'
                            }">${todayAttcheck[date][sec][stu][stuId]}</span></td>
                    </tr>`
                        if (todayAttcheck[date][sec][stu][stuId] === "Present") totalPresent++;
                        else if (todayAttcheck[date][sec][stu][stuId] === "Absent") totalAbsent++;
                    }

                }
            }
            break;
        }
    }
    if (todayAttendanceStudents != "") {
        presentStudent.innerText = totalPresent
        absentStudent.innerText = totalAbsent
        todayAttendance.innerHTML = todayAttendanceStudents
    }

    //  console.log(todayAttcheck[todayDate])
};

window.addEventListener('load', function () {
    if (document.getElementById('todays-attendanece')) {
        onloadTodayAttendance()
    }
});


let onloadShowClass = function () {
    const classSelect = document.getElementById('class');
    for (const classId in db.classes) {
        const classObj = db.classes[classId];
        const option = document.createElement('option');
        option.value = classObj.id;
        option.textContent = classObj.name;
        classSelect.appendChild(option);
    }
};

// window.onload = onloadShowClass;
window.addEventListener('load', function () {
    if (document.getElementById('class')) {
        onloadShowClass();
    }
});



const loadStudentAttBtn = document.getElementById('load-student-att');
loadStudentAttBtn?.addEventListener('click', function () {
    const attendancetable = document.getElementById('attendance-table');
    const classId = document.getElementById('class').value;
    const sectionId = document.getElementById('section').value;
    const db = JSON.parse(localStorage.getItem('db'));
    if (!classId && !sectionId) {
        alert('Please select class to load students.');
        return;
    } else if (!sectionId) {
        let structuredData = '';
        for (const studentId in db.students) {
            const student = db.students[studentId];
            const studentSection = db.sections[student.sectionId];
            if (studentSection.classId === classId) {
                structuredData += `<tr id="${student.id}" data-student-id="${student.id}">
                        <td>${student.roll}</td>
                        <td>${student.name}</td>
                        <td><input type="checkbox" value="Present"></td>
                        <td><input type="checkbox" value="Absent"></td>
                    </tr>`
            }
        }
        attendancetable.innerHTML = structuredData;

    } else {
        let structuredData = '';
        for (const studentId in db.students) {
            const student = db.students[studentId];
            const studentSection = db.sections[student.sectionId];
            if (student.sectionId === sectionId && studentSection.classId === classId) {
                structuredData += `<tr id="${student.id}" data-section="${student.sectionId}">
                        <td>${student.roll}</td>
                        <td>${student.name}</td>
                        <td><input type="checkbox" value="Present"></td>
                        <td><input type="checkbox" value="Absent"></td>
                    </tr>`
            }
        }
        attendancetable.innerHTML = structuredData;

    }
});

const saveAttendanceBtn = document.getElementById('save-attendance');

saveAttendanceBtn?.addEventListener('click', function () {

    const attendancetable = document.getElementById('attendance-table');
    const classId = document.getElementById('class').value;
    const date = new Date().toISOString().split('T')[0];

    const db = JSON.parse(localStorage.getItem('db'));

    if (!classId) {
        alert("Please select a class.");
        return;
    }

    // Create today's attendance and class object if missing
    if (!db.attendance[date]) db.attendance[date] = {};
    if (!db.attendance[date][classId]) db.attendance[date][classId] = {};

    // Loop rows (skip header)
    for (const row of attendancetable.rows) {

        const studentId = row.id;
        if (!studentId) continue;

        const student = db.students[studentId];

        // ALWAYS SAVE TO THE STUDENT'S REAL SECTION
        const sectionId = student.sectionId;

        // Create section if missing
        if (!db.attendance[date][classId][sectionId]) {
            db.attendance[date][classId][sectionId] = {};
        }

        const presentCheckbox = row.cells[2].querySelector("input[type='checkbox']");
        const absentCheckbox = row.cells[3].querySelector("input[type='checkbox']");

        if (presentCheckbox.checked) {
            db.attendance[date][classId][sectionId][studentId] = "Present";
        }
        else if (absentCheckbox.checked) {
            db.attendance[date][classId][sectionId][studentId] = "Absent";
        }
        else {
            db.attendance[date][classId][sectionId][studentId] = "Unmarked";
        }
    }

    localStorage.setItem('db', JSON.stringify(db));
    alert("Attendance saved!");
});

const logoutBtn = document.getElementById("logoutBtn")
console.log(logoutBtn)
logoutBtn?.addEventListener("click", function () {
    // Remove the loggedIn flag from localStorage
    localStorage.removeItem("loggedIn");

    // Optionally, you can clear all localStorage if needed
    // localStorage.clear();

    // Redirect back to login page
    window.location.href = "../index.html"; // adjust path according to your folder structure
});
