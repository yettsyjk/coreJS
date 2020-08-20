var Game = Game || {};
var KeyBoard = KeyBoard || {};
var Component = Component || {};

/* movement*/
KeyBoard.Keymap = {
    37: "left",
    38: "up",
    39: "right",
    40: "down"
};
/* events */
KeyBoard.ControllerEvents = function () {
    var self = this;
    this.pressKey = null;
    this.keymap = KeyBoard.Keymap;

    document.onkeydown = function (e) {
        self.pressKey = e.which;
    };

    this.getKey = function () {
        return this.keymap[this.pressKey];
    };
};
/* stage */

Component.Stage = function (canvas, conf) {
    //sets
    this.keyEvent = new KeyBoard.ControllerEvents();
    this.width = canvas.width;
    this.height = canvas.height;
    this.length = [];
    this.food = {};
    this.score = 0;
    this.direction = "right";
    this.conf = {
        cw: 10,
        size: 5,
        fps: 1000
    };
    if (typeof conf === "object") {
        for (let key in conf) {
            if (conf.hasOwnProperty(key)) {
                this.conf[key] = conf[key];
            }
        }
    }
};
/* snake */
Component.Snake = function (canvas, conf) {
    /* game stage */
    this.stage = new Component.Stage(canvas, conf);

    this.initSnake = function () {
        /* iterate in Snake Conf size */
        for (let i = 0; i < this.stage.conf.size; i++) {
            this.stage.length.push({
                x: i,
                y: 0
            });
        }
    };

    this.initSnake();//call the snake to initialize
    /* food*/
    this.initFood = function () {
        this.stage.food = {
            x: Math.round(Math.random() * (this.stage.width = this.stage.conf.cw) / this.stage.conf.cw),
            y: Math.round(Math.random() * (this.stage.height - this.stage.conf.cw) / this.stage.conf.cw),
        };
    };
    /* initialize food*/
    this.initFood();
    /* restart stage */
    this.restart = function () {
        this.stage.length = [];
        this.stage.food = {};
        this.stage.score = 0;
        this.stage.direction = "right";
        this.stage.keyEvent.pressKey = null;
        this.initSnake();
        this.initFood();
    };
};

/* draw the game */

Game.Draw = function (context, snake) {
    this.drawStage = function () {
        let keyPress = snake.stage.keyEvent.getKey();
        if (typeof (keyPress) != "undefined") {
            snake.stage.direction = keyPress;
        }
        context.fillStyle = "white";
        context.fillRect(0, 0, snake.stage.width, snake.stage.height);

        /* snake position */
        var nextx = snake.stage.length[0].x;
        var nexty = snake.stage.length[0].y;

        /* stage direction and positioning */
        switch (snake.stage.direction) {
            case "right":
                nextx++;
                break;
            case "left":
                nextx--;
                break;
            case "up":
                nexty--;
                break;
            case "down":
                nexty++;
                break;
        }
        /* Collision detection */
        if (this.collision(nextx, nexty) === true) {
            snake.restart();
            return;
        }

        /* logic of snake food */
        if (nextx === snake.stage.food.x && nexty === snake.stage.food.y) {
            var tail = {x: nextx, y: nexty};//hoisting variable
            snake.stage.score++;
            snake.initFood();
        } else {
            var tail = snake.stage.length.pop();
            tail.x = nextx;
            tail.y = nexty;
        }
        snake.stage.length.unshift(tail);

        /* draw the snake */
        for (let i = 0; i < snake.stage.length.length; i++) {
            let cell = snake.stage.length[i];
            this.drawCell(cell.x, cell.y);
        }
        /* draw food */
        this.drawCell(snake.stage.food.x, snake.stage.food.y);
        /* draw score */
        context.fillText("SCORE: " + snake.stage.score, 5, (snake.stage.height - 5));
    };
    /* draw cell */
    this.drawCell = function(x, y){
        context.fillStyle = "rgba(148, 0, 211, 0.75)";
        context.beginPath();
        context.arc((
            x * snake.stage.conf.cw + 6
        ),
        (y * snake.stage.conf.cw + 6), 6, 0, 2 * Math.PI, false);
        context.fill();
    };
    /* collision with walls */
    this.collision = function(nextx, nexty){
        if (nextx === -1 || nextx === (snake.stage.width / snake.stage.conf.cw) 
        || nexty === -1 || nexty === (snake.stage.height / snake.stage.conf.cw)){
            return true;
        }
        return false;
    }
};

/* Game */
Game.Snake = function(elementId, conf){
    var canvas = document.getElementById(elementId);
    var context = canvas.getContext("2d");
    var snake = new Component.Snake(canvas, conf);
    var gameDraw = new Game.Draw(context, snake);

    setInterval(function(){
        gameDraw.drawStage();
    },
    snake.stage.conf.fps);
};

window.onload = function(){
    var snake = new Game.Snake("stage", {
        fps: 100,
        size: 6
    });
};