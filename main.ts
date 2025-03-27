let myImage = image.create(160, 120)
scene.setBackgroundImage(myImage)
for (let i = 0; i <= 159; i++) {
    for (let j = 0; j <= 119; j++) {
        if (i % 2 == j % 2) {
            myImage.setPixel(i, j, 1)
        } else {
            myImage.setPixel(i, j, 15)
        }
    }
}

let palBufGray: Buffer = hex`000000111111222222333333444444555555666666777777888888999999aaaaaabbbbbbccccccddddddeeeeeeffffff`
let palBufColr: Buffer = hex`0000000000FF0033FF00FFFF00BBAAFFFF44FFCC1100CC0000FF0000AA66888888999999aaaaaabbbbbbddddddffffff`
let palBufDebg: Buffer = hex`0000000000FF0033FF00FFFF00BBAAFFFF44FFCC1100CC0000FF0000AA66888888999999ffaa00ff00ffff0000ffffff`
image.setPalette(palBufGray)

const scalingFactor = 1 / (4 / 30);

let offsetX = 0;
let offsetY = 0;

const ajdFactorA: number = 0.12;
const ajdFactorM: number = 1 - Math.SQRT1_2 - ajdFactorA;
const ajdFactorR: number = 1 / (Math.SQRT2 - 1 + (2 * ajdFactorA));
const maxVal = 0.04;
let freq = 1 / (160 * 2);
function redrawBackground() {
    for (let x = 0; x < 160; x++) {
        for (let y = 0; y < 120; y++) {
            // let val = simpGen.noise(i * zoom, j * zoom);
            // val *= scalingFactor;
            // val += 1;
            // val /= 2;
            // val *= 15;
            // val = Math.ceil(val);

            // val = (val + maxVal) / (2 * maxVal);
            // val = (val - ajdFactorM) * ajdFactorR;
            // val = Math.max(Math.min(Math.round(val * 14) + 1, 15), 1);


            let val = simpGen.noise((x * zoom + offsetX) / 160, (y * zoom + offsetY) / 160);
            // let val = perGen.noise(x * zoom / 160, y * zoom / 160);

            val = (val + 1) / 2;
            val = Math.round(val * 14) + 1;

            myImage.setPixel(x, y, val)
        }
    }
}

pause(500)
game.splash("Simplex noise test...")

let simpGen = new noise.OpenSimplexNoise2D();
let perGen = new noise.PerlinNoise2D(noise.interpolateQuint2);
let zoom = 1;
redrawBackground();

controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    zoom *= 1.2;
    redrawBackground();
})
controller.B.onEvent(ControllerButtonEvent.Pressed, function () {
    zoom /= 1.2;
    redrawBackground();
})

let max = -9999;
let min = 9999;
for (let i = 0; i < 100000; i++) {
    let val = simpGen.noise(i / 1000, i / 1000);
    if (val > max)
        max = val
    if (val < min)
        min = val
}
game.splash("min: " + (min), "max: " + (max));

const movspd = 10;
controller.left.onEvent(ControllerButtonEvent.Pressed, function () {
    offsetX -= zoom * movspd;
    redrawBackground();
})
controller.right.onEvent(ControllerButtonEvent.Pressed, function () {
    offsetX += zoom * movspd;
    redrawBackground();
})
controller.up.onEvent(ControllerButtonEvent.Pressed, function () {
    offsetY -= zoom * movspd;
    redrawBackground();
})
controller.down.onEvent(ControllerButtonEvent.Pressed, function () {
    offsetY += zoom * movspd;
    redrawBackground();
})