const app = document.getElementById("app");
const PAGES_KEY     = "tronscan_custom_pages";
const REDIRECTS_KEY = "tronscan_redirects";

function getSavedPages() {
  try { return JSON.parse(localStorage.getItem(PAGES_KEY)) || {}; } catch(e) { return {}; }
}
function saveCustomPage(slug, page) {
  var s = getSavedPages(); s[slug] = page;
  localStorage.setItem(PAGES_KEY, JSON.stringify(s, null, 2));
}
function deleteCustomPage(slug) {
  var s = getSavedPages(); delete s[slug];
  localStorage.setItem(PAGES_KEY, JSON.stringify(s, null, 2));
}
function allPages() {
  return Object.assign({}, pages, getSavedPages());
}

function getSavedRedirects() {
  try { return JSON.parse(localStorage.getItem(REDIRECTS_KEY)) || {}; } catch(e) { return {}; }
}
function saveRedirect(from, to) {
  var s = getSavedRedirects(); s[from] = to;
  localStorage.setItem(REDIRECTS_KEY, JSON.stringify(s, null, 2));
}
function deleteRedirect(from) {
  var s = getSavedRedirects(); delete s[from];
  localStorage.setItem(REDIRECTS_KEY, JSON.stringify(s, null, 2));
}
function allRedirects() {
  return Object.assign({}, redirects, getSavedRedirects());
}

function makeUrl(slug) {
  return window.location.origin + "/#/" + siteConfig.routeWord + "/" + encodeURIComponent(slug);
}
function makeRedirectUrl(from) {
  return window.location.origin + from;
}
function copyText(text) {
  navigator.clipboard.writeText(text).then(function() { toast("کپی شد ✓"); });
}
function toast(msg) {
  var t = document.createElement("div");
  t.className = "toast";
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(function() { t.classList.add("show"); }, 10);
  setTimeout(function() { t.classList.remove("show"); setTimeout(function() { t.remove(); }, 300); }, 2200);
}

function isLoggedIn() { return localStorage.getItem("tronscan_admin") === "yes"; }
function login(pw) {
  if (pw === siteConfig.adminPassword) {
    localStorage.setItem("tronscan_admin", "yes");
    renderAdmin();
  } else {
    toast("رمز اشتباه است ✗");
  }
}
function logout() {
  localStorage.removeItem("tronscan_admin");
  route();
}

function renderLanding() {
  app.innerHTML =
    '<div class="page-center">' +
      '<div class="glass-card hero-card">' +
        '<div class="hero-glow"></div>' +
        '<img class="hero-logo" src="https://tronscan.org/favicon.png?v=2" alt="TRONSCAN">' +
        '<span class="chip">' + siteConfig.landing.badge + '</span>' +
        '<h1 class="hero-title">' + siteConfig.landing.title + '</h1>' +
        '<p class="hero-sub">' + siteConfig.landing.subtitle + '</p>' +
        '<div class="btn-row">' +
          '<a class="btn btn-primary" href="#/admin">ورود به پنل ادمین</a>' +
          '<a class="btn btn-ghost" href="#/' + siteConfig.routeWord + '/b7e9c4d12a6f83e0d5b91c7a4f0e6d2398c15ab63fe70d42c9b8a1e35f6d0c94">نمونه تراکنش</a>' +
        '</div>' +
      '</div>' +
    '</div>';
}

function renderRoutePage(slug) {
  var page = allPages()[slug];
  if (!page) {
    app.innerHTML =
      '<div class="page-center">' +
        '<div class="glass-card text-center">' +
          '<div class="icon-circle icon-red">✕</div>' +
          '<h2>تراکنش پیدا نشد</h2>' +
          '<p class="muted">این هش تراکنش در سیستم ثبت نشده است.</p>' +
          '<a class="btn btn-primary" href="/">بازگشت به خانه</a>' +
        '</div>' +
      '</div>';
    return;
  }
  var amount = (page.amount || 0).toLocaleString();
  var count  = page.count || 1;
  var url    = makeUrl(slug);
  app.innerHTML =
    '<div class="page-center">' +
      '<div class="glass-card text-center">' +
        '<div class="icon-circle icon-green">✓</div>' +
        '<span class="chip chip-mono">' + slug.substring(0,12) + '...' + slug.slice(-6) + '</span>' +
        '<h2>' + page.title + '</h2>' +
        '<p class="muted">' + page.description + '</p>' +
        '<div class="trx-row">' +
          '<div class="trx-box">' +
            '<span class="trx-label">مبلغ TRX</span>' +
            '<span class="trx-val">' + amount + '<b>TRX</b></span>' +
          '</div>' +
          '<div class="trx-box">' +
            '<span class="trx-label">تعداد تراکنش</span>' +
            '<span class="trx-val">' + count + '<b>عدد</b></span>' +
          '</div>' +
        '</div>' +
        '<div class="btn-row">' +
          '<button class="btn btn-primary" onclick="copyText(\'' + url + '\')">کپی لینک</button>' +
          '<a class="btn btn-ghost" href="/">خانه</a>' +
        '</div>' +
      '</div>' +
    '</div>';
}

function renderLogin() {
  app.innerHTML =
    '<div class="page-center">' +
      '<div class="glass-card text-center" style="max-width:400px">' +
        '<img class="hero-logo" src="https://tronscan.org/favicon.png?v=2" alt="TRONSCAN">' +
        '<h2>ورود ادمین</h2>' +
        '<p class="muted" style="margin-bottom:24px">رمز داخل pages.js قابل تغییر است.</p>' +
        '<input id="pw" type="password" class="input" placeholder="رمز ادمین">' +
        '<button class="btn btn-primary full" onclick="login(document.getElementById(\'pw\').value)">ورود</button>' +
        '<a class="link-muted" href="/">بازگشت</a>' +
      '</div>' +
    '</div>';
  document.getElementById("pw").addEventListener("keydown", function(e) {
    if (e.key === "Enter") login(this.value);
  });
}

function buildRedirectList() {
  var allR   = allRedirects();
  var savedR = getSavedRedirects();
  var keys   = Object.keys(allR);
  if (keys.length === 0) {
    return '<p class="muted text-center" style="padding:20px">هنوز redirect‌ای ثبت نشده.</p>';
  }
  return keys.map(function(from) {
    var to       = allR[from];
    var isStored = savedR[from];
    var isDefault = redirects[from] && !isStored;
    var badge    = isDefault
      ? '<span class="tag-blue">پیش‌فرض (pages.js)</span>'
      : '<span class="tag-green">localStorage</span>';
    var deleteBtn = isStored
      ? '<button class="btn-sm btn-sm-red" onclick="removeRedirect(\'' + from + '\')">حذف</button>'
      : '<span class="muted" style="font-size:11px">حذف از pages.js</span>';
    return (
      '<div class="list-item">' +
        '<div class="list-info">' +
          '<div class="redirect-arrow">' +
            '<span class="tag-red mono">' + from + '</span>' +
            '<span class="arrow">→</span>' +
            '<span class="mono muted" style="word-break:break-all">' + to + '</span>' +
          '</div>' +
          '<span class="muted" style="font-size:11px">' + makeRedirectUrl(from) + '</span>' +
          badge +
        '</div>' +
        '<div class="list-actions">' +
          '<button class="btn-sm" onclick="copyText(\'' + makeRedirectUrl(from) + '\')">کپی لینک</button>' +
          '<button class="btn-sm" onclick="showRedirectCode(\'' + from + '\', \'' + to.replace(/'/g, "\\'") + '\')">کد دائمی</button>' +
          deleteBtn +
        '</div>' +
      '</div>'
    );
  }).join("");
}

function buildPageList() {
  var allP = allPages();
  return Object.keys(allP).map(function(slug) {
    var p    = allP[slug];
    var url  = makeUrl(slug);
    var del  = pages[slug] ? "" : '<button class="btn-sm btn-sm-red" onclick="removePage(\'' + slug + '\')">حذف</button>';
    return (
      '<div class="list-item">' +
        '<div class="list-info">' +
          '<b>' + p.title + '</b>' +
          '<span class="tag-green">💰 ' + (p.amount||0).toLocaleString() + ' TRX · 🔁 ' + (p.count||1) + ' تراکنش</span>' +
          '<span class="mono muted">' + url + '</span>' +
        '</div>' +
        '<div class="list-actions">' +
          '<button class="btn-sm" onclick="copyText(\'' + url + '\')">کپی</button>' +
          '<a class="btn-sm" href="#/' + siteConfig.routeWord + '/' + slug + '">باز</a>' +
          '<button class="btn-sm" onclick="showCode(\'' + slug + '\')">کد</button>' +
          del +
        '</div>' +
      '</div>'
    );
  }).join("");
}

function renderAdmin() {
  app.innerHTML =
    '<div class="admin-wrap">' +
      '<div class="admin-header">' +
        '<div>' +
          '<span class="chip">Admin Panel</span>' +
          '<h1>مدیریت TRONSCAN</h1>' +
          '<p class="muted">لینک‌های تراکنش و Redirect بساز و مدیریت کن.</p>' +
        '</div>' +
        '<button class="btn btn-ghost" onclick="logout()">خروج</button>' +
      '</div>' +

      '<div class="tabs">' +
        '<button class="tab active" id="tab-btn-transactions" onclick="switchTab(\'transactions\')">تراکنش‌ها</button>' +
        '<button class="tab" id="tab-btn-redirects" onclick="switchTab(\'redirects\')">Redirect Manager</button>' +
      '</div>' +

      '<div id="tab-transactions">' +
        '<div class="grid-2">' +
          '<div class="glass-card">' +
            '<h3>ساخت لینک تراکنش</h3>' +
            '<label>هش تراکنش (TX Hash)</label>' +
            '<input id="slug" class="input" placeholder="b7e9c4d12a6f83...">' +
            '<label>عنوان</label>' +
            '<input id="title" class="input" placeholder="TRONSCAN | TRON BlockChain Explorer">' +
            '<label>توضیحات</label>' +
            '<textarea id="desc" class="input" placeholder="توضیح کوتاه تراکنش"></textarea>' +
            '<div class="grid-2-small">' +
              '<div><label>مبلغ TRX</label><input id="amount" type="number" class="input" placeholder="1000" min="0"></div>' +
              '<div><label>تعداد تراکنش</label><input id="count" type="number" class="input" placeholder="1" min="1"></div>' +
            '</div>' +
            '<button class="btn btn-primary full" onclick="createPage()">ساخت لینک ✓</button>' +
            '<div class="hint">فرمت: <b>tronscan.cam/#/transaction/HASH</b></div>' +
          '</div>' +
          '<div class="glass-card">' +
            '<h3>راهنمای سریع</h3>' +
            '<div class="guide-list">' +
              '<div class="guide-item"><span class="guide-icon">🔑</span><div><b>تغییر رمز</b><p>مقدار <code>adminPassword</code> در pages.js</p></div></div>' +
              '<div class="guide-item"><span class="guide-icon">🔗</span><div><b>تغییر routeWord</b><p>مقدار <code>routeWord</code> در pages.js</p></div></div>' +
              '<div class="guide-item"><span class="guide-icon">🖼️</span><div><b>پریویو تلگرام</b><p>بخش <code>preview</code> در pages.js</p></div></div>' +
              '<div class="guide-item"><span class="guide-icon">↪️</span><div><b>Redirect دائمی</b><p>دکمه «کد دائمی» را بزن و در هر دو فایل paste کن</p></div></div>' +
            '</div>' +
          '</div>' +
        '</div>' +
        '<div class="glass-card" style="margin-top:20px">' +
          '<h3>لینک‌های ساخته‌شده</h3>' +
          '<div class="list" id="pages-list">' + buildPageList() + '</div>' +
        '</div>' +
        '<div id="codeBox" class="glass-card hidden" style="margin-top:20px"></div>' +
      '</div>' +

      '<div id="tab-redirects" class="hidden">' +
        '<div class="grid-2">' +
          '<div class="glass-card">' +
            '<h3>ساخت Redirect جدید</h3>' +
            '<label>From (مسیر داخلی)</label>' +
            '<input id="r-from" class="input" placeholder="/pay">' +
            '<div class="hint" style="margin-bottom:14px">باید با / شروع شود. مثال: /pay &nbsp; /gift &nbsp; /go/game1</div>' +
            '<label>To (مقصد کامل)</label>' +
            '<input id="r-to" class="input" placeholder="https://tronscan.org/#/transaction/HASH">' +
            '<div class="hint" style="margin-bottom:14px">هر لینک کامل، حتی با # هم قبوله.</div>' +
            '<button class="btn btn-primary full" onclick="createRedirect()">ذخیره Redirect ✓</button>' +
          '</div>' +
          '<div class="glass-card">' +
            '<h3>نحوه کار</h3>' +
            '<div class="guide-list">' +
              '<div class="guide-item"><span class="guide-icon">⚡</span><div><b>فوری و بدون backend</b><p>اسکریپت inline داخل head قبل از لود هر چیزی redirect را انجام می‌دهد.</p></div></div>' +
              '<div class="guide-item"><span class="guide-icon">💾</span><div><b>localStorage</b><p>redirectهایی که اینجا می‌سازی فقط روی همین مرورگر کار می‌کنند.</p></div></div>' +
              '<div class="guide-item"><span class="guide-icon">📌</span><div><b>دائمی کردن</b><p>دکمه «کد دائمی» را بزن، کد هر فایل را جداگانه کپی و paste کن.</p></div></div>' +
            '</div>' +
          '</div>' +
        '</div>' +
        '<div class="glass-card" style="margin-top:20px">' +
          '<h3>لیست Redirectها</h3>' +
          '<div class="list" id="redirects-list">' + buildRedirectList() + '</div>' +
        '</div>' +
        '<div id="redirectCodeBox" class="glass-card hidden" style="margin-top:20px"></div>' +
      '</div>' +
    '</div>';
}

function switchTab(name) {
  document.getElementById("tab-transactions").classList.toggle("hidden", name !== "transactions");
  document.getElementById("tab-redirects").classList.toggle("hidden", name !== "redirects");
  document.getElementById("tab-btn-transactions").classList.toggle("active", name === "transactions");
  document.getElementById("tab-btn-redirects").classList.toggle("active", name === "redirects");
}

function createPage() {
  var slug   = document.getElementById("slug").value.trim();
  var title  = document.getElementById("title").value.trim();
  var desc   = document.getElementById("desc").value.trim();
  var amount = parseFloat(document.getElementById("amount").value) || 0;
  var count  = parseInt(document.getElementById("count").value) || 1;
  if (!slug || !title || !desc) { toast("همه فیلدها را پر کن"); return; }
  saveCustomPage(slug, { title: title, description: desc, amount: amount, count: count });
  renderAdmin();
  toast("لینک ساخته شد ✓");
}

function removePage(slug) {
  if (confirm("حذف شود؟")) { deleteCustomPage(slug); renderAdmin(); }
}

function showCode(slug) {
  var p = allPages()[slug];
  var code = '"' + slug + '": {\n    title: "' + p.title + '",\n    description: "' + p.description + '",\n    amount: ' + (p.amount||0) + ',\n    count: ' + (p.count||1) + '\n  }';
  var box = document.getElementById("codeBox");
  box.classList.remove("hidden");
  box.innerHTML =
    '<h3>کد آماده برای pages.js</h3>' +
    '<p class="muted" style="margin-bottom:12px;font-size:13px">داخل آبجکت <code>const pages</code> در فایل pages.js اضافه کن:</p>' +
    '<pre class="code-pre">' + code + '</pre>' +
    '<button class="btn btn-primary" onclick="copyText(' + JSON.stringify(code) + ');toast(\'کپی شد ✓\')">کپی کد</button>';
  box.scrollIntoView({ behavior: "smooth" });
}

function createRedirect() {
  var from = document.getElementById("r-from").value.trim();
  var to   = document.getElementById("r-to").value.trim();
  if (!from || !to) { toast("هر دو فیلد را پر کن"); return; }
  if (!from.startsWith("/")) from = "/" + from;
  if (!to.startsWith("http")) { toast("مقصد باید با http شروع شود"); return; }
  // sanitize: remove single quotes to prevent onclick breakage
  from = from.replace(/'/g, "");
  to   = to.replace(/'/g, "");
  saveRedirect(from, to);
  renderAdmin();
  switchTab("redirects");
  toast("Redirect ذخیره شد ✓");
  setTimeout(function() { showRedirectCode(from, to); }, 100);
}

function removeRedirect(from) {
  if (confirm("این redirect حذف شود؟")) { deleteRedirect(from); renderAdmin(); }
}

function showRedirectCode(from, to) {
  var pagesCode  = '  "' + from + '": "' + to + '"';
  var inlineCode = '        "' + from + '": "' + to + '"';
  var box = document.getElementById("redirectCodeBox");
  if (!box) return;
  box.classList.remove("hidden");
  box.innerHTML =
    '<h3>کد دائمی Redirect</h3>' +
    '<p class="muted" style="margin-bottom:20px;font-size:13px">دو مرحله — هر کدام را جداگانه کپی و paste کن:</p>' +
    '<div class="code-step">' +
      '<span class="code-step-label">① فایل <code>pages.js</code> — داخل آبجکت <code>redirects</code> اضافه کن</span>' +
      '<pre class="code-pre">' + pagesCode + '</pre>' +
      '<button class="btn btn-primary" onclick="copyText(' + JSON.stringify(pagesCode) + ');toast(\'کد pages.js کپی شد ✓\')">کپی — برای pages.js</button>' +
    '</div>' +
    '<div class="code-step" style="margin-top:16px">' +
      '<span class="code-step-label">② فایل <code>index.html</code> — داخل آبجکت <code>var defaults</code> اضافه کن</span>' +
      '<pre class="code-pre">' + inlineCode + '</pre>' +
      '<button class="btn btn-primary" onclick="copyText(' + JSON.stringify(inlineCode) + ');toast(\'کد index.html کپی شد ✓\')">کپی — برای index.html</button>' +
    '</div>';
  box.scrollIntoView({ behavior: "smooth" });
}

function route() {
  var hash   = window.location.hash;
  var prefix = "#/" + siteConfig.routeWord + "/";
  if (hash === "#/admin") {
    isLoggedIn() ? renderAdmin() : renderLogin();
    return;
  }
  if (hash.startsWith(prefix)) {
    renderRoutePage(decodeURIComponent(hash.replace(prefix, "")));
    return;
  }
  renderLanding();
}

window.addEventListener("hashchange", route);
route();
