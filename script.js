const keys = document.querySelectorAll(".key"),
      noteDisplay = document.querySelector(".nowplaying"),
      hints = document.querySelectorAll(".hints"),
      hintSharp = document.querySelectorAll(".hints-sharp");

const difficultyButtons = document.querySelectorAll('.difficulty-btn');
const hintElements = document.querySelectorAll(".hints, .hints-sharp");
const musicalSheet = document.querySelector('.musical-sheet'); // Select the musical sheet element

// Function to change the hint text based on selected difficulty
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

    // Add or remove the 'key-circle' class based on the 'data-medium' attribute
    keys.forEach(key => {
        const mediumClass = key.getAttribute('data-medium');
        const hint = key.querySelector('.hints');

        // When medium difficulty is selected, replace 'key-circle.hidden' with 'key-circle'
        if (difficulty === 'medium' && mediumClass) {
            key.classList.remove('key-circle', 'hidden'); // Remove both 'key-circle' and 'hidden' classes
            key.classList.add('key-circle'); // Add 'key-circle' class to make it visible
        } else {
            key.classList.remove('key-circle'); // Remove 'key-circle' class if difficulty is not medium
            key.classList.add('hidden'); // Add 'hidden' to hide the key circle
        }
    });
}

// Function to toggle visibility of hints, falling circles, and change musical sheet height
function toggleHintsVisibility(difficulty) {
    hintElements.forEach(hint => {
        hint.style.display = difficulty === 'medium' ? "none" : "block";
    });

    const fallingCircles = document.querySelectorAll('.falling-circle');
    fallingCircles.forEach(circle => {
        circle.style.display = difficulty === 'medium' ? 'block' : 'none';
    });

    // Change height of .musical-sheet based on difficulty
    if (difficulty === 'medium') {
        musicalSheet.style.height = '300px'; // Medium difficulty gets 300px height
    } else {
        musicalSheet.style.height = '150px'; // Easy or Hard difficulty gets 150px height
    }

    // Handle the visibility of key circles for medium difficulty
    const keyCircles = document.querySelectorAll('.key-circle');
    if (difficulty === 'medium') {
        keyCircles.forEach(circle => circle.style.display = 'block'); // Show circles on medium
    } else {
        keyCircles.forEach(circle => circle.style.display = 'none'); // Hide circles otherwise
    }
}

// Add event listeners to difficulty buttons
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

        // Show or hide the falling circles and update sheet height based on the selected difficulty
        toggleHintsVisibility(difficulty);
    });
});

// Set default hints to easy and ensure they are visible on page load
document.addEventListener('DOMContentLoaded', () => {
    const defaultButton = document.querySelector('.difficulty-btn.easy');
    defaultButton.classList.add('selected'); // Highlight 'easy' button as selected
    changeHints('easy');  // Automatically set hints to 'easy'
    toggleHintsVisibility('easy'); // Ensure falling circles and hints are visible by default

    // Ensure falling circles are visible if "medium" is selected
    const mediumButton = document.querySelector('.difficulty-btn.medium');
    if (mediumButton.classList.contains('selected')) {
        toggleHintsVisibility('medium');
    } else {
        toggleHintsVisibility('easy');
    }
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
