export function joinProps(...props) {
    return props.filter(item => item != null).join(" ");
}