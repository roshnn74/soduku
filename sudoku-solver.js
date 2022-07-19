const b = null;

var bd = [
    [b,b,b,b,b,b,b,b,b],
    [b,b,b,b,b,b,b,b,b],
    [b,b,b,b,b,b,b,b,b],
    [b,b,b,b,b,b,b,b,b],
    [b,b,b,b,b,b,b,b,b],
    [b,b,b,b,b,b,b,b,b],
    [b,b,b,b,b,b,b,b,b],
    [b,b,b,b,b,b,b,b,b],
    [b,b,b,b,b,b,b,b,b]
]

var resetBoard = [
    [b,b,b,b,b,b,b,b,b],
    [b,b,b,b,b,b,b,b,b],
    [b,b,b,b,b,b,b,b,b],
    [b,b,b,b,b,b,b,b,b],
    [b,b,b,b,b,b,b,b,b],
    [b,b,b,b,b,b,b,b,b],
    [b,b,b,b,b,b,b,b,b],
    [b,b,b,b,b,b,b,b,b],
    [b,b,b,b,b,b,b,b,b]
]

var ans;

const puzzleBoard = document.querySelector('#puzzle')
const solveButton = document.querySelector('#solve-button')
const checkButton = document.querySelector('#check-button')
const resetButton = document.querySelector('#reset-button')
const ngButton = document.querySelector('#ng-button')

ngButton.addEventListener('click', () => {
    if(confirm("Generate new puzzle ?") == true) {
        window.location.reload();
    }
})

solveButton.addEventListener('click', () => {
    if(confirm("Display solution ?") == true) {
        printBoard(ans)
        document.getElementById("solve-button").style.display="none";
        document.getElementById("check-button").style.display="none";
        document.getElementById("reset-button").style.display="none";
    }
})

checkButton.addEventListener('click', () => {
    if(confirm("Check solution ?") == true) {
        puzzleCheck(ans)
        document.getElementById("solve-button").style.display="none";
        document.getElementById("check-button").style.display="none";
        document.getElementById("reset-button").style.display="none";
    }
})

resetButton.addEventListener('click', () => {
    if(confirm("Reset board ?") == true) {
        bd = resetBoard
        printBoard(bd)
        numSelected.classList.remove('number-selected')
    }
})

window.onload = function() {
    setGame()
}

function setGame() {
    for(var i = 1; i <= 9; i++) {
        let number = document.createElement('div')
        number.id = i
        number.innerText = i
        number.addEventListener('click',selectNumber)
        number.classList.add('number')
        document.getElementById('digits').appendChild(number)
    }
    for (var r = 0; r < 9; ++r) {
        for (var c = 0; c < 9; c++) {
            const inputElement = document.createElement('div')
            if(r == 2 || r == 5) {
                inputElement.classList.add('horizontal-line')
            }
            if(c == 2 || c == 5) {
                inputElement.classList.add('vertical-line')
            }
            inputElement.classList.add('tile')
            inputElement.addEventListener('click',selectTile)
            puzzleBoard.appendChild(inputElement)
        }
    }
    puzzleGenerator(bd)
    ans = solve(bd)
    bd = resetBoard
    newPuzzle(bd,ans)
    resetBoard = bd
    printBoard(bd)
    // console.log(bd)
    // printBoard(bd)
}

function randGen(min, max) { 
    return Math.floor(Math.random() * (max - min + 1) + min)
}

function puzzleGenerator(board) {
    var cur = []
    var lmt = 5
    for (var i = 0; i < lmt; i++) {
        let r = randGen(1,9) - 1
        let c = randGen(1,9) - 1
        let randNum = randGen(1,9)
        if(cur.includes(randNum)) {
            lmt ++
            continue 
        }
        if(board[r][c] == null) {
            board[r][c] = randNum
            cur.push(bd[r][c])
        }
    }
}

function newPuzzle(puzzle,board) {
    for (var i = 0; i < 20; i++) {
        let r = randGen(1,9) - 1
        let c = randGen(1,9) - 1
        puzzle[r][c] = board[r][c]
    }
}

var numSelected = null

function selectNumber() {
    if(numSelected != null) {
        numSelected.classList.remove('number-selected')
    }
    numSelected = this
    numSelected.classList.add('number-selected')
}

function selectTile() {
    if(numSelected) {
        if(this.innerText != "") {
            return ;
        }
        this.innerText = numSelected.id
        numSelected.classList.remove('number-selected')
    }
}


function solve(board) {
    if(solved(board)) {
        return board
    }
    else {
        const possibilities = nextBoards(board)
        const validBoards = keepOnlyValid(possibilities)
        return searchForSolution(validBoards)
    }
}

function searchForSolution(boards) {
    if(boards.length < 1) {
        return false
    }
    else {
        var first = boards.shift()
        const tryPath = solve(first)
        if(tryPath != false) {
            return tryPath
        }
        else {
            return searchForSolution(boards)
        }
    }
}

function solved(board) {
    for(var i = 0; i < 9; i++) {
        for(var j = 0; j < 9; j++) {
            if(board[i][j] == null) {
                return false
            }
        }
    }
    return true
}

function nextBoards(board) {
    var res = []
    const firstEmpty = findEmptySquare(board)
    if(firstEmpty != undefined) {
        const y = firstEmpty[0]
        const x = firstEmpty[1]
        for(var i = 1; i <= 9; i++) {
            var newBoard = [...board]
            var row = [...newBoard[y]]
            row[x] = i
            newBoard[y] = row
            res.push(newBoard)
        }
    }
    return res
}

function findEmptySquare(board) {
    for(var i = 0; i < 9; i++) {
        for(var j = 0; j < 9; j++) {
            if(board[i][j] == null) {
                return [i,j]
            }
        }
    }
}

function keepOnlyValid(boards) {
    return boards.filter(b => validBoards(b))
}

function validBoards(board) {
    return rowGood(board) && columnGood(board) && boxesGood(board) 
}

function rowGood(board) {
    for(var i = 0; i <9 ; i++) {
        var cur = []
        for(var j = 0; j < 9; j++) {
            if(cur.includes(board[i][j])) {
                return false
            }
            else if (board[i][j] != null) {
                cur.push(board[i][j])
            }
        }
    }
    return true
}

function columnGood(board) {
    for(var i = 0; i <9 ; i++) {
        var cur = []
        for(var j = 0; j < 9; j++) {
            if(cur.includes(board[j][i])) {
                return false
            }
            else if (board[j][i] != null) {
                cur.push(board[j][i])
            }
        }
    }
    return true
}

function boxesGood(board) {
    const boxCoordinates = [
       [0, 0], [0, 1], [0, 2],
       [1, 0], [1, 1], [1, 2],
       [2, 0], [2, 1], [2, 2], 
    ]
    for(var y = 0; y < 9; y += 3) {
        for(var x = 0; x < 9; x += 3) {
            var cur = []
            for(var i = 0; i < 9; i++) {
                var coordinates = [...boxCoordinates[i]]
                coordinates[0] += y
                coordinates[1] += x
                if (cur.includes(board[coordinates[0]][coordinates[1]])) {
                    return false
                }
                else if (board[coordinates[0]][coordinates[1]] != null) {
                    cur.push(board[coordinates[0]][coordinates[1]])
                }
            }
        }
    }
    return true
}

function printBoard(board) {
    const inputs = document.querySelectorAll('div.tile')
    var i = 0, j = 0
    inputs.forEach(input => {
        if(j >= 9) {
            j = 0
            i ++
        }
        if(board[i][j]) {
            input.innerText = String(board[i][j])
            input.classList.add('tile-start')
        }
        else {
            input.innerText = ""
        }
        j++
    })
}

function puzzleCheck(board) {
    let inputs = document.querySelectorAll('div.tile')
    var i = 0, j = 0
    inputs.forEach(input => {
        if(j >= 9) {
            j = 0
            i ++
        }
        if(input.innerText != String(board[i][j])) {
            input.innerText = String(board[i][j])
            input.classList.add('tile-wrong')
        }
        else {
            if(!input.classList.contains('tile-start')) {
                input.classList.add('tile-right')
            }
        }
        j++
    })
}