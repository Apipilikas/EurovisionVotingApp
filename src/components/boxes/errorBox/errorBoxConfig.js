export class ErrorBoxConfig {
    constructor(message, description, stackTrace, type, help) {
        this.message = message;
        this.description = description;
        this.stackTrace = stackTrace;
        this.type = type;
        this.help = help;
    }

    static createByMyError(error) {
        let stackTrace = error.stack;

        if (error.innerError != null) {
            stackTrace += "\n Inner Error stack trace \n" + error.innerError.stack;
        }

        return new ErrorBoxConfig(error.message, error.description, stackTrace, error.type, error.help);
    }
}