function fillDetailInputsAreaListener(currentDetail, otherDetail, inputsArea, callbackFunction = null) {
    if (!currentDetail.hasAttribute("open")) {
        otherDetail.removeAttribute("open");
        
        const currentDetailInputsArea = currentDetail.querySelector(".inputs-area");
        const otherDetailInputsArea = otherDetail.querySelector(".inputs-area");

        currentDetailInputsArea.innerHTML = inputsArea;
        otherDetailInputsArea.innerHTML = "";

        if (typeof callbackFunction === "function") callbackFunction();
    }
}

function areRequiredInputsFilled(inputsArea) {
    const inputs = inputsArea.querySelectorAll("input");

    for (var input in inputs) {
        if (input.hasAttribute("required")) return false;
    }

    return true;
}

// #region Menu button

function initMenuBtnListener() {
    const menuBtn = document.getElementById("menu-button");

    menuBtn.addEventListener("click", e => menuBtnListener(e));
}

function menuBtnListener(e) {
    const menuClassName = "menu-button-clicked";
    const navClassName = "hide-nav";
    let menuBtn = e.target;
    let navigationBar = document.getElementById("header-navigation-bar");

    navigationBar.classList.remove(navClassName);

    if (menuBtn.classList.contains(menuClassName)) {
        menuBtn.classList.remove(menuClassName);
        navigationBar.classList.add(navClassName);
        setTimeout(() => {
            navigationBar.style.display = "none";
        }, 800);
        
    }
    else {
        menuBtn.classList.add(menuClassName);
        navigationBar.style.display = "flex";
    }
}

// #endregion

export {
    fillDetailInputsAreaListener,
    areRequiredInputsFilled,
    initMenuBtnListener
}