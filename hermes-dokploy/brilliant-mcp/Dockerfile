FROM python:3.12-slim

WORKDIR /app

# Install only the mcp package (it pulls in httpx as a dependency automatically)
RUN pip install --no-cache-dir "mcp>=1.0.0"

COPY server.py .

EXPOSE 8002

CMD ["python", "server.py"]
