FROM mcr.microsoft.com/playwright:v1.55.0-jammy

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

RUN chmod -R 777 /app

ENTRYPOINT ["npx", "playwright", "test"]
CMD ["--config=playwright.config.ts"]
