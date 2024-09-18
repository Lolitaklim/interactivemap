export const PLAYFIELD_COLUMNS = 10;
export const PLAYFIELD_ROWS = 20;
export const TETRAMINO_NAMES = ['I', 'J', 'L', 'O', 'S', 'Z', 'T'];

// обьект с матрицами фигурок
export const TETRAMINOES = {
    'I': [
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
    ],
    'J': [
        [1, 0, 0],
        [1, 1, 1],
        [0, 0, 0],
    ],
    'L': [
        [0, 0, 1],
        [1, 1, 1],
        [0, 0, 0],
    ],
    'O': [
        [1, 1],
        [1, 1],
    ],
    'S': [
        [0, 1, 1],
        [1, 1, 0],
        [0, 0, 0],
    ],
    'Z': [
        [1, 1, 0],
        [0, 1, 1],
        [0, 0, 0],
    ],
    'T': [
        [0, 1, 0],
        [1, 1, 1],
        [0, 0, 0],
    ]
}

// случайный элемент из массива названий фигурок
export function getRandomElement(arr) {
    // случайное число от 0  до длинны массива - индекс случайного элемента от 0 до последнего
    const randomIndex = Math.floor(Math.random() * arr.length);
    return arr[randomIndex];
}

// пересчет индекса фигуры в матрице на индекс в ячейке див элементов
export function convertPositionToIndex(row, column) {
    return row * PLAYFIELD_COLUMNS + column;
}

// поворачиваем фигурку, аиг 1 курс 2 семестр
export function rotateMatrix(matrix) {
    const N = matrix.length;
    const rotatedMatrix = [];
    for(let i = 0; i < N; i++) {
        rotatedMatrix[i] = [];
        for(let j = 0; j < N; j++) {
            rotatedMatrix[i][j] = matrix[N - j - 1][i];
        }
    }
    return rotatedMatrix;
}