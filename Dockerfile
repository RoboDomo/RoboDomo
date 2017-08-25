FROM node:8
ENV TZ=America/Los_Angeles
RUN npm install
CMD npm run dev
