import { GetStaticProps } from "next";
import Head from "next/head";
import {
    useCallback,
    useEffect,
    useState,
} from "react";

type Station = { stationName: string; };
type props = {
    alphabet: string[];
    strOfStations: string;
};

const Home: React.FC<props> = ({ alphabet, strOfStations }) => {
    const [letpad, setLetpad] = useState<JSX.Element[]>();
    const [userInput, setUserInput] = useState("");
    const [stationOpts, setStationOpts] = useState<string[]>([]);
    const [showTryAgainMessage, setShowTryAgainMessage] = useState(false);

    const appendInputHandler = useCallback((letter: string) => (): void => {
        if (letter === " " && !userInput) return;
        const newUserInput = letter === "del" ?
            userInput.substring(0, userInput.length - 1) :
            userInput + letter;
        const matchedStationOpts = newUserInput.length > 0 ?
            // eslint-disable-next-line @typescript-eslint/prefer-regexp-exec
            strOfStations.match(new RegExp(`^${newUserInput}.*`, "gim")) || []
            : [];
        setStationOpts(matchedStationOpts);
        setUserInput(newUserInput);
    }, [userInput, strOfStations]);

    useEffect(() => {
        // show try again message
        setShowTryAgainMessage(strOfStations.length <= 0);

        // load letterpad
        const tbody: JSX.Element[] = [];
        // a-x letters into rows by 5
        for (let i = 0; i < 25 / 5; i++) {
            tbody.push((
                <tr key={`letpad-row-${i}`}>
                    {alphabet.slice(i * 5, i * 5 + 5).map(l => (
                        <td key={l}>
                            <button
                                onClick={appendInputHandler(l)}
                            >{l}</button>
                        </td>
                    ))}
                    <td />
                    <td className="cell-st-opts">{stationOpts[i] || ""}</td>
                </tr>
            ));
        }
        // letter z
        tbody.push((
            <tr key="letpad-row-6">
                <td>
                    <button
                        onClick={appendInputHandler(alphabet[25])}
                    >{alphabet[25]}</button>
                </td>
                <td colSpan={4}>
                    <button
                        onClick={appendInputHandler(" ")}
                    >space</button>
                </td>
                <td>
                    <button
                        onClick={appendInputHandler("del")}
                    >del</button>
                </td>
                <td className="cell-st-opts">{stationOpts[6] || ""}</td>
            </tr>
        ));
        setLetpad(tbody);
    }, [appendInputHandler, alphabet, stationOpts, strOfStations]);

    return (
        <>
            <Head>
                <title>Train Ticket Machine</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className="container">
                <h1>Train Ticket Machine</h1>
                {showTryAgainMessage ?
                    <h1>Service unavailable. Please try again in a minute or report to the staff.</h1>
                    :
                    <>
                        <h1 className="user-input">{userInput}</h1>
                        <table className="letpad-table">
                            <tbody>
                                {letpad}
                            </tbody>
                        </table>
                    </>
                }
            </main>
        </>
    );
};

export const getStaticProps: GetStaticProps<props> = async () => {
    /* eslint-disable no-console */
    /* because this function runs at the build time and we want the console */

    // alphabet
    const alphabet: string[] = [];
    for (let i = 97; i <= 122; i++) {
        alphabet.push(String.fromCharCode(i));
    }

    // stations
    let res: Response | null = null;
    try {
        res = await fetch("https://raw.githubusercontent.com/abax-as" +
                          "/coding-challenge/master/station_codes.json");
    } catch (e) {
        console.log(`An error occured when trying to send the request the server: ${(e as Error).message}`);
    }

    let jsonRes: unknown | null = null;
    let strOfStations = "";
    if (res?.status === 200) {
        try {
            jsonRes = (await res.json()) as unknown;
        } catch (e) {
            console.log("An error occured when trying to parse the JSON" +
                        `from the server response: ${(e as Error).message}`);
        }

        let stationsRes: Station[];
        if (Array.isArray(jsonRes)) {
            stationsRes = (jsonRes as Station[]).filter(item => {
                const itemAsStation = item;
                const itemAsStationProps = Object.keys(itemAsStation);

                return itemAsStationProps.indexOf("stationName") > 0 &&
                        typeof itemAsStation.stationName === "string" &&
                        itemAsStation.stationName.replace(/\s/g, "").length > 0;
            });

            if (stationsRes.length > 0) {
                stationsRes = stationsRes.map(s => ({ stationName: s.stationName.trim() }));
                strOfStations = stationsRes.reduce((str, s) => str += s.stationName + "\n", "");
            } else {
                console.log(`No valid "stationName" in the server response: ${JSON.stringify(jsonRes)}`);
            }
        } else {
            console.log(`The server response is not an array: ${JSON.stringify(jsonRes)}`);
        }
    } else {
        console.log(`HTTP request has failed with ${res?.status || "unknown code"} error: ` +
                    `${res?.statusText || "unknown HTTP status text"}`);
    }

    // if any error occurs, the page will be up for the rebuild in a minute
    return { props: { alphabet, strOfStations }, revalidate: 60 };
};

export default Home;
