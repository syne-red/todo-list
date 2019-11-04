var UserManager = (function () {

    // create a user and add it to the local storage object
    // if the email already exist, we return the user by that email
    function createUser(email, password) {

        // check if email already exist and return that user instead if found
        let user = UserManager.getUserByEmail(email);
        if (user !== null) {
            return user;
        }

        // create a default user object from email and password
        user = {
            email,
            password,
            todos: []
        }

        let storage = LocalStorageManager.getStorage();

        // add user to storage and save
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

    // try to find a user by email
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

    // verifies that a user by specific email exist, and that the passwords match
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

    function logInUser(email, password){
        let userLogIn = verifyPassword(email, password);
        if(userLogIn === true){
            let user = getUserByEmail(email);
            return user;
        }
        else {
            return null;
        }
    }

    // adds a todo to a user
    function addTodo(user, todo) {
        user.todos.push(todo);
        LocalStorageManager.save();
    }

    return {
        createUser,
        getCurrentUser,
        getUserByEmail,
        verifyPassword,
        addTodo,
        logInUser
    }
})();