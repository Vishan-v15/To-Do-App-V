// When the page fully loads, run this

document.addEventListener("DOMContentLoaded", function () {
    // shows the username in header
    const greeting = document.getElementById("welcomeText");
    if (greeting) {
        const userName = localStorage.getItem("userName") || "Friend";
        greeting.textContent = "Hey 👋 " + userName;
    }

    // load tasks from localstorage
    if (document.getElementById("tasklist")) {
        loadTasks();
    }

    // Make filter buttons work
    const filterButtons = document.querySelectorAll(".filter-btn");
    filterButtons.forEach(function (btn) {
        btn.addEventListener("click", function () {

            // Remove "Active" class from all buttons
            filterButtons.forEach(function (b) {
                b.classList.remove("Active");
            });

            // Add "Active" class to clicked button
            btn.classList.add("Active");

            // Show tasks based on filter
            filterTasks(btn.dataset.filter);
        });
    });

    // Add button work
    const addBtn = document.getElementById("addBtn");
    if (addBtn) {
        addBtn.addEventListener("click", function () {
            addTask();
        });
    }

    // Clear All button work
    const clearBtn = document.getElementById("clearBtn");
    if (clearBtn) {
        clearBtn.addEventListener("click", function () {
            clearAllTasks();
        });
    }

});

// Save name and go to to-do page
function startApp() {
    const nameInput = document.getElementById("name");

    if (!nameInput) return; // safety check

    const name = nameInput.value.trim();

    localStorage.setItem("userName", name || "Friend");
    console.log("Name entered:", name);
    window.location.href = "to-do.html";
}


// Add a new task to the list
function addTask() {
    const taskInput = document.getElementById("taskInput");
    const taskText = taskInput.value.trim();

    if (taskText === "") {
        taskInput.placeholder = "Please type a task first!";
        taskInput.focus();
        return;
    }

    const newTask = {
        id: Date.now(),
        text: taskText,
        completed: false
    };

    const tasks = getSavedTasks();
    tasks.push(newTask);
    saveTasks(tasks);
    loadTasks();

    taskInput.value = "";
    taskInput.placeholder = "Add a new task...";
    taskInput.focus();
}


// Show all tasks on screen
function loadTasks() {
    const tasks = getSavedTasks();
    const taskList = document.getElementById("tasklist");

    taskList.innerHTML = "";

    tasks.forEach(function (task) {
        showTask(task);
    });
}


// Create and display one task item
function showTask(task) {
    const taskList = document.getElementById("tasklist");

    const li = document.createElement("li");
    li.setAttribute("data-id", task.id);

    if (task.completed) {
        li.classList.add("completed-task");
    }

    li.innerHTML = `
        <div class="task-item">
            <input 
                type="checkbox" 
                ${task.completed ? "checked" : ""} 
                onchange="toggleComplete(${task.id})"
            >
            <span class="${task.completed ? "completed" : ""}">${task.text}</span>
        </div>

        <span class="status ${task.completed ? "done" : "pending"}">
            ${task.completed ? "Done" : "Pending"}
        </span>

        <button class="delete-btn" onclick="deleteTask(${task.id})">Delete</button>
    `;

    taskList.appendChild(li);
}


// Toggle task complete
function toggleComplete(taskId) {
    const tasks = getSavedTasks();

    tasks.forEach(function (task) {
        if (task.id === taskId) {
            task.completed = !task.completed;
        }
    });

    saveTasks(tasks);
    loadTasks();
}


// Delete one task
function deleteTask(taskId) {
    const tasks = getSavedTasks();

    const updatedTasks = tasks.filter(function (task) {
        return task.id !== taskId;
    });

    saveTasks(updatedTasks);
    loadTasks();
}


// Clear all tasks
function clearAllTasks() {
    const confirmed = confirm("Are you sure you want to delete all tasks?");
    if (confirmed) {
        localStorage.removeItem("tasks");
        loadTasks();
    }
}


// Filter tasks (All / Active / Completed)
function filterTasks(filter) {

    const allItems = document.querySelectorAll("#tasklist li");
    const tasks = getSavedTasks(); // ✅ FIX: moved outside loop

    allItems.forEach(function (li) {

        const taskId = Number(li.getAttribute("data-id"));

        const task = tasks.find(function (t) {
            return t.id === taskId;
        });

        if (!task) return;

        if (filter === "All") {
            li.style.display = "flex";
        } 
        else if (filter === "Active") {
            li.style.display = task.completed ? "none" : "flex";
        } 
        else if (filter === "Completed") {
            li.style.display = task.completed ? "flex" : "none";
        }
    });
}


// Theme toggle
function toggleTheme() {
    document.body.classList.toggle("dark-mode");

    const isDark = document.body.classList.contains("dark-mode");

    localStorage.setItem("theme", isDark ? "dark" : "light");

    const themeBtn = document.querySelector("nav button");
    if (themeBtn) {
        themeBtn.textContent = isDark ? "Light mode" : "Dark mode";
    }
}


// Get tasks
function getSavedTasks() {
    const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : [];
}


// Save tasks
function saveTasks(tasks) {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}