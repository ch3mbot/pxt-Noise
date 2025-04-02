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
        private order: WorleyNoise2D.Order;

        constructor(seed: number = 0, cellSize: number = 64, order: WorleyNoise2D.Order) {
            super(seed);
            this.cellSize = cellSize;

            this.maximum = cellSize * cellSize + 1;
            this.order = order
        }

        public noise(x: number, y: number): number {
            const cx = Math.floor(x / this.cellSize);
            const cy = Math.floor(y / this.cellSize);
            const ox = x - (cx * this.cellSize);
            const oy = y - (cy * this.cellSize);

            // add one to each because of negative direction adjacent cells
            const hx = (cx & 255) + 2;
            const hy = (cy & 255) + 2;

            let min1 = this.maximum;
            let min2 = this.maximum;
            let min3 = this.maximum;

            switch (this.order) {
                case 0:
                    let minDist = this.maximum; //impossible for it to be this high. 
                    for (let cox = -1; cox <= 1; cox++) {
                        for (let coy = -1; coy <= 1; coy++) {
                            const dist = this.distanceSquared(hx, hy, ox, oy, cox, coy);
                            if (dist < minDist) {
                                minDist = dist;
                            }
                        }
                    }
        
                    return Math.sqrt(minDist);
                case 1:
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
        
                    return Math.sqrt(min2);
                case 2:
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
        
                    return Math.sqrt(min2);
            }

            throw "impossible state, invalid order"
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

