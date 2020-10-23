import Head from "next/head";
import {
    useEffect,
    useState,
} from "react";

const Home: React.FC = () => {
    const [letpad, setLetpad] = useState<JSX.Element[]>();

    // load letterpad
    useEffect(() => {
        const a = [];
        for (let i = 97; i <= 122; i++) {
            a.push(String.fromCharCode(i));
        }
        const tbody: JSX.Element[] = [];
        // a-x letters into rowss by 5
        for (let i = 0; i < 25 / 5; i++) {
            tbody.push((
                <tr key={`letpad-row-${i}`}>
                    {a.slice(i * 5, i * 5 + 5).map(l => (
                        <td key={l}>
                            <button>{l}</button>
                        </td>
                    ))}
                    <td />
                    <td />
                </tr>
            ));
        }
        // letter z
        tbody.push((
            <tr key="letpad-row-6">
                <td><button>{a[25]}</button></td>
                <td colSpan={4}><button>&nbsp;</button></td>
                <td />
                <td />
            </tr>
        ));
        setLetpad(tbody);
    }, []);

    return (
        <div className="container">
            <Head>
                <title>Train Ticket Machine</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main>
                <h1>Train Ticket Machine</h1>
                <table className="pad-container mx-auto">
                    <colgroup>
                        <col className="col-letter" />
                        <col className="col-letter" />
                        <col className="col-letter" />
                        <col className="col-letter" />
                        <col className="col-letter" />
                        <col id="col-spacer" />
                        <col id="col-stations" />
                    </colgroup>
                    <tbody>
                        {letpad}
                    </tbody>
                </table>
            </main>
        </div>
    );
};

export default Home;
