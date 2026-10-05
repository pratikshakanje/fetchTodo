const cl = console.log;

const formTodo = document.getElementById("formTodo")
const todoitem = document.getElementById("todoitem")
const addTodo = document.getElementById("addTodo")
const updateTodo = document.getElementById("updateTodo")
const listTodo = document.getElementById("listTodo")
const spinner = document.getElementById("spinner")

let BASE_URL = "https://todofetch-509e5-default-rtdb.asia-southeast1.firebasedatabase.app";

let TODO_URL = `${BASE_URL}/todo.json`;

function snackbar(msg, icon){
    Swal.fire({
        title: msg,
        icon: icon,
        timer: 3000
    })
}

const state = {
    todoArr : [],
    editid: null,
}

function showSpinner(){
    spinner.classList.remove("d-none")
}

function hideSpinner(){
   spinner.classList.add("d-none")
}

//read
function createTodoList(arr){
    let result = ``;

    arr.forEach(todo=>{
        result += ` <li class="list-group-item justify-content-between d-flex bg-light" id="${todo.id}"><strong>${todo.todoitem}</strong>
                            <div>
                                <button type="button" onclick="onEdit(this)" class="btn btn-sm btn-outline-info"><i class="fa-solid fa-pen-to-square"></i> Edit</button>
                                <button type="button" onclick="onDelete(this)" class="btn btn-sm btn-outline-danger"><i class="fa-solid fa-trash"></i> Delete</button>
                            </div>
                            </li>`
    })

    listTodo.innerHTML = result;
}

function fetchTodo(){
    showSpinner()

    fetch(TODO_URL,{
        method: "GET",
        body: null,
        headers: {
            "Content-Type" : "application/json",
            "Authorization" : "TOKEN JWT form LS"
        }
    })

    .then(res=>{
        if(!res.ok){
            throw new Error("Failed to fetch todos")
        }
        return res.json()
    })

    .then(data=>{
        for(const key in data){
            data[key].id = key

            state.todoArr.unshift(data[key])
        }

        createTodoList(state.todoArr)
    })

    .catch(err=>{
        snackbar("Failed to fetch todos!!!", "error");
    })

    .finally(()=>{
        hideSpinner()
    })
}


//create
function onTodoAdd(eve){
    eve.preventDefault()

    let todoObj = {
        todoitem : todoitem.value,
    }

    showSpinner()

    fetch(TODO_URL,{
        method: "POST",
        body: JSON.stringify(todoObj),
        headers: {
            "Content-Type" : "application/json",
            "Authorization" : "TOKEN JWT form LS"
        }
    })

    .then(res=>{
        if(!res.ok){
            throw new Error("Failed to add todo")
        }
        return res.json()
    })

    .then(data=>{
        todoObj.id = data.name

        state.todoArr.unshift(todoObj)

        formTodo.reset()
        
        let li = document.createElement("li")

        li.className = "list-group-item justify-content-between d-flex bg-light"

        li.id = todoObj.id;

        li.innerHTML = ` <strong>${todoObj.todoitem}</strong>
                            <div>
                                <button type="button" onclick="onEdit(this)" class="btn btn-sm btn-outline-info"><i class="fa-solid fa-pen-to-square"></i> Edit</button>
                                <button type="button" onclick="onDelete(this)" class="btn btn-sm btn-outline-danger"><i class="fa-solid fa-trash"></i> Delete</button>
                            </div>`

        listTodo.prepend(li)

        snackbar("Todo added successfully!!!", "success");
    })

    .catch(err=>{
        snackbar("Failed to add todo!!!", "error")
    })

    .finally(()=>{
        hideSpinner()
    })
}

//edit
function onEdit(ele){
    let EDIT_ID = ele.closest("li").id;

    state.editid = EDIT_ID;

    let EDIT_URL = `${BASE_URL}/todo/${EDIT_ID}.json`;

    showSpinner();

    fetch(EDIT_URL,{
        method: "GET",
        body: null,
        headers: {
            "Content-Type" : "application/json",
            "Authorization" : "TOKEN JWT form LS"
        }
    })

    .then(res=>{
        if(!res.ok){
            throw new Error("Failed to fetch todo for edit")
        }
        return res.json()
    })

    .then(data=>{
        todoitem.value = data.todoitem;

        addTodo.classList.add("d-none")
        updateTodo.classList.remove("d-none")
    })

    .catch(err=>{
         snackbar("Failed to fetch todo for edit!!!", "error")
    })

    .finally(()=>{
        hideSpinner()
    })
}

//update
function onUpdateTodo(){
    let UPDATE_ID = state.editid;

    let UPDATE_URL = `${BASE_URL}/todo/${UPDATE_ID}.json`

    let updateObj = {
        todoitem: todoitem.value,
        id: UPDATE_ID
    }

    showSpinner()

    fetch(UPDATE_URL,{
        method: "PATCH",
        body: JSON.stringify(updateObj),
        headers: {
            "Content-Type" : "application/json",
            "Authorization" : "TOKEN JWT form LS"
        }
    })

    .then(res=>{
        if(!res.ok){
            throw new Error("Failed to update Todo")
        }
        return res.json()
    })

    .then(data=>{
        let getInd = state.todoArr.findIndex(f=> f.id === UPDATE_ID);

        state.todoArr[getInd] = updateObj;

        let li = document.getElementById(UPDATE_ID);

        li.innerHTML = `<strong>${updateObj.todoitem}</strong>
                            <div>
                                <button type="button" onclick="onEdit(this)" class="btn btn-sm btn-outline-info"><i class="fa-solid fa-pen-to-square"></i> Edit</button>
                                <button type="button" onclick="onDelete(this)" class="btn btn-sm btn-outline-danger"><i class="fa-solid fa-trash"></i> Delete</button>
                            </div>`


        formTodo.reset()

        snackbar(`The todo with ${UPDATE_ID} is  updated successfully!!!` , "success")

        addTodo.classList.remove("d-none")
        updateTodo.classList.add("d-none")
    })

    .catch(err=>{
        snackbar("Failed to update todo!!!", "error")
    })

    .finally(()=>{
        hideSpinner()
    })
}


//delete
function onDelete(ele){
    let REMOVE_ID = ele.closest("li").id;

    let REMOVE_URL = `${BASE_URL}/todo/${REMOVE_ID}.json`;

    Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes,delete it!",
    
    })

    .then((result)=>{
        if(result.isConfirmed){
            showSpinner()

            fetch(REMOVE_URL,{
                method: "DELETE",
                body: null,
                headers: {
                    "Content-Type" : "application/json",
                    "Authorization" : "TOKEN JWT form LS"
                }
            })

            .then(res=>{
                if(!res.ok){
                    throw new Error("Failed to delete Todo")
                }
                return res.json();
            })

            .then(data=>{
                let getInd = state.todoArr.findIndex(f=>f.id === REMOVE_ID)

                state.todoArr.splice(getInd, 1)

                let li = document.getElementById(REMOVE_ID)

                ele.closest("li").remove()

                snackbar("Todo deleted successfully!!!", "success");
            })

            .catch(err=>{
                snackbar("Failed to delete todo!!!", "error")
            })

            .finally(()=>{
                hideSpinner()
            })
        }
    })
}

fetchTodo()

formTodo.addEventListener("submit", onTodoAdd)
updateTodo.addEventListener("click", onUpdateTodo)