import * as fs from "fs";
import * as path from "path";

import { CueFinder } from "lib/finder/cue_finder";
import { Cue } from "lib/model/cue";
import { TTMLParser } from "lib/parser/ttml_parser";

const ttmlParser = new TTMLParser();

// Read TTML subtitle
const ttmlFilePath = path.join(__dirname, "resources", "subtitles", "test.xml");
const ttmlData = fs.readFileSync(ttmlFilePath, "utf8");
const cueTrack = ttmlParser.parse(ttmlData);
const cues = cueTrack.cues;

// Invoke Cue cueFinder
const cueFinder = new CueFinder();
cueFinder.appendCueDictionary(cues);

test("CueFinder.findCues - case 1", () => {
    const foundCues = cueFinder.findCues(4000, 4000);

    expect(foundCues.length).toBe(1);
    expect(foundCues[0].id).toEqual("cue-1");
});

test("CueFinder.findCues - case 2", () => {
    const foundCues = cueFinder.findCues(2320, 5360);

    expect(foundCues.length).toBe(1);
    expect(foundCues[0].id).toEqual("cue-1");
});

test("CueFinder.findCues - case 3", () => {
    const foundCues = cueFinder.findCues(0, 5400);

    expect(foundCues.length).toBe(1);
    expect(foundCues[0].id).toEqual("cue-1");
});

test("CueFinder.findCues - case 4", () => {
    const foundCues = cueFinder.findCues(5200, 5400);

    expect(foundCues.length).toBe(1);
    expect(foundCues[0].id).toEqual("cue-1");
});

test("CueFinder.findCues - case 5", () => {
    const foundCues = cueFinder.findCues(7000, 8000);

    expect(foundCues.length).toBe(1);
    expect(foundCues[0].id).toEqual("cue-2");
});

test("CueFinder.findCues - case 6", () => {
    const foundCues = cueFinder.findCues(0, 20000);
    const foundCueIds = foundCues.map((cue: Cue) => {
        return cue.id;
    });

    expect(foundCues.length).toBe(7);
    expect(foundCueIds).toEqual([
        "cue-1", "cue-2", "cue-3", "cue-4", "cue-5", "cue-6", "cue-7",
    ]);
});
