const rangeModal = document.getElementById('rangeModal');
const openRangeBtn = document.querySelector('.range-btn');
const closeRangeBtn = document.querySelector('.close-btn');
const changeRangeBtn = document.getElementById('changeRangeBtn');
const rangeMinInput = document.getElementById('rangeMin');
const rangeMaxInput = document.getElementById('rangeMax');
const restartBtn = document.getElementById('restartBtn');

const output = document.getElementById('output');
const prompt = document.getElementById('prompt');
const input = document.getElementById('input');

let minNumber = 1;
let maxNumber = 100;
let number = Math.floor(Math.random() * 100);
let guesses = 0;

openRangeBtn.addEventListener('click', () => {
    rangeModal.style.display = 'block';
});

closeRangeBtn.addEventListener('click', () => {
    rangeModal.style.display = 'none';
});

changeRangeBtn.addEventListener('click', () => {
    minNumber = parseInt(rangeMinInput.value) || 1;
    maxNumber = parseInt(rangeMaxInput.value) || 100;

    if (minNumber > maxNumber) {
        [minNumber, maxNumber] = [maxNumber, minNumber];
    }

    rangeModal.style.display = 'none';
    resetGame();
});



prompt.addEventListener('submit', (event) => {
    input.focus();
    event.preventDefault(); 

    processInput(input.value);
    input.value = '';
})

const printMessage = async (message) => {
    let li = document.createElement('li');
    li.classList = 'list-item';
    output.appendChild(li);

    for (let i = 0; i < message.length; i++) {
        await sleep(50);
        li.textContent += message.charAt(i);
    }
    
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
};

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const processInput = (input) => {
    if(!input) return;

    let guess = parseInt(input);

    if(isNaN(guess)) {
        printMessage('Введите число.');
        return;
    } 

    if (!(minNumber < guess && guess < maxNumber)) {
        printMessage('Вы вышли за пределы диапазона.');
        return;
    }

    printMessage(input);

    guesses += 1;

    if(guess > number) {
        printMessage('Много.');
        parityOfNumber();
    } else if (guess < number) {
        printMessage('Мало.');
        parityOfNumber();
    } else {
        const smile = finishSmile(guesses);
        printMessage(`Верно, загаданное число ${guess}! \n Количество попыток ${guesses} ${smile}`);
        prompt.style.display = 'none';
        restartBtn.style.display = 'block';
    }
    
}

const parityOfNumber = () => {
    if(guesses % 3 === 0) {
        if(number % 2 === 0) {
            printMessage('Число четное');
        } else {
            printMessage('Число не четное');
        }
    }
}

const finishSmile = (guesses) => {
    if(guesses <= 10) {
        return '(* ^ ω ^)';
    } else {
        return '(︶︹︺)';
    }
}

const resetGame = () => {
    while (output.firstChild) {
        output.removeChild(output.firstChild);
    }
    number = Math.floor(Math.random() * (maxNumber - minNumber + 1)) + minNumber;

    guesses = 0;
    printMessage(`Я загадал число от ${minNumber} до ${maxNumber}, попробуй его отгадать.`);
}

restartBtn.addEventListener('click', () => {
    resetGame();
    restartBtn.style.display = 'none';
    prompt.style.display = 'block';
});

printMessage(`Я загадал число от ${minNumber} до ${maxNumber}, попробуй его отгадать.`);