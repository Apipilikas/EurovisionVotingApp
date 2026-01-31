import { DialogResult, DialogType } from "./DialogProvider";
import { BaseDialogConfig } from "./baseDialog/baseDialogConfig";

var DialogUtils = {}

DialogUtils.getDialogIcon = function(type) {
    switch (type) {
        case DialogType.SUCCESS: return "check_circle";
        case DialogType.INFO: return "info";
        case DialogType.WARNING: return "warning";
        case DialogType.ERROR: return "error";
    }
}

DialogUtils.getDialogClassName = function(type) {
    switch (type) {
        case DialogType.SUCCESS: return "success";
        case DialogType.INFO: return "info";
        case DialogType.WARNING: return "warning";
        case DialogType.ERROR: return "error";
    }

    return "";
}

DialogUtils.getConfirmDialogConfig = function(message, okTitle = "OK", cancelTitle = "Cancel") {
    const config = new BaseDialogConfig("Confirm message", DialogType.INFO);
    config.innerContent = <p>{message}</p>;
    config.addButton(okTitle, DialogResult.OK, true);
    config.addButton(cancelTitle, DialogResult.CANCEL, false);

    return config;
}

DialogUtils.getInformDialogConfig = function(title, message) {
    const config = new BaseDialogConfig(title, DialogType.INFO);
    config.innerContent = <p>{message}</p>
    config.addButton("OK", DialogResult.OK, true);

    return config;
}

DialogUtils.getWarningDialogConfig = function(message) {
    const config = new BaseDialogConfig("Warning message", DialogType.WARNING);
    config.innerContent = <p>{message}</p>;
    config.addButton("OK", DialogResult.OK, true);

    return config;
}

DialogUtils.getErrorDialogConfig = function(message) {
    const config = new BaseDialogConfig("Error message", DialogType.ERROR);
    config.innerContent = <p>{message}</p>;
    config.addButton("Close", DialogResult.CLOSE, true);

    return config;
}

export { DialogUtils }