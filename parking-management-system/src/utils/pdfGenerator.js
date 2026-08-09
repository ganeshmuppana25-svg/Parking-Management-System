import jsPDF from 'jspdf';
import { formatCurrency, formatDateTime, formatDuration } from './storage';

export function generateInvoicePDF(invoiceData) {
  try {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // Header background
    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, pageWidth, 40, 'F');

    // Title
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('PARKING MANAGEMENT SYSTEM', pageWidth / 2, 18, { align: 'center' });

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Parking Invoice', pageWidth / 2, 28, { align: 'center' });

    // Invoice details
    doc.setTextColor(51, 51, 51);
    let y = 55;

    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(`Invoice ID: ${invoiceData.invoiceId}`, 20, y);
    doc.text(`Date: ${formatDateTime(invoiceData.paymentTime)}`, pageWidth - 20, y, { align: 'right' });

    y += 8;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`Transaction ID: ${invoiceData.transactionId}`, 20, y);

    // Divider
    y += 10;
    doc.setDrawColor(200, 200, 200);
    doc.line(20, y, pageWidth - 20, y);

    // Vehicle Details
    y += 12;
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text('Vehicle Details', 20, y);

    y += 8;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(51, 51, 51);
    doc.text(`Vehicle Number: ${invoiceData.vehicleNumber}`, 20, y);
    y += 7;
    doc.text(`Vehicle Type: ${invoiceData.vehicleType}`, 20, y);
    y += 7;
    doc.text(`Parking Slot: ${invoiceData.slotId}`, 20, y);

    // Parking Details
    y += 14;
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text('Parking Details', 20, y);

    y += 8;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(51, 51, 51);
    doc.text(`Entry Time: ${formatDateTime(invoiceData.entryTime)}`, 20, y);
    y += 7;
    doc.text(`Exit Time: ${formatDateTime(invoiceData.exitTime)}`, 20, y);
    y += 7;
    doc.text(`Duration: ${formatDuration(invoiceData.entryTime, invoiceData.exitTime)}`, 20, y);

    // Billing
    y += 14;
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text('Billing', 20, y);

    y += 8;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(51, 51, 51);
    doc.text(`Base Parking Fee: ${formatCurrency(invoiceData.baseFee)}`, 20, y);
    y += 7;
    doc.text(`Additional Charges: ${formatCurrency(invoiceData.additionalCharges || 0)}`, 20, y);

    y += 3;
    doc.setDrawColor(15, 23, 42);
    doc.line(20, y, pageWidth - 20, y);
    y += 7;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text(`Total Paid: ${formatCurrency(invoiceData.totalPaid)}`, 20, y);
    doc.text(formatCurrency(invoiceData.totalPaid), pageWidth - 20, y, { align: 'right' });

    // Payment Info
    y += 14;
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text('Payment Information', 20, y);

    y += 8;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(51, 51, 51);
    doc.text(`Payment Method: ${invoiceData.paymentMethod}`, 20, y);
    y += 7;
    doc.text('Status: PAID', 20, y);
    doc.setTextColor(34, 197, 94);
    doc.setFont('helvetica', 'bold');
    doc.text('✓ PAID', 60, y);

    // Footer
    doc.setTextColor(150, 150, 150);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'italic');
    doc.text('Thank you for using Parking Management System.', pageWidth / 2, 270, { align: 'center' });
    doc.text('This is a computer-generated invoice. No signature required.', pageWidth / 2, 276, { align: 'center' });

    // Save
    const fileName = `Parking_Invoice_${invoiceData.transactionId}.pdf`;
    doc.save(fileName);
    return { success: true, fileName };
  } catch (error) {
    console.error('PDF generation error:', error);
    return { success: false, error: error.message };
  }
}

export function generateInvoiceId() {
  const num = Math.floor(100000 + Math.random() * 900000);
  return `INV-${num}`;
}