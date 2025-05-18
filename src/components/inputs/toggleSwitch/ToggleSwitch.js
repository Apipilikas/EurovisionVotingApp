import "./ToggleSwitchStyles.css";

export function ToggleSwitch({id, value, onChange}) {

    return (
        <label className="toggle-switch" id={id}>
            <input type="checkbox" onChange={onChange} checked={value}/>
            <span class="slider"></span>
        </label>
    );
}