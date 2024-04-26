import {
  getTasks,
  createNewTask,
  putTask,
  deleteTask,
} from "./utils/taskFunctions.js";

import { initialData } from "./initialData.js";

// Initialize data if local storage is empty
if (!localStorage.getItem("tasks")) {
  localStorage.setItem("tasks", JSON.stringify(initialData));
  localStorage.setItem("showSideBar", "true");
}

// Initialize variables
const elements = {
  headerBoardName: document.getElementById("header-board-name"),
  columnDivs: document.querySelectorAll(".column-div"),
  filterDiv: document.getElementById("filterDiv"),
  hideSideBarBtn: document.getElementById("hide-side-bar-btn"),
  showSideBarBtn: document.getElementById("show-side-bar-btn"),
  themeSwitch: document.getElementById("switch"),
  createNewTaskBtn: document.getElementById("add-new-task-btn"),
  modalWindow: document.querySelector(".modal-window"),
  editTaskModal: document.querySelector(".edit-task-modal-window"),
};

let activeBoard = "";

// Define column titles
const colTitles = {
  todo: "Todo",
  doing: "Doing",
  done: "Done",
};

// Initialize data and display boards and tasks
function initializeData() {
  if (!localStorage.getItem("tasks")) {
    localStorage.setItem("tasks", JSON.stringify(initialData));
    localStorage.setItem("showSideBar", "true");
  }
  fetchAndDisplayBoardsAndTasks();
}
initializeData();

// Fetch and display boards and tasks
function fetchAndDisplayBoardsAndTasks() {
  const tasks = getTasks();
  const boards = [...new Set(tasks.map((task) => task.board).filter(Boolean))];
  displayBoards(boards);
  if (boards.length > 0) {
    const localStorageBoard = JSON.parse(localStorage.getItem("activeBoard"));
    activeBoard = localStorageBoard || boards[0];
    elements.headerBoardName.textContent = activeBoard;
    styleActiveBoard(activeBoard);
    refreshTasksUI();
  }
}

// Display boards
function displayBoards(boards) {
  const boardsContainer = document.querySelector("#boards-nav-links-div");
  boardsContainer.innerHTML = "";
  boards.forEach((board) => {
    const boardElement = document.createElement("button");
    boardElement.textContent = board;
    boardElement.classList.add("board-btn");
    boardElement.addEventListener("click", () => {
      elements.headerBoardName.textContent = board;
      filterAndDisplayTasksByBoard(board);
      activeBoard = board;
      localStorage.setItem("activeBoard", JSON.stringify(activeBoard));
      styleActiveBoard(activeBoard);
    });
    boardsContainer.appendChild(boardElement);
  });
}

// Filter and display tasks by board
function filterAndDisplayTasksByBoard(boardName) {
  const tasks = getTasks();
  const filteredTasks = tasks.filter((task) => task.board === boardName);
  elements.columnDivs.forEach((column) => {
    const status = column.getAttribute("data-status");
    const tasksContainer = column.querySelector(".tasks-container");
    tasksContainer.innerHTML = "";
    filteredTasks
      .filter((task) => task.status === status)
      .forEach((task) => {
        const taskElement = document.createElement("div");
        taskElement.classList.add("task-div");
        taskElement.textContent = task.title;
        taskElement.dataset.taskId = task.id;
        taskElement.addEventListener("click", () => {
          openEditTaskModal(task);
        });
        tasksContainer.appendChild(taskElement);
      });
  });
}

// Refresh tasks UI
function refreshTasksUI() {
  filterAndDisplayTasksByBoard(activeBoard);
}

// Style active board
function styleActiveBoard(boardName) {
  document.querySelectorAll(".board-btn").forEach((btn) => {
    if (btn.textContent === boardName) {
      btn.classList.add("active");
   } else {
      btn.classList.remove("active");
    }
  });
}

// Add task to UI
function addTaskToUI(task) {
  const column = document.querySelector(
    `.column-div[data-status="${task.status}"]`
  );
  const tasksContainer = column.querySelector(".tasks-container");
  const taskElement = document.createElement("div");
  taskElement.classList.add("task-div");
  taskElement.textContent = task.title;
  taskElement.dataset.taskId = task.id;
  taskElement.addEventListener("click", () => {
    openEditTaskModal(task);
  });
  tasksContainer.appendChild(taskElement);
}

// Set up event listeners
function setupEventListeners() {
  // Cancel editing task event listener
  const cancelEditBtn = document.getElementById("cancel-edit-btn");
  cancelEditBtn.addEventListener("click", () => {
    toggleModal(false, elements.editTaskModal);
  });

  // Cancel adding new task event listener
  const cancelAddTaskBtn = document.getElementById("cancel-add-task-btn");
  cancelAddTaskBtn.addEventListener("click", () => {
    toggleModal(false);
    elements.filterDiv.style.display = "none";
  });

  // Clicking outside the modal to close it
  elements.filterDiv.addEventListener("click", (event) => {
    if (event.target === elements.filterDiv) {
      toggleModal(false);
      elements.filterDiv.style.display = "none";
    }
  });

  // Show sidebar event listener
  elements.hideSideBarBtn.addEventListener("click", () => {
    toggleSidebar(false);
  });
  elements.showSideBarBtn.addEventListener("click", () => {
    toggleSidebar(true);
  });

  // Theme switch event listener
  elements.themeSwitch.addEventListener("change", toggleTheme);

  // Show Add New Task Modal event listener
  elements.createNewTaskBtn.addEventListener("click", () => {
    toggleModal(true);
    elements.filterDiv.style.display = "block";
  });

  // Add new task form submission event listener
  elements.modalWindow.addEventListener("submit", (event) => {
    addTask(event);
  });
}

// Toggle modal
function toggleModal(show, modal = elements.modalWindow) {
  modal.style.display = show ? "block" : "none";
}

// Add task
function addTask(event) {
  event.preventDefault();

  // Get task data from form
  const task = {
    id: JSON.parse(localStorage.getItem("id")),
    title: document.getElementById("title-input").value,
    description: document.getElementById("desc-input").value,
    status: document.getElementById("select-status").value,
    board: activeBoard,
  };

  // Create new task
  const newTask = createNewTask(task);

  // Add task to UI
  if (newTask) {
    addTaskToUI(newTask);
    toggleModal(false);
    elements.filterDiv.style.display = "none";
    event.target.reset();
    refreshTasksUI();
  }
}

// Toggle sidebar
function toggleSidebar(show) {
  const sidebar = document.getElementById("side-bar-div");
  sidebar.style.display = show ? "block" : "none";
  elements.showSideBarBtn.style.display = show ? "none" : "block";
}

// Toggle theme
function toggleTheme() {
  const isLightTheme = elements.themeSwitch.checked;
  if (isLightTheme) {
    localStorage.setItem("light-theme", "enabled");
  } else {
    localStorage.setItem("light-theme", "disabled");
  }
  document.body.classList.toggle("light-theme", isLightTheme);
}

// Open edit task modal
function openEditTaskModal(task) {
  // Set task details in modal inputs
  document.getElementById("edit-task-title-input").value = task.title;
  document.getElementById("edit-task-desc-input").value = task.description;
  document.getElementById("edit-select-status").value = task.status;

  // Get button elements from the task modal
  const saveTaskChangesBtn = document.getElementById("save-task-changes-btn");
  const deleteTaskBtn = document.getElementById("delete-task-btn");

  // Add event listeners to the buttons
  saveTaskChangesBtn.addEventListener("click", () => {
    saveTaskChanges(task.id);
    toggleModal(false, elements.editTaskModal);
  });

  deleteTaskBtn.addEventListener("click", () => {
    deleteTask(task.id);
    toggleModal(false, elements.editTaskModal);
  });

  // Show the edit task modal
  toggleModal(true, elements.editTaskModal);
}

// Save task changes
function saveTaskChanges(taskId) {
  // Get new task data from modal inputs
  const titleInput = document.getElementById("edit-task-title-input").value;
  const descriptionInput = document.getElementById(
    "edit-task-desc-input"
  ).value;
  const statusInput = document.getElementById("edit-select-status").value;

  // Create an object with the updated task data
  const updatedTask = {
    title: titleInput,
    description: descriptionInput,
    status: statusInput,
    board: activeBoard,
  };

  // Update the task
  putTask(taskId, updatedTask);

  // Refresh the tasks UI
  refreshTasksUI();
}

// Initialize app
document.addEventListener("DOMContentLoaded", () => {
  init();
});

function init() {
  setupEventListeners();
  const showSidebar = localStorage.getItem("showSideBar") === "true";
  toggleSidebar(showSidebar);
  const isLightTheme = localStorage.getItem("light-theme") === "enabled";
  document.body.classList.toggle("light-theme", isLightTheme);
  fetchAndDisplayBoardsAndTasks();
}