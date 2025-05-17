import './LeaderboardPageStyles.css';
import { forwardRef, useEffect, useState } from "react"
import { BasePage } from "../BasePage";
import { useTransition, animated, useSpring } from "react-spring";
import { CountryRequests, JudgeRequests } from "../../utils/requestUtils";
import { ButtonTableCell, SimpleSortTableCell, SimpleTableCell, SortTableRow, TableBody, TableCell, TableContainer, TableHeader, TableRow } from "../../components/containers/tableContainer/TableContainer";
import { useSession } from '../../components/common/session/SessionProvider';
import { useCountries } from '../../hooks/useCountries';
import { useJudges } from '../../hooks/useJudges';
import { useRunningOrder } from '../../hooks/useRunningOrder';
import { DialogConfig } from '../../components/dialogs/baseDialog/dialogConfig';
import { DialogResult, DialogType } from '../../components/dialogs/baseDialog/BaseDialog';
import { Dropdown } from '../../components/inputs/dropdown/Dropdown';
import { useDialog } from '../../components/dialogs/baseDialog/DialogProvider';
import { NotificationBoxConfig } from '../../components/boxes/notificationBox/notificationBoxConfig';

export const LeaderboardPage = forwardRef((props, ref) => {

    const {countries} = useCountries();
    const {judges} = useJudges();

    return (
        <BasePage {...props} ref={ref}>
            <LeaderboardTable countries={countries} judges={judges}/>
        </BasePage>
    )
})

function LeaderboardTable({countries, judges}) {

    const [rows, setRows] = useState([]);
    const [sortCellID, setSortCellID] = useState("totalVotes");
    const [sortValue, setSortValue] = useState(-1);
    useEffect(() => {
        if (!countries) return;

        let isJudgeCellID = false;
        let cellID = sortCellID;
    
        if (sortCellID.startsWith("judge")) {
            isJudgeCellID = true;
            cellID = sortCellID.replace("judge-", "");
        }
    
        const sortedCountries = [...countries].sort((a, b) => {
            let aValue, bValue;
    
            if (isJudgeCellID) {
                aValue = a.votes[cellID] == null ? 0 : a.votes[cellID];
                bValue = b.votes[cellID] == null ? 0 : b.votes[cellID];
            } else {
                aValue = a[cellID];
                bValue = b[cellID];
            }
    
            return (aValue > bValue ? 1 : -1) * sortValue;
        });
    
        // Only update rows if there's a real change (optional but clean)
        const isDifferent = JSON.stringify(rows) !== JSON.stringify(sortedCountries);
        if (isDifferent) {
            setRows(sortedCountries);
        }
    }, [countries, sortCellID, sortValue]);

    let height = 0;
    const transition = useTransition(
        rows?.map(row => ({ ...row, y: (height += 25) - 25})),
        {
            key : (item) => item.code,
            from: { height: 0, opacity: 0 },
            leave: { height: 0, opacity: 0 },
            enter: ({ y, height }) => ({ y, height, opacity: 1 }),
            update: ({ y, height }) => ({ y, height }),
        }
    )

    const handleSortButtonClicked = (cellID, value) => {
        setSortCellID(cellID);
        setSortValue(value);
    }

    return (
        <TableContainer style={{color:"white"}} id="leaderboard-table">
            <TableHeader>
                <SortTableRow className="leaderboard-table-row leaderboard-table-head-row" onSortButtonClicked={handleSortButtonClicked}>
                    <SimpleSortTableCell caption={"R/O"} cellID={"runningOrder"} className={"running-order-cell"}/>
                    <SimpleSortTableCell caption={"Country"} cellID={"name"}/>
                    {judges.map(judge => <SimpleSortTableCell caption={judge.name} cellID={`judge-${judge.code}`}/>)}
                    <SimpleSortTableCell caption={"Total points"} cellID={"totalVotes"} className={"total-votes-table-cell"}/>
                    <SimpleTableCell caption={"Status"} className="voting-status-table-cell" cellID={"votingStatus"}/>
                    <SimpleTableCell caption={"Vote"} cellID={"vote"}/>
                </SortTableRow>
            </TableHeader>
            <TableBody>
                 {transition((style, country) => (
                    <CountryRow country={country} judges={judges} style={style}/>
             ))}
            </TableBody>
        </TableContainer>
    )
}

function CountryRow({country, judges, style}) {

    const {showDialog} = useDialog();
    const {judge} = useSession();

    const {backgroundColor} = useSpring({
        from : {
            backgroundColor : "#f75252"
        },
        to : {
            backgroundColor : country.votingStatus == "OPEN" ? "#31cc39" : "#f75252"
        },
        config: { tension: 300, friction: 30 },
    })

    const showVotingDialog = () => {
        let points;
        const title = `Vote for ${country.name}`;
        const config = new DialogConfig(title, DialogType.INFO);

        config.content = <Dropdown  initialValue={country.votes[judge.code]}
                                    onChange={(e) => points = e.target.value} 
                                    caption={"Votes"} 
                                    list={[1,2,3,4,5,6,7,8,10,12]}/>
        
        config.addButton("Vote", DialogResult.OK, true);
        
        showDialog(config).then(result => {
            if (result == DialogResult.OK) {
                let message;
                let description;
                CountryRequests.voteCountry(country.code, judge.code, parseInt(points)).then(response => {
                    if (response.success) {
                        message = "Vote submitted successfully!"
                        description = `You voted ${points} points for ${country.name}. Great choise!`;
                    }
                    else {
                        message = "Something went wrong..."
                        description = response.jsonData.error.description;
                    }

                    let type = response.success ? DialogType.SUCCESS : DialogType.ERROR;
                    const notificationConfig = new NotificationBoxConfig(message, type, description);
                    showDialog(notificationConfig);
                })
            }
        })
    }

    return (
        <TableRow style={style} className="leaderboard-table-row leaderboard-table-body-row">
            <SimpleTableCell caption={country.runningOrder} className={"running-order-cell"}/>
            <SimpleTableCell caption={country.name}/>
            {judges.map((judge) => {
                let vote = country.votes[judge.code];
                let points = (vote == null) ? 0 : vote;

                return <SimpleTableCell caption={points}/>;
            })}
            <SimpleTableCell caption={country.totalVotes} className={"total-votes-table-cell"}/>
            <SimpleTableCell caption={country.votingStatus} style={{backgroundColor : backgroundColor}} className="voting-status-table-cell"/>
            <ButtonTableCell buttonCaption={"Vote"} className={"vote-table-cell"} onButtonClicked={showVotingDialog}/>
        </TableRow>
    )
}