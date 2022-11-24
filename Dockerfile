FROM node:19-alpine3.15
WORKDIR /DS2022_30643_Moldovan_Andrei_1_Frontend
ENV PATH="./node_modules/.bin:$PATH"
COPY . .
RUN npm run build
CMD ["npm", "start"]
#docker run --publish 3000:3000 react