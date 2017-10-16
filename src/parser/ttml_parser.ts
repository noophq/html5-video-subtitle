import { Cue } from "lib/model/cue";
import { Parser } from "lib/model/parser";

const TIME_FORMAT = /^(\d{2,}):(\d{2}):(\d{2}):?(\d{2})?\.?(\d+)?$/;

export class TTMLParser implements Parser {
    private domParser: DOMParser;

    constructor() {
        this.domParser = new DOMParser();
    }
    public parse(data: string): Cue[] {
        // TTML file is an XML file so use a DOM parser
        const xml = this.domParser.parseFromString(data, "text/xml");

        if (!xml) {
            console.error("invalid TTML");
            return;
        }

        const tts = xml.getElementsByTagName("tt");

        if (tts.length !== 1) {
            console.error("invalid TTML");
            return;
        }

        const tt = tts[0];
        const frameRate = tt.getAttribute("ttp:frameRate");
        const subFrameRate = tt.getAttribute("ttp:subFrameRate");
        const frameRateMultiplier = tt.getAttribute("ttp:frameRateMultiplier");
        const tickRate = tt.getAttribute("ttp:tickRate");
        const spaceStyle = tt.getAttribute("xml:space") || "default";

        // Get cues
        const cues = this.findCues(tt.getElementsByTagName("body")[0]);

        return cues;
    }

    private findCues(node: Element): Cue[] {
        const result: Cue[] = [];

        if (!node) {
            return result;
        }

        if (!node.hasChildNodes()) {
            return result;
        }

        // Search cues in child node
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < node.childNodes.length; i++) {
            if (node.childNodes[i].nodeType !== Node.ELEMENT_NODE) {
                continue;
            }

            const childElement = (node.childNodes[i] as Element);

            if (childElement.hasAttribute("begin")) {
                // This is a cue, parse it
                result.push(this.parseCue(childElement));
            } else {
                // Continue to search cues
                result.push(...
                    this.findCues(childElement),
                );
            }
        }

        return result;
    }

    private parseCue(node: Element) {
        return {
            id: node.getAttribute("xml:id"),
            startTime: this.parseTime(node.getAttribute("begin")),
            endTime: this.parseTime(node.getAttribute("end")),
            payload: this.parsePayload(node),
        };
    }

    private parseTime(time: string): number {
        const match = TIME_FORMAT.exec(time);

        if (!match) {
            throw new Error("Unable to parse time: " + time);
        }

        let milliseconds = 1000 * (
            Number(match[1]) * 3600 + Number(match[2]) * 60 + Number(match[3])
        );

        if (match[5]) {
            milliseconds += Number(match[5]);
        }

        return milliseconds;
    }

    private parsePayload(node: Element) {
        let result: string = "";

        if (!node) {
            return result;
        }

        if (!node.hasChildNodes()) {
            return result;
        }

        // Search cues in child node
        for (let i = 0; i < node.childNodes.length; i++) {
            const childNode = node.childNodes[i];

            if (childNode.nodeType === Node.TEXT_NODE) {
                const content = childNode.textContent.trim();

                if (content) {
                    result += content + " ";
                }
            } else if (childNode.nodeType === Node.ELEMENT_NODE) {
                result += this.parsePayload(childNode as Element);
            }
        }

        return result;
    }
}
