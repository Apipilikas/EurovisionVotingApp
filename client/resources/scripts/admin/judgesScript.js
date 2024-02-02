import { ResultButton } from "../customElements/resultButton.js";
import { fillDetailInputsAreaListener } from "../utils/documentUtils.js";
import { adminTemplates } from "../utils/handlebarsUtils.js";
import { createJudge, deleteJudge, getAllJudges, updateJudge } from "../utils/requestUtils.js";

var areJudgesLoaded = false;
var judges = [];
const inputsArea = adminTemplates.judges.formInputsArea;

window.onload = init;

function init() {
    const createJudgeContainer = document.getElementById("create-judge-container");
    const modifyJudgesContainer = document.getElementById("modify-judges-container");
    
    const createJudgeForm = document.getElementById("create-judge-form");
    const modifyJudgesListContainer = document.getElementById("modify-judges-list-container");

    const modifyBtn = document.getElementById("modify-btn");
    const deleteBtn = document.getElementById("delete-btn");

    createJudgeContainer.addEventListener("click", e => fillDetailInputsAreaListener(createJudgeContainer,
                                                                                       modifyJudgesContainer,
                                                                                       inputsArea));

    modifyJudgesContainer.addEventListener("click", e => fillDetailInputsAreaListener(modifyJudgesContainer,
                                                                                         createJudgeContainer,
                                                                                         inputsArea,
                                                                                         loadJudges()));

    createJudgeForm.addEventListener("submit", e => createJudgeFormListener(e));

    modifyJudgesListContainer.addEventListener("click", e => judgeContainerListener(e));

    modifyBtn.addEventListener("click", e => modifyBtnListener(e));

    deleteBtn.addEventListener("click", e => deleteBtnListener(e));
}

function createJudgeFormListener(e) {
    e.preventDefault();

    let submitBtn = e.target.querySelector("#submit-btn");
    let resultBtn = new ResultButton(submitBtn);

    // TODO: Add validation checks and required fields
    let judge = getJudgeInputsValue();

    resultBtn.switchToLoadingState();

    try
    {
        createJudge(judge)
        .then(result => {
            if (result)  resultBtn.switchToSuccessState();
            else resultBtn.switchToFailureState();
        });
    }
    catch (error)
    {
        resultBtn.switchToFailureState();
    }
}

function loadJudges() {
    if (!areJudgesLoaded) {
        getAllJudges()
        .then(response => {

            if (response.success) {
                console.log(response);
                areJudgesLoaded = true;
                
                const modifyCountriesListContainer = document.getElementById("modify-judges-list-container");
                modifyCountriesListContainer.innerHTML = adminTemplates.judges.judgeContainer(response.jsonText);
            }

        })

    }
}

function judgeContainerListener(e) {
    var judge = judges.find(({name}) => name == e.target.id);
    console.log(e.target.id)

    // TODO: When clicked, highlight the selected container

    fillInputs(judge)
}

function fillInputs(judge) {
    document.getElementById("code-txt").value = judge.code;
    document.getElementById("name-txt").value = judge.name;
    document.getElementById("origincountry-txt").value = judge.originCountry;
}

function getJudgeInputsValue() {
    const codeValue = document.getElementById("code-txt").value;
    const nameValue = document.getElementById("name-txt").value;
    const originCountryValue = document.getElementById("origincountry-txt").value;

    let judge = {
        code: codeValue,
        name: nameValue,
        originCountry: originCountryValue
    }

    return judge;
}

function modifyBtnListener(e) {
    e.preventDefault();

    let modifyBtn = e.target;
    let resultBtn = new ResultButton(modifyBtn);

    let selectedModifiedJudgeCode = e.target.form.querySelector("#name-txt").value;
    let modifiedJudge = getJudgeInputsValue();

    resultBtn.switchToLoadingState();

    updateJudge(selectedModifiedJudgeCode, modifiedJudge)
    .then(result => {
        if (result) resultBtn.switchToSuccessState();
        else resultBtn.switchToFailureState();
    });
}

function deleteBtnListener(e) {
    e.preventDefault();

    let deleteBtn = e.target;
    let resultBtn = new ResultButton(deleteBtn);
    let selectedModifiedJudgeCode = e.target.form.querySelector("#name-txt").value;

    resultBtn.switchToLoadingState();

    deleteJudge(selectedModifiedJudgeCode)
    .then(result => {
        if (result) resultBtn.switchToSuccessState();
        else resultBtn.switchToFailureState();
    });
}