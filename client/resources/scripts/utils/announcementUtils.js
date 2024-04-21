const defaultAnnouncement = "UNITED BY MUSIC";

export class AnnouncementHelper {
    static Priority = {
        LOW : "LOW",
        MEDIUM : "MEDIUM",
        HIGH : "HIGH"
    }

    static Status = {
        SET : 0,
        NOTSET : 1,
        DEFAULT : 2
    }

    constructor() {
        this.lowPriority = [];
        this.mediumPriority = [];
        this.highPriority = [];
        this.runningAnnouncement = AnnouncementHelper.Status.NOTSET;
    }

    addAnnouncement(priority, announcement) {
        switch (priority) {
            case AnnouncementHelper.Priority.HIGH: 
                this.highPriority.push(announcement);
                break;
            case AnnouncementHelper.Priority.MEDIUM: 
                this.highPriority.push(announcement);
                break;
            case AnnouncementHelper.Priority.LOW: 
            default:
            this.highPriority.push(announcement);
            break;
        }

        this.runningAnnouncement = AnnouncementHelper.Status.SET;
    }

    getNextAnnouncement() {
        let nextAnnouncement = defaultAnnouncement;

        if (this.highPriority.length > 0) {
            nextAnnouncement = this.highPriority.shift();
        }
        else if (this.mediumPriority.length > 0) {
            nextAnnouncement = this.mediumPriority.shift();
        }
        else if (this.lowPriority.length > 0) {
            nextAnnouncement = this.lowPriority.shift();
        }
        else {
            this.runningAnnouncement = AnnouncementHelper.Status.DEFAULT;
        }

        return nextAnnouncement;
    }

    hasMoreAnnouncements() {
        return this.runningAnnouncement != AnnouncementHelper.Status.DEFAULT;
    }
}

export var AnnouncementUtils = {};

AnnouncementUtils.initAnnouncementContainer = function(announcementHelper) {
    const announcementContainer = document.getElementById("announcement-content");
    var pElement = announcementContainer.firstChild;

    if (pElement == null) return;
    
    setInterval(() => {
        let pElement = announcementContainer.querySelector("p");
        if (pElement == null) return;
        
        if (!announcementHelper.hasMoreAnnouncements()) return;
        
        let nextAnnouncement = announcementHelper.getNextAnnouncement();

        pElement.classList.add("hide-announcement-box");

        setTimeout(() => {
            pElement.classList.remove("hide-announcement-box");
            pElement.innerHTML = nextAnnouncement;
        }, 1000);
    }, 4000);
}