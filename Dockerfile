FROM node:lts-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build --production

FROM node:lts-alpine
WORKDIR /app
COPY --from=builder /app .
EXPOSE 3000
CMD npm start
