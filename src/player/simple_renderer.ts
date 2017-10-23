import { CueItemType, DisplayableCue } from "lib/model/cue";
import { Renderer } from "lib/model/player";

export class SimpleRenderer implements Renderer {
    public renderCue(
        renderingAreaElement: HTMLElement,
        cue: DisplayableCue,
    ): void {
        const cueElement = document.createElement("div");
        cueElement.className = "cue";
        const regionHeight = Number(cue.region.height.replace("%", ""));
        cueElement.style.bottom = (100 - regionHeight) + "%";

        // Append cue items
        for (const cueItem of cue.items) {
            let cueItemElement: HTMLElement;

            if (cueItem.type === CueItemType.LINE_BREAK) {
                cueItemElement = document.createElement("br");
            } else {
                cueItemElement = document.createElement("span");
                cueItemElement.innerHTML = cueItem.data;

                if (cueItem.style) {
                    cueItemElement.style.color = cueItem.style.color;
                }
            }

            cueElement.appendChild(cueItemElement);
        }

        renderingAreaElement.appendChild(cueElement);
    }

    /* Clear renderer area */
    public clear(renderingAreaElement: HTMLElement) {
        renderingAreaElement.innerHTML = "";
    }
}
