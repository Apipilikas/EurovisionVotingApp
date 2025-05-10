import React, { forwardRef, useEffect, useState } from 'react';
import './RegisterPageStyles.css';
import {TextInput, EmailInput} from '../../components/inputs/textInput/TextInput';
import { DocumentUtils } from '../../utils/document/documentUtils';
import { BasePage } from '../BasePage';
import { JudgeRequests } from '../../utils/requestUtils';
import SimpleButton from '../../components/inputs/buttons/simpleButton/SimpleButton';
import {useJudges} from '../../hooks/useJudges';
import { useInput } from '../../hooks/useInput';
import { useSession } from '../../components/common/session/SessionProvider';
import { useNavigate } from 'react-router-dom';
import { DialogUtils } from '../../components/dialogs/dialogUtils';
import { useDialog } from '../../components/dialogs/baseDialog/DialogProvider';

export const RegisterPage = forwardRef((props, ref) => {

    return (
        <BasePage socketDependent={false} ref={ref}>
            <Main/>
        </BasePage>
    );
});

function Main() {

    const {showDialog} = useDialog();
    const {connect, getURLParam} = useSession();
    const navigate = useNavigate();
    const judgeCode = getURLParam("judgeCode");

    const [selectedJudgeCode, setSelectedJudgeCode] = useState(judgeCode);

    const nameInput = useInput();
    const emailInput = useInput();

    const handleConnectClick = () => {
        navigate(`/voting?judgeCode=${selectedJudgeCode}`);
        connect(selectedJudgeCode);
    }

    const handleSignInClick = () => {
        let data = {
            name : nameInput.value,
            email : emailInput.value,
            originCountry : "GRE"
        }
        JudgeRequests.registerJudge(data).then(response => {
            if (response.success) {
                const message = `Please visit your email [${data.email}] to activate your account.`;
                const config = DialogUtils.getInformDialogConfig("Activation email", message);
                showDialog(config);
            }
        })
    }
    
    return (
        <main id="connect-page">
            {/* <!-- <div id="caption-container"></div> --> */}
            <div id="connect-page-content">
                <div id="registration-fs-tab-area">
                    <input type="radio" id="register-tab" name="registration-fs-tab-group" className="registration-fs-tab" onChange={(e) => tabListener(e)} defaultChecked/>
                    <label for="register-tab">Register</label>
                
                    <input type="radio" id="sign-up-tab" name="registration-fs-tab-group" className="registration-fs-tab" onChange={(e) => tabListener(e)}/>
                    <label for="sign-up-tab">Sign Up</label>
                </div>
                <fieldset id="registration-fs">
                    {/* <!-- <legend>Register</legend> --> */}
                    
                    <div id="registration-fs-header">
                        <h2>Welcome back!</h2>
                        <p id="register-description" tabIndex="0">Connect as a judge</p>
                        <p id="sign-up-description" tabIndex="1">Sign up to be able to connect</p>
                    </div>
    
                    <div id="registration-fs-content">
                        <JudgeList selectedJudgeCode={selectedJudgeCode} onSelectedJudgeChanged={setSelectedJudgeCode}/>
    
                        <div id="sign-up-container" tabIndex="1">
                            <TextInput caption="Name" helperCaption="Insert your name." {...nameInput}/>
                            <EmailInput caption="Email" helperCaption="Insert your email." {...emailInput}/>
                        </div>
                    </div>
    
                    <div id="buttons-area">
                        <SimpleButton id="connect-btn" caption="Connect" tabindex="0" onButtonClicked={handleConnectClick}/>
                        <SimpleButton id="sign-up-btn" caption="Sign Up" tabindex="1" onButtonClicked={handleSignInClick}/>
                    </div>
                </fieldset>
            </div>
            
            <div id="display-box-container"></div>
        </main>
    );
};

function JudgeList({selectedJudgeCode, onSelectedJudgeChanged}) {

    const {judges} = useJudges();

    const handleOnChange = (e) => {
        let {value} = e.target;
        if (onSelectedJudgeChanged) {
            onSelectedJudgeChanged(value);
        }
    }

    return (
        <div id="judges-list-container" tabIndex="0">
            {judges.map(judge => {
                const judgeID = `judge-name-${judge.code}`;
                const onlineClassName = judge.online ? "online" : "offline";
                
                return (
                    <div className='judge-container' key={judge.code}>
                        <input type="radio" id={judgeID} name="choose-judge" value={judge.code} defaultChecked={judge.code == selectedJudgeCode} onChange={handleOnChange} />
                        <label for={judgeID}>
                        <div class="judge-content"><div class={`online-status-container ${onlineClassName}`}></div><span>{judge.name}</span></div>
                        </label>
                    </div>
                );
            })}
        </div>
);
}

//#region Event Listener functions

function tabListener(e) {
    const isRegisterTabChecked = e.target.id === "register-tab";

    if (isRegisterTabChecked) {
        DocumentUtils.setStyle("[tabindex='0'] ALL", "display", "initial");
        DocumentUtils.setStyle("[tabindex='1'] ALL", "display", "none");
    }
    else {
        DocumentUtils.setStyle("[tabindex='0'] ALL", "display", "none");
        DocumentUtils.setStyle("[tabindex='1'] ALL", "display", "initial");
    }
}

function connectBtnListener() {
    
}

function signUpBtnListener() {
    
}

//#endregion