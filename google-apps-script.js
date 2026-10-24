// ─────────────────────────────────────────────────────────────────────────────
//  SPOTLESS BOOKINGS → GOOGLE SHEET
//  
//  HOW TO DEPLOY:
//  1. Open your Google Sheet (the pricing one, or create a new one)
//  2. Click Extensions → Apps Script
//  3. Delete any existing code, paste this entire file
//  4. Click Deploy → New deployment
//  5. Type: Web App | Execute as: Me | Who has access: Anyone
//  6. Click Deploy → Authorize → Copy the Web App URL
//  7. In QuoteForm.tsx, replace "YOUR_APPS_SCRIPT_URL" with that URL
// ─────────────────────────────────────────────────────────────────────────────

const SHEET_NAME = "Bookings"

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents)
    const ss = SpreadsheetApp.getActiveSpreadsheet()

    let sheet = ss.getSheetByName(SHEET_NAME)
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME)
      sheet.appendRow([
        "Timestamp",
        "Status",
        "Service",
        "Estimate (AUD)",
        "Property Type",
        "Bedrooms",
        "Bathrooms",
        "Suburb",
        "Full Address",
        "Frequency",
        "Extras",
        "Move-Out Date",
        "Preferred Date",
        "Customer Name",
        "Email",
        "Phone",
        "Contact Via",
        "Notes",
      ])
      sheet.getRange(1, 1, 1, 18)
        .setFontWeight("bold")
        .setBackground("#123f4a")
        .setFontColor("#ffffff")
      sheet.setFrozenRows(1)
      sheet.setColumnWidth(1, 160) // Timestamp
      sheet.setColumnWidth(9, 220) // Address
    }

    sheet.appendRow([
      new Date().toLocaleString("en-AU", { timeZone: "Australia/Melbourne" }),
      "New",
      data.service || "",
      data.estimate || "",
      data.propertyType || "",
      data.bedrooms || "",
      data.bathrooms || "",
      data.suburb || "",
      data.address || "",
      data.frequency || "",
      data.extras || "",
      data.moveOutDate || "",
      data.preferredDate || "",
      data.name || "",
      data.email || "",
      data.phone || "",
      data.contactMethod || "",
      data.notes || "",
    ])

    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON)
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: err.message }))
      .setMimeType(ContentService.MimeType.JSON)
  }
}

function doGet() {
  return ContentService.createTextOutput("Spotless Bookings endpoint is live ✓")
}
