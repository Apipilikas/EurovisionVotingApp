import { FunctionUtils } from "../utils/functionUtils";

/**
 * Merges the values, properties and functions returned by another hook with the component's incoming props.
 * If a prop is not provided, the value from the hook is used instead as a fallback.
 * @param {Function} hook Main hook
 * @param {[] | {}} hookParams Hook parameters. The can be provided as an array keeping the parameters order or as an object.
 * @param {{}} props The incoming props
 */
export function useFallbackHookProps(hook, hookParams = {}, props = {}) {

    // Function
    const getHookParams = () => {
        if (hookParams == null) return [];

        if (Array.isArray(hookParams))
            return hookParams;
        else
            return FunctionUtils.getParameterNames(hook).map(param => hookParams[param]);
    }
    
    // Hook initialization
    const hookProps = hook(...getHookParams());

    const [matchedProps, restProps] = Object.entries(props).reduce(
        ([matchedProps, restProps], [key, value]) => {
            if (key in hookProps) {
                // If matched, get the props value, otherwise get the fallback.
                matchedProps[key] = (value !== undefined) ? value : hookProps[key]; 
            } 
            else {
                restProps[key] = value;
            }

            return [matchedProps, restProps];
        },    
        [{}, {}]
  );

    return {
        ...hookProps,
        ...matchedProps,
        ...restProps
    };
}