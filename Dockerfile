FROM node:26-bookworm-slim AS frontend
WORKDIR /build
RUN npm install -g pnpm@11.19.0
COPY frontend/package.json frontend/pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY frontend/ ./
RUN pnpm build

FROM python:3.12-slim
ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1 STATIC_DIR=/app/frontend/dist
WORKDIR /app
COPY backend/ /app/backend/
RUN pip install --no-cache-dir './backend[postgres]' && useradd --create-home woofy
COPY --from=frontend /build/dist/ /app/frontend/dist/
RUN mkdir -p /app/data && chown -R woofy:woofy /app
USER woofy
EXPOSE 8000
HEALTHCHECK --interval=30s --timeout=5s CMD python -c "import urllib.request; urllib.request.urlopen('http://127.0.0.1:8000/health', timeout=3)"
CMD ["sh", "-c", "alembic -c backend/alembic.ini upgrade head && uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}"]
