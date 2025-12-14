const PDFDocument = require('pdfkit');
const path = require('path');
const fs = require('fs');

module.exports = (dataCallback, endCallback, booking) => {
  const doc = new PDFDocument();

  doc.on('data', dataCallback);
  doc.on('end', endCallback);

  // Header + Airline Logo (if available)
  doc.fontSize(25).fillColor('#4F46E5').text('Udaan Flight Ticket', { align: 'center' });
  doc.moveDown();

  // Attempt to render airline logo based on airline name
  const airlineName = booking.flight.airline || 'Unknown Airline';
  const safeAirline = airlineName.replace(/[^a-z0-9-_]/gi, '_').toLowerCase();

  // Primary: backend/public/logos
  const backendLogosDir = path.join(__dirname, '..', 'public', 'logos');
  const backendLogoPath = path.join(backendLogosDir, `${safeAirline}.png`);

  // Fallback: frontend/public/logos (if user stores there)
  const frontendLogosDir = path.join(__dirname, '..', '..', 'frontend', 'public', 'logos');
  const frontendLogoPath = path.join(frontendLogosDir, `${safeAirline}.png`);

  const resolvedLogoPath = fs.existsSync(backendLogoPath)
    ? backendLogoPath
    : fs.existsSync(frontendLogoPath)
      ? frontendLogoPath
      : null;

  if (resolvedLogoPath) {
    try {
      // Place logo at top-left
      doc.image(resolvedLogoPath, 50, 80, { width: 80 });
    } catch (e) {
      // ignore logo errors, continue rendering
    }
  }
  
  // PNR
  doc.fontSize(12).fillColor('black');
  doc.text(`PNR: ${booking.pnr}`, { align: 'right' });
  doc.moveDown();
  
  // Flight Details
  doc.fontSize(16).text(`Airline: ${booking.flight.airline || 'N/A'}`);
  doc.fontSize(14).text(`Flight No: ${booking.flight.flightId || 'N/A'}`);
  doc.moveDown();
  
  doc.text(`From: ${booking.flight.source || 'N/A'}`);
  doc.text(`To: ${booking.flight.destination || 'N/A'}`);
  doc.text(`Departure: ${booking.flight.departureTime ? new Date(booking.flight.departureTime).toLocaleString() : 'N/A'}`);
  doc.text(`Arrival: ${booking.flight.arrivalTime ? new Date(booking.flight.arrivalTime).toLocaleString() : 'N/A'}`);
  doc.moveDown();

  // Passengers
  doc.fontSize(16).text('Passengers:', { underline: true });
  if (booking.passengers && Array.isArray(booking.passengers)) {
    booking.passengers.forEach((p, i) => {
      doc.fontSize(12).text(`${i + 1}. ${p.name || 'N/A'} (${p.age || 'N/A'} yrs, ${p.gender || 'N/A'})`);
    });
  }
  doc.moveDown();

  // Booking Info
  doc.fontSize(12).text(`Booking Date: ${booking.bookingDate ? new Date(booking.bookingDate).toLocaleDateString() : 'N/A'}`);
  doc.text(`Status: ${booking.status || 'Confirmed'}`);
  doc.moveDown();

  // Footer
  doc.fontSize(14).fillColor('#10B981').text(`Total Paid: ₹${booking.totalAmount || 0}`, { align: 'right' });
  doc.moveDown(2);
  doc.fontSize(10).fillColor('gray').text('Thank you for booking with Udaan!', { align: 'center' });
  
  doc.end();
};