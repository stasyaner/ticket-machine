import { getStaticProps } from "../pages";
import fetch from "jest-fetch-mock";

const alphabet = [
    "a", "b", "c", "d", "e", "f",
    "g", "h", "i", "j", "k", "l",
    "m", "n", "o", "p", "q", "r",
    "s", "t", "u", "v", "w", "x",
    "y", "z",
];

describe("checking static props", () => {
    beforeEach(() => { jest.restoreAllMocks(); });

    it("checks static props", async () => {
        fetch.mockResponseOnce(JSON.stringify([{ stationName: "my test station" }]));

        const staticProps = await getStaticProps({});
        expect(staticProps.props).toEqual({
            alphabet,
            strOfStations: "my test station\n",
        });
    });

    it("checks no valid stationName", async () => {
        const stationData = JSON.stringify([{ notStationName: "my test station" }]);
        fetch.mockResponseOnce(stationData);
        const spyLog = jest.spyOn(global.console, "log").mockImplementation();

        const staticProps = await getStaticProps({});
        expect(staticProps.props).toEqual({
            alphabet,
            strOfStations: "",
        });
        expect(spyLog).toBeCalledWith("No valid \"stationName\" in the server" +
            ` response: ${stationData}`);
    });

    it("checks response is not an array", async () => {
        const stationData = JSON.stringify("not array");
        fetch.mockResponseOnce(stationData);
        const spyLog = jest.spyOn(global.console, "log").mockImplementation();

        const staticProps = await getStaticProps({});
        expect(staticProps.props).toEqual({
            alphabet,
            strOfStations: "",
        });
        expect(spyLog).toBeCalledWith(`The server response is not an array: ${stationData}`);
    });

    it("checks request fail", async () => {
        const returnData = JSON.stringify("test fail return");
        fetch.mockResponseOnce(returnData, { status: 500 });
        const spyLog = jest.spyOn(global.console, "log").mockImplementation();

        const staticProps = await getStaticProps({});
        expect(staticProps.props).toEqual({
            alphabet,
            strOfStations: "",
        });
        expect(spyLog).toBeCalledWith(`HTTP request has failed with 500 error: ${returnData}`);
    });
});
