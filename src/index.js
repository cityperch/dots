import { startTheGame } from "./game";

const playground = document.getElementById('playground');
const start = document.getElementById('start');
const leaderboardElem = document.getElementById('leaderboard');
let leaders = [];
let game = null;

function setGrid() {
    while (playground.firstChild) {
        playground.firstChild.remove();
    }
    for (let i = 0; i < 25; i++) {
        const dot = document.createElement('div');
        dot.setAttribute('data-index', i);
        playground.appendChild(dot);
    }
}

setGrid();
start.addEventListener('click', function begin() {
    if(game) {
        game.unsubscribe();
        game.endTheGame();
    }
        setGrid();
        game = startTheGame();
        game.subscribe(data => {
            leaderboardElem.innerHTML = "";
            leaders = [...leaders, data].sort((a, b) => b.score - a.score).slice(0, 5);
            leaders.forEach(x => {
                const li = document.createElement('li');
                let date = (new Date()).toLocaleString("en-Us");
                li.innerHTML = `<li class="mdl-list__item-primary-content">
                    <span class="bold"> ${x.playerName || "noname"} </span>
                    <span class="score">${x.score} </span>
                    <span class="date">${date}</span>
                </li>`;
                leaderboardElem.appendChild(li);
            })
            game.unsubscribe();
        });
        this.innerText = "Play again";
});