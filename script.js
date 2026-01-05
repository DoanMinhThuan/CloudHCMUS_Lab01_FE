const taskForm = document.getElementById("taskForm");
const taskList = document.getElementById("taskList");
const editForm = document.getElementById("editForm");
const editFormContainer = document.getElementById("editFormContainer");
let currentTaskId = null;

const config = {
  ENVIRONMENT_PATH_DEV: "https://backend-dev.khacthienit.click",
  ENVIRONMENT_PATH_PROD: "https://backend-staigng.khacthienit.click"
};

// Fetch all tasks on page load
document.addEventListener("DOMContentLoaded", () => {
  fetchTasks();
});

// Add a new task
taskForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const title = document.getElementById("title").value;
  const description = document.getElementById("description").value;

  fetch(`${config.ENVIRONMENT_PATH_DEV}/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title, description }),
  })
    .then((response) => response.json())
    .then(() => {
      fetchTasks();
      taskForm.reset();
      alert("Task created successfully!");
    })
    .catch((error) => console.error("Error:", error));
});

// Fetch all tasks
function fetchTasks() {
  fetch(`${config.ENVIRONMENT_PATH_DEV}/tasks`)
    .then((response) => response.json())
    .then((tasks) => {
      taskList.innerHTML = "";
      tasks.forEach((task) => {
        const taskItem = document.createElement("li");
        taskItem.className =
          "bg-gray-50 p-4 rounded-lg flex justify-between items-center";
        taskItem.innerHTML = `
          <div>
            <h3 class="font-bold">${task.title}</h3>
            <p class="text-sm text-gray-600">${task.description}</p>
          </div>
          <div class="space-x-2">
            <button onclick="updateTask(${task.id}, ${!task.completed})" class="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600">
              ${task.completed ? "Undo" : "Complete"}
            </button>
            <button onclick="openEditForm(${task.id}, '${task.title}', '${task.description}')" class="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600">
              Edit
            </button>
            <button onclick="deleteTask(${task.id})" class="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600">
              Delete
            </button>
          </div>
        `;
        taskList.appendChild(taskItem);
      });
    })
    .catch((error) => console.error("Error:", error));
}

// Open edit form
function openEditForm(id, title, description) {
  currentTaskId = id;
  document.getElementById("editTitle").value = title;
  document.getElementById("editDescription").value = description;
  editFormContainer.classList.remove("hidden");
}

// Close edit form
function closeEditForm() {
  editFormContainer.classList.add("hidden");
}

// Handle edit form submission
editForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const title = document.getElementById("editTitle").value;
  const description = document.getElementById("editDescription").value;

  fetch(`${config.ENVIRONMENT_PATH_DEV}/tasks/${currentTaskId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title, description }),
  })
    .then((response) => response.json())
    .then(() => {
      fetchTasks();
      closeEditForm();
      alert("Task updated successfully!");
    })
    .catch((error) => console.error("Error:", error));
});

// Update task completion status
function updateTask(id, completed) {
  fetch(`${config.ENVIRONMENT_PATH_DEV}/tasks/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ completed }),
  })
    .then(() => fetchTasks())
    .catch((error) => console.error("Error:", error));
}

// Delete a task
function deleteTask(id) {
  fetch(`${config.ENVIRONMENT_PATH_DEV}/tasks/${id}`, {
    method: "DELETE",
  })
    .then(() => fetchTasks())
    .catch((error) => console.error("Error:", error));
}