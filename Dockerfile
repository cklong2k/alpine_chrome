FROM alpine:3.10

ARG BUILD_DATE
ARG VCS_REF
ARG APP_LOCALE=zh_TW
ARG APP_CHARSET=UTF-8

COPY ./fonts/ /usr/share/fonts/

ENV LANG=zh_TW.UTF-8 \
    LANGUAGE=zh_TW.UTF-8
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD 1
ENV PUPPETEER_EXECUTABLE_PATH /usr/bin/chromium-browser

# Installs latest Chromium package.
RUN echo http://dl-cdn.alpinelinux.org/alpine/v3.10/community > /etc/apk/repositories \
    && echo http://dl-cdn.alpinelinux.org/alpine/v3.10/main >> /etc/apk/repositories \
    && echo http://dl-cdn.alpinelinux.org/alpine/edge/testing >> /etc/apk/repositories \
    && apk add --no-cache \
    libstdc++ \
    chromium \
    chromium-chromedriver \
    harfbuzz \
    nss \
    sudo \
    freetype \
    ttf-freefont \
    && rm -rf /var/cache/* \
    && mkdir /var/cache/apk

# node
RUN apk add --no-cache tini make gcc g++ python git nodejs nodejs-npm yarn \
    && apk add --no-cache -X http://dl-cdn.alpinelinux.org/alpine/edge/testing wqy-zenhei \
	&& rm -rf /var/lib/apt/lists/* \
    /var/cache/apk/* \
    /usr/share/man \
    /tmp/*

# Add Chrome as a user
RUN mkdir -p /usr/src/app \
    && adduser -D chrome \
    && chown -R chrome:chrome /usr/src/app
    
# Run Chrome as non-privileged
USER chrome
# COPY ./script.sh /home/chrome
WORKDIR /usr/src/app

ENV CHROME_BIN=/usr/bin/chromium-browser \
    CHROME_PATH=/usr/lib/chromium/

COPY --chown=chrome package.json package-lock.json ./

RUN npm install express mustache-express puppeteer qrcode --save

COPY --chown=chrome . ./

ENTRYPOINT ["tini", "--"]

CMD ["node", "src/app"]