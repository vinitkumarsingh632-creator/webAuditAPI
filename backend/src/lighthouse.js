import { performance } from "node:perf_hooks";

const PAGE_SPEED_TIMEOUT = 120000;

export default async function Lighthouse(url) {
    let response;
    let latency;

    try {
        console.log("1. Starting website fetch:", url);

        const start = performance.now();

        response = await fetch(url, {
            redirect: "follow",
        });

        const end = performance.now();

        latency = end - start;

        console.log(
            "2. Website fetch finished:",
            (latency / 1000).toFixed(2),
            "seconds"
        );

        if (!response.ok) {
            return {
                fetchError: response.status,
                message: response.statusText,
            };
        }
    } catch (err) {
        console.error("FETCH ERROR:", err);

        return {
            fetchError: true,
            message: "Invalid URL or website is unreachable.",
        };
    }

    try {
        const apiKey = process.env.PAGESPEED_API_KEY;

        if (!apiKey) {
            return {
                lighthouseError: true,
                message: "PAGESPEED_API_KEY is not configured.",
            };
        }

        const params = new URLSearchParams();

        params.set("url", url);
        params.set("key", apiKey);
        params.set("strategy", "desktop");

        params.append("category", "performance");
        params.append("category", "seo");
        params.append("category", "accessibility");
        params.append("category", "best-practices");

        console.log("3. Starting PageSpeed");

        const pageSpeedStart = performance.now();

        const controller = new AbortController();

        const timeout = setTimeout(() => {
            controller.abort();
        }, PAGE_SPEED_TIMEOUT);

        let pageSpeedResponse;

        try {
            pageSpeedResponse = await fetch(
                `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?${params.toString()}`,
                {
                    method: "GET",
                    signal: controller.signal,
                }
            );
        } catch (err) {
            if (err.name === "AbortError") {
                return {
                    lighthouseError: true,
                    message:
                        "PageSpeed analysis timed out after 120 seconds.",
                };
            }

            throw err;
        } finally {
            clearTimeout(timeout);
        }

        const pageSpeedEnd = performance.now();

        const pageSpeedTime =
            pageSpeedEnd - pageSpeedStart;

        console.log(
            "4. PageSpeed finished:",
            (pageSpeedTime / 1000).toFixed(2),
            "seconds"
        );

        if (!pageSpeedResponse.ok) {
            const errorText =
                await pageSpeedResponse.text();

            console.error(
                "PAGESPEED ERROR:",
                errorText
            );

            return {
                lighthouseError: true,
                message: "PageSpeed API request failed.",
            };
        }

        const data =
            await pageSpeedResponse.json();

        const result =
            data.lighthouseResult;

        if (!result) {
            return {
                lighthouseError: true,
                message:
                    "Lighthouse result was not returned.",
            };
        }

        if (result.runtimeError) {
            return {
                lighthouseError: true,
                message:
                    result.runtimeError.message ||
                    "Lighthouse failed to analyze the website.",
            };
        }

        const audits =
            result.audits || {};

        const performanceCategory =
            result.categories?.performance;

        const auditRefs =
            performanceCategory?.auditRefs || [];

        const improvements =
            auditRefs
                .map((ref) => {
                    const audit =
                        audits[ref.id];

                    if (!audit) {
                        return null;
                    }

                    return {
                        ...audit,
                        weight: ref.weight,
                    };
                })
                .filter(
                    (audit) =>
                        audit &&
                        audit.score !== null &&
                        audit.score !== undefined &&
                        audit.score < 0.9
                )
                .sort(
                    (a, b) =>
                        a.score - b.score
                );

        const badPractices = [];

        for (const audit of improvements) {
            if (!audit.title) {
                continue;
            }

            badPractices.push({
                title: audit.title,
                description:
                    audit.description ||
                    audit.explanation ||
                    "",
                score: audit.score,
                severity:
                    audit.score < 0.5
                        ? "severe"
                        : "medium",
            });
        }

        const clsAudit =
            audits["cumulative-layout-shift"];

        const lcpAudit =
            audits["largest-contentful-paint"];

        const fcpAudit =
            audits["first-contentful-paint"];

        const speedIndexAudit =
            audits["speed-index"];

        return {
            URL: url,

            Timestamp: new Date(),

            Performance: {
                Score:
                    result.categories
                        ?.performance
                        ?.score ?? null,
            },

            SEO: {
                Score:
                    result.categories
                        ?.seo
                        ?.score ?? null,
            },

            Accessibility: {
                Score:
                    result.categories
                        ?.accessibility
                        ?.score ?? null,
            },

            Best_Practices: {
                Score:
                    result.categories
                        ?.["best-practices"]
                        ?.score ?? null,
            },

            CLS: {
                Score:
                    clsAudit?.score ?? null,

                DisplayValue:
                    clsAudit?.displayValue ?? null,
            },

            LCP: {
                Score:
                    lcpAudit?.score ?? null,

                DisplayValue:
                    lcpAudit?.displayValue ?? null,
            },

            FCP: {
                Score:
                    fcpAudit?.score ?? null,

                DisplayValue:
                    fcpAudit?.displayValue ?? null,
            },

            SpeedIndex: {
                Score:
                    speedIndexAudit?.score ?? null,

                DisplayValue:
                    speedIndexAudit?.displayValue ?? null,
            },

            StatusCode: response.status,

            StatusText: response.statusText,

            Latency: latency.toFixed(2),

            Improvements: badPractices,

            Resources:
                audits["resource-summary"]
                    ?.details
                    ?.items ?? [],

            Headers: {
                contentType:
                    response.headers.get(
                        "content-type"
                    ),

                cacheControl:
                    response.headers.get(
                        "cache-control"
                    ),

                contentEncoding:
                    response.headers.get(
                        "content-encoding"
                    ),

                contentLength:
                    response.headers.get(
                        "content-length"
                    ),

                server:
                    response.headers.get(
                        "server"
                    ),
            },
        };
    } catch (err) {
        console.error(
            "PAGESPEED/LIGHTHOUSE ERROR:",
            err
        );

        return {
            lighthouseError: true,
            message:
                "Failed to analyze the website.",
        };
    }
}