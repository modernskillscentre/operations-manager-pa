/**
 * 👔 OPERATIONS MANAGER & PA - 2-WAY MULTI-DEVICE CLOUD BACKEND
 * 
 * Instructions:
 * 1. Open Google Sheets at https://sheets.new
 * 2. Click Extensions -> Apps Script
 * 3. Delete any code and paste this ENTIRE file
 * 4. Click "Deploy" -> "New Deployment"
 * 5. Select type: "Web App"
 * 6. Set "Execute as": "Me"
 * 7. Set "Who has access": "Anyone"
 * 8. Click "Deploy", authorize permissions, and COPY your Web App URL.
 * 9. Paste this URL into the web app's Settings -> Cloud Sync on any device!
 */

function doGet(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var ideasSheet = getOrCreateSheet(ss, "Ideas");
  var configSheet = getOrCreateSheet(ss, "Config");
  
  // Read Ideas
  var data = ideasSheet.getDataRange().getValues();
  var ideas = [];
  if (data.length > 1) {
    for (var i = 1; i < data.length; i++) {
      var row = data[i];
      if (!row[0] && !row[2]) continue; // skip empty rows
      
      var steps = [];
      if (row[7]) steps.push(String(row[7]));
      if (row[8]) steps.push(String(row[8]));
      if (row[9]) steps.push(String(row[9]));
      
      ideas.push({
        id: row[0] ? String(row[0]) : ('idea_' + i),
        created_at: row[1] ? new Date(row[1]).toISOString() : new Date().toISOString(),
        title: row[2] || 'Untitled',
        category: row[3] || 'SOMEDAY',
        alignment_score: Number(row[4]) || 5,
        when: row[5] || '',
        where: row[6] || '',
        how: steps,
        manager_verdict: row[10] || '',
        raw: row[11] || '',
        completed: String(row[12]).toLowerCase() === 'completed'
      });
    }
  }
  
  // Read Config (Goals & Focus state)
  var configData = configSheet.getDataRange().getValues();
  var goals = { goal1: '', goal2: '', bandwidth: '', antigoals: '', tools: '' };
  var focusState = null;
  
  for (var j = 0; j < configData.length; j++) {
    var key = String(configData[j][0]);
    var val = configData[j][1];
    if (key === 'goals' && val) {
      try { goals = JSON.parse(val); } catch(err){}
    } else if (key === 'focusState' && val) {
      try { focusState = JSON.parse(val); } catch(err){}
    }
  }
  
  var result = {
    status: "success",
    timestamp: new Date().toISOString(),
    ideas: ideas,
    goals: goals,
    focusState: focusState
  };
  
  return ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var ideasSheet = getOrCreateSheet(ss, "Ideas");
    var configSheet = getOrCreateSheet(ss, "Config");
    
    var payload = JSON.parse(e.postData.contents);
    var action = payload.action || 'sync_all';
    
    if (action === 'sync_all' || action === 'save_all') {
      if (payload.ideas && Array.isArray(payload.ideas)) {
        writeAllIdeas(ideasSheet, payload.ideas);
      }
      if (payload.goals) {
        setConfigValue(configSheet, 'goals', JSON.stringify(payload.goals));
      }
      if (payload.focusState !== undefined) {
        setConfigValue(configSheet, 'focusState', JSON.stringify(payload.focusState));
      }
    } else if (action === 'add_idea') {
      var idea = payload.idea || payload;
      appendIdeaRow(ideasSheet, idea);
    } else if (action === 'update_idea') {
      updateIdeaRow(ideasSheet, payload.idea);
    } else if (action === 'delete_idea') {
      deleteIdeaRow(ideasSheet, payload.id);
    } else if (action === 'save_goals') {
      setConfigValue(configSheet, 'goals', JSON.stringify(payload.goals));
    } else if (action === 'save_focus') {
      setConfigValue(configSheet, 'focusState', JSON.stringify(payload.focusState));
    }
    
    return ContentService.createTextOutput(JSON.stringify({ status: "success", timestamp: new Date().toISOString() }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch(err) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// --- HELPER FUNCTIONS ---
function getOrCreateSheet(ss, name) {
  var sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    if (name === "Ideas") {
      var headers = [
        "ID", "Date & Time", "Title", "Category", "Score",
        "When", "Where", "Step 1", "Step 2", "Step 3",
        "Manager's Verdict", "Raw Idea", "Status"
      ];
      sheet.appendRow(headers);
      var headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setBackground("#1E1B4B").setFontColor("#FFFFFF").setFontWeight("bold");
      sheet.setFrozenRows(1);
    } else if (name === "Config") {
      sheet.appendRow(["Key", "JSON Value"]);
      sheet.getRange(1, 1, 1, 2).setBackground("#312E81").setFontColor("#FFFFFF").setFontWeight("bold");
    }
  }
  return sheet;
}

function writeAllIdeas(sheet, ideas) {
  // Clear old rows except header
  var lastRow = sheet.getLastRow();
  if (lastRow > 1) {
    sheet.getRange(2, 1, lastRow - 1, 13).clearContent();
  }
  
  if (!ideas || ideas.length === 0) return;
  
  var rows = [];
  for (var i = 0; i < ideas.length; i++) {
    var idea = ideas[i];
    var steps = idea.how || [];
    var formattedDate = idea.created_at ? idea.created_at.replace("T", " ").slice(0, 19) : "";
    
    rows.push([
      idea.id || ('idea_' + (i + 1)),
      formattedDate,
      idea.title || '',
      idea.category || 'SOMEDAY',
      idea.alignment_score || 5,
      idea.when || '',
      idea.where || '',
      steps[0] || '',
      steps[1] || '',
      steps[2] || '',
      idea.manager_verdict || '',
      idea.raw || '',
      idea.completed ? "Completed" : "Active"
    ]);
  }
  
  sheet.getRange(2, 1, rows.length, 13).setValues(rows);
}

function appendIdeaRow(sheet, idea) {
  var steps = idea.how || [];
  var formattedDate = idea.created_at ? idea.created_at.replace("T", " ").slice(0, 19) : new Date();
  
  sheet.appendRow([
    idea.id || ('idea_' + Date.now()),
    formattedDate,
    idea.title || '',
    idea.category || 'SOMEDAY',
    idea.alignment_score || 5,
    idea.when || '',
    idea.where || '',
    steps[0] || '',
    steps[1] || '',
    steps[2] || '',
    idea.manager_verdict || '',
    idea.raw || '',
    idea.completed ? "Completed" : "Active"
  ]);
}

function updateIdeaRow(sheet, idea) {
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][0]) === String(idea.id)) {
      var steps = idea.how || [];
      sheet.getRange(i + 1, 3).setValue(idea.title || '');
      sheet.getRange(i + 1, 4).setValue(idea.category || 'SOMEDAY');
      sheet.getRange(i + 1, 5).setValue(idea.alignment_score || 5);
      sheet.getRange(i + 1, 6).setValue(idea.when || '');
      sheet.getRange(i + 1, 7).setValue(idea.where || '');
      sheet.getRange(i + 1, 8).setValue(steps[0] || '');
      sheet.getRange(i + 1, 9).setValue(steps[1] || '');
      sheet.getRange(i + 1, 10).setValue(steps[2] || '');
      sheet.getRange(i + 1, 11).setValue(idea.manager_verdict || '');
      sheet.getRange(i + 1, 13).setValue(idea.completed ? "Completed" : "Active");
      return;
    }
  }
  // If not found, append it
  appendIdeaRow(sheet, idea);
}

function deleteIdeaRow(sheet, ideaId) {
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][0]) === String(ideaId)) {
      sheet.deleteRow(i + 1);
      return;
    }
  }
}

function setConfigValue(sheet, key, value) {
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][0]) === String(key)) {
      sheet.getRange(i + 1, 2).setValue(value);
      return;
    }
  }
  sheet.appendRow([key, value]);
}
