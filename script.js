'use strict';

let level = 1;
let timeToDuel = 700;
let readyToDuel = false;
let time;
let score;

const startButton = document.querySelector('.button-start-game');
const restartButton = document.querySelector('.button-restart');
const nextButton = document.querySelector('.button-next-level');
const gameMenu = document.querySelector('.game-menu');
const wrapper = document.querySelector('.wrapper');
const gamePanels = document.querySelector('.game-panels');
const gameScreen = document.querySelector('.game-screen');
const winScreen = document.querySelector('.win-screen');
const gunman = document.querySelector('.gunman');
const timeYou = document.querySelector('.time-panel__you');
const timeGunman = document.querySelector('.time-panel__gunman');
const showLevel = document.querySelector('.score-panel__level');
const message = document.querySelector('.message');

const sfxIntro = new Audio('sfx/intro.m4a');
const sfxWait = new Audio('sfx/wait.m4a');
const sfxFire = new Audio('sfx/fire.m4a');
const sfxWin = new Audio('sfx/win.m4a');
const sfxShot = new Audio('sfx/shot.m4a');
const sfxDeath = new Audio('sfx/death.m4a');

startButton.addEventListener('click', startGame);
nextButton.addEventListener('click', nextLevel);
restartButton.addEventListener('click', restartGame);


function startGame() {
    gameMenu.style.display = 'none';
    wrapper.style.display = 'block';
    gamePanels.style.display = 'block';
    gameScreen.style.display = 'block';
    timeGunman.innerHTML = (timeToDuel / 1000).toFixed(2);
    timeYou.innerHTML = (0).toFixed(2);
    score = +document.querySelector('.score-panel__score_num').innerHTML;
    showLevel.innerHTML = 'level: ' + level;
    gunman.classList.add('gunman-level-' + level);
    gunman.addEventListener('transitionend', prepareForDuel);
    setTimeout(() => {
        moveGunman();
    }, 500);
}

function restartGame() {
    sfxDeath.pause();
    restartButton.style.display = 'none';
    message.innerHTML = '';
    message.classList.remove('message--dead', 'animated', 'zoomIn');
    gameScreen.classList.remove('game-screen--death');
    gunman.classList.remove(
        'gunman-level-' + level,
        'gunman-level-' + level + '__standing',
        'gunman-level-' + level + '__ready',
        'gunman-level-' + level + '__shooting'
    );
    setTimeout(() => {
        startGame();
    }, 1000);
}

function nextLevel() {
    if (level < 5) {
        nextButton.style.display = 'none';
        message.innerHTML = '';
        message.classList.remove('message--win', 'animated', 'zoomIn');
        gunman.classList.remove(
            'gunman-level-' + level,
            'gunman-level-' + level + '__standing',
            'gunman-level-' + level + '__death'
        );
        level++;
        timeToDuel = 700 - level * 100;
        startGame();
    } else {
        message.style.display = 'none';
        gamePanels.style.display = 'none';
        gameScreen.style.display = 'none';
        winScreen.style.display = 'block';
    }
}

function moveGunman() {
    setTimeout(() => {
        sfxIntro.play();
        sfxIntro.loop = true;
        gunman.classList.add('moving');
    }, 50);
}

function prepareForDuel() {
    sfxIntro.pause();
    sfxWait.play();
    sfxWait.currentTime = 0;
    sfxWait.loop = true;

    gunman.classList.remove('moving');
    gunman.classList.add('standing', 'gunman-level-' + level + '__standing');

    setTimeout(() => {
        sfxWait.pause();
        sfxFire.play();
        gunman.classList.add('gunman-level-' + level + '__ready');
        message.classList.add('message--fire');
        gunman.addEventListener('mousedown', playerShootsGunman);
        readyToDuel = true;
        timeCounter(Date.now());
        setTimeout(gunmanShootsPlayer, timeToDuel);
    }, 1000);
}

function timeCounter(startTime) {
    let currTime;

    (function timeCompare() {
        currTime = Date.now();
        if (readyToDuel) {
            time = ((currTime - startTime + 10) / 1000).toFixed(2);
            timeYou.innerHTML = time;
            setTimeout(timeCompare, 10);
        }
    })();
}

function gunmanShootsPlayer() {
    if (readyToDuel) {
        readyToDuel = false;
        gunman.classList.remove('standing');
        gunman.classList.add('gunman-level-' + level + '__shooting');

        setTimeout(() => {
            sfxShot.play();
            message.classList.remove('message--fire');
            message.classList.add('message--dead', 'animated', 'zoomIn');
            message.innerHTML = 'You are dead!';
            gameScreen.classList.add('game-screbutton-next-levelen--death');
        }, timeToDuel / 3);

        gunman.removeEventListener('mousedown', playerShootsGunman);

        setTimeout(() => {
            sfxDeath.play();
            restartButton.style.display = 'block';
        }, 1000);
    }
}

function playerShootsGunman() {
    if (readyToDuel) {
        readyToDuel = false;
        sfxShot.play();
        sfxWin.play();
        message.classList.remove('message--fire');
        gunman.classList.remove('standing', 'gunman-level-' + level + '__shooting');
        gunman.classList.add('gunman-level-' + level + '__death');
        gunman.removeEventListener('mousedown', playerShootsGunman);

        setTimeout(() => {
            message.classList.add('message--win', 'animated', 'zoomIn');
            message.innerHTML = 'You Win!';
            scoreCount();
            nextButton.style.display = 'block';
        }, 1000);
    }
}

function scoreCount() {
    const scoreDiv = document.querySelector('.score-panel__score_num');
    const timeYouValue = +timeYou.innerHTML;
    const maxTime = +(timeToDuel / 1000).toFixed(3);
    const temp = +(((maxTime - timeYouValue) * 100 * level * level)).toFixed(3);

    (function count() {
        if (+scoreDiv.innerHTML - score < temp) {
            scoreDiv.innerHTML = +scoreDiv.innerHTML + temp;
            setTimeout(count, 10);
        }
    })();
}
