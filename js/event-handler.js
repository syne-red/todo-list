var EventHandler = (function () {
    function init() {
        $(TodoListInputAddButton).click(function () {
            const todoListText = $(TodoListInputTextBox).val();
            
            $(TodoList).append(
                '<li>' +
                '<span class="check"><i class="far fa-square"></i></span>' +
                '<input class="todo-title" type="text" name="title" value="' + todoListText + '">' +
                '<span class="delete"><i class="fas fa-trash"></i></span>' +
                '<span class="edit"><i class="fas fa-edit"></i></span>' +
                '</li>');
        })
    }

    function onUserLoggedIn(user) {
        DocumentEdit.updateTodoList(user.todos);
    }
    return {
        init
    }
})();