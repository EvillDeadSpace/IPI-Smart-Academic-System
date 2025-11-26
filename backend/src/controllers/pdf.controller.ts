import { Request, Response } from "express";
import { getPrismaClient } from "../config/database";

const prisma = getPrismaClient();

export const servePDF = async (req: Request, res: Response): Promise<void> => {
  const filename = req.params.filename;
  const match = filename.match(/\-(\d+)\.pdf$/);
  const requestId = match ? parseInt(match[1]) : null;

  if (!requestId) {
    res.status(400).send("Invalid PDF filename format");
    return;
  }

  try {
    // Fetch document request from database
    const request = await prisma.documentRequest.findUnique({
      where: { id: requestId },
      include: {
        student: {
          include: { major: true },
        },
      },
    });

    if (!request || !request.student) {
      res.status(404).send("Document request not found");
      return;
    }

    // If it's a health certificate, call NLP service to generate PDF
    if (request.documentType === "HEALTH_CERTIFICATE") {
      console.log(
        `📞 Generating health certificate PDF for request ${requestId}...`
      );

      const nlpResponse = await fetch(
        "http://localhost:5000/health-certificate",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fullName: `${request.student.firstName} ${request.student.lastName}`,
            jmbg: request.student.indexNumber,
            city: "Tuzla",
            dateOfBirth: new Date(request.student.dateOfBirth)
              .toISOString()
              .split("T")[0],
            yearsOfStudy: String(request.student.currentYear),
            academicYear: "24/25",
          }),
        }
      );

      if (nlpResponse.ok) {
        const pdfBuffer = Buffer.from(await nlpResponse.arrayBuffer());
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", `inline; filename="${filename}"`);
        res.send(pdfBuffer);
        return;
      } else {
        console.error(`❌ NLP service error: ${nlpResponse.status}`);
      }
    }

    // Fallback: Generate simple PDF with student data
    const studentInfo = {
      fullName: `${request.student.firstName} ${request.student.lastName}`,
      indexNumber: request.student.indexNumber,
      documentType: request.documentType.replace(/_/g, " "),
      dateOfBirth: new Date(request.student.dateOfBirth).toLocaleDateString(
        "bs-BA"
      ),
      currentYear: String(request.student.currentYear),
      majorName: request.student.major?.name || "N/A",
    };

    const pdfContent = `%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj
2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj
3 0 obj
<<
/Type /Page
/Parent 2 0 R
/Resources <<
/Font <<
/F1 <<
/Type /Font
/Subtype /Type1
/BaseFont /Helvetica-Bold
>>
/F2 <<
/Type /Font
/Subtype /Type1
/BaseFont /Helvetica
>>
>>
>>
/MediaBox [0 0 612 792]
/Contents 4 0 R
>>
endobj
4 0 obj
<<
/Length 500
>>
stream
BT
/F1 18 Tf
50 750 Td
(IPI AKADEMIJA TUZLA) Tj
0 -30 Td
/F1 14 Tf
(${studentInfo.documentType}) Tj
0 -40 Td
/F2 12 Tf
(Ime i prezime: ${studentInfo.fullName}) Tj
0 -25 Td
(Broj indeksa: ${studentInfo.indexNumber}) Tj
0 -25 Td
(Datum rodjenja: ${studentInfo.dateOfBirth}) Tj
0 -25 Td
(Trenutna godina studija: ${studentInfo.currentYear}) Tj
0 -25 Td
(Smijer: ${studentInfo.majorName}) Tj
0 -40 Td
/F2 10 Tf
(Napomena: Ovo je privremeni PDF dokument.) Tj
0 -15 Td
(Za konacnu verziju kontaktirajte administraciju.) Tj
ET
endstream
endobj
xref
0 5
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000364 00000 n 
trailer
<<
/Size 5
/Root 1 0 R
>>
startxref
914
%%EOF`;

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `inline; filename="${filename}"`);
    res.send(Buffer.from(pdfContent, "utf-8"));
  } catch (error) {
    console.error("❌ PDF generation error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    res.status(500).send(`Failed to generate PDF: ${errorMessage}`);
  }
};
