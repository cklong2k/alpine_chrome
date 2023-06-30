# Info

把網址URL輸出到PDF

- 可以包含中文字
- 可以等網頁渲染完成
- PDF檔案相等於瀏覽器直接輸出成檔案

# Build

docker image build -t cklong2k/alpine-chrome-tw .


# Run

docker-compose up -d

or

docker container run -it --rm -p 8080:3000 --cap-add=SYS_ADMIN cklong2k/alpine-chrome-tw

# Commit

docker commit 4898794ace08 cklong2k/alpine-chrome-tw:latest

docker push cklong2k/alpine-chrome-tw:latest

# Test

curl --location 'http://localhost/export/pdf' \
--header 'Content-Type: application/json' \
--data '{
    "url": "https://tw.yahoo.com"
}'