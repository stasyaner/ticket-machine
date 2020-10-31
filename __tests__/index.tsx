import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import Index from "../pages";

const alphabet = [
    "a", "b", "c", "d", "e", "f",
    "g", "h", "i", "j", "k", "l",
    "m", "n", "o", "p", "q", "r",
    "s", "t", "u", "v", "w", "x",
    "y", "z",
];

describe("checking ui elements", () => {
    afterEach(cleanup);

    it("checks service unavailable", () => {
        render(<Index alphabet={[]} strOfStations={""} />);
        expect(
            screen.getByRole("heading", {
                name: "Service unavailable. Please try again in a minute or report to the staff.",
            }),
        ).toBeInTheDocument();
    });

    it("checks letpad table", () => {
        render(<Index alphabet={alphabet} strOfStations={"not empty stations"} />);
        const letpadTable = screen.getByRole("table");
        expect(letpadTable).toBeInTheDocument();
        expect(letpadTable).toHaveClass("letpad-table");
    });

    it("checks options for \"dart\"", () => {
        const falseStationArr = [
            "What is this at all",
            "Dark Horse",
            "Damen",
        ];
        const truthyStationArr = [
            "Dartford",
            "Darts",
            "Dart Wader",
        ];
        const stationArr = [...falseStationArr, ...truthyStationArr];
        const strOfStations = stationArr.join("\n");
        const input = "dart";
        const expectedAvailableLetters = ["f", "s", "space"];

        render(<Index alphabet={alphabet} strOfStations={strOfStations} />);
        Array.prototype.forEach.call(input, l => {
            const btn = screen.getByText(l);
            fireEvent.click(btn);
        });

        expectedAvailableLetters.forEach(l => {
            expect(screen.getByText(l)).not.toHaveClass("not-available");
        });
        falseStationArr.forEach(st => {
            expect(screen.queryByText(st)).toBeNull();
        });
        truthyStationArr.forEach(st => {
            expect(screen.getByText(st)).toBeInTheDocument();
        });
    });

    it("checks clearing input clears options", () => {
        const stationArr = ["Station1", "Samuel", "Satisfaction"];
        const strOfStations = stationArr.join("\n");

        render(<Index alphabet={alphabet} strOfStations={strOfStations} />);

        let btn = screen.getByText("s");
        fireEvent.click(btn);
        stationArr.forEach(st => {
            expect(screen.getByText(st)).toBeInTheDocument();
        });

        btn = screen.getByText("del");
        fireEvent.click(btn);
        stationArr.forEach(st => {
            expect(screen.queryByText(st)).toBeNull();
        });
    });
});
