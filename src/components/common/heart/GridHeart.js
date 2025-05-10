import Heart from "./Heart";

export function GridHeart() {

    let element = [];

    for (let i = 0; i < 50; i++) {
        element.push(<Heart/>)
    }

    return (
        <div>
            {element}
        </div>
    )
}