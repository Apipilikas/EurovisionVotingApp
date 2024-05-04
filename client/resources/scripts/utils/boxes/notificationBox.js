import { DocumentUtils } from "../document/documentUtils.js";
import { generalTemplates } from "../handlebarsUtils.js";

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

/**
 * This class is used to display different kind of information as notification bottom banner. Four types of 
 * notification are supported: Success, Info, Warning an Error.
 */
export class NotificationBox {
    static Type = NotificationType;

    /**
     * NotificationBox constructor
     * @param {NotificationBox.Type} type Notification type
     * @param {string} message Message
     * @param {string} description Description for further understanding
     */
    constructor(type, message, description = null) {
        this.type = type;
        this.message = message;
        this.description = description;
    }

    /**
     * Creates and shows the notification box.
     * @param {NotificationBox.Type} type Notification type
     * @param {string} message Message
     * @param {string} description Description for further understanding
     * @returns {NotificationBox} Returns a NotificationBox instance.
     */
    static show(type, message, description = null) {
        let notificationBox = new NotificationBox(type, message, description);

        notificationBox.show();

        return notificationBox;
    }

    /**
     * Shows the notification box.
     */
    show() {
        let className = NotificationClassMapping.get(this.type);
        let iconCode = NotificationIconMapping.get(this.type)
        let content = {className : className, icon : iconCode, type : this.type, message : this.message, description : this.description};

        const notificationBoxContainer = DocumentUtils.getDisplayBoxContainer();
        let notificationBoxContent = generalTemplates.notificationBox(content);
        notificationBoxContainer.innerHTML = notificationBoxContent;

        const closeBtn = notificationBoxContainer.querySelector(".close-btn");
        closeBtn.addEventListener("click", e => this.close());
    }

    /**
     * Closes the notification box.
     */
    close() {
        const notificationBox = document.querySelector(".notification-box");
        notificationBox.classList.add(closeNotificationBoxClassName);
    }
}