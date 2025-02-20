document.addEventListener('DOMContentLoaded', function () {
    const checkButton = document.getElementById('checkButton');
    checkButton.addEventListener('click', checkSpam);
});

async function checkSpam() {
    const text = document.getElementById("textInput").value;
    const resultElement = document.getElementById("result");
    const button = document.getElementById('checkButton');

    if (!text.trim()) {
        resultElement.textContent = "Please enter some text";
        resultElement.className = "result text-gray-600";
        return;
    }

    // Update UI for loading state
    button.disabled = true;
    resultElement.textContent = "Checking...";
    resultElement.className = "result text-gray-600";

    try {
        // For Chrome extensions, we need to use the correct permissions and avoid CORS issues
        const response = await fetch("http://127.0.0.1:8080/predict", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text })
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        const isSpam = data.prediction;

        resultElement.textContent = isSpam ? "Spam Detected!" : "Not Spam";
        resultElement.className = `result ${isSpam ? 'text-red-600' : 'text-green-600'}`;
    } catch (error) {
        console.error("Error:", error);
        resultElement.textContent = "Connection Error: Ensure the server is running at 127.0.0.1:8080";
        resultElement.className = "result text-red-600";
    } finally {
        button.disabled = false;
    }
}
