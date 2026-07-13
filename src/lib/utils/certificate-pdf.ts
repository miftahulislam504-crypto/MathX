import { jsPDF } from 'jspdf'
import { Certificate } from '@/lib/data/assessment-progress'

// Generates and triggers a browser download of a landscape A4 certificate
// PDF. Runs entirely client-side — no server call, so it works the same
// way in local dev and on Vercel with zero backend configuration.
export function downloadCertificatePdf(cert: Certificate) {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' })
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const centerX = pageWidth / 2

  // Decorative border
  doc.setDrawColor(124, 58, 237) // violet
  doc.setLineWidth(1.2)
  doc.rect(10, 10, pageWidth - 20, pageHeight - 20)
  doc.setLineWidth(0.4)
  doc.rect(14, 14, pageWidth - 28, pageHeight - 28)

  // Header
  doc.setTextColor(124, 58, 237)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(14)
  doc.text('MathX', centerX, 32, { align: 'center' })

  doc.setTextColor(30, 30, 30)
  doc.setFontSize(30)
  doc.text('Certificate of Achievement', centerX, 50, { align: 'center' })

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(13)
  doc.setTextColor(90, 90, 90)
  doc.text('This certifies that', centerX, 68, { align: 'center' })

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(24)
  doc.setTextColor(20, 20, 20)
  doc.text(cert.recipientName, centerX, 82, { align: 'center' })

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(13)
  doc.setTextColor(90, 90, 90)
  doc.text('has successfully completed', centerX, 96, { align: 'center' })

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(18)
  doc.setTextColor(124, 58, 237)
  doc.text(cert.title, centerX, 110, { align: 'center' })

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(13)
  doc.setTextColor(90, 90, 90)
  doc.text(`with a score of ${cert.percent}%`, centerX, 122, { align: 'center' })

  // Date + footer line
  const dateStr = new Date(cert.dateIssued).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  doc.setFontSize(10)
  doc.setTextColor(140, 140, 140)
  doc.text(`Issued on ${dateStr}`, centerX, pageHeight - 24, { align: 'center' })
  doc.text('mathx — Mathematics Learning Ecosystem', centerX, pageHeight - 18, { align: 'center' })

  doc.save(`mathx-certificate-${cert.id}.pdf`)
}
