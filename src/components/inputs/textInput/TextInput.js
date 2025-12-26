import React, { useState } from 'react';
import { InputErrorContainer } from '../containers/inputErrorContainer/InputErrorContainer';
import { InputHelpContainer } from '../containers/inputHelpContainer/InputHelpContainer';
import { BaseInput } from '../baseInput/BaseInput';
import { joinProps } from '../../../utils/react/propsUtils';

export function TextInput({caption, helperCaption, value, onChange, error, required, className, ...props}) {

    return (
    <div className={joinProps("text-input-container", className)}>
        <BaseInput {...props} caption={caption} value={value} onChange={onChange} error={error} required={required}/>
        <InputHelpContainer caption={helperCaption}/>
    </div>
    );
}

export function EmailInput({caption, helperCaption, value, onChange, required, error, className, ...props}) {

    return (
    <div className={joinProps("email-input-container", className)}>
        <BaseInput {...props} caption={caption} value={value} onChange={onChange} inputType="email" error={error} required={required}/>
        <InputHelpContainer caption={helperCaption}/>
    </div>
    );
}