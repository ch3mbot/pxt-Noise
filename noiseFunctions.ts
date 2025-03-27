namespace noise {
    // ================== Permutation Table Functions ====================

    // make a size 512 table from copying the basic permutation table twice
    export function copyPermutationTable(): number[] {
        let table: number[] = [];
        for (let i = 0; i < 512; i++) {
            table.push(PERMUTATION_TABLE[i & 255]);
        }
        return table;
    }

    //#FIXME test this more, but it seems to work.
    // randomly shuffle the permutation table based on a seed. Uses Fisher-Yates shuffle from https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
    export function generatePermutationTable(seed: number = 0): number[] {
        // set up random number gen 
        let rand = new Math.FastRandom(seed);

        // copy table
        let table: number[] = copyPermutationTable();

        // seed of 0 means original permutation table
        if (!seed || seed == 0)
            return table;

        // Fisher-Yates shuffle the first half of the table
        let index = 255;
        for (let i = 0; i < 256; i++) {
            // gen random index then swap
            let swapIndex = rand.randomRange(0, index);
            let temp = table[swapIndex];
            table[swapIndex] = table[index];
            table[index] = temp;
            index--;
        }

        // copy the second half of the table
        for (let i = 256; i < 512; i++) {
            table[i] = table[i & 255];
        }

        return table;
    }


    // ================== Interpolation Functions ====================

    // 1D smooth quintic interpolation. linear is slightly faster.
    export function interpolate1DQuint(a0: number, a1: number, w: number): number {
        // quintic. 6t^5 - 15t^4 + 10t^3 
        return (a1 - a0) * (((w * 6) - 15) * w + 10) * w * w * w + a0;
    }

    // 2D quintic interpolation of 4 corners. 
    export function interpolate2DQuint(a0: number, a1: number, a2: number, a3: number, sx: number, sy: number): number {
        // slightly faster to reimplement rather than call the 1D function.
        const multX = (((sx * 6) - 15) * sx + 10) * sx * sx * sx;
        const i0 = (a1 - a0) * multX + a0;
        const i1 = (a3 - a2) * multX + a2;

        return (i1 - i0) * (((sy * 6) - 15) * sy + 10) * sy * sy * sy + i0;
    }

    // 1D simple cubic interpolation. not that slot but not that smooth.
    export function interpolate1DCubic(a0: number, a1: number, t: number): number {
        // cubic. 3t^2 - 2t^3
        return (a1 - a0) * (3 - (2 * t)) * t * t + a0;
    }

    // 2D cubic interpolation of 4 corners. not that slot but not that smooth.
    export function interpolate2DCubic(a0: number, a1: number, a2: number, a3: number, tx: number, ty: number): number {
        // slightly faster to reimplement rather than call the 1D function.
        const multX = (3 - (2 * tx)) * tx * tx;
        const i0 = (a1 - a0) * multX + a0;
        const i1 = (a1 - a0) * multX + a0;
        return (i1 - i0) * (3 - (2 * ty)) * ty * ty + i0;
    }

    // 1D linear interpolation. fast but not smooth.
    export function interpolate1DLin(a0: number, a1: number, t: number): number {
        return a0 + t * (a1 - a0);
    }

    // 2D linear interpolation of 4 corners. fast but not smooth.
    export function interpolate2DLin(a0: number, a1: number, a2: number, a3: number, tx: number, ty: number): number {
        // slightly faster to reimplement rather than call the 1D function.
        let i0 = a0 + tx * (a1 - a0);
        let i1 = a2 + tx * (a3 - a2);
        return i0 + ty * (i1 - i0);
    }

    // 1D cosine based interpolation. slow and not that smooth.
    export function interpolateCos1D(t0: number, t1: number, alpha: number): number {
        return (t1 - t0) * ((1 - Math.cos(Math.PI * alpha)) / 2) + t0;
    }

    // 2D cosine based interpolation of 4 corners. slow and not that smooth.
    export function interpolateCos2D(t0: number, t1: number, t2: number, t3: number, alphaX: number, alphaY: number): number {
        const multX = ((1 - Math.cos(Math.PI * alphaX)) / 2)
        const i0 = (t1 - t0) * multX + t0;
        const i1 = (t3 - t2) * multX + t2;
        return (i1 - i0) * ((1 - Math.cos(Math.PI * alphaY)) / 2) + i0;
    }

    // ================== Gradient and Dot Product Functions ====================

    // returns the 2D dot product given the index of a gradient, and an x and y
    export function gradientDot2D(gi: number, x: number, y: number): number {
        let ind = gi * 2;
        return GRADS_2D[ind] * x + GRADS_2D[ind + 1] * y;
    }

    // returns the 2D dot product given and X and Y, and a (random?) value. Only uses one of four diagonals for gradient.
    export function gradientDot2DSimple(offsetX: number, offsetY: number, val: number): number {
        let mag = Math.sqrt((offsetX * offsetX) + (offsetY * offsetY) + 0.01) * Math.SQRT2;
        switch (val & 3) {
            case 0:
                return (offsetX + offsetY) / mag;
            case 1:
                return (-offsetX + offsetY) / mag;
            case 2:
                return (offsetX - offsetY) / mag;
            case 3:
                return (-offsetX - offsetY) / mag;
        }

        throw "broke, never go here (gradientDot)"
    }
}