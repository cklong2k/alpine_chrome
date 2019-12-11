FROM alpine:3.10

ARG BUILD_DATE
ARG VCS_REF
ARG APP_LOCALE=zh_TW
ARG APP_CHARSET=UTF-8

COPY ./fonts/ /usr/share/fonts/

ENV LANG=zh_TW.UTF-8 \
    LANGUAGE=zh_TW.UTF-8

# Installs latest Chromium package.
RUN echo @edge http://dl-cdn.alpinelinux.org/alpine/v3.10/community > /etc/apk/repositories \
    && echo @edge http://dl-cdn.alpinelinux.org/alpine/v3.10/main >> /etc/apk/repositories \
    && echo @edge http://dl-cdn.alpinelinux.org/alpine/edge/testing >> /etc/apk/repositories \
    && apk add --no-cache \
    libstdc++@edge \
    chromium@edge \
    harfbuzz@edge \
    nss@edge \
    freetype@edge \
    ttf-freefont@edge \
    && rm -rf /var/cache/* \
    && mkdir /var/cache/apk

# Add Chrome as a user
RUN mkdir -p /usr/src/app \
    && adduser -D chrome \
    && chown -R chrome:chrome /usr/src/app
# Run Chrome as non-privileged
USER chrome
WORKDIR /usr/src/app

ENV CHROME_BIN=/usr/bin/chromium-browser \
    CHROME_PATH=/usr/lib/chromium/

# Autorun chrome headless with no GPU
ENTRYPOINT ["chromium-browser", "--headless", "--disable-gpu", "--disable-software-rasterizer", "--disable-dev-shm-usage"]