// ─────────────────────────────────────────────────────────────────────────────
//  SPOTLESS BOOKINGS → GOOGLE SHEET
//  
//  Matches your exact "Bookings" sheet table columns:
//  [A] Booking ID            [K] Duration (Hours)
//  [B] Calendar Event ID     [L] Total Price
//  [C] Customer Name         [M] Status
//  [D] Phone                 [N] Platform
//  [E] Email                 [O] Special Instructions
//  [F] Address               [P] Created At
//  [G] Service               [Q] Updated At
//  [H] Additional Services   [R] Cancelled At
//  [I] Appointment Date      [S] Team Review
//  [J] Appointment Time
//
//  HOW TO UPDATE IN APPS SCRIPT:
//  1. Open your Google Sheet
//  2. Click Extensions → Apps Script
//  3. Select all code, replace with this entire file, and click Save (disk icon)
//  4. Click Deploy → Manage deployments
//  5. Click the Edit (pencil) icon on your deployment
//  6. In "Version", choose "New version"
//  7. Click Deploy
//  (The URL stays the exact same!)
// ─────────────────────────────────────────────────────────────────────────────

const SHEET_NAME = "Bookings"

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents)
    const ss = SpreadsheetApp.getActiveSpreadsheet()
    let sheet = ss.getSheetByName(SHEET_NAME)
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME)
    }

    const now = new Date()
    const timestampStr = Utilities.formatDate(now, "Australia/Melbourne", "dd/MM/yyyy, hh:mm:ss a")
    const bookingId = "SPT-" + Math.floor(100000 + Math.random() * 900000)

    // Format full address (Street Address + Suburb)
    const fullAddress = [data.address, data.suburb].filter(Boolean).join(", ")

    // Combine property specs, frequency, extras and linen care into Additional Services
    const addParts = []
    if (data.propertyType) addParts.push(data.propertyType)
    if (data.bedrooms && data.bedrooms !== "N/A") {
      addParts.push(data.bedrooms + " bed, " + data.bathrooms + " bath")
    }
    if (data.frequency) addParts.push("Freq: " + data.frequency)
    if (data.extras) addParts.push("Extras: " + data.extras)
    if (data.linenItems) addParts.push("Linen: " + data.linenItems)
    const additionalServices = addParts.join(" | ")

    // Combine notes + preferred contact method into Special Instructions
    const instrParts = []
    if (data.notes) instrParts.push(data.notes)
    if (data.contactMethod) instrParts.push("Preferred contact: " + data.contactMethod)
    const specialInstructions = instrParts.join(" | ")

    const appointmentDate = data.preferredDate || data.moveOutDate || ""
    const appointmentTime = data.preferredTime || "Flexible / Morning"

    // Read existing column headers from Row 1
    const lastCol = Math.max(sheet.getLastColumn(), 19)
    let rowValues = []

    if (sheet.getLastRow() >= 1) {
      const headerRange = sheet.getRange(1, 1, 1, lastCol).getValues()[0]
      const hasHeaders = headerRange.some(function (h) {
        return String(h).trim().length > 0
      })

      if (hasHeaders) {
        rowValues = headerRange.map(function (rawHeader) {
          const h = String(rawHeader).toLowerCase().trim()
          if (!h) return ""
          if (h.indexOf("booking id") !== -1 || h === "id") return bookingId
          if (h.indexOf("calendar") !== -1) return ""
          if (h.indexOf("customer") !== -1 || h.indexOf("name") !== -1 || h.indexOf("client") !== -1) return data.name || ""
          if (h.indexOf("phone") !== -1 || h.indexOf("mobile") !== -1) return data.phone || ""
          if (h.indexOf("email") !== -1) return data.email || ""
          if (h.indexOf("address") !== -1 || h.indexOf("location") !== -1) return fullAddress
          if (h.indexOf("additional") !== -1 || h.indexOf("extra") !== -1 || h.indexOf("addon") !== -1) return additionalServices
          if (h.indexOf("service") !== -1) return data.service || ""
          if (h.indexOf("appointment date") !== -1 || (h.indexOf("date") !== -1 && h.indexOf("created") === -1 && h.indexOf("updated") === -1 && h.indexOf("cancel") === -1)) {
            return appointmentDate
          }
          if (h.indexOf("time") !== -1) return appointmentTime
          if (h.indexOf("duration") !== -1) return ""
          if (h.indexOf("total price") !== -1 || h.indexOf("price") !== -1 || h.indexOf("estimate") !== -1) return data.estimate || ""
          if (h.indexOf("status") !== -1) return "New"
          if (h.indexOf("platform") !== -1 || h.indexOf("source") !== -1) return "Website"
          if (h.indexOf("instruction") !== -1 || h.indexOf("special") !== -1 || h.indexOf("note") !== -1) return specialInstructions
          if (h.indexOf("created") !== -1) return timestampStr
          if (h.indexOf("updated") !== -1) return timestampStr
          if (h.indexOf("cancel") !== -1) return ""
          if (h.indexOf("review") !== -1 || h.indexOf("team") !== -1) return ""
          return ""
        })
      }
    }

    // Default fallback if headers cannot be determined
    if (rowValues.length === 0) {
      rowValues = [
        bookingId,            // A: Booking ID
        "",                   // B: Calendar Event ID
        data.name || "",      // C: Customer Name
        data.phone || "",     // D: Phone
        data.email || "",     // E: Email
        fullAddress,          // F: Address
        data.service || "",   // G: Service
        additionalServices,   // H: Additional Services
        appointmentDate,      // I: Appointment Date
        appointmentTime,      // J: Appointment Time
        "",                   // K: Duration (Hours)
        data.estimate || "",  // L: Total Price
        "New",                // M: Status
        "Website",            // N: Platform
        specialInstructions,  // O: Special Instructions
        timestampStr,         // P: Created At
        timestampStr,         // Q: Updated At
        "",                   // R: Cancelled At
        "",                   // S: Team Review
      ]
    }

    sheet.appendRow(rowValues)

    return ContentService
      .createTextOutput(JSON.stringify({ success: true, bookingId: bookingId }))
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
