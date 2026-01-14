from .client import s3_client, endpoint_url
from typing import Any
import os


def upload_file(professor_subject: str, assignment: str, file_to_save: Any) -> None:
    if endpoint_url is None:
        raise ValueError("Endpoint URL is not configured")
    
    # Read file content from FileStorage object
    file_content = file_to_save.read()
    
    # Get original filename and extract extension
    original_filename = file_to_save.filename
    file_extension = os.path.splitext(original_filename)[1]  # Includes the dot, e.g., '.pdf'
    
    s3_client.put_object(
        Bucket=endpoint_url,
        Key=f"{professor_subject}/{assignment}{file_extension}",
        Body=file_content
    )
    print(f"✅ File uploaded successfully as {assignment}{file_extension}")
