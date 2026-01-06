#!/bin/sh
set -e

# Wait for MinIO to be ready
echo "Waiting for MinIO to be ready..."
sleep 5

# Configure MinIO client
mc alias set myminio http://minio:9000 minioadmin minioadmin

# Create bucket if it doesn't exist
if ! mc ls myminio/my-baby > /dev/null 2>&1; then
  echo "Creating bucket 'my-baby'..."
  mc mb myminio/my-baby
  echo "Bucket created successfully."
else
  echo "Bucket 'my-baby' already exists."
fi

# Set bucket policy to public read
echo "Setting bucket policy to public read..."
mc anonymous set download myminio/my-baby

echo "MinIO initialization completed!"
