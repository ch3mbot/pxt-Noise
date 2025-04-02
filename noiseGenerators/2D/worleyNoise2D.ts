namespace noise {
    /**
     * an implementation of perlin noise using the classic permutation table. 
     * resources:
     *      https://rtouti.github.io/graphics/perlin-noise-algorithm
     *      https://en.wikipedia.org/wiki/Perlin_noise
     */
    export class WorleyNoise2D extends NoiseGenerator implements NoiseGenerator2D {
        public cellSize: number;

        private maximum: number;
        private noiseFunction: (hX: number, hY: number, oX: number, oY: number) => number;

        constructor(seed: number = 0, cellSize: number = 64, order: WorleyNoise2D.Order) {
            super(seed);
            this.cellSize = cellSize;

            this.maximum = cellSize * cellSize + 1;
            this.setOrder(order);
        }

        public setOrder(order: WorleyNoise2D.Order) {
            switch (order) {
                case 0:
                    this.noiseFunction = (hX: number, hY: number, oX: number, oY: number) => this.firstOrderNoise(hX, hY, oX, oY);
                    break;
                case 1:
                    this.noiseFunction = (hX: number, hY: number, oX: number, oY: number) => this.secondOrderNoise(hX, hY, oX, oY);
                    break;
                case 2:
                    this.noiseFunction = (hX: number, hY: number, oX: number, oY: number) => this.thirdOrderNoise(hX, hY, oX, oY);
                    break;
            }
        }

        public noise(x: number, y: number): number {
            const cx = Math.floor(x / this.cellSize);
            const cy = Math.floor(y / this.cellSize);
            const ox = x - (cx * this.cellSize);
            const oy = y - (cy * this.cellSize);

            // add one to each because of negative direction adjacent cells
            const hx = (cx & 255) + 2;
            const hy = (cy & 255) + 2;

            return this.noiseFunction(hx, hy, ox, oy)
        }

        private firstOrderNoise(hx: number, hy: number, ox: number, oy: number): number {
            let minDist = this.maximum; //impossible for it to be this high. 
            for (let cox = -1; cox <= 1; cox++) {
                for (let coy = -1; coy <= 1; coy++) {
                    const dist = this.distanceSquared(hx, hy, ox, oy, cox, coy);
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

        private secondOrderNoise(hx: number, hy: number, ox: number, oy: number): number {
            let min1 = 99999;
            let min2 = min1;
            for (let cox = -1; cox <= 1; cox++) {
                for (let coy = -1; coy <= 1; coy++) {
                    const dist = this.distanceSquared(hx, hy, ox, oy, cox, coy);
                    if (dist < min1) {
                        min2 = min1;
                        min1 = dist;
                    } else if (dist < min2) {
                        min2 = dist;
                    }
                }
            }

            return (Math.sqrt(min2) * 2) - 1;
        }

        private thirdOrderNoise(hx: number, hy: number, ox: number, oy: number): number {
            let min1 = 99999;
            let min2 = min1;
            let min3 = min2;
            for (let cox = -1; cox <= 1; cox++) {
                for (let coy = -1; coy <= 1; coy++) {
                    const dist = this.distanceSquared(hx, hy, ox, oy, cox, coy);
                    if (dist < min1) {
                        min3 = min2;
                        min2 = min1;
                        min1 = dist;
                    } else if (dist < min2) {
                        min3 = min2;
                        min2 = dist;
                    } else if (dist < min3) {
                        min3 = dist;
                    }
                }
            }

            return (Math.sqrt(min2) * 2) - 1;
        }

        // p for point, q for mystery point
        private distanceSquared(hX: number, hY: number, pox: number, poy: number, cox: number, coy: number) {
            // const qox = this.permutationTable[this.permutationTable[hX + cox]] / 255.0;
            // const qoy = this.permutationTable[this.permutationTable[hY + coy]] / 255.0;

            const qox = (hash2(hX + cox, hY + coy, this.seed) & 255) / 256.0;
            const qoy = (hash2(hY + coy, -hX - cox, this.seed) & 255) / 256.0;

            // const qox = 0.5;
            // const qoy = 0.5;

            // console.log("qox: " + qox + ", qoy: " + qoy + ", index: " + (hX + cox));

            // const dx = (pox - (cox * WroleyNoise2D.cellSize) - (qox * WroleyNoise2D.cellSize)) / WroleyNoise2D.cellSize
            // const dy = (poy - (coy * WroleyNoise2D.cellSize) - (qoy * WroleyNoise2D.cellSize)) / WroleyNoise2D.cellSize

            const dx = (pox - (qox + cox) * this.cellSize) / this.cellSize;
            const dy = (poy - (qoy + coy) * this.cellSize) / this.cellSize;

            // if (((dx * dx) < 0.01) && ((dy * dy) < 0.01))
            //     return -1;

            return ((dx * dx) + (dy * dy));
        }
    }

    export namespace WorleyNoise2D {
        export enum Order {
            first,
            second,
            third
        }
    }
}

