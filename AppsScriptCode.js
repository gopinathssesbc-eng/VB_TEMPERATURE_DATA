function checkPassword(providedPassword) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const passSheet = getSheetCaseInsensitive(ss, "pass");
  if (!passSheet) return false;
  
  const actualPassword = passSheet.getRange("A2").getValue();
  return String(providedPassword).trim() === String(actualPassword).trim();
}

function checkSettingsPassword(providedPassword) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const passSheet = getSheetCaseInsensitive(ss, "pass");
  if (!passSheet) return false;
  
  const actualPassword = passSheet.getRange("A3").getValue();
  return String(providedPassword).trim() === String(actualPassword).trim();
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

// Convert any date value/string to DD-MM-YYYY format
function formatDateCell(val) {
  if (!val) return "";
  if (val instanceof Date) {
    return Utilities.formatDate(val, Session.getScriptTimeZone(), "dd-MM-yyyy");
  }
  const s = String(val).trim();
  // YYYY-MM-DD -> DD-MM-YYYY
  const ymd = s.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})$/);
  if (ymd) {
    return `${String(ymd[3]).padStart(2, '0')}-${String(ymd[2]).padStart(2, '0')}-${ymd[1]}`;
  }
  // DD-MM-YYYY
  const dmy = s.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{4})$/);
  if (dmy) {
    return `${String(dmy[1]).padStart(2, '0')}-${String(dmy[2]).padStart(2, '0')}-${dmy[3]}`;
  }
  return s;
}

// Convert any time value/string to HH:MM format
function formatTimeCell(val) {
  if (!val) return "";
  if (val instanceof Date) {
    return Utilities.formatDate(val, Session.getScriptTimeZone(), "HH:mm");
  }
  return String(val || "").trim();
}

function doGet(e) {
  // =========================================================================
  // 0. VERIFY SETTINGS PASSWORD: Check against cell A3 in "pass" sheet
  // =========================================================================
  if (e && e.parameter && e.parameter.action === "verify_settings_password") {
    const settingsPass = e.parameter.settings_password || e.parameter.password || "";
    if (checkSettingsPassword(settingsPass)) {
      return ContentService.createTextOutput(JSON.stringify({
        status: "success",
        message: "Settings password verified"
      })).setMimeType(ContentService.MimeType.JSON);
    } else {
      return ContentService.createTextOutput(JSON.stringify({
        status: "unauthorized",
        message: "Incorrect Settings password"
      })).setMimeType(ContentService.MimeType.JSON);
    }
  }

  // =========================================================================
  // 1. GET DROPDOWN DATA: Reads columns from "drop down data" sheet (Public read)
  // =========================================================================
  if (e && e.parameter && e.parameter.action === "get_dropdown_data") {
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
    let mainCatCol = headers.findIndex(h => h.includes("rm") || h.includes("main"));
    let subCatCol = headers.findIndex(h => h.includes("sub"));
    let defectCatCol = headers.findIndex(h => h.includes("defect"));
    let detentionCatCol = headers.findIndex(h => h.includes("detention"));

    if (trainCol === -1) trainCol = 0;
    if (rakeCol === -1) rakeCol = 1;
    if (mainCatCol === -1) mainCatCol = 2;
    if (subCatCol === -1) subCatCol = 3;
    if (defectCatCol === -1) defectCatCol = 4;
    if (detentionCatCol === -1) detentionCatCol = 5;

    const trainNos = [];
    const rakeNos = [];
    const mainCategories = [];
    const subCategories = [];
    const defectCategories = [];
    const detentionCategories = [];

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
      if (defectCatCol < row.length) {
        const val = String(row[defectCatCol] || "").trim();
        if (val && !defectCategories.includes(val)) defectCategories.push(val);
      }
      if (detentionCatCol < row.length) {
        const val = String(row[detentionCatCol] || "").trim();
        if (val && !detentionCategories.includes(val)) detentionCategories.push(val);
      }
    }

    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      trainNos: trainNos,
      rakeNos: rakeNos,
      mainCategories: mainCategories,
      subCategories: subCategories,
      defectCategories: defectCategories,
      detentionCategories: detentionCategories
    })).setMimeType(ContentService.MimeType.JSON);
  }

  const providedPassword = (e && e.parameter) ? e.parameter.password : "";
  
  if (!checkPassword(providedPassword)) {
    return ContentService.createTextOutput(JSON.stringify({ status: "unauthorized", message: "Incorrect password" }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  // =========================================================================
  // 1. ARRIVAL REPORT GET: Load existing reports across 3 sheets
  // =========================================================================
  if (e.parameter.action === "get_arrival_report") {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const queryDate = formatDateCell(e.parameter.date);
    const queryRake = String(e.parameter.rake || "").trim();

    let found = false;
    let basic = { Date: queryDate, RakeNo: queryRake, TrainNo: "", DataEnteredBy: "" };
    let defects = [];
    let railMadad = [];
    let detentions = [];

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
        const catIdx = headers.indexOf("Category") !== -1 ? headers.indexOf("Category") : headers.indexOf("Defect Category");
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
            const catVal = catIdx !== -1 ? String(row[catIdx] || "").trim() : "";
            const issueVal = issueIdx !== -1 ? String(row[issueIdx] || "").trim() : "";
            if (coachVal && coachVal !== "NIL") {
              defects.push({ CoachNo: coachVal, Category: catVal, IssueDescription: issueVal });
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
        const catIdx = headers.indexOf("Category") !== -1 ? headers.indexOf("Category") : headers.indexOf("Detention Category");
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
              TimeFrom: fromIdx !== -1 ? formatTimeCell(row[fromIdx]) : "",
              TimeTo: toIdx !== -1 ? formatTimeCell(row[toIdx]) : "",
              TotalDetention: totalIdx !== -1 ? String(row[totalIdx] || "").trim() : "",
              Category: catIdx !== -1 ? String(row[catIdx] || "").trim() : "",
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
    
    // =========================================================================
    // 0. SETTINGS ACTIONS (Password stored in A3 cell in "pass" sheet)
    // =========================================================================
    if (request.action === "verify_settings_password") {
      const settingsPass = request.settingsPassword || request.password || "";
      if (checkSettingsPassword(settingsPass)) {
        return ContentService.createTextOutput(JSON.stringify({
          status: "success",
          message: "Settings password verified"
        })).setMimeType(ContentService.MimeType.JSON);
      } else {
        return ContentService.createTextOutput(JSON.stringify({
          status: "unauthorized",
          message: "Incorrect Settings password"
        })).setMimeType(ContentService.MimeType.JSON);
      }
    }

    if (request.action === "save_dropdown_categories") {
      const settingsPass = request.settingsPassword || request.password || "";
      if (!checkSettingsPassword(settingsPass)) {
        return ContentService.createTextOutput(JSON.stringify({
          status: "unauthorized",
          message: "Incorrect Settings password (from cell A3 in 'pass' sheet)"
        })).setMimeType(ContentService.MimeType.JSON);
      }

      const ss = SpreadsheetApp.getActiveSpreadsheet();
      let sheet = getSheetCaseInsensitive(ss, "drop down data");
      if (!sheet) {
        sheet = ss.insertSheet("drop down data");
      }

      let allData = sheet.getDataRange().getValues();
      let headers = allData.length > 0 ? allData[0].map(h => String(h || "").trim()) : [];

      if (headers.length === 0) {
        headers = ["Train Nos", "Rake No", "RM complaint main category", "Sub category", "defect category", "Detention category"];
        sheet.appendRow(headers);
        SpreadsheetApp.flush();
        allData = sheet.getDataRange().getValues();
        headers = allData[0].map(h => String(h || "").trim());
      }

      const lowerHeaders = headers.map(h => h.toLowerCase());
      let mainCatCol = lowerHeaders.findIndex(h => h.includes("rm") || (h.includes("main") && h.includes("cat")));
      let subCatCol = lowerHeaders.findIndex(h => h.includes("sub"));
      let defectCatCol = lowerHeaders.findIndex(h => h.includes("defect"));
      let detentionCatCol = lowerHeaders.findIndex(h => h.includes("detention"));

      if (mainCatCol === -1) mainCatCol = 2;
      if (subCatCol === -1) subCatCol = 3;
      if (defectCatCol === -1) defectCatCol = 4;
      if (detentionCatCol === -1) detentionCatCol = 5;

      // Ensure headers exist at row 1 for these category columns
      const headerDefs = [
        { col: mainCatCol, name: "RM complaint main category" },
        { col: subCatCol, name: "Sub category" },
        { col: defectCatCol, name: "defect category" },
        { col: detentionCatCol, name: "Detention category" }
      ];
      headerDefs.forEach(def => {
        if (!headers[def.col] || headers[def.col].trim() === "") {
          sheet.getRange(1, def.col + 1).setValue(def.name);
        }
      });
      SpreadsheetApp.flush();

      const mainCats = Array.isArray(request.mainCategories) ? request.mainCategories.map(s => String(s || "").trim()).filter(Boolean) : [];
      const subCats = Array.isArray(request.subCategories) ? request.subCategories.map(s => String(s || "").trim()).filter(Boolean) : [];
      const defectCats = Array.isArray(request.defectCategories) ? request.defectCategories.map(s => String(s || "").trim()).filter(Boolean) : [];
      const detentionCats = Array.isArray(request.detentionCategories) ? request.detentionCategories.map(s => String(s || "").trim()).filter(Boolean) : [];

      const lastRow = sheet.getLastRow();

      const updateColumnData = (colIndex, items) => {
        if (lastRow > 1) {
          sheet.getRange(2, colIndex + 1, lastRow - 1, 1).clearContent();
        }
        if (items.length > 0) {
          const matrix = items.map(item => [item]);
          sheet.getRange(2, colIndex + 1, matrix.length, 1).setValues(matrix);
        }
      };

      updateColumnData(mainCatCol, mainCats);
      updateColumnData(subCatCol, subCats);
      updateColumnData(defectCatCol, defectCats);
      updateColumnData(detentionCatCol, detentionCats);

      SpreadsheetApp.flush();

      return ContentService.createTextOutput(JSON.stringify({
        status: "success",
        message: "Categories updated successfully in 'drop down data' sheet",
        mainCategories: mainCats,
        subCategories: subCats,
        defectCategories: defectCats,
        detentionCategories: detentionCats
      })).setMimeType(ContentService.MimeType.JSON);
    }

    if (!checkPassword(request.password)) {
      return ContentService.createTextOutput(JSON.stringify({ status: "unauthorized", message: "Incorrect password" }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    const ss = SpreadsheetApp.getActiveSpreadsheet();

    // =========================================================================
    // 1. SAVE ARRIVAL REPORT: Sync 3 sheets ("Arrival Report", "Rail Madad", "Detentions")
    // =========================================================================
    if (request.action === "save_arrival_report") {
      const basic = request.basic || {};
      const dateStr = formatDateCell(basic.Date);
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
      let sheet1 = getSheetCaseInsensitive(ss, "Arrival Report");
      if (!sheet1) {
        sheet1 = ss.insertSheet("Arrival Report");
        sheet1.appendRow(["Timestamp", "Date", "Rake No", "Train No", "Data Entered By", "Coach No", "Category", "Issue Description"]);
      }
      let headers1 = (sheet1.getLastColumn() > 0) ? sheet1.getRange(1, 1, 1, sheet1.getLastColumn()).getValues()[0] : [];
      if (headers1.length === 0) {
        headers1 = ["Timestamp", "Date", "Rake No", "Train No", "Data Entered By", "Coach No", "Category", "Issue Description"];
        sheet1.appendRow(headers1);
      } else {
        let catCol1 = headers1.indexOf("Category") !== -1 ? headers1.indexOf("Category") : headers1.indexOf("Defect Category");
        if (catCol1 === -1) {
          const issueColIdx = headers1.indexOf("Issue Description");
          if (issueColIdx !== -1) {
            // Insert column at position 7 so Category sits between Coach No and Issue Description
            sheet1.insertColumnBefore(issueColIdx + 1);
            sheet1.getRange(1, issueColIdx + 1).setValue("Category");
          } else {
            sheet1.getRange(1, headers1.length + 1).setValue("Category");
          }
          SpreadsheetApp.flush();
          headers1 = sheet1.getRange(1, 1, 1, sheet1.getLastColumn()).getValues()[0];
        }
      }
      clearExistingRows(sheet1);

      const dTsIdx = headers1.indexOf("Timestamp");
      const dDateIdx = headers1.indexOf("Date");
      const dRakeIdx = headers1.indexOf("Rake No");
      const dTrainIdx = headers1.indexOf("Train No");
      const dUserIdx = headers1.indexOf("Data Entered By");
      const dCoachIdx = headers1.indexOf("Coach No");
      const dCatIdx = headers1.indexOf("Category") !== -1 ? headers1.indexOf("Category") : headers1.indexOf("Defect Category");
      const dIssueIdx = headers1.indexOf("Issue Description");

      if (defects.length > 0) {
        defects.forEach(d => {
          let row = new Array(headers1.length).fill("");
          if (dTsIdx !== -1) row[dTsIdx] = timestamp;
          if (dDateIdx !== -1) row[dDateIdx] = dateStr;
          if (dRakeIdx !== -1) row[dRakeIdx] = rakeStr;
          if (dTrainIdx !== -1) row[dTrainIdx] = trainStr;
          if (dUserIdx !== -1) row[dUserIdx] = enteredBy;
          if (dCoachIdx !== -1) row[dCoachIdx] = d.CoachNo || "";
          if (dCatIdx !== -1) row[dCatIdx] = d.Category || "";
          if (dIssueIdx !== -1) row[dIssueIdx] = d.IssueDescription || "";
          sheet1.appendRow(row);
        });
      } else {
        let row = new Array(headers1.length).fill("");
        if (dTsIdx !== -1) row[dTsIdx] = timestamp;
        if (dDateIdx !== -1) row[dDateIdx] = dateStr;
        if (dRakeIdx !== -1) row[dRakeIdx] = rakeStr;
        if (dTrainIdx !== -1) row[dTrainIdx] = trainStr;
        if (dUserIdx !== -1) row[dUserIdx] = enteredBy;
        if (dCoachIdx !== -1) row[dCoachIdx] = "NIL";
        if (dIssueIdx !== -1) row[dIssueIdx] = "No Defects Reported";
        sheet1.appendRow(row);
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
      let sheet3 = getSheetCaseInsensitive(ss, "Detentions");
      if (!sheet3) {
        sheet3 = ss.insertSheet("Detentions");
        sheet3.appendRow(["Timestamp", "Date", "Rake No", "Train No", "Data Entered By", "Coach No", "Station", "Time From", "Time To", "Total Detention", "Category", "Issue Description", "Action Taken"]);
      }
      let headers3 = (sheet3.getLastColumn() > 0) ? sheet3.getRange(1, 1, 1, sheet3.getLastColumn()).getValues()[0] : [];
      if (headers3.length === 0) {
        headers3 = ["Timestamp", "Date", "Rake No", "Train No", "Data Entered By", "Coach No", "Station", "Time From", "Time To", "Total Detention", "Category", "Issue Description", "Action Taken"];
        sheet3.appendRow(headers3);
      } else {
        let dtCatCol = headers3.indexOf("Category") !== -1 ? headers3.indexOf("Category") : headers3.indexOf("Detention Category");
        if (dtCatCol === -1) {
          const issueColIdx = headers3.indexOf("Issue Description");
          if (issueColIdx !== -1) {
            sheet3.insertColumnBefore(issueColIdx + 1);
            sheet3.getRange(1, issueColIdx + 1).setValue("Category");
          } else {
            sheet3.getRange(1, headers3.length + 1).setValue("Category");
          }
          SpreadsheetApp.flush();
          headers3 = sheet3.getRange(1, 1, 1, sheet3.getLastColumn()).getValues()[0];
        }
      }
      clearExistingRows(sheet3);

      const dtTsIdx = headers3.indexOf("Timestamp");
      const dtDateIdx = headers3.indexOf("Date");
      const dtRakeIdx = headers3.indexOf("Rake No");
      const dtTrainIdx = headers3.indexOf("Train No");
      const dtUserIdx = headers3.indexOf("Data Entered By");
      const dtCoachIdx = headers3.indexOf("Coach No");
      const dtStnIdx = headers3.indexOf("Station");
      const dtFromIdx = headers3.indexOf("Time From");
      const dtToIdx = headers3.indexOf("Time To");
      const dtTotalIdx = headers3.indexOf("Total Detention");
      const dtCatIdx = headers3.indexOf("Category") !== -1 ? headers3.indexOf("Category") : headers3.indexOf("Detention Category");
      const dtDescIdx = headers3.indexOf("Issue Description");
      const dtActIdx = headers3.indexOf("Action Taken");

      if (detentions.length > 0) {
        detentions.forEach(dt => {
          let row = new Array(headers3.length).fill("");
          if (dtTsIdx !== -1) row[dtTsIdx] = timestamp;
          if (dtDateIdx !== -1) row[dtDateIdx] = dateStr;
          if (dtRakeIdx !== -1) row[dtRakeIdx] = rakeStr;
          if (dtTrainIdx !== -1) row[dtTrainIdx] = trainStr;
          if (dtUserIdx !== -1) row[dtUserIdx] = enteredBy;
          if (dtCoachIdx !== -1) row[dtCoachIdx] = dt.CoachNo || "";
          if (dtStnIdx !== -1) row[dtStnIdx] = dt.Station || "";
          if (dtFromIdx !== -1) row[dtFromIdx] = dt.TimeFrom || "";
          if (dtToIdx !== -1) row[dtToIdx] = dt.TimeTo || "";
          if (dtTotalIdx !== -1) row[dtTotalIdx] = dt.TotalDetention || "";
          if (dtCatIdx !== -1) row[dtCatIdx] = dt.Category || "";
          if (dtDescIdx !== -1) row[dtDescIdx] = dt.IssueDescription || "";
          if (dtActIdx !== -1) row[dtActIdx] = dt.ActionTaken || "";
          sheet3.appendRow(row);
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
