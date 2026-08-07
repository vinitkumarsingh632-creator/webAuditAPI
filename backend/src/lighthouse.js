import lighthouse from "lighthouse";
import puppeteer from "puppeteer";
import { performance } from "node:perf_hooks";

export default async function Lighthouse(url) {
    let response;
    let latency;

    try {
        const start = performance.now();

        response = await fetch(url);

        const end = performance.now();
        latency = end - start;

        if (!response.ok) {
            return {
                fetchError: response.status,
                message: response.statusText
            };
        }
    } catch (err) {
        console.log(err)
        return {
            fetchError: true,
            message: "Invalid URL or website is unreachable."
        };
    }

    const browser = await puppeteer.launch({
        headless: true,
        args: [
            "--remote-debugging-port=0",
            "--no-sandbox",
            "--disable-setuid-sandbox"
        ]
    });

    const wsEndpoint = browser.wsEndpoint();
    const port = Number(new URL(wsEndpoint).port);

    try {
        const result = await lighthouse(url, { port });

        const improvements = result.lhr.categories.performance.auditRefs
            .map(ref => ({
                ...result.lhr.audits[ref.id],
                weight: ref.weight
            }))
            .filter(audit =>
                audit.score !== null &&
                audit.score < 0.9
            )
            .sort((a, b) => a.score - b.score);

        const badPractices = [];

        for (const i of improvements) {
            if (!i.guidanceLevel) continue;

            badPractices.push({
                title: i.title,
                description: i.description,
                score: i.score,
                severity: i.guidanceLevel >= 3 ? "severe" : "medium"
            });
        }
        console.log(result.lhr.audits["resource-summary"]);
        return {
            URL: url,
            Timestamp: new Date(),

            Performance: {
                Score: result.lhr.categories.performance.score
            },

            SEO: {
                Score: result.lhr.categories.seo.score
            },

            Accessibility: {
                Score: result.lhr.categories.accessibility.score
            },

            Best_Practices: {
                Score: result.lhr.categories["best-practices"].score
            },

            CLS: {
                Score: result.lhr.audits["cumulative-layout-shift"].score,
                DisplayValue:
                    result.lhr.audits["cumulative-layout-shift"].displayValue
            },

            LCP: {
                Score: result.lhr.audits["largest-contentful-paint"].score,
                DisplayValue:
                    result.lhr.audits["largest-contentful-paint"].displayValue
            },

            FCP: {
                Score: result.lhr.audits["first-contentful-paint"].score,
                DisplayValue:
                    result.lhr.audits["first-contentful-paint"].displayValue
            },

            SpeedIndex: {
                Score: result.lhr.audits["speed-index"].score,
                DisplayValue:
                    result.lhr.audits["speed-index"].displayValue
            },

            StatusCode: response.status,
            StatusText: response.statusText,

            Latency: latency,

            Improvements: badPractices,

            Resources:
                result.lhr.audits["resource-summary"].details.items,

            Headers: {
                contentType: response.headers.get("content-type"),
                cacheControl: response.headers.get("cache-control"),
                contentEncoding: response.headers.get("content-encoding"),
                contentLength: response.headers.get("content-length"),
                server: response.headers.get("server")
            }
        };
    } catch (err) {
        console.error(err);

        return {
            lighthouseError: true,
            message: "Failed to analyze the website."
        };
    } finally {
        await browser.close();
    }
}