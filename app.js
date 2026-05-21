const app = document.getElementById("app");

const storageKey = "amir_custom_pages";

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
  alert("کپی شد");
}

function pageToJsBlock(slug, page) {
  return `"${slug}": {
    title: "${page.title.replaceAll('"', "\\\"")}",
    description: "${page.description.replaceAll('"', "\\\"")}"
  }`;
}

function renderLanding() {
  app.innerHTML = `
    <section class="hero">
      <div class="hero-card">
        <div class="badge">${siteConfig.landing.badge}</div>
        <img class="logo" src="/favicon.png" alt="logo">
        <h1>${siteConfig.landing.title}</h1>
        <p>${siteConfig.landing.subtitle}</p>
        <div class="actions">
          <a class="btn primary" href="#/admin">ورود به پنل ادمین</a>
          <a class="btn" href="#/${siteConfig.routeWord}/Bazi1">نمونه لینک</a>
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
          <h1>صفحه پیدا نشد</h1>
          <p>این لینک هنوز ساخته نشده.</p>
          <a class="btn primary" href="/">بازگشت به خانه</a>
        </div>
      </section>
    `;
    return;
  }

  app.innerHTML = `
    <section class="simple-page">
      <div class="panel">
        <div class="badge">/${siteConfig.routeWord}/${slug}</div>
        <h1>${page.title}</h1>
        <p>${page.description}</p>
        <div class="actions">
          <button class="btn primary" onclick="copyText('${makeUrl(slug)}')">کپی لینک</button>
          <a class="btn" href="/">خانه</a>
        </div>
      </div>
    </section>
  `;
}

function isLoggedIn() {
  return localStorage.getItem("amir_admin_logged_in") === "yes";
}

function login(password) {
  if (password === siteConfig.adminPassword) {
    localStorage.setItem("amir_admin_logged_in", "yes");
    renderAdmin();
  } else {
    alert("رمز اشتباه است");
  }
}

function logout() {
  localStorage.removeItem("amir_admin_logged_in");
  route();
}

function renderLogin() {
  app.innerHTML = `
    <section class="simple-page">
      <div class="panel small">
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
          <h1>مدیریت لینک‌ها</h1>
          <p>لینک بساز، ببین، کپی کن، یا کد آماده‌اش را داخل pages.js بذار.</p>
        </div>
        <button class="btn" onclick="logout()">خروج</button>
      </div>

      <div class="grid">
        <div class="panel">
          <h2>ساخت لینک جدید</h2>

          <label>کلمه لینک</label>
          <input id="slug" placeholder="مثلاً Bazi2 یا Iran">

          <label>عنوان صفحه</label>
          <input id="title" placeholder="مثلاً بازی ۲">

          <label>توضیح صفحه</label>
          <textarea id="description" placeholder="توضیح کوتاه صفحه"></textarea>

          <button class="btn primary full" onclick="createPage()">ساخت لینک</button>

          <div class="hint">
            فرمت لینک فعلی:
            <b>amirhosssein.cam/#/${siteConfig.routeWord}/Name</b>
          </div>
        </div>

        <div class="panel">
          <h2>تنظیمات مهم</h2>
          <p><b>تغییر hello:</b> داخل فایل <code>pages.js</code> مقدار <code>routeWord</code> را تغییر بده.</p>
          <p><b>تغییر رمز ادمین:</b> داخل فایل <code>pages.js</code> مقدار <code>adminPassword</code> را تغییر بده.</p>
          <p><b>پریویو تلگرام:</b> داخل <code>index.html</code> بخش <code>og:title</code> و <code>og:description</code> را تغییر بده.</p>
          <p><b>عکس پریویو:</b> فایل <code>preview.jpg</code> را عوض کن.</p>
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

  if (!slug || !title || !description) {
    alert("همه فیلدها را پر کن");
    return;
  }

  saveCustomPage(slug, { title, description });
  renderAdmin();
}

function removePage(slug) {
  if (confirm("حذف شود؟")) {
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
    <p>برای دائمی شدن این صفحه، این کد را داخل const pages در فایل pages.js کپی کن:</p>
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
