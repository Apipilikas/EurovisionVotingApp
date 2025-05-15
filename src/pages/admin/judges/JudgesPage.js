import "./JudgesPageStyles.css";
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { BasePage } from "../../BasePage";
import { TextInput } from "../../../components/inputs/textInput/TextInput";
import { NumberInput } from "../../../components/inputs/numberInput/NumberInput";
import { Checkbox } from "../../../components/inputs/checkbox/Checkbox";
import { ColorInput } from "../../../components/inputs/colorInput/ColorInput";
import { useInput } from "../../../hooks/useInput";
import { CountryRequests, JudgeRequests } from "../../../utils/requestUtils";
import { useSession } from "../../../components/common/session/SessionProvider";
import { useJudges } from "../../../hooks/useJudges";
import { ListEditDashboard } from "../../../components/dashboards/listEditDashboard.js/ListEditDashboard";
import { NotificationBoxConfig } from "../../../components/boxes/notificationBox/notificationBoxConfig";
import { DialogType } from "../../../components/dialogs/baseDialog/BaseDialog";
import { useDialog } from "../../../components/dialogs/baseDialog/DialogProvider";

export const JudgesPage = forwardRef((props, ref) => {

    const {judge} = useSession();
    const {judges} = useJudges();
    const {showDialog} = useDialog();

    const [judgeCode, setJudgeCode] = useState("");

    useEffect(() => {
        if (judge != null) {
            setJudgeCode(judge.code)
        }
    }, [judge])

    function Item({item}) {
    return (
        <div>
            <h2>{item.code} - {item.name}</h2>
        </div>
        )
    }

    const handleOnToolbarButtonClicked = (buttonID, item) => {
        let promise = null;
        debugger

        switch(buttonID) {
            case "save":
                const isNew = item.isNew;
                delete item.isNew;

                if (isNew) {
                    promise = JudgeRequests.createJudge(judgeCode, item);
                }
                else {
                    promise = JudgeRequests.updateJudge(judgeCode, item.code, item);
                }

                break;

            case "delete":
                promise = JudgeRequests.deleteJudge(judgeCode, item.code);
                break;
        }

        if (promise != null) {
            promise.then(response => {
                let message = response.success ? "Success!" : "Something went wrong...";
                let type = response.success ? DialogType.SUCCESS : DialogType.ERROR;
                let description = response.success ? "Operation completed successfully." : response.jsonData.error.description;
                const config = new NotificationBoxConfig(message, type, description);
                showDialog(config);
            })
        }
    }

    return (
    <BasePage {...props} ref={ref}>
        <ListEditDashboard data={judges} 
                           ItemContainer={Item} 
                           valueMember={"code"}
                           MainContainer={JudgeForm}
                           onToolbarButtonClicked={handleOnToolbarButtonClicked}/>
    </BasePage>
);
});



function JudgeForm({data = null, onChange}) {

    const codeInput = useInput(data?.code, undefined, true);
    const nameInput = useInput(data?.name, undefined, true);
    const originCountryInput = useInput(data?.originCountry, undefined, true);
    const adminInput = useInput(data?.admin, undefined, true);
    const policyCodeInput = useInput(data?.policyCode, undefined, true);
    const activeInput = useInput(data?.active, undefined, true);

    const getData = () => {
        return {
            code : codeInput.value,
            name : nameInput.value,
            originCountry : originCountryInput.value,
            admin : adminInput.value,
            policyCode : policyCodeInput.value,
            active : activeInput.value
        }
    }

    useEffect(() => {
        if (onChange) onChange(getData());
    }, [
        nameInput.value,
        codeInput.value,
        originCountryInput.value,
        adminInput.value,
        policyCodeInput.value,
        activeInput.value
    ])

    return (
        <div className="judge-form">
            <TextInput caption={"Name"} {...nameInput} className="name-input"/>
            <TextInput caption={"Code"} {...codeInput} className="code-input"/>
            <TextInput caption={"Origin country"} {...originCountryInput} className="originCountry-input"/>
            <Checkbox caption={"Admin"} {...adminInput} className="admin-input"/>
            <Checkbox caption={"Active"} {...activeInput} className="active-input"/>
            <TextInput caption={"Policy"} {...policyCodeInput} className="policyCode-input"/>
        </div>
    )
}