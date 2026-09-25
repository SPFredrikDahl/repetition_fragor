const flashcard = document.querySelector('#flashcard');
const questionElement = document.querySelector('#question');
const answerElement = document.querySelector('#answer');
const deckLabel = document.querySelector('#deck-label');
const progressText = document.querySelector('#progress-text');
const progressPercent = document.querySelector('#progress-percent');
const progressValue = document.querySelector('#progress-value');
const previousButton = document.querySelector('#previous-button');
const nextButton = document.querySelector('#next-button');
const errorMessage = document.querySelector('#error-message');

let cards = [];
let currentIndex = 0;

async function loadCards() {
  try {
    const response = await fetch('questions.json');
    if (!response.ok) throw new Error('Frågorna kunde inte laddas.');
    cards = await response.json();

    if (!Array.isArray(cards) || cards.length === 0) {
      throw new Error('Det finns inga kort.');
    }

    deckLabel.textContent = `${cards.length} frågor totalt`;
    renderCard();
  } catch (error) {
    errorMessage.hidden = false;
    errorMessage.textContent = `${error.message} Starta appen från en lokal webbserver för att ladda JSON-filen.`;
    flashcard.hidden = true;
    previousButton.disabled = true;
    nextButton.disabled = true;
  }
}

function renderCard() {
  const card = cards[currentIndex];
  const progress = ((currentIndex + 1) / cards.length) * 100;

  questionElement.textContent = card.question;
  answerElement.textContent = card.answer;
  progressText.textContent = `Kort ${currentIndex + 1} av ${cards.length}`;
  progressPercent.textContent = `${Math.round(progress)}%`;
  progressValue.style.width = `${progress}%`;
  previousButton.disabled = false;
  nextButton.disabled = false;
  flashcard.classList.remove('is-flipped');
  flashcard.setAttribute('aria-label', `Visa svar för kort ${currentIndex + 1}`);
}

function moveCard(direction) {
  if (direction > 0 && currentIndex === cards.length - 1) {
    currentIndex = 0;
    renderCard();
    return;
  }

  if (direction < 0 && currentIndex === 0) {
    currentIndex = cards.length - 1;
    renderCard();
    return;
  }

  const nextIndex = currentIndex + direction;
  if (nextIndex < 0 || nextIndex >= cards.length) return;
  currentIndex = nextIndex;
  renderCard();
}

flashcard.addEventListener('click', () => {
  flashcard.classList.toggle('is-flipped');
  flashcard.setAttribute('aria-label', flashcard.classList.contains('is-flipped') ? 'Visa fråga' : 'Visa svar');
});
previousButton.addEventListener('click', () => moveCard(-1));
nextButton.addEventListener('click', () => moveCard(1));

document.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowLeft') moveCard(-1);
  if (event.key === 'ArrowRight') moveCard(1);
  if (event.key === ' ' || event.key === 'Enter') {
    if (document.activeElement === flashcard) {
      event.preventDefault();
      flashcard.click();
    }
  }
});

loadCards();
