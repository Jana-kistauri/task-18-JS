function ToDoCreator() {
  getToDos();
  addNewTodo();


  function getToDos() {
    return fetch("https://ucha.ge/todo/server.php").then(function(r) {
      return r.json();
    }).then(function(r) {
      console.log(r);
      renderTodos(r);
    });
  }

  function clearListsContainer() {
    let boxOfLists = document.querySelector("#list");
    boxOfLists.innerHTML = "";
  }

  function addNewTodo() {
    document.querySelector('#btn').addEventListener('click', function(e) {
      let todoText = document.getElementById('add').value;
      sendTodo(todoText).then(function(r) {
        console.log(r);

        clearListsContainer();
        renderTodos(r);
      });

      document.getElementById('add').value = '';
    });
  }
  
  function sendTodo(todotext) {
      return fetch("https://ucha.ge/todo/server.php", {
        method: 'POST',
        headers: {  'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'action=add&text=' + encodeURIComponent(todotext)
      }).then(function(r) {
        return r.json();
      })
  }

  function renderTodos(r) {
      
    for(let i = 0; i < r.length; i++) {
      let newTodo = r[i];
      let id = newTodo.id;
      let todoText = newTodo.text;
      
      let div = document.createElement('div');
      
      div.classList.add('todo-div');
      div.innerHTML = 
        '<input type="checkbox" id="check">' +
        '<input type="text" disabled id="editInput">' +
        '<i id="edit" class="fas fa-pencil-alt blue"></i>'+
        '<i id="trash" class="fas fa-trash red"></i>';


      document.querySelector('#list').appendChild(div);
      let newVal = document.querySelectorAll("#editInput");
      newVal[i].value =  todoText;


      let checkButtons = document.querySelectorAll("#check");
      checkButtons[i].checked = r[i].done;
    };

    removeTodo(r);
    edit(r)
    status(r);
  };


  function edit(r) {
    let editBtns = document.querySelectorAll("#edit");

    for(let i = 0; i < r.length; i++) {
      editBtns[i].addEventListener("click", function() {
        let id = r[i].id;
        let todoText = r[i].text;
        let editedText = this.closest("div").querySelector("#editInput");
        
        editedText.disabled = false;  
        
        this.classList.remove('fa-pencil-alt');
        this.classList.add('fa-check');


        if(this.classList.contains("fa-check")) {
          this.addEventListener("click", function() {

              todoText = editedText.value;
              sendEditReq(id, todoText);
            });
        };
      });
    };
  }

  function sendEditReq(todoId, editedTextVal){

    return fetch("https://ucha.ge/todo/server.php", {
      method: 'POST',
      headers: {  'Content-Type': 'application/x-www-form-urlencoded' },
      body: 'action=update&id=' + encodeURIComponent(todoId) +'&text='+encodeURIComponent(editedTextVal) 
    }).then(function(r) {
      return r.json();
    }).then(function(r) {
      clearListsContainer();
      renderTodos(r);
      console.log(r);
    }); 
  };


  function removeTodo(r) {
    let todoDelBtns = document.querySelectorAll("#trash");

    for(let i = 0; i < r.length; i++) {
      todoDelBtns[i].addEventListener("click", function() {
        let todoId = r[i].id;
        sendRemoveReq(todoId);
      })
    }
  }

  function sendRemoveReq(todoId){
    return fetch("https://ucha.ge/todo/server.php", {
      method: 'POST',
      headers: {  'Content-Type': 'application/x-www-form-urlencoded' },
      body: 'action=remove&id=' + encodeURIComponent(todoId)
    }).then(function(r) {
      return r.json();
    }).then(function(r) {
      console.log(r);
      
      clearListsContainer();
      renderTodos(r);
    })
  } 

  function status(r) {
    let doneButtons = document.querySelectorAll("#check");

    for(let i = 0; i < r.length; i++) {
      doneButtons[i].addEventListener("change", function() {
        let todoId = r[i].id;

        if(this.checked) {
          sendStatusReq(todoId, true);  
          doneButtons[i].checked = true;
        }else{
          sendStatusReq(todoId, false);
          doneButtons[i].checked = false; 

        }
      })
    }
  }

  function sendStatusReq(todoId, status){
    return fetch("https://ucha.ge/todo/server.php", {
      method: 'POST',
      headers: {  'Content-Type': 'application/x-www-form-urlencoded' },
      body: 'action=update&id=' + encodeURIComponent(todoId) + '&done=' + encodeURIComponent(status)
    }).then(function(r) {
      return r.json();
    }).then(function(r) {
      console.log(r);
      clearListsContainer();
      renderTodos(r);
    })
  } 



}
  
ToDoCreator();