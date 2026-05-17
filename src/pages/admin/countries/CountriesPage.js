import "./CountriesPageStyles.css";
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { BasePage } from "../../BasePage";
import { TextInput } from "../../../components/inputs/textInput/TextInput";
import { NumberInput } from "../../../components/inputs/numberInput/NumberInput";
import { Checkbox } from "../../../components/inputs/checkbox/Checkbox";
import { ColorInput } from "../../../components/inputs/colorInput/ColorInput";
import { useInput } from "../../../hooks/useInput";
import { CountryRequests } from "../../../utils/requestUtils";
import { useSession } from "../../../components/common/session/SessionProvider";
import { useCountries } from "../../../hooks/useCountries";
import { ButtonIDs, ListEditDashboard } from "../../../components/dashboards/listEditDashboard.js/ListEditDashboard";
import { NotificationBoxConfig } from "../../../components/boxes/notificationBox/notificationBoxConfig";
import { useDialog, DialogType } from "../../../components/dialogs/DialogProvider";
import { GridTemplateContainer } from "../../../components/containers/gridContainer/GridContainer";
import { BoundItemState } from "../../../hooks/useBoundData";
import { FormContainer } from "../../../components/containers/formContainer/FormContainer";

export function CountriesPage() {

    const {judge} = useSession();
    const {countries} = useCountries();
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
        <div className="country-item-container">
            <h2>{item.runningOrder}</h2>
            <h3>{item.name}</h3>
        </div>
        )
    }

    const handleOnToolbarButtonClicked = async (buttonID, item) => {
        let promise = null;

        if (!formRef.current.validate()) return false;

        switch(buttonID) {
            case ButtonIDs.SAVE:
                if (item.__State__ == BoundItemState.NEW) {
                    promise = CountryRequests.createCountry(judgeCode, item);
                }
                else {
                    promise = CountryRequests.updateCountry(judgeCode, item.code, item);
                }

                break;

            case ButtonIDs.DELETE:
                promise = CountryRequests.deleteCountry(judgeCode, item.code);
                break;
        }

        if (promise != null) {
            const response = await promise;
            showDialog(createConfig(response));
            return response.success;
        }

        return true;
    }

    const createConfig = (response) => {
        let message = response.success ? "Success!" : "Something went wrong...";
        let type = response.success ? DialogType.SUCCESS : DialogType.ERROR;
        let description = response.success ? "Operation completed successfully." : response.jsonData.error.description;
        return new NotificationBoxConfig(message, type, description);
    }

    return (
    <BasePage>
        <ListEditDashboard data={countries} 
                           DisplayContainer={Item} 
                           valueProperty={"code"}
                           MainContainer={CountryForm}
                           mainContainerProps={{formRef}}
                           onToolbarButtonClicked={handleOnToolbarButtonClicked}/>
    </BasePage>
);
};



function CountryForm({data = null, onChange, formRef}) {

    const nameInput = useInput(data?.name, undefined, true);
    const codeInput = useInput(data?.code, undefined, true);
    const runningOrderInput = useInput(data?.runningOrder, undefined, true);
    const qualifiedInput = useInput(data?.qualified, undefined, true);
    const artistInput = useInput(data?.artist, undefined, true);
    const songInput = useInput(data?.song, undefined, true);
    const flagColor1Input = useInput(data?.flagColor1, undefined, true);
    const flagColor2Input = useInput(data?.flagColor2, undefined, true);
    const flagColor3Input = useInput(data?.flagColor3, undefined, true);

    const getData = () => {
        return {
            code : codeInput.value,
            name : nameInput.value,
            runningOrder : runningOrderInput.value,
            qualified : qualifiedInput.value,
            artist : artistInput.value,
            song : songInput.value,
            flagColor1 : flagColor1Input.value,
            flagColor2 : flagColor2Input.value,
            flagColor3 : flagColor3Input.value
        }
    };

    useEffect(() => {
        if (onChange) onChange(data, getData());
    }, [
        nameInput.value,
        codeInput.value,
        runningOrderInput.value,
        qualifiedInput.value,
        artistInput.value,
        songInput.value,
        flagColor1Input.value,
        flagColor2Input.value,
        flagColor3Input.value
    ]);

    return (
        <FormContainer style={{display:"flex"}} ref={formRef}>
            <GridTemplateContainer className="country-form"
                                templateRows={"repeat(3, 1fr)"}
                                templateColumns={"repeat(6, 1fr)"}
                                templateAreas={[
                                    ["code", "code", "name", "name"  , "runningOrder", "qualified"],
                                    ["fc1" , "fc1" , "fc2" , "fc2"   , "fc3"      , "fc3"],
                                    ["song", "song", "song", "artist", "artist"   , "artist"]
                                    ]}>
                <TextInput caption={"Code"} {...codeInput} required={true} className="code-input" gridTemplateArea="code"/>
                <TextInput caption={"Name"} {...nameInput} required={true} className="name-input" gridTemplateArea="name"/>
                <NumberInput caption={"Running order"} {...runningOrderInput} className="runningOrder-input" gridTemplateArea="qualified"/>
                <Checkbox caption={"Qualified"} {...qualifiedInput} className="qualified-input" gridTemplateArea="runningOrder"/>
                <TextInput caption={"Artist"} {...artistInput} className="artist-input" gridTemplateArea="artist"/>
                <TextInput caption={"Song"} {...songInput} className="song-input" gridTemplateArea="song"/>
                <ColorInput caption={"Flag Color 1"} {...flagColor1Input} className="flagColor1-input" gridTemplateArea="fc1"/>
                <ColorInput caption={"Flag Color 2"} {...flagColor2Input} className="flagColor2-input" gridTemplateArea="fc2"/>
                <ColorInput caption={"Flag Color 3"} {...flagColor3Input} className="flagColor3-input" gridTemplateArea="fc3"/>
            </GridTemplateContainer>
        </FormContainer>
    )
}