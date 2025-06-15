# Info

把網址URL輸出到PDF

- 可以包含中文字
- 可以等網頁渲染完成
- PDF檔案相等於瀏覽器直接輸出成檔案

Output the URL to PDF

Can include Chinese characters
Can wait for the webpage to finish rendering
The PDF file is equivalent to directly outputting the browser as a file

# Build

## 針對當前平台建置
docker image build -t cklong2k/alpine-chrome-tw .

## 針對特定平台建置
docker image build --platform=linux/amd64 -t cklong2k/alpine-chrome-tw .

## 針對 ARM64 平台建置
docker image build --platform=linux/arm64 -t cklong2k/alpine-chrome-tw .

## 建置多平台映像（需要 buildx）
docker buildx build --platform=linux/amd64,linux/arm64 -t cklong2k/alpine-chrome-tw .

## 建置多平台映像並推送到 registry
docker buildx build --platform=linux/amd64,linux/arm64 -t cklong2k/alpine-chrome-tw --push .

## 如果要建置並載入到本地 Docker
docker buildx build --platform=linux/amd64 -t cklong2k/alpine-chrome-tw --load .

# Run

docker-compose up -d

or

docker container run -d -it --name=alpine-chrome-tw -p 8080:3000 --cap-add=SYS_ADMIN cklong2k/alpine-chrome-tw

# Commit

docker commit 4898794ace08 cklong2k/alpine-chrome-tw:latest

docker push cklong2k/alpine-chrome-tw:latest

# Test

curl -X POST http://localhost:8080/export/pdf \
  -H "Content-Type: application/json" \
  -d '{"url":"https://www.google.com"}' \
  --output test.pdf