const app = document.getElementById("app");
const storageKey = "tronscan_custom_pages";

function getSavedPages() {
  try {
    return JSON.parse(localStorage.getItem(storageKey)) || {};
  } catch {
    return {};
  }
}

function saveCustomPage(slug, page) {
  const saved = getSavedPages();
  saved[slug] = page;
  localStorage.setItem(storageKey, JSON.stringify(saved, null, 2));
}

function deleteCustomPage(slug) {
  const saved = getSavedPages();
  delete saved[slug];
  localStorage.setItem(storageKey, JSON.stringify(saved, null, 2));
}

function allPages() {
  return { ...pages, ...getSavedPages() };
}

function makeUrl(slug) {
  return `${window.location.origin}/#/${siteConfig.routeWord}/${encodeURIComponent(slug)}`;
}

function copyText(text) {
  navigator.clipboard.writeText(text);
  alert("کپی شد ✓");
}

function pageToJsBlock(slug, page) {
  return `"${slug}": {
    title: "${page.title.replaceAll('"', '\\"')}",
    description: "${page.description.replaceAll('"', '\\"')}",
    amount: ${page.amount || 0},
    count: ${page.count || 1}
  }`;
}

function renderLanding() {
  app.innerHTML = `
    <section class="hero">
      <div class="hero-card">
        <div class="badge">${siteConfig.landing.badge}</div>
        <img class="logo" src="https://tronscan.org/favicon.png?v=2" alt="TRONSCAN">
        <h1>${siteConfig.landing.title}</h1>
        <p>${siteConfig.landing.subtitle}</p>
        <div class="actions">
          <a class="btn primary" href="#/admin">ورود به پنل ادمین</a>
          <a class="btn" href="#/${siteConfig.routeWord}/b7e9c4d12a6f83e0d5b91c7a4f0e6d2398c15ab63fe70d42c9b8a1e35f6d0c94">نمونه لینک</a>
        </div>
      </div>
    </section>
  `;
}

function renderRoutePage(slug) {
  const page = allPages()[slug];

  if (!page) {
    app.innerHTML = `
      <section class="simple-page">
        <div class="panel">
          <h1>تراکنش پیدا نشد</h1>
          <p>این هش تراکنش در سیستم ثبت نشده است.</p>
          <a class="btn primary" href="/">بازگشت به خانه</a>
        </div>
      </section>
    `;
    return;
  }

  app.innerHTML = `
    <section class="simple-page">
      <div class="panel">
        <div class="badge">Transaction / ${slug.substring(0, 16)}...</div>
        <h1>${page.title}</h1>
        <p>${page.description}</p>

        <div class="trx-info">
          <div class="trx-field">
            <span class="trx-label">مبلغ TRX</span>
            <span class="trx-value">${(page.amount || 0).toLocaleString()} <b>TRX</b></span>
          </div>
          <div class="trx-field">
            <span class="trx-label">تعداد تراکنش</span>
            <span class="trx-value">${page.count || 1} <b>عدد</b></span>
          </div>
        </div>

        <div class="actions">
          <button class="btn primary" onclick="copyText('${makeUrl(slug)}')">کپی لینک</button>
          <a class="btn" href="/">خانه</a>
        </div>
      </div>
    </section>
  `;
}

function isLoggedIn() {
  return localStorage.getItem("tronscan_admin_logged_in") === "yes";
}

function login(password) {
  if (password === siteConfig.adminPassword) {
    localStorage.setItem("tronscan_admin_logged_in", "yes");
    renderAdmin();
  } else {
    alert("رمز اشتباه است");
  }
}

function logout() {
  localStorage.removeItem("tronscan_admin_logged_in");
  route();
}

function renderLogin() {
  app.innerHTML = `
    <section class="simple-page">
      <div class="panel small">
        <img class="logo" src="https://tronscan.org/favicon.png?v=2" alt="TRONSCAN">
        <h1>ورود ادمین</h1>
        <p>رمز پیش‌فرض داخل pages.js قابل تغییر است.</p>
        <input id="password" type="password" placeholder="رمز ادمین">
        <button class="btn primary full" onclick="login(document.getElementById('password').value)">ورود</button>
        <a class="muted-link" href="/">بازگشت</a>
      </div>
    </section>
  `;
}

function renderAdmin() {
  const data = allPages();
  const slugs = Object.keys(data);

  app.innerHTML = `
    <section class="admin">
      <div class="admin-header">
        <div>
          <div class="badge">Admin Panel</div>
          <h1>مدیریت لینک‌های تراکنش TRX</h1>
          <p>لینک تراکنش بساز، مبلغ و تعداد تعیین کن، کپی کن یا کد آماده‌اش را ذخیره کن.</p>
        </div>
        <button class="btn" onclick="logout()">خروج</button>
      </div>

      <div class="grid">
        <div class="panel">
          <h2>ساخت لینک تراکنش جدید</h2>

          <label>هش تراکنش (TX Hash)</label>
          <input id="slug" placeholder="مثلاً b7e9c4d12a6f83...">

          <label>عنوان</label>
          <input id="title" placeholder="مثلاً TRONSCAN | TRON BlockChain Explorer">

          <label>توضیحات</label>
          <textarea id="description" placeholder="توضیح کوتاه تراکنش"></textarea>

          <label>مبلغ TRX</label>
          <input id="amount" type="number" placeholder="مثلاً 1000" min="0">

          <label>تعداد تراکنش</label>
          <input id="count" type="number" placeholder="مثلاً 5" min="1">

          <button class="btn primary full" onclick="createPage()">ساخت لینک تراکنش</button>

          <div class="hint">
            فرمت لینک: <b>tronscan.cam/#/transaction/HASH</b>
          </div>
        </div>

        <div class="panel">
          <h2>راهنمای تنظیمات</h2>
          <p><b>تغییر routeWord:</b> داخل <code>pages.js</code> مقدار <code>routeWord</code> را تغییر بده.</p>
          <p><b>تغییر رمز ادمین:</b> داخل <code>pages.js</code> مقدار <code>adminPassword</code> را تغییر بده.</p>
          <p><b>پریویو تلگرام:</b> داخل <code>pages.js</code> بخش <code>preview</code> را ویرایش کن.</p>
          <p><b>عکس پریویو:</b> مقدار <code>preview.image</code> را در <code>pages.js</code> تغییر بده.</p>
          <p><b>لوگوی مرورگر:</b> فایل <code>favicon.png</code> را عوض کن.</p>
        </div>
      </div>

      <div class="panel links-panel">
        <h2>لینک‌های ساخته‌شده</h2>
        <div class="links">
          ${slugs.map(slug => `
            <div class="link-card">
              <div>
                <b>${data[slug].title}</b>
                <span class="trx-meta">💰 ${(data[slug].amount || 0).toLocaleString()} TRX &nbsp;|&nbsp; 🔁 ${data[slug].count || 1} تراکنش</span>
                <span>${makeUrl(slug)}</span>
              </div>
              <div class="mini-actions">
                <button onclick="copyText('${makeUrl(slug)}')">کپی لینک</button>
                <a href="#/${siteConfig.routeWord}/${slug}">باز کردن</a>
                <button onclick="showCode('${slug}')">کد pages.js</button>
                ${pages[slug] ? "" : `<button onclick="removePage('${slug}')">حذف</button>`}
              </div>
            </div>
          `).join("")}
        </div>
      </div>

      <div id="codeBox" class="panel code-box hidden"></div>
    </section>
  `;
}

function createPage() {
  const slug = document.getElementById("slug").value.trim();
  const title = document.getElementById("title").value.trim();
  const description = document.getElementById("description").value.trim();
  const amount = parseFloat(document.getElementById("amount").value) || 0;
  const count = parseInt(document.getElementById("count").value) || 1;

  if (!slug || !title || !description) {
    alert("لطفاً هش، عنوان و توضیحات را پر کن");
    return;
  }

  saveCustomPage(slug, { title, description, amount, count });
  renderAdmin();
}

function removePage(slug) {
  if (confirm("این تراکنش حذف شود؟")) {
    deleteCustomPage(slug);
    renderAdmin();
  }
}

function showCode(slug) {
  const page = allPages()[slug];
  const code = pageToJsBlock(slug, page);
  const box = document.getElementById("codeBox");
  box.classList.remove("hidden");
  box.innerHTML = `
    <h2>کد آماده برای pages.js</h2>
    <p>این کد را داخل <code>const pages</code> در فایل pages.js کپی کن تا دائمی بشه:</p>
    <pre>${code}</pre>
    <button class="btn primary" onclick='copyText(${JSON.stringify(code)})'>کپی کد</button>
  `;
  box.scrollIntoView({ behavior: "smooth" });
}

function route() {
  const hash = window.location.hash;

  if (hash === "#/admin") {
    if (isLoggedIn()) renderAdmin();
    else renderLogin();
    return;
  }

  const prefix = `#/${siteConfig.routeWord}/`;

  if (hash.startsWith(prefix)) {
    const slug = decodeURIComponent(hash.replace(prefix, ""));
    renderRoutePage(slug);
    return;
  }

  renderLanding();
}

window.addEventListener("hashchange", route);
route();
