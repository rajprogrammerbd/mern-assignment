# frontend/Dockerfile
FROM node:18-alpine

# Install libc6
RUN apk update && apk add --no-cache libc6-compat

# Create non-root user
RUN addgroup -S app && adduser -S app -G app
USER app

WORKDIR /app

COPY --chown=app:app package*.json ./

RUN npm install --legacy-peer-deps

COPY --chown=app:app . .

EXPOSE 3000

CMD ["npm", "run", "dev"]
