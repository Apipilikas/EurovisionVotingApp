import { joinProps } from '../../../utils/react/propsUtils';
import { InputHelpContainer } from '../containers/inputHelpContainer/InputHelpContainer';
import './CheckboxStyles.css';

export function Checkbox({caption, value, onChange, ...props}) {
    return (
        <div {...props} className={joinProps("checkbox-input-container", props?.className)}>
            <label htmlFor="chbx">{caption}</label>
            <input className="checkbox" type="checkbox" id="chbx" checked={value} onChange={onChange}/>
            <InputHelpContainer/>
        </div>
    )
}