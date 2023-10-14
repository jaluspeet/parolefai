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

            const letters = [];
            async function fetch_words() {
                const response = await fetch(chrome.runtime.getURL('data/parole.txt'));
                const data = await response.text();
                return data;
            }

            // Find today's letters
            const divs = document.querySelectorAll('.keys-letter');
            divs.forEach(div => {
                const buttons = div.querySelectorAll('.keys-button');
                buttons.forEach(button => {
                    const text = button.textContent;
                    if (button.id === 'keys-middle') {
                        letters.unshift(text);
                    } else {
                        letters.push(text);
                    }
                });
            });

            // Filter the words
            async function type_words() {
                const words_raw = await fetch_words();
                const words_list = words_raw.split('\n');

                // Remove all words that contain letters not present in the letters array
                const words_filtered = words_list.filter(word => {
                    for (let i = 0; i < word.length; i++) {
                        if (!letters.includes(word[i])) {
                            return false;
                        }
                        else {
                            return true;
                        }
                    }
                }).filter(word => word.includes(letters[0])); // Remove all words that do not contain the first letter

                return words_filtered;
            }

            // main
            async function main() {
                const words_filtered = await type_words();
                for (const word of words_filtered) {
                    for (let i = 0; i < word.length; i++) {
                        const letter = word[i];
                        setTimeout(() => {
                            const event = new KeyboardEvent('keydown', { key: letter });
                            document.dispatchEvent(event);
                        }, i * 1000); // wait 100ms between every keypress
                    }
                    setTimeout(() => {
                        const event = new KeyboardEvent('keydown', { key: 'Enter' });
                        document.dispatchEvent(event);
                    }, word.length * 1000); // wait 100ms after typing the whole word
                }
            }

            main();

        },
    });
});