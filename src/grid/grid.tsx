import React from 'react';
import { binaryGrid } from '../calculate-paths';
import { Cell } from './cell';
import { Row } from './row';

interface GridProps {
    grid: binaryGrid;
    selected: [number, number];
    onCellClick: (rowIndex: number, colIndex: number) => void;
}

export const Grid = ({ grid, onCellClick, selected }: GridProps) => {
    return (
        <div>
            {grid.map((row, rowIndex) => {
                return (
                    <Row key={rowIndex}>
                        {row.map((cell, colIndex) => {
                            return (
                                <Cell
                                    key={colIndex}
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
                    </Row>
                );
            })}
        </div>
    );
};
