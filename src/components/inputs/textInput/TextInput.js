import React, { useState } from 'react';
import { InputErrorContainer } from '../containers/inputErrorContainer/InputErrorContainer';
import { InputHelpContainer } from '../containers/inputHelpContainer/InputHelpContainer';
import { BaseInput } from '../baseInput/BaseInput';
import { joinProps } from '../../../utils/react/propsUtils';

export function TextInput({caption, helperCaption, value, onChange, error, required, ...props}) {

    return (
    <div {...props} className={joinProps("text-input-container", props?.className)}>
        <BaseInput caption={caption} value={value} onChange={onChange} error={error} required={required}/>
        <InputHelpContainer caption={helperCaption}/>
        {/* <InputErrorContainer caption={error}/> */}
    </div>
    );
}

export function EmailInput({caption, helperCaption, value, onChange, required, error}) {

    return (
    <div className="email-input-container">
        <BaseInput caption={caption} value={value} onChange={onChange} inputType="email" required={required}/>
        <InputHelpContainer caption={helperCaption}/>
        <InputErrorContainer caption={error}/>
    </div>
    );
}