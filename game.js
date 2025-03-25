let timer;
let updateTime = 100;

const setupGameBoard = function() {
    const gameBoard = document.querySelector('#gameBoard');
    if (!gameBoard) {
        console.error("Error: No division element for game board.")
    }
    // TODO: remove hardcoded gameboard width
    const cellSize = Math.floor(640 / numCols);
    let cellGrid = document.createElement('table');
    for (let i = 0; i < numRows; i++) {
        let cellRow = document.createElement('tr');
        for (let j = 0; j < numCols; j++) {
            let cell = document.createElement('td');
            cell.setAttribute('id', 'cell_' + i + '_' + j);
            cell.setAttribute('class', 'dead');
            cell.onmouseover = cellMouseOverHandler;
            cell.onmouseleave = cellMouseLeaveHandler;
            cell.onclick = cellClickHandler;
            cell.style.setProperty('width', cellSize + 'px');
            cell.style.setProperty('height', cellSize + 'px');
            cellRow.appendChild(cell);
        }
        cellGrid.appendChild(cellRow);
    }
    gameBoard.appendChild(cellGrid);
    return;
}

const removeGameBoard = function() {
    const gameBoard = document.querySelector('#gameBoard');
    const cells = document.querySelectorAll('table');
    cells.forEach((item) => {
        gameBoard.removeChild(item);
    })
    return;
}

const cellClickHandler = function() {
    // Deactivate while simulation is running
    if (isRunning) return;
    this.classList.remove('active-cell');
    const [cellstring, row, col] = this.id.split('_');
    const cellState = this.getAttribute('class');
    // Invert cell based on current state
    if (cellState.includes('live')) {
        this.classList.remove('live');
        this.classList.add('dead');
        grid[row][col] = 0;
    } else {
        this.classList.remove('dead');
        this.classList.add('live');
        grid[row][col] = 1;
    }
    return;
}

const cellMouseOverHandler = function() {
    // Deactivate while simulation is running
    if (isRunning) return;
    this.classList.add('active-cell');
}

const cellMouseLeaveHandler = function() {
    // Deactivate while simulation is running
    if (isRunning) return;
    this.classList.remove('active-cell');
}

const createGrid = function() {
    const grid = [];
    for (let i = 0; i < numRows; i++) {
        grid[i] = [];
        for (let j = 0; j < numCols; j++) {
            grid[i][j] = 0;
        }
    }
    return grid;
}

const correctGridLonghorn = function() {
    const grid = [];
    for (let i = 0; i < numRows; i++) {
        grid[i] = [];
        for (let j = 0; j < numCols; j++) {
            grid[i][j] = 0;
        }
    }
    const iMid = Math.floor(numRows / 2);
    const jMid = Math.floor(numCols / 2);
    grid[iMid - 2][jMid - 3] = 1;
    grid[iMid - 2][jMid - 2] = 1;
    grid[iMid - 2][jMid + 2] = 1;
    grid[iMid - 2][jMid + 3] = 1;
    grid[iMid - 1][jMid - 4] = 1;
    grid[iMid - 1][jMid - 1] = 1;
    grid[iMid - 1][jMid + 1] = 1;
    grid[iMid - 1][jMid + 4] = 1;
    grid[iMid][jMid - 4] = 1;
    grid[iMid][jMid - 3] = 1;
    grid[iMid][jMid - 1] = 1;
    grid[iMid][jMid + 1] = 1;
    grid[iMid][jMid + 3] = 1;
    grid[iMid][jMid + 4] = 1;
    grid[iMid + 1][jMid - 1] = 1;
    grid[iMid + 1][jMid + 1] = 1;
    grid[iMid + 2][jMid - 1] = 1;
    grid[iMid + 2][jMid + 1] = 1;
    grid[iMid + 3][jMid] = 1;
    return grid;
}

// Update visible grid
const updateGridView = function() {
    for (let i = 0; i < numRows; i++) {
        for (let j = 0; j < numCols; j++) {
            let cell = document.querySelector('#cell_' + i + '_' + j);
            if (grid[i][j] === 0) {
                cell.classList.remove('live');
                cell.classList.add('dead');
            } else {
                cell.classList.remove('dead');
                cell.classList.add('live');
            }
        }
    }
    return;
}

// Update grid according to original rules
const updateGrid = function() {
    const newGrid = [];
    for (let i = 0; i < numRows; i++) {
        newGrid[i] = [];
        for (let j = 0; j < numCols; j++) {
            const liveNeighbours = countLiveNeighbours(i, j);
            if (grid[i][j] === 1 && (liveNeighbours < 2 || liveNeighbours > 3)) {
                newGrid[i][j] = 0;
            } else if (grid[i][j] === 0 && liveNeighbours === 3) {
                newGrid[i][j] = 1;
            } else {
                newGrid[i][j] = grid[i][j];
            }
        }
    }
    grid = newGrid;
    return;
}

// Count live neighbours of a cell
const countLiveNeighbours = function(row, col) {
    let count = 0;
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            if (i === 0 && j === 0) {
                continue;
            }
            const r = row + i;
            const c = col + j;
            if (r >= 0 && r < numRows && c >= 0 && c < numCols) {
                count += grid[r][c];
            }
        }
    }
    return count;
}

// Play a single generation of the game
const iterateStep = function() {
    updateGrid();
    updateGridView();
    if (isRunning) {
        timer = setTimeout(iterateStep, updateTime);
    }
    return;
}

// Pentadecathlon figure
const setupGameBoardFigure = function(pattern) {
    const gameBoard = document.querySelector('#gameBoard');
    if (!gameBoard) {
        console.error("Error: No division element for game board.")
    }
    console.log("Setting up " + pattern + ".");
    // TODO: remove hardcoded gameboard width
    const cellSize = Math.floor(640 / numCols);
    let cellGrid = document.createElement('table');
    const iMidpoint = Math.floor(numRows / 2);
    const jMidpoint = Math.floor(numCols / 2);
    for (let i = 0; i < numRows; i++) {
        let cellRow = document.createElement('tr');
        for (let j = 0; j < numCols; j++) {
            let cell = document.createElement('td');
            cell.setAttribute('id', 'cell_' + i + '_' + j);
            if (pattern === 'longhorn') {
                if (i >= iMidpoint - 2 && i <= iMidpoint + 3 && j >= jMidpoint - 4 && j <= jMidpoint + 4) {
                    cell.classList.add(pattern);
                }
            } else if (pattern === 'pentadecathlon') {
                if (i >= iMidpoint - 1 && i <= iMidpoint + 1 && j >= jMidpoint -5 && j <= jMidpoint + 4) {
                    cell.classList.add(pattern);
                }
            } else if (pattern === 'pedestrian') {
                if (i >= iMidpoint - 2 && i <= iMidpoint + 3 && j >= jMidpoint - 4 && j <= jMidpoint + 3) {
                    cell.classList.add(pattern);
                }
            }
            cell.classList.add('dead');
            cell.onmouseover = cellMouseOverHandler;
            cell.onmouseleave = cellMouseLeaveHandler;
            cell.onclick = cellClickHandler;
            cell.style.setProperty('width', cellSize + 'px');
            cell.style.setProperty('height', cellSize + 'px');
            cellRow.appendChild(cell);
        }
        cellGrid.appendChild(cellRow);
    }
    gameBoard.appendChild(cellGrid);
    return;
}

// compare two arrays
// TODO this may be slow
const compareArrays = function(array1, array2) {
    return JSON.stringify(array1) === JSON.stringify(array2);
}

let numRows = 10;
let numCols = 10;
let isRunning = false;
let grid = createGrid();
let correctPattern;
let isCorrect = false;

const toggleControls = function() {
    const gameSettings = document.querySelectorAll('.gameSettings');
    resetButton.toggleAttribute('disabled');
    gameSettings.forEach((item) => {
        item.toggleAttribute('disabled');
    })
}

const longhornButton = document.querySelector('#longhorn');
longhornButton.addEventListener('click', () => {
    if (!isRunning) {
        numRows = 15;
        numCols = 15;
        updateTime = 500;
        removeGameBoard();
        setupGameBoardFigure('longhorn');
        grid = createGrid();
        correctPattern = correctGridLonghorn();
    }
})

const pentadecathlonButton = document.querySelector('#pentadecathlon');
pentadecathlonButton.addEventListener('click', () => {
    if (!isRunning) {
        numRows = 11;
        numCols = 18;
        updateTime = 500;
        removeGameBoard();
        setupGameBoardFigure('pentadecathlon');
        grid = createGrid();
        correctPattern = 'pentadecathlon';
    }
})

const pedestrianButton = document.querySelector('#pedestrian');
pedestrianButton.addEventListener('click', () => {
    if (!isRunning) {
        numRows = 50;
        numCols = 50;
        updateTime = 50;
        removeGameBoard();
        setupGameBoardFigure('pedestrian');
        grid = createGrid();
        correctPattern = 'pedestrian';
    }
})

const playButton = document.querySelector('#play');
playButton.addEventListener('click', () => {
    if (!isRunning) {
        isCorrect = compareArrays(grid, correctPattern);
        if (isCorrect) {
            console.log("Congratulations, you found the correct pattern.");
        }
        isRunning = true;
        console.log('Running game.');
        playButton.textContent = 'Pause';
        toggleControls();
        iterateStep();
    } else {
        isRunning = false;
        console.log('Pausing game.');
        playButton.textContent = 'Play';
        toggleControls();
    }
})

const resetButton = document.querySelector('#reset');
resetButton.addEventListener('click', () => {
    if (isRunning) return;
    isRunning = false;
    console.log('Resetting game.');
    removeGameBoard();
    playButton.textContent = 'Play';
    grid = createGrid();
})