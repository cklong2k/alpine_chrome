# Build

docker image build -t cklong2k/alpine-chrome-tw .


# Run

docker-compose up -d

or

docker container run -it --rm -p 8080:3000 --cap-add=SYS_ADMIN cklong2k/alpine-chrome-tw

# Commit

docker commit 4898794ace08 cklong2k/alpine-chrome-tw:latest

docker push cklong2k/alpine-chrome-tw:latest