let currentWordDiv;

function setup() {
    noCanvas(); // Do not create a canvas
    createNewWordDiv(); // Create the initial word div

    // Add event listener to keep focus on the current word div when clicking on blank areas
    document.addEventListener('mousedown', function(event) {
        if (currentWordDiv && currentWordDiv.attribute('contenteditable') === 'true') {
            // If the click target is not a word-div (excluding the currentWordDiv)
            if (!event.target.closest('.word-div')) {
                event.preventDefault(); // Prevent focus from changing
                currentWordDiv.elt.focus();
            }
        }
    });
}

function createNewWordDiv() {
    // Create a new div
    currentWordDiv = createDiv('');
    currentWordDiv.class('word-div');

    // Set random position
    let x = random(windowWidth/100*3, windowWidth/100*94); // Adjust 200 to account for word width
    let y = random(windowWidth/100*5, windowHeight - windowWidth/100*5); // Adjust 100 to account for word height
    currentWordDiv.position(x, y);

    // Make the div content editable
    currentWordDiv.attribute('contenteditable', 'true');

    // Focus on the new div
    currentWordDiv.elt.focus();

    // Add event listener for keydown events
    currentWordDiv.elt.addEventListener('keydown', handleKeyDown);

    // Prevent the div from being draggable while typing
    currentWordDiv.addClass('typing');

    // Remove draggable class if any
    currentWordDiv.removeClass('draggable');
}

function handleKeyDown(event) {
    // Check if space bar is pressed
    if (event.key === ' ') {
        event.preventDefault(); // Prevent default action (do not add space to div)
        let word = currentWordDiv.html(); // Get the content of the div

        // Trim any leading/trailing whitespace
        word = word.trim();

        if (word.length > 0) {
            finalizeWordDiv(currentWordDiv);
            createNewWordDiv(); // Create a new div for the next word
        }
    }
}

function finalizeWordDiv(wordDiv) {
    // Remove contenteditable attribute
    wordDiv.removeAttribute('contenteditable');

    // Remove keydown event listener
    wordDiv.elt.removeEventListener('keydown', handleKeyDown);

    // Make the div draggable
    makeDraggable(wordDiv);

    // Change cursor to move
    wordDiv.addClass('draggable');

    // Remove typing class
    wordDiv.removeClass('typing');
}

function makeDraggable(elm) {
    let offsetX = 0;
    let offsetY = 0;
    let isDragging = false;

    // Mouse down on the element
    elm.elt.addEventListener('mousedown', function(event) {
        // Only start dragging if not contenteditable
        if (!elm.attribute('contenteditable')) {
            isDragging = true;
            offsetX = event.clientX - elm.position().x;
            offsetY = event.clientY - elm.position().y;
            event.preventDefault(); // Prevent text selection
        }
    });

    // Mouse up anywhere on the document
    document.addEventListener('mouseup', function() {
        isDragging = false;
    });

    // Mouse move anywhere on the document
    document.addEventListener('mousemove', function(event) {
        if (isDragging) {
            let newX = event.clientX - offsetX;
            let newY = event.clientY - offsetY;

            // Keep the div within the window boundaries
            newX = constrain(newX, 0, windowWidth - elm.size().width);
            newY = constrain(newY, 0, windowHeight - elm.size().height);

            elm.position(newX, newY);
            event.preventDefault(); // Prevent default behavior
        }
    });
}
