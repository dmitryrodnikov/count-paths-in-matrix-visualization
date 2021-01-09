import React from 'react';
import { binaryGrid } from './calculate-paths';
import { Cell } from './cell';

interface GridProps {
    grid: binaryGrid;
    selected: [number, number];
    onCellClick: (rowIndex: number, colIndex: number) => void;
}

export const Grid = ({ grid, onCellClick, selected }: GridProps) => {
    return (
        <>
            {grid.map((row, rowIndex) => {
                return (
                    <div key={rowIndex} style={{ display: 'flex' }}>
                        {row.map((cell, colIndex) => {
                            return (
                                <Cell
                                    onClick={onCellClick}
                                    rowIndex={rowIndex}
                                    colIndex={colIndex}
                                    isWall={cell.isWall}
                                    isMemoized={cell.memoized || false}
                                    isSelected={selected[0] === rowIndex && selected[1] === colIndex}
                                    paths={cell.paths}
                                />
                            );
                        })}
                    </div>
                );
            })}
        </>
    );
};
