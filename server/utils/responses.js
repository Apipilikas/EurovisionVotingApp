var util = require('util');

class DAOResponse {
    constructor(success, data, errorCode) {
        this.success = success;
        this.data = data;
        this.errorCode = errorCode;
    }

    static createSuccessfulResponse(data = null) {
        return new DAOResponse(true, data, null);
    }

    static createFailedResponse(errorCode) {
        return new DAOResponse(false, null, errorCode);
    }
}

class ErrorResponse {
    static ErrorMapping = new Map([
        ["CANNOT_GET_ALL_RECORDS", "A problem occured while fetching all %s."],
        ["CANNOT_GET_SPECIFIC_RECORD", "A problem occured while fetching %s with codes %s."],
        ["RECORD_ALREADY_EXISTS", "%s with code %s already exists."],
        ["NO_RECORD_INSERTED", "%s with code %s has not been inserted."],
        ["CANNOT_INSERT_RECORD", "A problem occured while inserting %s with code %s"],
        ["NO_RECORD_UPDATED", "%s with code %s has not been updated as it does not exist."],
        ["CANNOT_UPDATE_RECORD", "A problem occured while updating %s with code %s"],
        ["NO_RECORD_DELETED", "%s with code %s has not been deleted as it has been already deleted or it does not exist."],
        ["CANNOT_DELETE_RECORD", "A problem occured while deleting %s with code %s"],
        ["JUDGE_PERMISSION_DENIED", "%s %s has no permission to execute this action."],
        ["NO_JUDGE_CREDENTIALS_FOUND", "No authorization token found on headers request."]
    ]
    );

    constructor (code, description) {
        this.code = code;
        this.description = description;
    }

    static create(errorCode, collectionName, value) {
        let errorDescription =  util.format(this.ErrorMapping.get(errorCode), collectionName, value);
        
        return new ErrorResponse(errorCode, errorDescription);
    }

    toJSON() {
        return {error : {code : this.code, description : this.description}};
    }
}

class SocketIOResponse {
    constructor(data, message, hasMultipleMessages = false) {
        this.data = data;
        this.message = message;
        this.hasMultipleMessages = hasMultipleMessages;
    }

    static create(data, message, ...params) {
        let socketIOMessage = this.createMessage(message, ...params);

        let response = new SocketIOResponse(data, socketIOMessage.toJSON());
        return response;
    }

    static createMessage(message, ...params) {
        let plainText = util.format(message, ...params);
        params = params.map((param, index) => {
            return util.format('<span class"prm-%s">%s</span>', index, param);
        });
        let htmlText = util.format(message, ...params);

        return new SocketIOMessage(plainText, htmlText);
    }

    toJSON() {
        let messageCaption = this.hasMultipleMessages ? "messages" : "message"; 
        return {data : this.data, [messageCaption] : this.message};
    }
}

class SocketIOMessage {
    constructor(plainText, htmlText) {
        this.plainText = plainText;
        this.htmlText = htmlText;
    }

    toJSON() {
        return {plainText : this.plainText, htmlText : this.htmlText};
    }
}

module.exports = {DAOResponse, ErrorResponse, SocketIOResponse};