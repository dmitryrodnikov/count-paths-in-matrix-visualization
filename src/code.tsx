import SyntaxHighlighter from 'react-syntax-highlighter';
import { lioshi } from 'react-syntax-highlighter/dist/esm/styles/hljs';

const code = `function calculateAllPaths(matrix) {
    const memo = {};

    function step(row, col) {
        if (matrix[row][col].isWall) {
            return 0;
        }

        if (col === matrix[0].length - 1 && row === matrix.length - 1) {
            return 1;
        }

        let pathsBottom = 0;
        let pathsRight = 0;

        if (memo['' + row + col] !== undefined) {
            return memo['' + row + col];
        }

        if (col < matrix[0].length - 1) {
            pathsRight = step(row, col + 1);
        }

        if (row < matrix.length - 1) {
            pathsBottom = step(row + 1, col);
        }

        memo['' + row + col] = pathsRight + pathsBottom;

        return pathsRight + pathsBottom;
    }

    return step(0, 0);
}`;

export const Code = () => {
    return (
        <SyntaxHighlighter language="javascript" style={lioshi}>
            {code}
        </SyntaxHighlighter>
    );
};
