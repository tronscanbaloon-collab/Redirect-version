/*
  تنظیمات اصلی سایت

  routeWord یعنی کلمه وسط لینک:
  اگر routeWord برابر hello باشد:
  amirhosssein.cam/#/hello/Bazi1

  اگر routeWord را بگذاری game:
  amirhosssein.cam/#/game/Bazi1
*/

const siteConfig = {
  siteName: "امیرحسین",
  routeWord: "hello",
  adminPassword: "123456",

  preview: {
    title: "امیرحسین | Game Site",
    description: "سایت شخصی بازی امیرحسین",
    image: "https://amirhosssein.cam/preview.jpg"
  },

  landing: {
    badge: "Personal Game Hub",
    title: "سایت بازی امیرحسین",
    subtitle: "یک صفحه ساده برای مدیریت و ساخت لینک‌های اختصاصی بازی‌ها و کشورها.",
    buttonText: "ورود به پنل ادمین"
  }
};

/*
  برای ساخت صفحه دائمی، آیتم جدید را اینجا اضافه کن.
  مثال:
  "Iran": {
    title: "ایران",
    description: "صفحه مخصوص ایران"
  }
*/

const pages = {
  "Bazi1": {
    title: "بازی ۱",
    description: "صفحه مخصوص بازی ۱"
  },

  "Iran": {
    title: "ایران",
    description: "صفحه مخصوص ایران"
  },

  "Turkey": {
    title: "ترکیه",
    description: "صفحه مخصوص ترکیه"
  }
};
