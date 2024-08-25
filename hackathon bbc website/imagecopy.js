// Function to hide the input and button elements after content generation
function hideGenerators() {
    document.getElementById('generateImageButton').style.display = 'none';
    document.getElementById('imagePromptInput').style.display = 'none';
}

document.addEventListener('DOMContentLoaded', async function() {
    const promptInput = document.getElementById('imagePromptInput');
    const generateButton = document.getElementById('generateImageButton');

    // Check if there is a stored prompt in localStorage
    const storedPrompt = localStorage.getItem('imagePrompt');
    if (storedPrompt) {
        // Populate the prompt input field
        promptInput.value = storedPrompt;

        // Clear the stored prompt from localStorage
        localStorage.removeItem('imagePrompt');

        // Automatically click the generate button to create the image
        generateButton.click();
    }
});

// Event listener for the image generation button
document.getElementById('generateImageButton').addEventListener('click', async function() {
    const prompt = document.getElementById('imagePromptInput').value.trim();
    if (prompt) {
        try {
            // Call the function to generate the image
            await generateImage(prompt);

            // Hide the generators after the image is generated
            hideGenerators();

        } catch (error) {
            console.error('Error generating image:', error);
            alert('Failed to generate image. Please try again.');
        }
    } else {
        alert('Please enter a prompt!');
    }
});

// Function to generate an image and update the container
async function generateImage(prompt) {
    const apiKey = '#'; // Replace with your actual API key
    const imageContainer = document.getElementById('generatedImageContainer');
    imageContainer.innerHTML = ''; // Clear any existing content

    try {
        const response = await fetch('https://api.openai.com/v1/images/generations', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                prompt: prompt,
                n: 1,
                size: '512x512'
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`API Error: ${errorData.error.message}`);
        }

        const data = await response.json();
        const img = document.createElement('img');
        img.src = data.data[0].url;
        img.alt = prompt;
        img.classList.add('generated-image'); // Add CSS class for styling
        imageContainer.appendChild(img);
    } catch (error) {
        console.error('Fetch Error:', error);
        alert('Failed to generate image. Please check the console for more details.');
    }
}





