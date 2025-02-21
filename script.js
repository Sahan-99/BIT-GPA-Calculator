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
    const year = parseInt(document.getElementById("year").value);
    const semester = parseInt(document.getElementById("semester").value);
    const tableBody = document.querySelector("#subjectTable tbody");
    tableBody.innerHTML = "";

    if (subjects[year] && subjects[year][semester]) {
        subjects[year][semester].forEach(subject => {
            let row = `<tr>
                <td>${subject.name}</td>
                <td>${subject.credit}</td>
                <td>
                    <select class="grade">
                        <option value="4">A+</option>
                        <option value="4.0">A</option>
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
    } else {
        tableBody.innerHTML = "<tr><td colspan='3'>No subjects available</td></tr>";
    }
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

    // Display semester GPA
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
    let totalYearPoints = 0;
    let yearsCompleted = 0;

    for (let year in yearGPA) {
        if (yearGPA[year]) {
            totalYearPoints += parseFloat(yearGPA[year]);
            yearsCompleted++;
        }
    }

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

// Load jsPDF library
const { jsPDF } = window.jspdf;

let userGrades = {}; // Object to store user-entered grades for all semesters

// Store user grades when the user selects a grade
function storeGrades() {
    const year = document.getElementById("year").value;
    const semester = document.getElementById("semester").value;
    
    // If this year and semester combination does not exist in the userGrades object, create it
    userGrades[year] = userGrades[year] || {};
    userGrades[year][semester] = userGrades[year][semester] || {};

    // Loop through the subjects table and store the entered grades
    document.querySelectorAll("#subjectTable tbody tr").forEach(row => {
        const moduleName = row.cells[0].innerText.trim();
        const gradeElement = row.querySelector(".grade");
        const gradeValue = gradeElement.value;

        userGrades[year][semester][moduleName] = gradeValue;
    });
}

// Function to generate the report
function generateReport() {
    const doc = new jsPDF();
    let yPos = 15;

    doc.setFont("helvetica", "bold"); 
    
    doc.setFontSize(18);
    doc.setTextColor(0, 0, 255); 

    const pageWidth = doc.internal.pageSize.width; // Get page width
    const text = "BIT GPA REPORT";
    const textWidth = doc.getTextWidth(text); // Get text width

    doc.text(text, pageWidth / 2 - textWidth / 2, yPos); // Center align text
    yPos += 20;
    doc.setTextColor(0, 0, 0);

    // Reset font to normal after this if needed
    doc.setFont("helvetica", "normal");

    doc.setFontSize(13);
    doc.setTextColor(255, 0, 0); 
    doc.setFont("helvetica", "bold");
    doc.text("Module Name", 20, yPos);
    doc.text("Grade", 144, yPos);
    yPos += 5;
    doc.line(10, yPos, 200, yPos);
    yPos += 6;
    doc.setTextColor(0, 0, 0);

    let pageHeight = doc.internal.pageSize.height;  // Get the page height

    // Loop through all years and semesters
    for (let year in subjects) {
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text(`Year ${year}`, 10, yPos);
        yPos += 7;
        doc.setFont("helvetica", "normal");
        

        for (let semester in subjects[year]) {
            doc.setFontSize(11);
            doc.setFont("helvetica", "bold");
            doc.text(`Semester ${semester}`, 15, yPos);
            yPos += 7;
            doc.setFont("helvetica", "normal");
            

            // Loop through all subjects for the current year and semester
            subjects[year][semester].forEach(subject => {
                let gradeText = "-"; // Default grade

                // Check if there's a stored grade for the current subject
                if (userGrades[year] && userGrades[year][semester] && userGrades[year][semester][subject.name]) {
                    gradeText = getGradeText(userGrades[year][semester][subject.name]);
                }

                 // Check if we need to add a new page
                    if (yPos > pageHeight - 15) {
                        doc.addPage();  // Add new page
                        yPos = 10;  // Reset y position for the new page
                    }

                doc.text(subject.name, 20, yPos);
                doc.text(gradeText, 150, yPos);
                yPos += 7;
            });

            yPos += 5;
        }
        yPos += 5;
    }

    doc.line(10, yPos, 200, yPos);
    yPos += 10;

    // Display GPA & Classification
    const overallGPA = document.getElementById("overallGPA").innerText;
    const classification = document.getElementById("classification").innerText;

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold"); 
    doc.text("Overall GPA :", 10, yPos);
    doc.setTextColor(0, 128, 0); 
    doc.text(overallGPA, 40, yPos); 



    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0); 
    doc.text("Classification :", 100, yPos);
    doc.setTextColor(0, 128, 0); 
    doc.text(classification, 133, yPos); 

    doc.save("GPA_Report.pdf");
}

// Helper function to map grade values to grade text
function getGradeText(gradeValue) {
    switch (gradeValue) {
        case "4": return "A+";
        case "4.0": return "A";
        case "3.7": return "A-";
        case "3.3": return "B+";
        case "3": return "B";
        case "2.7": return "B-";
        case "2.3": return "C+";
        case "2": return "C";
        case "1.7": return "C-";
        case "1.3": return "D+";
        case "1": return "D";
        case "0": return "E";
        default: return "-";
    }
}

// Call storeGrades when the user updates grades
document.querySelector("#subjectTable").addEventListener("change", storeGrades);

// Call loadSubjects when the page loads and on year/semester change
window.onload = loadSubjects;
document.getElementById("year").addEventListener("change", loadSubjects);
document.getElementById("semester").addEventListener("change", loadSubjects);
