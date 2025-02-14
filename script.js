const subjects = {
    1: {
        1: [
            { name: "Fundamentals of IT", credit: 3 },
            { name: "Mathematics for Computing", credit: 2 },
            { name: "Descriptive Statistics and Probability", credit: 2 },
            { name: "Office Automation and Productivity Tools", credit: 3 },
            { name: "Operating Systems", credit: 3 },
            { name: "Programming Fundamentals using Java", credit: 3 },
            { name: "Communication Skills", credit: 3 },
        ],
        2: [
            { name: "Fundamentals of Database Management", credit: 3 },
            { name: "Business Management", credit: 3 },
            { name: "Introduction to System Development", credit: 3 },
            { name: "Web Technologies", credit: 3 },
            { name: "Multimedia Technologies", credit: 3 },
            { name: "Soft Skills & Entrepreneurship Skills", credit: 2 },
        ]
    },
    2: {
        1: [
            { name: "Data Communication & Computer Network", credit: 3 },
            { name: "Object Oriented Programming", credit: 3 },
            { name: "Human Computer Interactions", credit: 3 },
            { name: "Information Assurance and Security", credit: 3 },
            { name: "Social and Professional Issues", credit: 3 },
            { name: "Software Engineering", credit: 3 },
        ],
        2: [
            { name: "Object Oriented System Development", credit: 2 },
            { name: "Aglie System Developments", credit: 2 },
            { name: "IT Management and Enterprise Modeling", credit: 3 },
            { name: "Research Methodology for IS", credit: 2 },
            { name: "e-Business Technologies", credit: 2 },
            { name: "IT Project Management", credit: 2 },
            { name: "Service Oriented Computing", credit: 2 },
            { name: "Advanced Data Management", credit: 3 },
            { name: "Mobile Application Development", credit: 3 },
        ]
    },
    3: {
        1: [
            { name: "IT Project (Group)", credit: 6 },
            { name: "Cloud Computing", credit: 3 },
            { name: "System and Network Administration", credit: 3 },
            { name: "Technoprenureship", credit: 3 },
        ],
        2: [
            
        ]
    }
};

let semesterGPA = {};
let yearGPA = {};
let overallGPA = 0;

function loadSubjects() {
    const year = document.getElementById("year").value;
    const semester = document.getElementById("semester").value;
    const tableBody = document.querySelector("#subjectTable tbody");
    tableBody.innerHTML = "";
    subjects[year][semester].forEach(subject => {
        let row = `<tr>
            <td>${subject.name}</td>
            <td>${subject.credit}</td>
            <td>
                <select class="grade">
                    <option value="4">A+</option>
                    <option value="4">A</option>
                    <option value="3.7">A-</option>
                    <option value="3.3">B+</option>
                    <option value="3">B</option>
                    <option value="2.7">B-</option>
                    <option value="2.3">C+</option>
                    <option value="2">C</option>
                    <option value="1.7">C-</option>
                    <option value="1.3">D+</option>
                    <option value="1">D</option>
                    <option value="0">E</option>
                </select>
            </td>
        </tr>`;
        tableBody.innerHTML += row;
    });
}

function calculateGPA() {
    let totalCredits = 0;
    let totalPoints = 0;

    document.querySelectorAll("#subjectTable tbody tr").forEach(row => {
        const credit = parseFloat(row.cells[1].innerText);
        const grade = parseFloat(row.querySelector(".grade").value);
        totalCredits += credit;
        totalPoints += credit * grade;
    });

    const gpa = (totalPoints / totalCredits).toFixed(2);
    const year = document.getElementById("year").value;
    const semester = document.getElementById("semester").value;

    // Store semester GPA
    semesterGPA[year] = semesterGPA[year] || {};
    semesterGPA[year][semester] = gpa;

    // Calculate and display semester GPA
    document.getElementById("semesterGPA").innerText = gpa;

    // Calculate Year GPA
    const semester1GPA = semesterGPA[year][1];
    const semester2GPA = semesterGPA[year][2];

    if (semester1GPA && semester2GPA) {
        yearGPA[year] = ((parseFloat(semester1GPA) + parseFloat(semester2GPA)) / 2).toFixed(2);
        document.getElementById("yearGPA").innerText = yearGPA[year];
    } else {
        document.getElementById("yearGPA").innerText = "-";
    }

    // Calculate Overall GPA
    let totalYearCredits = 0;
    let totalYearPoints = 0;
    let yearsCompleted = 0;

    for (let year in yearGPA) {
        if (yearGPA[year]) {
            totalYearCredits += 1;
            totalYearPoints += parseFloat(yearGPA[year]);
            yearsCompleted++;
        }
    }

    let overallGPA = "-";
    if (yearsCompleted > 0) {
        overallGPA = (totalYearPoints / yearsCompleted).toFixed(2);
        document.getElementById("overallGPA").innerText = overallGPA;
    } else {
        document.getElementById("overallGPA").innerText = "-";
    }

    // Determine Classification
    let classification = "-";
    if (overallGPA !== "-") {
        if (overallGPA > 3.7) {
            classification = "First Class";
        } else if (overallGPA > 3.4) {
            classification = "Second Class Upper";
        } else if (overallGPA > 3.0) {
            classification = "Second Class Lower";
        } else {
            classification = "General";
        }
    }

    document.getElementById("classification").innerText = classification;
}



loadSubjects();