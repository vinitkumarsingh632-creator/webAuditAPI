import lighthouse from "lighthouse";
import puppeteer from "puppeteer";

const browser = await puppeteer.launch({
  headless: true,
  args: ["--remote-debugging-port=0"]
});

const port = Number(new URL(browser.wsEndpoint()).port);

try {
  const result = await lighthouse("https://example.com", {
    port,
  });

  console.log(result.lhr.categories.performance.score);
} finally {
  await browser.close();
}