FROM node:20
EXPOSE 8080
WORKDIR /opt/backend
COPY package.json .
COPY *.js .
RUN npm install
ENV DB_HOST="mysql"
#ENV DB_HOST="localhost"
CMD ["node", "index.js"]
USER root