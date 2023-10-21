import { templates } from "./utils/handlebarsUtils.js";

window.onload = init;

function init() {
    
    const countriesCarousel = document.getElementById("countries-carousel");
    const c = {"countries" : [{name:"GR"}, {name:"GER"}, {name:"ALB"}, {name:"CR"}, {name:"SER"}]};

    let content = templates.countries(c);
    console.log(content);
    //countriesCarousel.innerHTML = content;

    const connectBtn = document.getElementById("connect-btn");

    connectBtn.addEventListener("click", connectBtnListener);
}

function connectBtnListener(e) {
    
    //var divs = document.querySelectorAll(".country-container");
    //divs[0].remove();
    //console.log(divs);
}