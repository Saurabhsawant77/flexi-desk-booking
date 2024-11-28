const PDFDocument = require("pdfkit");
const path = require("path");
const fs = require("fs");

const BILLING = require("../models/billing");
const numberToWords = require("../utils/numberToWords");
const formatDatesToOrdinal = require("./formatDate");

// Create a new PDF document

const generateInvoice = (booking) => {
  const doc = new PDFDocument({ margin: 50 });

  // Pipe the PDF to a file
  const pdfDir = path.resolve(__dirname, "../../src/pdf");
  doc.pipe(fs.createWriteStream(path.join(pdfDir, "invoice.pdf")));

  // doc.pipe(fs.createWriteStream("invoice.pdf"));

  // Company Logo and Header

  const logoPath = path.resolve(__dirname, "../../public/images/logo.png");
  const qrPath = path.resolve(__dirname, "../../public/images/qr.jpg");
  const footerPath = path.resolve(__dirname, "../../public/images/footer.jpg");
  const handEmojiPath = path.resolve(
    __dirname,
    "../../public/images/emoji-hand.jpg"
  );

  //add logo image
  doc.image(logoPath, 50, 25, { width: 50 });
  doc
    .fontSize(10)

    .font("Helvetica-Bold")

    .text("Abstergo Ltd", 50, 50)
    .font("Helvetica")

    .text("Office No. A1 & B1, 9th Floor,", 50, 65)

    .text("Ashar IT Park, Wagle Industrial Estate,", 50, 80)

    .text("Thane - 400604, Maharashtra - India", 50, 95)

    .text(
      `${booking.bookingData.identification_info}: ${booking.bookingData.identification_id}`,
      50,
      110
    );

  // Invoice Details (Right aligned)

  doc
    .font("Helvetica-Bold")
    .text("Invoice Details", 400, 50)
    .font("Helvetica")

    .text("Invoice No:", 400, 65)

    .text(booking.invoice_no, 500, 65)

    .text("Invoice Date:", 400, 80)

    .text(booking.invoice_date, 500, 80)

    .text("Place of Supply: Maharashtra (27)", 400, 95);

  // Bill To Section

  doc
    .text("To,", 50, 150)
    .font("Helvetica-Bold")
    .text("Steve Doe", 50, 165)
    .font("Helvetica")

    .text("Olive Pipe & Associates", 50, 180)

    .text("7th Main Rd, Koramangala 3rd Block, Koramangala,", 50, 195)

    .text("Bengaluru, Karnataka 560034", 50, 210);

  // Table Headers

  doc.strokeColor("#D3D3D3").moveTo(50, 230).lineTo(560, 230).stroke();

  doc
    .font("Helvetica-Bold")
    .text("ITEMS", 50, 240)
    .font("Helvetica")
    .text("#", 50, 260)

    .text("Description", 100, 260)

    .text("Qty", 360, 260)

    .text("Unit Price", 430, 260)

    .text("Amount", 480, 260, {
      align: "right",
    });

  doc.strokeColor("#D3D3D3").moveTo(50, 308).lineTo(560, 308).stroke();
  // Table Content

  doc
    .text("1", 50, 290)

    .text(booking.bookingData.booking_type, 100, 290)

    .text(booking.paymentData.day_passes, 360, 290)

    .text("1000", 430, 290)

    .text(booking.paymentData.sub_total_cost, 480, 290, {
      align: "right",
    });

  // Calculations

  function Disscount(disscount, sub_total) {
    const discount_amt = (sub_total * disscount) / 100;
    return discount_amt;
  }

  function findSGST(sub_total) {
    return (sub_total * 9) / 100;
  }

  function findCGST(sub_total) {
    return (sub_total * 9) / 100;
  }

  const new_sub_total =
    booking.paymentData.sub_total_cost -
    Disscount(booking.paymentData.discount, booking.paymentData.sub_total_cost);
  const cgst = findCGST(new_sub_total);
  const sgst = findSGST(new_sub_total);

  const total = new_sub_total + cgst + sgst;
  console.log(new_sub_total);

  doc
    .text("Sub Total:", 400, 320)

    .text(`${booking.paymentData.sub_total_cost}.00`, 510, 320, {
      align: "right",
    })

    .text(`Less Discount(${booking.paymentData.discount}%):`, 400, 340)

    .text(
      `${Disscount(
        booking.paymentData.discount,
        booking.paymentData.sub_total_cost
      )}`,
      510,
      340,
      {
        align: "right",
      }
    )

    .text("CGST (9%):", 400, 360)

    .text(cgst, 510, 360, {
      align: "right",
    })

    .text("SGST (9%):", 400, 380)

    .text(sgst, 510, 380, {
      align: "right",
    })

    .text("IGST (0%):", 400, 400)

    .text("0.00", 510, 400, {
      align: "right",
    })

    .text("Total:", 400, 440)

    .text(`${total}.00`, 510, 440, {
      align: "right",
    })
    .strokeColor("#D3D3D3")
    .moveTo(50, 460)
    .lineTo(560, 460)
    .stroke();

  // Invoice Value in Words

  doc
    .fontSize(8)
    .font("Helvetica-Bold")
    .text(
      `Invoice Value in words : Rupees ${numberToWords(total)} only`,
      50,
      440
    )
    .font("Helvetica")
    .strokeColor("#D3D3D3")
    .moveTo(50, 540)
    .lineTo(560, 540)
    .stroke();

  // Payment Details

  doc
    .text("Payment Mode:", 400, 480)

    .text(booking.paymentData.payment_method, 500, 480, {
      align: "right",
    })

    .text("Amount Paid:", 400, 500)

    .text(`${total}.00`, 505, 500, {
      align: "right",
    })

    .text("Total Amount Remaining:", 400, 520)

    .text("0/-", 525, 520, {
      align: "right",
    });

  // Amount Paid Date
  const date = new Date(booking.paymentData.createdAt);
  const amount_date = date.toLocaleDateString();
  doc

    .font("Helvetica-Bold")
    .text("AMOUNT PAID DATE", 50, 520)
    .font("Helvetica")

    .text(amount_date, 150, 520);

  // Terms and Conditions

  doc
    .fontSize(10)

    .text("TERMS AND CONDITIONS", 50, 560)

    .fontSize(8)

    .text(
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
      50,
      580,
      {
        width: 500,

        align: "justify",
      }
    );

  // Note

  doc

    .text("NOTE:", 50, 640)

    .text("Please pay the sum total via bank transfer", 50, 655)

    .text(
      "or cash deposit in the bank. All payments are due within 5 days.",
      50,
      670
    );

  // Footer

  doc.font("Helvetica-Bold").text("Pg 1/1", 50, 700);
  doc.font("Helvetica");
  doc.text("team@accountant.com / 09034567890 / accountant.com", 350, 700);

  //second page

  doc.addPage();

  doc.image(logoPath, 50, 25, { width: 50 });

  doc.fontSize(10);
  doc
    .image(handEmojiPath, 50, 47, { width: 13 })
    .text("Hey there Steve Doe", 66, 50)

    .text("We hope you’re excited about your day with WYBRID.", 50, 65)

    .text(
      `Your booking at 67 Kumar Enclave is confirmed for ${formatDatesToOrdinal(
        [booking.bookingData.createdAt]
      )}.`,
      50,
      80
    )

    .text("Details to help you get going:", 50, 115)
    .text(`- Booking ID: ${booking.bookingData.bookingId}`, 50, 130)

    .text(
      "- Location: C - 20, G Block, Bandra Kurla Complex, Mumbai, Maharashtra",
      50,
      140
    )
    .text("- Timings: 9:00 AM to 8:00 PM", 50, 150);

  const imageWidth = 90; // Desired width of the image
  const xPosition = doc.page.width - imageWidth - doc.page.margins.right; // Calculate the x-coordinate for alignment

  doc.image(qrPath, xPosition, 30, { width: imageWidth });

  doc.strokeColor("#D3D3D3");
  doc.moveTo(50, 180).lineTo(570, 180).stroke();

  doc.font("Helvetica-Bold").text("BOOKING DETAILS", 50, 200);

  // Table dimensions
  const tableTop = 220; // Top of the table
  const tableLeft = 50; // Left side of the table
  const rowHeight = 25; // Height of each row
  const columnWidths = [180, 350]; // Widths of the two columns: Label, Value
  const borderRadius = 5; // Border radius

  // Table data
  const tableData = [
    ["Booking Type", booking.bookingData.booking_type],
    ["Booking Date", formatDatesToOrdinal(booking.bookingData.visit_dates)],
    ["No. of Day Passes", booking.paymentData.day_passes],
    ["Visit Date", formatDatesToOrdinal(booking.bookingData.visit_dates)],
    ["Total Cost (Exclusive GST)", booking.paymentData.sub_total_cost],
    ["Payment Method", booking.paymentData.payment_method],
  ];

  // Function to draw table borders with rounded corners on the top and bottom
  const drawTableBorders = (
    doc,
    tableData,
    startX,
    startY,
    rowHeight,
    columnWidths,
    borderRadius
  ) => {
    const totalWidth = columnWidths[0] + columnWidths[1];

    // Draw top row with rounded corners (top-left and top-right)
    doc
      .moveTo(startX + borderRadius, startY) // Start after rounding for the top-left corner
      .lineTo(startX + totalWidth - borderRadius, startY) // Top line to top-right corner
      .quadraticCurveTo(
        startX + totalWidth,
        startY,
        startX + totalWidth,
        startY + borderRadius
      ) // Top-right corner curve
      .lineTo(startX + totalWidth, startY + rowHeight) // Right side of top row
      .lineTo(startX, startY + rowHeight) // Bottom line of top row
      .lineTo(startX, startY + borderRadius) // Left side of top row
      .quadraticCurveTo(startX, startY, startX + borderRadius, startY) // Top-left corner curve
      .stroke();

    // Draw middle rows (rectangular)
    for (let i = 1; i < tableData.length - 1; i++) {
      const y = startY + i * rowHeight;
      doc
        .moveTo(startX, y) // Left line of the row
        .lineTo(startX + totalWidth, y) // Top line of the row
        .lineTo(startX + totalWidth, y + rowHeight) // Right line of the row
        .lineTo(startX, y + rowHeight) // Bottom line of the row
        .closePath()
        .stroke();
    }

    // Draw bottom row with rounded corners (bottom-left and bottom-right)
    const lastRowY = startY + (tableData.length - 1) * rowHeight;
    doc
      .moveTo(startX, lastRowY) // Left line of bottom row
      .lineTo(startX + totalWidth, lastRowY) // Top line of bottom row
      .lineTo(startX + totalWidth, lastRowY + rowHeight - borderRadius) // Right side before bottom-right curve
      .quadraticCurveTo(
        startX + totalWidth,
        lastRowY + rowHeight,
        startX + totalWidth - borderRadius,
        lastRowY + rowHeight
      ) // Bottom-right corner curve
      .lineTo(startX + borderRadius, lastRowY + rowHeight) // Bottom line to bottom-left corner
      .quadraticCurveTo(
        startX,
        lastRowY + rowHeight,
        startX,
        lastRowY + rowHeight - borderRadius
      ) // Bottom-left corner curve
      .lineTo(startX, lastRowY) // Left side of bottom row
      .stroke();
  };

  // Function to fill table data
  const fillTableData = (
    doc,
    tableData,
    startX,
    startY,
    rowHeight,
    columnWidths
  ) => {
    tableData.forEach((row, rowIndex) => {
      const y = startY + rowIndex * rowHeight + 5; // Adjust padding for text

      // Label (left-aligned)
      doc
        .font("Helvetica")
        .fontSize(10)
        .text(row[0], startX + 10, y, {
          width: columnWidths[0] - 10,
          align: "left",
        });

      // Value (right-aligned)
      doc.font("Helvetica-Bold").text(row[1], startX + columnWidths[0], y, {
        width: columnWidths[1] - 10,
        align: "right",
      });
    });
  };

  // Set light gray color for borders
  doc.strokeColor("#D3D3D3");

  // Draw the table with rounded corner borders and fill data
  drawTableBorders(
    doc,
    tableData,
    tableLeft,
    tableTop,
    rowHeight,
    columnWidths,
    borderRadius
  );
  fillTableData(doc, tableData, tableLeft, tableTop, rowHeight, columnWidths);

  //Guest details

  doc.font("Helvetica-Bold").fontSize(10).text("GUEST DETAILS", 50, 390);

  let currentY = 440; // Initial Y position for the first row
  const pageHeight = 840; // Height of the page (A4 size)
  // Height of each row
  const footerHeight = 220; // Height of the footer
  let currentPage = 2; // Page counter to handle page numbering

  // Function to add a new row dynamically
  function addRow(index, name, qty, overallQty, amount) {
    // Check if we need to create a new page
    if (currentY + 20 > pageHeight - footerHeight) {
      // If the next row exceeds the page height, leaving room for the footer
      doc.addPage();
      currentY = 10; // Reset Y to top of the page
      // Redraw headers on the new page
      currentPage++; // Increment the page counter
    }

    // Add the row content
    doc
      .font("Helvetica")
      .fontSize(10)
      .text(index.toString(), 50, currentY)
      .text(name, 70, currentY)
      .text(qty.toString(), 380, currentY)
      .text(overallQty.toString(), 440, currentY)
      .text(amount.toString(), 520, currentY);

    // Move to the next row
    currentY += 20;
  }

  // Function to draw table headers (for each page)
  function drawTableHeaders() {
    doc.strokeColor("#D3D3D3");
    doc.moveTo(50, 410).lineTo(570, 410).stroke();

    doc
      .font("Helvetica")
      .fontSize(10)
      .text("#", 50, 420)
      .text("Name", 70, 420)
      .text("Qty", 380, 420)
      .text("Overall Qty", 420, 420)
      .text("Amount(Rs)", 500, 420);
  }

  // Draw initial table headers
  drawTableHeaders();

  addRow(
    1,
    booking.bookingData.guest_name + " (You)",
    `01`,
    booking.paymentData.day_passes / (booking.bookingData.invitee.length + 1),
    booking.paymentData.sub_total_cost /
      (booking.bookingData.invitee.length + 1)
  );

  //invitee
  // Add rows dynamically
  booking.bookingData.invitee.map((data, index) =>
    addRow(
      index + 2,
      data.invitee_name,
      `01`,
      booking.paymentData.day_passes / (booking.bookingData.invitee.length + 1),
      booking.paymentData.sub_total_cost /
        (booking.bookingData.invitee.length + 1)
    )
  );

  doc
    .strokeColor("#D3D3D3")
    .moveTo(50, currentY + 20)
    .lineTo(570, currentY + 20)
    .stroke();
  // Check if there's enough space for the footer on the current page
  if (currentY + footerHeight > pageHeight) {
    doc.addPage(); // Add a new page if there’s not enough space for the footer
    currentY = 420; // Reset Y for the new page
    currentPage++;

    // Increment the page counter
  }

  // Footer - Ensure it goes to the next page if needed

  doc.image(footerPath, 50, currentY + 40, { width: 520, height: 180 });
  doc
    .fontSize(8)
    .font("Helvetica-Bold")
    .text(`Pg 1/${currentPage}`, 50, currentY + 230);

  doc
    .fontSize(7)
    .font("Helvetica")
    .text(
      "team@accountant.com / 09034567890 / accountant.com",
      380,
      currentY + 230
    );

  // Create a buffer to store the PDF in memory
  const buffers = [];
  doc.on("data", buffers.push.bind(buffers));
  doc.on("end", async () => {
    // Combine all parts of the buffer
    const pdfData = Buffer.concat(buffers);

    try {
      // Save the PDF data to MongoDB
      const newPdf = await BILLING.findByIdAndUpdate(
        { _id: booking._id },
        { pdfData: pdfData },
        { new: true }
      );
      await newPdf.save();

      console.log("PDF generated and saved to database with ID: " + newPdf._id);
    } catch (error) {
      console.error("Error saving PDF to database:", error);
      console.log("Error saving PDF to database");
    }
  });

  console.log("PDF invoice has been generated successfully!");
  return doc.end();
};

module.exports = generateInvoice;
