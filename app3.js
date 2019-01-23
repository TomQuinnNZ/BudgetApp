var budgetController = (function() {

    // Code for budget manipulation

})();

var UIController = (function() {

    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputButton: '.add__btn'
    };

    return {
        getInput: function() {

            return {
                // Get the 3 input values from the HTML fields
                type: document.querySelector(DOMstrings.inputType).value,
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: document.querySelector(DOMstrings.inputValue).value
            }
        },

        // Make the DOM strings public (so they can be called by the main controller)
        getDOMstrings: function() {
            return DOMstrings;
        }
    };

})();


// GLOBAL APP CONTROLLER
var controller = (function(budgetCtrl, UICtrl) {

    var DOM = UICtrl.getDOMstrings();

    var ctrlAddItem = function() {

        // 1. Get the input data.

        var input = UICtrl.getInput();
        console.log(input);

        // 2. Add the item to the budget controller.
        // 3. Add the new item to the UI as a DOM element.
        // 4. Calculate the budget based on the new item.
        // 5. Display the new budget in the UI.
    }

    document.querySelector(DOM.inputButton).addEventListener('click', ctrlAddItem);

    // added to whole document - i.e. the keypress event happens anywhere in the document, rather than a specific button etc
    document.addEventListener('keypress', function(e) {

        // Some older browsers use 'which' instead of the more modern 'keycode'.
        if (event.keyCode === 13 || event.which === 13) {
            ctrlAddItem();
        }

    });

})(budgetController, UIController);