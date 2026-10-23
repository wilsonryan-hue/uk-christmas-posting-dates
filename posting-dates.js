/*! UK Christmas posting dates widget v1.0.0 (MIT) https://github.com/wilsonryan-hue/uk-christmas-posting-dates
 * Dates copied from Royal Mail's own page (royalmail.com/christmas/last-posting-dates), checked 23 Oct 2026.
 * Royal Mail says the dates are correct at the time of publishing and subject to change.
 * No cookies, no tracking, no outside requests. Works as a <script> embed or as a Node module. */
(function (root) {
  "use strict";
  var YEAR = 2026;
  var SERVICES = [
    { id: "2nd", name: "2nd Class", detail: "2nd Class, 2nd Class Signed For", date: "2026-12-18" },
    { id: "tracked48", name: "Tracked 48", detail: "Royal Mail Tracked 48", date: "2026-12-19" },
    { id: "1st", name: "1st Class", detail: "1st Class, 1st Class Signed For, Royal Mail Tracked 24", date: "2026-12-21" },
    { id: "special", name: "Special Delivery", detail: "Special Delivery Guaranteed", date: "2026-12-23" },
    { id: "pf48", name: "Parcelforce express48", detail: "Parcelforce express48, express48large", date: "2026-12-21" },
    { id: "pf24", name: "Parcelforce express24", detail: "Parcelforce express10, expressAM, express24", date: "2026-12-22" }
  ];
  var DEFAULT_IDS = ["2nd", "tracked48", "1st", "special"];
  var DAY = 864e5;
  var MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  var DAYS = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

  function utc(iso) { var p = iso.split("-"); return Date.UTC(+p[0], p[1] - 1, +p[2]); }
  function today(now) { now = now || new Date(); return Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()); }
  function iso(t) { return new Date(t).toISOString().slice(0, 10); }
  function nice(t) { var d = new Date(t); return DAYS[d.getUTCDay()] + " " + d.getUTCDate() + " " + MONTHS[d.getUTCMonth()]; }

  // Step back N working days (Mon to Fri) from a posting date, for shops that need time to pack.
  function minusWorkingDays(t, n) {
    while (n > 0) { t -= DAY; var w = new Date(t).getUTCDay(); if (w !== 0 && w !== 6) n--; }
    return t;
  }

  function label(days) {
    if (days > 1) return days + " days left";
    if (days === 1) return "1 day left";
    if (days === 0) return "today is the last day";
    return "date has passed";
  }

  // Pure function: what the widget shows. Exported for tests and Node use.
  function compute(opts) {
    opts = opts || {};
    var ids = opts.services && opts.services.length ? opts.services : DEFAULT_IDS;
    var dispatch = Math.max(0, Math.min(10, parseInt(opts.dispatchDays || 0, 10) || 0));
    var t0 = today(opts.now);
    var rows = [];
    ids.forEach(function (id) {
      for (var i = 0; i < SERVICES.length; i++) if (SERVICES[i].id === id) {
        var s = SERVICES[i], post = utc(s.date), by = minusWorkingDays(post, dispatch), d = Math.round((by - t0) / DAY);
        rows.push({ id: s.id, name: s.name, detail: s.detail, postBy: s.date, orderBy: iso(by), orderByText: nice(by), daysLeft: d, status: d < 0 ? "passed" : d === 0 ? "today" : "open", label: label(d) });
      }
    });
    var open = rows.filter(function (r) { return r.daysLeft >= 0; });
    return { year: YEAR, dispatchDays: dispatch, rows: rows, allPassed: rows.length > 0 && open.length === 0, next: open[0] || null };
  }

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  function render(el) {
    var ds = el.dataset || {};
    var res = compute({ services: ds.services ? ds.services.split(",").map(function (x) { return x.trim(); }) : null, dispatchDays: ds.dispatch });
    var shop = ds.dispatch && +ds.dispatch > 0;
    var accent = /^#[0-9a-fA-F]{3,8}$/.test(ds.accent || "") ? ds.accent : "#14532D";
    var dark = ds.theme === "dark";
    var bg = dark ? "#111827" : "#FFFDF7", fg = dark ? "#F9FAFB" : "#1F2937", mute = dark ? "#9CA3AF" : "#6B7280";
    var title = ds.title || (shop ? "Order by these dates for Christmas delivery" : "Last Christmas posting dates " + YEAR);
    var h = '<div style="font:15px/1.45 system-ui,-apple-system,Segoe UI,Roboto,sans-serif;max-width:440px;border:2px solid ' + accent + ';border-radius:12px;padding:14px 16px;background:' + bg + ';color:' + fg + '">';
    h += '<div style="font-weight:700;font-size:16px;margin:0 0 8px">' + esc(title) + "</div>";
    h += '<table style="width:100%;border-collapse:collapse">';
    res.rows.forEach(function (r) {
      var col = r.status === "passed" ? mute : r.daysLeft <= 3 ? "#B91C1C" : accent;
      h += '<tr><td style="padding:4px 0;border-bottom:1px solid rgba(127,127,127,.2)"><b>' + esc(r.name) + '</b><br><span style="color:' + mute + ';font-size:13px">' + (shop ? "Order by " : "Post by ") + esc(r.orderByText) + "</span></td>";
      h += '<td style="padding:4px 0;border-bottom:1px solid rgba(127,127,127,.2);text-align:right;color:' + col + ';font-weight:600;white-space:nowrap">' + esc(r.label) + "</td></tr>";
    });
    h += "</table>";
    if (ds.message) h += '<p style="margin:10px 0 0">' + esc(ds.message) + "</p>";
    h += '<p style="margin:10px 0 0;font-size:12px;color:' + mute + '">Dates from Royal Mail, subject to change.' + (shop ? " Includes " + res.dispatchDays + " working day" + (res.dispatchDays > 1 ? "s" : "") + " to pack your order." : "");
    if (ds.credit !== "off") h += ' <a href="https://www.tchworks.co.uk/guides/christmas-card-posting-dates-2026/?src=widget" style="color:' + mute + '">Free widget by TCH Works</a>';
    h += "</p></div>";
    el.innerHTML = h;
  }

  function boot() {
    var els = document.querySelectorAll("[data-uk-posting-dates]");
    for (var i = 0; i < els.length; i++) render(els[i]);
  }

  var api = { compute: compute, services: SERVICES, year: YEAR, render: render };
  if (typeof module === "object" && module.exports) module.exports = api;
  else {
    root.UKPostingDates = api;
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot); else boot();
  }
})(this);
