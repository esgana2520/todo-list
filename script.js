const listsConteiner = document.querySelector('[data-list]')
const form = document.querySelector('[data-form]')
const input = document.querySelector('[data-input]')
const deleteBtn = document.querySelector('[data-delete-list]')
const todoListTitle = document.querySelector('[data-todo-title]')
const todoListTask = document.querySelector('[data-todo-task]')
const todoList = document.querySelector('[data-todo-list]')
const todoListCount = document.querySelector('[data-todo-count]')
const deleteTask = document.querySelector('[data-delete-task]')
const template = document.getElementById('template')
const taskForm = document.querySelector('[data-task-form]')
const taskInput = document.querySelector('[data-task-input]')
const deleteCompleteTask = document.querySelector('[data-delete-task]')

const LOCAL_STORAGE_LIST_KEY = 'task.lists'
const LOCAL_STORAGE_SELECTED_LIST = 'task.selected'

let lists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) || []
let selectedListId = JSON.parse(localStorage.getItem(LOCAL_STORAGE_SELECTED_LIST))

deleteCompleteTask.addEventListener('click', () => {
    const selectedList = lists.find(list => list.id === selectedListId)
    selectedList.tasks = selectedList.tasks.filter(task => !task.complete)
    saveNrender()
})

listsConteiner.addEventListener('click', e => {
    if(e.target.tagName.toLowerCase() === 'li'){
        selectedListId = e.target.dataset.listId
        saveNrender()
    }
})
todoListTask.addEventListener('click', e => {
   if(e.target.tagName.toLowerCase() === 'input'){
    const selectedList = lists.find(list => list.id === selectedListId)
    const selectedTask = selectedList.tasks.find(task => task.id === e.target.id)
    selectedTask.complete = e.target.checked
    save()
    renderCount(selectedList)
   }
}) 

form.addEventListener('submit', e => {
    e.preventDefault()
    const listName = input.value
    if(listName == null || listName === '') return 
    const list = createList(listName)
    input.value = null
    lists.push(list)
    saveNrender()
})

taskForm.addEventListener('submit', e => {
    e.preventDefault()
    const taskName = taskInput.value
    if(taskName == null || taskName === '') return 
    const task = createTask(taskName)
    taskInput.value = null
    const selectedList = lists.find(list => list.id === selectedListId)
    selectedList.tasks.push(task)
    saveNrender()
}) 

deleteBtn.addEventListener('click', e => {
    lists = lists.filter(list => list.id !== selectedListId)
    selectedListId = null
    saveNrender()
})

function createList(name){
   return  {id: Date.now().toString(), name: name, tasks: []}
}

function createTask(name){
    return {id: Date.now().toString(), name: name, complete: false}
} 

function render(){
    clearElement(listsConteiner)
    renderList()
    const selectedList = lists.find(list => list.id === selectedListId)
    if(selectedListId == null){
        todoList.style.display = 'none'
    } else{
        todoList.style.display = ''
        todoListTitle.innerText = selectedList.name
        renderCount(selectedList)
        clearElement(todoListTask)
        renderTask(selectedList)
    }
}
function renderList(){
    lists.forEach(list => {
        const listElement = document.createElement('li')
        listElement.dataset.listId = list.id
        listElement.classList.add("list-name")
        listElement.innerText = list.name
        if(list.id == selectedListId){
            listElement.classList.add('active-list')
        }
        listsConteiner.appendChild(listElement)
    })
    
}
function renderCount(selectedList){
    const incompleteTaskCount = selectedList.tasks.filter(task => !task.complete).length
    const taskString = incompleteTaskCount === 1 ? 'tarefa' : 'tarefas'
    todoListCount.innerText = `${incompleteTaskCount} ${taskString} para concluir`
} 
 function renderTask(selectedList){
    selectedList.tasks.forEach(task => {
        const taskElement = document.importNode(template.content, true)
        const checkBox = taskElement.querySelector('input')
        checkBox.id = task.id
        checkBox.checked = task.complete
        const label = taskElement.querySelector('label')
        label.htmlFor = task.id
        label.append(task.name)
        todoListTask.appendChild(taskElement)
    })
} 

function clearElement(element){
    while(element.firstChild){
        element.removeChild(element.firstChild)
    }
}


function save(){
    localStorage.setItem(LOCAL_STORAGE_LIST_KEY, JSON.stringify(lists))
    localStorage.setItem(LOCAL_STORAGE_SELECTED_LIST, JSON.stringify(selectedListId))
}
function saveNrender(){
   save()
   render()
}

render()
