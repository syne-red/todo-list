var UserManager = (function () {

    function createUser(email, password) {
        
        let user = UserManager.getUserByEmail(email);
        if (user !== null) {
            return user;
        }

        user = {
            email,
            password,
            todos: []
        }

        let storage = LocalStorageManager.getStorage();
        storage.users.push(user);
        LocalStorageManager.save();

        return user;
    }

    // get the current user from the users list based on storage.currentLoggedInUserEmail 
    function getCurrentUser() {
        let storage = LocalStorageManager.getStorage();
        if (storage.currentLoggedInUserEmail !== null) {
            // the email was not null, so there is a logged in user
            for (let i in storage.users) {
                // loop through all users and find the one with the currentLoggedInUserEmail
                let user = storage.users[i];
                if (user.email == storage.currentLoggedInUserEmail) {
                    return user;
                }
            }
        }

        // user was not found in users list
        return null;
    }
    
    function getUserByEmail(email) {

        let storage = LocalStorageManager.getStorage();

        for (let i in storage.users) {
            let user = storage.users[i];
            if (user.email === email) {
                return user;
            }
        }

        return null;
    }

    function addUser(user) {
        let storage = LocalStorageManager.getStorage();
        storage.users.push(user);
        save();
    }

    function verifyPassword(email, password) {
        let user = getUserByEmail(email);
        if (user === null) { // email not found
            return false;
        }

        // check if passwords match and if it doesnt, return false
        if (password !== user.password) {
            return false;
        }

        // email and password matches a user
        return true;
    }

    function addTodo(user, todo) {
        let storage = LocalStorageManager.getStorage();
        user.todos.push(todo);
        LocalStorageManager.save();
    }

    function completeTodo(user, todo) {
        let storage = LocalStorageManager.getStorage();
        for (let i in user.todos) {
            let todo = user.todos[i];
            if (todo.id == id) {
                todo.completed = true; // set completed to true of this todo
                LocalStorageManager.save(); // save the changes made
                EventHandler.onTodoChanged(todo, 'completed'); // send an event that this todo was changed
                break;
            }
        }
    }

    function deleteTodo(user, todo) {
        let storage = LocalStorageManager.getStorage();
        for (let i in user.todos) {
            let todo = user.todos[i];
            if (todo.id == id) {
                todo.deleted = true; // sets a boolean value of todo to true, it will be hidden but not physically deleted
                LocalStorageManager.save(); // save the changes made
                EventHandler.onTodoChanged(todo, 'deleted');
                break;
            }
        }
    }
    
    return {
        createUser,
        getCurrentUser,
        getUserByEmail,
        addUser,
        verifyPassword,
        addTodo,
        completeTodo,
        deleteTodo
    }
})();