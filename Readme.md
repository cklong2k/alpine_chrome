# Build

docker image build -t cklong2k/alpine-chrome-tw .


# Run

docker-compose up -d

docker container run -it --rm -p 8080:3000 --cap-add=SYS_ADMIN cklong2k/alpine-chrome-tw