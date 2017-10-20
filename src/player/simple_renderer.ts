import { Cue } from "lib/model/cue";
import { Renderer } from "lib/model/player";

export class SimpleRenderer implements Renderer {
    public renderCue(
        renderingAreaElement: HTMLElement,
        cue: Cue,
    ): void {
        renderingAreaElement.innerHTML = "<span class=\"cue\">" +
            cue.payload + "</span>";
    }

    /* Clear renderer area */
    public clear(renderingAreaElement: HTMLElement) {
        renderingAreaElement.innerHTML = "";
    }
}
