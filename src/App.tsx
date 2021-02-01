import React, { useCallback, useRef, useState } from 'react';
import { binaryGrid, calculateAllPaths, StepHandler } from './calculate-paths';
import { Code } from './code';
import { Grid } from './grid/grid';
import { RadioSwitch } from './radio-switch/radio-switch';
import './App.css';

const createGrid = (width: number, height: number, generateWalls: boolean): binaryGrid => {
    const grid = [];

    for (let h = 0; h < height; h++) {
        const row: { isWall: boolean; paths: number }[] = [];

        for (let w = 0; w < width; w++) {
            const isStart = h + w === 0;
            const isFinish = h === height - 1 && w === width - 1;
            row.push({
                isWall: generateWalls ? !isStart && !isFinish && Math.random() > 0.8 : false,
                paths: 0,
            });
        }

        grid.push(row);
    }

    return grid;
};

/*
 * todo legend for colors of cell
 */

const gridSize: [number, number] = [15, 10];
const createInitialGrid = (generateWalls: boolean) => createGrid(...gridSize, generateWalls);
const initial = createInitialGrid(true);

const speedSettings = [
    { value: 30, label: 'Fast' },
    { value: 100, label: 'Medium' },
    { value: 300, label: 'Slow' },
];

function App() {
    // Results
    const [amount, setAmount] = useState<number>(0);
    const [memory, setMemory] = useState<number>(0);
    const [iterations, setIterations] = useState<number>(0);
    // Settings
    const [speed, setSpeed] = useState<number>(speedSettings[0].value);
    const [grid, setGrid] = useState<binaryGrid>(initial);
    // Status
    const [isRunning, setRunning] = useState<boolean>(false);
    const [isDone, setDone] = useState<boolean>(true);
    const [selected, setSelected] = useState<[number, number]>([0, 0]);

    const timer = useRef<number | null>(null);
    const generator = useRef<Generator | null>(null);

    const toggleWall = useCallback(
        (rowIndex: number, colIndex: number) => {
            const newGrid = [...grid];
            newGrid[rowIndex][colIndex].isWall = !newGrid[rowIndex][colIndex].isWall;
            setGrid(newGrid);
        },
        [grid],
    );

    const clearResults = () => {
        setAmount(0);
        setMemory(0);
        setIterations(0);
    };

    const clearStatus = () => {
        setRunning(false);
        setDone(true);
        setSelected([0, 0]);
    };

    const onStep: StepHandler = ({ grid, rowNum, colNum, amount, isMemo, memory }) => {
        grid[colNum][rowNum].paths = amount;

        if (isMemo) {
            grid[colNum][rowNum].memoized = true;
        }
        // why grid updates without explicit setGrid here?
        setMemory(memory);
        setSelected([colNum, rowNum]);
        setGrid(grid);
    };

    const getClearGrid = () => {
        return grid.map(row => {
            return row.map(cell => {
                return {
                    ...cell,
                    paths: 0,
                    memoized: false,
                };
            });
        });
    };

    const handleReset = () => {
        clearResults();
        clearStatus();
        setGrid(createInitialGrid(false));

        if (timer.current) {
            window.clearInterval(timer.current);
        }
    };

    const handleGenerateWalls = () => {
        clearResults();
        clearStatus();
        setGrid(createInitialGrid(true));

        if (timer.current) {
            window.clearInterval(timer.current);
        }
    };

    const handleStart = () => {
        const clearGrid = getClearGrid();
        setGrid(clearGrid);
        generator.current = calculateAllPaths(clearGrid, onStep, () => {
            setIterations(prevIterations => prevIterations + 1);
        });

        setRunning(true);
        setDone(false);
        let res = generator.current.next();

        timer.current = window.setInterval(() => {
            if (res.done) {
                setAmount(res.value);
                setRunning(false);
                setDone(true);
                if (timer.current) {
                    window.clearInterval(timer.current);
                }
            }
            res = generator.current ? generator.current.next() : { done: true, value: null };
        }, speed);
    };

    const handlePause = useCallback(() => {
        if (timer.current) {
            setRunning(false);
            window.clearInterval(timer.current);
        }
    }, []);

    const handleResume = (speed: number) => {
        setRunning(true);
        setDone(false);

        let res = generator.current?.next();

        timer.current = window.setInterval(() => {
            if (res?.done) {
                setAmount(res.value);
                setRunning(false);
                setDone(true);
                if (timer.current) {
                    window.clearInterval(timer.current);
                }
            }
            res = generator.current ? generator.current.next() : { done: true, value: null };
        }, speed);
    };

    const handleSpeedChange = (value: number) => {
        setSpeed(value);
        if (isRunning) {
            handlePause();
            handleResume(value);
        }
    };

    return (
        <div className="root">
            <h1>Count all possible paths from TOP LEFT to BOTTOM RIGHT corner of matrix</h1>
            <div className="description">
                You can only step <b>right</b> and <b>bottom</b>. Avoid walls (black cells).
            </div>
            <h2>Visualization</h2>
            <div className="controls">
                <button
                    className="button primary"
                    onClick={isRunning ? handlePause : isDone ? handleStart : () => handleResume(speed)}
                    style={{ width: 100 }}
                >
                    {isRunning ? 'Pause' : isDone ? 'Start' : 'Resume'}
                </button>
                <button className="button secondary" onClick={handleGenerateWalls}>
                    Generate walls
                </button>
                <button className="button secondary" onClick={handleReset}>
                    Clear walls
                </button>
                <RadioSwitch values={speedSettings} onChange={handleSpeedChange} />
            </div>
            <Grid grid={grid} onCellClick={toggleWall} selected={selected} />
            <div className="results">
                <div className="result">Result: {amount}</div>
                <div className="info">Memoized: {memory}</div>
                <div className="info"> Iterations: {iterations}</div>
            </div>
            <h2>Solution. Recursion with memoization</h2>
            <Code />
        </div>
    );
}

export default App;
