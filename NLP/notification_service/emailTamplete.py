from datetime import datetime
import re


def format_message_text(text: str | None) -> str | None:
    """
    Format the exam notification message with emojis and bold formatting.
    Also formats ISO datetime strings into a more human-readable format.
    """
    if not text:
        return text

    # Extract structured information from the text
    exam_info = {
        "subject": None,
        "date": None,
        "time": None,
        "classroom": None,
        "max_points": None,
    }

    # Parse ISO datetime
    datetime_match = re.search(r"(\d{4}-\d{2}-\d{2}T\d{2}:\d{2})", text)
    if datetime_match:
        try:
            dt = datetime.fromisoformat(datetime_match.group(1))
            months_sr = {
                1: "januara",
                2: "februara",
                3: "marta",
                4: "aprila",
                5: "maja",
                6: "juna",
                7: "jula",
                8: "avgusta",
                9: "septembra",
                10: "oktobra",
                11: "novembra",
                12: "decembra",
            }
            exam_info["date"] = f"{dt.day}. {months_sr[dt.month]} {dt.year}."
            exam_info["time"] = f"{dt.hour:02d}:{dt.minute:02d}h"
        except Exception:
            pass

    # Parse subject
    subject_match = re.search(
        r"predmet\s+([A-ZŠĐČĆŽ][a-zšđčćž\s\d]+?)(?:\s+\d{4}|\s+dana|\s+u)", text
    )
    if subject_match:
        exam_info["subject"] = subject_match.group(1).strip()

    # Parse classroom
    classroom_match = re.search(r"učionici\s+([A-Z0-9a-z]+)", text)
    if classroom_match:
        exam_info["classroom"] = classroom_match.group(1)

    # Parse max points
    points_match = re.search(r"(?:Maksimalan broj bodova:|bodova:)\s*(\d+)", text)
    if points_match:
        exam_info["max_points"] = points_match.group(1)

    # Create beautiful formatted HTML
    formatted_html = '<div style="font-size: 16px; line-height: 1.8;">'

    # Opening message
    formatted_html += '<p style="margin-bottom: 20px; font-size: 17px;">📢 <strong>Novi ispit je zakazan!</strong></p>'

    # Subject info
    if exam_info["subject"]:
        subject_emoji = (
            "📐"
            if "Matematika" in exam_info["subject"]
            else (
                "💻"
                if "Programiranje" in exam_info["subject"]
                else "🔬"
                if "Fizika" in exam_info["subject"]
                else "📚"
            )
        )
        formatted_html += f"""
        <div style="background-color: #f0f4ff; padding: 15px; border-radius: 8px; margin-bottom: 15px; border-left: 4px solid #667eea;">
            <p style="margin: 5px 0;"><strong>Predmet:</strong> {subject_emoji} <span style="color: #764ba2; font-size: 18px;">{exam_info["subject"]}</span></p>
        </div>
        """

    # Date, Time, Classroom in nice boxes
    formatted_html += '<div style="display: table; width: 100%; margin-bottom: 20px;">'

    if exam_info["date"] or exam_info["time"]:
        formatted_html += """
        <div style="background-color: #fff3e0; padding: 12px; border-radius: 8px; margin-bottom: 10px; border-left: 4px solid #ff9800;">
            <p style="margin: 5px 0;">📅 <strong>Datum:</strong> <span style="font-size: 17px;">{}</span></p>
            <p style="margin: 5px 0;">🕐 <strong>Vrijeme:</strong> <span style="font-size: 17px;">{}</span></p>
        </div>
        """.format(exam_info["date"] or "N/A", exam_info["time"] or "N/A")

    if exam_info["classroom"]:
        formatted_html += f"""
        <div style="background-color: #e8f5e9; padding: 12px; border-radius: 8px; margin-bottom: 10px; border-left: 4px solid #4caf50;">
            <p style="margin: 5px 0;">🚪 <strong>Učionica:</strong> <span style="font-size: 17px; color: #2e7d32;">{exam_info["classroom"]}</span></p>
        </div>
        """

    if exam_info["max_points"]:
        formatted_html += f"""
        <div style="background-color: #fce4ec; padding: 12px; border-radius: 8px; border-left: 4px solid #e91e63;">
            <p style="margin: 5px 0;">🎯 <strong>Maksimalan broj bodova:</strong> <span style="font-size: 18px; color: #c2185b;">{exam_info["max_points"]} bodova</span></p>
        </div>
        """

    formatted_html += "</div>"
    formatted_html += '<p style="margin-top: 20px; font-size: 15px; color: #666;">Molimo vas da se blagovremeno pripremite za ispit. Srećno! 🍀</p>'
    formatted_html += "</div>"

    return formatted_html


def format_exam_notification(message_text: str) -> str:
    """
    Format exam notification message.
    This is a wrapper around format_message_text for exam notifications.
    """
    return format_message_text(message_text) or message_text


def format_welcome_email(student_name):
    """
    Format the welcome email for new students.
    Args:
        student_name: Name of the student
    Returns:
        Formatted HTML string for welcome message
    """
    formatted_html = '<div style="font-size: 16px; line-height: 1.8;">'

    # Welcome message
    formatted_html += f"""
    <p style="margin-bottom: 20px; font-size: 18px;">
        🎉 <strong>Dobrodošli, {student_name}!</strong>
    </p>
    """

    # Welcome content
    formatted_html += """
    <div style="background-color: #f0f4ff; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #667eea;">
        <p style="margin: 10px 0; font-size: 16px;">
            Drago nam je što ste se pridružili <strong style="color: #764ba2;">IPI Smart Akademiji</strong>! 🎓
        </p>
        <p style="margin: 10px 0; font-size: 16px;">
            Vaš nalog je uspješno kreiran i sada možete pristupiti svim funkcionalnostima našeg sistema.
        </p>
    </div>
    """

    # What's next section
    formatted_html += """
    <div style="background-color: #e8f5e9; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #4caf50;">
        <p style="margin: 5px 0; font-size: 17px;"><strong>📌 Šta možete uraditi sada:</strong></p>
        <ul style="margin: 15px 0; padding-left: 20px; font-size: 15px; line-height: 2;">
            <li>✅ Prijavite se na sistem sa vašim kredencijalima</li>
            <li>📚 Pregledajte dostupne predmete i studijske programe</li>
            <li>📅 Proverite raspored ispita i predavanja</li>
            <li>💬 Koristite AI chatbot za sve vaše upite</li>
            <li>📧 Pratite obaveštenja na vašem email-u</li>
        </ul>
    </div>
    """

    # Support section
    formatted_html += """
    <div style="background-color: #fff3e0; padding: 15px; border-radius: 8px; border-left: 4px solid #ff9800;">
        <p style="margin: 5px 0; font-size: 15px;">
            💡 <strong>Trebate pomoć?</strong> Naš tim podrške je tu za vas!
        </p>
        <p style="margin: 10px 0; font-size: 14px; color: #666;">
            Kontaktirajte nas na <strong>info@ipi-akademija.ba</strong> ili pozovite <strong>+387 35 258 454</strong>
        </p>
    </div>
    """

    # Closing message
    formatted_html += """
    <p style="margin-top: 25px; font-size: 16px; color: #555;">
        Želimo vam uspješan studij i puno sreće! 🍀
    </p>
    <p style="margin-top: 10px; font-size: 15px; color: #764ba2;">
        <strong>IPI Smart Akademija tim</strong>
    </p>
    """

    formatted_html += "</div>"

    return formatted_html


def format_assignment_notification(message_text: str, subject: str) -> str:
    """
    Format assignment notification message with beautiful styling.
    Args:
        message_text: The assignment description/details
        subject: Subject name for the assignment
    Returns:
        Formatted HTML string for assignment notification
    """
    formatted_html = '<div style="font-size: 16px; line-height: 1.8;">'

    # Opening message with purple theme (matching frontend)
    formatted_html += '<p style="margin-bottom: 20px; font-size: 17px;">📝 <strong>Nova zadaća je postavljena!</strong></p>'

    # Subject info with purple gradient theme
    formatted_html += f"""
    <div style="background: linear-gradient(135deg, #a855f7 0%, #7c3aed 100%); padding: 20px; border-radius: 12px; margin-bottom: 20px; color: white;">
        <p style="margin: 0; font-size: 14px; opacity: 0.9;">Predmet:</p>
        <p style="margin: 5px 0 0 0; font-size: 22px; font-weight: bold;">📚 {subject}</p>
    </div>
    """

    # Assignment details
    formatted_html += f"""
    <div style="background-color: #faf5ff; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #a855f7;">
        <p style="margin: 5px 0; font-size: 16px; line-height: 1.6; color: #333;">
            {message_text}
        </p>
    </div>
    """

    # Instructions section
    instructions_html = f"""
    <div style="background-color: #f0f4ff; padding: 18px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #667eea;">
        <p style="margin: 5px 0; font-size: 16px;"><strong>📋 Šta dalje?</strong></p>
        <ul style="margin: 12px 0; padding-left: 20px; font-size: 15px; line-height: 1.8; color: #555;">
            <li>Prijavite se na <strong>IPI Smart sistem</strong></li>
            <li>Idite na stranicu <strong>"Zadaće"</strong></li>
            <li>Pronađite zadaću za predmet <strong>{subject}</strong></li>
            <li>Preuzmite materijale i započnite sa radom</li>
        </ul>
    </div>
    """
    formatted_html += instructions_html

    # Important note
    formatted_html += """
    <div style="background-color: #fff3e0; padding: 15px; border-radius: 8px; border-left: 4px solid #ff9800; margin-bottom: 20px;">
        <p style="margin: 5px 0; font-size: 15px;">
            ⚠️ <strong>Važno:</strong> Redovno proveravajte sistem za nova obaveštenja i rokove!
        </p>
    </div>
    """

    # Closing message
    formatted_html += """
    <p style="margin-top: 25px; font-size: 16px; color: #555;">
        Sretno sa radom! 💪📖
    </p>
    <p style="margin-top: 10px; font-size: 15px; color: #7c3aed;">
        <strong>Vaš profesor</strong>
    </p>
    """

    formatted_html += "</div>"

    return formatted_html


def create_professional_email_html(subject, message_text):
    return f"""
    <!DOCTYPE html>
    <html lang="sr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>{subject}</title>
        <style>
            * {{
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }}

            body {{
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background-color: #f4f7fa;
                padding: 20px;
                line-height: 1.6;
            }}

            .email-container {{
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
                border-radius: 12px;
                overflow: hidden;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            }}

            .header {{
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                padding: 40px 30px;
                text-align: center;
                color: white;
            }}

            .header h1 {{
                font-size: 28px;
                font-weight: 700;
                margin: 0;
                letter-spacing: 1px;
            }}

            .header p {{
                font-size: 14px;
                margin-top: 8px;
                opacity: 0.95;
            }}

            .content {{
                padding: 40px 30px;
                color: #333333;
            }}

            .content h2 {{
                color: #667eea;
                font-size: 22px;
                margin-bottom: 20px;
                border-bottom: 3px solid #667eea;
                padding-bottom: 10px;
            }}

            .content p {{
                font-size: 16px;
                margin-bottom: 15px;
                color: #555555;
            }}

            .content strong {{
                color: #764ba2;
                font-weight: 600;
            }}

            .highlight-box {{
                background-color: #f8f9ff;
                border-left: 4px solid #667eea;
                padding: 20px;
                margin: 25px 0;
                border-radius: 6px;
                font-size: 16px;
                line-height: 1.8;
            }}

            .highlight-box strong {{
                color: #764ba2;
                font-size: 17px;
            }}

            .button {{
                display: inline-block;
                padding: 14px 32px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white !important;
                text-decoration: none;
                border-radius: 30px;
                font-weight: 600;
                margin: 20px 0;
                transition: transform 0.2s;
            }}

            .button:hover {{
                transform: translateY(-2px);
            }}

            .footer {{
                background-color: #2d3748;
                color: #ffffff;
                padding: 35px 30px;
                text-align: center;
            }}

            .footer-logo {{
                font-size: 24px;
                font-weight: 700;
                margin-bottom: 15px;
                color: #667eea;
            }}

            .footer-info {{
                font-size: 14px;
                margin-bottom: 20px;
                opacity: 0.9;
            }}

            .footer-info p {{
                margin: 8px 0;
            }}

            .social-links {{
                margin: 25px 0;
            }}

            .social-links a {{
                display: inline-block;
                width: 40px;
                height: 40px;
                line-height: 40px;
                background-color: #667eea;
                color: white;
                text-decoration: none;
                border-radius: 50%;
                margin: 0 8px;
                font-weight: bold;
                transition: background-color 0.3s;
            }}

            .social-links a:hover {{
                background-color: #764ba2;
            }}

            .footer-bottom {{
                margin-top: 25px;
                padding-top: 20px;
                border-top: 1px solid rgba(255, 255, 255, 0.1);
                font-size: 12px;
                opacity: 0.7;
            }}

            .divider {{
                height: 2px;
                background: linear-gradient(90deg, transparent, #667eea, transparent);
                margin: 30px 0;
            }}

            @media only screen and (max-width: 600px) {{
                .email-container {{
                    border-radius: 0;
                }}

                .header, .content, .footer {{
                    padding: 25px 20px;
                }}

                .header h1 {{
                    font-size: 24px;
                }}

                .content h2 {{
                    font-size: 20px;
                }}
            }}
        </style>
    </head>
    <body>
        <div class="email-container">
            <!-- Header Section -->
            <div class="header">
                <h1>🎓 IPI Smart Akademija</h1>
                <p>Vaš partner u digitalnom obrazovanju</p>
            </div>

            <!-- Content Section -->
            <div class="content">
                <h2>{subject}</h2>

                <div class="highlight-box">
                    {message_text}
                </div>

                <div class="divider"></div>

                <p><strong>Napomena:</strong> Ovo je automatska poruka iz IPI Smart Academic System-a.</p>
                <p>Molimo vas da redovno proveravate svoju email adresu za važna obaveštenja.</p>
            </div>

            <!-- Footer Section -->
            <div class="footer">
                <div class="footer-logo">IPI Smart Akademija</div>

                <div class="footer-info">
                    <p>📍 <strong>Adresa:</strong> Kulina bana br. 2 (Skver) Tuzla, 75000 Tuzla</p>
                    <p>📞 <strong>Telefon:</strong> +387 35 258 454</p>
                    <p>✉️ <strong>Email:</strong> info@ipi-akademija.ba</p>
                    <p>🌐 <strong>Web:</strong> https://ipi-akademija.ba/</p>
                </div>

                <!-- Social Media Links -->
                <div class="social-links">
                    <a href="https://www.facebook.com/ipiakademija/?locale=hr_HR" title="Facebook" target="_blank">f</a>
                    <a href="https://www.instagram.com/ipi_akademija/?hl=en" title="Instagram" target="_blank">📷</a>
                    <a href="https://www.linkedin.com/school/ipiakademija/?originalSubdomain=ba" title="LinkedIn" target="_blank">in</a>
                </div>

                <div class="footer-bottom">
                    <p>&copy; 2026 IPI Smart Academic System. Sva prava zadržana.</p>
                    <p>Ova poruka je poslata automatski. Molimo ne odgovarajte direktno na ovaj email.</p>
                </div>
            </div>
        </div>
    </body>
    </html>
    """
