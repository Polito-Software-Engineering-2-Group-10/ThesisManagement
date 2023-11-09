FROM python:3.11
RUN pip install --no-cache-dir asyncpg
COPY create_authsources.py .
COPY config /var/www/simplesamlphp/config
CMD [ "python", "./create_authsources.py", "--port", "5432", "--host", "db" ]
