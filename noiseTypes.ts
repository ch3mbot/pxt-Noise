// Types and base classes for different noise algorithms
namespace noise {
    export interface NoiseGenerator2D {
        noise(x: number, y: number): number;
    }

    export type NoiseFunction1D = (seed: number, x: number) => number; // #UNUSED
    export type NoiseFunction2D = (seed: number, x: number, y: number) => number;
    export type NoiseFunction3D = (seed: number, x: number, y: number, z: number) => number; // #UNUSED
    export type NoiseFunction4D = (seed: number, w: number, x: number, y: number, z: number) => number; // #UNUSED

    export type InterpolationFunction1D = (a0: number, a1: number, t: number) => number;
    export type InterpolationFunction2D = (a0: number, a1: number, a2: number, a3: number, tx: number, ty: number) => number;
    export type InterpolationFunction3D = (
        a0: number, a1: number, a2: number, a3: number,
        a4: number, a5: number, a6: number, a7: number,
        tx: number, ty: number, tz: number) => number;
    export type InterpolationFunction4D = (
         a0: number,  a1: number,  a2: number,  a3: number,
         a4: number,  a5: number,  a6: number,  a7: number,
         a8: number,  a9: number, a10: number, a11: number,
        a12: number, a13: number, a14: number, a15: number,
        tw: number, tx: number, ty: number, tz: number) => number;

}