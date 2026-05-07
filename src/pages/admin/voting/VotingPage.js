import { forwardRef, useEffect, useRef, useState } from "react";
import { BasePage } from "../../BasePage";
import { ResultButton } from "../../../components/inputs/buttons/resultButton/ResultButton";
import "./VotingPageStyles.css";
import { DetailsContainer, SimpleDetailsContainer } from "../../../components/containers/detailsContainer/DetailsContainer";
import { ToggleSwitch } from "../../../components/inputs/toggleSwitch/ToggleSwitch";
import SimpleButton from "../../../components/inputs/buttons/simpleButton/SimpleButton";
import { AdminRequests, CountryRequests, JudgeRequests } from "../../../utils/requestUtils";
import { EventID, useSession } from "../../../components/common/session/SessionProvider";
import { useInput } from "../../../hooks/useInput";
import { DialogConfig } from "../../../components/dialogs/dialogConfig";
import { DialogResult, DialogType } from "../../../components/dialogs/DialogProvider";
import { useDialog } from "../../../components/dialogs/DialogProvider";
import { useCountries } from "../../../hooks/useCountries";
import { useJudges } from "../../../hooks/useJudges";
import { useRunningOrder } from "../../../hooks/useRunningOrder";
import { ListSelector } from "../../../components/inputs/selectors/listSelector/ListSelector";
import { BaseDialogConfig } from "../../../components/dialogs/baseDialog/baseDialogConfig";
import { LinearProgressBar } from "../../../components/indicators/progressBars/linearProgressBar/LinearProgressBar";
import { DialogUtils } from "../../../components/dialogs/dialogUtils";
import { FetchError } from "../../../utils/errorUtils";

export function VotingPage() {

    const [runningOrder, setRunningOrder] = useState(-1);

    const {countries, runningCountry} = useCountries();
    const {judges} = useJudges();
    const {runningOrder : currentRunningOrder} = useRunningOrder();
    const {emitMessage, addListener} = useSession();

    useEffect(() => {
        setRunningOrder(currentRunningOrder);
    },[currentRunningOrder])

    // Listeners
    const handleNextCountryClick = () => {
        let value = runningOrder % (countries.length + 1) + 1;
        let arg = {runningCountry : value, votingStatus : "CLOSED"};
        setRunningOrder(value);
        emitMessage(EventID.NEXTCOUNTRY, arg);
    }

    return (
        <BasePage>
            <div className="upper-container">
                <RunningCountryDC runningCountry={runningCountry}/>
                <JudgesVotedDC/>
                <TotalVotesDC totalVotes={runningCountry?.totalVotes}/>
            </div>
            <div className="lower-container">
                <AdminSettings countries={countries}/>
                <CountriesList countries={countries} judges={judges}/>
                <SimpleButton caption={"Next"} id={"next-country-btn"} onButtonClicked={handleNextCountryClick}/>
            </div>
        </BasePage>
    )
};

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

function AdminSettings({countries}) {

    const [judgeCode, setJudgeCode] = useState("");
    const {judge, emitMessage} = useSession();
    const {showDialog} = useDialog();
    
    const eventListInput = useInput();
    const clearListInput = useInput();
    const recalculateListInput = useInput();
    const barRef = useRef(null);

    useEffect(() => {
        setJudgeCode(judge?.code);
    }, [judge]);

    const handleInformButton = () => {
        let value;
        let content = <textarea onChange={(e) => value = e.target.value}></textarea>;
        let config = new BaseDialogConfig("Inform", DialogType.INFO, content);
        config.addButton("Inform", DialogResult.CHOICE1);
        config.addButton("Warning", DialogResult.CHOICE2);
        showDialog(config).then(result => {
            switch (result) {
                case DialogResult.CHOICE1:
                    emitInformMessage("INFORM_MESSAGE", value);
                    break;
                case DialogResult.CHOICE2:
                    emitInformMessage("WARNING_MESSAGE", value);
                    break;
            }
        });
    }

    const emitInformMessage = (code, message) => {
        let data = {code : code, message : message};
        emitMessage(EventID.GENERAL, data);
    }

    const emitResetCacheMessage = () => {
        let message = "Cache has been reset!";
        emitInformMessage("RESET_CACHE", message);
    }

    const clearAllCountriesTotalVotes = () => {
        let codes = countries.map(country => country.code);
        
        let content = <LinearProgressBar steps={codes.length} ref={barRef}/>;
        let config = new BaseDialogConfig("Inform", DialogType.INFO, content);
        config.addButton("Begin", DialogResult.CHOICE1);
        showDialog(config);
        setTimeout(() => {
            barRef.current.begin();
            for (let code of codes) {
                CountryRequests.clearCountryTotalVotes(judgeCode, code);
                barRef.current.nextStep(code);
            }
            barRef.current.complete();
        }, 1000);
    }

    const deleteAllCountries = () => {
        let confirmConfig = DialogUtils.getConfirmDialogConfig("Are you sure you want to delete all countries?");
        showDialog(confirmConfig).then(result => {
            if (result == DialogResult.OK) {
                setTimeout(() => {
                    showDeleteAllCountriesProgressDialog();
                }, 1000)
            }
        })

        
    }

    const showDeleteAllCountriesProgressDialog = () => {
        let codes = countries.map(country => country.code);

        let content = <LinearProgressBar steps={codes.length} ref={barRef}/>;
        let config = new BaseDialogConfig("Inform", DialogType.INFO, content);
        config.addButton("Cancel", DialogResult.CANCEL);

        showDialog(config);
        setTimeout(() => {
            barRef.current.begin();
            for (let code of codes) {
                CountryRequests.deleteCountry(judgeCode, code).then(response => {
                    if (!response.success) {
                        barRef.current.warn(response.jsonData.error.description);
                    }
                })
                barRef.current.nextStep(code);
            }
            barRef.current.complete();
        }, 1000);
    }

    const createEventCountries = (eventName) => {
        AdminRequests.getEurovisionEventData(judgeCode, eventName).then(response => {
            if (response.success) {
                countries = response.jsonData.countries;
                let content = <LinearProgressBar steps={countries.length} ref={barRef}/>;
                let config = new BaseDialogConfig("Inform", DialogType.INFO, content);
                config.addButton("Cancel", DialogResult.CANCEL);

                showDialog(config);
                setTimeout(() => {
                    barRef.current.begin();
                    for (let country of countries) {
                        CountryRequests.createCountry(judgeCode, country).then(response => {
                            if (!response.success) {
                                barRef.current.warn(response.jsonData.error.description);
                            }

                        })
                        barRef.current.nextStep(country.name);
                    }
                    barRef.current.complete();
                }, 1000);
            }
            else {
                let error = response.jsonData.error;
                throw new FetchError(error.code, error.description)
            }
        })
    }

    return (
        <SimpleDetailsContainer summaryCaption={"Admin Settings"} id={"admin-settings-container"}>
            <ButtonContainer caption={"Reset running country order"} 
                             buttonCaption={"RESET"}
                             promise={() => AdminRequests.resetRunningCountry(judgeCode)}
                             onPromiseFulfilled={() => emitResetCacheMessage()}/>
            <ButtonContainer caption={"Reset voting status cache"}
                             buttonCaption={"RESET"}
                             promise={() => AdminRequests.resetVotingStatusCache(judgeCode)}
                             onPromiseFulfilled={() => emitResetCacheMessage()}/>
            <ButtonContainer caption={"Reset data cache"}
                             promise={() => AdminRequests.resetAllCaches(judgeCode)}
                             buttonCaption={"RESET"}
                             onPromiseFulfilled={() => emitResetCacheMessage()}/>
            <ButtonContainer caption={"Inform judge"}
                             buttonCaption={"INFROM"}
                             onButtonClicked={handleInformButton}/>
            <ButtonContainer caption={"Delete countries"}
                             buttonCaption={"DELETE"}
                             onButtonClicked={deleteAllCountries}/>
            <ButtonContainer caption={"Create countries from event"}
                             buttonCaption={"CREATE"}
                             onButtonClicked={() => createEventCountries(eventListInput.value)}
                             >
                <ListSelector list={["first-semi-final", "second-semi-final", "grand-final"]} {...eventListInput}/>
            </ButtonContainer>
            <ButtonContainer caption={"Clear all total votes"}
                             buttonCaption={"CLEAR"}
                             onButtonClicked={clearAllCountriesTotalVotes}/>
            <ButtonContainer caption={"Clear total votes"}
                             buttonCaption={"CLEAR"}
                            promise={() => CountryRequests.clearCountryTotalVotes(judgeCode, clearListInput.value)}
                             >
                <ListSelector list={countries.map(item => item.code)} {...clearListInput}/>
            </ButtonContainer>
            <ButtonContainer caption={"Recalculate total votes"}
                             buttonCaption={"RECALCULATE"}
                            promise={() => CountryRequests.recalculateCountryTotalVotes(judgeCode, recalculateListInput.value)}
                             >
                <ListSelector list={countries.map(item => item.code)} {...recalculateListInput}/>
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
                {judges.map(judge => <JudgeRow key={`${judge.code}-${country.code}`} judge={judge} country={country}/>)}
            </tbody>
        </table>
    )
}

function JudgeRow({judge, country}) {

    const [selectedVote, setSelectedVote] = useState(0);
    const judgePoints = country.votes[judge.code];

    useEffect(() => {
        if (country != null) {
            setSelectedVote(judgePoints);
        }
    }, [judgePoints])

    const handleOnChange = (e) => {
        const value = e.target.value;
        setSelectedVote(value);
    }

    return (
        <tr>
           <th className="judge-name-caption">{judge.name}</th>
           {points.map((point) => {
                const key = `${judge.code}-${country.code}-${point}`;
                return (
                    <td key={key}>
                        <input type="radio" 
                               id={key} 
                               name={`${judge.code}-${country.code}-chosen-votes`}
                               value={point}
                               checked={selectedVote == point}
                               onChange={handleOnChange}/>
                        <label htmlFor={key}><i class="material-icons">check</i></label>
                    </td>
                );
           })}
           <td>
            <ResultButton caption="UPDATE" promise={() => CountryRequests.voteCountry(country.code, judge.code, parseInt(selectedVote))}/>
           </td>
        </tr>
    )
}