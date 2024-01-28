const serverURL = {
    p8080: "http://localhost:8080/",
    p3000: "http://localhost:3000/"
};

const clientURL = "http://127.0.0.1:5500/";

const Method = {
    GET: "GET",
    POST: "POST",
    PUT: "PUT",
    DELETE: "DELETE"
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

    let url = serverURL.p8080 + urlEnding;

    return fetch(url, requestInit);
}

// #region Judge requests

function getAllJudges() {

    return sendRequest(Method.GET, "judges/all")
    .then(response => {
        if (response.status == 200) {
            return response.json();
        }
        else {
            return null;
        }
    });
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