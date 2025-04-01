let timer;
let updateTime = 100;
let iterationCount = 0;
const maxIterations = {
    longhorn: 25,
    pentadecathlon: 20,
    pedestrian: 500
};
const solutions = {
    longhorn: "x = 4",
    pentadecathlon: "y = 6",
    pedestrian: "z = 9"
};
const solutionsMath = {
    longhorn: "<math><mi>x</mi> <mo>=</mo> <mi>4</mi></math>",
    pentadecathlon: "<math><mi>y</mi> <mo>=</mo> <mi>6</mi></math>",
    pedestrian: "<math><mi>z</mi> <mo>=</mo> <mi>9</mi></math>"
};
let totalLiveCount = 0;

const symbolPlay = 'play_arrow';
const symbolPause = 'pause';
const symbolReset = 'replay';

const setupGameBoardPattern = function(pattern) {
    const gameBoard = document.querySelector('#gameBoard');
    if (!gameBoard) {
        console.error("Error: No division element for game board.");
    }
    console.log("Setting up " + pattern + ".");
    const gameBoardContainer = document.querySelector('#gameBoardContainer');
    let cellGrid = document.createElement('table');
    // account for table spacing of 1px in the row size
    const rowSize = Math.floor(0.8 * (gameBoardContainer.offsetHeight - 2 * numRows) / numRows);
    const colSize = Math.floor(0.8 * (gameBoardContainer.offsetWidth - 2 * numCols) / numCols);
    const cellSize = Math.min(rowSize, colSize);
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
            cell.style.transition = updateTime/2 + 'ms';
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
        this.classList.replace('live', 'dead');
        grid[row][col] = 0;
        totalLiveCount--;
    } else {
        this.classList.replace('dead', 'live');
        grid[row][col] = 1;
        totalLiveCount++;
    }
    if (totalLiveCount === 0) {
        playButton.toggleAttribute('disabled');
    } else {
        playButton.removeAttribute('disabled');
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

const correctGrid = function(pattern) {
    let grid = createGrid();
    const iMid = Math.floor(numRows / 2);
    const jMid = Math.floor(numCols / 2);
    if (pattern === 'longhorn') {
        grid[iMid - 2][jMid - 3] = 1;
        grid[iMid - 2][jMid - 2] = 1;
        grid[iMid - 2][jMid + 2] = 1;
        grid[iMid - 2][jMid + 3] = 1;
        grid[iMid - 1][jMid - 4] = 1;
        grid[iMid - 1][jMid - 1] = 1;
        grid[iMid - 1][jMid + 1] = 1;
        grid[iMid - 1][jMid + 2] = 1; // this does not belong to original longhorn
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
    } else if (pattern === 'pentadecathlon') {
        grid[iMid - 1][jMid - 3] = 1;
        grid[iMid - 1][jMid + 2] = 1;
        for (let j = -5; j < 5; j++) {
            if (j == -3 || j == 2) { continue; }
            grid[iMid][jMid + j] = 1;
        }
        grid[iMid + 1][jMid - 3] = 1;
        grid[iMid + 1][jMid + 2] = 1;
    } else if (pattern === 'pedestrian') {
        grid[iMid - 2][jMid - 4] = 1;
        grid[iMid - 2][jMid - 1] = 1;
        grid[iMid - 1][jMid + 1] = 1;
        grid[iMid][jMid - 4] = 1;
        grid[iMid][jMid] = 1;
        grid[iMid][jMid + 2] = 1;
        grid[iMid][jMid + 3] = 1;
        grid[iMid + 1][jMid - 4] = 1;
        grid[iMid + 1][jMid] = 1;
        grid[iMid + 2][jMid - 4] = 1;
        grid[iMid + 2][jMid - 2] = 1;
        grid[iMid + 2][jMid - 1] = 1;
        grid[iMid + 3][jMid - 4] = 1;
        grid[iMid + 3][jMid - 2] = 1;
    }
    return grid;
}

// Update visible grid
const updateGridView = function() {
    for (let i = 0; i < numRows; i++) {
        for (let j = 0; j < numCols; j++) {
            let cell = document.querySelector('#cell_' + i + '_' + j);
            if (grid[i][j] === 0) {
                cell.classList.replace('live', 'dead');
            } else {
                cell.classList.replace('dead', 'live');
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
                totalLiveCount--;
            } else if (grid[i][j] === 0 && liveNeighbours === 3) {
                newGrid[i][j] = 1;
                totalLiveCount++;
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
    iterationCount++;
    // check if at least one cell is still alive
    const isLive = totalLiveCount > 0;
    if (!isLive) {
        stopGame();
    } else if (isCorrect && iterationCount > maxIterations[currentPattern]) {
        stopGame();
        patternFound(currentPattern);
    }
    if (isRunning) {
        timer = setTimeout(iterateStep, updateTime);
    }
    return;
}

const stopGame = function() {
    isRunning = false;
    playButton.setAttribute('disabled', 'true');
    playButton.innerHTML = '<span class="material-symbols-outlined">' +
    symbolPlay + '</span>';
    console.log("Pausing game.")
    return;
}

const patternFound = function(currentPattern) {
    const gameBoardContainer = document.querySelector('#gameBoardContainer');
    const patternButton = document.querySelector(`#${currentPattern}`);
    patternButton.classList.replace('unsolved', 'solved');
    patternButton.innerHTML = `<p class="doto">${solutions[currentPattern]}</p>`;
    let messageContainer = document.createElement('div');
    messageContainer.classList.add('overlayMessage');
    messageContainer.classList.add(currentPattern);
    messageContainer.innerHTML = `<p class=".doto">
        Gut gemacht, ihr habt das richtige Muster entdeckt!
        <br>
        Ihr findet ${solutions[currentPattern]}.
    </p>`;
    gameBoardContainer.appendChild(messageContainer);
    return;
}

const removeMessage = function() {
    const gameBoardContainer = document.querySelector('#gameBoardContainer');
    const messages = document.querySelectorAll('.overlayMessage');
    messages.forEach((item) => {
        gameBoardContainer.removeChild(item);
    })
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
let isCorrect = false;
let initialized = false;
let grid = createGrid();
let currentPattern;
let correctPattern;
let foundPatterns = new Set();

const setupControls = function() {
    if (!initialized) {
        resetButton.removeAttribute('disabled');
        initialized = true;
    }
    return;
}

const longhornButton = document.querySelector('#longhorn');
longhornButton.addEventListener('click', () => {
    if (!isRunning) {
        currentPattern = 'longhorn';
        numRows = 13;
        numCols = 13;
        updateTime = 500;
        iterationCount = 0;
        totalLiveCount = 0;
        removeMessage();
        removeGameBoard();
        setupControls();
        setupGameBoardPattern(currentPattern);
        grid = createGrid();
        correctPattern = correctGrid(currentPattern);
    }
})

const pentadecathlonButton = document.querySelector('#pentadecathlon');
pentadecathlonButton.addEventListener('click', () => {
    if (!isRunning) {
        currentPattern = 'pentadecathlon';
        numRows = 11;
        numCols = 18;
        updateTime = 500;
        iterationCount = 0;
        totalLiveCount = 0;
        removeMessage();
        removeGameBoard();
        setupControls();
        setupGameBoardPattern(currentPattern);
        grid = createGrid();
        correctPattern = correctGrid(currentPattern);
    }
})

const pedestrianButton = document.querySelector('#pedestrian');
pedestrianButton.addEventListener('click', () => {
    if (!isRunning) {
        currentPattern = 'pedestrian';
        numRows = 40;
        numCols = 40;
        updateTime = 50;
        iterationCount = 0;
        totalLiveCount = 0;
        removeMessage();
        removeGameBoard();
        setupControls();
        setupGameBoardPattern(currentPattern);
        grid = createGrid();
        correctPattern = correctGrid(currentPattern);
    }
})

const playButton = document.querySelector('#play');
playButton.addEventListener('click', () => {
    if (!isRunning) {
        isCorrect = compareArrays(grid, correctPattern);
        if (isCorrect) {
            foundPatterns.add(currentPattern);
            console.log("Congratulations, you found the correct pattern.");
            if (foundPatterns.size === 3) {
                console.log("Congratulations, you have solved the puzzle.");
            }
        }
        isRunning = true;
        console.log('Running game.');
        playButton.innerHTML = '<span class="material-symbols-outlined">' +
    symbolPause + '</span>';
        iterateStep();
    } else {
        stopGame();
    }
})

const resetButton = document.querySelector('#reset');
resetButton.addEventListener('click', () => {
    isRunning = false;
    foundPatterns.clear();
    console.log('Resetting game.');
    iterationCount = 0;
    totalLiveCount = 0;
    removeMessage();
    removeGameBoard();
    setupGameBoardPattern(currentPattern);
    grid = createGrid();
    playButton.setAttribute('disabled', 'true');
    playButton.innerHTML = '<span class="material-symbols-outlined">' +
    symbolPlay + '</span>';
})