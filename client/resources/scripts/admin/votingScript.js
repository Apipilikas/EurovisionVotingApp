import { serverURL } from "./utils/requestUtils.js";
import { io } from "https://cdn.socket.io/4.4.1/socket.io.esm.min.js"

var runningCountryNumber = 0;
const socket = io(serverURL.p3000);

window.onload = init;

function init() {
    
}