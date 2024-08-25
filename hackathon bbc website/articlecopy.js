// Function to hide the input and button elements after content generation
function hideGenerators() {
    document.getElementById('generateArticleButton').style.display = 'none';
    document.getElementById('promptInput').style.display = 'none'; // Updated id to match input field
}

document.addEventListener('DOMContentLoaded', async function() {
    const promptInput = document.getElementById('promptInput'); // Updated id to match input field
    const generateButton = document.getElementById('generateArticleButton');

    // Check if there is a stored prompt in localStorage
    const storedPrompt = localStorage.getItem('articlePrompt');
    if (storedPrompt) {
        // Populate the prompt input field
        promptInput.value = storedPrompt;

        // Clear the stored prompt from localStorage
        localStorage.removeItem('articlePrompt');

        // Automatically click the generate button to create the article
        generateButton.click();
    }
});

// Event listener for generating article
document.getElementById('generateArticleButton').addEventListener('click', async function() {
    const prompt = document.getElementById('promptInput').value.trim(); // Updated id to match input field
    if (prompt) {
        try {
            const generatedArticle = await getAIResponse(prompt);

            // Process the generated article
            let [title, ...contentParts] = generatedArticle.split('\n\n'); // Assuming the title is on the first line
            const cleanedTitle = title.replace(/^Title:\s*/, ''); // Remove "Title:" if it exists

            // Remove "Introduction" and "Conclusion" headers if they exist
            const cleanedContentParts = contentParts.map(part => 
                part.replace(/^Introduction\s*$/i, '').replace(/^Conclusion\s*$/i, '')
            );

            const articleHtml = `
                <h2 class="article-title"><strong>${cleanedTitle.trim()}</strong></h2>
                <p class="article-content">${cleanedContentParts.join('</p><p class="article-content">').replace(/\n\n+/g, '')}</p>
            `;

            // Set the content to the correct element
            document.getElementById('generatedArticleOutput').innerHTML = articleHtml;

            // Hide the generators after the article is generated
            hideGenerators();

        } catch (error) {
            console.error('Error generating article:', error);
            alert('Failed to generate article. Please try again.');
        }
    } else {
        alert('Please enter a prompt!');
    }
});

// Function to get AI response for the article
async function getAIResponse(prompt) {
    const apiKey = '#'; // Replace with your actual API key
    const apiUrl = 'https://api.openai.com/v1/chat/completions';

    let fullResponse = '';
    let continuationPrompt = prompt;
    const maxTokens = 2000;

    while (continuationPrompt.length > 0) {
        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: 'gpt-4',
                    messages: [
                        { role: 'user', content: `Write an in-depth article on the following topic: ${continuationPrompt}` }
                    ],
                    max_tokens: maxTokens,
                    temperature: 0.7, // Adjust as necessary
                    top_p: 1,         // Adjust as necessary
                    n: 1              // Number of responses to generate
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`API Error: ${errorData.error.message}`);
            }

            const data = await response.json();
            const newContent = data.choices[0].message.content.trim();
            fullResponse += newContent + ' '; // Concatenate responses

            // Determine if more content is needed
            if (newContent.length === 0 || fullResponse.length >= maxTokens) {
                continuationPrompt = ''; // Stop if no content is returned or if max tokens are reached
            } else {
                // Adjust prompt to request more content if necessary
                continuationPrompt = `Continue from: ${newContent}`;
            }

        } catch (error) {
            console.error('Fetch Error:', error);
            throw new Error('Failed to fetch article. Check console for details.');
        }
    }

    return fullResponse.trim();
}





















