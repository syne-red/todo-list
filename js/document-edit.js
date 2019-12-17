const TodoListInputTextBox = '#input-list-item';
const TodoListInputAddButton = '#input-button';
const TodoList = '#list-box ul';

const SetRegisterErrorResult = '#register-result';
const SetLoginErrorResult = '#login-result';

var DocumentEdit = (function () {
    function init() {
        let user = UserManager.getCurrentUser();

        if (user !== null) {
            // if user is logged in, show the todos of that user on page load
            updateTodoList(user.todos);
        }
    }

    // adds a todo to the HTML
    function addTodo(todo) {

        // determine what FontAwesome icon to use, if the todo is completed the fa-check-square is used, otherwise fa-square is used
        let checkBoxClass = 'fa-square';
        let overlineClass = '';
        let markedStyle = '';

        if (todo.completed) {
            checkBoxClass = 'fa-check-square';
            overlineClass = 'text-overline';
            markedStyle = 'order:1; opacity:0.5;';
        }

        // prepend the todo to the top of the list
        $(TodoList).prepend(
            '<li data-id="' + todo.id + '" style="' + markedStyle + '">' +
            '<span class="check"><i class="far ' + checkBoxClass + '"></i></span>' +
            '<input class="todo-title ' + overlineClass + '" type="text" name="title" value="' + todo.title + '">' +
            '<span class="delete"><i class="fas fa-trash"></i></span>' +
            '</li>');

        // get the li that was prepended to html and store it in a variable
        let li = $('li[data-id=' + todo.id + ']');

        // if the todo is completed
        if (todo.completed) {

            // find the todo title text field and add the text-overline class and set it to readonly
            li.find('.todo-title')
                .addClass('text-overline')
                .prop('readonly', true);
        }

        // bind the html stuff like editing todo, completing and deleting
        EventHandler.bindTodoEvents(todo.id);
    }

    // clears the todo list html and goes through all todos in the array and adds them to html (above)
    function updateTodoList(todos) {
        $(TodoList).html('');

        for (let i in todos) {
            if (!todos[i].deleted) {
                addTodo(todos[i]);
            }
        }
    }

    // removes a single todo from the HTML list by id
    function removeTodo(id) {
        $('li[data-id=' + id + ']').remove(); // Fades out the todo 
    }

    // fades in the login popup screen when btnLogIn is clicked
    function fadeModal(){
        $("#btnLogIn").modal({
            fadeDuration: 100,
            fadeDelay: 0.50
        });
    }

    function setRegisterErrorResult(message) {
        $(SetRegisterErrorResult).fadeOut(50, function () {
            $(SetRegisterErrorResult + ' > div > p').html(message);
            $(this).fadeIn();
        })
    }

    function setLoginErrorResult(message) {
        $(SetLoginErrorResult).fadeOut(50, function () {
            $(SetLoginErrorResult + ' > div > p').html(message);
            $(this).fadeIn();
        })
    }

    return {
        init,
        addTodo,
        updateTodoList,
        removeTodo,
        fadeModal,
        setRegisterErrorResult,
        setLoginErrorResult
    }
})();