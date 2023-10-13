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

            // Log the array to the console
            console.log(letters);

            async function fetch_words() {
                const response = await fetch(chrome.runtime.getURL('data/parole.txt'));
                const data = await response.text();
                return data;
            }

            async function filter_words() {
                const words = await fetch_words();
                const words_list = words.split('\n');
                console.log(letters);
                const filtered_words = words_list.filter(word => {
                    const word_letters = word.split('');
                    return word_letters.every(letter => letters.includes(letter));
                });
                console.log(filtered_words);
            }

            filter_words();
        },
    });
});