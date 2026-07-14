/* =======================
   STUDENT DATA (10)
======================= */

const students = [
  { roll: 1, name: "Aarav Sharma", sem: [68, 70, 72, 75], attendance: 85, status: "Pass" },
  { roll: 2, name: "Riya Patel", sem: [60, 65, 67, 69], attendance: 78, status: "Pass" },
  { roll: 3, name: "Kabir Mehta", sem: [45, 48, 50, 52], attendance: 62, status: "Fail" },
  { roll: 4, name: "Ananya Verma", sem: [75, 78, 80, 82], attendance: 90, status: "Pass" },
  { roll: 5, name: "Aditya Singh", sem: [55, 58, 60, 63], attendance: 70, status: "Pass" },
  { roll: 6, name: "Sneha Iyer", sem: [82, 85, 87, 89], attendance: 94, status: "Pass" },
  { roll: 7, name: "Rahul Khanna", sem: [40, 42, 45, 47], attendance: 60, status: "Fail" },
  { roll: 8, name: "Pooja Nair", sem: [72, 74, 76, 78], attendance: 88, status: "Pass" },
  { roll: 9, name: "Kunal Joshi", sem: [66, 68, 70, 73], attendance: 82, status: "Pass" },
  { roll: 10, name: "Neha Gupta", sem: [58, 60, 62, 65], attendance: 75, status: "Pass" }
];

/* =======================
   DROPDOWN
======================= */

const studentSelect = document.getElementById("studentSelect");
const nameDiv = document.querySelector(".info-bar div:nth-child(1)");
const attendanceDiv = document.querySelector(".info-bar div:nth-child(2)");
const statusDiv = document.querySelector(".info-bar div:nth-child(3)");

students.forEach(student => {
  const option = document.createElement("option");
  option.value = student.roll;
  option.textContent = student.name;
  studentSelect.appendChild(option);
});

/* =======================
   CREATE CHARTS (EMPTY FIRST)
======================= */

const progressChart = new Chart(document.getElementById('progressChart'), {
  type: 'line',
  data: {
    labels: ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'],
    datasets: [{
      data: [],
      borderColor: '#4fd1ff',
      backgroundColor: 'rgba(79,209,255,0.2)',
      fill: true,
      tension: 0.4
    }]
  },
  options: { plugins: { legend: { display: false } } }
});

const passFailChart = new Chart(document.getElementById('passFailChart'), {
  type: 'doughnut',
  data: {
    labels: ['Pass', 'Fail'],
    datasets: [{
      data: [0, 0],
      backgroundColor: ['#5cb85c', '#ff4d4d']
    }]
  }
});

/* =======================
   UPDATE FUNCTION
======================= */

function updateDashboard(student) {

  // Update Info Text
  nameDiv.innerHTML = "Name: " + student.name;
  attendanceDiv.innerHTML = "Attendance: " + student.attendance + "%";
  statusDiv.innerHTML = "Status: " + student.status;

  // Update Line Chart
  progressChart.data.datasets[0].data = student.sem;
  progressChart.update();

  // Update Donut Chart
  if (student.status === "Pass") {
    passFailChart.data.datasets[0].data = [1, 0];
  } else {
    passFailChart.data.datasets[0].data = [0, 1];
  }
  passFailChart.update();
}

/* =======================
   DROPDOWN CHANGE EVENT
======================= */

studentSelect.addEventListener("change", function () {
  const selectedRoll = parseInt(this.value);
  const selectedStudent = students.find(s => s.roll === selectedRoll);
  updateDashboard(selectedStudent);
});

/* =======================
   INITIAL LOAD
======================= */

updateDashboard(students[0]);

/* =======================
   STATIC TOP 5 + ATTENDANCE (UNCHANGED)
======================= */

const top5 = [...students]
  .sort((a, b) => b.sem[3] - a.sem[3])
  .slice(0, 5);

new Chart(document.getElementById('topStudentsChart'), {
  type: 'bar',
  data: {
    labels: top5.map(s => s.name),
    datasets: [{
      data: top5.map(s => s.sem[3]),
      backgroundColor: '#4fd1ff',
      barThickness: 25
    }]
  },
  options: {
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: true } }
  }
});

new Chart(document.getElementById('attendanceChart'), {
  type: 'line',
  data: {
    labels: students.map(s => s.name),
    datasets: [{
      data: students.map(s => s.attendance),
      borderColor: '#00ffa6',
      tension: 0.4
    }]
  },
  options: {
    plugins: { legend: { display: false } }
  }
});
