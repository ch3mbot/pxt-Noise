namespace noise {
    /**
     * an implementation of perlin noise using the classic permutation table. 
     * resources:
     *      https://rtouti.github.io/graphics/perlin-noise-algorithm
     *      https://en.wikipedia.org/wiki/Perlin_noise
     */
    export class PerlinNoise2D /*extends NoiseGenerator*/ implements NoiseGenerator2D {
        // choice of interpolation function has a large performance effect.
        public interpolationFunction: InterpolationFunction2D;
       
        protected seed: number;
        protected permutationTable: number[]

        constructor(seed: number = 0, interpolationFunction: InterpolationFunction2D = interpolate2DCubic) {
            // super(seed);
            this.reseed(seed);
            this.interpolationFunction = interpolationFunction;
        }

        //#FIXME test if this still works when the variable type is NoiseGenerator without the override keyword
        public reseed(seed: number = 0) {
            // super.reseed(seed);
            this.seed = seed;
            this.permutationTable = generatePermutationTable(seed);
        }

        public noise(x: number, y: number): number {
            let cornerX = Math.floor(x);
            let cornerY = Math.floor(y);
            let offsetX = x - cornerX;
            let offsetY = y - cornerY;

            const hX = Math.floor(x) & 255;
            const hY = Math.floor(y) & 255;

            let v0: number = gradientDot2DSimple(offsetX - 0, offsetY - 0, this.permutationTable[this.permutationTable[hX + 0] + hY + 0]);
            let v1: number = gradientDot2DSimple(offsetX - 1, offsetY - 0, this.permutationTable[this.permutationTable[hX + 1] + hY + 0]);
            let v2: number = gradientDot2DSimple(offsetX - 0, offsetY - 1, this.permutationTable[this.permutationTable[hX + 0] + hY + 1]);
            let v3: number = gradientDot2DSimple(offsetX - 1, offsetY - 1, this.permutationTable[this.permutationTable[hX + 1] + hY + 1]);

            return this.interpolationFunction(v0, v1, v2, v3, offsetX, offsetY);
        }
    }
}

