const playerNameInput = document.getElementById('playerName');
const difficultyInput = document.getElementById('difficulty');
const playground = document.getElementById('playground');

class Game {
    constructor() {
        this.model = {
            dots: [...playground.children].map((x, i) => ({ state: 'blank', index: i, element: x })),
            score: {
                player: 0,
                computer: 0,
            },
            timeoutTime: 3000 - difficultyInput.value * 30,
            playerName: playerNameInput.value,
            moveTimeout: null,
            activeElemIndex: null,
        };
        this.observers = [];
        this.scheduleMove();
        playground.addEventListener('click', this);
    }

    handleEvent(e) {
        (e.type === "click") && this.handlePlaygroundClick(e);
    }

    reset() {
        this.model.dots = [...playground.children].map((x, i) => ({ state: 'blank', index: i, element: x }));
        this.model.score = {
            player: 0,
            computer: 0,
        };
        this.observers = [];
    }

    handlePlaygroundClick(e) {
        if (e.target.classList.contains('active')) {
            this.addPointTo('player');
            this.scheduleMove();
        }
    }

    scheduleMove() {
        if (this.model.moveTimeout) {
            clearTimeout(this.model.moveTimeout);
        }
        this.model.moveTimeout = setTimeout(() => this.onTimeout(), this.model.timeoutTime);
        this.nextMove();
    }

    onTimeout() {
        this.addPointTo('computer');
        this.scheduleMove();
    }

    nextMove() {
        if (this.model.score.player + this.model.score.computer === Math.ceil(this.model.dots.length / 2)) {
            this.endTheGame();
        } else {
            this.changeState(this.getRandomElemIndex(), 'active');
        }
    }

    addPointTo(recipient) {
        this.model.score[recipient]++;
        this.changeState(this.model.activeElemIndex, recipient);
    }

    changeState(index, state) {
        this.model.activeElemIndex = state === 'active' ? index : this.model.activeElemIndex;
        this.model.dots[index].state = state;
        this.model.dots[index].element.className = state;
    }


    endTheGame() {
        !!this.model.moveTimeout && clearTimeout(this.model.moveTimeout);
        playground.removeEventListener("click", this);
        this.observers.forEach(subscriber => subscriber({ playerName: this.model.playerName, score: this.model.score.player }));
    }

    getRandomNum(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    getRandomElemIndex() {
        const blankDots = this.model.dots.filter(x => x.state === "blank");
        return blankDots[this.getRandomNum(0, blankDots.length)].index;
    }

    subscribe(fn) {
        this.observers.push(fn)
    }

    unsubscribe(fn) {
        this.observers = this.observers.filter(subscriber => subscriber !== fn)
    }

}

export function startTheGame() {
    return new Game();
}