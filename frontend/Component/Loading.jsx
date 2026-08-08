
export default async function FetchData(url) {
  const analysisRequest = fetch(
    "https://webauditapi.onrender.com/ui/analyze",
    {
      method: "POST",
      body: JSON.stringify({ url }),
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    }
  ).then(async (response) => {
    const jsonData = await response.json();

    if (!response.ok) {
      throw new Error(jsonData.message || "Analysis failed");
    }

    return jsonData;
  });

  const timeout = new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error("Analysis timed out after 60 seconds"));
    }, 60000);
  });

  try {
    const jsonData = await Promise.race([
      analysisRequest,
      timeout,
    ]);

    if (jsonData.fetchError) {
      alert("Invalid URL");
      return;
    }

    if (jsonData.lighthouseError) {
      alert(jsonData.message || "Lighthouse failed");
      return;
    }

    setData(jsonData);

  } catch (err) {
    console.error(err);

    alert(
      err.message === "Analysis timed out after 60 seconds"
        ? "Analysis is taking too long. Please try again."
        : "Error connecting to WebAudit API."
    );

  } finally {
    setLoading(false);
  }
}