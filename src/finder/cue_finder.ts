import { BTree } from "lib/btree/btree";
import { Cue, CueDictionary } from "lib/model/cue";

export class CueFinder {
    // Key: cue start time, value: cue index
    private startToCue: BTree<number, number>;

    // Key: cue end time, value: cue index
    private endToCue: BTree<number, number>;

    // List of cues
    private cues: Cue[];

    constructor() {
        this.startToCue = new BTree();
        this.endToCue = new BTree();
    }

    public appendCueDictionary(cues: CueDictionary): Cue[] {
        return this.appendCues(
            Object.keys(cues).map((key: string) => cues[key])
        );
    }

    public appendCues(cues: Cue[]): Cue[] {
        this.cues = cues;

        for (let i = 0; i < cues.length; i++) {
            this.startToCue.put(cues[i].startTime, i);
            this.endToCue.put(cues[i].endTime, i);
        }

        return [];
    }

    public findCues(start: number, end: number): Cue[] {
        // Cues having:
        // - a start time lower than the min value of boundary
        const startSet = new Set(
            this.startToCue.findInRange(0, start),
        );

        // - a end time bigger than the max value of boundary
        const endSet = new Set(
            this.endToCue.findInRange(end, Math.pow(2, 24)),
        );

        const cueIds = new Set();

        startSet.forEach((cueId) => {
            if (endSet.has(cueId)) {
                cueIds.add(cueId);
            }
        });

        // Cue start or end time included in boundary
        for (const cueId of this.endToCue.findInRange(start, end)) {
            cueIds.add(cueId);
        }

        for (const cueId of this.startToCue.findInRange(start, end)) {
            cueIds.add(cueId);
        }

        const cues: Cue[] = [];

        cueIds.forEach((cueId) => {
            cues.push(this.cues[cueId]);
        });

        return cues;
    }
}
