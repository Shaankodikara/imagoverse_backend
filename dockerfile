
FROM node:18


WORKDIR /usr/src/app


COPY package*.json ./

RUN npm install

RUN addgroup --gid 10014 choreo && \
    adduser --disabled-password --no-create-home --uid 10014 --ingroup choreo choreouser

COPY . .

USER 10014
EXPOSE 3000


CMD ["npm", "start"]
