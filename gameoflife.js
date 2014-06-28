function createEmptyTwoDimArray(n, m) {"use strict";
    var result = [], row, i, j;
    for (i = 0; i < n; i = i + 1) {
        row = [];
        for (j = 0; j < m; j = j + 1) {
            row[j] = 0;
        }
        result[i] = row;
    }
    return result;
}

function gameOfLifeMainFunction() {"use strict";
    /*global document */
    var canvas = document.getElementById("canvas"), i, j, lifeModel = {}, lifeView = {}, lifeController = {};

    lifeModel.WIDTH = 50;
    lifeModel.HEIGHT = 50;
    lifeModel.cells = createEmptyTwoDimArray(lifeModel.WIDTH, lifeModel.HEIGHT);
    lifeModel.nextMoment = function () {
        function toAdd(n, m, cellsArray, maxWidth, maxHeight) {
            if ((n >= 0) && (n < maxWidth) && (m >= 0) && (m < maxHeight)) {
                return cellsArray[n][m];
            }
            return 0;
        }

        var sum, newCells = createEmptyTwoDimArray(this.WIDTH, this.HEIGHT);
        for (i = 0; i < this.WIDTH; i = i + 1) {
            for (j = 0; j < this.HEIGHT; j = j + 1) {
                sum = 0;
                sum += toAdd(i + 1, j, this.cells, this.WIDTH, this.HEIGHT);
                sum += toAdd(i - 1, j, this.cells, this.WIDTH, this.HEIGHT);
                sum += toAdd(i, j + 1, this.cells, this.WIDTH, this.HEIGHT);
                sum += toAdd(i, j - 1, this.cells, this.WIDTH, this.HEIGHT);
                sum += toAdd(i + 1, j + 1, this.cells, this.WIDTH, this.HEIGHT);
                sum += toAdd(i + 1, j - 1, this.cells, this.WIDTH, this.HEIGHT);
                sum += toAdd(i - 1, j + 1, this.cells, this.WIDTH, this.HEIGHT);
                sum += toAdd(i - 1, j - 1, this.cells, this.WIDTH, this.HEIGHT);
                if (this.cells[i][j] === 0) {
                    if (sum === 3) {
                        newCells[i][j] = 1;
                    }
                } else {
                    if ((sum === 2) || (sum === 3)) {
                        newCells[i][j] = 1;
                    }
                }
            }
        }
        this.cells = newCells;
    }
    lifeModel.reset = function() {
        this.cells = createEmptyTwoDimArray(this.WIDTH, this.HEIGHT);
    }

    lifeView.CELL_SIZE = 10;
    lifeView.context = canvas.getContext("2d");
    lifeView.draw = function() {
        this.context.lineWidth = 1;
        this.context.strokeStyle = "grey";
        for (i = 0; i < lifeModel.WIDTH; i = i + 1) {
            for (j = 0; j < lifeModel.HEIGHT; j = j + 1) {
                if (lifeModel.cells[i][j] != 0) {
                    this.context.fillStyle = "rgb(200, 210, 210)";
                    this.context.fillRect(i * this.CELL_SIZE, j * this.CELL_SIZE, this.CELL_SIZE, this.CELL_SIZE);
                } else {
                    this.context.fillStyle = "rgb(40, 40, 60)";
                    this.context.fillRect(i * this.CELL_SIZE, j * this.CELL_SIZE, this.CELL_SIZE, this.CELL_SIZE);
                }
                this.context.strokeRect(i * this.CELL_SIZE, j * this.CELL_SIZE, this.CELL_SIZE, this.CELL_SIZE);
            }
        }
    }

    lifeController.active = 0;
    lifeController.getActive = function() {
        return this.active;
    }
    lifeController.setActive = function(a) {
        this.active = a;
        if (this.getActive() == 0) {
            startButton.innerHTML = "Start";
            this.clearTickFuncInterval();
        } else {
            startButton.innerHTML = "Stop";
            this.createTickFuncInterval();
        }
    }
    lifeController.onmousedown = function(e) {
        if ((e.pageX < (lifeModel.WIDTH * lifeView.CELL_SIZE)) && (e.pageY < (lifeModel.HEIGHT * lifeView.CELL_SIZE))) {
            var x = Math.floor(e.pageX / lifeView.CELL_SIZE) - 1;
            var y = Math.floor(e.pageY / lifeView.CELL_SIZE) - 1;
            lifeModel.cells[x][y] = 1 - lifeModel.cells[x][y];
            lifeView.draw();
        }
    };
    lifeController.addButtonsListeners = function() {
        var thisController = this;
        var startButton = document.getElementById("startButton");
        startButton.onclick = function() {
            if (thisController.getActive() == 1) {
                thisController.setActive(0);
            } else {
                thisController.setActive(1);
            }
            lifeView.draw();
        }
        var resetButton = document.getElementById("resetButton");
        resetButton.onclick = function() {
            lifeModel.reset();
            thisController.setActive(0);
            lifeView.draw();
        }
    }
    lifeController.createTickFunc = function() {
        function tick(controller) {
            if (controller.getActive() == 1) {
                lifeModel.nextMoment();
                lifeView.draw();
            }
        }

        var thisController = this;
        return function() {
            tick(thisController)
        };
    }
    lifeController.tickFunc = lifeController.createTickFunc();
    lifeController.tickFuncInterval
    lifeController.createTickFuncInterval = function() {
        lifeController.tickFuncInterval = window.setInterval(this.tickFunc, 500);
    }
    lifeController.clearTickFuncInterval = function() {
        window.clearInterval(this.tickFuncInterval);
    }
    lifeController.start = function() {
        lifeView.draw();
        canvas.onmousedown = this.onmousedown;
        this.addButtonsListeners();
    }
    lifeController.start();
}

/*global window */
window.onload = gameOfLifeMainFunction;
