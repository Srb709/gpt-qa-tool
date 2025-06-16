// Select UI elements
const submitBtn = document.getElementById("submit-btn");
const userInput = document.getElementById("user-input");
const responseBox = document.getElementById("response-box");

// Set up your OpenAI key (✅ replace this with your actual one)
const OPENAI_API_KEY = "ADD YOUR OPENAI API KEY HERE";

// Set model to GPT-3.5 only
const GPT_MODEL = "gpt-3.5-turbo";

// Button click listener
submitBtn.addEventListener("click", async () => {
  const question = userInput.value.trim();
  if (!question) {
    responseBox.textContent = "Please enter a question.";
    return;
  }
  
  userInput.value = ""; // ✅ Clears the input box after submission


  responseBox.textContent = "Thinking...";
  responseBox.classList.add("loading");

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: GPT_MODEL,
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: question }
        ],
        temperature: 0.7
      })
    });

    const result = await response.json();

    if (!response.ok) {
      const errorMessage = result?.error?.message || "Unknown error.";
      responseBox.textContent = `Error: ${errorMessage}`;
      console.error("OpenAI Error:", result);
      return;
    }

    const reply = result.choices?.[0]?.message?.content || "No response from GPT.";
    responseBox.textContent = reply.trim();
    responseBox.classList.remove("loading");

  } catch (error) {
    console.error("Fetch Error:", error);
    responseBox.textContent = "Something went wrong. Check the console.";
  }
});
// Optional: Allow pressing Enter to submit
userInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    submitBtn.click();
  }
});
