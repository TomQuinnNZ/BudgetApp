var budgetController = (function() {

    // Expense and income objects, to store items
    var Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value
    };

    var Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var calculateTotal = function(type) {
        var sum = 0;
        data.allItems[type].forEach(function(current) {
            sum += current.value;
        });

        if (type === 'expenses') {
            data.totals['totalExp'] = sum;
        }
        else if (type === 'incomes') {
            data.totals['totalInc'] = sum;
        }
        
    }

    // Datastore to keep track of item objects and their associated totals
    var data = {

        allItems: {
            expenses: [],
            incomes: []
        },

        totals: {
            totalExp: 0,
            totalInc: 0
        },
        budget: 0,
        percentage: -1
    };

    return {
        addItem: function(type, desc, val) {

            var newItem, id, lastElementIndex;

            // Create id for a new item based on last element of appropriate array's ID, then create a new item with it
            // and add it to the array.
            if (type === 'expense') {
                lastElementIndex = data.allItems.expenses.length - 1;
                if (data.allItems.expenses.length > 0) {
                    id = data.allItems.expenses[lastElementIndex].id + 1;
                }
                else {
                    id = 0;
                }
                newItem = new Expense(id, desc, val);
                data.allItems.expenses.push(newItem);
            }
            else if (type === 'income') {
                lastElementIndex = data.allItems.incomes.length - 1;
                if (data.allItems.incomes.length > 0) {
                    id = data.allItems.incomes[lastElementIndex].id + 1;
                }
                else {
                    id = 0;
                }
                newItem = new Income(id, desc, val);
                data.allItems.incomes.push(newItem);
            }

            return newItem;
        },

        calculateBudget: function() {
            // calculate total income and expenses
            calculateTotal('expenses');
            calculateTotal('incomes');
            // calculate the budget (income - expenses)
            data.budget = data.totals.totalInc - data.totals.totalExp;
            // calculate the percentage of income that we spent
            if (data.totals.totalInc > 0) {
                data.percentage = Math.round((data.totals.totalExp / data.totals.totalInc) * 100);
            }
            else {
                data.percentage = -1;
            }
        },

        getBudget: function() {
            return {
                budget: data.budget,
                totalInc: data.totals.totalInc,
                totalExp: data.totals.totalExp,
                percentage: data.percentage
            }
        },

        testing: function() {
            console.log(data);
        }
    };


})();

var UIController = (function() {

    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputButton: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list'
    };

    return {
        getInput: function() {

            return {
                // Get the 3 input values from the HTML fields
                type: document.querySelector(DOMstrings.inputType).value,
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
            }
        },

        addListItem: function(object, type) {

            var html, newHtml, element;

            // Create HTML string with placeholder text
            if (type === 'income') {
                element = DOMstrings.incomeContainer;

                html = '<div class="item clearfix" id="income-%id%"> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            else if (type === 'expense') {
                element = DOMstrings.expensesContainer;

                html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }

            // Replace the placeholder text with some actual data
            newHtml = html.replace('%id', object.id).replace('%description%', object.description).replace('%value%', object.value);

            // Insert the HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },

        clearFields: function() {
            var fields, fieldsArray;

            fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);

            // trick v8 into treating fields list as an array
            fieldsArray = Array.prototype.slice.call(fields);

            fieldsArray.forEach(function(current, index, array) {
                current.value = "";
            })

            document.querySelector('.add__description').focus();
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

    var setupEventListeners = function() {
        document.querySelector(DOM.inputButton).addEventListener('click', ctrlAddItem);

        // added to whole document - i.e. the keypress event happens anywhere in the document, rather than a specific button etc
        document.addEventListener('keypress', function(e) {
    
            // Some older browsers use 'which' instead of the more modern 'keycode'.
            if (event.keyCode === 13 || event.which === 13) {
                ctrlAddItem();
            }
        });
    };

    var updateBudget = function() {

        // 1. Calculate the budget.
        budgetCtrl.calculateBudget();

        // 2. Return the budget.
        var budget = budgetCtrl.getBudget();

        // 3. Display the budget in the UI.
        console.log(budget);
    };

    var ctrlAddItem = function() {

        var input, newItem;
        // 1. Get the input data.
        input = UICtrl.getInput();

        if (input.description !== "" && isNaN(input.value) === false && input.value > 0) {
            // 2. Add the item to the budget controller.
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);

            // 3. Add the new item to the UI as a DOM element.
            UICtrl.addListItem(newItem, input.type);

            // 3a. Clear the input fields upon item submission.
            UICtrl.clearFields();
            
            // 4. Calculate the budget based on the new item, then update the UI.
            updateBudget();
        }
    };

    return {
        init: function() {
            console.log('Application started.');
            setupEventListeners();
        }
    };

})(budgetController, UIController);

controller.init();