var budgetController = (function() {

    // Code for budget manipulation

})();

var UIController = (function() {

    // Code for UI functionality

})();


// GLOBAL APP CONTROLLER
var controller = (function(budgetCtrl, UICtrl) {

    var ctrlAddItem = function() {

        // 1. Get the input data.
        // 2. Add the item to the budget controller.
        // 3. Add the new item to the UI as a DOM element.
        // 4. Calculate the budget based on the new item.
        // 5. Display the new budget in the UI.

        console.log('Item will be added here.');
    }

    document.querySelector('.add__btn').addEventListener('click', ctrlAddItem);

    // added to whole document - i.e. the keypress event happens anywhere in the document, rather than a specific button etc
    document.addEventListener('keypress', function(e) {

        // Some older browsers use 'which' instead of the more modern 'keycode'.
        if (event.keyCode === 13 || event.which === 13) {
            ctrlAddItem();
        }

    });

})(budgetController, UIController);