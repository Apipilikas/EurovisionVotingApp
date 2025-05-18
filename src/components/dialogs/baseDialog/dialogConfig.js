export class DialogConfig {
    
    buttons = []
    
    constructor(title, type, content =  null, closeAfterMs = 0) {
        this.title = title;
        this.type = type;
        this.content = content;
        this.closeAfterMs = closeAfterMs;
    }

    addButton(title, result, selected = false) {
        this.buttons.push(new DialogButton(title, result, selected));
    }
}

class DialogButton {
    constructor(title, result, selected) {
        this.title = title;
        this.result = result;
        this.selected = selected;
    }
}