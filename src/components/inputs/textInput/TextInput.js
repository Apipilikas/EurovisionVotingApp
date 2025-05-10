import React, { useState } from 'react';
import { InputErrorContainer } from '../containers/inputErrorContainer/InputErrorContainer';
import { InputHelpContainer } from '../containers/inputHelpContainer/InputHelpContainer';
import { BaseInput } from '../baseInput/BaseInput';
import { joinProps } from '../../../utils/react/propsUtils';

export function TextInput({caption, helperCaption, value, onChange, ...props}) {

    return (
    <div {...props} className={joinProps("text-input-container", props?.className)}>
        <BaseInput caption={caption} value={value} onChange={onChange}/>
        <InputHelpContainer caption={helperCaption}/>
        <InputErrorContainer/>
    </div>
    );
}

export function EmailInput({caption, helperCaption, value, onChange}) {

    return (
    <div className="email-input-container">
        <BaseInput caption={caption} value={value} onChange={onChange} inputType="email"/>
        <InputHelpContainer caption={helperCaption}/>
        <InputErrorContainer/>
    </div>
    );
}