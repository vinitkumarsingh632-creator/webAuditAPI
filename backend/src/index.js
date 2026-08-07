import dns from "node:dns";

dns.setDefaultResultOrder("ipv4first");
import puppeteer from "puppeteer";

const browser = await puppeteer.launch({
  headless: true,
  args: [
    "--remote-debugging-port=0",
    "--no-sandbox",
    "--disable-setuid-sandbox",
    "--ignore-certificate-errors",
  ],
});

const page = await browser.newPage();

try {
 const response = await page.goto("https://www.hostinger.com");;

  console.log("Status:", response?.status());
  console.log("Final URL:", page.url());
  console.log("Title:", await page.title());

} catch (err) {
  console.error(err);
}

await browser.close();