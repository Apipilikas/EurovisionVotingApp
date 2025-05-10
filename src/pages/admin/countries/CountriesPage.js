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
import { ListEditDashboard } from "../../../components/dashboards/listEditDashboard.js/ListEditDashboard";
import { NotificationBoxConfig } from "../../../components/boxes/notificationBox/notificationBoxConfig";
import { DialogType } from "../../../components/dialogs/baseDialog/BaseDialog";
import { useDialog } from "../../../components/dialogs/baseDialog/DialogProvider";

export const CountriesPage = forwardRef((props, ref) => {

    const {judge} = useSession();
    const {countries} = useCountries();
    const {showDialog} = useDialog();

    const [judgeCode, setJudgeCode] = useState("");

    useEffect(() => {
        if (judge != null) {
            setJudgeCode(judge.code)
        }
    }, [judge])
  
    const pageLoaded = () => {
    ref.current.pageLoaded();
  };

    function Item({item}) {
    return (
        <div>
            <h2>{item.code} - {item.name}</h2>
        </div>
        )
    }

    const handleOnToolbarButtonClicked = (buttonID, item) => {
        let promise = null;

        switch(buttonID) {
            case "save":
                const isNew = item?.state == "new";
                if (isNew) delete item.state;

                if (isNew) {
                    promise = CountryRequests.createCountry(judgeCode, item);
                }
                else {
                    promise = CountryRequests.updateCountry(judgeCode, item.code, item);
                }

                break;

            case "delete":
                promise = CountryRequests.deleteCountry(judgeCode, item.code);
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
        <ListEditDashboard data={countries} 
                           ItemContainer={Item} 
                           valueMember={"code"}
                           MainContainer={CountryForm}
                           onToolbarButtonClicked={handleOnToolbarButtonClicked}/>
    </BasePage>
);
});



function CountryForm({data = null, onChange}) {

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
        debugger
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
    }

    useEffect(() => {
        if (onChange) onChange(getData());
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
    ])

    return (
        <div className="country-form">
            <TextInput caption={"Name"} {...nameInput} className="name-input"/>
            <TextInput caption={"Code"} {...codeInput} className="code-input"/>
            <NumberInput caption={"Running order"} {...runningOrderInput} className="runningOrder-input"/>
            <Checkbox caption={"Qualified"} {...qualifiedInput} className="qualified-input"/>
            <TextInput caption={"Artist"} {...artistInput} className="artist-input"/>
            <TextInput caption={"Song"} {...songInput} className="song-input"/>
            <ColorInput caption={"Flag Color 1"} {...flagColor1Input} className="flagColor1-input"/>
            <ColorInput caption={"Flag Color 2"} {...flagColor2Input} className="flagColor2-input"/>
            <ColorInput caption={"Flag Color 3"} {...flagColor3Input} className="flagColor3-input"/>
        </div>
    )
}