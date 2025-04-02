// image setup
let backgroundImage = image.create(160, 120)
scene.setBackgroundImage(backgroundImage)

// color options
let palBufGray: Buffer = hex`000000111111222222333333444444555555666666777777888888999999aaaaaabbbbbbccccccddddddeeeeeeffffff`
let palBufColr: Buffer = hex`0000000000FF0033FF00FFFF00BBAAFFFF44FFCC1100CC0000FF0000AA66888888999999aaaaaabbbbbbddddddffffff`
let palBufCol2: Buffer = hex`0000000000FF0033FF37778F00BBAAFFFF44FFCC1100CC0000FF0000AA66888888999999aaaaaabbbbbbddddddffffff`
let palBufDebg: Buffer = hex`0000000000FF0033FF00FFFF00BBAAFFFF44FFCC1100CC0000FF0000AA66888888999999ffaa00ff00ffff0000ffffff`
image.setPalette(palBufCol2)

// noise gens
let simpGen = new noise.OpenSimplexNoise2D();
let perGen = new noise.PerlinNoise2D(0, noise.interpolate2DQuint);
let perHash = new noise.PerlinNoiseHash2D(0, noise.interpolate2DQuint);
let worlGen = new noise.WorleyNoise2D(0, 64, 2);

let useSimplex = false;

// 'camera' state
let zoom = 4;
let offsetX = 0;
let offsetY = 0;

let octaves = 4;
function redrawBackground() {
    for (let x = 0; x < 160; x++) {
        for (let y = 0; y < 120; y++) {
            let val = 0;
            let currFreq = 1;
            let currAmp = 1;
            if (useSimplex)
                for (let i = 0; i < octaves; i++) {
                    val += simpGen.noise((x * zoom + offsetX) * currFreq / 160, (y * zoom + offsetY) * currFreq / 160) * currAmp;

                    currFreq *= 2;
                    currAmp /= 2;
                }
            else
                // val += perGen.noise((x * zoom + offsetX) * currFreq / 160, (y * zoom + offsetY) * currFreq / 160) * currAmp;
                val += worlGen.noise((x * zoom + offsetX) * currFreq / 160, (y * zoom + offsetY) * currFreq / 160) * currAmp;

            val = noise.clamp(val);

            val = ((val / 1.189) + 1) / 2;
            val = Math.round(val * 14) + 1;

            backgroundImage.setPixel(x, y, val)
        }
    }
}

game.splash("Noise test")
game.splash("A to zoom in", "B to zoom out")
game.splash("D pad to move around", "Menu to change noise type")
redrawBackground();

// zooming in and out
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    zoom /= 1.2;
    redrawBackground();
})
controller.B.onEvent(ControllerButtonEvent.Pressed, function () {
    zoom *= 1.2;
    redrawBackground();
})

// noise swapping
controller.menu.onEvent(ControllerButtonEvent.Pressed, function () {
    useSimplex = !useSimplex;
    redrawBackground();
    game.splash("Noise type swapped", "to " + (useSimplex ? "simplex" : "worley") + " noise.");
});

// 'camera' panning
const moveSpeed = 10;
controller.left.onEvent(ControllerButtonEvent.Pressed, function () {
    offsetX -= zoom * moveSpeed;
    redrawBackground();
})
controller.right.onEvent(ControllerButtonEvent.Pressed, function () {
    offsetX += zoom * moveSpeed;
    redrawBackground();
})
controller.up.onEvent(ControllerButtonEvent.Pressed, function () {
    offsetY -= zoom * moveSpeed;
    redrawBackground();
})
controller.down.onEvent(ControllerButtonEvent.Pressed, function () {
    offsetY += zoom * moveSpeed;
    redrawBackground();
})

// Code to test hash vs regular perlin noise
forever(function () {
    if (controller.A.isPressed() && controller.B.isPressed()) {
        game.splash("doing range test...");
        let min = 9999;
        let max = -9999;
        for (let i = 0; i < 100 * 1000; i++) {
            let val = simpGen.noise(i / 123.4, i / 123.4);
            if (val > max)
                max = val
            if (val < min)
                min = val
        }
        game.splash("min: " + min, "max: " + max);

        game.splash("testing regular vs", " hash perlin noise");
        const trials = 100;
        const iterations = 1000;
        let totals = [0, 0]
        for (let t = 0; t < trials; t++) {
            let randX = randint(-100 * 1000, 100 * 1000) / 1000.0;
            let randY = randint(-100 * 1000, 100 * 1000) / 1000.0;
            let start = control.millis();
            for (let i = 0; i < iterations; i++) {
                perGen.noise(randX, randY);
            }
            let mid = control.millis();
            for (let i = 0; i < iterations; i++) {
                perHash.noise(randX, randY);
            }
            let end = control.millis();

            totals[0] += mid - start;
            totals[1] += end - mid;

            // pause for a sec to hopefully reset/gc. #FIXME does this even work?
            pause(1);
        }
        game.splash("perm: " + totals[0] + " ms", "hash: " + totals[1] + " ms")
    }
})