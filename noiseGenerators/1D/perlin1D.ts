// namespace noise {
//     /**
//      * an implementation of perlin noise using the classic permutation table. 
//      * resources:
//      *      https://rtouti.github.io/graphics/perlin-noise-algorithm
//      *      https://en.wikipedia.org/wiki/Perlin_noise
//      */
//     export class PerlinNoise1D /*extends NoiseGenerator*/ implements NoiseGenerator1D {
//         // choice of interpolation function has a large performance effect.
//         public interpolationFunction: InterpolationFunction1D;

//         constructor(seed: number = 0, interpolationFunction: InterpolationFunction1D = interpolate1DCubic) {
//             super(seed);
//             this.interpolationFunction = interpolationFunction;
//         }

//         public noise(x: number): number {
//             let cornerX = Math.floor(x);
//             let offsetX = x - cornerX;

//             const hX = Math.floor(x) & 255;

//             // No dot product called since it's easy in 1D
//             let v0: number = (offsetX - 0) * this.permutationTable[this.permutationTable[hX + 0]];
//             let v1: number = (offsetX - 1) * this.permutationTable[this.permutationTable[hX + 1]];

//             return this.interpolationFunction(v0, v1, offsetX);
//         }


//     }
// }

