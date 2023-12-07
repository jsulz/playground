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

  
  console.log('hello world')
})()