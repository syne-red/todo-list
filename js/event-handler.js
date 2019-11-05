const TodoMain = '#todo-main';
const TodoAbout = '#todo-about';
const TodoFrontRegister = '#todo-front-register';

const KeyCodes = { // a map of keyboard codes
    Enter: 13,
    Escape: 27
}

var EventHandler = (function () {
    function init() {

        // bind the Add todo button to an event handler function
        $(TodoListInputAddButton).click(onAddTodoClicked);

        $(TodoListInputTextBox).on('keydown', function (e) {
            if (e.keyCode == KeyCodes.Enter) {
                // enter button was pressed in the input
                onAddTodoClicked();
            } else if (e.keyCode == KeyCodes.Escape) {
                // if escape is pressed, clear the input
                $(TodoListInputTextBox).val('');      
            }
        })
        
        $("#modal-login-button").click(function(){
            let loginUsername = $("#input-username").val();
            let loginPassword = $("#input-password").val();
            let user = UserManager.logInUser(loginUsername,loginPassword);
            if(user != null){
                LocalStorageManager.logIn(user);
                //$('#modal-popup-login').modal('hide');
                $('#close-login-modal').click();
            }
            else {
                DocumentEdit.setLoginErrorResult('Invald email or password');
            }
        });


        $("#btnLogIn").click(function(){
            fadeLoginModal();
        });

        $('#btnHome').click(function () {
            $(TodoAbout).fadeOut(50, function () {
                if (UserManager.getCurrentUser() === null) {
                    $(TodoFrontRegister).fadeIn(200);
                } else {
                    $(TodoMain).fadeIn(200);
                }
            });
        })

        $('#btnAbout').click(function () {
            let elementToFadeOut = TodoMain;
            if (UserManager.getCurrentUser() === null) {
                elementToFadeOut = TodoFrontRegister;
            }

            $(elementToFadeOut).fadeOut(50, function () {
                $(TodoAbout).fadeIn(200);
            });
        })

        $('#btnLogOut').click(function () {
            // logs out user and shows the main frontpage with registration
            LocalStorageManager.logOut();
        })

        $("#btnRegister").click(function() {

            const EmailRegex = /^(\w+-)*\w+@(\w+-)*\w+\.\w+$/g;
            const PasswordRegex = /^[a-z0-9#\.,!@?=$\-]{4,16}$/gi;

            const registerEmail = $("#register-email").val();
            const registerPassword = $("#register-password").val();

            // validate email and password inputs
            if (registerEmail.length === 0) {
                DocumentEdit.setRegisterErrorResult('An email must be entered.');
                return;
            }

            // match the email to the email regex
            if (!registerEmail.match(EmailRegex)) {
                DocumentEdit.setRegisterErrorResult('The email does not appear to be valid.');
                return;
            }

            if (registerPassword.length === 0) {
                DocumentEdit.setRegisterErrorResult('A password must be entered.');
                return;
            }

            // match the password to the password regex
            if (!registerPassword.match(PasswordRegex)) {
                DocumentEdit.setRegisterErrorResult('The password is not the right length or contains invalid characters.');
                return;
            }

            // check if email already exists
            if (UserManager.getUserByEmail(registerEmail) !== null) {
                DocumentEdit.setRegisterErrorResult('The email already exists: ' + registerEmail);
                return;
            }

            // create user (adds to local storage)
            let user = UserManager.createUser(registerEmail, registerPassword);

            // log in the user automatically after registration
            LocalStorageManager.logIn(user);
        })

        // Login handler goes here, e.g $('#btnLogin').click ...
    }

    function onAddTodoClicked() { // when enter is pressed or the + button, this event is ran
        // get the todo list text
        const todoListText = $(TodoListInputTextBox).val();
        
        // check that the todo list text is not empty
        if (todoListText.length !== 0) {
            
            // clear the user input box
            $(TodoListInputTextBox).val('');
            
            // create a new todo
            let todo = TodoManager.createTodo(todoListText);

            // get the current logged in user and add todo
            let user = UserManager.getCurrentUser();

            // add the todo to the user
            UserManager.addTodo(user, todo);

            // also add the todo to the HTML
            DocumentEdit.addTodo(todo);
        }
    }

    // event is called when a user logs in, so we need to update the todo list and stuff
    function onUserLoggedIn(user) {
        $(TodoFrontRegister).hide();
        $(TodoAbout).hide();
        $(TodoMain).show();
        $('#btnLogIn').hide();
        $('#btnLogOut').show();
        DocumentEdit.updateTodoList(user.todos);
    }

    // event is called when user clicks on log out
    function onUserLoggedOut() {
        $(TodoMain).hide();
        $(TodoAbout).hide();
        $(TodoFrontRegister).show();
        $('#btnLogIn').show();
        $('#btnLogOut').hide();
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

    function fadeLoginModal(){
        //console.log("test");
        $("#modal-popup-login").modal({
            fadeDuration: 800,
            fadeDelay: 0.50
        });
    }

    return {
        init,
        onUserLoggedIn,
        onUserLoggedOut,
        bindTodoEvents,
        fadeLoginModal
    }
})();