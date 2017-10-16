
import { SimpleDisplayer } from "lib/displayer/simple_displayer";
import { TTMLParser } from "lib/parser/ttml_parser";
import { fetch } from "lib/util";

export function addTextTrack(
    videoElement: HTMLVideoElement,
    textTrackUrl: string,
) {
    // Load text track
    fetch(textTrackUrl)
        .then((response: any) => {
            // Parse ttml data
            const ttmlParser = new TTMLParser();
            const cues = ttmlParser.parse(response);
            const simpleDisplayer = new SimpleDisplayer(videoElement);
            simpleDisplayer.init(cues);
        })
        .catch((error: any) => {
            console.log(error);
        });
}
