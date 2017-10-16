// requestAnimationFrame polyfill
import * as raf from "raf";

import { CueFinder } from "lib/finder/cue_finder";
import { Cue } from "lib/model/cue";

export class SimpleDisplayer {
    private videoElement: HTMLVideoElement;
    private captionContainerElement: HTMLElement;
    private cueFinder: CueFinder;
    private lastRefreshTime: number;

    constructor(videoElement: HTMLVideoElement) {
        this.videoElement = videoElement;
    }

    public init(cues: Cue[]) {
        this.lastRefreshTime = 0;
        this.cueFinder = new CueFinder();
        this.cueFinder.appendCues(cues);

        // Initialize container element where the cues will be displayed
        const videoParentElement: Node = this.videoElement.parentNode;

        // Create caption container where captions are displayed
        this.captionContainerElement = document.createElement(
            "div",
        );

        // Use uuid if 2 videos are launched on the same
        this.captionContainerElement.id = "caption-container-";
        this.captionContainerElement.style.position = "absolute";
        this.captionContainerElement.style.zIndex = "2147483647";

        // For fullscreen
        // https://stackoverflow.com/questions/45798213/firefox-fullscreen-video-append-dom-elements

        // Pass through overlay
        this.captionContainerElement.style.pointerEvents = "none";

        // Insert new caption container
        videoParentElement.insertBefore(
            this.captionContainerElement,
            this.videoElement,
        );

        this.render();
    }

    public render() {
        // Current video time
        const currentVideoTime = Math.abs(this.videoElement.currentTime * 1000);

        // Refresh captions every 500ms
        if (Math.abs(currentVideoTime - this.lastRefreshTime) > 500) {
            // Align caption container
            this.captionContainerElement
                .style.left = this.videoElement.offsetLeft + "px";
            this.captionContainerElement
                .style.right = this.videoElement.offsetTop + "px";
            this.captionContainerElement.style
                .width = this.videoElement.offsetWidth + "px";
            this.captionContainerElement.style
                .height = this.videoElement.offsetHeight + "px";

            // Search captions to display
            const cues = this.cueFinder.findCues(currentVideoTime, currentVideoTime);
            this.captionContainerElement.innerHTML =  "";

            // FIXME: display all cues not only the last one
            for (const cue of cues) {
                this.captionContainerElement.innerHTML = cue.payload;
            }

            this.lastRefreshTime = currentVideoTime;
        }

        raf(() => { this.render(); });
    }
}
