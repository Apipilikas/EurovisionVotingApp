import { FetchError } from "./errorUtils.js";

const serverURL = {
    address: "http://192.168.1.70:8080/",
    prefix : "api/v1/"
};

const clientURL = "http://192.168.1.70:5500/";

const Method = {
    GET: "GET",
    POST: "POST",
    PUT: "PUT",
    PATCH: "PATCH",
    DELETE: "DELETE"
}

class ClientResponse {
    constructor(jsonData, status) {
        this.success = IsStatusOK(status);
        this.jsonData = jsonData;
        this.status = status;
    }
}

function IsStatusOK(status) {
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
            jsonDataResponse = (IsStatusOK(response.status)) ? null : await response.json();
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

async function getAllJudges() {
    return sendRequest(Method.GET, "judges/all");
}

async function getSpecificJudge(code) {
    return sendRequest(Method.GET, "judges/" + code);
}

async function createJudge(adminCode, data) {
    return sendRequest(Method.POST, "judges/", data, adminCode);
}

async function updateJudge(adminCode, code, data) {
    return sendRequest(Method.PUT, "judges/" + code, data, adminCode);
}

async function deleteJudge(adminCode, code) {
    return sendRequest(Method.DELETE, "judges/" + code, null, adminCode);
}

// #endregion

// #region Country requests

async function getRunningCountryNumber() {
    return sendRequest(Method.GET, "countries/runningCountry");
}

async function getVotingCountryStatuses() {
    return sendRequest(Method.GET, "countries/votingStatuses/all");
}

async function getVotingCountryStatus(countryCode) {
    return sendRequest(Method.GET, "countries/votingStatuses/" + countryCode);
}

async function getAllCountries() {
    return sendRequest(Method.GET, "countries/all");
}

async function createCountry(adminCode, data) {
    return sendRequest(Method.POST, "countries", data, adminCode);
}

async function updateCountry(adminCode, code, data) {
    return sendRequest(Method.PUT, "countries/" + code, data, adminCode);
}

async function deleteCountry(adminCode, code) {
    return sendRequest(Method.DELETE, "countries/" + code, null, adminCode);
}

async function voteCountry(countryCode, judgeCode, points) {
    let data = { points : points };
    return sendRequest(Method.PATCH, "countries/vote/" + countryCode + "/" + judgeCode, data);
}

// #endregion

//#region Admin requests

async function resetRunningCountry(adminCode) {
    return sendRequest(Method.POST, "admin/runningCountry/reset", null, adminCode);
}

async function resetVotingStatusCache(adminCode) {
    return sendRequest(Method.POST, "admin/cache/votingStatus/reset", null, adminCode);
}

async function resetJudgesCache(adminCode) {
    return sendRequest(Method.POST, "admin/cache/judges/reset", null, adminCode);
}

async function resetCountriesCache(adminCode) {
    return sendRequest(Method.POST, "admin/cache/countries/reset", null, adminCode);
}

async function resetAllCaches(adminCode) {
    return sendRequest(Method.POST, "admin/cache/reset", null, adminCode);
}

async function getAllOnlineJudgeCodes(adminCode) {
    return sendRequest(Method.GET, "admin/onlineJudges/all", null, adminCode);
}

//#endregion

export {
    serverURL,
    clientURL,
    getAllJudges,
    getSpecificJudge,
    createJudge,
    updateJudge,
    deleteJudge,
    getRunningCountryNumber,
    getVotingCountryStatuses,
    getVotingCountryStatus,
    getAllCountries,
    createCountry,
    updateCountry,
    deleteCountry,
    voteCountry,
    resetRunningCountry,
    resetVotingStatusCache,
    resetJudgesCache,
    resetCountriesCache,
    resetAllCaches,
    getAllOnlineJudgeCodes
}