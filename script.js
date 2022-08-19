const projects = document.querySelector(".projects");
const addProject = document.querySelector(".add-project");
const createTodo = document.querySelector(".create-todo");
const todoAdd = document.querySelector(".todo-add");
const dateEl = document.querySelector(".date");
const projectType = document.querySelector(".project-type");
const projectsAvailable = document.querySelector(".projects-avaiable");
const todosContainer = document.querySelector(".todos");
const overlay = document.querySelector(".overlay");
const selectedProjectEl = document.querySelector(".selected-project-name");
const todoCancelBtn = document.querySelector(".todo-cancel");
const newTodoBox = document.querySelector(".new-todo-box");
const selectedColorEl = document.querySelector(".selected-project-color");

class Todo {
  constructor(title, desc, date, priority, belongsTo) {
    this.title = title;
    this.desc = desc;
    this.date = date;
    this.priority = priority;
    this.belongsTo = belongsTo;
    this.id = Math.floor(Math.random() * 50) + 1;
  }
}

class Project {
  constructor(color = "black", name, count = 0) {
    this.color = color;
    this.name = name;
    this.count = count;
  }
}

class App {
  constructor() {
    this.todos = [];
    this.projects = [
      { color: "red", name: "All", count: 0 },
      { color: "blue", name: "Shopping", count: 0 },
      { color: "orangered", name: "Vacation", count: 0 },
      { color: "pink", name: "Assignment", count: 0 },
      { color: "violet", name: "Workout", count: 0 },
    ];
    this.selectedProject = this.projects[0];
    this.belongsTo = "All";


    this.renderProjects(projects);

    addProject.addEventListener("click", this.createNewProject.bind(this));

    createTodo.addEventListener("click", (e) => {
      this.newTodo(e);
    });

    projectType.addEventListener("click", (e) => {
      this.assignToProject(e);
    });

    projects.addEventListener("click", (e) => {
      this.filterTodos(e);
    });

    todosContainer.addEventListener("click", (e) => {
      this.deleteTodo(e);
    });
  }

  ///////////////////////
  // Displaying available projects
  ///////////////////////

  renderProjects(container) {
    this.projects.forEach((projectItem) => {
      const project = document.createElement("li");
      project.setAttribute("class", "project");
      project.setAttribute('data-selection', projectItem.name)
      container.appendChild(project);

      const projectColor = document.createElement("div");
      projectColor.setAttribute("class", `project-color`);
      projectColor.style.backgroundColor = `${projectItem.color}`;
      project.appendChild(projectColor);

      const projectName = document.createElement("span");
      projectName.setAttribute("class", "project-name");
      projectName.textContent = projectItem.name;
      project.appendChild(projectName);

      const projectNumber = document.createElement("span");
      projectNumber.setAttribute("class", "project-number");
      projectNumber.setAttribute("data-belongsto", projectItem);
      projectNumber.textContent = projectItem.count;
      project.appendChild(projectNumber);
    });
  }


  ///////////////////////
  // Adding new projects
  ///////////////////////

  createNewProject() {
    const newProjectPopup = document.querySelector(".new-project-popup");
    const newProjectInput = document.querySelector(".new-project-input");
    const newProjectCancel = document.querySelector(".new-project-cancel");
    const newProjectAdd = document.querySelector(".new-project-add");

    this.openPopup(newProjectPopup, overlay);              // 1. Open popup window upon
    newProjectInput.focus();

    newProjectCancel.addEventListener("click", () => {     //2. Close popup if Cancel button is clicked
      this.closePopup(newProjectPopup, overlay);
      return;
    });

    newProjectAdd.addEventListener("click", (e) => {      //3. Event listener for Add Button
      e.stopImmediatePropagation();

      if (!newProjectInput.value) return;                 //4. Value REQUIRED validation

      const projectIndex = this.projects.findIndex(       //5. Check if Project already exists
        (project) => project.name === newProjectInput.value
      );

      if (projectIndex === -1) {                          //6. If not, push it into projects array
        const project = new Project("red", newProjectInput.value);
        this.projects.push(project);
      }

      projects.textContent = "";                          //7. Clear out Projects container before displaying new projects list

      this.renderProjects(projects);                      //8. Display all projects (including the newly added one)

      this.closePopup(newProjectPopup, overlay);          //9. Close the popup window.
    });

    overlay.addEventListener("click", () => {             
      this.closePopup(newProjectPopup, overlay);
    });

    newProjectInput.value = "";                           //10. Clearing out input field
  }

  selectProject(e) {
    this.belongsTo = e.target.dataset.selection;
    return this.selectedProject = this.projects.find(project => project.name === e.target.dataset.selection);
  }

  filterTodos(e) {

    this.closePopup(newTodoBox);
    this.openPopup(createTodo);

    if (e.target.classList.contains("project")) {

      const selectedProjectTitle = document.querySelector(".selected-project-title");
  
      this.selectProject(e);

      selectedProjectTitle.textContent = this.selectedProject.name;
      
      this.updateProjectsInfo(e, this.selectedProject);
      
      todosContainer.textContent = "";

      if (this.selectedProject.name === "All") {
        this.todos.forEach((todo) => this.displayNewTodo(todo));
        return;
      }
    }     
    
      this.todos
      .filter((todo) => this.selectedProject.name === todo.belongsTo)
      .forEach((todo) => this.displayNewTodo(todo));
    }


  ////////////////////
  // Updating available projects info inside new todo creation box
  //////////////////////
  updateProjectsInfo(e, selectedProject) {
    this.closePopup(projectsAvailable);
    selectedProjectEl.textContent = this.belongsTo;
    selectedColorEl.style.backgroundColor = selectedProject.color
  }

  assignToProject(e) {

    projectsAvailable.textContent = "";
    this.renderProjects(projectsAvailable);
    this.openPopup(projectsAvailable);

    if (e.target.classList.contains("project")) {
      // this.selectProject(e);
      this.belongsTo = e.target.dataset.selection;

      this.updateProjectsInfo(e,this.selectedProject);
    }
  }
  

  ///////////////////////
  // Creating a new todo item
  ///////////////////////

  newTodo(e) {
    const newTodoTitle = document.querySelector(".new-todo-title");
    const newTodoDesc = document.querySelector(".new-todo-description");

    let title, desc, date;

    this.closePopup(createTodo);                   //1. Displaying new todo popup for entering todo details
    this.openPopup(newTodoBox);
    newTodoTitle.focus();

    this.btnSwtich(true, 0.6);                     //2. Disabling add button - user cannot click it until atleast todo TITLE is filled out

    newTodoTitle.addEventListener("input", () => { //3. Event listener for detecting value in the todo TITLE input.
      title = newTodoTitle.value;
      if (title) this.btnSwtich(false, 1);
      else this.btnSwtich(true, 0.6);
    });

    todoCancelBtn.addEventListener("click", () => { //4. Close todo filling form if Cancel button is clicked.
      this.openPopup(createTodo);
      this.closePopup(newTodoBox);
    });

    newTodoBox.addEventListener("submit", (e) => {  
      e.preventDefault();
      e.stopImmediatePropagation();

      title = newTodoTitle.value;
      desc = newTodoDesc.value;
      date = dateEl.value;

      const todo = new Todo(title, desc, date, "high", this.belongsTo);

      this.todos.push(todo);

      this.openPopup(createTodo);
      this.closePopup(newTodoBox);
      
      // if(this.selectedProject === undefined) this.displayNewTodo(todo)

      if (this.selectedProject.name === this.belongsTo) {
        this.displayNewTodo(todo)
      }
        else{
          console.log("diff")
        }
   

      // Incrementing todos count
      this.projects.find((project) => {
        return project.name === this.belongsTo;
      }).count++;
      this.projects[0].count = this.todos.length;

      projects.textContent = "";
      this.renderProjects(projects);

      // projects.textContent = "";
      // this.renderProjects(projects);
      // this.assignToProject();
      newTodoTitle.value = newTodoDesc.value = "";
      dateEl.value = "";
    });
  }

  ///////////////////////
  // Creating a new todo item upon submitting the todo form
  ///////////////////////

  displayNewTodo(todo) {
    let html = `
        <div class="todo-box">

          <div class="check"></div>

          <p class="todo-title">${todo.title}</p>

          <div class="todo-options">
            <i class="fa-solid fa-flag priority"></i>
            <i class="fa-solid fa-pen edit"></i>
            <i class="fa-solid fa-trash todo-delete" data-id="${todo.id}"></i>
          </div>

          <p class="todo-description">${todo.desc}</p>

          <p class="todo-date">${todo.date}</p>

        </div>
        `;

    todosContainer.insertAdjacentHTML("beforeend", html);
  }





  deleteTodo(e) {
    if (e.target.classList.contains("todo-delete")) {

      const todoId = +e.target.dataset.id;

      const deleteIndex = this.todos.findIndex((todo) => todo.id === todoId);

      this.todos.splice(deleteIndex, 1);

      //////////////////////////need to rework
      ////////////////////////
      this.projects.find((project) => {
        return project.name === this.belongsTo;
      }).count--;
      this.projects[0].count = this.todos.length;

      projects.textContent = "";
      this.renderProjects(projects);
      ////////////////////////////////
      ///////////////////need to rework

      e.target.closest(".todo-box").remove();
    }
  }

  closePopup(container, overlay) {
    container.classList.add("hide-element");
    if (overlay) overlay.classList.add("hide-element");
  }

  openPopup(container, overlay) {
    container.classList.remove("hide-element");
    if (overlay) overlay.classList.remove("hide-element");
  }

  btnSwtich(status, opacity) {
    todoAdd.style.opacity = opacity;
    todoAdd.disabled = status;
  }
}

const app = new App();



// filterTodos(e) {
//   this.closePopup(newTodoBox);
//   this.openPopup(createTodo);

//   const selectedProjectTitle = document.querySelector(
//     ".selected-project-title"
//   );

//   if (e.target.classList.contains("project-name")) {
//     this.selectedProject = e.target.textContent;
//     selectedProjectTitle.textContent = this.selectedProject;

//     this.updateProjectsInfo(e);

//     if (e.target.textContent === "All") {
//       todosContainer.textContent = "";
//       this.todos.forEach((todo) => this.displayNewTodo(todo));
//       return;
//     }

//     let filtertedTodos = this.todos.filter(
//       (todo) => todo.belongsTo === e.target.textContent
//     );

//     todosContainer.textContent = "";

//     filtertedTodos.forEach((todo) => {
//       this.displayNewTodo(todo);
//     });
//   }
// }

