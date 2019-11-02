var TodoManager = (function () {

    // get a todo from a user by id
    function getTodo(user, id) {
        for (let i in user.todos) {
            let todo = user.todos[i];
            if (todo.id == id) {
                return todo;
            }
        }

        return null;
    }

    // create a todo given a title, the todo will have a unique id and default values for completed and deleted
    function createTodo(title) {
        let todo = {
            id: new Date().getTime(), // generate a unique id from current UTC time in milliseconds (as long as todo's arent created too fast)
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