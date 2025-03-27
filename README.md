 


> Open this page at [https://ch3mbot.github.io/pxt-noise/](https://ch3mbot.github.io/pxt-noise/)

## Description

This extension adds several noise generators. 
Currently only javascript is supported.

## Noise Generators

### 1D
- 1D Perlin noise
- 1D Perlin noise with hash function

### 2D
- 2D Perlin noise
- 2D Perlin noise with hash function
- 2D open simplex noise

## Usage
How to initialize a noise generator and sample it:
```typescript
let generator = new noise.OpenSimplexNoise2D();
let value = generator.noise(x, y);
```
The default seed is 0. When seed is set to 0 the default permutation table is used. 
<br />
How to initialize a noise generator with a seed:
```typescript
let generator = new noise.PerlinNoise1D(12345);
```
<br />
The perlin noise generators can optionally be given an interpolation function:
```typescript
let generator = new noise.PerlinNoise2D(0, noise.interpolate2DQuint);
```
The default is cubic interpolation. 
quintic is slower but smoother, while linear is fast but jagged.

## Use as Extension

This repository can be added as an **extension** in MakeCode.

* open [https://arcade.makecode.com/](https://arcade.makecode.com/)
* click on **New Project**
* click on **Extensions** under the gearwheel menu
* search for **https://github.com/ch3mbot/pxt-noise** and import

## Edit this project

To edit this repository in MakeCode.

* open [https://arcade.makecode.com/](https://arcade.makecode.com/)
* click on **Import** then click on **Import URL**
* paste **https://github.com/ch3mbot/pxt-noise** and click import

## TODO
- 3D noise
- 4D noise?
- Test 1D Perlin noise with hash function
- 2D worley noise

#### Metadata (used for search, rendering)

* for PXT/arcade
<script src="https://makecode.com/gh-pages-embed.js"></script><script>makeCodeRender("{{ site.makecode.home_url }}", "{{ site.github.owner_name }}/{{ site.github.repository_name }}");</script>
