//Define the UI variables
const form = document.querySelector('#task-form');
const taskList = document.querySelector('.collection');
const clearBtn = document.querySelector('.clear-tasks');
const filter = document.querySelector('#filter');
const taskInput = document.querySelector('#task');

//Load all events listeners
loadEventListeners();

//Load all event listeners
function loadEventListeners() {
  //DOM Load event
  document.addEventListener('DOMContentLoaded', getTasks)
  //Add task event
  form.addEventListener('submit', addTask);
  //Remove task event
  taskList.addEventListener('click', removeTask);
  //Clear tasks event
  clearBtn.addEventListener('click', clearTasks);
  //Filter tasks event
  filter.addEventListener('keyup', filterTasks);
}

//Gets tasks from local storage function
function getTasks() {
  let tasks;
  if(localStorage.getItem('tasks') === null){
    tasks = [];
  }
  else{
    tasks = JSON.parse(localStorage.getItem('tasks'));
  }
  tasks.forEach(function(task){
    //create a li element
    const li = document.createElement('li');
    li.className = 'collection-item';
    //Create text node and append to the li
    li.appendChild(document.createTextNode(task));
    //Create new link element
    const link = document.createElement('a');
    //Add class
    link.className = 'delete-item secondary-content';
    //Add icon html
    link.innerHTML = '<i class="fa fa-remove"></i>'; //X-mark icon
    //Append the link to the li
    li.appendChild(link);

    //Append the li to the ul
    taskList.appendChild(li);
  });
}

//Add Task Function
function addTask(e) {
  if(taskInput.value === ''){
    alert('Add a task');
  }
  //create a li element
  const li = document.createElement('li');
  li.className = 'collection-item';
  //Create text node and append to the li
  li.appendChild(document.createTextNode(taskInput.value));
  //Create new link element
  const link = document.createElement('a');
  //Add class
  link.className = 'delete-item secondary-content';
  //Add icon html
  link.innerHTML = '<i class="fa fa-remove"></i>'; //X-mark icon
  //Append the link to the li
  li.appendChild(link);

  //Append the li to the ul
  taskList.appendChild(li);

  //Store in Local Storage
  storeTaskInLocalStorage(taskInput.value);


  //Clear input
  taskInput.value = '';

  e.preventDefault();
}

//Store Task function
function storeTaskInLocalStorage(task){
  let tasks;
  if(localStorage.getItem('tasks') === null){
    tasks = [];
  }
  else{
    tasks = JSON.parse(localStorage.getItem('tasks'));
  }
  tasks.push(task);

  localStorage.setItem('tasks', JSON.stringify(tasks));
}

//Remove Task function
function removeTask(e) {
  if(e.target.parentElement.classList.contains('delete-item')){
    if(confirm("Are you sure?")){ 
      e.target.parentElement.parentElement.remove();

      //Remove from the local storage
      removeTaskFromLocalStorage(e.target.parentElement.parentElement);
    }
  }
}


//Remove from local storage function
function removeTaskFromLocalStorage(taskItem){
  console.log(taskItem);
  let tasks;
  if(localStorage.getItem('tasks') === null){
    tasks = [];
  }
  else{
    tasks = JSON.parse(localStorage.getItem('tasks'));
  }
  tasks.push(task);

  tasks.forEach(function(tasks, index){
    if(taskItem.textContent === task){
      tasks.splice(index, 1);
    }
  });
  localStorage.setItem('tasks', JSON.stringify(tasks));
}


//Clears Tasks function
function clearTasks(e) {
  if(confirm("Are you sure you want to remove all?")){
    //The way i thought of
    //taskList.remove();
    //One way from course
    //taskList.innerHTML = '';
    //Another way ; faster
    while(taskList.firstChild) {
      taskList.removeChild(taskList.firstChild);
    }
  }
  clearTasksFromLocalStorage();
}

//Clear from Local Storage
function clearTasksFromLocalStorage(){
  localStorage.clear();
}


//Filter Tasks function
function filterTasks(e) {
  const text = e.target.value.toLowerCase(); // get whatever is typed in

  document.querySelectorAll('.collection-item').forEach(
    // querySelectorAll returns a node list and allows a for each ; if querySelector then needs to convert to an array and for each loop
    function(task){
      const item = task.firstChild.textContent;
      if(item.toLowerCase().indexOf(text) != -1){
        task.style.display = 'block';
      }
      else{
        task.style.display = 'none';
      }
    });
}
