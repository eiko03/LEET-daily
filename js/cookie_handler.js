

document.addEventListener("DOMContentLoaded", event => {

    // visible in the webpage's devtools console
    console.log("content script:", document.cookie);

    // visible in the webpage's DOM
    const p = document.createElement("p");
    document.body.prepend(p);
    p.classList.add("cookie");
    p.textContent = document.cookie;
});