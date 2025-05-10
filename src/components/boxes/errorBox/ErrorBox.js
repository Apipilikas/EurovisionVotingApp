import { forwardRef, useImperativeHandle, useState } from "react";
import './ErrorBoxStyles.css';
import { useDialog } from "../../dialogs/baseDialog/DialogProvider";
import { DialogResult } from "../../dialogs/baseDialog/BaseDialog";

const closeErrorBoxClassName = "close-error-box";

export function ErrorBox() {

    const {isDialogOpen, showDialog, closeDialog, registerEvent, dialogConfig} = useDialog();

    if (!dialogConfig) return;
    const {message, description, stackTrace, type, help} = dialogConfig;

    return (
        <div class={`error-box ${isDialogOpen ? "" : closeErrorBoxClassName}`}>

            <div class="top-container">
                <div class="icon-container">
                    <i class="material-icons">error</i>
                    <span>Error</span>
                </div>
                <div class="message-container">
                    <h1 class="error-message">{message}</h1>
                    <p class="error-description">{description}</p>
                </div>
                <span class="close-btn" onClick={() => closeDialog(DialogResult.CLOSE)}>&times;</span>
            </div>

            <div class="bottom-container">
                <details class="error-details-container">
                    <summary>More information</summary>
                    <div class="error-details-content">
                        <p class="error-caption">Stack trace:</p>
                        <p class="error-text">{stackTrace}</p>
                        <button class="copy-btn">Copy</button>
                        <p class="error-caption">Error type:</p>
                        <p class="error-text">{type}</p>
                    </div>
                </details>
                <details class="error-details-container help-container" open>
                    <summary>Help</summary>
                    <div class="error-details-content">
                        <p class="error-caption">Try the following:</p>
                        <p class="error-text">{help}</p>
                        <a class="reload-page-link" href={window.location.href}>Reload Page</a>
                    </div>
                </details>
            </div>
        </div>
    );
    
};