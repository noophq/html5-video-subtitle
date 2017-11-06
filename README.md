# HTML5 Video Subtitle

## Build status

TravisCI, `master` branch:

[![Build Status](https://travis-ci.org/noophq/html5-video-subtitle.svg?branch=master)](https://travis-ci.org/noophq/html5-video-subtitle)

## Introduction

Browser capabilities to display subtitles are very limited. Each browser has
its own implementation: IE is able to display TTML file with positioning and
colors but not chrome or firefox.

This is the reason why this project has been built: create a generic
implementation for displaying subtitles on all browsers.

## Implementation

The current implementation uses RAF to display subtitles in overlay of the video.
Subtitles are stored in a BTree and every 500ms we search for new subtitles to
be displayed.

## Prerequisites

1) NodeJS >= 7 (check with `node --version`)
2) NPM >= 5.3 (check with `npm --version`)

## Quick start

In html5-video-subtitle project

### Install html5-video-subtitle dependencies

`npm install`

### Start application in dev environment

`npm run start:dev`

### Start application in production environment

`npm start`

## Lint

It's very important (required) to launch lint before pushing any code on github repository

`npm run lint`

## Integration in your own code

### HTML

```
<!DOCTYPE html>
<html>
  <body>
    <video
      id="video"
      src="my-video.webm"
      width="640"
      controls autoplay>
    </video>
    <br />
    <button
        id="fullscreen">
    Fullscreen
    </button>
    <script src="html5-video-subtitle.js"></script>
    <script src="app.js"></script>
  </body>
</html>
```

### app.js

```
function initPlayer() {
    var video = document.getElementById("video");
    const sPlayer = subtitlePlayer.wrap(video);

    var fullscreenButton = document.getElementById("video-fullscreen");
    fullscreenButton.addEventListener("click", (event) => {
        sPlayer.requestFullscreen();
    });

    // Display your TTML file
    sPlayer.displayTextTrack("test.xml");
}


document.addEventListener("DOMContentLoaded", initPlayer);
```

## Fullscreen

You cannot use internal html5 video fullscreen feature. If you click on the
fullscreen control of your video, subtiles won't be displayed: the browser
only puts in fullscreen the video container and not the subtitle container.

It's why you need to implement your own control to display the video in
fullscreen.
