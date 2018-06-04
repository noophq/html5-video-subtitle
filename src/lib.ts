/*
 *  This file is part of the NOOP organization .
 *
 *  (c) Cyrille Lebeaupin <clebeaupin@noop.fr>
 *
 *  For the full copyright and license information, please view the LICENSE
 *  file that was distributed with this source code.
 *
 */

import { Player, Renderer } from "lib/model/player";
import { TTMLParser } from "lib/parser/ttml_parser";
import { SimplePlayer } from "lib/player/simple_player";
import { SimpleRenderer } from "lib/player/simple_renderer";

export function wrap(
    videoElement: HTMLVideoElement,
    playerOptions?: any
) {
    const renderer = new SimpleRenderer();
    const player = new SimplePlayer<SimpleRenderer>(
        videoElement,
        renderer,
        playerOptions
    );

    return player;
}
