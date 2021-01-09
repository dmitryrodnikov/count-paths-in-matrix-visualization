import React, { useState } from 'react';
import './App.css';
import { binaryGrid, calculateAllPaths } from './calculate-paths';
import { Grid } from './grid';

const createInitialGrid = (width: number, height: number): binaryGrid => {
    const grid = [];

    for (let h = 0; h < height; h++) {
        const row: { isWall: boolean; paths: number }[] = [];

        for (let w = 0; w < width; w++) {
            const isStart = h + w === 0;
            const isFinish = h === height - 1 && w === width - 1;
            row.push({
                isWall: !isStart && !isFinish && Math.random() > 0.8,
                paths: 0,
            });
        }

        grid.push(row);
    }

    return grid;
};

function App() {
    const [amount, setAmount] = useState<number>(0);
    const [memory, setMemory] = useState<number>(0);
    const [iterations, setIterations] = useState<number>(0);
    const [grid, setGrid] = useState<binaryGrid>(createInitialGrid(10, 10));
    const [selected, setSelected] = useState<[number, number]>([0, 0]);

    const toggleWall = (rowIndex: number, colIndex: number) => {
        const newGrid = [...grid];
        newGrid[rowIndex][colIndex].isWall = !newGrid[rowIndex][colIndex].isWall;
        setGrid(newGrid);
    };

    const handleStart = () => {
        const iterator = calculateAllPaths(
            grid,
            ({ rowNum, colNum, amount, isMemo, memory }) => {
                const gr = [...grid];
                gr[colNum][rowNum].paths = amount;

                if (isMemo) {
                    gr[colNum][rowNum].memoized = true;
                }
                setMemory(memory);
                setSelected([colNum, rowNum]);
            },
            () => {
                setIterations(prevIterations => prevIterations + 1);
            },
        );

        let res = iterator.next();

        const intId = setInterval(() => {
            if (res.done) {
                setAmount(res.value);
                clearInterval(intId);
            }
            res = iterator.next();
        }, 30);

        setAmount(res.value);
    };

    return (
        <div className="App" style={{ padding: '100px' }}>
            <h1>Pathfinding visualization</h1>
            <div className="description">
                Find all paths from top left to bottom right corner of grid. You can only step right and bottom. Avoid
                obstacles
            </div>
            <div className="controls">
                <button className="start" onClick={handleStart}>
                    Start
                </button>
                <div className="result">Result: {amount}</div>
                <div className="info">Memory used: {memory}</div>
                <div className="info"> Number of iterations: {iterations}</div>
            </div>
            <Grid grid={grid} onCellClick={toggleWall} selected={selected} />
        </div>
    );
}

export default App;
