#!/bin/sh
set -e

# Wait for MinIO to be ready
echo "Waiting for MinIO to be ready..."
sleep 5

# Configure MinIO client (use internal port 9000)
mc alias set myminio http://minio:9000 minioadmin minioadmin

# Create bucket if it doesn't exist
if ! mc ls myminio/my-baby > /dev/null 2>&1; then
  echo "Creating bucket 'my-baby'..."
  mc mb myminio/my-baby
  echo "Bucket created successfully."
else
  echo "Bucket 'my-baby' already exists."
fi

# Set bucket policy to public (full access for internal network proxy)
echo "Setting bucket policy to public..."
mc anonymous set public myminio/my-baby

# Configure CORS for the bucket to allow browser uploads
echo "Configuring CORS for bucket..."
cat > /tmp/cors.json << 'EOF'
{
  "CORSRules": [
    {
      "AllowedOrigins": ["*"],
      "AllowedMethods": ["GET", "PUT", "POST", "DELETE", "HEAD"],
      "AllowedHeaders": ["*"],
      "ExposeHeaders": ["ETag", "x-amz-meta-*"],
      "MaxAgeSeconds": 3600
    }
  ]
}
EOF

# Apply CORS configuration using mc admin
# Note: mc doesn't have direct CORS support, so we use anonymous policy for now
# The CORS is handled by MinIO server configuration

echo "MinIO initialization completed!"
