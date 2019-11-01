const TodoListInputTextBox = '#input-list-item';
const TodoListInputAddButton = '#input-button';
const TodoList = '#list-box ul';

var DocumentEdit = (function () {
    function init() {
        let user = UserManager.getCurrentUser();

        if (user !== null) {
            updateTodoList(user.todos);
        }
    }

    function addTodo(todo) {

        let checkBoxClass = 'fa-square';
        if (todo.completed) {
            checkBoxClass = 'fa-check-square';
        }

        $(TodoList).prepend(
            '<li data-id="' + todo.id + '">' +
            '<span class="check"><i class="far ' + checkBoxClass + '"></i></span>' +
            '<input class="todo-title" type="text" name="title" value="' + todo.title + '">' +
            '<span class="delete"><i class="fas fa-trash"></i></span>' +
            //'<span class="edit"><i class="fas fa-edit"></i></span>' +
            '</li>');

        // bind the html stuff like editing todo, completing and deleting
        EventHandler.bindTodoEvents(todo.id);
    }

    function updateTodoList(todos) {
        $(TodoList).html('');

        for (let i in todos) {
            if (!todos[i].deleted) {
                addTodo(todos[i]);
            }
        }
    }

    function removeTodo(id) {
        $('li[data-id=' + id + ']').remove();
    }

    function fadeModal(){
        $("#btnLogIn").modal({
            fadeDuration: 100,
            fadeDelay: 0.50
        });
    }
    return {
        init,
        addTodo,
        updateTodoList,
        removeTodo,
        fadeModal
    }
})();