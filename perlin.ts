namespace noise {
    /**
     * an implementation of perlin noise using the classic permutation table. 
     * resources:
     *      https://rtouti.github.io/graphics/perlin-noise-algorithm
     *      https://en.wikipedia.org/wiki/Perlin_noise
     */
    export class PerlinNoise2D implements NoiseGenerator2D {
        public interpolationFunction: InterpolationFunction2D;
        private permutationTable: number[];

        constructor(interpolationFunction: InterpolationFunction2D, seed?: number) {
            this.reseed(seed);
            this.interpolationFunction = interpolationFunction;
        }

        public noise(x: number, y: number): number {
            let cornerX = Math.floor(x);
            let cornerY = Math.floor(y);
            let offsetX = x - cornerX;
            let offsetY = y - cornerY;

            const hX = Math.floor(x) & 255;
            const hY = Math.floor(y) & 255;

            let v0: number = gradientDot(offsetX - 0, offsetY - 0, this.permutationTable[this.permutationTable[hX + 0] + hY + 0]);
            let v1: number = gradientDot(offsetX - 1, offsetY - 0, this.permutationTable[this.permutationTable[hX + 1] + hY + 0]);
            let v2: number = gradientDot(offsetX - 0, offsetY - 1, this.permutationTable[this.permutationTable[hX + 0] + hY + 1]);
            let v3: number = gradientDot(offsetX - 1, offsetY - 1, this.permutationTable[this.permutationTable[hX + 1] + hY + 1]);

            return this.interpolationFunction(v0, v1, v2, v3, offsetX, offsetY);
        }

        public reseed(seed?: number) {
            if (!seed || seed == 0) {
                this.permutationTable = copyPermutationTable();
                return;
            }

            this.permutationTable = generatePermutationTable(seed);
        }
    }

    // noise functions used only by this class
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
}

