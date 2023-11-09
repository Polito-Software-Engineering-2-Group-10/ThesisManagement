FROM postgres:16
ENV POSTGRES_PASSWORD=thesismanager
ENV POSTGRES_USER=thesismanager
ENV POSTGRES_DB=thesismanagement
COPY create_tables.sql .
COPY init_data.sql .
COPY create_db.sh /docker-entrypoint-initdb.d/