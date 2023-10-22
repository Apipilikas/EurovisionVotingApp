import {  } from "./utils/handlebarsUtils.js";
import { serverURL } from "./utils/requestUtils.js";
import { io } from "https://cdn.socket.io/4.4.1/socket.io.esm.min.js"

const socket = io(serverURL.p3000);

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

socket.on("hi", (arg) => {
    console.log(arg)
})

function connectBtnListener(e) {
    
    //var divs = document.querySelectorAll(".country-container");
    //divs[0].remove();
    //console.log(divs);
}