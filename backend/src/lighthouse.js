import { performance } from "node:perf_hooks";

export default async function Lighthouse(url) {
    let response;
    let latency;

   

    try {
        console.log("1. Starting website fetch:", url);

const start = performance.now();

response = await fetch(url);

console.log(
  "2. Website fetch finished:",
  ((performance.now() - start) / 1000).toFixed(2),
  "seconds"
);


        const end = performance.now();

        latency = end - start;

        if (!response.ok) {
            return {
                fetchError: response.status,
                message: response.statusText
            };
        }

    } catch (err) {
        console.error("FETCH ERROR:", err);

        return {
            fetchError: true,
            message: "Invalid URL or website is unreachable."
        };
    }


    

    try {
        const apiKey = process.env.PAGESPEED_API_KEY;

        if (!apiKey) {
            return {
                lighthouseError: true,
                message: "PAGESPEED_API_KEY is not configured."
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

const pageSpeedResponse = await fetch(
  `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?${params.toString()}`
);

console.log(
  "4. PageSpeed finished:",
  ((performance.now() - pageSpeedStart) / 1000).toFixed(2),
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
                message:
                    "PageSpeed API request failed."
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
                    "Lighthouse result was not returned."
            };
        }


       

        if (result.runtimeError) {
            return {
                lighthouseError: true,
                message:
                    result.runtimeError.message ||
                    "Lighthouse failed to analyze the website."
            };
        }


        const audits = result.audits;


       

        const performanceCategory =
            result.categories.performance;


        const improvements =
            performanceCategory.auditRefs
                .map(ref => ({
                    ...audits[ref.id],
                    weight: ref.weight
                }))
                .filter(audit =>
                    audit.score !== null &&
                    audit.score !== undefined &&
                    audit.score < 0.9
                )
                .sort(
                    (a, b) =>
                        a.score - b.score
                );


        const badPractices = [];


        for (const i of improvements) {

            if (!i.title) {
                continue;
            }


            badPractices.push({
                title: i.title,

                description:
                    i.description ||
                    i.explanation ||
                    "",

                score: i.score,

                severity:
                    i.score < 0.5
                        ? "severe"
                        : "medium"
            });
        }


        

        return {

            URL: url,

            Timestamp: new Date(),


            Performance: {
                Score:
                    result.categories
                        .performance
                        ?.score ?? null
            },


            SEO: {
                Score:
                    result.categories
                        .seo
                        ?.score ?? null
            },


            Accessibility: {
                Score:
                    result.categories
                        .accessibility
                        ?.score ?? null
            },


            Best_Practices: {
                Score:
                    result.categories[
                        "best-practices"
                    ]?.score ?? null
            },


            CLS: {
                Score:
                    audits[
                        "cumulative-layout-shift"
                    ]?.score ?? null,

                DisplayValue:
                    audits[
                        "cumulative-layout-shift"
                    ]?.displayValue ?? null
            },


            LCP: {
                Score:
                    audits[
                        "largest-contentful-paint"
                    ]?.score ?? null,

                DisplayValue:
                    audits[
                        "largest-contentful-paint"
                    ]?.displayValue ?? null
            },


            FCP: {
                Score:
                    audits[
                        "first-contentful-paint"
                    ]?.score ?? null,

                DisplayValue:
                    audits[
                        "first-contentful-paint"
                    ]?.displayValue ?? null
            },


            SpeedIndex: {
                Score:
                    audits[
                        "speed-index"
                    ]?.score ?? null,

                DisplayValue:
                    audits[
                        "speed-index"
                    ]?.displayValue ?? null
            },


            StatusCode:
                response.status,

            StatusText:
                response.statusText,


            Latency:
                latency.toFixed(2),


            Improvements:
                badPractices,


            Resources:
                audits[
                    "resource-summary"
                ]?.details?.items ?? [],


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
                    )
            }
        };


    } catch (err) {

        console.error(
            "PAGESPEED/LIGHTHOUSE ERROR:",
            err
        );

        return {
            lighthouseError: true,
            message:
                "Failed to analyze the website."
        };
    }
}