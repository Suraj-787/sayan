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

    // Initialize API with stable model
    const genAI = new GoogleGenerativeAI(apiKey);
    // Using gemini-1.5-flash for better free tier quota support
    const model = genAI.getGenerativeModel({
      model: "gemini-3-flash-preview",
      systemInstruction: `You are a knowledgeable government schemes assistant for Indian citizens. Your purpose is to:
         
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
• Try to give the output as much needed as possible and accurate to the question of user don't give too much output


Focus on being helpful, clear, and specific. When you don't know an answer, acknowledge it and suggest where they might find more information.

For scheme-specific questions, include:
• Eligibility requirements
• Benefits provided
• Application process
• Required documents
• Important deadlines
• Official websites or contacts

Avoid political discussions and focus on providing factual, helpful information.${context ? `\n\nHere is additional context about available schemes:\n${context}` : ''}`
    });

    // Convert chat history to Gemini format
    const history = chatHistory.map(msg => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }]
    }));

    // Start chat session with history
    const chat = model.startChat({
      history: history,
      generationConfig: {
        temperature: 0.7,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 2048,
      },
    });

    // Send message and get response
    const result = await chat.sendMessage(prompt);
    const response = result.response;

    return response.text();
  } catch (error: any) {
    console.error("Error generating chat response:", error);

    // Provide more specific error messages
    if (error?.message?.includes('API key')) {
      return "API key error. Please check your configuration.";
    } else if (error?.message?.includes('quota')) {
      return "API quota exceeded. Please try again later.";
    } else if (error?.message?.includes('model')) {
      return "Model error. The AI model may be temporarily unavailable.";
    }

    return "I apologize, but I encountered an error processing your request. Please try again.";
  }
} 