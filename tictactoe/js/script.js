const gameMode = document.querySelectorAll('input[name="gameMode"]');
const levelMode = document.querySelectorAll('input[name="level"]');
const levelBlock = document.getElementById('level');
const restartBtn = document.getElementById('restart');
const cells = document.querySelectorAll('.cell')
const arrData = document.querySelectorAll("[data-num]");

let arr = [null, null, null, null, null, null, null, null, null];
let stop = false;
let currentPlayer = 'x';

const concat = (a, b, c) => {
    const result = arr[a] + arr[b] + arr[c];
    if(result === 'xxx' || result === 'ooo')  return result;
    switch(result) {
        case 'xxnull':
            return ['x', c];
        case 'xnullx':
            return ['x', b];
        case 'nullxx':
            return ['x', a];
        case 'oonull':
            return ['o', c];
        case 'onullo':
            return ['o', b];
        case 'nulloo':
            return ['o', a];
    }
}

const checkWin = () => {
    let result;
    // столбцы
    for(let i = 0; i < 3; i++) {
        result = concat(i, i + 3, i + 6);
        if(result === 'xxx' || result === 'ooo') {
            changeAndStop(i, i + 3, i + 6);
        }
    }
    // ряды
    for(let i = 0; i <= 6; i += 3) {
        result = concat(i, i + 1, i + 2);
        if(result === 'xxx' || result === 'ooo') {
            changeAndStop(i, i + 1, i + 2);
        }
    }
    // диагонали
    result = concat(0, 4, 8);
    if(result === 'xxx' || result === 'ooo'){
        changeAndStop(0, 4, 8);
    }
    result = concat(2, 4, 6);
    if(result === 'xxx' || result === 'ooo'){
        changeAndStop(2, 4, 6);
    }
    // ничья
    if(!arr.includes(null)) { 
        stop = true;
        restartBtn.style.display = 'block';
    }
}

const changeAndStop = (a, b, c) => {
    arrData[a].style.color = "rgb(224, 206, 223)";
    arrData[b].style.color = "rgb(224, 206, 223)";
    arrData[c].style.color = "rgb(224, 206, 223)";
    stop = true;
    restartBtn.style.display = 'block';
}

const botHard = () => {
    if (iterateThroughCells('o')) return;
    if (iterateThroughCells('x')) return;
    randomMove();
}

const iterateThroughCells = (sign) => {
    let result;

    for (let i = 0; i < 3; i++) {
        result = concat(i, i + 3, i + 6);
        if (checkAndMakeMove(result, sign)) return true;
    }

    for (let i = 0; i < 6; i += 3) {
        result = concat(i, i + 1, i + 2);
        if (checkAndMakeMove(result, sign)) return true;
    }

    result = concat(0, 4, 8);
    if (checkAndMakeMove(result, sign)) return true;
    result = concat(2, 4, 6);
    if (checkAndMakeMove(result, sign)) return true;

    return false;
}

const checkAndMakeMove = (result, value) => {
    if (typeof result === 'object' && result[0] === value) {
        makeMove(result[1], 'o');
        return true;
    }
    return false;
};

const randomMove = () => {
    const tempArr = [];
    for(let i = 0; i < 9; i++) {
        if(arr[i] === null) {
            tempArr.push(i);
        }
    }
    const randIndexTempArr = Math.floor(Math.random() * tempArr.length);
    const randNull = tempArr[randIndexTempArr];
    makeMove(randNull,'o');
}

const makeMove = (index, value) => {
    arrData[index].innerHTML = value;
    arr[index] = value;
};

addEventListener("click", (event) => {
    if(gameMode[1].checked) { // против компьютера
        levelBlock.style.display = 'block';
        computerPlayer(event);
    }
    if(gameMode[0].checked) { // 2 игрока
        levelBlock.style.display = 'none';
        multiplayer(event);            
    }
    if(event.target.name === 'gameMode' || event.target.name === 'level') {
        resetGame();
    }
    if(event.target.id === 'restart') {
        restartBtn.style.display = 'none';
        resetGame();
    }
})

function computerPlayer(event) {
    if(stop === true) return;
    if(event.target.className === 'cell' && !event.target.textContent) {
        event.target.innerHTML = 'x';
        arr[event.target.dataset.num] = 'x';
    } else {
        return;
    }
    checkWin();
    if(stop === true) return;
    if(levelMode[1].checked){
        botHard();
    } else {
        randomMove();
    }
    checkWin();
}

function multiplayer(event) {
    if(stop === true) return;
    if(event.target.className === 'cell' && !event.target.textContent) {
        event.target.innerHTML = currentPlayer;
        arr[event.target.dataset.num] = currentPlayer;
    } else {
        return;
    }
    checkWin();
    currentPlayer = (currentPlayer === 'x') ? 'o' : 'x';
}

function resetGame() {
    arr = [null, null, null, null, null, null, null, null, null];
    stop = false;
    cells.forEach((value) => {
        value.innerHTML = '';
        value.style.color = "rgb(94, 15, 79)";
    });
}

