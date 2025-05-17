import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { JudgeRequests, serverURL } from "../../../utils/requestUtils";
import { EventRegistry } from "../../../utils/events/eventRegistry";
import { DialogResult, DialogType } from "../../dialogs/baseDialog/BaseDialog";
import { DialogConfig } from "../../dialogs/baseDialog/dialogConfig";
import { useDialog } from "../../dialogs/baseDialog/DialogProvider";
import { ErrorBoxConfig } from "../../boxes/errorBox/errorBoxConfig";
import { DocumentUtils } from "../../../utils/document/documentUtils";

const SessionContext = createContext();

export const useSession = () => useContext(SessionContext);

// Events
const CONNECTING_EV_ID = "connecting";
const HI_EV_ID = "hi"; // Only for tests
const CONNECT_EV_ID = "connect";

export const EventID = {
    NEXTCOUNTRY : "nextCountry",
    VOTES : "votes",
    VOTINGSTATUS : "votingStatus",
    GENERAL : "general"
}

// Socket should be initialized outside SessionProvider as it appears to have unpredictable behavior
// on forwardRef components!
const socket = io(serverURL.address, {autoConnect: false});
const params = new URLSearchParams(document.location.search);

/**
 * Session Provider that carries important information such as judge data and socket.
 * It tracks all events associated with socket.
 * @returns 
 */
export default function SessionProvider({children}) {
    
    const eventRegistry = new EventRegistry();
    const [judge, setJudge] = useState(null);
    const [socketConnected, setSocketConnected] = useState(false);

    const {showDialog} = useDialog();

    useEffect(() => {
        if (judge != null) {
            checkJudgeValidity();
        }
    }, [judge])

    const checkJudgeValidity = () => {
        if (judge.active) return;
        disconnect();

        const description = `Judge with name [${judge.name}] has not been activated yet.`;
        const help = "Check your emails for the activation link. If the problem persists, contact Aggelos to grant you access!";

        const config = new ErrorBoxConfig("Access denied", description, null, "ACCESS_DENIED_ERROR", help);

        showDialog(config);
    }

    // Socket
    const isConnected = () => socket.connected;
    const isDisconnected = () => socket.disconnected;

    const initEventRegistry = () => {
        eventRegistry.registerEvent(HI_EV_ID); // Only for test
        for (var eventName of Object.values(EventID)) {
            eventRegistry.registerEvent(eventName);
        }
    }

    // Socket Event Listeners
    const initSocketEvents = () => {
        socket.on("connect", () => {
        });

        socket.on("connect_error", () => {
        } )

        socket.on("disconnect_error", () => {
        } )

        socket.on("disconnect", () => {
        })

        socket.on("reconnect", () => {
        })

        socket.on("hi", (res) => {
        })

        socket.on(EventID.NEXTCOUNTRY, (response) => {
            let nextRunningCountry = response.data.nextRunningCountry;
            // let msg
            eventRegistry.raiseEvent(EventID.NEXTCOUNTRY, null, nextRunningCountry);
        });

        socket.on(EventID.VOTINGSTATUS, (response) => {
            let {country, votingStatus} = response.data;

            eventRegistry.raiseEvent(EventID.VOTINGSTATUS, null, country, votingStatus);
        });

        socket.on(EventID.VOTES, (response) => {
            let voting = response.data.voting;
            let {judge, country, points} = voting;

            eventRegistry.raiseEvent(EventID.VOTES, null, judge, country, points);
        });

        socket.on(EventID.GENERAL, (response) => {
            let code = response.data.code;
            let message = response.message;
            let type, closeAfterMs = 0;

            switch (code) {
                case "INFORM_MESSAGE":
                    type = DialogType.INFO;
                    break;

                case "WARNING_MESSAGE":
                    type = DialogType.WARNING;
                    break;

                case "RESET_CACHE":
                    type = DialogType.WARNING;
                    closeAfterMs = 8000;
                    break;
            }

            let content = <p>{message}</p>;
            let config = new DialogConfig("Inform", type, content, closeAfterMs);
            config.addButton("Close", DialogResult.CLOSE, true);
            showDialog(config).then(result => {
                DocumentUtils.reloadPage();
            })
        });
    }

    initEventRegistry();
    initSocketEvents();
    
    useEffect(() => {
        return () => {
            disconnect();
        };
    }, []);

    const connect = async (judgeCode) => {
        if (isConnected()) return;

        await requestJudgeData(judgeCode);
        socket.connect();
        setSocketConnected(true);
        emitMessage(CONNECTING_EV_ID, {judgeCode : judgeCode});

    }

    const disconnect = () => {
        socket.disconnect();
        setSocketConnected(false);
    }

    const requestJudgeData = async (judgeCode) => {
        let judgeResponse = await JudgeRequests.getSpecificJudge(judgeCode);
        if (judgeResponse.success) {
            setJudge(judgeResponse.jsonData.judge);
        }
        else {
            throw new Error(judgeResponse.jsonData.error.description);
        }
    }

    const getURLParam = (paramName) => params.get(paramName);

    // Event Listeners
    const addListener = (eventName, listener) => {
        eventRegistry.addListener(eventName, listener);
    }

    const removeListener = (eventName, listener) => {
        eventRegistry.removeListener(eventName, listener);
    }

    const emitMessage = (eventName, ...args) => {
        socket.emit(eventName, ...args);
    }

    return (
        <SessionContext.Provider value={{connect, disconnect, judge, addListener, removeListener, emitMessage, getURLParam, socketConnected}}>
            {children}
        </SessionContext.Provider>
    )
}