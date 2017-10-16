import * as fs from "fs";
import * as path from "path";

import { TTMLParser } from "lib/parser/ttml_parser";

const ttmlParser = new TTMLParser();

// Read TTML subtitle
const ttmlFilePath = path.join(__dirname, "resources", "subtitles", "test.xml");
const ttmlData = fs.readFileSync(ttmlFilePath, "utf8");
const cues = ttmlParser.parse(ttmlData);

test("TTMLParser.parse", () => {
    expect(cues.length).toBeGreaterThan(0);
});
