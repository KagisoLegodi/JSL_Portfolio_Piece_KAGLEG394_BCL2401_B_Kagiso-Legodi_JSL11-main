// TASK: import helper functions from utils
// TASK: import initialData
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
  } else {
    console.log("Data already exists in localStorage");
  }
}
initializeData();

// TASK: Get elements from the DOM
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

// Filters tasks corresponding to the board name and displays them on the DOM.
// TASK: Fix Bugs
function filterAndDisplayTasksByBoard(boardName) {
  const tasks = getTasks();
  const filteredTasks = tasks.filter((task) => task.board === boardName);

  // Ensure the column titles are set outside of this function or correctly initialized before this function runs

  elements.columnDivs.forEach((column) => {
    const status = column.getAttribute("data-status");
    const tasksContainer = column.querySelector(".tasks-container");
    tasksContainer.innerHTML = "";
    filteredTasks
      .filter((task) => task.status === status)
      .forEach((task) => {
        // add === for comparison
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

function refreshTasksUI() {
  filterAndDisplayTasksByBoard(activeBoard);
}

// Style the active board by adding an active class
// TASK: Fix Bugs
function styleActiveBoard(boardName) {
  document.querySelectorAll(".board-btn").forEach((btn) => {
    if (btn.textContent === boardName) {
      btn.classList.add("active");
    } else {
      // use classList
      btn.classList.remove("active");
    }
  });
}

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

// Toggles tasks modal
// Task: Fix bugs
function toggleModal(show, modal = elements.modalWindow) {
  modal.style.display = show ? "block" : "none";
}

/*************************************************************************************************************************************************
 * COMPLETE FUNCTION CODE
 * **********************************************************************************************************************************************/

function addTask(event) {
  event.preventDefault();

  //Assign user input to the task object
  const task = {
    id: JSON.parse(localStorage.getItem("id")),
    title: document.getElementById("title-input").value,
    description: document.getElementById("desc-input").value,
    status: document.getElementById("select-status").value,
    board: activeBoard,
  };
  const newTask = createNewTask(task);
  if (newTask) {
    addTaskToUI(newTask);
    toggleModal(false);
    elements.filterDiv.style.display = "none";
    event.target.reset();
    refreshTasksUI();
  }
}

function toggleSidebar(show) {
  const sidebar = document.getElementById("side-bar-div");
  sidebar.style.display = show ? "block" : "none";
  elements.showSideBarBtn.style.display = show ? "none" : "block";
}

// Toggle theme
function toggleTheme() {
  const isLightTheme = elements.themeSwitch.checked;
  if (isLightTheme) {
    localStorage.setItem("light-theme", "enabled"); // set to light mode
  } else {
    localStorage.setItem("light-theme", "disabled"); // set back to default
  }

  document.body.classList.toggle("light-theme", isLightTheme); //Toggle the 'light-theme' class
}

function openEditTaskModal(task) {
  // Set task details in modal inputs
  document.getElementById("edit-task-title-input").value = task.title;
  document.getElementById("edit-task-desc-input").value = task.description;
  document.getElementById("edit-select-status").value = task.status;

  // Get button elements from the task modal
  // Add event listeners to the buttons
  const saveTaskChangesBtn = document.getElementById("save-task-changes-btn");
  const deleteTaskBtn = document.getElementById("delete-task-btn");

  // Call saveTaskChanges upon click of Save Changes button
  saveTaskChangesBtn.addEventListener("click", () => {
    saveTaskChanges(task.id);
    toggleModal(false, elements.modalWindow);
  });

  // Delete task using a helper function and close the task modal
  deleteTaskBtn.addEventListener("click", () => {
    deleteTask(task.id);
    toggleModal(false, elements.modalWindow);
  });

  toggleModal(true, elements.editTaskModal); // Show the edit task modal
}

function saveTaskChanges(taskId) {
  // Get new user inputs
  const titleInput = document.getElementById("edit-task-title-input").value;
  const descriptionInput = document.getElementById(
    "edit-task-desc-input"
  ).value;
  const statusInput = document.getElementById("edit-select-status").value;

  // Create an object with the updated task details
  const updatedTask = {
    task: titleInput,
    description: descriptionInput,
    status: statusInput,
    board: activeBoard,
  };

  // Update task using a hlper functoin
  putTask(taskId, updatedTask);

  // Close the modal and refresh the UI to reflect the changes
  toggleModal(false, elements.editTaskModal);

  refreshTasksUI();
}

/*************************************************************************************************************************************************/

document.addEventListener("DOMContentLoaded", function () {
  init(); // init is called after the DOM is fully loaded
});

function init() {
  setupEventListeners();
  const showSidebar = localStorage.getItem("showSideBar") === "true";
  toggleSidebar(showSidebar);
  const isLightTheme = localStorage.getItem("light-theme") === "enabled";
  document.body.classList.toggle("light-theme", isLightTheme);
  fetchAndDisplayBoardsAndTasks(); // Initial display of boards and tasks
}
