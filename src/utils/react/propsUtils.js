export function joinProps(...props) {
    return props.filter(item => item != null).join(" ");
}

export function getValueOrNull(value) {
    if (value == "") return null;
    return value;
}

export function getValueOrEmpty(value) {
    if (value == null) return "";
    return value;
}

export function clearObjectProps(obj) {
    for (let key of Object.keys(obj)) {
        if (obj[key] != null) obj[key] = null;
    }

    return obj;
}