from threading import local
from .client import s3_client, endpoint_url
import json
from typing import Any
import os


def upload_file(professor_subject: str, assignment: str, file_to_save: Any) -> None:
    if endpoint_url is None:
        raise ValueError("Endpoint URL is not configured")

    # Read file content from FileStorage object
    file_content = file_to_save.read()

    # Get original filename and extract extension
    original_filename = file_to_save.filename
    file_extension = os.path.splitext(original_filename)[
        1
    ]  # Includes the dot, e.g., '.pdf'

    s3_client.put_object(
        Bucket=endpoint_url,
        Key=f"{professor_subject}/{assignment}{file_extension}",
        Body=file_content,
    )
    print(f"✅ File uploaded successfully as {assignment}{file_extension}")


def get_all_files_s3(professor_subject: str):
    if endpoint_url is None:
        raise ValueError("Bucket name is not configured")

    prefix = (
        f"{professor_subject}/"
        if not professor_subject.endswith("/")
        else professor_subject
    )

    response = s3_client.list_objects_v2(Bucket=endpoint_url, Prefix=prefix)

    if "Contents" not in response:
        print(f"📁 Folder '{professor_subject}' je prazan ili ne postoji")
        return []

    print(f"\n📁 Pronađeno {response['KeyCount']} fajl(ova) u '{professor_subject}':")
    print("=" * 70)

    field_list = []

    for item in response["Contents"]:
        if "Key" in item:
            field_list.append(item["Key"])

    # Print a JSON representation for debugging when run standalone
    print(json.dumps(field_list, indent=2))
    return field_list


def get_file_stream(folder_name: str, file_name: str):
    """Get file from S3 and return as bytes (for streaming to client)."""
    if endpoint_url is None:
        raise ValueError("Endpoint URL is not configured")

    key = f"{folder_name}/{file_name}"

    try:
        print(f"📥 Fetching '{key}' from S3...")
        response = s3_client.get_object(Bucket=endpoint_url, Key=key)
        file_data = response["Body"].read()
        print(f"✅ Fetched {len(file_data)} bytes")
        return file_data
    except Exception as e:
        print(f"❌ Failed to fetch '{key}': {e}")
        raise


if __name__ == "__main__":
    # Standalone test: list files
    files = get_all_files_s3("Matematika 1")
    print(f"\nReturned {len(files)} file(s)")
