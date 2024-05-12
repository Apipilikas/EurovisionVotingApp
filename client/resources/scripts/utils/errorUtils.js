const defaultHelp = "Contact Aggelos or try reloading the page.";

export class MyError extends Error {
    constructor(message, description, type, innerError, help = defaultHelp) {
        super(message);
        this.description = description;
        this.type = type;
        this.innerError = innerError;
        this.help = help;
    }
}

const defaultLoginHelp = "Redirect to register page to try connect again.";
const defaultLoginDescription = "Error while trying to connect judge."

export class LoginError extends MyError {
    constructor(message, description = defaultLoginDescription, innerError = null, help = defaultLoginHelp + defaultHelp) {
        super(message, description, "JUDGE_LOGIN_ERROR", innerError, help);
    }
}

const defaultFetchHelp = "Check your internet connection and try again.";
const defaultFetchDescription = "Error while trying to communicate with eurovision voting API.";

export class FetchError extends MyError {
    constructor(message, description = defaultFetchDescription, innerError = null, help = defaultFetchHelp + defaultHelp) {
        super(message, description, "FETCH_ERROR", innerError, help);
    }
}

const defaultInitDataDescription = "Error while fetching initialization Data.";

export class InitDataError extends MyError {
    constructor(message, description = defaultInitDataDescription, innerError = null, help = defaultHelp) {
        super(message, description, "INIT_DATA_ERROR", innerError, help);
    }
}