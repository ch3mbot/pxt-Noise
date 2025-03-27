namespace noise {
    /**
     * an implementation of perlin noise using the classic permutation table. 
     * resources:
     *      https://rtouti.github.io/graphics/perlin-noise-algorithm
     *      https://en.wikipedia.org/wiki/Perlin_noise
     */
    export class PerlinNoiseHash1D extends NoiseGenerator implements NoiseGenerator1D {
        // choice of interpolation function has a large performance effect.
        public interpolationFunction: InterpolationFunction1D;

        constructor(interpolationFunction: InterpolationFunction1D = interpolate1DCubic, seed: number = 0) {
            super(seed);
            this.interpolationFunction = interpolationFunction;
        }

        public noise(x: number): number {
            let cornerX = Math.floor(x);
            let offsetX = x - cornerX;

            const hX = Math.floor(x) & 255;

            // No dot product called since it's easy in 1D. #FIXME hash function untested
            let v0: number = (offsetX - 0) * hash1(hX + 0, this.seed);
            let v1: number = (offsetX - 1) * hash1(hX + 1, this.seed);

            return this.interpolationFunction(v0, v1, offsetX);
        }
    }
}

