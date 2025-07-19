import { DialogConfig } from "../dialogConfig";
import { BaseDialog } from "./BaseDialog";

export class BaseDialogConfig extends DialogConfig {
    
    buttons = []
    
    constructor(title, type, content = null, closeAfterMs = 0) {
        super(title, type, <BaseDialog/>, closeAfterMs);
        this.innerContent = content;
    }

    addButton(title, result, selected = false) {
        this.buttons.push(new BaseDialogButton(title, result, selected));
    }
}

class BaseDialogButton {
    constructor(title, result, selected) {
        this.title = title;
        this.result = result;
        this.selected = selected;
    }
}