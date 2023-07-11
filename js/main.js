// import * as bit from "bitecs";
// import Box2DFactory from "box2d-wasm";

// const box2d = await Box2DFactory();

/**
 * @type {HTMLCanvasElement}
 */
const canvas = document.getElementById("screen");

canvas.width = document.body.clientWidth;
canvas.height = document.body.clientHeight;

const ctx = canvas.getContext("2d");

const mouse = {
    x: 0,
    y: 0,
    influence: 40
};

canvas.addEventListener("mousedown", ev => mouse.influence = Math.max(mouse.influence + 1, 80));
canvas.addEventListener("mouseup", ev => mouse.influence = Math.min(mouse.influence - 1, 40));

canvas.addEventListener("mousemove", ev => {
    mouse.x = ev.clientX;
    mouse.y = ev.clientY;
});

class Particle {
    /**
     * @param {number} x 
     * @param {number} y 
     * @param {number} dx 
     * @param {number} dy
     * @param {number} radius 
     * @param {string} colour 
     */
    constructor(x, y, dx, dy, radius, colour) {
        this.x = x;
        this.y = y;
        this.dx = dx; 
        this.dy = dy;
        this.radius = radius;
        this.colour = colour;
    }

    draw() {
        ctx.beginPath();
        ctx.fillStyle = this.colour;
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();
    }

    accelToPoint(x, y) {
        const ddx = (x - this.x) / 500;
        const ddy = (y - this.y) / 500;

        this.dx += ddx;
        this.dy += ddy;
    }

    update() {
        // this.accelToPoint(mouse.x, mouse.y);

        if (this.x + this.radius >= canvas.width || this.x - this.radius <= 0) {
            this.dx = -this.dx;
        }
        if (this.y + this.radius >= canvas.height || this.y - this.radius <= 0) {
            this.dy = -this.dy;
        }
        if (dist(this.x, this.y, mouse.x, mouse.y) <= this.radius + mouse.influence && this.radius <= MIN_RADIUS + 20) { this.radius += 1; }
        else if (this.radius >= MIN_RADIUS) { this.radius -= 1; }

        this.x += this.dx;
        this.y += this.dy;
        this.draw();
    }
}

/**
 * Returns a random integer in the range, [min, max]
 * @type {(min: number, max: number) => number} */
const randint = (min, max) => Math.floor(Math.random() * (max - min) + min);
/**
 * Returns a random integer in the range, [min, max)
 * @type {(min: number, max: number) => number} */
const rand = (min, max) => Math.random() * (max - min) + min;

const dist = (x1, y1, x2, y2) => Math.hypot(x1 - x2, y1 - y2);

const MIN_RADIUS = 10;

const COLOURS = ["#FB5322", "#D72EA3", "#8770EA", "#62D7CF", "#C1FB65"];

/**@type {Particle[]} */
const particles = Array.from({ length: 40 }, () => { 
    // const radius = randint(MIN_RADIUS, MIN_RADIUS + 20);
    const radius = 10;
    return new Particle(
        randint(radius, canvas.width - radius),
        randint(radius, canvas.height - radius),
        rand(1, 6) / 2,
        rand(1, 6) / 2,
        radius,
        COLOURS[randint(0, COLOURS.length - 1)]
        //`lch(${randint(0, 100)} ${randint(0, 150)} ${randint(0, 360)}deg)`
    )}
);

function animate() {
    requestAnimationFrame(animate.bind(null));
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
    }
    // ctx.beginPath();
    // ctx.fillStyle = "rgba(255, 0, 0, 0.1)";
    // ctx.arc(mouse.x, mouse.y, mouse.influence, 0, 2 * Math.PI);
    // ctx.fill();
    // ctx.closePath();
}

animate();
