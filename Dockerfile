FROM httpd:2.4-alpine

RUN mkdir -p /usr/local/apache2/htdocs/node_modules/shaka-player/dist && \
    mkdir -p /usr/local/apache2/htdocs/dist && \
    mkdir -p /usr/local/apache2/htdocs/test/resources/subtitles

COPY test/app /usr/local/apache2/htdocs
COPY dist/bundle.js /usr/local/apache2/htdocs/dist
COPY test/resources/subtitles/test.xml /usr/local/apache2/htdocs/test/resources/subtitles
COPY node_modules/shaka-player/dist/shaka-player.compiled.js /usr/local/apache2/htdocs/node_modules/shaka-player/dist
