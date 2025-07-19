export class DialogConfig {
    
    constructor(title, type, content =  null, closeAfterMs = 0) {
        this.title = title;
        this.type = type;
        this.content = content;
        this.closeAfterMs = closeAfterMs;
    }
}