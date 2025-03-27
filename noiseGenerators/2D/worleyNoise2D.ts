// namespace noise {
//     /**
//      * an implementation of perlin noise using the classic permutation table. 
//      * resources:
//      *      https://rtouti.github.io/graphics/perlin-noise-algorithm
//      *      https://en.wikipedia.org/wiki/Perlin_noise
//      */
//     export class WroleyNoise2D /*extends NoiseGenerator*/ implements NoiseGenerator2D {
//         public noise(x: number, y: number): number {
//             const cx = Math.floor(x);
//             const cy = Math.floor(y);
//             const oX = x - cx;
//             const oY = y - cy;

//             // add one to each because of negative direction adjacent cells
//             const hX = Math.floor(x) & 255 + 1;
//             const hY = Math.floor(y) & 255 + 1;

//             let minDist = 4; //impossible for it to be this high. it is at most 1.
//             for (let cox = -1; cox <= 1; cox++) {
//                 for (let coy = -1; coy <= 1; coy++) {
//                     const dist = this.distanceSquared(hX, hY, oX, oY, cox, coy);
//                     if (dist < minDist) {
//                         minDist = dist;
//                     }
//                 }
//             }

//             //#FIXME square root necessary? probably. but test this.
//             return Math.sqrt(minDist);
//         }

//         // p for point, q for mystery point
//         private distanceSquared(hX: number, hY: number, pox: number, poy: number, cox: number, coy: number) {
//             const qox = this.permutationTable[this.permutationTable[hX + cox]] / 255.0;
//             const qoy = this.permutationTable[this.permutationTable[hY + coy]] / 255.0;

//             const dx = qox - pox;
//             const dy = qoy - poy;

//             return (dx * dx) + (dy * dy);
//         }
//     }
// }

