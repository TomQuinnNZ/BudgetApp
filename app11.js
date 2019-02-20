var budgetController = (function() {

    // Expense and income objects, to store items
    var Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };

    Expense.prototype.calculatePercentage = function(totalIncome) {
        if (totalIncome > 0) {
            this.percentage = Math.round((this.value / totalIncome) * 100);
        }
        else {
            this.percentage = -1;
        }
    };

    Expense.prototype.getPercentage = function() {
        return this.percentage;
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

        deleteItem: function(type, id) {

            var typeIndex, intID;

            intID = parseInt(id);

            if (type === 'income') {
                typeIndex = 'incomes';
            }
            else if (type === 'expense') {
                typeIndex = 'expenses';
            }
             
            var idList = data.allItems[typeIndex].map(function(current) {
                return current.id;
            });
            
            index = idList.indexOf(intID);

            if (index !== -1) {
                data.allItems[typeIndex].splice(index, 1);
            }
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

        calculatePercentages: function() {
            data.allItems.expenses.forEach(function(current) {
                current.calculatePercentage(data.totals.totalInc);
            });
        },

        getPercentages: function() {
            var allPercentages = data.allItems.expenses.map(function(current) {
                return current.getPercentage();
            });
            
            return allPercentages;
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
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expensesPercentageLabel: '.item__percentage'
    };

    var formatNumber =  function(num, type) {

        var numSplit, int, decimal, sign;

        num = Math.abs(num).toFixed(2);

        numSplit = num.split('.');
        int = numSplit[0];
        decimal = numSplit[1];

        if (int.length > 3) {
            int = int.substr(0, (int.length - 3)) + ',' + int.substr((int.length - 3), 3);
        }

        if (type === 'expense') {
            sign = '-';
        }
        else if (type === 'income') {
            sign = '+';
        }

        return sign + ' ' + int + '.' + decimal;
    };

    var defineType = function(num) {
        if (num >= 0) {
            return 'income';
        }
        else {
            return 'expense';
        }
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

            var html, newHtml, element, percentageOfBudget;

            // Create HTML string with placeholder text
            if (type === 'income') {
                element = DOMstrings.incomeContainer;

                html = '<div class="item clearfix" id="income-%id%"> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            else if (type === 'expense') {
                element = DOMstrings.expensesContainer;
                percentageOfBudget = 

                html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }

            // Replace the placeholder text with some actual data
            newHtml = html.replace('%id%', object.id).replace('%description%', object.description).replace('%value%', formatNumber(object.value, type));

            // Insert the HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },

        deleteListElement: function(itemID) {
            // Can't remove element directly, so must call removeChild on the parent of the desired element.
            var element = document.getElementById(itemID);
            element.parentNode.removeChild(element);
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

        displayBudget: function(budgetObject) {

            document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(budgetObject.budget, defineType(budgetObject.budget));
            document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(budgetObject.totalInc, 'income');
            document.querySelector(DOMstrings.expensesLabel).textContent = formatNumber(budgetObject.totalExp, 'expense');
            

            if (budgetObject.percentage > 0) {
                document.querySelector(DOMstrings.percentageLabel).textContent = budgetObject.percentage + "%";
            } else {
                document.querySelector(DOMstrings.percentageLabel).textContent = '---';
            }
        },

        displayPercentages: function(percentages) {

            var fields;

            fields = document.querySelectorAll(DOMstrings.expensesPercentageLabel);

            var nodeListForEach = function(nodeList, callback) {
                for (var i = 0; i < nodeList.length; i++) {
                    callback(nodeList[i], i);
                }
            };

            nodeListForEach(fields, function(current, index) {
                var currentPercentage = percentages[index];

                if (currentPercentage > 0) {
                    current.textContent = currentPercentage + '%';
                }
                else {
                    current.textContent = '---';
                }
                
            });
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

        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
    };

    var updateBudget = function() {

        // 1. Calculate the budget.
        budgetCtrl.calculateBudget();

        // 2. Return the budget.
        var budget = budgetCtrl.getBudget();

        // 3. Display the budget in the UI.
        UICtrl.displayBudget(budget);
    };

    var updatePercentages = function() {

        var percentages;

        // 1. Calculate percentages
        budgetCtrl.calculatePercentages();

        // 2. Read percentages from the budget controller.
        percentages = budgetCtrl.getPercentages();

        // 3. Update the UI with the new percentages.
        UICtrl.displayPercentages(percentages);
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
            
            // 5. Calculate and update expense percentages.
            updatePercentages();
        }
    };

    var ctrlDeleteItem = function(event) {

        var itemID, splitID, type, ID;

        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

        if (itemID) {
            splitID = itemID.split('-');
            type = splitID[0];
            ID = splitID[1];

            // 1. Delete the item from the data structure
            budgetCtrl.deleteItem(type, ID);

            // 2. Delete the item from the UI
            UICtrl.deleteListElement(itemID);

            // 3. Update and show the new budget
            updateBudget();

            // 4. Calculate and update expense percentages.
            updatePercentages();
        }
    };

    return {
        init: function() {
            console.log('Application started.');
            UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            });
            setupEventListeners();
        }
    };

})(budgetController, UIController);

controller.init();