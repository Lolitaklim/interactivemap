import {
    PLAYFIELD_COLUMNS, 
    PLAYFIELD_ROWS,
    TETRAMINO_NAMES,
    TETRAMINOES,
    getRandomElement,
    rotateMatrix
} from "./utilities.js";
 
export class Tetris {
    constructor() {
        // игровое поле
        this.playfield;
        // пустая фигура, тетрамино — геометрические фигуры, состоящие из четырёх квадратов, соединённых сторонами
        this.tetromino;
        this.isGameOver = false;
        this.score = 0;
        this.init();
    }

    init() {
        // генерация игрового поля
        this.generatePlayfield();
        // генерация фигурки
        this.generateTetromino();
    }

    // генерация игрового поля
    generatePlayfield() {
        // двумерный массив 20х10, изначально заполнен нулями, 1 в клеточке кусок фигурка, 0 нет фигурки
        this.playfield = new Array(PLAYFIELD_ROWS).fill()
            .map(() => new Array(PLAYFIELD_COLUMNS).fill(0));

        // проверяем что в игровом поле правильный массив
        // console.table(this.playfield);
    }

    // генерация фигурки
    generateTetromino() {
        // случайный элемент из массива названий фигурок
        const name = getRandomElement(TETRAMINO_NAMES);
        // сохраняем матрицу фигурки
        const matrix = TETRAMINOES[name];

        // номер колонки с которой рисуется фигура, по центру фигуры и поля
        const column = PLAYFIELD_COLUMNS / 2 - Math.floor(matrix.length / 2);

        // номер строки, начинается за пределами поля
        const row = -2;
        // const row = 3;

        // сохраняем в фигуру имя, матрицу, начальную строку и столбец
        this.tetromino = {
            name,
            matrix,
            row,
            column
        }
    }

    // перемещение фигурки
    moveTetrominoDown() {
        this.tetromino.row += 1;
        // если фигурка за пределами поля
        if(!this.isValid()) {
            this.tetromino.row -= 1;
            // когда фигурка долходит до низа
            this.placeTetromino();
        }
    }

    moveTetrominoLeft() {
        this.tetromino.column -=1;
        if(!this.isValid()) {
            this.tetromino.column += 1;
        }
    }
    
    moveTetrominoRight() {
        this.tetromino.column +=1;
        if(!this.isValid()) {
            this.tetromino.column -= 1;
        }
    }

    rotateTetromino() {
        const oldMatrix = this.tetromino.matrix;
        const rotatedMatrix = rotateMatrix(this.tetromino.matrix);
        this.tetromino.matrix = rotatedMatrix;
        if(!this.isValid()) {
            this.tetromino.matrix = oldMatrix;
        }
    }

    isValid() {
        const matrixSize = this.tetromino.matrix.length;
        for(let i = 0; i < matrixSize; i++) {
            for(let j = 0; j < matrixSize; j++) {
                if(!this.tetromino.matrix[i][j]) continue;
                if(this.isOutsideOfBoard(i, j)) return false;

                // проверка на уже лежащие на поле фигурки
                if(this.isCollides(i, j)) return false;
            }
        }
        return true;
    }

    // за пределами поля?
    isOutsideOfBoard(row, column) {
        return this.tetromino.column + column < 0 ||
        this.tetromino.column + column >= PLAYFIELD_COLUMNS ||
        this.tetromino.row + row >= this.playfield.length;
    }

    // элемент чего то касается?
    isCollides(row, column) {
        return this.playfield[this.tetromino.row + row]?.[this.tetromino.column + column];
    }

    // сохраняем фигурку в игровое поле
    placeTetromino() {
        const matrixSize = this.tetromino.matrix.length;
        // проходим по матрице фигурки
        for(let i = 0; i < matrixSize; i++) {
            for(let j = 0; j < matrixSize; j++) {
                // пропускаем клеточки с нулями
                if(!this.tetromino.matrix[i][j]) continue;
                
                if(this.isOutsideOfTopBoard(i)) {
                    this.isGameOver = true;
                    return;
                }
                // в ячейку поля соответствующую положению ячейки фигурки сохраняем название фигурки
                this.playfield[this.tetromino.row + i][this.tetromino.column + j] = this.tetromino.name;
            }
        }
        // удаляем заполненые строки
        this.processFilledRows();
        // создаем новую фигурку
        this.generateTetromino();
    }

    isOutsideOfTopBoard(row) {
        return this.tetromino.row + row < 0;
    }

    // удаляем заполненые строки
    processFilledRows() {
        // все заполненые линии 
        const filledLines = this.finedFilledRoes();

        if (filledLines.length > 0) {
            const points = this.calculateScore(filledLines.length);
            this.score += points;
            this.updateScore();
        }

        // удаляем заполненые строки
        this.removeFilledRows(filledLines);
    }

    updateScore() {
        const scoreSpan = document.querySelector('.score');
        scoreSpan.textContent = this.score;
    }

    // все заполненые линии 
    finedFilledRoes() {
        const filledRows = [];
        // проходим по строкам поля
        for(let row = 0; row < PLAYFIELD_ROWS; row++) {
            // проходим по всем элементам строки
            if(this.playfield[row].every(cell => Boolean(cell))) {
                filledRows.push(row);
            }
        }
        //  массив с номерами заполненых строк
        return filledRows;
    }

    calculateScore(clearedLines) {
        //Например, в Brick Game, популярном в СНГ в 1990-х годах, начисление очков обычно было таким: 1 линия — 100 очков, 2 линии — 300 очков, 3 линии — 700 очков, 4 линии (то есть сделать Тетрис) — 1500 очков.
        if(clearedLines === 1) return 100;
        if(clearedLines === 2) return 300;
        if(clearedLines === 3) return 700;
        if(clearedLines === 4) return 1500;
    }

    removeFilledRows(filledRows) {
        filledRows.forEach(row => {
            this.dropRowsAbove(row);
        });
    }

    dropRowsAbove(rowToDelete) {
        for(let row = rowToDelete; row > 0; row--) {
            this.playfield[row] = this.playfield[row - 1];
        }
        this.playfield[0] = new Array(PLAYFIELD_COLUMNS).fill(0);
    }
}