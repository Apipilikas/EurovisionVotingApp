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
    constructor(jsonData, success) {
        this.success = success;
        this.jsonText = jsonData;
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

function isStatusSuccessful(status) {
    return status >= 200 && status < 300;
}

// #region Judge requests

async function getAllJudges() {

    const response = await sendRequest(Method.GET, "judges/all");
    const data = await response.json();

    return new ClientResponse(data, isStatusSuccessful(response.status));
}

function createJudge(data) {

    return sendRequest(Method.POST, "judge", data)
    .then(response => { return (response.status == 201) });
}

function updateJudge(code, data) {

    return sendRequest(Method.PUT, "judge/" + code, data)
    .then(response => { return (response.status == 200) });
}

function deleteJudge(code) {

    return sendRequest(Method.DELETE, "judge/" + code)
    .then(response => { return (response.status == 204) });
}

// #endregion

// #region Country requests

function getRunningCountryNumber() {
    return sendRequest(Method.GET, "country/runningCountry")
    .then(response => {
        if (response.status == 200) {
            return response.json();
        }
        else {
            return null;
        }
    });
}

function getAllCountries() {
    
    return sendRequest(Method.GET, "countries/all")
    .then(response => {
        if (response.status == 200) {
            return response.json();
        }
        else {
            return null;
        }
    });
}

function createCountry(data) {

    return sendRequest(Method.POST, "country", data)
    .then(response => { return (response.status == 201) });
}

function updateCountry(code, data) {

    return sendRequest(Method.PUT, "country/" + code, data)
    .then(response => { return (response.status == 200) });
}

function deleteCountry(code) {

    return sendRequest(Method.DELETE, "country/" + code)
    .then(response => { return (response.status == 204) });
}

function voteCountry(countryCode, judgeCode, points) {
    let judgeCodeParam = "votes." + judgeCode;
    let data = { [judgeCodeParam] : points };

    return updateCountry(countryCode, data);
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