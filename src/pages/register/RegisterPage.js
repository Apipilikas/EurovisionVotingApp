import React, { forwardRef, useEffect, useRef, useState } from 'react';
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
import { useDialog } from '../../components/dialogs/DialogProvider';
import { DialogType } from '../../components/dialogs/DialogProvider';
import { NotificationBoxConfig } from '../../components/boxes/notificationBox/notificationBoxConfig';
import { BaseDialogConfig } from '../../components/dialogs/baseDialog/baseDialogConfig';
import { ErrorBoxConfig } from '../../components/boxes/errorBox/errorBoxConfig';
import { BaseSelector } from '../../components/inputs/selectors/baseSelector/BaseSelector';
import { ListSelector } from '../../components/inputs/selectors/listSelector/ListSelector';
import { TableSelector } from '../../components/inputs/selectors/tableSelector/TableSelector';
import { useInputValidation } from '../../hooks/useInputValidation';
import { TabContainer, TabsContainer } from '../../components/containers/tabsContainer/TabsContainer';
import { useCountries } from '../../hooks/useCountries';
import { FormContainer } from '../../components/containers/formContainer/FormContainer';

export function RegisterPage() {

    return (
        <BasePage socketDependent={false}>
            <Main/>
        </BasePage>
    );
};

function Main() {

    const {showDialog} = useDialog();
    const {connect, getURLParam} = useSession();
    const {countries} = useCountries();

    const navigate = useNavigate();
    const judgeCode = getURLParam("judgeCode");

    const [selectedJudgeCode, setSelectedJudgeCode] = useState(judgeCode);

    const nameInput = useInputValidation();
    const emailInput = useInputValidation();
    const originCountryInput = useInputValidation();

    const formRef = useRef();

    const handleConnectClick = () => {
        navigate(`/voting?judgeCode=${selectedJudgeCode}`);
        connect(selectedJudgeCode);
    }

    const handleSignInClick = () => {
        let data = {
            name : nameInput.value,
            email : emailInput.value,
            originCountry : originCountryInput.value
        }

        if (!formRef.current.validate()) return;
        
        JudgeRequests.registerJudge(data).then(response => {
            if (response.success) {
                const message = `Please visit your email [${data.email}] to activate your account.`;
                const config = DialogUtils.getInformDialogConfig("Activation email", message);
                showDialog(config);
            }
            else {
                const error = response.jsonData.error;
                const config = new ErrorBoxConfig(error.description, "Contact Aggelos for further clarifications.", JSON.stringify(error.details), "ACTIVATION_ERROR");
                showDialog(config);
            }
        })
    }
    
    return (
        <main id="connect-page">
            <div id="connect-page-content">
                <TabsContainer className="registration-tabs-container" initialSelectedTabIndex={0}>
                    <SimpleTabContainer caption={"Register"} tabIndex={0} 
                                        button={<SimpleButton id="connect-btn" caption="Connect" onButtonClicked={handleConnectClick}/>}
                                        description={'Connect as a judge'}>
                        <JudgeList selectedJudgeCode={selectedJudgeCode} onSelectedJudgeChanged={setSelectedJudgeCode}/>
                    </SimpleTabContainer>
                    <SimpleTabContainer caption={"Sign up"} tabIndex={1} 
                                        button={<SimpleButton id="sign-up-btn" caption="Sign Up" onButtonClicked={handleSignInClick}/>}
                                        description={'Sign up to be able to connect'}>
                        <FormContainer ref={formRef}>
                            <TextInput caption="Name" helpCaption="Insert your name." required={true} {...nameInput}/>
                            <EmailInput caption="Email" helpCaption="Insert your email." required={true} {...emailInput}/>
                            <TableSelector caption="Origin country" required={true} data={countries} valueProperty={"code"} displayProperty={"name"} {...originCountryInput} initialValue={"GRE"} visibleColumns={["code", "name"]}/>
                        </FormContainer>
                    </SimpleTabContainer>
                </TabsContainer>
            </div>            
        </main>
    );
};

function SimpleTabContainer({caption, tabIndex, button, children, description, ...props}) {
    return (
        <TabContainer caption={caption} tabIndex={tabIndex} {...props}>
            <div id="registration-fs-header">
                <h2>Welcome back!</h2>
                <p>{description}</p>
            </div>
            <div className='tab-content'>
                {children}
            </div>
            <div className='buttons-area'>
                {button}
            </div>
        </TabContainer>
    );
}

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