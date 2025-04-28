FROM node:18-alpine
RUN apk add --no-cache bash
RUN addgroup -S app && adduser -S app -G app
USER app
WORKDIR /app
COPY --chown=app:app package*.json ./
RUN npm install --legacy-peer-deps
COPY --chown=app:app . .
COPY .env .env
EXPOSE 5000
CMD ["npm", "run", "dev"]
