let cards = [];

// Load cards from local storage on page load
window.onload = function() {
    if (localStorage.getItem('cards')) {
        cards = JSON.parse(localStorage.getItem('cards'));
        showNextCard();
    }
};

function saveCards() {
    localStorage.setItem('cards', JSON.stringify(cards));
}

let currentCardIndex = 0;

function addCard() {
    const front = document.getElementById('front').value;
    const back = document.getElementById('back').value;
    if (front && back) {
        cards.push({ front, back, interval: 1, lastReviewed: Date.now() - 864000001 });
        document.getElementById('front').value = '';
        document.getElementById('back').value = '';
        alert('Card added!');
		saveCards();
		showNextCard();
    } else {
        alert('Please enter both front and back of the card.');
    }
}

function showAnswer() {
    const card = cards[currentCardIndex];
    document.getElementById('card-back').innerText = card.back;
    document.getElementById('easy').innerHTML = "Easy (" + card.interval * 2 + "d)";
    document.getElementById('hard').innerHTML = "Hard (" + card.interval * 1 + "d)";	
}

function markEasy() {
    updateCard(2);
    document.getElementById('card-back').innerText = "";
	showNextCard();
}

function markHard() {
    updateCard(1);
    document.getElementById('card-back').innerText = "";
	showNextCard();
}

function updateCard(multiplier) {
    const card = cards[currentCardIndex];
    card.interval *= multiplier;
    card.lastReviewed = Date.now();
    currentCardIndex = (currentCardIndex + 1) % cards.length;
	saveCards();
    showNextCard();
}

function showNextCard() {
    const now = Date.now();
    const dueCards = cards.filter(card => now - card.lastReviewed >= card.interval * 86400000);
    if (dueCards.length > 0) {
        currentCardIndex = cards.indexOf(dueCards[0]);
        const card = cards[currentCardIndex];
        document.getElementById('card-front').innerText = card.front;
    } else {
        document.getElementById('card-front').innerText = 'No cards to review right now.';
    }
	document.getElementById('card-back').innerText = "";
}

function removeCard() {
    cards.splice(currentCardIndex, 1);
    if (cards.length > 0) {
        currentCardIndex = currentCardIndex % cards.length;
        showNextCard();
    } else {
        document.getElementById('card-front').innerText = 'No cards to review right now.';
		document.getElementById('card-back').innerText = "";
    }
    saveCards();
    }
}
