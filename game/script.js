paintBtn = document.querySelector('.paint');

const board = document.querySelector('.board');
const cards = [
    { name: 'apple', img: './assets/apple.png' },
    { name: 'banana', img: './assets/banana.png' },
    { name: 'cherry', img: './assets/cherries.png' },
    { name: 'grape', img: './assets/grape.png' },
    { name: 'lemon', img: './assets/lemon.png' },
    { name: 'orange', img: './assets/orange.png' },
    { name: 'strawberry', img: './assets/strawberry.png' },
    { name: 'watermelon', img: './assets/watermelon.png' },
    { name: 'kiwi', img: './assets/kiwi.png' },
    { name: 'mango', img: './assets/mango.png' },
    { name: 'pear', img: './assets/pear.png' },
    { name: 'peach', img: './assets/peach.png' },
    { name: 'plum', img: './assets/plum.png' },
    { name: 'pomegranate', img: './assets/pomegranate.png' },
    { name: 'pineapple', img: './assets/pineapple.png' },
    { name: 'blueberry', img: './assets/blueberry.png' },
    { name: 'raspberry', img: './assets/raspberry.png' },
    { name: 'blackberry', img: './assets/blackberry.png' },
    { name: 'avocado', img: './assets/avocado.png' },
];

let moves = 0;
let time = 0;
let timer;
let firstCard, secondCard;
let lockBoard = false;
let matchedPairs = 0;
let gameStarted = false;
let selectedCards = [];
let columns = 4; // Default number of columns for easy level

const movesDisplay = document.getElementById('moves');
const timeDisplay = document.getElementById('time');
const resetButton = document.getElementById('reset');
const difficultySelect = document.getElementById('difficulty');

function startTimer() {
    timer = setInterval(() => {
        time++;
        timeDisplay.textContent = time;
    }, 1000);
}

function stopTimer() {
    clearInterval(timer);
}

function createBoard() {
    selectedCards = getSelectedCards();
    const shuffledCards = shuffle([...selectedCards, ...selectedCards]);
    board.innerHTML = ''; // Clear the board

    // Set the grid template columns based on the selected difficulty
    const difficulty = difficultySelect.value;
    switch (difficulty) {
        case 'easy':
            columns = 4;
            break;
        case 'medium':
            columns = 6;
            break;
        case 'hard':
            columns = 6;
            break;
        default:
            columns = 4; // Default to easy level
    }
    board.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;

    shuffledCards.forEach(card => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');
        cardElement.setAttribute('data-name', card.name);

        const front = document.createElement('div');
        front.classList.add('front');
        cardElement.appendChild(front);

        const back = document.createElement('div');
        back.classList.add('back');
        const imgElement = document.createElement('img');
        imgElement.src = card.img;
        back.appendChild(imgElement);
        cardElement.appendChild(back);

        cardElement.addEventListener('click', () => flipCard(cardElement));
        board.appendChild(cardElement);
    });
}

function getSelectedCards() {
    const difficulty = difficultySelect.value;
    switch (difficulty) {
        case 'easy':
            return cards.slice(0, 6);
        case 'medium':
            return cards.slice(0, 12);
        case 'hard':
            return cards.slice(0, 18);
        default:
            return cards.slice(0, 6); // Default to easy level
    }
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function flipCard(card) {
    if (!gameStarted) return;
    if (lockBoard) return;
    if (card === firstCard) return;

    card.classList.add('open');

    if (!firstCard) {
        firstCard = card;
        return;
    }

    secondCard = card;
    lockBoard = true;

    checkForMatch();
}

function checkForMatch() {
    moves++;
    movesDisplay.textContent = moves;

    let isMatch = firstCard.dataset.name === secondCard.dataset.name;

    isMatch ? disableCards() : unflipCards();
}

function disableCards() {
    firstCard.classList.add('match');
    secondCard.classList.add('match');
    matchedPairs++;

    if (matchedPairs === selectedCards.length) {
        stopTimer();
        alert('Congratulations! You won the game!');
        gameStarted = false; // Stop the game
    }

    resetBoard();
}

function unflipCards() {
    setTimeout(() => {
        firstCard.classList.remove('open');
        secondCard.classList.remove('open');
        resetBoard();
    }, 1000);
}

function resetBoard() {
    [firstCard, secondCard, lockBoard] = [null, null, false];
}

function resetGame() {
    board.innerHTML = '';
    moves = 0;
    time = 0;
    matchedPairs = 0;
    gameStarted = true; // Set gameStarted to true
    movesDisplay.textContent = moves;
    timeDisplay.textContent = time;
    stopTimer();
    createBoard();
    startTimer();
}

resetButton.addEventListener('click', resetGame);

// Initialize the game board without starting the timer
createBoard();

// Add event listener to difficulty selector to update the board
difficultySelect.addEventListener('change', () => {
    if (gameStarted) {
        if (confirm('Are you sure you want to stop the current game and change the difficulty level?')) {
            resetGame();
        } else {
            // Revert the difficulty selection back to the previous value
            difficultySelect.value = difficultySelect.dataset.previousValue;
        }
    } else {
        createBoard();
    }
});

// Store the previous difficulty value to revert if needed
difficultySelect.addEventListener('change', () => {
    if (!gameStarted) {
        difficultySelect.dataset.previousValue = difficultySelect.value;
    }
});

paintBtn.addEventListener("click", () => {
    window.location.href = 'http://127.0.0.1:5500';
});