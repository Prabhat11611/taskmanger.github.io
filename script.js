document.addEventListener("DOMContentLoaded", function () {
    const taskTitleInput = document.getElementById("task-title");
    const taskDescInput = document.getElementById("task-desc");
    const taskDateInput = document.getElementById("task-date");
    const taskCategoryInput = document.getElementById("task-category");
    const addTaskButton = document.getElementById("add-task");
    const taskList = document.getElementById("tasks");
    const searchInput = document.getElementById("search");

    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    let isEditing = false;
    let editingTaskIndex = null;

    function saveTasks() {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    function renderTasks(filter = "") {
        taskList.innerHTML = "";
        tasks
            .filter(task => task.title.toLowerCase().includes(filter.toLowerCase()))
            .forEach((task, index) => {
                const taskItem = document.createElement("li");
                taskItem.className = task.completed ? "completed" : "";
                taskItem.innerHTML = `
                    <div>
                        <strong>${task.title}</strong>
                        <p>${task.desc}</p>
                        <small>Due: ${task.date} | Category: ${task.category}</small>
                    </div>
                    <div>
                        <button class="complete-task">${task.completed ? "Undo" : "Complete"}</button>
                        <button class="edit-task">Edit</button>
                        <button class="delete-task">Delete</button>
                    </div>
                `;
                
                taskItem.querySelector(".complete-task").addEventListener("click", () => toggleComplete(index));
                taskItem.querySelector(".edit-task").addEventListener("click", () => {
                    if (!isEditing) {
                        editTask(index);
                    } else {
                        alert("Please finish editing the current task before editing another one.");
                    }
                });
                taskItem.querySelector(".delete-task").addEventListener("click", () => deleteTask(index));

                taskList.appendChild(taskItem);
            });
    }

    function addTask() {
        const title = taskTitleInput.value.trim();
        const desc = taskDescInput.value.trim();
        const date = taskDateInput.value;
        const category = taskCategoryInput.value;

        if (title === "" || date === "") {
            alert("Please fill out the task title and due date.");
            return;
        }

        if (isEditing) {
            tasks[editingTaskIndex] = {
                title,
                desc,
                date,
                category,
                completed: false
            };
            isEditing = false;
            editingTaskIndex = null;
        } else {
            const newTask = {
                title,
                desc,
                date,
                category,
                completed: false
            };
            tasks.push(newTask);
        }

        saveTasks();
        renderTasks();
        taskTitleInput.value = "";
        taskDescInput.value = "";
        taskDateInput.value = "";
    }

    function toggleComplete(index) {
        tasks[index].completed = !tasks[index].completed;
        saveTasks();
        renderTasks();
    }

    function editTask(index) {
        const task = tasks[index];
        taskTitleInput.value = task.title;
        taskDescInput.value = task.desc;
        taskDateInput.value = task.date;
        taskCategoryInput.value = task.category;

        isEditing = true;
        editingTaskIndex = index;

        addTaskButton.textContent = "Update Task";
    }

    function deleteTask(index) {
        if (isEditing && index === editingTaskIndex) {
            isEditing = false;
            editingTaskIndex = null;
            addTaskButton.textContent = "Add Task";
        }
        tasks.splice(index, 1);
        saveTasks();
        renderTasks();
    }

    addTaskButton.addEventListener("click", addTask);
    searchInput.addEventListener("input", (e) => renderTasks(e.target.value));

    renderTasks();
});
