import { GoogleGenerativeAI } from "@google/generative-ai";

// Function to generate response using context
export async function generateChatResponse(
  chatHistory: { role: string; content: string }[],
  prompt: string,
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
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Create system prompt
    const systemPrompt = `You are a knowledgeable government schemes assistant for Indian citizens. Your purpose is to:
         
1. Provide accurate, detailed information about government schemes in India
2. Help users understand eligibility criteria for various schemes
3. Guide users through application processes
4. Explain benefits and documentation requirements
5. Answer questions about deadlines, websites, and other practical details

Format your responses in a clean, readable structure:
• Use bullet points with the "•" symbol (not Markdown asterisks)
• Separate points with line breaks
• For lists and steps, use numbers followed by a period (1., 2., etc.)
• Use line breaks between paragraphs for better readability
• If highlighting important information, use clear headers like "ELIGIBILITY:" instead of markdown formatting
• Don't use markdown formatting like **, #, or backticks

Focus on being helpful, clear, and specific. When you don't know an answer, acknowledge it and suggest where they might find more information.

For scheme-specific questions, include:
• Eligibility requirements
• Benefits provided
• Application process
• Required documents
• Important deadlines
• Official websites or contacts

Avoid political discussions and focus on providing factual, helpful information.`;

    // Add context to the system prompt if provided
    const enhancedSystemPrompt = context 
      ? `${systemPrompt}\n\nHere is additional context about available schemes:\n${context}`
      : systemPrompt;

    // Create a simplified chat history
    const simplifiedHistory = [];
    
    // Add the system message as the first message
    simplifiedHistory.push({
      role: "model",
      parts: [{ text: enhancedSystemPrompt }]
    });
    
    // Add user messages and assistant responses
    for (const msg of chatHistory) {
      const apiRole = msg.role === "user" ? "user" : "model";
      
      // Add to history
      simplifiedHistory.push({
        role: apiRole,
        parts: [{ text: msg.content }]
      });
    }
    
    // Add the current prompt
    simplifiedHistory.push({
      role: "user",
      parts: [{ text: prompt }]
    });
    
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