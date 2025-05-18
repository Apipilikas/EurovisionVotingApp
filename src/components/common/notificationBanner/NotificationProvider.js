import { createContext, useContext, useState } from "react";
import { ReactListUtils } from "../../../utils/react/listUtils";

let defaultNotification = "United By Music";

const CollectionContext = createContext();

export const useNotificationCollection = () => useContext(CollectionContext);

export const NotificationPriority = {
    LOW : "LOW",
    MEDIUM : "MEDIUM",
    HIGH : "HIGH"
}

export const NotificationStatus = {
    SET : 0,
    NOTSET : 1,
    DEFAULT : 2
}

export default function NotificationCollectionProvider({children}) {

    const lowPriority = [];
    const mediumPriority = [];
    const highPriority = [];
    const [runningAnnouncement, setRunningAnnouncement] = useState(NotificationStatus.NOTSET);

    const addNotification = (priority, notification) => {
        switch (priority) {
            case NotificationPriority.HIGH: 
                highPriority.push(notification);
                break;

            case NotificationPriority.MEDIUM: 
                mediumPriority.push(notification)
                break;

            case NotificationPriority.LOW: 
            default:
                lowPriority.push(notification);
            break;
        }

        setRunningAnnouncement(NotificationStatus.SET);
    }

    const getNextNotification = () => {
        let nextNotification = defaultNotification;

        if (highPriority.length > 0) {
            nextNotification = highPriority.shift();
        }
        else if (mediumPriority.length > 0) {
            nextNotification = mediumPriority.shift();
        }
        else if (lowPriority.length > 0) {
            nextNotification = lowPriority.shift();
        }
        else {
            setRunningAnnouncement(NotificationStatus.DEFAULT);
        }

        return nextNotification;
    }

    const hasMoreNotifications = () => {
        return runningAnnouncement != NotificationStatus.DEFAULT;
    }

    return (
        <CollectionContext.Provider value={{addNotification, getNextNotification, hasMoreNotifications}}>
            {children}
        </CollectionContext.Provider>
    );
};