import { Player, Renderer } from "lib/model/player";
import { TTMLParser } from "lib/parser/ttml_parser";
import { SimplePlayer } from "lib/player/simple_player";
import { SimpleRenderer } from "lib/player/simple_renderer";
import { fetch } from "lib/util";

class SubtitlePlayer {
    private videoElement: HTMLVideoElement;
    private player: Player;

    constructor(videoElement: HTMLVideoElement) {
        this.videoElement = videoElement;
        const renderer = new SimpleRenderer();
        this.player = new SimplePlayer<SimpleRenderer>(
            this.videoElement,
            renderer,
        );
    }

    public requestFullscreen() {
        this.player.requestFullscreen();
    }

    public displayTextTrack(textTrackUrl: string) {
        // Load text track
        fetch(textTrackUrl)
            .then((response: any) => {
                // Parse ttml data
                const ttmlParser = new TTMLParser();
                const cueTrack = ttmlParser.parse(response);
                this.player.loadCueTrack(cueTrack);
            })
            .catch((error: any) => {
                console.log(error);
            });
    }

}

export function wrap(
    videoElement: HTMLVideoElement,
) {
    return new SubtitlePlayer(videoElement);
}
