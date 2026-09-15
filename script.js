const board = document.querySelector(".board");

const modal = document.querySelector(".modal");
const startBtn = document.querySelector(".btn-start");
const restartBtn = document.querySelector(".btn-restart");
const resetBtn = document.querySelector(".btn-reset");
const menuBtn = document.querySelector(".btn-menu");
const startModal = document.querySelector(".start-game");
const restartModal = document.querySelector(".restart-game");

const scoreSpan = document.querySelector("#score");
const highScoreSpan = document.querySelector("#high-score");
const timeSpan = document.querySelector("#time");

let score = 0;
let highScore = localStorage.getItem("highScore") || 0;
highScoreSpan.textContent = highScore;
let time = `00:00`;

const blockHeight = 50;
const blockWidth = 50;

const cols = Math.floor(board.clientWidth / blockWidth);
const rows = Math.floor(board.clientHeight / blockHeight);

const blocks = [];

const snake = [
    {
        x: Math.floor(Math.random() * rows),
        y: Math.floor(Math.random() * cols)
    }
]

let direction = "";

let interval = null;
let timeInterval = null;

let food = {
    x: Math.floor(Math.random() * rows),
    y: Math.floor(Math.random() * cols)
}


for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
        const block = document.createElement("div");
        block.classList.add("block");
        board.appendChild(block);
        blocks[`${row}-${col}`] = block;
    }
}


function display() {
    let head = null;

    blocks[`${food.x}-${food.y}`].classList.add("food");

    if (direction === "up") {
        head = { x: snake[0].x - 1, y: snake[0].y };
    } else if (direction === "down") {
        head = { x: snake[0].x + 1, y: snake[0].y };
    } else if (direction === "left") {
        head = { x: snake[0].x, y: snake[0].y - 1 };
    } else if (direction === "right") {
        head = { x: snake[0].x, y: snake[0].y + 1 };
    } else {
        head = { x: snake[0].x, y: snake[0].y };
    }

    if (head.x < 0 || head.x >= rows || head.y < 0 || head.y >= cols) {
        modal.style.display = "flex";
        startModal.style.display = "none";
        restartModal.style.display = "flex";
        clearInterval(interval);
        return;
    }

    const hitBody = snake.slice(1).some(segment=>segment.x === head.x && segment.y === head.y)

    if (hitBody) {
        modal.style.display = "flex";
        startModal.style.display = "none";
        restartModal.style.display = "flex";
        clearInterval(interval);
        return;
    }

    if (head.x === food.x && head.y === food.y) {
        blocks[`${food.x}-${food.y}`].classList.remove("food");
        food = {
            x: Math.floor(Math.random() * rows),
            y: Math.floor(Math.random() * cols)
        }
        blocks[`${food.x}-${food.y}`].classList.add("food");
        snake.unshift(head);

        score += 10;
        scoreSpan.textContent = score;

        if (score > highScore) {
            highScore = score;
            localStorage.setItem("highScore", highScore.toString());
            highScoreSpan.textContent = highScore;
        }
    }

    snake.forEach(segment => {
        blocks[`${segment.x}-${segment.y}`].classList.remove("fill");
    })

    snake.unshift(head);
    snake.pop();
    snake.forEach(segment => {
        blocks[`${segment.x}-${segment.y}`].classList.add("fill");
    })
}

const startGame = () => {
    interval = setInterval(() => {
        display();
    }, 250);

    timeInterval = setInterval(() => {
        let [min,sec] = time.split(":").map(Number);

        if(sec===59){
            min++;
            sec = 0;
        }else {
            sec++;
        }

        time = `${String(min).padStart(2,"0")}:${String(sec).padStart(2,"0")}`;
        timeSpan.textContent = time;
    },1000)
}

addEventListener("keydown", e => {
    if (e.key === "ArrowUp") {
        direction = "up";
    } else if (e.key === "ArrowDown") {
        direction = "down";
    } else if (e.key === "ArrowLeft") {
        direction = "left";
    } else if (e.key === "ArrowRight") {
        direction = "right";
    }
})

startBtn.addEventListener("click", () => {
    startGame();
    modal.style.display = "none";
})


const restartGame = () => {
    snake.forEach(segment => {
        blocks[`${segment.x}-${segment.y}`].classList.remove("fill");
    })
    blocks[`${food.x}-${food.y}`].classList.remove("food");

    modal.style.display = "none";

    snake.length = 0;
    snake.push({
        x: Math.floor(Math.random() * rows),
        y: Math.floor(Math.random() * cols)
    });

    food.x = Math.floor(Math.random() * rows);
    food.y = Math.floor(Math.random() * cols);

    direction = "";

    score = 0;
    scoreSpan.textContent = score;

    time = `00:00`;
    timeSpan.textContent = time;

    startGame();
}

restartBtn.addEventListener("click", restartGame);

resetBtn.addEventListener("click", () => {
    localStorage.removeItem("highScore");

    highScore = 0;
    highScoreSpan.textContent = highScore;
});

menuBtn.addEventListener("click",()=>{
    clearInterval(interval);
    clearInterval(timeInterval);

    modal.style.display = "flex";
    startModal.style.display = "flex";
    restartModal.style.display = "none";
})