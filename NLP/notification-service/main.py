from __future__ import print_function
import time
import sib_api_v3_sdk
from sib_api_v3_sdk.rest import ApiException
from pprint import pprint
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Instantiate the client
configuration = sib_api_v3_sdk.Configuration()
configuration.api_key['api-key'] = os.getenv('BREVO_API_KEY')

api_instance = sib_api_v3_sdk.TransactionalEmailsApi(sib_api_v3_sdk.ApiClient(configuration))

# Define the email
send_smtp_email = sib_api_v3_sdk.SendSmtpEmail(
    to=[{"email": "amartubic1@gmail.com", "name": "Test Student"}],
    sender={"name": "IPI Smart System", "email": "no-reply@yourdomain.com"},
    subject="Test Email from IPI System",
    html_content="<h1>Hello!</h1><p>This is a test email from IPI Smart Academic System.</p>"
)

# Send the email
try:
    api_response = api_instance.send_transac_email(send_smtp_email)
    print("✅ Email sent successfully!")
    pprint(api_response)
except ApiException as e:
    print("❌ Exception when calling TransactionalEmailsApi->send_transac_email: %s\n" % e)