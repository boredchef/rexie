const button = document.createElement("div");
button.classList.add("Character");
button.style.background = "none";
button.style.position = "fixed";
button.style.bottom = 0;
button.style.left = 0;
button.style.pointerEvents = "auto";
button.style.zIndex = 99999;

const img = document.createElement('img');
img.src = chrome.runtime.getURL('images/DinoSprites.png');
img.classList.add("Character_spritesheet", "pixelart");
button.append(img);

document.body.appendChild(button);

button.addEventListener("click", async function(e) {
    img.style.animation = "none";
    img.style.transform = "translate3d(-2352px,0,0)";
    let time = await chrome.runtime.sendMessage({ action: 'get-time-yo'});
    const timestamp = Object.values(time.data)[0];
    const title = time.title;
    console.log(title);
    const minutes = Math.floor((Date.now() - timestamp) / 1000 / 60);
    console.log(`you have been on ${title} for ${minutes} minutes`);
    setTimeout(() => {
        document.body.removeChild(button)
    }, 1000);

})
