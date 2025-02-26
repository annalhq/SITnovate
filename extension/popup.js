document.addEventListener('DOMContentLoaded', function() {
    const textInput = document.getElementById('textInput');
    const resultElement = document.getElementById('result');
    const button = document.querySelector('button');

    async function checkSpam() {
        const text = textInput.value;
        
        if (!text.trim()) return;

        button.disabled = true;
        button.classList.add('opacity-50', 'cursor-not-allowed');
        resultElement.textContent = "Checking...";
        resultElement.className = "text-center text-lg font-medium text-gray-600";

        try {
            const response = await fetch("http://127.0.0.1:8080/predict", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text })
            });
            
            const data = await response.json();
            const isSpam = data.prediction;
            
            resultElement.textContent = isSpam ? "Spam Detected!" : "Not Spam";
            resultElement.className = `text-center text-lg font-medium ${isSpam ? 'text-red-600' : 'text-green-600'}`;
        } catch (error) {
            resultElement.textContent = "Error checking text";
            resultElement.className = "text-center text-lg font-medium text-red-600";
        } finally {
            button.disabled = false;
            button.classList.remove('opacity-50', 'cursor-not-allowed');
        }
    }

    document.querySelector('button').addEventListener('click', checkSpam);
});
