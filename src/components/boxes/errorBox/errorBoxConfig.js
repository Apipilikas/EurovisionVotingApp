import { DialogType } from "../../dialogs/DialogProvider";
import { DialogConfig } from "../../dialogs/dialogConfig";
import { ErrorBox } from "./ErrorBox";

export class ErrorBoxConfig extends DialogConfig {
    constructor(title, description, stackTrace, errorType, help, closeAfterMs = 0) {
        super(title, DialogType.ERROR, <ErrorBox/>, closeAfterMs)
        this.description = description;
        this.errorType = errorType;
        this.stackTrace = stackTrace;
        this.help = help;
    }

    static createByMyError(error) {
        let stackTrace = error.stack;

        if (error.innerError != null) {
            stackTrace += "\n Inner Error stack trace \n" + error.innerError.stack;
        }

        return new ErrorBoxConfig(error.message, error.description, stackTrace, error.type, error.help);
    }
}