FROM node:21.5-slim as build
WORKDIR /app/
COPY ./playground/static/package.json ./
COPY ./playground/static/package-lock.json ./
COPY ./playground/static/webpack.config.js ./
RUN npm ci
COPY ./playground/static/scripts ./scripts/
RUN npm run build

FROM python:3.12-slim
ENV PYTHONUNBUFFERED True
ENV APP_HOME /app
WORKDIR $APP_HOME
COPY . ./
RUN apt update && apt-get install -y libenchant-2-dev
RUN pip install --no-cache-dir -r requirements.txt

COPY --from=build /app/dist/ /app/playground/static/dist

ENV HOST 0.0.0.0
EXPOSE 8888

CMD ["gunicorn"  , "--workers=4", "-b", "0.0.0.0:8888", "run:app"]