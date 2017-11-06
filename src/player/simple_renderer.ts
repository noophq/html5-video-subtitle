/*
 *  This file is part of the NOOP organization .
 *
 *  (c) Cyrille Lebeaupin <clebeaupin@noop.fr>
 *
 *  For the full copyright and license information, please view the LICENSE
 *  file that was distributed with this source code.
 *
 */

import { CueItemType, DisplayableCue, Style, TextAlign } from "lib/model/cue";
import { Renderer } from "lib/model/player";

export class SimpleRenderer implements Renderer {
    public renderCue(
        renderingAreaElement: HTMLElement,
        cue: DisplayableCue,
    ): void {
        const cueElement = document.createElement("div");
        cueElement.className = "cue";

        if (cue.region !== undefined) {
            const regionHeight = Number(cue.region.height.replace("%", ""));
            cueElement.style.bottom = (100 - regionHeight) + "%";

            if (cue.region.textAlign !== undefined) {
                let textAlign = "inherit";

                switch (cue.region.textAlign) {
                    case TextAlign.LEFT:
                        textAlign = "left";
                        break;
                    case TextAlign.CENTER:
                        textAlign = "center";
                        break;
                    case TextAlign.RIGHT:
                        textAlign = "right";
                        break;
                    default:
                        break;
                }

                cueElement.style.textAlign = textAlign;
            }
        }

        this.applyStyle(cueElement, cue.style);

        // Append cue items
        for (const cueItem of cue.items) {
            let cueItemElement: HTMLElement;

            if (cueItem.type === CueItemType.LINE_BREAK) {
                // Break line
                cueItemElement = document.createElement("br");
            } else {
                // Text cue
                cueItemElement = document.createElement("span");
                cueItemElement.innerHTML = cueItem.data;
                this.applyStyle(cueItemElement, cueItem.style);
            }

            cueElement.appendChild(cueItemElement);
        }

        renderingAreaElement.appendChild(cueElement);
    }

    /* Clear renderer area */
    public clear(renderingAreaElement: HTMLElement) {
        renderingAreaElement.innerHTML = "";
    }

    private applyStyle(element: HTMLElement, style: Style) {
        if (style === undefined) {
            return;
        }

        if (style.color !== undefined) {
            element.style.color = style.color;
        }
    }
}
