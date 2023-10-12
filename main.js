// Define the button element
const button = document.getElementById('button');

// Add an event listener to the button
button.addEventListener('click', async () => {
    // Get the active tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    // Execute a script in the active tab
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: () => {
            // Get the HTML content of the active tab
            const html = document.documentElement.outerHTML;

            // Get all div elements with the class "keys-letter"
            const divs = document.querySelectorAll('.keys-letter');

            // Create an empty array to store the letters
            const letters = [];

            // Loop through each div element and its child buttons,
            // and add the text content of the buttons to the array
            divs.forEach(div => {
                const buttons = div.querySelectorAll('.keys-button');
                buttons.forEach(button => {
                    const text = button.textContent;
                    if (button.id === 'keys-middle') {
                        // Add the text content to the beginning of the array
                        letters.unshift(text);
                    } else {
                        // Add the text content to the end of the array
                        letters.push(text);
                    }
                });
            });

            console.log(letters); // Log the array to the console

            const fs = require('fs');

            // Read the contents of the parole.txt file
            fs.readFile('data/parole.txt', 'utf8', (err, data) => {
                if (err) {
                    console.error(err);
                    return;
                }

                const words = data.split('\n'); // Split the contents into an array of words
                const possibleWords = words.filter(word => {
                    const lettersCopy = [...letters]; // Make a copy of the letters array
                    for (const letter of word) {
                        const index = lettersCopy.indexOf(letter); // Check if the letter is in the letters array
                        if (index === -1) {
                            return false; // If the letter is not in the letters array, the word cannot be made
                        }
                        lettersCopy.splice(index, 1); // Remove the letter from the letters array
                    }
                    return true; // If all letters in the word are in the letters array, the word can be made
                });

                console.log(possibleWords); // Log the list of possible words to the console
            });

        },
    });
});