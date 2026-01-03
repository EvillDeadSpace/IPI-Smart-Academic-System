from notification_service.initClient import mailjet
import json

const_data_for_email = {
    "FromEmail": "amartubic1@gmail.com",
    "FromName": "IPI Smart Akademija",
}

def function_send_notification(received_data):
    print("Function start")
    print(f"Received data: {json.dumps(received_data, indent=2)}")
    
    if received_data is None:
        print("Need to set all data to notification service work")
        return False
    
    # Map frontend data format to Mailjet API format
    mailjet_data = {
        "Subject": received_data.get("subjectName", "IPI Akademija - Obaveštenje"),
        "Text-part": received_data.get("Text", ""),
        "Recipients": received_data.get("Recipients", [])
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
            sent = response_json.get('Sent', [])
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