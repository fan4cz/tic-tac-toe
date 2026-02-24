const CROSS = 'X';
const ZERO = 'O';
const EMPTY = ' ';

const container = document.getElementById('fieldWrapper');

class Field {
    field = []
    size;
    winner = null;
    cellCount = 0;

    constructor(dimension) {
        this.size = dimension;
        for (let i = 0; i < this.size; i++) {
            this.field.push([]);
            for (let j = 0; j < this.size; j++) {
                this.field[i].push(EMPTY);
            }
        }
    }

    updateField(symbol, row, col) {
        this.field[row][col] = symbol;
        renderSymbolInCell(symbol, row, col);
        this.cellCount++;

        let thisWinner = this.checkLine(symbol, row, col, 1, 0)
            || this.checkLine(symbol, row, col, 0, 1)
            || this.checkLine(symbol, row, col, 1, 1)
            || this.checkLine(symbol, row, col, -1, -1);

        if (thisWinner) {
            this.winner = symbol;
            changeColor(symbol);
        }

        if (thisWinner) {
            let winnerName = symbol == '0' ? 'нолики' : 'крестики';
            alert(`Победил ${winnerName}`);
        }

        if (this.cellCount == this.size * this.size) {
            alert('Победила дружба');
        }
    }

    checkLine(symbol, row, col, dx, dy) {
        let count = 1;

        let x = col + dx;
        let y = row + dy;

        while (x >= 0 && x < this.size
        && y >= 0 && y < this.size
        && this.field[y][x] === symbol) {
            count++;
            x += dx;
            y += dy;
        }

        x = col - dx;
        y = row - dy;

        while (x >= 0 && x < this.size
        && y >= 0 && y < this.size
        && this.field[y][x] === symbol) {
            count++;
            x -= dx;
            y -= dy;
        }

        return count == this.size;
    }
}

document.getElementById('startGameButton').addEventListener('click', startGame);
let dimension = 3;
startGame();
let field = new Field(dimension);
addResetListener();

function startGame() {
    dimension = parseInt(document.getElementById('dimensionInput').value)
    renderGrid(dimension);
}

function renderGrid(dimension) {
    container.innerHTML = '';

    for (let i = 0; i < dimension; i++) {
        const row = document.createElement('tr');
        for (let j = 0; j < dimension; j++) {
            const cell = document.createElement('td');
            cell.textContent = EMPTY;
            cell.addEventListener('click', () => cellClickHandler(i, j));
            row.appendChild(cell);
        }
        container.appendChild(row);
    }
}

let isZeroTurn = false;

function cellClickHandler(row, col) {
    // Пиши код тут
    if (field.field[row][col] !== EMPTY || field.winner !== null) {
        return;
    }

    if (isZeroTurn) {
        field.updateField(ZERO, row, col)
        isZeroTurn = false;
    } else {
        field.updateField(CROSS, row, col)
        isZeroTurn = true;
    }
}

function renderSymbolInCell(symbol, row, col, color = '#333') {
    const targetCell = findCell(row, col);

    targetCell.textContent = symbol;
    targetCell.style.color = color;
}

function findCell(row, col) {
    const targetRow = container.querySelectorAll('tr')[row];
    return targetRow.querySelectorAll('td')[col];
}

function addResetListener() {
    const resetButton = document.getElementById('reset');
    resetButton.addEventListener('click', resetClickHandler);
}

function resetClickHandler() {
    for (let row = 0; row < dimension; row++) {
        for (let col = 0; col < dimension; col++) {
            renderSymbolInCell(EMPTY, row, col)
        }
    }
    isZeroTurn = false;
    field = new Field(dimension);
}

function changeColor(winner, color = '#d51414') {
    for (let row = 0; row < dimension; row++) {
        for (let col = 0; col < dimension; col++) {
            let targetCell = findCell(row, col);
            if (targetCell.textContent === winner) {
                targetCell.style.color = color;
            }
        }
    }
}

/* Test Function */

/* Победа первого игрока */
function testWin() {
    clickOnCell(0, 2);
    clickOnCell(0, 0);
    clickOnCell(2, 0);
    clickOnCell(1, 1);
    clickOnCell(2, 2);
    clickOnCell(1, 2);
    clickOnCell(2, 1);
}

/* Ничья */
function testDraw() {
    clickOnCell(2, 0);
    clickOnCell(1, 0);
    clickOnCell(1, 1);
    clickOnCell(0, 0);
    clickOnCell(1, 2);
    clickOnCell(1, 2);
    clickOnCell(0, 2);
    clickOnCell(0, 1);
    clickOnCell(2, 1);
    clickOnCell(2, 2);
}

function clickOnCell(row, col) {
    findCell(row, col).click();
}
