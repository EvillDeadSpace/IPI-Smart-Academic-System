import boto3
from botocore.exceptions import BotoCoreError, ClientError
from dotenv import load_dotenv
import os
from typing import TYPE_CHECKING, Optional

if TYPE_CHECKING:
    from mypy_boto3_s3.client import S3Client

load_dotenv()

endpoint_url: Optional[str] = os.environ.get("BUCKET_NAME")
filebase_access_key_id: Optional[str] = os.environ.get("FILEBASE_ACCESS_KEY")
filebase_secret_access_key: Optional[str] = os.environ.get("FILEBASE_SECRET_KEY")

# Initialize S3 client immediately
s3_client: "S3Client" = boto3.client(
    's3',
    endpoint_url='https://s3.filebase.com',
    aws_access_key_id=filebase_access_key_id,
    aws_secret_access_key=filebase_secret_access_key
)

# Check if connection is successful
try:
    s3_client.list_buckets()
    print("✅ Filebase S3 connected")
except (BotoCoreError, ClientError) as e:
    print("❌ S3 connection failed:", e)
    raise