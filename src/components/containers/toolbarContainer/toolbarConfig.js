export class ToolbarConfig {
    
    items = [];

    constructor(vertical = true) {
        this.vertical = vertical;
    }

    addToolbarItem(id, caption, icon) {
        this.items.push(new ToolbarItem(id, caption, icon));
    }
}

export class ToolbarItem {
    constructor(id, caption, icon) {
        this.id = id;
        this.caption = caption;
        this.icon = icon;
    }
}