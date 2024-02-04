const serverURL = {
    p8080: "http://localhost:8080/",
    p3000: "http://localhost:3000/",
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

function sendRequest(method, urlEnding, data = null) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    let jsonData = (data == null) ? null : JSON.stringify(data);

    let requestInit = {
        method: method,
        headers: headers,
        body: jsonData
    };

    let url = serverURL.p8080 + serverURL.prefix + urlEnding;

    return fetch(url, requestInit);
}

// #region Judge requests

async function getAllJudges() {
    const response = await sendRequest(Method.GET, "judges/all");
    const jsonData = await response.json();

    return new ClientResponse(jsonData, response.status);
}

async function createJudge(data) {
    const response = await sendRequest(Method.POST, "judges", data);
    const jsonData = (IsStatusOK(response.status)) ? null : await response.json();

    return new ClientResponse(jsonData, response.status);
}

async function updateJudge(code, data) {
    const response = await sendRequest(Method.PUT, "judges/" + code, data);
    const jsonData = (IsStatusOK(response.status)) ? null : await response.json();

    return new ClientResponse(jsonData, response.status);
}

async function deleteJudge(code) {
    const response = await sendRequest(Method.DELETE, "judges/" + code);
    const jsonData = (IsStatusOK(response.status)) ? null : await response.json();

    return new ClientResponse(jsonData, response.status);
}

// #endregion

// #region Country requests

async function getRunningCountryNumber() {
    const response = await sendRequest(Method.GET, "countries/runningCountry");
    const jsonData = await response.json();

    return new ClientResponse(jsonData, response.status);
}

async function getAllCountries() {
    const response = await sendRequest(Method.GET, "countries/all");
    const jsonData = await response.json();

    return new ClientResponse(jsonData, response.status);
}

async function createCountry(data) {
    const response = await sendRequest(Method.POST, "countries", data);
    const jsonData = (IsStatusOK(response.status)) ? null : await response.json();

    return new ClientResponse(jsonData, response.status);
}

async function updateCountry(code, data) {
    const response = await sendRequest(Method.PUT, "countries/" + code, data);
    const jsonData = (IsStatusOK(response.status)) ? null : await response.json();

    return new ClientResponse(jsonData, response.status);
}

async function deleteCountry(code) {
    const response = await sendRequest(Method.DELETE, "countries/" + code);
    const jsonData = (IsStatusOK(response.status)) ? null : await response.json();

    return new ClientResponse(jsonData, response.status);
}

async function voteCountry(countryCode, judgeCode, points) {
    let data = { points : points };

    const response = await sendRequest(Method.PATCH, "countries/vote/" + countryCode + "/" + judgeCode, data);
    const jsonData = (IsStatusOK(response.status)) ? null : await response.json();

    return new ClientResponse(jsonData, response.status);
}

// #endregion

export {
    serverURL,
    clientURL,
    getAllJudges,
    createJudge,
    updateJudge,
    deleteJudge,
    getRunningCountryNumber,
    getAllCountries,
    createCountry,
    updateCountry,
    deleteCountry,
    voteCountry
}