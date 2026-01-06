import PDFDocument from "pdfkit";

export const generatePatientReport = (data, res) => {
  const doc = new PDFDocument();
  res.setHeader("Content-Type", "application/pdf");

  doc.pipe(res);
  doc.fontSize(20).text("Medical Credit Report", { align: "center" });

  doc.moveDown();
  doc.fontSize(12).text(`Credit Score: ${data.score}`);
  doc.text(`Risk Level: ${data.risk}`);
  doc.text(`Outstanding Dues: ₹${data.due}`);

  doc.end();
};
