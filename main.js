const button = document.getElementById("button")

button.addEventListener("click", async function () {
    const activeTab = await getActiveTab()
    chrome.scripting.executeScript({
        target: {
            tabId: activeTab.id || -1
        },
        func: function () {
            const result = getHTML()

        }
    })
})

async function getActiveTab() {
    return (await chrome.tabs.query({ active: true }))[0]
}