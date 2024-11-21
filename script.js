const keys = document.querySelectorAll(".key"),
  noteDisplay = document.querySelector(".nowplaying"),
  hints = document.querySelectorAll(".hints"),
  hintSharp = document.querySelectorAll(".hints-sharp"); 

const difficultyButtons = document.querySelectorAll('.difficulty-btn');


const hintElements = document.querySelectorAll(".hints, .hints-sharp"); 


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
}


function toggleHintsVisibility(visible) {
    hintElements.forEach(hint => {
        hint.style.display = visible ? "block" : "none";
    });
}

// Add event listeners to buttons
difficultyButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove the 'selected' class from all buttons
        difficultyButtons.forEach(btn => btn.classList.remove('selected'));

        // Add the 'selected' class to the clicked button
        button.classList.add('selected');

        const difficulty = button.classList.contains('easy') ? 'easy' :
                           button.classList.contains('medium') ? 'medium' :
                           'hard';
        changeHints(difficulty);

        // Show or hide the hints based on the selected difficulty
        toggleHintsVisibility(difficulty !== 'medium'); // Hide for 'medium', show otherwise
    });
});

// Set default hints to easy and ensure they are visible on page load
document.addEventListener('DOMContentLoaded', () => {
    const defaultButton = document.querySelector('.difficulty-btn.easy');
    defaultButton.classList.add('selected'); // Highlight 'easy' button as selected
    changeHints('easy');  // Automatically set hints to 'easy'
    toggleHintsVisibility(true); // Ensure hints are visible by default
});

// Function to update hints display based on toggle state
function updateHintsDisplay() {
    hints.forEach((hint) => {
        const noteName = hint.closest(".key").getAttribute("data-note");
        const keyHint = hint.closest(".key").getAttribute("data-key-hint") || hint.textContent;

        // Store original hint in data attribute if not stored
        if (!hint.closest(".key").hasAttribute("data-key-hint")) {
            hint.closest(".key").setAttribute("data-key-hint", hint.textContent);
        }

        // Display note name if showNoteNames is true; otherwise, show the original hint
        hint.textContent = showNoteNames ? noteName : keyHint;
    });
}

// Play note on keydown event
function playNote(e) {
    const audio = document.querySelector(`audio[data-key="${e.keyCode}"]`),
        key = document.querySelector(`.key[data-key="${e.keyCode}"]`);

    if (!key) return;

    const keyNote = key.getAttribute("data-note");

    key.classList.add("playing");
    noteDisplay.innerHTML = keyNote;
    audio.currentTime = 0;
    audio.play();
}

// Remove transition effect after playing note
function removeTransition(e) {
    if (e.propertyName !== "transform") return;
    this.classList.remove("playing");
}

// Add event listeners for playing notes and removing transitions
window.addEventListener("keydown", playNote);
keys.forEach((key) => key.addEventListener("transitionend", removeTransition));

// Initial display for keyboard hints
updateHintsDisplay();
