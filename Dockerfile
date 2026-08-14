FROM node:22-alpine

WORKDIR /app
COPY package.json ./
COPY .env.ports ./
COPY backend ./backend
COPY frontend ./frontend
COPY docs ./docs
COPY deliverables ./deliverables
COPY scripts ./scripts
COPY tests ./tests

EXPOSE 5214 6214 8214
CMD ["node", "scripts/start-all.js"]
