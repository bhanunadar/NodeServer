FROM mhart/alpine-node

RUN npm i -g nodemon

WORKDIR /src

EXPOSE 3000

CMD ["npm", "start"]
