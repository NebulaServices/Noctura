FROM node:20.4-bookworm-slim
WORKDIR /usr/src/app
COPY . .
RUN npm i -g pnpm
RUN pnpm i
RUN npm run build
EXPOSE 8080
CMD ["npm", "start"]
