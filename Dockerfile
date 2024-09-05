# Build stage
FROM node:20 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM nginx:1.27.1-bookworm
COPY --from=builder /app/dist /usr/share/nginx/html

# Install AWS CLI and other necessary tools
RUN apt-get update && apt-get install -y \
    python3 \
    python3-venv \
    python3-pip \
    gettext-base
RUN python3 -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"
RUN pip3 install --no-cache-dir awscli

EXPOSE 80

COPY start.sh .
RUN chmod +x start.sh

CMD ["./start.sh"]