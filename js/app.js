'use strict';

var game = {
    isOn: false,
    boardSize: 0,
    minesCount: 0,
    board: [],
};

var lastBoardSize = 4;
var lastMinesCount = 2;

var elGameOver = document.querySelector('#game-over');
var elVictory = document.querySelector('#victory');
var elTable = document.querySelector('#minesweeper > table');
var elIconButton = document.querySelector('#normal-smiley > button')

var elMinutes = document.querySelector("#timer-minutes");
var elSeconds = document.querySelector("#timer-seconds");
var totalSeconds = 0;
var timerInterval;
var timerScore;

var cellsFlagged = 0;

function startGame(boardSize = lastBoardSize, minesCount = lastMinesCount) {
    lastBoardSize = boardSize;
    lastMinesCount = minesCount;
    game.isOn = true;
    game.boardSize = boardSize;
    game.minesCount = minesCount;
    game.board = [];
    elGameOver.style.visibility = 'hidden';
    elVictory.style.visibility = 'hidden';
    cellsFlagged = 0;

    createBoard();
    addMines();
    renderBoard();

    if (timerInterval) {
        clearInterval(timerInterval);
    }

    totalSeconds = 0;
    setTime();
    timerInterval = setInterval(setTime, 1000);
    smileyChange('😊');
}

function setTime() {
    if (!game.isOn) {
        elSeconds.innerHTML = pad(totalSeconds % 60);
        elMinutes.innerHTML = pad(Math.floor(totalSeconds / 60));
        return;
    }

    elSeconds.innerHTML = pad(totalSeconds % 60);
    elMinutes.innerHTML = `${pad(Math.floor(totalSeconds / 60))} :`;
    totalSeconds++;
}

function pad(n) {
    return (n < 10 ? "0" + n : n);
}

function smileyChange(icon) {
    elIconButton.innerText = icon;
}

function createBoard() {
    for (var i = 0; i < game.boardSize; i++) {
        game.board.push([]);
        for (var j = 0; j < game.boardSize; j++) {
            var cell = {
                isMine: false,
                isFlag: false,
                isShown: false,
            };
            game.board[i].push(cell);
        }
    }
}

function addMines() {
    var totalMines = 0;
    while (totalMines < game.minesCount) {
        var i = getRandomNumber(game.boardSize - 1);
        var j = getRandomNumber(game.boardSize - 1);
        var randomCell = game.board[i][j];
        if (!randomCell.isMine) {
            randomCell.isMine = true;
            totalMines++;
        }
    }
}

function renderBoard() {
    var tableHtml = '';
    for (var i = 0; i < game.board.length; i++) {
        tableHtml += '<tr>';
        for (var j = 0; j < game.board.length; j++) {
            tableHtml += `<td id="cell-${i}-${j}"
                onclick="leftClick(${i}, ${j})"
                oncontextmenu="rightClick(event, ${i},${j})"
            ></td>`;
        }
        tableHtml += '</tr>';
    }

    elTable.innerHTML = tableHtml;
}

function drawBoard() {
    let table = document.querySelector('#minesweeper > table');
    let tableInnerHtml = '';
    for (var i = 0; i < gBoard.size; i++) {
        tableInnerHtml += '<tr>';
        for (var j = 0; j < gBoard.size; j++) {
            tableInnerHtml += `<td id="cell-${i}-${j}" 
            onclick="cellLeftClick(event,${i},${j})"
            oncontextclick="cellRightClick(event,${i},${j})"></div>`
        }
        tableInnerHtml += '</tr>';
    }
    table.innerHTML = tableInnerHtml;
}

function leftClick(i, j) {
    var cell = game.board[i][j];
    var elCell = document.querySelector(`#cell-${i}-${j}`);

    if (!game.isOn || cell.isFlag || cell.isShown) {
        return;
    }

    cell.isShown = true;

    if (cell.isMine) {
        elCell.innerText = '💥';
        var audio = new Audio('https://www.mediacollege.com/downloads/sound-effects/explosion/explosion-02.wav');
        audio.play();
        timerOff();
        elGameOver.style.visibility = 'visible';
        elCell.classList.add('shown');
        smileyChange('😳');
        return;
    }

    var minesCountAround = getMinesCountAround(i, j);
    if (minesCountAround > 0) {
        elCell.innerText = minesCountAround;
        elCell.style.color = getMinesCountColor(minesCountAround);
    }
    elCell.classList.add('shown');

    isVictory();
}

function rightClick(event, i, j) {
    if (!game.isOn) {
        return;
    }

    var cell = game.board[i][j];

    if (cell.isShown) {
        event.preventDefault();
        return;
    }

    var elCell = document.querySelector(`#cell-${i}-${j}`);

    if (!cell.isFlag) {
        elCell.innerText = '🚩';
        cell.isFlag = true;
        cellsFlagged++;
    } else {
        elCell.innerText = '';
        cell.isFlag = false;
        cellsFlagged--;
    }

    isVictory();

    event.preventDefault();
}

function getRandomNumber(max) {
    return Math.floor(
        Math.random() * max + 1
    );
}

function getMinesCountAround(i, j) {
    var minesCount = 0;

    var isNotTop = i > 0;
    var isNotBottom = i < game.boardSize - 1;
    var isNotLeft = j > 0;
    var isNotRight = j < game.boardSize - 1;

    if (isNotTop) {
        var topCell = game.board[i - 1][j];
        if (topCell.isMine) {
            minesCount++;
        }
        if (isNotLeft) {
            var topLeftCell = game.board[i - 1][j - 1];
            if (topLeftCell.isMine) {
                minesCount++;
            }
        }
        if (isNotRight) {
            var topRightCell = game.board[i - 1][j + 1];
            if (topRightCell.isMine) {
                minesCount++;
            }
        }
    }
    if (isNotBottom) {
        var bottomCell = game.board[i + 1][j];
        if (bottomCell.isMine) {
            minesCount++;
        }
        if (isNotLeft) {
            var bottomLeftCell = game.board[i + 1][j - 1];
            if (bottomLeftCell.isMine) {
                minesCount++;
            }
        }
        if (isNotRight) {
            var bottomRightCell = game.board[i + 1][j + 1];
            if (bottomRightCell.isMine) {
                minesCount++;
            }
        }
    }
    if (isNotLeft) {
        var leftCell = game.board[i][j - 1];
        if (leftCell.isMine) {
            minesCount++;
        }
    }
    if (isNotRight) {
        var rightCell = game.board[i][j + 1];
        if (rightCell.isMine) {
            minesCount++;
        }
    }

    return minesCount;
}

function getMinesCountColor(minesCount) {
    switch (minesCount) {
        case 1:
            return 'blue';
            break;

        case 2:
            return 'green';
            break;

        case 3:
            return 'red';
            break;

        case 4:
            return 'purple';
            break;

        case 5:
            return 'maroon';
            break;

        case 6:
            return 'turquoise';
            break;

        case 7:
            return 'yellow';
            break;

        case 8:
            return 'lightgray';
            break;

        case 9:
            return 'black';
            break;
    }
}

function getShownCellsCount() {
    var shownCellsCount = 0;
    for (var i = 0; i < game.boardSize; i++) {
        for (var j = 0; j < game.boardSize; j++) {
            if (game.board[i][j].isShown) {
                shownCellsCount++;
            }
        }
    }
    return shownCellsCount;
}

function timerOff() {
    game.isOn = false;
    clearInterval(timerInterval);

    var shownCellsCount = getShownCellsCount();

    if (shownCellsCount !== game.boardSize ** 2 - game.minesCount) {
        for (var i = 0; i < game.boardSize; i++) {
            for (var j = 0; j < game.boardSize; j++) {
                var cell = game.board[i][j];

                if (cell.isShown) {
                    continue;
                }

                if (cell.isMine) {
                    cell.isShown = true;

                    var elCell = document.querySelector(`#cell-${i}-${j}`);

                    elCell.innerText = '💥';
                    elCell.classList.add('shown');
                }

                continue;
            }
        }
    }
}

function isVictory() {
    var shownCellsCount = getShownCellsCount();

    if (shownCellsCount === game.boardSize ** 2 - game.minesCount && game.minesCount === cellsFlagged) {
        elVictory.style.visibility = 'visible';
        timerOff();
        var audio = new Audio('https://github.com/logalex96/Minesweeper/blob/master/sounds/gameWin.wav?raw=true');
        audio.play();
        smileyChange('😎');
        bestScore();
    }
}

function bestScore() {
    if (!localStorage.getItem(game.boardSize) || localStorage.getItem(game.boardSize) > totalSeconds) {
        localStorage.setItem(game.boardSize, totalSeconds);
    }
}