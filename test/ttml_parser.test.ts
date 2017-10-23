import * as fs from "fs";
import * as path from "path";

import { TTMLParser } from "lib/parser/ttml_parser";

const ttmlParser = new TTMLParser();

// Read TTML subtitle
const ttmlFilePath = path.join(__dirname, "resources", "subtitles", "test.xml");
const ttmlData = fs.readFileSync(ttmlFilePath, "utf8");
const cueTrack = ttmlParser.parse(ttmlData);
const cues = cueTrack.cues;
const regions = cueTrack.regions;
const styles = cueTrack.styles;

test("TTMLParser.parse - cue", () => {
    expect(Object.keys(cues).length).toBeGreaterThan(0);
});

test("TTMLParser.parse - regions", () => {
    expect(Object.keys(regions).length).toEqual(4);
});
