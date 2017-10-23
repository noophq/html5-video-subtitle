// requestAnimationFrame polyfill
import * as raf from "raf";
import ResizeObserver from "resize-observer-polyfill";

import { CueFinder } from "lib/finder/cue_finder";
import { Cue, CueTrack, DisplayableCue } from "lib/model/cue";
import { Player, PlayerOptionList, Renderer } from "lib/model/player";
import { SimpleRenderer } from "lib/player/simple_renderer";
import { injectCSS } from "lib/util";

const defaultPlayerOptions: PlayerOptionList = {
    videoWrapperClass: "video-wrapper",
    renderingContainerClass: "rendering-container",
};

const DEFAULT_CSS = `
.video-wrapper {
    position: relative;
    display: inline-block;
}

.video-wrapper.full-screen {
    width: 100%;
    height: 100%;
}

.video-wrapper.full-screen video {
    width: 100%;
    height: 100%;
}

.rendering-container {
    position: absolute;
    display: block;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 2147483647;
    pointer-events: none;
    text-align: center;
}

.rendering-container .cue {
    position: absolute;
    display: block;
    left: 0;
    right: 0;
    bottom: 10%;
    align-self: flex-end;
    text-align: center;
    color: #ffffff;
    text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;
}

.video-wrapper.full-screen .cue {
    font-size: 6vmin;
}
`;

export class SimplePlayer<R extends Renderer> implements Player {
    private videoElement: HTMLVideoElement;
    private videoWidth: number; // Width of video track
    private videoHeight: number; // Height of video track
    private renderingAreaElement: HTMLElement;
    private videoWrapperElement: HTMLElement;
    private playerOptions: PlayerOptionList;
    private cueTrack: CueTrack;
    private cueFinder: CueFinder;
    private lastDisplayedCueIds: string[];
    private lastRefreshTime: number;
    private renderer: R;

    constructor(
        videoElement: HTMLVideoElement,
        renderer: R,
        playerOptions: PlayerOptionList = defaultPlayerOptions,
    ) {
        this.videoElement = videoElement;
        this.playerOptions = playerOptions;
        this.renderer = renderer;
        this.buildVideoWrapper();
    }

    public loadCueTrack(cueTrack: CueTrack): void {
        // Init
        this.cueTrack = cueTrack;
        this.lastDisplayedCueIds = [];
        this.lastRefreshTime = 0;
        this.cueFinder = new CueFinder();
        this.cueFinder.appendCueDictionary(cueTrack.cues);
        this.renderer.clear(this.renderingAreaElement);

        // Synchronize video and cue rendering
        this.syncRendering();
    }

    public requestFullscreen() {
        this.videoWrapperElement.requestFullscreen();
    }

    protected buildVideoWrapper() {
        // Search or/and create wrapper element
        let videoWrapperElement: HTMLElement = null;

        if (this.playerOptions.videoWrapperId != null) {
            videoWrapperElement = document.getElementById(
                this.playerOptions.videoWrapperId,
            );
        }

        if (videoWrapperElement === null) {
            // Wrapper element does not exist so creates it
            videoWrapperElement = document.createElement("div");
            this.videoElement.parentNode.insertBefore(
                videoWrapperElement,
                this.videoElement,
            );
            videoWrapperElement.appendChild(this.videoElement);
        }

        videoWrapperElement.className = this.playerOptions.videoWrapperClass;

        // Create rendering area where subtitles will be displayed
        const renderingAreaElement = document.createElement(
            "div",
        );

        // Set class name
        renderingAreaElement.className = this.playerOptions.renderingContainerClass;

        if (this.playerOptions.renderingContainerId) {
            renderingAreaElement.id = this.playerOptions.renderingContainerId;
        } else {
            // Generate random id with class name as prefix
            renderingAreaElement.id = this.playerOptions.renderingContainerClass +
                "-" + Math.round(Math.random() * Math.pow(10, 9));
        }

        // Insert new caption container
        videoWrapperElement.insertBefore(
            renderingAreaElement,
            this.videoElement,
        );

        // Catch fullscreen event
        const onFullscreen = (event: any) => {
            const isFullscreen = (
                document.fullscreenElement != null &&
                (document.fullscreenElement === videoWrapperElement
            ));

            videoWrapperElement.className = this.playerOptions.videoWrapperClass;

            if (isFullscreen) {
                videoWrapperElement.className += " full-screen";
            }
        };

        document.addEventListener("fullscreenchange", onFullscreen);

        // Get video metadata
        this.videoElement.addEventListener("loadedmetadata", (event: any) => {
            this.videoWidth = this.videoElement.videoWidth;
            this.videoHeight = this.videoElement.videoHeight;
        }, false );

        const ro = new ResizeObserver((entries: any, observer: any) => {
            // Resize rendering container to the size of video (add margins)
            let renderingAreaLeft = 0;
            let renderingAreaTop = 0;
            let renderingAreaWidth = this.videoElement.offsetWidth;
            let renderingAreaHeight = this.videoElement.offsetHeight;

            const videoRatio = this.videoWidth / this.videoHeight;

            if (
                (this.videoElement.offsetHeight * videoRatio) <
                this.videoElement.offsetWidth
            ) {
                // There are horizontal black borders around video
                renderingAreaLeft = (
                    this.videoElement.offsetWidth -
                    (this.videoElement.offsetHeight * videoRatio)) / 2;
                renderingAreaWidth = this.videoElement.offsetWidth -
                    renderingAreaLeft * 2;
            } else {
                renderingAreaTop = (
                    this.videoElement.offsetHeight -
                    (this.videoElement.offsetWidth / videoRatio)) / 2;
                renderingAreaHeight = this.videoElement.offsetHeight -
                    renderingAreaTop * 2;
            }

            this.renderingAreaElement.style.width = renderingAreaWidth + "px";
            this.renderingAreaElement.style.height = renderingAreaHeight + "px";
            this.renderingAreaElement.style.left = renderingAreaLeft + "px";
            this.renderingAreaElement.style.top = renderingAreaTop + "px";
        });

        ro.observe(this.videoElement);

        // Inject default css
        injectCSS(DEFAULT_CSS);

        this.videoWrapperElement = videoWrapperElement;
        this.renderingAreaElement = renderingAreaElement;
    }

    private syncRendering(): void {
        // Current video time
        const currentVideoTime = Math.abs(this.videoElement.currentTime * 1000);

        // Refresh captions every 500ms
        if (Math.abs(currentVideoTime - this.lastRefreshTime) > 500) {
            // Search captions to display
            const cues = this.cueFinder.findCues(currentVideoTime, currentVideoTime);
            const displayableCueIds = cues.map((cue) => cue.id);

            // List of cues (ids) that are currently displayed
            const alreadyDisplayedCueIds = displayableCueIds.filter((value) =>
                this.lastDisplayedCueIds.indexOf(value) !== -1,
            );

            if (alreadyDisplayedCueIds.length === 0) {
                // No more cues to display
                this.renderer.clear(this.renderingAreaElement);
            }

            for (const cue of cues) {
                if (this.lastDisplayedCueIds.indexOf(cue.id) === -1) {
                    // new cue
                    const displayableCue = {
                        items: cue.items.map((cueItem) => {
                            return {
                                type: cueItem.type,
                                data: cueItem.data,
                                style: this.cueTrack.styles[cueItem.styleId],
                            };
                        }),
                        region: this.cueTrack.regions[cue.regionId],
                    };
                    this.renderer.renderCue(
                        this.renderingAreaElement,
                        displayableCue,
                    );
                }
            }

            this.lastDisplayedCueIds = displayableCueIds;
            this.lastRefreshTime = currentVideoTime;
        }

        raf(() => { this.syncRendering(); });
    }
}
