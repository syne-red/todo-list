var EventHandler = (function () {
    function init() {

        // bind the Add todo button to an event handler function
        $(TodoListInputAddButton).click(onAddTodoClicked);

        $(TodoListInputTextBox).on('keydown', function (e) {
            if (e.keyCode == 13) {
                // enter button was pressed in the input
                onAddTodoClicked();
            } else if (e.keyCode == 27) { // if escape is pressed, clear the input
                $(TodoListInputTextBox).val('');        
            }
        })

        $('#btnLogOut').click(function () {
            LocalStorageManager.logOut();
        })

        $("#btnRegister").click(function(){
            const registerEmail = $("#register-email").val();
            const registerPassword = $("#register-password").val();

            console.log("register email")

            if(UserManager.getUserByEmail(registerEmail) !== null){
                alert("The email already exists");

                return;
            }
            let user = UserManager.createUser(registerEmail, registerPassword);
            
            LocalStorageManager.logIn(user);
        })
    }

    function onAddTodoClicked() { // when enter is pressed or the + button, this event is ran
        // get the todo list text
        const todoListText = $(TodoListInputTextBox).val();
        $(TodoListInputTextBox).val('');

        // check that the todo list text is not empty
        if (todoListText.length !== 0) {

            // create a new todo
            let todo = TodoManager.createTodo(todoListText);

            // get the current logged in user and add todo
            let user = UserManager.getCurrentUser();
            if (user === null) {
                console.log('Error: user is not logged in'); // should not happen
                return;
            }

            // add the todo to the user
            UserManager.addTodo(user, todo);

            // also add the todo to the HTML
            DocumentEdit.addTodo(todo);
        }
    }

    // event is called when a user logs in, so we need to update the todo list and stuff
    function onUserLoggedIn(user) {
        $('#todo-front-login').hide();
        $('#todo-main').show();
        $('#btnLogIn').hide();
        $('#btnLogOut').show();
        DocumentEdit.updateTodoList(user.todos);
    }

    // event is called when user clicks on log out
    function onUserLoggedOut() {
        $('#todo-main').hide();
        $('#todo-front-login').show();
        $('#btnLogIn').show();
        $('#btnLogOut').hide();
    }

    // event called whenever a todo is changed in any way
    function onTodoChanged(todo, parameter) {
        switch (parameter) {
            case 'title':
                console.log(todo.title + ' title changed to ' + todo.completed);
                break;
            case 'completed':
                console.log(todo.title + ' completed state changed to ' + todo.completed);
                break;
            case 'deleted':
                console.log(todo.title + ' deleted state changed to ' + todo.deleted);
                break;
        }

        // update the todo list
        let user = UserManager.getCurrentUser();
        DocumentEdit.updateTodoList(user.todos);
    }

    // when a todo is added to html, bind the completed button, change title event and delete button of it
    function bindTodoEvents(todo_id) {
        $('li[data-id=' + todo_id + '] > .check i').click(function () {

            let user = UserManager.getCurrentUser();

            // get the todo by id
            let todo = TodoManager.getTodo(user, todo_id);


            // flip the completed state
            todo.completed = !todo.completed;
            LocalStorageManager.save();

            if (todo.completed) {
                $('li[data-id=' + todo_id + ']').css('order', '1'); // Add order style and moves the list down
                $('li[data-id=' + todo_id + ']').css('opacity', '0.5'); // Adds opacity when marked
                $('li[data-id=' + todo_id + '] > input').addClass('text-overline'); // Adds overline style
                $('li[data-id=' + todo_id + '] > input').prop('readonly', true); // Not changeble input after checked 
                $(this).removeClass('fa-square'); // remove checked css class
                $(this).addClass('fa-check-square'); // add css class checked to the html completed button
            } else {
                $('li[data-id=' + todo_id + ']').css('order', '0'); // Back to the origin prio
                $('li[data-id=' + todo_id + ']').css('opacity', '1'); 
                $('li[data-id=' + todo_id + '] > input').removeClass('text-overline'); // Removes overline style
                $('li[data-id=' + todo_id + '] > input').prop('readonly', false); // Changeble input again after unchecked 
                $(this).removeClass('fa-check-square'); // remove checked css class
                $(this).addClass('fa-square'); // add css class checked to the html completed button
            }
        })

        // bind an event to when user presses the delete button on the todo
        $('li[data-id=' + todo_id + '] > .delete').click(function () {
            let user = UserManager.getCurrentUser();

            // get the todo by id
            let todo = TodoManager.getTodo(user, todo_id);

            // flip the completed state
            todo.deleted = true;
            LocalStorageManager.save();

            DocumentEdit.removeTodo(todo.id);
        })

        // bind an onchange event for the todo title
        $('li[data-id=' + todo_id + '] > .todo-title').on('change', function () {
            let user = UserManager.getCurrentUser();

            // get the todo by id
            let todo = TodoManager.getTodo(user, todo_id);

            // get the new title that user entered
            let newTitle = $(this).val();
            if (newTitle.length === 0) {
                $(this).val(todo.title); // restore the title since the user didnt enter anything
                return;
            } 

            todo.title = newTitle;
            LocalStorageManager.save();
        }) 
    }

    

    return {
        init,
        onUserLoggedIn,
        onUserLoggedOut,
        onTodoChanged,
        bindTodoEvents
    }
})();