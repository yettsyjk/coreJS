const canvas = document.getElementById("myCanvas");
const context = canvas.getContext("2d");
canvas.width = 400;
canvas.height = 450;

let frames = 0;
let foodToEat = false;
const direction = {
    current: 0,
    idle: 0,
    right: 1,
    down: 2,
    left: 3,
    up: 4
};

document.addEventListener("keydown", function (e) {
    switch (e.keyCode) {
        case 37://move left
            if (direction.current != direction.left && direction.current != direction.right) {
                direction.current = direction.left;
            }
            break;
        case 38://move up
            if (direction.current != direction.up && direction.current != direction.down) {
                direction.current = direction.up;
            }
            break;
        case 39://move right
            if (direction.current != direction.right && direction.current != direction.left) {
                direction.current = direction.right;
            }
            break;
        case 40://move down
            if (direction.current != direction.down && direction.current != direction.up) {
                direction.current = direction.down;
            }
            break;
    }
});

function getDistance(pointX1, pointY1, pointX2, pointY2) {


    let distanceX = pointX2 - pointX1;
    let distanceY = pointY2 - pointY1;
    return Math.sqrt(Math.pow(distanceX, 2) + Math.pow(distanceY, 2));
};

const food = {
    x: canvas.width / 4,
    y: canvas.height / 4,
    radius: 10,

    draw: function () {
        context.beginPath();
        context.fillStyle = "blue";
        context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        context.fill();
        context.closePath();
    }
};

const snake = {
    snakeRadius: 10,
    position: [{
        x: canvas.width / 2,
        y: canvas.height / 2
    }],
    draw: function () {
        context.fillStyle = "pink";
        for (let i = 0; i < this.position.length; i++) {
            let p = this.position[i];
            context.beginPath();
            context.arc(p.x, p.y, this.snakeRadius, 0, 2 * Math.PI);
            context.fill();
            context.closePath();
        }
    },
    update: function () {
        if (frames % 6 === 0) {
            if (foodToEat === true) {
                this.position.push({
                    x: this.position[this.position.length - 1].x,
                    y: this.position[this.position.length - 1].y
                });
                foodToEat = false;
            }
            //logic on position
            if (this.position[0].x < 0) {
                this.position[0].x = canvas.width - 10;
            }
            if (this.position[0].x > canvas.width) {
                this.position[0].x = 10;
            }
            if (this.position[0].y < 0) {
                this.position[0].y = canvas.height - 10;
            }
            if (this.position[0].y > canvas.height) {
                this.position[0].y = 10;
            }
            for (let i = this.position.length - 1; i > 0; i--) {
                if (this.position[0].x === this.position[i].x &&
                    this.position[0].y === this.position[i].y &&
                    this.position.length > 2) {
                    this.position.splice(1);
                    break;
                }
                this.position[i].x = this.position[i - 1].x;
                this.position[i].y = this.position[i - 1].y;
            }
            if (direction.current === direction.right) {
                this.position[0].x += 20;
            }
            if (direction.current === direction.left) {
                this.position[0].x -= 20;
            }
            if (direction.current === direction.up) {
                this.position[0].y -= 20;
            }
            if (direction.current === direction.down) {
                this.position[0].y += 20;
            };
            if (getDistance(food.x, food.y, this.position[0].x, this.position[0].y) <= 2 * food.radius) {
                food.x = Math.random() * canvas.width;
                food.y = Math.random() * canvas.height;
                foodToEat = true;
            }
        }
    }
}

function main(){
    context.clearRect(0, 0, canvas.width, canvas.height);
    snake.update();
    snake.draw();
    food.draw();
    frames ++;
    requestAnimationFrame(main);
}
requestAnimationFrame(main);