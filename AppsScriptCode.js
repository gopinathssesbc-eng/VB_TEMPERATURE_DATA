function checkPassword(providedPassword) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const passSheet = ss.getSheetByName("pass");
  if (!passSheet) return false;
  
  const actualPassword = passSheet.getRange("A2").getValue();
  return String(providedPassword) === String(actualPassword);
}

function doGet(e) {
  const providedPassword = e.parameter.password;
  
  if (!checkPassword(providedPassword)) {
    return ContentService.createTextOutput(JSON.stringify({ status: "unauthorized", message: "Incorrect password" }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  const trainName = e.parameter.train;
  if (!trainName) {
     return ContentService.createTextOutput(JSON.stringify({ status: "error", message: "Train not specified" }))
       .setMimeType(ContentService.MimeType.JSON);
  }

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(trainName);
  
  if (!sheet) {
     return ContentService.createTextOutput(JSON.stringify({ status: "success", data: [] }))
       .setMimeType(ContentService.MimeType.JSON);
  }

  const data = sheet.getDataRange().getValues();
  
  if (data.length <= 1) { // 0 or just headers
    return ContentService.createTextOutput(JSON.stringify({ status: "success", data: [] }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  const headers = data[0];
  const rows = data.slice(1);
  
  const result = rows.map(row => {
    let obj = {};
    headers.forEach((header, index) => {
      // Format dates properly for JSON transmission
      let value = row[index];
      if (value instanceof Date) {
          value = Utilities.formatDate(value, Session.getScriptTimeZone(), "yyyy-MM-dd");
      }
      obj[header] = value !== undefined ? value : "";
    });
    return obj;
  });

  return ContentService.createTextOutput(JSON.stringify({ status: "success", data: result }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    let request;
    try {
        request = JSON.parse(e.postData.contents);
    } catch (parseError) {
        return ContentService.createTextOutput(JSON.stringify({ status: "error", message: "Invalid JSON format" }))
          .setMimeType(ContentService.MimeType.JSON);
    }
    
    if (!checkPassword(request.password)) {
      return ContentService.createTextOutput(JSON.stringify({ status: "unauthorized", message: "Incorrect password" }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    const trainName = request.train;
    const rowData = request.rowData;
    
    if (!trainName) {
       return ContentService.createTextOutput(JSON.stringify({ status: "error", message: "Train not specified" }))
         .setMimeType(ContentService.MimeType.JSON);
    }

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(trainName);
    
    if (!sheet) {
        // Auto-create the sheet if it doesn't exist
        sheet = ss.insertSheet(trainName);
    }

    const allData = sheet.getDataRange().getValues();
    const headers = allData.length > 0 ? allData[0] : [];
    
    let dateIndex = headers.indexOf("Date");
    let stationIndex = headers.indexOf("Station");
    let rowIndexToUpdate = -1;

    // Check if a record already exists for this Date and Station
    if (dateIndex !== -1 && stationIndex !== -1 && allData.length > 1) {
        for (let i = 1; i < allData.length; i++) {
            let sheetDateStr = "";
            if (allData[i][dateIndex] instanceof Date) {
                sheetDateStr = Utilities.formatDate(allData[i][dateIndex], Session.getScriptTimeZone(), "yyyy-MM-dd");
            } else {
                sheetDateStr = String(allData[i][dateIndex]).trim();
            }
            
            if (sheetDateStr === String(rowData["Date"]).trim() && 
                String(allData[i][stationIndex]).trim() === String(rowData["Station"]).trim()) {
                rowIndexToUpdate = i + 1; // 1-indexed for getRange, and +1 for header
                break;
            }
        }
    }
    
    let newRow = [];
    if (headers.length > 0) {
        // Expand headers if new keys are present in rowData
        let updatedHeaders = [...headers];
        let headersChanged = false;
        
        Object.keys(rowData).forEach(key => {
            if (!updatedHeaders.includes(key)) {
                updatedHeaders.push(key);
                headersChanged = true;
            }
        });
        
        if (headersChanged) {
             sheet.getRange(1, 1, 1, updatedHeaders.length).setValues([updatedHeaders]);
        }
        
        newRow = updatedHeaders.map(header => rowData[header] !== undefined ? rowData[header] : "");
    } else {
        // Sheet was empty, create headers
        const newHeaders = Object.keys(rowData);
        sheet.appendRow(newHeaders);
        newRow = Object.values(rowData);
    }
    
    if (rowIndexToUpdate !== -1) {
        sheet.getRange(rowIndexToUpdate, 1, 1, newRow.length).setValues([newRow]);
        return ContentService.createTextOutput(JSON.stringify({ status: "success", message: "Record updated successfully" }))
          .setMimeType(ContentService.MimeType.JSON);
    } else {
        sheet.appendRow(newRow);
        return ContentService.createTextOutput(JSON.stringify({ status: "success", message: "New record added successfully" }))
          .setMimeType(ContentService.MimeType.JSON);
    }
      
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Handles CORS preflight requests
function doOptions(e) {
  return ContentService.createTextOutput("")
    .setMimeType(ContentService.MimeType.JSON);
}
