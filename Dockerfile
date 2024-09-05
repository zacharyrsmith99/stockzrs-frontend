FROM node:20 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80

# Install AWS CLI and other necessary tools
RUN apk add --no-cache \
    python3 \
    py3-pip \
    gettext \
    aws-cli

RUN pip3 install --no-cache-dir awscli

COPY start.sh .
RUN chmod +x start.sh

CMD ["./start.sh"]
