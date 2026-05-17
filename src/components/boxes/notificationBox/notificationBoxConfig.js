import { DialogConfig } from "../../dialogs/dialogConfig";
import { NotificationBox } from "./NotificationBox";

export class NotificationBoxConfig extends DialogConfig {
    constructor(title, type, description) {
        super(title, type, <NotificationBox/>);
        this.description = description;
    }
}