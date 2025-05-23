import React from 'react';
import './HeartStyles.css';

export default function Heart({color1 = "var(--tenth-color)", 
                               color2 = "var(--secondary-color)", 
                               color3 = "var(--forth-color)", 
                               color4 = "var(--seventh-color)"}) {
    return (
        <svg id="eurovision-heart" className='eurovision-heart' xmlns="http://www.w3.org/2000/svg" viewBox="30 80 140 140" width="50px" height="50px" preserveAspectRatio="none">
            <path fill={color4} className="eurovision-heart-4" d="M 136.531 82.243 C 123.111 82.243 107.241 92.154 97.635 108.625 C 95.043 102.677 85.808 96.195 74.83 96.195 C 65.984 96.195 41.154 107.251 41.154 142.935 C 41.154 188.987 87.747 198.443 97.165 212.76 C 97.812 213.745 99.897 214.488 100.692 212.136 C 108.208 189.956 166.483 164.894 166.483 119.757 C 166.483 94.443 149.947 82.244 136.528 82.244 L 136.531 82.243 Z" styles="stroke-width: 2px; stroke-miterlimit: 2.41; fill-rule: nonzero;"/>                        
            <path fill={color3} className="eurovision-heart-3" d="M 136.531 82.243 C 123.111 82.243 107.241 92.154 97.635 108.625 C 95.043 102.677 85.808 96.195 74.83 96.195 C 65.984 96.195 41.154 107.251 41.154 142.935 C 41.154 188.987 87.747 198.443 97.165 212.76 C 97.812 213.745 99.897 214.488 100.692 212.136 C 108.208 189.956 166.483 164.894 166.483 119.757 C 166.483 94.443 149.947 82.244 136.528 82.244 L 136.531 82.243 Z" styles="stroke-width: 2px; stroke-miterlimit: 2.41; fill-rule: nonzero;"/>                        
            <path fill={color2} className="eurovision-heart-2" d="M 136.531 82.243 C 123.111 82.243 107.241 92.154 97.635 108.625 C 95.043 102.677 85.808 96.195 74.83 96.195 C 65.984 96.195 41.154 107.251 41.154 142.935 C 41.154 188.987 87.747 198.443 97.165 212.76 C 97.812 213.745 99.897 214.488 100.692 212.136 C 108.208 189.956 166.483 164.894 166.483 119.757 C 166.483 94.443 149.947 82.244 136.528 82.244 L 136.531 82.243 Z" styles="stroke-width: 2px; stroke-miterlimit: 2.41; fill-rule: nonzero;"/>                        
            <path fill={color1} className="eurovision-heart-1" d="M 136.531 82.243 C 123.111 82.243 107.241 92.154 97.635 108.625 C 95.043 102.677 85.808 96.195 74.83 96.195 C 65.984 96.195 41.154 107.251 41.154 142.935 C 41.154 188.987 87.747 198.443 97.165 212.76 C 97.812 213.745 99.897 214.488 100.692 212.136 C 108.208 189.956 166.483 164.894 166.483 119.757 C 166.483 94.443 149.947 82.244 136.528 82.244 L 136.531 82.243 Z" styles="stroke-width: 2px; stroke-miterlimit: 2.41; fill-rule: nonzero;"/>                        
        </svg>
    );
}