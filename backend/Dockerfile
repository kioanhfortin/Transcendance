FROM python:3.10

WORKDIR /app

COPY . /app

COPY requirements.txt .

COPY wait-for-it.sh /wait-for-it.sh
RUN chmod +x /wait-for-it.sh


RUN pip install --no-cache-dir -r requirements.txt


# Copy the entrypoint script
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

COPY create_superuser.py .

ENTRYPOINT ["docker-entrypoint.sh"]

EXPOSE 8000

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
