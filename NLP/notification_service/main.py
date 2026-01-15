from notification_service.initClient import mailjet
import json
from typing import Dict, Any, Optional
from notification_service.emailTamplete import (
    create_professional_email_html,
    format_exam_notification,
    format_welcome_email,
)


const_data_for_email: Dict[str, str] = {
    "FromEmail": "amartubic1@gmail.com",
    "FromName": "IPI Smart Akademija",
}


def function_send_notification(received_data: Optional[Dict[str, Any]]) -> bool:
    print("Function start")
    print(f"Received data: {json.dumps(received_data, indent=2)}")

    if received_data is None:
        print("Need to set all data to notification service work")
        return False

    recipients = received_data.get("Recipients", [])

    # Check what type of email was
    email_type = received_data.get("type", "exam")

    if email_type == "welcome":
        student_name = received_data.get("studentName", "Studente")
        formatted_message = format_welcome_email(student_name)
        subject = "Dobrodošli u IPI Smart Akademiju! 🎓"
        message_text = f"Dobrodošli {student_name}!"  # Plain text fallback

    elif email_type == "exam":
        message_text = received_data.get("Text", "")
        formatted_message = format_exam_notification(message_text)
        subject = received_data.get("subjectName", "Novi ispit kreiran")

    # Generate HTML version with formatted text
    html_content = create_professional_email_html(subject, formatted_message)

    mailjet_data = {
        "Subject": subject,
        "Text-part": message_text,  # Plain text fallback
        "Html-part": html_content,  # Beautiful HTML version
        "Recipients": recipients,
    }

    # Merge with constant email data
    dataToSend = const_data_for_email | mailjet_data

    print(f"Sending to Mailjet: {json.dumps(dataToSend, indent=2)}")

    result = mailjet.send.create(data=dataToSend)
    print(f"Status Code: {result.status_code}")
    print(f"Response text: '{result.text}'")

    try:
        response_json = result.json()
        print(f"\nFull Response:")
        print(json.dumps(response_json, indent=2))

        if result.status_code == 200:
            sent = response_json.get("Sent", [])
            if sent:
                print(f"\n✓ Email sent successfully!")
                print(f"  To: {sent[0].get('Email')}")
                print(f"  MessageID: {sent[0].get('MessageID')}")
                return True
            else:
                print(f"\n✗ Failed to send email - No recipients in 'Sent' array")
                return False
        else:
            print(f"\n✗ Failed to send email (Status {result.status_code})")
            return False

    except Exception as e:
        print(f"\n✗ Error: {e}")
        return False
