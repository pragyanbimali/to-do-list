import './style.css'
import './home.css'
import './add-task.css'
import './add-project.css'
import './listTaskNProjectOnHomepage.css'
import './ImportantNUpcomingTasks.css'

import { loadHomePage } from './home.js'
import { addTask__DisplayForm } from './add-task__DisplayForm.js'
import { addTask__ClearForm } from './add-task__ClearForm.js'
import { addTask__CreateForm } from './add-task__CreateForm.js';
import { setTaskForm } from './taskFormState.js';
import { createTask } from './createTask.js'
import { tasksArr, projectsArr, importantTasks } from './arrays.js'
import { createProject } from './createProject.js'
import { addProject_CreateForm } from './add-project__CreateForm.js'
import { addProject__DisplayForm } from './add-project__DisplayForm.js'
import { addProject__ClearForm } from './add-project_ClearForm.js'
import { setProjectForm } from './projectFormState.js'
import { displayTaskOnHome } from './displayTaskOnHome.js';
import { displayProjectsOnSidebar } from './displayProjectsOnSidebar.js';
import { editTask } from './openTaskToEdit.js'
import { saveToLocalStorage, getLocalStorage } from './save_n_RefreshLocalStorage.js'
import { editProject } from './openProjectToEdit.js'
import { listImportantTasks, editImportantTasks } from './importantTasks.js'
import { listUpcomingTasks, editUpcomingTasks } from './upcomingTasks.js'

// here we get the returned homeAddTaskBtn element from the home.js module. 
// The function to load the page immideately runs when we call the function and also returns that button as a result.
const homeAddTaskBtn  = loadHomePage();

displayTaskOnHome();
displayProjectsOnSidebar();
editTask();
editProject();
editImportantTasks();
editUpcomingTasks();

const projectAddButton = document.querySelector(".projects-container svg")

const newForm__Task = addTask__CreateForm();
setTaskForm(newForm__Task);

homeAddTaskBtn.addEventListener("click", () => {
  addTask__DisplayForm();
  projectsArr.forEach(element => {
        newForm__Task.addOptionsToSelect(element.name, newForm__Task.taskProjectsSelect)
  });
});


const taskForm = newForm__Task.formDialog.querySelector("form");

newForm__Task.formDialog.addEventListener("cancel", () => {       // If User opens the form but closes instead of submitting by pressing ESC
  newForm__Task.taskProjectsSelect.innerHTML = ''; // Clear the Select options
  addTask__ClearForm();
  newForm__Task.taskSubmit.value = 'Submit';
});
console.log(taskForm)
taskForm.addEventListener("submit", (e) => {
  //e.preventDefault();
  const task = createTask(newForm__Task.taskTitleInput.value, newForm__Task.taskDescArea.value, newForm__Task.taskDueInput.value, newForm__Task.taskProjectsSelect.value, newForm__Task.taskImportantInput.checked);
  
  // Adding this task to the task array to display in the all tasks page
  tasksArr.push(task);
  saveToLocalStorage();
  getLocalStorage();

  // adding the task to the project
  projectsArr.forEach(projectElm => {
    if(projectElm.name === task.project) {
      const indexOfProject = projectsArr.indexOf(projectElm)
      projectsArr[indexOfProject].tasks.push(task);
    }
  })
   
  // Adding the task to the important array to display in the important page
  if(task.boo_important) {
    importantTasks.push(task);
  }

  // console.log("Created task:", task);
  // console.log(tasksArr);
  // console.log(projectsArr);
  
  // console.log(importantTasks);
  
  addTask__ClearForm();
  newForm__Task.formDialog.close();
  newForm__Task.taskSubmit.value = 'Submit';

  displayTaskOnHome();

})

const newForm__Project = addProject_CreateForm();
setProjectForm(newForm__Project);

// Add an event listener on the plus icon next to the Projects to then add Projects when clicked on
projectAddButton.addEventListener("click", () => {
  addProject__DisplayForm();
})


const projectForm = newForm__Project.projectDialog.querySelector("form");

 //If user Cancels the form, clear the form
newForm__Project.projectDialog.addEventListener("cancel", () => {
  addProject__ClearForm()
});

projectForm.addEventListener("submit", (e) => {
  //e.preventDefault();
  const project = createProject(newForm__Project.projectNameInput.value, []);

  // Adding this project to the project array
  projectsArr.push(project);
  saveToLocalStorage();
  getLocalStorage();

  addProject__ClearForm();
  newForm__Project.projectDialog.close();

  displayProjectsOnSidebar();

})

// Clicking My Day button reloads the page taking you to the homepage
const myDayButton = document.querySelector(".my-day-container")
myDayButton.addEventListener("click", () => {
  location.reload();
})

// Clicking Important tasks takes you to page with important tasks 
const importantButton = document.querySelector(".important-container");
importantButton.addEventListener("click", () => listImportantTasks());

// Clicking Upcoming tasks takes you to page with important tasks 
const upcomingButton = document.querySelector(".upcoming-container");
upcomingButton.addEventListener("click", () => listUpcomingTasks());

