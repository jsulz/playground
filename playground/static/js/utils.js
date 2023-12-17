(() => { 
    'use strict'

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    const toastTrigger = document.getElementById('copy-select-all')
    const toastLive = document.getElementById('liveToast')

    if (toastTrigger) {
        const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLive)
        toastTrigger.addEventListener('click', async () => {
            toastBootstrap.show()
            await sleep(3000);
            toastBootstrap.hide()
        })
    }
    
    const selectAllButton = document.getElementById('copy-select-all')
    if (selectAllButton) {
        selectAllButton.addEventListener('click', async () => {
            try {
                const element = document.querySelector(".user-select-all");
                await navigator.clipboard.writeText(element.textContent);
            } catch (error) {
                console.error("Failed to copy to clipboard:", error);
            }

        })
    }

    const diceCount = document.getElementById('dicecount')
    const diceCountLabel = document.getElementById('dicecountBlock')
    if(diceCount) {
        diceCountLabel.textContent = "Dice: " + diceCount.value
        diceCount.addEventListener('input', (event) => {
            diceCountLabel.textContent = "Dice: " + event.target.value
        })
    }

    const diceSides = document.getElementById('dicesides')
    const diceSidesLabel = document.getElementById('dicesideBlock')
    if(diceSides) {
        diceSidesLabel.textContent = "Sides: " + diceSides.value
        diceSides.addEventListener('input', (event) => {
            diceSidesLabel.textContent = "Sides: " + event.target.value
        })
    }
  
})()