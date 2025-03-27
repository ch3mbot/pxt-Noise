namespace noise {
    /**
     * an implementation of perlin noise. 
     * resources:
     *      https://rtouti.github.io/graphics/perlin-noise-algorithm
     *      https://en.wikipedia.org/wiki/Perlin_noise
     */
    export class PerlinNoise2D implements NoiseGenerator2D {
        private interpolationFunction: InterpolationFunction2D;
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

            // const hX = Math.floor(x) % 256;
            // const hY = Math.floor(y) % 256;

            const hX = Math.floor(x) & 255;
            const hY = Math.floor(y) & 255;

            let v1: number = gradientDot(offsetX - 0, offsetY - 0, this.permutationTable[this.permutationTable[hX + 0] + hY + 0]);
            let v2: number = gradientDot(offsetX - 1, offsetY - 0, this.permutationTable[this.permutationTable[hX + 1] + hY + 0]);
            let v3: number = gradientDot(offsetX - 0, offsetY - 1, this.permutationTable[this.permutationTable[hX + 0] + hY + 1]);
            let v4: number = gradientDot(offsetX - 1, offsetY - 1, this.permutationTable[this.permutationTable[hX + 1] + hY + 1]);


            // let v1 = -1;
            // let v2 = -0.25;
            // let v3 = 0.25;
            // let v4 = 1;

            return this.interpolationFunction(v1, v2, v3, v4, offsetX, offsetY);
        }

        public reseed(seed?: number) {
            if (!seed || seed == 0) {
                this.permutationTable = copyPermutationTable();
                return;
            }

            this.permutationTable = generatePermutationTable(seed);
        }
    }
}

