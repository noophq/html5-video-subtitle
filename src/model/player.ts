import { Cue } from "lib/model/cue";

export interface PlayerOptionList {
    videoWrapperId?: string;
    videoWrapperClass: string;
    renderingContainerId?: string;
    renderingContainerClass: string;
}

export interface Player {
    loadCues(cues: Cue[]): void;
    requestFullscreen(): void;
}

export interface Renderer {
    renderCue(renderingAreaElement: HTMLElement, cue: Cue): void;
    clear(renderingAreaElement: HTMLElement): void;
}
