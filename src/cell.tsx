import React, { useCallback, useMemo } from 'react';

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
    const handleClick = useCallback(() => {
        onClick(rowIndex, colIndex);
    }, [rowIndex, colIndex, onClick]);

    const { background, color, borderColor } = useMemo<{
        background: string;
        color: string;
        borderColor?: string;
    }>(() => {
        if (isWall) {
            return { background: '#113344', color: 'white' };
        }

        if (isSelected) {
            return { background: '#ff6600', color: 'white' };
        }

        if (isMemoized) {
            return paths > 0 ? { background: '#40916c', color: 'white' } : { background: '#b9cdc4', color: 'white' };
        }

        return {
            background: 'white',
            color: 'gray',
            borderColor: '#cecece',
        };
    }, [isWall, isSelected, isMemoized, paths]);

    return (
        <div
            key={colIndex}
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '40px',
                height: '40px',
                margin: '2px',
                background,
                color,
                border: `1px solid ${borderColor || background}`,
            }}
            onClick={handleClick}
        >
            {!isWall && <div style={{ fontSize: '11px' }}>{paths || '-'}</div>}
        </div>
    );
};
