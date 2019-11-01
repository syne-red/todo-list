var TodoManager = (function () {

    function getTodo(user, id) {
        let storage = LocalStorageManager.getStorage();
        for (let i in user.todos) {
            let todo = user.todos[i];
            if (todo.id == id) {
                return todo;
            }
        }

        return null;
    }

    function createTodo(title) {
        let todo = {
            id: new Date().getTime(),
            title: title,
            completed: false,
            deleted: false
        };

        return todo;
    }

    return {
        getTodo,
        createTodo
    }

})();