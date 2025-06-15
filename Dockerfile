FROM node:20-alpine

ARG BUILD_DATE
ARG VCS_REF
ARG APP_LOCALE=zh_TW
ARG APP_CHARSET=UTF-8

# 設定環境變數
ENV LANG=zh_TW.UTF-8 \
    LANGUAGE=zh_TW.UTF-8 \
    LC_ALL=zh_TW.UTF-8
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=1
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
ENV CHROME_BIN=/usr/bin/chromium-browser
ENV CHROME_PATH=/usr/lib/chromium/

# 安裝系統依賴和 Chromium
RUN apk add --no-cache \
    # 基本工具
    curl \
    tini \
    sudo \
    # 編譯工具 (如果需要編譯原生模組)
    make \
    gcc \
    g++ \
    python3 \
    # Chromium 相關
    chromium \
    chromium-chromedriver \
    # 字體和渲染支援
    libstdc++ \
    harfbuzz \
    nss \
    freetype \
    ttf-freefont \
    font-noto-cjk \
    # 清理快取
    && rm -rf /var/cache/apk/*

# 複製字體檔案 (如果有自定義字體)
COPY ./fonts/ /usr/share/fonts/

# 更新字體快取
RUN fc-cache -fv

# 建立應用程式目錄和用戶
RUN mkdir -p /usr/src/app && \
    adduser -D -s /bin/sh chrome && \
    chown -R chrome:chrome /usr/src/app

# Run Chrome as non-privileged
USER chrome
# COPY ./script.sh /home/chrome
WORKDIR /usr/src/app

ENV CHROME_BIN=/usr/bin/chromium-browser \
    CHROME_PATH=/usr/lib/chromium/

COPY --chown=chrome package.json ./

RUN npm install express mustache-express puppeteer qrcode --save

# RUN npm ci --only=production && \
#     npm cache clean --force

COPY --chown=chrome . ./

ENTRYPOINT ["tini", "--"]

CMD ["node", "src/app"]