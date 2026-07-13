/**
 * La Boleta backend — Traveling Seven: Mexico
 *
 * Paste this into Extensions → Apps Script of a blank Google Sheet,
 * then Deploy → New deployment → Web app:
 *   Execute as: Me
 *   Who has access: Anyone
 * Copy the /exec URL into BOLETA_API in the site's index.html.
 *
 * Data model:
 *   "ideas" tab: id | city | cat | title | by | ts   (custom submissions only;
 *                starter ideas live in the site code)
 *   "votes" tab: ideaId | voter | vote | ts          (one row per voter+idea,
 *                last vote wins; vote is 1, -1, or the row is deleted for 0)
 */

var IDEA_HEADERS = ["id", "city", "cat", "title", "by", "ts"];
var VOTE_HEADERS = ["ideaId", "voter", "vote", "ts"];
var VALID_CITIES = ["cdmx", "slp"];
var VALID_CATS = ["aventura", "cultura", "sabores", "callejeo", "noche", "comodin"];

function doGet(e) {
  return json_(getState_());
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var body = JSON.parse(e.postData.contents);
    if (body.action === "vote") {
      setVote_(body);
    } else if (body.action === "submit") {
      addIdea_(body.idea || body);
    }
    return json_({ ok: true, state: getState_() });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function getState_() {
  var ideas = readRows_(sheet_("ideas", IDEA_HEADERS)).map(function (r) {
    return { id: r.id, city: r.city, cat: r.cat, title: r.title, by: r.by };
  });
  var votes = readRows_(sheet_("votes", VOTE_HEADERS)).map(function (r) {
    return { ideaId: r.ideaId, voter: r.voter, vote: Number(r.vote) };
  });
  return { ideas: ideas, votes: votes };
}

function setVote_(body) {
  var ideaId = String(body.ideaId || "").slice(0, 40);
  var voter = String(body.voter || "").slice(0, 40);
  var vote = Number(body.vote);
  if (!ideaId || !voter || [1, -1, 0].indexOf(vote) < 0) throw new Error("bad vote");
  var sh = sheet_("votes", VOTE_HEADERS);
  var data = sh.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (data[i][0] === ideaId && data[i][1] === voter) {
      if (vote === 0) sh.deleteRow(i + 1);
      else sh.getRange(i + 1, 3, 1, 2).setValues([[vote, new Date()]]);
      return;
    }
  }
  if (vote !== 0) sh.appendRow([ideaId, voter, vote, new Date()]);
}

function addIdea_(idea) {
  var id = String(idea.id || "c" + Date.now()).slice(0, 40);
  var city = String(idea.city || "");
  var cat = String(idea.cat || "");
  var title = String(idea.title || "").slice(0, 80).trim();
  var by = String(idea.by || "").slice(0, 40);
  if (VALID_CITIES.indexOf(city) < 0) throw new Error("bad city");
  if (VALID_CATS.indexOf(cat) < 0) throw new Error("bad category");
  if (!title || !by) throw new Error("missing title or name");
  var sh = sheet_("ideas", IDEA_HEADERS);
  var data = sh.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (data[i][0] === id) return; // duplicate resend, ignore
  }
  sh.appendRow([id, city, cat, title, by, new Date()]);
}

function sheet_(name, headers) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(name);
  if (!sh) {
    sh = ss.insertSheet(name);
    sh.appendRow(headers);
    sh.setFrozenRows(1);
  }
  return sh;
}

function readRows_(sh) {
  var data = sh.getDataRange().getValues();
  var headers = data[0] || [];
  var rows = [];
  for (var i = 1; i < data.length; i++) {
    var obj = {};
    for (var j = 0; j < headers.length; j++) obj[headers[j]] = data[i][j];
    rows.push(obj);
  }
  return rows;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );
}
