FROM node:16
# Install ffmpeg because we actually need its binaries if 
# we wanna transcode videos..
RUN  apt -y update && \
    apt -y upgrade && \
    apt install ffmpeg && \
    rm -rf /var/lib/apt/lists/

WORKDIR /app

COPY package*.json /app/

RUN npm ci

COPY . /app/

RUN npm run build

CMD ["npm", "start"]
