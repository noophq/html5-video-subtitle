FROM httpd:2.4-alpine

COPY docker/entrypoint.sh /usr/local/bin/entrypoint.sh
COPY docker/assets/app.js /usr/local/apache2/htdocs
COPY docker/assets/index.html.template /usr/local/apache2/htdocs
COPY dist/bundle.js /usr/local/apache2/htdocs
COPY node_modules/shaka-player/dist/shaka-player.compiled.js /usr/local/apache2/htdocs
COPY test/resources/subtitles/test.xml /usr/local/apache2/htdocs

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]

CMD ["app:start"]
