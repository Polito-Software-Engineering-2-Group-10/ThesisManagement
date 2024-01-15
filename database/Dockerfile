FROM postgres:16

RUN apt-get update && \
    apt-get -y install postgresql-16-cron && \
    rm -r /var/lib/apt/lists/*

COPY postgresql.conf /etc/postgresql/postgresql.conf

ENV POSTGRES_PASSWORD=thesismanager
ENV POSTGRES_USER=thesismanager
ENV POSTGRES_DB=thesismanagement
COPY create_tables.sql .
COPY init_data.sql .
COPY testing_data.sql .
COPY create_db.sh /docker-entrypoint-initdb.d/
EXPOSE 5432