import {
    act,
    create,
} from "react-test-renderer";
import Index from "../pages";

// DISCLAIMER: it's a JS because it's hard to setup TS for snapshots
// and doesn't really make sense here

const alphabet = [
    "a", "b", "c", "d", "e", "f",
    "g", "h", "i", "j", "k", "l",
    "m", "n", "o", "p", "q", "r",
    "s", "t", "u", "v", "w", "x",
    "y", "z",
];

describe("snapshot testing", () => {
    it("renders service unavailable", () => {
        let tree;
        act(() => {
            tree = create(<Index alphabet={[]} strOfStations={""} />);
        });

        expect(tree.toJSON()).toMatchSnapshot();
    });

    it("renders service unavailable w/ alphabet but w/o stations", () => {
        let tree;
        act(() => {
            tree = create(<Index alphabet={alphabet} strOfStations={""} />);
        });

        expect(tree.toJSON()).toMatchSnapshot();
    });

    it("renders letpad", () => {
        let tree;
        act(() => {
            tree = create(<Index alphabet={alphabet} strOfStations={"test string"} />);
        });

        expect(tree.toJSON()).toMatchSnapshot();
    });
});
