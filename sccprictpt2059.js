function checkPassword(providedPassword) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const passSheet = ss.getSheetByName("pass");
  if (!passSheet) return false;
  
  const actualPassword = passSheet.getRange("A2").getValue();
  return String(providedPassword) === String(actualPassword);
}

function getSheetCaseInsensitive(ss, targetName) {
  let sheet = ss.getSheetByName(targetName);
  if (!sheet) {
    const sheets = ss.getSheets();
    for (let i = 0; i < sheets.length; i++) {
      if (sheets[i].getName().trim().toLowerCase() === String(targetName).trim().toLowerCase()) {
        return sheets[i];
      }
    }
  }
  return sheet;
}

function doGet(e) {
  const providedPassword = e.parameter.password;
  
  if (!checkPassword(providedPassword)) {
    return ContentService.createTextOutput(JSON.stringify({ status: "unauthorized", message: "Incorrect password" }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  // =========================================================================
  // 1. ARRIVAL REPORT GET: Load existing reports across 3 sheets
  // =========================================================================
  if (e.parameter.action === "get_arrival_report") {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const queryDate = String(e.parameter.date || "").trim();
    const queryRake = String(e.parameter.rake || "").trim();

    let found = false;
    let basic = { Date: queryDate, RakeNo: queryRake, TrainNo: "", DataEnteredBy: "" };
    let defects = [];
    let railMadad = [];
    let detentions = [];

    const formatDateCell = (val) => {
      if (val instanceof Date) {
        return Utilities.formatDate(val, Session.getScriptTimeZone(), "yyyy-MM-dd");
      }
      return String(val || "").trim();
    };

    // 1) Arrival Report (Defects)
    const sheet1 = getSheetCaseInsensitive(ss, "Arrival Report");
    if (sheet1) {
      const data1 = sheet1.getDataRange().getValues();
      if (data1.length > 1) {
        const headers = data1[0];
        const dateIdx = headers.indexOf("Date");
        const rakeIdx = headers.indexOf("Rake No");
        const trainIdx = headers.indexOf("Train No");
        const userIdx = headers.indexOf("Data Entered By");
        const coachIdx = headers.indexOf("Coach No");
        const issueIdx = headers.indexOf("Issue Description");

        for (let i = 1; i < data1.length; i++) {
          const row = data1[i];
          const rowDate = formatDateCell(row[dateIdx]);
          const rowRake = String(row[rakeIdx] || "").trim();

          if (rowDate === queryDate && (!queryRake || rowRake.toLowerCase() === queryRake.toLowerCase())) {
            found = true;
            if (!basic.TrainNo && trainIdx !== -1) basic.TrainNo = String(row[trainIdx] || "").trim();
            if (!basic.DataEnteredBy && userIdx !== -1) basic.DataEnteredBy = String(row[userIdx] || "").trim();
            const coachVal = coachIdx !== -1 ? String(row[coachIdx] || "").trim() : "";
            const issueVal = issueIdx !== -1 ? String(row[issueIdx] || "").trim() : "";
            if (coachVal && coachVal !== "NIL") {
              defects.push({ CoachNo: coachVal, IssueDescription: issueVal });
            }
          }
        }
      }
    }

    // 2) Rail Madad
    const sheet2 = getSheetCaseInsensitive(ss, "Rail Madad");
    if (sheet2) {
      const data2 = sheet2.getDataRange().getValues();
      if (data2.length > 1) {
        const headers = data2[0];
        const dateIdx = headers.indexOf("Date");
        const rakeIdx = headers.indexOf("Rake No");
        const trainIdx = headers.indexOf("Train No");
        const userIdx = headers.indexOf("Data Entered By");
        const coachIdx = headers.indexOf("Coach No");
        const refIdx = headers.indexOf("RM Reference No");
        const mainCatIdx = headers.indexOf("Main Category");
        const subCatIdx = headers.indexOf("Sub Category");
        const descIdx = headers.indexOf("Complaint Description");
        const actIdx = headers.indexOf("Action Taken Enroute");

        for (let i = 1; i < data2.length; i++) {
          const row = data2[i];
          const rowDate = formatDateCell(row[dateIdx]);
          const rowRake = String(row[rakeIdx] || "").trim();

          if (rowDate === queryDate && (!queryRake || rowRake.toLowerCase() === queryRake.toLowerCase())) {
            found = true;
            if (!basic.TrainNo && trainIdx !== -1) basic.TrainNo = String(row[trainIdx] || "").trim();
            if (!basic.DataEnteredBy && userIdx !== -1) basic.DataEnteredBy = String(row[userIdx] || "").trim();

            railMadad.push({
              CoachNo: coachIdx !== -1 ? String(row[coachIdx] || "").trim() : "",
              RMReferenceNo: refIdx !== -1 ? String(row[refIdx] || "").trim() : "",
              MainCategory: mainCatIdx !== -1 ? String(row[mainCatIdx] || "").trim() : "",
              SubCategory: subCatIdx !== -1 ? String(row[subCatIdx] || "").trim() : "",
              ComplaintDescription: descIdx !== -1 ? String(row[descIdx] || "").trim() : "",
              ActionTaken: actIdx !== -1 ? String(row[actIdx] || "").trim() : ""
            });
          }
        }
      }
    }

    // 3) Detentions
    const sheet3 = getSheetCaseInsensitive(ss, "Detentions");
    if (sheet3) {
      const data3 = sheet3.getDataRange().getValues();
      if (data3.length > 1) {
        const headers = data3[0];
        const dateIdx = headers.indexOf("Date");
        const rakeIdx = headers.indexOf("Rake No");
        const trainIdx = headers.indexOf("Train No");
        const userIdx = headers.indexOf("Data Entered By");
        const coachIdx = headers.indexOf("Coach No");
        const stnIdx = headers.indexOf("Station");
        const fromIdx = headers.indexOf("Time From");
        const toIdx = headers.indexOf("Time To");
        const totalIdx = headers.indexOf("Total Detention");
        const descIdx = headers.indexOf("Issue Description");
        const actIdx = headers.indexOf("Action Taken");

        for (let i = 1; i < data3.length; i++) {
          const row = data3[i];
          const rowDate = formatDateCell(row[dateIdx]);
          const rowRake = String(row[rakeIdx] || "").trim();

          if (rowDate === queryDate && (!queryRake || rowRake.toLowerCase() === queryRake.toLowerCase())) {
            found = true;
            if (!basic.TrainNo && trainIdx !== -1) basic.TrainNo = String(row[trainIdx] || "").trim();
            if (!basic.DataEnteredBy && userIdx !== -1) basic.DataEnteredBy = String(row[userIdx] || "").trim();

            detentions.push({
              CoachNo: coachIdx !== -1 ? String(row[coachIdx] || "").trim() : "",
              Station: stnIdx !== -1 ? String(row[stnIdx] || "").trim() : "",
              TimeFrom: fromIdx !== -1 ? String(row[fromIdx] || "").trim() : "",
              TimeTo: toIdx !== -1 ? String(row[toIdx] || "").trim() : "",
              TotalDetention: totalIdx !== -1 ? String(row[totalIdx] || "").trim() : "",
              IssueDescription: descIdx !== -1 ? String(row[descIdx] || "").trim() : "",
              ActionTaken: actIdx !== -1 ? String(row[actIdx] || "").trim() : ""
            });
          }
        }
      }
    }

    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      found: found,
      basic: basic,
      defects: defects,
      railMadad: railMadad,
      detentions: detentions
    })).setMimeType(ContentService.MimeType.JSON);
  }

  // =========================================================================
  // 2. GET DROPDOWN DATA: Reads columns from "drop down data" sheet
  // =========================================================================
  if (e.parameter.action === "get_dropdown_data") {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = getSheetCaseInsensitive(ss, "drop down data");

    if (!sheet) {
      return ContentService.createTextOutput(JSON.stringify({
        status: "error",
        message: "Sheet 'drop down data' not found"
      })).setMimeType(ContentService.MimeType.JSON);
    }

    const data = sheet.getDataRange().getValues();
    if (data.length <= 1) {
      return ContentService.createTextOutput(JSON.stringify({
        status: "success",
        trainNos: [],
        rakeNos: [],
        mainCategories: [],
        subCategories: []
      })).setMimeType(ContentService.MimeType.JSON);
    }

    const headers = data[0].map(h => String(h || "").trim().toLowerCase());
    
    // Find column indexes
    let trainCol = headers.findIndex(h => h.includes("train"));
    let rakeCol = headers.findIndex(h => h.includes("rake"));
    let mainCatCol = headers.findIndex(h => h.includes("main") || h.includes("category"));
    let subCatCol = headers.findIndex(h => h.includes("sub"));

    if (trainCol === -1) trainCol = 0;
    if (rakeCol === -1) rakeCol = 1;
    if (mainCatCol === -1) mainCatCol = 2;
    if (subCatCol === -1) subCatCol = 3;

    const trainNos = [];
    const rakeNos = [];
    const mainCategories = [];
    const subCategories = [];

    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      if (trainCol < row.length) {
        const val = String(row[trainCol] || "").trim();
        if (val && !trainNos.includes(val)) trainNos.push(val);
      }
      if (rakeCol < row.length) {
        const val = String(row[rakeCol] || "").trim();
        if (val && !rakeNos.includes(val)) rakeNos.push(val);
      }
      if (mainCatCol < row.length) {
        const val = String(row[mainCatCol] || "").trim();
        if (val && !mainCategories.includes(val)) mainCategories.push(val);
      }
      if (subCatCol < row.length) {
        const val = String(row[subCatCol] || "").trim();
        if (val && !subCategories.includes(val)) subCategories.push(val);
      }
    }

    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      trainNos: trainNos,
      rakeNos: rakeNos,
      mainCategories: mainCategories,
      subCategories: subCategories
    })).setMimeType(ContentService.MimeType.JSON);
  }

  // =========================================================================
  // 3. STANDARD TEMPERATURE DATA GET
  // =========================================================================
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
  if (data.length <= 1) {
    return ContentService.createTextOutput(JSON.stringify({ status: "success", data: [] }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  const headers = data[0];
  const rows = data.slice(1);
  
  const result = rows.map(row => {
    let obj = {};
    headers.forEach((header, index) => {
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

    const ss = SpreadsheetApp.getActiveSpreadsheet();

    const formatDateCell = (val) => {
      if (val instanceof Date) {
        return Utilities.formatDate(val, Session.getScriptTimeZone(), "yyyy-MM-dd");
      }
      return String(val || "").trim();
    };

    // =========================================================================
    // 1. SAVE ARRIVAL REPORT: Sync 3 sheets ("Arrival Report", "Rail Madad", "Detentions")
    // =========================================================================
    if (request.action === "save_arrival_report") {
      const basic = request.basic || {};
      const dateStr = String(basic.Date || "").trim();
      const rakeStr = String(basic.RakeNo || "").trim();
      const trainStr = String(basic.TrainNo || "").trim();
      const enteredBy = String(basic.DataEnteredBy || "").trim();
      const timestamp = String(basic.Timestamp || Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyy-MM-dd HH:mm:ss"));

      const defects = request.defects || [];
      const railMadad = request.railMadad || [];
      const detentions = request.detentions || [];

      // Helper to clear existing rows for Date + Rake
      const clearExistingRows = (sheet) => {
        const data = sheet.getDataRange().getValues();
        if (data.length <= 1) return;
        const headers = data[0];
        const dateIdx = headers.indexOf("Date");
        const rakeIdx = headers.indexOf("Rake No");
        if (dateIdx === -1 || rakeIdx === -1) return;

        for (let i = data.length - 1; i >= 1; i--) {
          const rowDate = formatDateCell(data[i][dateIdx]);
          const rowRake = String(data[i][rakeIdx] || "").trim();
          if (rowDate === dateStr && rowRake.toLowerCase() === rakeStr.toLowerCase()) {
            sheet.deleteRow(i + 1);
          }
        }
      };

      // 1) Sheet: "Arrival Report" (Defects)
      const headers1 = ["Timestamp", "Date", "Rake No", "Train No", "Data Entered By", "Coach No", "Issue Description"];
      let sheet1 = getSheetCaseInsensitive(ss, "Arrival Report");
      if (!sheet1) {
        sheet1 = ss.insertSheet("Arrival Report");
        sheet1.appendRow(headers1);
      } else if (sheet1.getDataRange().getValues().length === 0) {
        sheet1.appendRow(headers1);
      }
      clearExistingRows(sheet1);

      if (defects.length > 0) {
        defects.forEach(d => {
          sheet1.appendRow([timestamp, dateStr, rakeStr, trainStr, enteredBy, d.CoachNo || "", d.IssueDescription || ""]);
        });
      } else {
        sheet1.appendRow([timestamp, dateStr, rakeStr, trainStr, enteredBy, "NIL", "No Defects Reported"]);
      }

      // 2) Sheet: "Rail Madad"
      const headers2 = ["Timestamp", "Date", "Rake No", "Train No", "Data Entered By", "Coach No", "RM Reference No", "Main Category", "Sub Category", "Complaint Description", "Action Taken Enroute"];
      let sheet2 = getSheetCaseInsensitive(ss, "Rail Madad");
      if (!sheet2) {
        sheet2 = ss.insertSheet("Rail Madad");
        sheet2.appendRow(headers2);
      } else if (sheet2.getDataRange().getValues().length === 0) {
        sheet2.appendRow(headers2);
      }
      clearExistingRows(sheet2);

      if (railMadad.length > 0) {
        railMadad.forEach(rm => {
          sheet2.appendRow([timestamp, dateStr, rakeStr, trainStr, enteredBy, rm.CoachNo || "", rm.RMReferenceNo || "", rm.MainCategory || "", rm.SubCategory || "", rm.ComplaintDescription || "", rm.ActionTaken || ""]);
        });
      }

      // 3) Sheet: "Detentions"
      const headers3 = ["Timestamp", "Date", "Rake No", "Train No", "Data Entered By", "Coach No", "Station", "Time From", "Time To", "Total Detention", "Issue Description", "Action Taken"];
      let sheet3 = getSheetCaseInsensitive(ss, "Detentions");
      if (!sheet3) {
        sheet3 = ss.insertSheet("Detentions");
        sheet3.appendRow(headers3);
      } else if (sheet3.getDataRange().getValues().length === 0) {
        sheet3.appendRow(headers3);
      }
      clearExistingRows(sheet3);

      if (detentions.length > 0) {
        detentions.forEach(dt => {
          sheet3.appendRow([timestamp, dateStr, rakeStr, trainStr, enteredBy, dt.CoachNo || "", dt.Station || "", dt.TimeFrom || "", dt.TimeTo || "", dt.TotalDetention || "", dt.IssueDescription || "", dt.ActionTaken || ""]);
        });
      }

      return ContentService.createTextOutput(JSON.stringify({
        status: "success",
        message: "Saved successfully to 3 Google Sheets (Arrival Report, Rail Madad, Detentions)"
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // =========================================================================
    // 2. STANDARD TEMPERATURE DATA POST
    // =========================================================================
    const trainName = request.train;
    const rowData = request.rowData;
    
    if (!trainName) {
       return ContentService.createTextOutput(JSON.stringify({ status: "error", message: "Train not specified" }))
         .setMimeType(ContentService.MimeType.JSON);
    }

    let sheet = getSheetCaseInsensitive(ss, trainName);
    if (!sheet) {
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
            let sheetDateStr = formatDateCell(allData[i][dateIndex]);
            if (sheetDateStr === String(rowData["Date"]).trim() && 
                String(allData[i][stationIndex]).trim() === String(rowData["Station"]).trim()) {
                rowIndexToUpdate = i + 1;
                break;
            }
        }
    }
    
    let newRow = [];
    if (headers.length > 0) {
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
