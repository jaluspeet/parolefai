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
                    }
                    return true;
                }).filter(word => word.includes(letters[0])); // Remove all words that do not contain the first letter



                // Type each word in the filtered list
                for (const word of words_filtered) {

                    for (let i = 0; i < word.length; i++) {
                        const letter = word[i];

                        const event = new KeyboardEvent('keydown', { key: letter });
                        document.dispatchEvent(event);
                        await new Promise(r => setTimeout(r, 20));
                    }

                    // update the content of the window with the new word
                    const event = new KeyboardEvent('keydown', { key: 'Enter' });
                    document.dispatchEvent(event);


                }
            }

            type_words();

        },
    });
});