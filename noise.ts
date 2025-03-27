namespace noise {
    // make a size 512 table from copying the permutation table twice
    export function copyPermutationTable(): number[] {
        let table: number[] = [];
        for (let i = 0; i < 512; i++) {
            table.push(PERMUTATION_TABLE[i & 255]);
        }
        return table;
    }

    //#FIXME test this more, but it seems to work.
    export function generatePermutationTable(seed?: number): number[] {
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
            table[i] = table[i - 255];
        }

        return table;
    }

    export interface NoiseGenerator2D {
        noise(x: number, y: number): number;
    }

    // mysterious 2d hash function. little performance effect.
    const m = 0x5bd1e995;
    export function hash2(x: number, y: number, seed: number) {
        let hash = seed;

        // process first vector element
        let k = x;
        k *= m;
        k ^= k >> 24;
        k *= m;
        hash *= m;
        hash ^= k;

        // process second vector element
        k = y;
        k *= m;
        k ^= k >> 24;
        k *= m;
        hash *= m;
        hash ^= k;

        // some final mixing
        hash ^= hash >> 13;
        hash *= m;
        hash ^= hash >> 15;

        return hash;
    }

    // skip the middle man and return the dot product of offset, since gradient's are known
    export function gradientDot(offsetX: number, offsetY: number, val: number): number {
        let mag = Math.sqrt((offsetX * offsetX) + (offsetY * offsetY) + 0.01) * Math.SQRT2;
        // let mag = Math.sqrt((offsetX * offsetX) + (offsetY * offsetY)) * Math.SQRT2;
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

    // 1d smooth quintic interpolation. linear saves about 10ms.
    export function interpolateQuint1(a0: number, a1: number, w: number): number {
        // quintic. 6t^5 - 15t^4 + 10t^3 
        return (a1 - a0) * (((w * 6) - 15) * w + 10) * w * w * w + a0;
    }

    // quintic interpolation of 4 corners. large performance effect.
    export function interpolateQuint2(a0: number, a1: number, a2: number, a3: number, sx: number, sy: number): number {
        // slightly faster to reimplement rather than call the 1D function.
        const mult_sx = (((sx * 6) - 15) * sx + 10) * sx * sx * sx;
        const i0 = (a1 - a0) * mult_sx + a0;
        const i1 = (a3 - a2) * mult_sx + a2;

        return (i1 - i0) * (((sy * 6) - 15) * sy + 10) * sy * sy * sy + i0;
    }

    export function interpolateCubic1(a0: number, a1: number, t: number): number {
        // cubic. 3t^2 - 2t^3
        return (a1 - a0) * (3 - (2 * t)) * t * t + a0;
    }
    export function interpolateCubic2(a0: number, a1: number, a2: number, a3: number, tx: number, ty: number): number {
        const mult_tx = (3 - (2 * tx)) * tx * tx;
        const i0 = (a1 - a0) * mult_tx + a0;
        const i1 = (a1 - a0) * mult_tx + a0;
        return (i1 - i0) * (3 - (2 * ty)) * ty * ty + i0;
    }

    // 1d linear interpolation. 
    export function interpolateLin1(a0: number, a1: number, t: number): number {
        return a0 + t * (a1 - a0);
    }

    // linear interpolation of 4 corners. large performance effect.
    export function interpolateLin2(a0: number, a1: number, a2: number, a3: number, tx: number, ty: number): number {
        let i0 = a0 + tx * (a1 - a0);
        let i1 = a2 + tx * (a3 - a2);
        return i0 + ty * (i1 - i0);
    }

    // clamps a number between min and max
    export function clamp(val: number, min: number, max: number): number {
        return Math.max(min, Math.min(val, max));
    }

    // clamps between -1 and 1
    export function clampNoise(noise: number): number {
        return Math.max(-1, Math.min(noise, 1));
    }

}