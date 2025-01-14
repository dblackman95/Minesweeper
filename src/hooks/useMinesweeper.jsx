import { useState, useEffect } from 'react';

const useMinesweeper = (height, width, numMines) => {

    const [grid, setGrid] = useState(null);
    const [flagEnabled, setFlagEnabled] = useState(false);
    const [gameover, setGameover] = useState(false);
    const [flagsRemaining, setFlagsRemaining] = useState(numMines);
    const [flagCoordinates, setFlagCoordinates] = useState([]);
    const [startTimer, setStartTimer] = useState(false);
    const [timer, setTimer] = useState(0);


    function generateGameBoard(width, height, numMines) {
            var matrix = [];
            for (let i = 0; i < width; i++) {
                matrix[i] = [];
            }
    
            for (let i = 0; i < width; i++) {
                for (let j = 0; j < height; j++) {
                    matrix[i].push(0);
                }
            }
    
            for (let i = 0; i < numMines; i++) {
                let index_i = getRandomInt(width);
                let index_j = getRandomInt(height);
                matrix[index_i][index_j] = -1; //mine 
            }
    
            return generateProximities(matrix, width, height);
        }
    
        function generateProximities(matrix, width, height) {
            for(let i = 0; i < width; i++) {
                for (let j = 0; j < height; j++) {
                    if (matrix[i][j] !== -1) { // only check cells that aren't mines
                        if (hasCellAbove(j)) { //top
                            if (matrix[i][j - 1] === -1)
                                matrix[i][j]++;
                            if (hasCellToLeft(i)) { //top left
                                if (matrix[i - 1][j - 1] === -1)
                                    matrix[i][j]++;
                            }
                            if (hasCellToRight(i)) { //top right
                                if (matrix[i + 1][j - 1] === -1)
                                    matrix[i][j]++;
                            }
                        }
                        if (hasCellBelow(j)) { //bottom
                            if (matrix[i][j + 1] === -1)
                                matrix[i][j]++;
                            if (hasCellToLeft(i)) { //bottom left
                                if (matrix[i - 1][j + 1] === -1)
                                    matrix[i][j]++;
                            }
                            if (hasCellToRight(i)) { //bottom right
                                if (matrix[i + 1][j + 1] === -1)
                                    matrix[i][j]++;
                            }
                        }
                        if (hasCellToLeft(i)) { //left
                            if (matrix[i - 1][j] === -1)
                                matrix[i][j]++;
                        }
                        if (hasCellToRight(i)) { //right
                            if (matrix[i + 1][j] === -1)
                                matrix[i][j]++;
                        }
                    }
                }
            }
    
            return convertGridToStrings(matrix, width, height);
        }
    
        function convertGridToStrings(matrix, width, height) {
            var newMatrix = [];
    
            for (let i = 0; i < width; i++) {
                newMatrix[i] = [];
            }
    
            for (let i = 0; i < width; i++) {
                for (let j = 0; j < height; j++) {
                    newMatrix[i].push({});
                }
            }
    
            for (let i = 0; i < width; i++) {
                for (let j = 0; j < height; j++) {
                    if (matrix[i][j] === 0) {
                        newMatrix[i][j] = {
                            display: " ",
                            isRevealed: false,
                            revealedDisplay: " ",
                        }; 
                    } else {
                        newMatrix[i][j] = {
                            display: " ",
                            isRevealed: false,
                            revealedDisplay: matrix[i][j].toString(),
                        }
                    }
                }
            }
    
            return newMatrix;
        }
    
        function getRandomInt(max) {
            return Math.floor(Math.random() * max);
        }
    
        function hasCellAbove(j) {
            return j !== 0;
        }
    
        function hasCellBelow(j) {
            return j !== height - 1;
        }
    
        function hasCellToLeft(i) {
            return i !== 0;
        }
    
        function hasCellToRight(i) {
            return i !== width - 1;
        }
    
        const reveal = (i, j) => {
            if (!startTimer) {
                setStartTimer(true);
            }
            if (!gameover) {
                if (!grid[i][j].isRevealed) {
                    if (flagEnabled) {
                        // console.log(flagCoordinates);
                        // console.log(coordinatesFound(i, j));
                        if (coordinatesFound(i, j)) { // flag HAS NOT already been placed at coordinates i, j
                            // console.log("Flag has not been placed at (" + i.toString() + ", " + j.toString() + ").");
                            if (flagsRemaining > 0) {
                                let tempCoord = [];
                                tempCoord.push(i);
                                tempCoord.push(j);
                                // console.log(tempCoord);
                                setFlagCoordinates([...flagCoordinates, tempCoord]);
                                setFlagsRemaining((value) => value > 0 ? value - 1 : 0);
                                document.getElementById(i.toString() + "_" + j.toString()).classList.add("greenflag");
                            }
                        } else { //flag HAS already been placed at coordinates i, j
                            // console.log("Flag has been placed at (" + i.toString() + ", " + j.toString() + ").");
                            setFlagCoordinates(() => [...removeFlagCoordinates(i, j)]);
                            setFlagsRemaining((value) => value + 1);
                            document.getElementById(i.toString() + "_" + j.toString()).classList.remove("greenflag");
                        }
                    } else {
                        // We need to make sure a cell that is flagged cannot be clicked (because it's a bomb and the player will lose the game!)
                        let foundInFlagCoordinates = false;
                        let templist = [];
                        templist.push(i);
                        templist.push(j);
                        flagCoordinates.forEach((coordinate) => {
                            if (JSON.stringify(templist) === JSON.stringify(coordinate))
                                foundInFlagCoordinates = true;
                        });
                        if (!foundInFlagCoordinates) {
                            let tempGrid = grid.map(row => [...row]);
                            tempGrid[i][j].isRevealed = true;
                            if (tempGrid[i][j].revealedDisplay === '-1') { // Game over condition
                                setGrid(tempGrid); //return
                                setTimeout(() => gameOver(), 100);
                            } else {
                                revealLeft(tempGrid, i, j);
                                revealRight(tempGrid, i, j);
                                revealTop(tempGrid, i, j);
                                revealBottom(tempGrid, i, j);
                            }
                        }
                    }
                }
            }
        }
    
        function revealLeft(tempGrid, i, j) {
            if (!hasCellToLeft(i)) {
                setGrid(tempGrid); //return
            } else {
                let foundInFlagCoordinates = false;
                let templist = [];
                templist.push(i);
                templist.push(j);
                tempGrid.forEach((coordinate) => {
                    if (JSON.stringify(templist) === JSON.stringify(coordinate))
                        foundInFlagCoordinates = true;
                });
                if (!foundInFlagCoordinates) {
                    if (!tempGrid[i - 1][j].isRevealed) {
                        if (tempGrid[i - 1][j].revealedDisplay === " ") {
                            tempGrid[i - 1][j].isRevealed = true;
                            revealLeft(tempGrid, i - 1, j);
                            revealTop(tempGrid, i - 1, j);
                            revealBottom(tempGrid, i - 1, j);
                        } else if (tempGrid[i - 1][j].revealedDisplay === "-1") {
                            setGrid(tempGrid); //return
                        } else {
                            tempGrid[i - 1][j].isRevealed = true;
                            setGrid(tempGrid); //return
                        }
                    } setGrid(tempGrid); //return
                }
            }
        }
    
        function revealRight(tempGrid, i, j) {
            if (!hasCellToRight(i)) {
                setGrid(tempGrid); //return
            } else {
                let foundInFlagCoordinates = false;
                let templist = [];
                templist.push(i);
                templist.push(j);
                tempGrid.forEach((coordinate) => {
                    if (JSON.stringify(templist) === JSON.stringify(coordinate))
                        foundInFlagCoordinates = true;
                });
                if (!foundInFlagCoordinates) {
                    if (!tempGrid[i + 1][j].isRevealed) {
                        if (tempGrid[i + 1][j].revealedDisplay === " ") {
                            tempGrid[i + 1][j].isRevealed = true;
                            revealRight(tempGrid, i + 1, j);
                            revealTop(tempGrid, i + 1, j);
                            revealBottom(tempGrid, i + 1, j);
                        } else if (tempGrid[i + 1][j].revealedDisplay === "-1") {
                            setGrid(tempGrid); //return
                        } else {
                            tempGrid[i + 1][j].isRevealed = true;
                            setGrid(tempGrid); //return
                        }
                    } setGrid(tempGrid); //return
                }
            }
        }
    
        function revealTop(tempGrid, i, j) {
            if (!hasCellAbove(j)) {
                setGrid(tempGrid); //return
            } else {
                let foundInFlagCoordinates = false;
                let templist = [];
                templist.push(i);
                templist.push(j);
                tempGrid.forEach((coordinate) => {
                    if (JSON.stringify(templist) === JSON.stringify(coordinate))
                        foundInFlagCoordinates = true;
                });
                if (!foundInFlagCoordinates) {
                    if (!tempGrid[i][j - 1].isRevealed) {
                        if (tempGrid[i][j - 1].revealedDisplay === " ") {
                            tempGrid[i][j - 1].isRevealed = true;
                            revealLeft(tempGrid, i, j - 1);
                            revealRight(tempGrid, i, j - 1);
                            revealTop(tempGrid, i, j - 1);
                        } else if (tempGrid[i][j - 1].revealedDisplay === "-1") {
                            setGrid(tempGrid); //return
                        } else {
                            tempGrid[i][j - 1].isRevealed = true;
                            setGrid(tempGrid); //return
                        }
                    } setGrid(tempGrid); //return
                }
            }
        }
    
        function revealBottom(tempGrid, i, j) {
            if (!hasCellBelow(j)) {
                setGrid(tempGrid); //return
            } else {
                let foundInFlagCoordinates = false;
                let templist = [];
                templist.push(i);
                templist.push(j);
                tempGrid.forEach((coordinate) => {
                    if (JSON.stringify(templist) === JSON.stringify(coordinate))
                        foundInFlagCoordinates = true;
                });
                if (!foundInFlagCoordinates) {
                    if (!tempGrid[i][j + 1].isRevealed) {
                        if (tempGrid[i][j + 1].revealedDisplay === " ") {
                            tempGrid[i][j + 1].isRevealed = true;
                            revealLeft(tempGrid, i, j + 1);
                            revealRight(tempGrid, i, j + 1);
                            revealBottom(tempGrid, i, j + 1);
                        } else if (tempGrid[i][j + 1].revealedDisplay === "-1") {
                            setGrid(tempGrid); //return
                        } else {
                            tempGrid[i][j + 1].isRevealed = true;
                            setGrid(tempGrid); //return
                        }
                    } setGrid(tempGrid); //return
                }
            }
        }

        function addFlagCoordinates(i, j) {
            let tempFlagCoordinates = flagCoordinates.map(item => [...item]);
            console.log("There are " + tempFlagCoordinates.length.toString() + "items in the list");
            let list = [];
            list.push(i);
            list.push(j);
            tempFlagCoordinates.push(list);
            return tempFlagCoordinates;
        }

        function removeFlagCoordinates(i, j) {
            let tempFlagCoordinates = flagCoordinates.map(item => [...item]);
            return tempFlagCoordinates.filter(item => JSON.stringify(item) !== JSON.stringify([i, j]));
        }

        function coordinatesFound(i, j) {
            let tempFlagCoordinates = flagCoordinates.map(item => [...item]);
            return (tempFlagCoordinates.findIndex(item => JSON.stringify(item) === JSON.stringify([i, j])) === -1);
        }
    
        function gameOver() {
            document
                .getElementById("table")
                .classList
                .add("horizontal-shake");
            setTimeout(() => alert("You hit a mine! Sorry, that's game over :("), 500);
            setGameover(gameover => !gameover);
            setStartTimer(false);
        }
    
        useEffect(() => {
            setGrid(generateGameBoard(width, height, numMines));
        }, [setGrid, width, height, numMines]);

        useEffect(() => {
            const countdownTimer = setInterval(() => {if (startTimer) setTimer(timer + 1)}, 1000);
            return () => clearInterval(countdownTimer);
        }, [startTimer, timer]);

    

    return {flagEnabled, setFlagEnabled, gameover, setGameover, grid, setGrid, reveal, flagsRemaining, flagCoordinates, startTimer, timer};
}

export default useMinesweeper;