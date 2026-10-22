``
`javascript
const API_URL = "YOUR_API_GATEWAY_URL";

const form = document.getElementById("translatorForm");
const statusBox = document.getElementById("status");
const resultSection = document.getElementById("resultSection");
const translatedText = document.getElementById("translatedText");
const translateButton = document.getElementById("translateButton");

form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const file = document.getElementById("document").files[0];
    const sourceLanguage =
        document.getElementById("sourceLanguage").value;
    const targetLanguage =
        document.getElementById("targetLanguage").value;

    if (!file) {
        statusBox.textContent = "Please select a document.";
        return;
    }

    if (file.size > 100 * 1024) {
        statusBox.textContent =
            "Please upload a text file smaller than 100 KB.";
        return;
    }

    if (sourceLanguage === targetLanguage) {
        statusBox.textContent =
            "Please select different source and target languages.";
        return;
    }

    if (!API_URL.startsWith("https://")) {
        statusBox.textContent =
            "Configure your AWS API Gateway URL first.";
        return;
    }

    try {
        translateButton.disabled = true;
        statusBox.textContent = "Translating document...";
        resultSection.hidden = true;

        const content = await file.text();

        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                text: content,
                source_language: sourceLanguage,
                target_language: targetLanguage
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Translation failed.");
        }

        translatedText.value = data.translated_text;
        resultSection.hidden = false;
        statusBox.textContent = "Translation completed successfully!";

    } catch (error) {
        statusBox.textContent = error.message;
    } finally {
        translateButton.disabled = false;
    }
});

document.getElementById("downloadButton").addEventListener(
    "click", function () {
        const blob = new Blob(
            [translatedText.value],
            { type: "text/plain;charset=utf-8" }
        );

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.href = url;
        link.download = "translated_document.txt";
        link.click();

        URL.revokeObjectURL(url);
    }
);
`
``