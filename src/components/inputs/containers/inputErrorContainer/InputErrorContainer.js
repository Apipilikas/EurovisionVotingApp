import { useSpring, animated } from "react-spring";
import './InputErrorContainerStyles.css';

export function InputErrorContainer({caption}) {

    const hasError = caption != null;

    const {opacity, transform} = useSpring({
        from : {
            opacity : 0,
            transform : "translateY(-2.1em)"
        },
        to : {
            opacity : hasError ? 1 : 0,
            transform : hasError ? "translateY(-0.2em)" : "translateY(-2.1em)"
        }
    });

    return (
        <animated.div class="input-error-container" style={{opacity : opacity, transform : transform}}>
            <i class="material-icons input-error-icon">error</i>
            <span class="input-error-caption">{caption}</span>
        </animated.div>
    );
}