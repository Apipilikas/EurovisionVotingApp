import { forwardRef, useEffect, useState } from "react";
import { BasePage } from "../../BasePage";
import { ResultButton } from "../../../components/inputs/buttons/resultButton/ResultButton";
import "./VotingPageStyles.css";
import { DetailsContainer, SimpleDetailsContainer } from "../../../components/containers/detailsContainer/DetailsContainer";
import { ToggleSwitch } from "../../../components/inputs/toggleSwitch/ToggleSwitch";
import SimpleButton from "../../../components/inputs/buttons/simpleButton/SimpleButton";
import { AdminRequests, CountryRequests, JudgeRequests } from "../../../utils/requestUtils";
import { EventID, useSession } from "../../../components/common/session/SessionProvider";
import { useInput } from "../../../hooks/useInput";
import { DialogConfig } from "../../../components/dialogs/baseDialog/dialogConfig";
import { DialogResult, DialogType } from "../../../components/dialogs/baseDialog/BaseDialog";
import { useDialog } from "../../../components/dialogs/baseDialog/DialogProvider";
import { useCountries } from "../../../hooks/useCountries";
import { useJudges } from "../../../hooks/useJudges";
import { useRunningOrder } from "../../../hooks/useRunningOrder";

export const VotingPage = forwardRef((props, ref) => {

    const {countries, runningCountry} = useCountries();
    const {judges} = useJudges();
    const {runningOrder} = useRunningOrder();
    const {emitMessage, addListener} = useSession();

    // Listeners
    const handleNextCountryClick = () => {
        let arg = {runningCountry : ((runningOrder + 1) % (countries.length + 1)), votingStatus : "CLOSED"};
        emitMessage(EventID.NEXTCOUNTRY, arg);
    }

    return (
        <BasePage {...props} ref={ref}>
            <div className="upper-container">
                <RunningCountryDC runningCountry={runningCountry}/>
                <JudgesVotedDC/>
                <TotalVotesDC totalVotes={runningCountry?.totalVotes}/>
            </div>
            <div className="lower-container">
                <AdminSettings/>
                <CountriesList countries={countries} judges={judges}/>
                <SimpleButton caption={"Next"} id={"next-country-btn"} onButtonClicked={handleNextCountryClick}/>
            </div>
        </BasePage>
    )
});

function DashboardContainer({title, className, children}) {
    
    return (
        <section className={`dashboard-container ${className}`}>
            <h1>{title}</h1>
            <div className="dashboard-content">
                {children}
            </div>
        </section>
    )
}

function DashboardTextCaptionContainer({title, text}) {
    return (
        <div className={"dashboard-caption-container"}>
            <h3>{title}</h3>
            <p>{text}</p>
        </div>
    )
}

// DC stands for Dashboard Container.

function RunningCountryDC({runningCountry}) {

    if (runningCountry == null) runningCountry = {runningOrder : "0", name : "--", song : "--", artist : "--"}

    const {runningOrder, name, song, artist} = runningCountry;

    return (
        <DashboardContainer title={"Running country"} className={"dashboard-running-country-container"}>
            <h2>{runningOrder} {name}</h2>
            <DashboardTextCaptionContainer title={"Song"} text={song}/>
            <DashboardTextCaptionContainer title={"Artist"} text={artist}/>
        </DashboardContainer>
    );
}

function JudgesVotedDC({totaljudges, judgesVoted, onlineJudges, offlineJudges}) {

    return (
        <DashboardContainer title={"Judges"} className={"dashboard-judges-voted-container"}>
            <h2>{judgesVoted} / {totaljudges}</h2>
            <DashboardTextCaptionContainer title={"Online"} text={onlineJudges / totaljudges}/>
            <DashboardTextCaptionContainer title={"Offline"} text={offlineJudges / totaljudges}/>
        </DashboardContainer>
    );
}

function TotalVotesDC({totalVotes}) {

    return (
        <DashboardContainer title={"Total Votes"} className={"dashboard-total-votes-container"}>
            <span>{totalVotes == null ? 0 : totalVotes}</span>
        </DashboardContainer>
    )
}

function AdminSettings() {

    const [judgeCode, setJudgeCode] = useState("");
    const {judge, emitMessage} = useSession();
    const {showDialog} = useDialog();

    const informInput = useInput();

    useEffect(() => {
        setJudgeCode(judge?.code);
    }, [judge]);

    const handleInformButton = () => {
        let content = <textarea {...informInput}></textarea>;
        let config = new DialogConfig("Inform", DialogType.INFO, content);
        config.addButton("Inform", DialogResult.CHOICE1);
        config.addButton("Warning", DialogResult.CHOICE2);
        showDialog(config).then(result => {
            switch (result) {
                case DialogResult.CHOICE1:
                    emitInformMessage("INFORM_MESSAGE", informInput.value);
                    break;
                case DialogResult.CHOICE2:
                    emitInformMessage("WARNING_MESSAGE", informInput.value);
                    break;
            }
        });
    }

    const emitInformMessage = (code, message) => {
        let data = {code : code, message : message};
        emitMessage(EventID.GENERAL, data);
    }

    return (
        <SimpleDetailsContainer summaryCaption={"Admin Settings"} id={"admin-settings-container"}>
            <ButtonContainer caption={"Reset running country order"} 
                             buttonCaption={"RESET"}
                             promise={() => AdminRequests.resetRunningCountry(judgeCode)}/>
            <ButtonContainer caption={"Reset voting status cache"}
                             buttonCaption={"RESET"}
                             promise={() => AdminRequests.resetVotingStatusCache(judgeCode)}/>
            <ButtonContainer caption={"Reset data cache"}
                             promise={() => AdminRequests.resetAllCaches(judgeCode)}
                             buttonCaption={"RESET"}/>
            <ButtonContainer caption={"Inform judge"}
                             buttonCaption={"INFROM"}
                             onButtonClicked={handleInformButton}/>
            <ButtonContainer caption={"Reveal winner"}
                             buttonCaption={"REVEAL"}>
                <span>NONE</span>
            </ButtonContainer>
            <ButtonContainer caption={"Clear total votes"}
                             buttonCaption={"CLEAR"}>
                {/* LIST */}
            </ButtonContainer>
        </SimpleDetailsContainer>
    )
}

function ButtonContainer({caption, buttonCaption, className, promise, onPromiseFulfilled, onButtonClicked, children}) {
    return (
        <div className={`${className} button-container`}>
            <label>{caption}</label>
            <ResultButton caption={buttonCaption} promise={promise} onPromiseFulfilled={onPromiseFulfilled} onButtonClicked={onButtonClicked} className={`${className}-btn`}/>
            {children}
        </div>
    )
}

function CountriesList({countries, judges}) {
    return (
        countries.map(country => <CountryContainer key={country.code} country={country} judges={judges}/>)
    )
}

function CountryContainer({country, judges}) {
    return (
        <DetailsContainer summaryContent={<CountrySummary country={country}/>} className={"voting-country-container"}>
            <CountryContent country={country} judges={judges}/>
        </DetailsContainer>
    )
}

function CountrySummary({country}) {

    const {emitMessage} = useSession();

    const onValueClicked = (newValue) => {
        let votingStatus = (newValue) ? "OPEN": "CLOSED";
        let data = {countryCode : country.code, votingStatus : votingStatus};
        emitMessage(EventID.VOTINGSTATUS, data);
    }

    const input = useInput(country.votingStatus == "OPEN", onValueClicked, true);
    
    return (
        <div>
            <div className="left-container">
                <p class="running-order-txt">{country.runningOrder}</p>
                {/* <img src="../resources/images/flags/{{this.code}}.svg" width="55px"> */}
                <p class="code-txt">{country.code}</p>
                <p class="name-txt">{country.name}</p>
            </div>
            <div className="right-container">
                <p className="total-votes-txt">{country.totalVotes}</p>
                <ToggleSwitch {...input}/>
            </div>
        </div>
    )
}

const points = [1,2,3,4,5,6,7,8,10,12];

function CountryContent({country, judges}) {

    return (
        <table className="voting-country-table" id={`voting-$${country.code}-table`}>
            <thead>
                <tr>
                    <th rowSpan={2}>Judges</th>
                    <th colSpan={10}>Points</th>
                </tr>
                <tr className="points-caption">
                    {points.map(point => <th className="point-caption">{point}</th>)}
                </tr>
            </thead>
            <tbody>
                {judges.map(judge => <JudgeRow judge={judge} country={country}/>)}
            </tbody>
        </table>
    )
}

function JudgeRow({judge, country}) {

    const judgePoints = country.votes[judge.code];

    return (
        <tr>
           <th className="judge-name-caption">{judge.name}</th>
           {points.map((point) => {
                return (
                    <td>
                        <input type="radio" 
                               id={`${judge.code}-${country.code}-${point}`} 
                               name={`${judge.code}-${country.code}-chosen-votes`} 
                               value={point}
                               checked={judgePoints === point}/>
                        <label for={`${judge.code}-${country.code}-${point}`}><i class="material-icons">check</i></label>
                    </td>
                );
           })}
           <td>
            <ResultButton caption="UPDATE"/>
           </td>
        </tr>
    )
}