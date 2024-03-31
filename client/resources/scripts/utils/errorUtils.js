const defaultHelp = "Contact Aggelos or try reloading the page.";

export class MyError extends Error {
    constructor(message, description, type, help = defaultHelp) {
        super(message);
        this.description = description;
        this.type = type;
        this.help = help;
    }
}

const defaultLoginHelp = "Redirect to register page to try connect again.";
const defaultLoginDescription = "Error while trying to connect judge."

export class LoginError extends MyError {
    constructor(message, description = defaultLoginDescription, help = defaultLoginHelp + defaultHelp) {
        super(message, description, "JUDGE_LOGIN_ERROR", help);
    }
}

const defaultFetchDescription = "Error while trying to communicate with eurovision voting API.";

export class FetchError extends MyError {
    constructor(message, description = defaultFetchDescription, help) {
        super(message, description, "FETCH_ERROR", help);
    }
}