import './LeaderboardPageStyles.css';
import { forwardRef, useEffect, useState } from "react"
import { BasePage } from "../BasePage";
import { useTransition, animated, useSpring } from "react-spring";
import { CountryRequests, JudgeRequests } from "../../utils/requestUtils";
import { SimpleSortTableCell, SimpleTableCell, SortTableRow, TableBody, TableContainer, TableHeader, TableRow } from "../../components/containers/tableContainer/TableContainer";
import { useSession } from '../../components/common/session/SessionProvider';
import { useCountries } from '../../hooks/useCountries';
import { useJudges } from '../../hooks/useJudges';
import { useRunningOrder } from '../../hooks/useRunningOrder';

export const LeaderboardPage = forwardRef((props, ref) => {

    const {countries} = useCountries();
    const {judges} = useJudges();
    const {runningOrder} = useRunningOrder();


    // Initialize
    useEffect(() => {
        // fetchData();
    }, []);

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

    console.log(judges)

    return (
        <TableContainer style={{color:"white"}} id="leaderboard-table">
            <TableHeader>
                <SortTableRow className="leaderboard-table-row leaderboard-table-head-row" onSortButtonClicked={handleSortButtonClicked}>
                    <SimpleSortTableCell caption={"RO"} cellID={"runningOrder"}/>
                    <SimpleSortTableCell caption={"Country"} cellID={"name"}/>
                    {judges.map(judge => <SimpleSortTableCell caption={judge.name} cellID={`judge-${judge.code}`}/>)}
                    <SimpleSortTableCell caption={"Total points"} cellID={"totalVotes"}/>
                    <SimpleTableCell caption={"Status"} className="voting-status-table-cell" cellID={"votingStatus"}/>
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

    const {backgroundColor} = useSpring({
        from : {
            backgroundColor : "#f75252"
        },
        to : {
            backgroundColor : country.votingStatus == "OPEN" ? "#31cc39" : "#f75252"
        },
        config: { tension: 300, friction: 30 },
    })

    return (
        <TableRow style={style} className="leaderboard-table-row">
            <SimpleTableCell caption={country.runningOrder}/>
            <SimpleTableCell caption={country.name}/>
            {judges.map((judge) => {
                let vote = country.votes[judge.code];
                let points = (vote == null) ? 0 : vote;

                return <SimpleTableCell caption={points}/>;
            })}
            <SimpleTableCell caption={country.totalVotes}/>
            <SimpleTableCell caption={country.votingStatus} style={{backgroundColor : backgroundColor}} className="voting-status-table-cell"/>
        </TableRow>
    )
}