import { Tetris } from "./tetris.js";
import { PLAYFIELD_COLUMNS, PLAYFIELD_ROWS, convertPositionToIndex } from "./utilities.js";

let requestId;
let timeoutId;
const tetris = new Tetris();
const cells = document.querySelectorAll('.grid>div');

initKeyDown();
moveDown();

function initKeyDown() {
    document.addEventListener('keydown', onkeydown);
}

function onkeydown(event) {
    switch (event.key) {
        case 'ArrowDown':
            moveDown();
            break;
        case 'ArrowUp':
            rotate();
            break;
        case 'ArrowLeft':
            moveLeft();
            break;
        case 'ArrowRight':
            moveRight();
            break;
        default:
            break;
    }
}

function moveDown() {
    tetris.moveTetrominoDown();
    draw();
    stopLoop();
    startLoop();
    if(tetris.isGameOver) {
        gameOver();
    }
}

function moveLeft() {
    tetris.moveTetrominoLeft();
    draw();
}

function moveRight() {
    tetris.moveTetrominoRight();
    draw();
}

function rotate() {
    tetris.rotateTetromino();
    draw();
}

function startLoop() {
    timeoutId = setTimeout(() => requestId = requestAnimationFrame(moveDown), 700);
}

function stopLoop() {
    cancelAnimationFrame(requestId);
    clearTimeout(timeoutId);
}

// отрисовка
function draw() {
    // перед каждой отрисовкой удаляем
    cells.forEach(cell => cell.removeAttribute('class'));
    // отрисовка поля
    drawPlayfield();
    // на каждом кадре заново рисуем поле с фигурками
    drawTetromino();
}

// отрисовка поля
function drawPlayfield() {
    for( let row = 0; row < PLAYFIELD_ROWS; row++) {
        for(let column = 0; column < PLAYFIELD_COLUMNS; column++) {
            if(!tetris.playfield[row][column]) continue;
            const cellIndex = convertPositionToIndex(row, column);
            cells[cellIndex].classList.add('painted');
        }
    }
}

// отрисовка фигурки
function drawTetromino() {
    // название фигурки
    const name = tetris.tetromino.name;
    // размер матрицы
    const tetrominoMatrixSize = tetris.tetromino.matrix.length;
    // проходимся по матрице фигурки
    for(let row = 0; row < tetrominoMatrixSize; row++) {
        for(let column = 0; column < tetrominoMatrixSize; column++) {
            // если проверяемый элемент не равен 1, идем на след итерацию
            if(!tetris.tetromino.matrix[row][column]) continue;
            // строка на которой нужн нарисовать элемент фигуры, если элемент за пределами поля значит рисовать не нужно
            if(tetris.tetromino.row + row < 0) continue;
            // индкс в ячейке в списке див элементов
            const cellIndex = convertPositionToIndex(tetris.tetromino.row + row, tetris.tetromino.column + column);
            // добавляем ячейке класс такой же как имя элемента
            cells[cellIndex].classList.add('painted');
        }
    }
}

function gameOver() {
    stopLoop();
    document.removeEventListener('keydown', onkeydown);
    gameOverAnimation();
}

function gameOverAnimation() {
    const filledCells = [...cells].filter(cell => cell.classList.length > 0);
    filledCells.forEach((cell) => {
        cell.classList.add('hide');
        setTimeout(() => {
            cell.removeAttribute('class');
            showGameOverModal();
        }, 3000);
    });
}

function showGameOverModal() {
    const modal = document.querySelector('.modal');
    const scoreSpan = document.querySelector('.score-modal');
    const restartButton = document.querySelector('.restart');

    modal.style.display = 'block';
    scoreSpan.textContent = tetris.score;
    restartButton.addEventListener('click', restartGame);
}

function restartGame() {
    location.reload();
}

