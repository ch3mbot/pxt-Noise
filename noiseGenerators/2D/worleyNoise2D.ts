namespace noise {
    /**
     * an implementation of perlin noise using the classic permutation table. 
     * resources:
     *      https://rtouti.github.io/graphics/perlin-noise-algorithm
     *      https://en.wikipedia.org/wiki/Perlin_noise
     */
    export class WroleyNoise2D extends NoiseGenerator implements NoiseGenerator2D {
        public static cellSize = 64;

        public noise(x: number, y: number): number {
            const cx = Math.floor(x / WroleyNoise2D.cellSize);
            const cy = Math.floor(y / WroleyNoise2D.cellSize);
            const oX = x - (cx * WroleyNoise2D.cellSize);
            const oY = y - (cy * WroleyNoise2D.cellSize);

            // add one to each because of negative direction adjacent cells
            const hX = (cx & 255) + 2;
            const hY = (cy & 255) + 2;

            let minDist = 64 * 64 * 2 * 999; //impossible for it to be this high. 
            for (let cox = -2; cox <= 2; cox++) {
                for (let coy = -2; coy <= 2; coy++) {
                    const dist = this.distanceSquared(hX, hY, oX, oY, cox, coy);
                    if (dist < minDist) {
                        minDist = dist;
                    }
                }
            }

            let val = Math.sqrt(minDist);
            val *= 2;
            val -= 1
            return val;
        }

        // p for point, q for mystery point
        private distanceSquared(hX: number, hY: number, pox: number, poy: number, cox: number, coy: number) {
            // const qox = this.permutationTable[this.permutationTable[hX + cox]] / 255.0;
            // const qoy = this.permutationTable[this.permutationTable[hY + coy]] / 255.0;

            const qox = (hash1(hX + cox, this.seed) & 255) / 128;
            const qoy = (hash1(hY + coy, this.seed) & 255) / 128;

            // const qox = 0.5;
            // const qoy = 0.5;

            // console.log("qox: " + qox + ", qoy: " + qoy + ", index: " + (hX + cox));

            // const dx = (pox - (cox * WroleyNoise2D.cellSize) - (qox * WroleyNoise2D.cellSize)) / WroleyNoise2D.cellSize
            // const dy = (poy - (coy * WroleyNoise2D.cellSize) - (qoy * WroleyNoise2D.cellSize)) / WroleyNoise2D.cellSize

            const dx = (pox - (qox + cox) * WroleyNoise2D.cellSize) / WroleyNoise2D.cellSize;
            const dy = (poy - (qoy + coy) * WroleyNoise2D.cellSize) / WroleyNoise2D.cellSize;

            // if (((dx * dx) < 0.01) && ((dy * dy) < 0.01))
            //     return -1;

            return ((dx * dx) + (dy * dy));
        }
    }
}

