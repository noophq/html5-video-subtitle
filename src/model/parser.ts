import { Cue } from "lib/model/cue";

export interface Parser {
    parse(data: string): Cue[];
}
