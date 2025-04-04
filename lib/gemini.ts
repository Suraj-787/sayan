import { GoogleGenerativeAI } from "@google/generative-ai";

// Function to generate response using context
export async function generateChatResponse(
  chatHistory: { role: string; content: string }[],
  prompt: string,
  language: string = "en",
  context?: string
) {
  try {
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!apiKey) {
      console.error("Gemini API key is missing.");
      return "API key not configured.";
    }

    // Initialize API
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Extract system prompts
    let systemPrompts = chatHistory.filter(msg => msg.role === "system").map(msg => msg.content);
    
    // Combine all system prompts into a single context
    let systemContext = systemPrompts.join("\n\n");
    
    // Add language instruction to system context
    let languageInstruction = "";
    
    if (language !== "en") {
      // Map language codes to full names
      const languageNames: Record<string, string> = {
        "hi": "Hindi",
        "ta": "Tamil", 
        "bn": "Bengali"
      };
      
      const languageName = languageNames[language] || language;
      
      languageInstruction = `\n\nIMPORTANT: Please respond in ${languageName} language directly. Do not respond in English.`;
      
      // Add specific instructions for each language
      if (language === "hi") {
        languageInstruction += " Please use proper Hindi grammar and vocabulary. Write in Devanagari script.";
      } else if (language === "ta") {
        languageInstruction += " Please use proper Tamil grammar and vocabulary. Write in Tamil script.";
      } else if (language === "bn") {
        languageInstruction += " Please use proper Bengali grammar and vocabulary. Write in Bengali script.";
      }
    }
    
    // Add language instruction to system context
    if (languageInstruction) {
      systemContext = systemContext + languageInstruction;
    }
    
    // If we have additional context, add it to the system context
    if (context) {
      systemContext = systemContext ? `${systemContext}\n\n${context}` : context;
    }

    // Filter out system messages for the chat
    const userModelMessages = chatHistory.filter(msg => msg.role !== "system");

    // For the simplest approach, use just the system context + current prompt if no history
    if (userModelMessages.length === 0) {
      const fullPrompt = systemContext 
        ? `${systemContext}\n\nUser query: ${prompt}`
        : prompt;
      
      const result = await model.generateContent(fullPrompt);
      return result.response.text();
    }

    // Create a simplified chat history
    // IMPORTANT: Make sure it starts with a user message and alternates correctly
    const simplifiedHistory = [];
    let lastRole = null;
    
    // Build a proper alternating history (excluding system messages)
    for (const msg of userModelMessages) {
      const apiRole = msg.role === "user" ? "user" : "model";
      
      // Skip duplicates of the same role
      if (apiRole === lastRole) continue;
      
      // Add to history
      simplifiedHistory.push({
        role: apiRole,
        parts: [{ text: msg.content }]
      });
      
      lastRole = apiRole;
    }
    
    // If the history doesn't start with a user message, remove everything until we find one
    while (simplifiedHistory.length > 0 && simplifiedHistory[0].role !== "user") {
      simplifiedHistory.shift();
    }
    
    // If we still don't have a proper history, just use the current prompt
    if (simplifiedHistory.length === 0) {
      const fullPrompt = systemContext 
        ? `${systemContext}\n\nUser query: ${prompt}`
        : prompt;
      
      const result = await model.generateContent(fullPrompt);
      return result.response.text();
    }
    
    // If we have system context, inject it into the first user message
    if (systemContext && simplifiedHistory.length > 0 && simplifiedHistory[0].role === "user") {
      const firstUserMsg = simplifiedHistory[0].parts[0].text;
      simplifiedHistory[0].parts[0].text = `${systemContext}\n\nPlease respond to this user request: ${firstUserMsg}`;
    }
    
    // Add the current prompt if the last message wasn't from the user
    if (simplifiedHistory[simplifiedHistory.length - 1].role !== "user") {
      simplifiedHistory.push({
        role: "user",
        parts: [{ text: prompt }]
      });
    }
    
    // Generate the response
    const result = await model.generateContent({
      contents: simplifiedHistory,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1024,
      }
    });
    
    return result.response.text();
  } catch (error) {
    console.error("Error generating chat response:", error);
    return "I apologize, but I encountered an error processing your request. Please try again.";
  }
} 