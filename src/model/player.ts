import { Cue, CueTrack, DisplayableCue } from "lib/model/cue";

export interface PlayerOptionList {
    videoWrapperId?: string;
    videoWrapperClass: string;
    renderingContainerId?: string;
    renderingContainerClass: string;
}

export interface Player {
    loadCueTrack(cueTrack: CueTrack): void;
    requestFullscreen(): void;
}

export interface Renderer {
    renderCue(renderingAreaElement: HTMLElement, cue: DisplayableCue): void;
    clear(renderingAreaElement: HTMLElement): void;
}
