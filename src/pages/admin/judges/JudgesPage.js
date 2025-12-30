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
import { useCountries } from "../../../hooks/useCountries";
import { ButtonIDs, ListEditDashboard } from "../../../components/dashboards/listEditDashboard.js/ListEditDashboard";
import { NotificationBoxConfig } from "../../../components/boxes/notificationBox/notificationBoxConfig";
import { useDialog, DialogType } from "../../../components/dialogs/DialogProvider";
import { getValueOrNull } from "../../../utils/react/propsUtils";
import { TableSelector } from "../../../components/inputs/selectors/tableSelector/TableSelector";
import { BoundItemState } from "../../../hooks/useBoundData";
import { GridTemplateContainer } from "../../../components/containers/gridContainer/GridContainer";
import { FormContainer } from "../../../components/containers/formContainer/FormContainer";

export function JudgesPage() {

    const {judge} = useSession();
    const {judges} = useJudges();
    const {showDialog} = useDialog();

    const [judgeCode, setJudgeCode] = useState("");

    const formRef = useRef();

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

    const handleOnToolbarButtonClicked = async (buttonID, item) => {
        let promise = null;

        switch(buttonID) {
            case ButtonIDs.SAVE:
                if (item.__State__ == BoundItemState.NEW) {
                    promise = JudgeRequests.createJudge(judgeCode, item);
                }
                else {
                    promise = JudgeRequests.updateJudge(judgeCode, item.code, item);
                }

                break;

            case ButtonIDs.DELETE:
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
    <BasePage>
        <ListEditDashboard data={judges} 
                           DisplayContainer={Item} 
                           valueProperty={"code"}
                           MainContainer={JudgeForm}
                           mainContainerProps={{formRef}}
                           onToolbarButtonClicked={handleOnToolbarButtonClicked}/>
    </BasePage>
);
};



function JudgeForm({data = null, onChange, formRef}) {

    const {countries} = useCountries();

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
            policyCode : getValueOrNull(policyCodeInput.value),
            active : activeInput.value
        }
    }

    useEffect(() => {
        if (onChange) onChange(data, getData());
    }, [
        nameInput.value,
        codeInput.value,
        originCountryInput.value,
        adminInput.value,
        policyCodeInput.value,
        activeInput.value
    ])

    return (
        <FormContainer style={{display:"flex"}} ref={formRef}>
        <GridTemplateContainer className="judge-form"
                            templateRows={"repeat(3, 1fr)"}
                            templateColumns={"repeat(4, 1fr)"}
                            templateAreas={[
                                ["code" , "code", "name"    , "name"],
                                ["oc"   , "oc"  , "admin"   , "active"],
                                ["pc"   , "pc"  , "pc"      , "pc"]
                            ]}>
            <TextInput caption={"Code"} {...codeInput} required={true} gridTemplateArea="code"/>
            <TextInput caption={"Name"} {...nameInput} required={true} gridTemplateArea="name"/>
            <TableSelector caption={"Origin country"} data={countries} 
                        valueProperty={"code"} displayProperty={"name"} 
                        visibleColumns={["code", "name"]} {...originCountryInput} gridTemplateArea="oc"/>
            <Checkbox caption={"Admin"} {...adminInput} gridTemplateArea="admin"/>
            <Checkbox caption={"Active"} {...activeInput} gridTemplateArea="active"/>
            <TextInput caption={"Policy"} {...policyCodeInput} gridTemplateArea="pc"/>
        </GridTemplateContainer>
        </FormContainer>
    )
}