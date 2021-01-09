export type binaryGrid = {
    isWall: boolean;
    paths: number;
    memoized?: boolean;
}[][];

export function calculateAllPaths(
    gridP: binaryGrid,
    stepCallback: (props: {
        rowNum: number;
        colNum: number;
        isBack: boolean;
        amount: number;
        isMemo: boolean;
        memory: number;
    }) => void,
    onStep: VoidFunction,
) {
    const grid = [...gridP];
    const memo: Record<string, number> = {};

    function* step(rowNum: number, colNum: number): Generator {
        if (grid[colNum][rowNum].isWall) {
            return 0;
        }

        onStep();
        // End of path
        if (rowNum === grid[0].length - 1 && colNum === grid.length - 1) {
            yield stepCallback({
                rowNum,
                colNum,
                isBack: true,
                amount: 1,
                isMemo: false,
                memory: Object.keys(memo).length,
            });
            return 1;
        }

        let pathsBottom = 0;
        let pathsRight = 0;

        yield stepCallback({
            rowNum,
            colNum,
            isBack: false,
            amount: 0,
            isMemo: false,
            memory: Object.keys(memo).length,
        });

        // get value from memory
        if (memo[`${rowNum}${colNum}`] !== undefined) {
            yield stepCallback({
                rowNum,
                colNum,
                isBack: true,
                amount: memo[`${rowNum}${colNum}`],
                isMemo: false,
                memory: Object.keys(memo).length,
            });

            return memo[`${rowNum}${colNum}`];
        }

        // Make right step
        if (rowNum < grid[0].length - 1) {
            // @ts-ignore
            pathsRight = yield* step(rowNum + 1, colNum);
        }

        // Make left step
        if (colNum < grid.length - 1) {
            // @ts-ignore
            pathsBottom = yield* step(rowNum, colNum + 1);
        }

        yield stepCallback({
            rowNum,
            colNum,
            isBack: true,
            amount: pathsRight + pathsBottom,
            isMemo: true,
            memory: Object.keys(memo).length,
        });

        // After both steps done sum number of underlying paths (for every sub call)
        memo[`${rowNum}${colNum}`] = pathsRight + pathsBottom;

        // Return that sum to parent call
        return pathsRight + pathsBottom;
    }

    return step(0, 0);
}
