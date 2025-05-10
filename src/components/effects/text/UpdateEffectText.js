import { animated, useSpring } from '@react-spring/web';

/**
 * Simple effect animation for text changes.
 * @param {*} children Specified element
 */
export function UpdateEffectText({children, ...props}) {

    const style = useSpring({
    config: {tension : 200, friction : 400, duration : 500},
    opacity : 1,
    transform : "scale(1.0)",
    from: { opacity : 0, transform : "scale(0.0)" },
    reset : true
    });

    return (
        <animated.div style={style} className={props.className}>
            {children}
        </animated.div>
    )
}