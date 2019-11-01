var DocumentEdit = (function () {
    function init() {
    }

    function updateTodoList(todos) {
        // update todo list
    }

    function fadeModal(){
        $("#modal-link").modal({
            fadeDuration: 100,
            fadeDelay: 0.50
        });
    }

    return {
        init,
        updateTodoList,
        fadeModal
    }
})();