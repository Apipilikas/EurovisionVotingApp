import { generalTemplates } from "../utils/handlebarsUtils.js";

const NotificationType = {
    SUCCESS : "SUCCESS",
    INFO : "INFO",
    WARNING : "WARNING",
    ERROR : "ERROR" 
}

const NotificationClassMapping = new Map([
    [NotificationType.SUCCESS, "notification-success"],
    [NotificationType.INFO, "notification-info"],
    [NotificationType.WARNING, "notification-warning"],
    [NotificationType.ERROR, "notification-error"]
]);

const NotificationIconMapping = new Map([
    [NotificationType.SUCCESS, "check_circle"],
    [NotificationType.INFO, "info"],
    [NotificationType.WARNING, "warning"],
    [NotificationType.ERROR, "error"]
]);

const closeNotificationBoxClassName = "close-notification-box";

export class NotificationBox {
    static Type = NotificationType;

    constructor(type, message, description = null) {
        this.type = type;
        this.message = message;
        this.description = description;
    }

    static show(type, message, description = null, elementID = "display-box-container") {
        let notificationBox = new NotificationBox(type, message, description);

        notificationBox.show(elementID);

        return notificationBox;
    }

    show(elementID) {
        let className = NotificationClassMapping.get(this.type);
        let iconCode = NotificationIconMapping.get(this.type)
        let content = {className : className, icon : iconCode, type : this.type, message : this.message, description : this.description};

        const notificationBoxContainer = document.getElementById(elementID);
        let notificationBoxContent = generalTemplates.notificationBox(content);
        notificationBoxContainer.innerHTML = notificationBoxContent;

        const closeBtn = notificationBoxContainer.querySelector(".close-btn");
        closeBtn.addEventListener("click", e => this.close());
    }

    close() {
        const notificationBox = document.querySelector(".notification-box");
        notificationBox.classList.add(closeNotificationBoxClassName);
    }
}