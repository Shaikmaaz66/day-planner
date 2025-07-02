const planner = document.getElementById("planner");
const hours = [
  "6 AM", "7 AM", "8 AM", "9 AM", "10 AM", "11 AM",
  "12 PM", "1 PM", "2 PM", "3 PM", "4 PM", "5 PM",
  "6 PM", "7 PM", "8 PM", "9 PM", "10 PM"
];

function loadTasks() {
  return JSON.parse(localStorage.getItem("tasks")) || {};
}

function saveTasks(tasks) {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function getCurrentHourLabel() {
  const now = new Date();
  let hour = now.getHours();
  const isAM = hour < 12;
  if (hour > 12) hour -= 12;
  if (hour === 0) hour = 12;
  return `${hour} ${isAM ? "AM" : "PM"}`;
}

function renderPlanner() {
  const tasks = loadTasks();
  planner.innerHTML = "";

  const currentHour = getCurrentHourLabel();

  hours.forEach((hour) => {
    const taskObj = tasks[hour] || { text: "", done: false };

    const slot = document.createElement("div");
    slot.className = "time-slot";
    if (hour === currentHour) {
      slot.classList.add("current");
    }

    const label = document.createElement("div");
    label.className = "time-label";
    label.textContent = hour;

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = taskObj.done;
    checkbox.title = "Mark as done";

    const input = document.createElement("input");
    input.className = "task-input";
    input.value = taskObj.text;
    input.setAttribute("data-hour", hour);
    if (taskObj.done) {
      input.style.textDecoration = "line-through";
    }

    checkbox.addEventListener("change", () => {
      taskObj.done = checkbox.checked;
      tasks[hour] = taskObj;
      saveTasks(tasks);
      renderPlanner(); 
    });

    const saveBtn = document.createElement("button");
    saveBtn.className = "save-btn";
    saveBtn.textContent = "Save";
    saveBtn.addEventListener("click", () => {
      taskObj.text = input.value;
      tasks[hour] = taskObj;
      saveTasks(tasks);
      renderPlanner();
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";
    deleteBtn.textContent = "❌";
    deleteBtn.title = "Delete task";
    deleteBtn.addEventListener("click", () => {
      delete tasks[hour];
      saveTasks(tasks);
      renderPlanner();
    });

    slot.appendChild(label);
    slot.appendChild(checkbox);
    slot.appendChild(input);
    slot.appendChild(saveBtn);
    slot.appendChild(deleteBtn);
    planner.appendChild(slot);
  });
}

renderPlanner();