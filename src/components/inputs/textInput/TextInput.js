import React, { useState } from 'react';
import { InputErrorContainer } from '../containers/inputErrorContainer/InputErrorContainer';
import { InputHelpContainer } from '../containers/inputHelpContainer/InputHelpContainer';
import { BaseInput } from '../baseInput/BaseInput';
import { joinProps } from '../../../utils/react/propsUtils';

export function TextInput({caption, helpCaption, value, onChange, error, required, className, style, ...props}) {

    return (
    <div className={joinProps("text-input-container", className)} style={style}>
        <BaseInput {...props} caption={caption} helpCaption={helpCaption} value={value} onChange={onChange} error={error} required={required}/>
    </div>
    );
}

export function EmailInput({caption, helpCaption, value, onChange, required, error, className, style, ...props}) {

    return (
    <div className={joinProps("email-input-container", className)} style={style}>
        <BaseInput {...props} caption={caption} helpCaption={helpCaption} value={value} onChange={onChange} inputType="email" error={error} required={required}/>
    </div>
    );
}