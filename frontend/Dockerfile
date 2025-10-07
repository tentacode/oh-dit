FROM node:24-alpine

RUN apk add --no-cache zsh git curl ssh

RUN sh -c "$(curl -fsSL https://raw.github.com/ohmyzsh/ohmyzsh/master/tools/install.sh)" "" --unattended

ENV SHELL=/bin/zsh

RUN sed -i 's/plugins=(git)/plugins=(git node npm docker docker-compose)/' ~/.zshrc

WORKDIR /app

COPY package*.json ./

ENV HOST=0.0.0.0
ENV PORT=4321
ENV PATH="/app/node_modules/.bin:$PATH"

EXPOSE 4321

CMD ["sh", "-c", "npm ci && npm run dev"]