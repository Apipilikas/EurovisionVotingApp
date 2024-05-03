import { FetchError } from "./errorUtils.js";

const serverURL = {
    address: "http://127.0.0.1:8080/",
    prefix : "api/v1/"
};

const clientURL = "http://127.0.0.1:5500/";

const Method = {
    GET: "GET",
    POST: "POST",
    PUT: "PUT",
    PATCH: "PATCH",
    DELETE: "DELETE"
}

//#region Namespaces

var JudgeRequests = {};
var CountryRequests = {};
var AdminRequests = {};

//#endregion

class ClientResponse {
    constructor(jsonData, status) {
        this.success = isStatusOK(status);
        this.jsonData = jsonData;
        this.status = status;
    }
}

function isStatusOK(status) {
    return status == 200 || status == 201 || status == 204;
}

async function sendRequest(method, urlEnding, data = null, token = null) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    if (token != null) {
        headers.append("Authorization", token)
    }

    let jsonData = (data == null) ? null : JSON.stringify(data);

    let requestInit = {
        method: method,
        headers: headers,
        body: jsonData
    };

    let url = serverURL.address + serverURL.prefix + urlEnding;

    let response;
    let jsonDataResponse;

    try {
        response = await fetch(url, requestInit);
        if (method != Method.GET) {
            jsonDataResponse = (isStatusOK(response.status)) ? null : await response.json();
        }
        else {
            jsonDataResponse = await response.json();
        }
    }
    catch (e) {
        throw new FetchError("Unable to send request.", undefined, e);
    }

    return new ClientResponse(jsonDataResponse, response.status);
}

// #region Judge requests

JudgeRequests.getAllJudges = async function() {
    return sendRequest(Method.GET, "judges/all");
}

JudgeRequests.getSpecificJudge = async function(code) {
    return sendRequest(Method.GET, "judges/specific/" + code);
}

JudgeRequests.createJudge = async function(adminCode, data) {
    return sendRequest(Method.POST, "judges/", data, adminCode);
}

JudgeRequests.updateJudge = async function(adminCode, code, data) {
    return sendRequest(Method.PUT, "judges/" + code, data, adminCode);
}

JudgeRequests.deleteJudge = async function(adminCode, code) {
    return sendRequest(Method.DELETE, "judges/" + code, null, adminCode);
}

// #endregion

// #region Country requests

CountryRequests.getRunningCountryNumber = async function() {
    return sendRequest(Method.GET, "countries/runningCountry");
}

CountryRequests.getVotingCountryStatuses = async function() {
    return sendRequest(Method.GET, "countries/votingStatuses/all");
}

CountryRequests.getVotingCountryStatus = async function(countryCode) {
    return sendRequest(Method.GET, "countries/votingStatuses/" + countryCode);
}

CountryRequests.getAllCountries = async function() {
    return sendRequest(Method.GET, "countries/all");
}

CountryRequests.createCountry = async function(adminCode, data) {
    return sendRequest(Method.POST, "countries", data, adminCode);
}

CountryRequests.updateCountry = async function(adminCode, code, data) {
    return sendRequest(Method.PUT, "countries/" + code, data, adminCode);
}

CountryRequests.deleteCountry = async function(adminCode, code) {
    return sendRequest(Method.DELETE, "countries/" + code, null, adminCode);
}

CountryRequests.voteCountry = async function(countryCode, judgeCode, points) {
    let data = { points : points };
    return sendRequest(Method.PATCH, "countries/vote/" + countryCode + "/" + judgeCode, data);
}

CountryRequests.getWinnerCountry = async function() {
    return sendRequest(Method.GET, "countries/winnerCountry");
}

// #endregion

//#region Admin requests

AdminRequests.resetRunningCountry = async function(adminCode) {
    return sendRequest(Method.POST, "admin/runningCountry/reset", null, adminCode);
}

AdminRequests.resetVotingStatusCache = async function(adminCode) {
    return sendRequest(Method.POST, "admin/cache/votingStatus/reset", null, adminCode);
}

AdminRequests.resetJudgesCache = async function(adminCode) {
    return sendRequest(Method.POST, "admin/cache/judges/reset", null, adminCode);
}

AdminRequests.resetCountriesCache = async function(adminCode) {
    return sendRequest(Method.POST, "admin/cache/countries/reset", null, adminCode);
}

AdminRequests.resetAllCaches = async function(adminCode) {
    return sendRequest(Method.POST, "admin/cache/reset", null, adminCode);
}

AdminRequests.getAllOnlineJudgeCodes =  async function(adminCode) {
    return sendRequest(Method.GET, "admin/onlineJudges/all", null, adminCode);
}

AdminRequests.setWinnerCountry = async function(adminCode, countryCode) {
    let data = {code : countryCode}
    return sendRequest(Method.POST, "admin/winnerCountry", data, adminCode);
}

AdminRequests.clearWinnerCountry = async function(adminCode) {
    return sendRequest(Method.POST, "admin/winnerCountry/clear", null, adminCode);
}

//#endregion

export {
    serverURL,
    clientURL,
    JudgeRequests,
    CountryRequests,
    AdminRequests
}