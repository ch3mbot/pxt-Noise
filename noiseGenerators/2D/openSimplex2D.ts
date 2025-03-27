namespace noise {
    /**
     * an implementation of open simplex noise. 
     * resources:
     *      http://webstaff.itn.liu.se/~stegu/simplexnoise/simplexnoise.pdf (dead but on waybackmachine)
     *      http://weber.itn.liu.se/~stegu/simplexnoise/SimplexNoise.java (dead but on waybackmachine)
     */
    export class OpenSimplexNoise2D /*extends NoiseGenerator*/ implements NoiseGenerator2D {
        private permutationTableMod12: number[];

        protected seed: number;
        protected permutationTable: number[]

        constructor(seed: number = 0) {
            this.reseed(seed);
        }


        // constructor(seed: number = 0) {
        //     super(seed);
        // }

        private regeneratePermutationTableMod12() {
            this.permutationTableMod12 = [];
            for (let i = 0; i < 512; i++) {
                this.permutationTableMod12.push(this.permutationTable[i] % 12);
            }
        }

        //#FIXME test if this still works when the variable type is NoiseGenerator without the override keyword
        public reseed(seed: number = 0) {
            // super.reseed(seed);
            this.seed = seed;
            this.regeneratePermutationTableMod12();
        }

        public noise(x: number, y: number): number {
            let n0: number, n1: number, n2: number; // Noise contributions from the three corners
            // Skew the input space to determine which simplex cell we're in
            let s: number = (x + y) * SKEW_2D; // Hairy factor for 2D
            let i: number = Math.floor(x + s);
            let j: number = Math.floor(y + s);
            let t: number = (i + j) * UNSKEW_2D;
            let X0: number = i - t; // Unskew the cell origin back to (x,y) space
            let Y0: number = j - t;
            let x0: number = x - X0; // The x,y distances from the cell origin
            let y0: number = y - Y0;
            // For the 2D case, the simplex shape is an equilateral triangle.
            // Determine which simplex we are in.
            let i1: number, j1: number; // Offsets for second (middle) corner of simplex in (i,j) coords
            if (x0 > y0) { i1 = 1; j1 = 0; } // lower triangle, XY order: (0,0)->(1,0)->(1,1)
            else { i1 = 0; j1 = 1; }      // upper triangle, YX order: (0,0)->(0,1)->(1,1)
            // A step of (1,0) in (i,j) means a step of (1-c,-c) in (x,y), and
            // a step of (0,1) in (i,j) means a step of (-c,1-c) in (x,y), where
            // c = (3-sqrt(3))/6
            let x1: number = x0 - i1 + UNSKEW_2D; // Offsets for middle corner in (x,y) unskewed coords
            let y1: number = y0 - j1 + UNSKEW_2D;
            let x2: number = x0 - 1.0 + 2.0 * UNSKEW_2D; // Offsets for last corner in (x,y) unskewed coords
            let y2: number = y0 - 1.0 + 2.0 * UNSKEW_2D;
            // Work out the hashed gradient indices of the three simplex corners
            let ii: number = i & 255;
            let jj: number = j & 255;
            let gi0: number = this.permutationTableMod12[ii + this.permutationTable[jj]];
            let gi1: number = this.permutationTableMod12[ii + i1 + this.permutationTable[jj + j1]];
            let gi2: number = this.permutationTableMod12[ii + 1 + this.permutationTable[jj + 1]];
            // Calculate the contribution from the three corners
            let t0: number = 0.5 - x0 * x0 - y0 * y0;
            if (t0 < 0) n0 = 0.0;
            else {
                t0 *= t0;
                n0 = t0 * t0 * gradientDot2D(gi0, x0, y0);
            }
            let t1: number = 0.5 - x1 * x1 - y1 * y1;
            if (t1 < 0) n1 = 0.0;
            else {
                t1 *= t1;
                n1 = t1 * t1 * gradientDot2D(gi1, x1, y1);
            }
            let t2: number = 0.5 - x2 * x2 - y2 * y2;
            if (t2 < 0) n2 = 0.0;
            else {
                t2 *= t2;
                n2 = t2 * t2 * gradientDot2D(gi2, x2, y2);
            }
            // Add contributions from each corner to get the final noise value.
            // The result is scaled to return values in the interval [-1,1].
            return 70.0 * (n0 + n1 + n2);
        }
    }
}
