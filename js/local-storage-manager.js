var LocalStorageManager = (function () {
    // a constant key for the local storage data
    // 'ls' stands for local storage
    const LocalStorageKeyName = 'todosite-ls-data';

    // global storage object we update and is saved to browser LocalStorage as it is
    let storage = null;

    function init() { // called when the page loads, load the local storage from browser
        loadLocalStorage();
    }

    function initializeDefaultLocalStorage() {
        // if the page is loaded the first time then create the default local storage
        storage = {
            users: [],
            currentLoggedInUserEmail: null
        }

        save();
    }

    function loadLocalStorage() {
        // load the local storage once only when the page is loaded

        // try to load local storage once
        let localStorageData = localStorage.getItem(LocalStorageKeyName);

        // if the local storage is set
        if (localStorageData !== null) {
            // load the data from local storage
            storage = JSON.parse(localStorageData);
        } else {
            // save the local storage object once we created it so it exist in browser
            initializeDefaultLocalStorage();
        }

        if (storage.currentLoggedInUserEmail !== null) {
            // if the user is already logged in, call the userLoggedIn event
            EventHandler.onUserLoggedIn(UserManager.getCurrentUser());
        }
    }

    function save() {
        // save the local storage every single tiny little change
        localStorage.setItem(LocalStorageKeyName, JSON.stringify(storage));
    }

    function getStorage() {
        return storage;
    }

    function logOut() {
        // when currentLoggedInUserEmail is null, the user is not logged in
        storage.currentLoggedInUserEmail = null;
        save();

        EventHandler.onUserLoggedOut();
    }

    function logIn(user) {
        storage.currentLoggedInUserEmail = user.email;
        save();

        EventHandler.onUserLoggedIn(user);
    }

    return {
        init,
        save,
        getStorage,
        logOut,
        logIn
    }
})();