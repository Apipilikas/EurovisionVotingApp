import { ResultButton } from "../utils/customElements/resultButton.js";
import { DocumentUtils } from "../utils/document/documentUtils.js";
import { adminTemplates } from "../utils/handlebarsUtils.js";
import { InitUtils } from "../utils/initUtils.js";
import { JudgeRequests } from "../utils/requestUtils.js";

var loginJudge = null;
var areJudgesLoaded = false;
var judges = [];
const inputsArea = adminTemplates.judges.formInputsArea;

window.onload = init;

async function init() {
    try {
        loginJudge = await InitUtils.initLoginJudge(null).then(response => {return response});

        initBtnListeners();
    }
    catch (e) {DocumentUtils.handleError(e)}
}

//#region Init functions

function initBtnListeners() {
    const createJudgeContainer = document.getElementById("create-judge-container");
    const modifyJudgesContainer = document.getElementById("modify-judges-container");

    createJudgeContainer.addEventListener("click", e => DocumentUtils.fillDetailInputsAreaListener(createJudgeContainer,
                                                                                       modifyJudgesContainer,
                                                                                       inputsArea));

    modifyJudgesContainer.addEventListener("click", e => DocumentUtils.fillDetailInputsAreaListener(modifyJudgesContainer,
                                                                                         createJudgeContainer,
                                                                                         inputsArea,
                                                                                         loadJudges()));

    // createJudgeForm.addEventListener("submit", e => createJudgeFormListener(e));
    DocumentUtils.addSubmitEventListener("#create-judge-form", createJudgeFormListener);

    // modifyJudgesListContainer.addEventListener("click", e => judgeContainerListener(e));
    DocumentUtils.addClickEventListener("#modify-judges-list-container", judgeContainerListener);
    DocumentUtils.addClickEventListener("#modify-btn", modifyBtnListener);
    DocumentUtils.addClickEventListener("#delete-btn", deleteBtnListener);
}

//#endregion

//#region General functions

function loadJudges() {
    if (!areJudgesLoaded) {
        JudgeRequests.getAllJudges()
        .then(response => {

            if (response.success) {
                areJudgesLoaded = true;
                judges = response.jsonData.judges;

                const modifyCountriesListContainer = document.getElementById("modify-judges-list-container");
                modifyCountriesListContainer.innerHTML = adminTemplates.judges.judgeContainer(response.jsonData);
            }
        });
    }
}

function fillInputs(judge) {
    const attributeName = "value";
    DocumentUtils.setElementAttribute("#code-txt", attributeName, judge.code);
    DocumentUtils.setElementAttribute("#name-txt", attributeName, judge.name);
    DocumentUtils.setElementAttribute("#origincountry-txt", attributeName, judge.originCountry);
    DocumentUtils.setElementAttribute("#admin-cbx", "checked", judge.admin);
}

function getJudgeInputsValue() {
    const attributeName = "value";
    const codeValue = DocumentUtils.getElementAttribute("#code-txt", attributeName);
    const nameValue = DocumentUtils.getElementAttribute("#name-txt", attributeName);
    const originCountryValue = DocumentUtils.getElementAttribute("#origincountry-txt", attributeName);
    const adminValue = DocumentUtils.getElementAttribute("#admin-cbx", "checked");

    let judge = {
        code: codeValue,
        name: nameValue,
        originCountry: originCountryValue,
        admin: adminValue
    }

    return judge;
}

//#endregion

//#region Event Listener functions

function createJudgeFormListener(e) {
    e.preventDefault();

    let submitBtn = e.target.querySelector("#submit-btn");

    // TODO: Add validation checks and required fields
    let judge = getJudgeInputsValue();

    ResultButton.getByElement(submitBtn)
    .execute(JudgeRequests.createJudge(loginJudge.code, judge));
}

function judgeContainerListener(e) {
    var judge = judges.find(({code}) => code == e.target.id);
    console.log(e.target.id)

    // TODO: When clicked, highlight the selected container

    fillInputs(judge)
}

function modifyBtnListener(e) {
    e.preventDefault();

    let selectedModifiedJudgeCode = e.target.form.querySelector("#code-txt").value;
    let modifiedJudge = getJudgeInputsValue();
    
    let modifyBtn = e.target;
    ResultButton.getByElement(modifyBtn)
    .execute(JudgeRequests.updateJudge(loginJudge.code, selectedModifiedJudgeCode, modifiedJudge));
}

function deleteBtnListener(e) {
    e.preventDefault();

    let deleteBtn = e.target;
    let selectedModifiedJudgeCode = e.target.form.querySelector("#code-txt").value;

    ResultButton.getByElement(deleteBtn)
    .execute(JudgeRequests.deleteJudge(loginJudge.code, selectedModifiedJudgeCode));
}

//#endregion