namespace noise {
    /**
     * an implementation of perlin noise using a hash function instead of a permutation table. 
     * resources:
     *      https://rtouti.github.io/graphics/perlin-noise-algorithm
     *      https://en.wikipedia.org/wiki/Perlin_noise
     */
    export class PerlinNoiseHash2D extends NoiseGenerator implements NoiseGenerator2D {
        // choice of interpolation function has a large performance effect.
        public interpolationFunction: InterpolationFunction2D;

        constructor(interpolationFunction: InterpolationFunction2D = interpolateCubic2, seed: number = 0) {
            super(seed);
            this.interpolationFunction = interpolationFunction;
        }

        public noise(x: number, y: number): number {
            let cornerX = Math.floor(x);
            let cornerY = Math.floor(y);
            let offsetX = x - cornerX;
            let offsetY = y - cornerY;

            let v0: number = gradientDot2DSimple(offsetX - 0, offsetY - 0, hash2(cornerX + 0, cornerY + 0, this.seed));
            let v1: number = gradientDot2DSimple(offsetX - 1, offsetY - 0, hash2(cornerX + 1, cornerY + 0, this.seed));
            let v2: number = gradientDot2DSimple(offsetX - 0, offsetY - 1, hash2(cornerX + 0, cornerY + 1, this.seed));
            let v3: number = gradientDot2DSimple(offsetX - 1, offsetY - 1, hash2(cornerX + 1, cornerY + 1, this.seed));

            return this.interpolationFunction(v0, v1, v2, v3, offsetX, offsetY);
        }

        public reseed(seed: number = 0) {
            this.seed = seed;
        }
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
}

