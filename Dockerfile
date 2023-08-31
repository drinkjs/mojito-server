FROM node:18.17.1-alpine

ENV APP_PATH /app/mojito_server
ENV PUBLIC_PATH $APP_PATH/public
ENV MONGO_CONNECTION mongodb://host.docker.internal:27017/

WORKDIR $APP_PATH
COPY ["package.json", "package-lock.json*", "./"]
RUN npm install
COPY . .
RUN apk add --no-cache --upgrade bash
RUN chmod +x ./wait-for-it.sh
RUN mkdir $PUBLIC_PATH

VOLUME [$PUBLIC_PATH]

EXPOSE 3840

CMD ["npm", "run", "start:docker"]