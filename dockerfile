
FROM node:18


WORKDIR /usr/src/app


COPY package*.json ./

RUN npm install

RUN addgroup -g 10014 choreo && \
    adduser  --disabled-password  --no-create-home --uid 10014 --ingroup choreo choreouser

COPY . .


EXPOSE 3000
USER 10014

CMD ["npm", "start"]
