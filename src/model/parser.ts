import { CueTrack } from "lib/model/cue";

export interface Parser {
    parse(data: string): CueTrack;
}
