# ---------- Stage 1: Base Python ----------
FROM python:3.11-alpine

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apk add --no-cache gcc musl-dev libffi-dev mariadb-dev bash

# Upgrade pip
RUN pip install --upgrade pip

# Copy requirements
COPY requirements.txt .

# Install Python dependencies
RUN pip install -r requirements.txt

# Copy backend code
COPY . .

# Collect static files
RUN python manage.py collectstatic --noinput

# Expose port Django will run on
EXPOSE 8000

# Start Django with Uvicorn (ASGI)
CMD ["uvicorn", "backend.asgi:application", "--host", "0.0.0.0", "--port", "8000", "--workers", "4"]
