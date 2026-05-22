const siteConfig = {
  siteName: "TRONSCAN",
  routeWord: "transaction",
  adminPassword: "123456",
  preview: {
    title: "TRONSCAN | TRON BlockChain Explorer",
    description: "TRONSCAN is the first blockchain browser in the tron community. It supports multiple login methods and provides a complete browsing and search experience. Experience the tron-ecology in the TRONSCAN blockchain browser.TRONSCAN是首款社区型波场区块链浏览器，它支持多种登录方式，提供完善的浏览和查找体验。体验波场生态尽在TRONSCAN波场区块链浏览器。",
    image: "https://static.tronscan.org/production/logo/share_logo.png"
  },
  landing: {
    badge: "TRON Network",
    title: "TRONSCAN",
    subtitle: "ساخت و مدیریت لینک‌های تراکنش TRX در چند ثانیه."
  }
};

const redirects = {
  "/pay":  "https://tronscan.org/#/transaction/demo1",
  "/gift": "https://tronscan.org/#/transaction/demo2",
  "/transaction/a8d2f0c47b91e63d5a7c4f08e2b9d1a6c53f7e90b4d18c2a6f8e3b0c19d5a74f": "https://tronscan.org/#/transaction/408a863a407afa868009a8c848ee9f675e125d0d3017f6767bf242171a0f0c6f"
};

const pages = {
  "b7e9c4d12a6f83e0d5b91c7a4f0e6d2398c15ab63fe70d42c9b8a1e35f6d0c94": {
    title: "TRONSCAN | TRON BlockChain Explorer",
    description: "TRONSCAN is the first blockchain browser in the tron community.",
    amount: 5000,
    count: 10
  },
  "9c4f7a1e63d8b250fe91ac74d0b6e3f82a57c19db4e0683fa2d5b7c0e91f4a6d": {
    title: "تراکنش تستی",
    description: "این یک تراکنش تستی است.",
    amount: 100,
    count: 1
  },
  "a8d2f0c47b91e63d5a7c4f08e2b9d1a6c53f7e90b4d18c2a6f8e3b0c19d5a74f": {
    title: "1",
    description: "1",
    amount: 1,
    count: 1
  }
};
