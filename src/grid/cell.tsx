import React, { useMemo } from 'react';

import styles from './cell.module.css';

interface CellProps {
    isSelected: boolean;
    isMemoized: boolean;
    isWall: boolean;
    paths: number;
    rowIndex: number;
    colIndex: number;
    onClick: (rowIndex: number, colIndex: number) => void;
}

export const Cell = ({ rowIndex, colIndex, onClick, isSelected, isMemoized, isWall, paths }: CellProps) => {
    const handleClick = () => {
        onClick(rowIndex, colIndex);
    };

    const { background, color, borderColor } = useMemo<{
        background?: string;
        color?: string;
        borderColor?: string;
    }>(() => {
        if (isWall) {
            return { background: '#113344' };
        }

        if (isSelected) {
            return { background: '#ff6600' };
        }

        if (isMemoized) {
            return paths > 0 ? { background: '#40916c' } : { background: '#b9cdc4' };
        }

        return {
            color: '#666',
            borderColor: '#cecece',
        };
    }, [isWall, isSelected, isMemoized, paths]);

    return (
        <div
            className={styles.cell}
            style={{
                background,
                color,
                borderColor: borderColor || background,
            }}
            onClick={handleClick}
        >
            {!isWall && <div>{paths || '-'}</div>}
        </div>
    );
};
