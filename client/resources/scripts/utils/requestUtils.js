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
    DELETE: "DELETE"
}

class ClientResponse {
    constructor(jsonData, status) {
        this.success = status >= 200 && status < 300;
        this.jsonText = jsonData;
        this.status = status;
    }
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
    const response = await sendRequest(Method.GET, "judge/all");
    const data = await response.json();

    return new ClientResponse(data, response.status);
}

async function createJudge(data) {
    const response = await sendRequest(Method.POST, "judge", data);
    const data = await response.json();

    return new ClientResponse(data, response.status);
}

async function updateJudge(code, data) {
    const response = await sendRequest(Method.PUT, "judge/" + code, data);
    const data = await response.json();

    return new ClientResponse(data, response.status);
}

async function deleteJudge(code) {
    const response = await sendRequest(Method.DELETE, "judge/" + code);
    const data = await response.json();

    return new ClientResponse(data, response.status);
}

// #endregion

// #region Country requests

async function getRunningCountryNumber() {
    const response = await sendRequest(Method.GET, "country/runningCountry");
    const data = await response.json();

    return new ClientResponse(data, response.status);
}

async function getAllCountries() {
    const response = await sendRequest(Method.GET, "country/all");
    const data = await response.json();

    return new ClientResponse(data, response.status);
}

async function createCountry(data) {
    const response = await sendRequest(Method.POST, "country", data);
    const data = await response.json();

    return new ClientResponse(data, response.status);
}

async function updateCountry(code, data) {
    const response = await sendRequest(Method.PUT, "country/" + code, data);
    const data = await response.json();

    return new ClientResponse(data, response.status);
}

async function deleteCountry(code) {
    const response = await sendRequest(Method.DELETE, "country/" + code);
    const data = await response.json();

    return new ClientResponse(data, response.status);
}

async function voteCountry(countryCode, judgeCode, points) {
    let judgeCodeParam = "votes." + judgeCode;
    let json = { [judgeCodeParam] : points };

    const response = await updateCountry(countryCode, json);
    const data = await response.json();

    return new ClientResponse(data, response.status);
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