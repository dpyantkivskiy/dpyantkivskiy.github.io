//1. Використати цикл map для відображення списків конкурентів та інвесторів.
const investorsList = [
    { name: 'Ілон Маск', budget: '$1 млрд' },
    { name: 'Білл Гейтс', budget: '$500 млн' },
    { name: 'Джефф Безос', budget: '$2 млрд' },
];

const marketList = [
    { name: 'Alpha Corp', sphere: 'IT', capital: 'Високий' },
    { name: 'Beta Industries', sphere: 'Бізнес', capital: 'Середній' },
    { name: 'Omega Group', sphere: 'Медицина', capital: 'Низький' }
];

function renderCards(dataArray, containerId, cardType) {
   
    const container = document.getElementById(containerId);
    
    const htmlCards = dataArray.map(function(item) {
    
        if (cardType === 'investor') {
            return `
                <article class="card">
                    <h3>${item.name}</h3>
                    <p>Бюджет: ${item.budget}</p>
                </article>`;
        } 
        else if (cardType === 'competitor') {
            return `
                <article class="card">
                    <h3>${item.name}</h3>
                    <p>Сфера: ${item.sphere}</p>
                    <p>Капітал: ${item.capital}</p>
                </article>`;
        }
    });

    container.innerHTML = htmlCards.join('');
}

renderCards(investorsList, 'investors-container', 'investor');
renderCards(marketList, 'market-container', 'competitor');



//2. Додати кнопку форму "Моделювання бізнес процесу", яка змінює параметри
//стартапу (наприклад, збільшує прибуток чи кількість працівників).
let currentEmployees = 0;
let currentProfit = 0;
let currentExpenses = 0;
let currentOffices = 1;

const empElement = document.getElementById('emp-count');
const profitElement = document.getElementById('profit-count');
const expenseElement = document.getElementById('expense-count');
const officeElement = document.getElementById('office-count');

const modelingForm = document.getElementById('modeling-form');
const actionSelect = document.getElementById('action-select');
const actionAmountInput = document.getElementById('action-amount'); 
const actionErrorElement = document.getElementById('action-error');


modelingForm.addEventListener('submit', function(event) {
    event.preventDefault();

    actionErrorElement.textContent = "";

    if (simulateBtn.disabled == true){
        actionErrorElement.textContent = "Помилка: Спочатку придумайте та введіть назву вашого стартапу!";
        return; 
    }
    const selectedAction = actionSelect.value;
    
    const amount = parseInt(actionAmountInput.value); 

    if (amount <= 0 || isNaN(amount)) {
        actionErrorElement.textContent = "Помилка: Введіть правильну кількість (більше нуля).";
        return;
    }

    if (selectedAction === 'hire') {
        currentEmployees = currentEmployees + amount;
        currentExpenses = currentExpenses + (amount * 500); 
        
    } else if (selectedAction === 'fire') {
  
        if (amount > currentEmployees) {
            actionErrorElement.textContent = "Помилка: У вас немає стільки працівників для звільнення!";
            return;
        }
        currentEmployees = currentEmployees - amount;
        currentExpenses = currentExpenses - (amount * 500); 
        
    } else if (selectedAction === 'marketing') {
        currentProfit = currentProfit + (amount * 1000); 
        
    } else if (selectedAction === 'office') {
        currentOffices = currentOffices + amount;
        currentExpenses = currentExpenses + (amount * 2000); 
    }

    empElement.textContent = currentEmployees;
    profitElement.textContent = currentProfit;
    expenseElement.textContent = currentExpenses;
    officeElement.textContent = currentOffices;

    generateReport();
});



const createBtn = document.getElementById('create-btn');
const companyNameInput = document.getElementById('company-name');
const simulateBtn = document.getElementById('simulate-btn');
const errorText = document.getElementById('name-error');


createBtn.addEventListener('click', function() {
    
    const name = companyNameInput.value.trim();

    if (name === "") {
        errorText.textContent = "Спочатку придумайте та введіть назву вашого стартапу!"
    } else {
        errorText.textContent = ""
        alert("Вітаємо! Компанію '" + name + "' успішно створено. Тепер ви можете керувати нею!");
        
        initialStats = { 
            employees: currentEmployees, 
            profit: currentProfit, 
            expenses: currentExpenses, 
            offices: currentOffices 
        };
        generateReport(); 

        simulateBtn.disabled = false; 
        
        companyNameInput.disabled = true;
        createBtn.disabled = true;
    }
});



//3. Реалізувати динамічний звіт у вигляді графіку та таблиць порівняння реальних та
//змодельованих параметрів бізнесу (доходи, витрати, кількість працівників, тощо).
let initialStats = {};

function generateReport() {
    document.getElementById('report-section').style.display = 'block';
    const tbody = document.getElementById('report-table-body');
    
    const reportData = [
        { name: 'Працівники', initial: initialStats.employees, current: currentEmployees },
        { name: 'Прибуток ($)', initial: initialStats.profit, current: currentProfit },
        { name: 'Витрати ($)', initial: initialStats.expenses, current: currentExpenses },
        { name: 'Офіси', initial: initialStats.offices, current: currentOffices }
    ];

    tbody.innerHTML = '';

    for (let i = 0; i < reportData.length; i++) {
        let diff = reportData[i].current - reportData[i].initial;
        
        let diffText = diff > 0 ? "+" + diff : diff;
        let color = diff > 0 ? "green" : (diff < 0 ? "red" : "black");

        let row = `<tr>
            <td style="padding: 10px; border: 1px solid #ddd;">${reportData[i].name}</td>
            <td style="padding: 10px; border: 1px solid #ddd;">${reportData[i].initial}</td>
            <td style="padding: 10px; border: 1px solid #ddd;">${reportData[i].current}</td>
            <td style="padding: 10px; border: 1px solid #ddd; color: ${color}; font-weight: bold;">${diffText}</td>
        </tr>`;

        tbody.innerHTML += row;
    }
}