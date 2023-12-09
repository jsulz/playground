FROM python:3.12-slim

ENV PYTHONUNBUFFERED True

ENV APP_HOME /app
WORKDIR $APP_HOME
COPY . ./

RUN pip install --no-cache-dir -r requirements.txt
ENV HOST 0.0.0.0
EXPOSE 8888

CMD ["gunicorn"  , "-b", "0.0.0.0:8888", "run:app"]