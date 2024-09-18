// Инициализация данных из localStorage или использование пустого массива по умолчанию
let foods = JSON.parse(localStorage.getItem('foods')) || [];
let totalCalories = JSON.parse(localStorage.getItem('totalCalories')) || 0;
let dailyGoal = JSON.parse(localStorage.getItem('dailyGoal')) || 0;

let ascendingOrder = true;
const filterInput = document.getElementById('filter');

// Функция для обновления интерфейса приложения
function updateUI() {
    // Получение элементов интерфейса по их идентификаторам
    const foodList = document.getElementById('foodList');
    const totalElementEating = document.getElementById('totalEating');
    const dailyGoalInput = document.getElementById('dailyGoalInput');
    const warningElement = document.getElementById('warning');
    const dailyGoalDisplay = document.getElementById('dailyGoal');
    const diagram = document.getElementById('diagram');

    // Обновление общего количества калорий
    totalElementEating.textContent = totalCalories;
    // Установка значения дневной цели
    dailyGoalInput.value = dailyGoal;
    dailyGoalDisplay.innerText = dailyGoal;

    // Диаграмма
    totalCaloriesDiagram = Math.round(totalCalories / (dailyGoal / 100 ));
    diagram.style.background = `conic-gradient(rgb(169, 32, 176) ${totalCaloriesDiagram}%, rgb(204, 100, 216) 0)`;

    renderFilteredTable(foods);

    // Очистка списка продуктов перед обновлением
    foodList.innerHTML = '';

    foods.forEach(food => {
        const row = createFoodRow(food);
        foodList.appendChild(row);
    });

    // Проверка на превышение дневной цели и отображение предупреждения
    if (totalCalories > dailyGoal) {
        warningElement.textContent = 'Превышен дневной лимит калорий!';
    } else {
        warningElement.textContent = '';
    }
}

function createFoodRow(food) {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${food.name}</td>
        <td>${food.calories}</td>
        <td><button class="btn" onclick="removeFood(${food.id})">Удалить</button></td>
    `;
    return row;
}

// Функция для добавления продукта
function addFood() {
    const foodName = document.getElementById('foodName').value;
    const calories = parseInt(document.getElementById('calories').value);

    if (foodName && calories) {
        const food = {
        id: new Date().getTime(),
        name: foodName,
        calories: calories,
        };

        // Добавление продукта в массив и обновление данных в localStorage
        foods.push(food);
        totalCalories += calories;

        localStorage.setItem('foods', JSON.stringify(foods));
        localStorage.setItem('totalCalories', JSON.stringify(totalCalories));

        document.getElementById('foodName').value = '';
        document.getElementById('calories').value = '';
        // Обновление интерфейса
        updateUI();
        
    }
}

// Функция для удаления продукта
function removeFood(id) {
    const foodIndex = foods.findIndex(food => food.id === id);

    if (foodIndex !== -1) {
        // Вычитание калорий продукта и удаление из массива
        totalCalories -= foods[foodIndex].calories;
        foods.splice(foodIndex, 1);

        // Обновление данных в localStorage и интерфейса
        localStorage.setItem('foods', JSON.stringify(foods));
        localStorage.setItem('totalCalories', JSON.stringify(totalCalories));

        updateUI();
    }
}

function sortTable() {
    // Инвертировать порядок сортировки
    ascendingOrder = !ascendingOrder;

    // Сортировка продуктов по калориям
    foods.sort((a, b) => {
        if (ascendingOrder) {
            return a.calories - b.calories;
        } else {
            return b.calories - a.calories;
        }
    });

    // Обновление интерфейса
    updateUI();
}

filterInput.addEventListener('input', filterProducts);

// Функция для фильтрации продуктов по названию
function filterProducts() {
    // Получение значения фильтра
    const filterValue = filterInput.value.toLowerCase();

    // Фильтрация продуктов по названию
    const filteredFoods = foods.filter(food => food.name.toLowerCase().includes(filterValue));

    renderFilteredTable(filteredFoods);
}

// Функция для отображения отфильтрованных продуктов
function renderFilteredTable(filteredFoods) {
    const foodList = document.getElementById('foodList');
    foodList.innerHTML = '';

    filteredFoods.forEach(food => {
        const row = createFoodRow(food);
        foodList.appendChild(row);
    });
}


// Функция для установки дневной цели
function setDailyGoal() {
    const dailyGoalInput = document.getElementById('dailyGoalInput');
    
    // Получение значения из поля ввода и обновление данных в localStorage
    dailyGoal = parseInt(dailyGoalInput.value);

    localStorage.setItem('dailyGoal', JSON.stringify(dailyGoal));

    // Обновление интерфейса
    updateUI();
}

// Функция для очистки всех данных
function clearAll() {
    // Очистка localStorage и обнуление данных
    localStorage.clear();
    foods = [];
    totalCalories = 0;
    dailyGoal = 0;

    // Обновление интерфейса
    updateUI();
}

// Инициализация интерфейса при загрузке страницы
updateUI();


