FROM python:3.10

WORKDIR /code

COPY requirements.txt .

RUN pip install --upgrade pip && \
    pip install -r requirements.txt

COPY backend/ app

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "7860"]
