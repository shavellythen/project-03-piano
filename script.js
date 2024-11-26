const keys = document.querySelectorAll(".key"),
    noteDisplay = document.querySelector(".nowplaying"),
    difficultyButtons = document.querySelectorAll('.difficulty-btn'),
    hintElements = document.querySelectorAll(".hints, .hints-sharp"),
    musicalSheet = document.querySelector('.musical-sheet'),
    Colors = document.querySelectorAll(".falling-color"),
    musicalContainer = document.querySelector('.musical-container');
    purpleBg = document.querySelector('.purple-bg'); 

// Change the hint text based on selected difficulty
function changeHints(difficulty) {
    hintElements.forEach(hint => {
        if (difficulty === 'easy') {
            hint.textContent = hint.getAttribute('data-easy');
        } else if (difficulty === 'medium') {
            hint.textContent = hint.getAttribute('data-medium');
        } else if (difficulty === 'hard') {
            hint.textContent = hint.getAttribute('data-hard');
        }
    });

    keys.forEach(key => {
        const mediumClass = key.getAttribute('data-medium');

        if (difficulty === 'medium' && mediumClass) {
            key.classList.remove('hidden');
        }

        if (key.classList.contains('sharp')) {
            key.style.backgroundColor = ''; // Reset sharp key styles
        } else {
            key.style.backgroundColor = ''; // Reset non-sharp key styles
        }
    });
}

function toggleVisibility(difficulty) {
    hintElements.forEach(hint => {
        hint.style.display = difficulty === 'medium' ? "none" : "block";
    });

    Colors.forEach(color => {
        const key = color.getAttribute('data-key');

        // Show falling color only if difficulty is medium
        if (difficulty === 'medium') {
            color.classList.add("hidden"); // Initially hidden
        } else {
            color.classList.add("hidden"); // Hide in easy and hard difficulties
        }
    });

    // Hide all notes if difficulty is not medium
    const notes = document.querySelectorAll('.note');
    notes.forEach(note => {
        if (difficulty !== 'medium') {
            note.style.display = 'none';
        } else {
            note.style.display = 'flex'; // or 'block' based on your layout
        }
    });

    // Adjust musical sheet height
    if (difficulty === 'medium') {
        purpleBg.style.height = '250px';
    } else {
        purpleBg.style.height = '150px';
    }

    // Show or hide the musical container based on difficulty
    if (difficulty === 'medium') {
        musicalContainer.style.display = "block";  // Show musical container in medium difficulty
    } else {
        musicalContainer.style.display = "none";  // Hide musical container in other difficulties
    }
}


// Handle difficulty button clicks
difficultyButtons.forEach(button => {
    button.addEventListener('click', () => {
        difficultyButtons.forEach(btn => btn.classList.remove('selected'));
        button.classList.add('selected');

        const difficulty = button.classList.contains('easy') ? 'easy' :
            button.classList.contains('medium') ? 'medium' : 'hard';

        changeHints(difficulty);
        toggleVisibility(difficulty);
    });
});

// Set default difficulty on page load
document.addEventListener('DOMContentLoaded', () => {
    const defaultButton = document.querySelector('.difficulty-btn.easy');
    defaultButton.classList.add('selected');
    changeHints('easy');
    toggleVisibility('easy');
});

// Play note on keydown
let lastKeyPressed = null;

// Track falling colors in order and only display one at a time
let colorIndex = 0; 

function playNote(e) {
    e.preventDefault();  // Prevent default key action (like scrolling or focusing)
    const audio = document.querySelector(`audio[data-key="${e.keyCode}"]`);
    const key = document.querySelector(`.key[data-key="${e.keyCode}"]`);
    if (!audio) return;  // Don't do anything if there's no audio for the key

    key.classList.add("playing");
    audio.currentTime = 0;  // Rewind to start
    audio.play();  // Play the audio
}


// Remove "playing" class after transition
function removeTransition(e) {
    if (e.propertyName !== "transform") return;
    this.classList.remove("playing");
}

// Event listeners
window.addEventListener("keydown", playNote);
keys.forEach(key => key.addEventListener("transitionend", removeTransition));
