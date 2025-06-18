interface Message {
  role: 'user' | 'model';
  parts: { text: string }[];
}

interface ChatHistory {
  id: string;
  messages: Message[];
  timestamp: number;
}

class GeminiService {
  private apiKey: string;
  private history: Message[] = [];

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async sendMessage(userMessage: string, systemInstruction: string): Promise<string> {
    if (!this.apiKey) {
      throw new Error('Gemini API key not configured');
    }

    this.history.push({
      role: 'user',
      parts: [{ text: userMessage }]
    });

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${this.apiKey}`;

    const requestBody = {
      contents: this.history,
      systemInstruction: {
        parts: [{ text: systemInstruction }]
      },
      generationConfig: {
        temperature: 0.8,
        maxOutputTokens: 800,
      },
      safetySettings: [
        { "category": "HARM_CATEGORY_HARASSMENT", "threshold": "BLOCK_MEDIUM_AND_ABOVE" },
        { "category": "HARM_CATEGORY_HATE_SPEECH", "threshold": "BLOCK_MEDIUM_AND_ABOVE" },
        { "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT", "threshold": "BLOCK_MEDIUM_AND_ABOVE" },
        { "category": "HARM_CATEGORY_DANGEROUS_CONTENT", "threshold": "BLOCK_MEDIUM_AND_ABOVE" }
      ]
    };

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      const responseData = await response.json();

      if (!response.ok) {
        console.error("API Error Response:", responseData);
        const errorMessage = responseData.error?.message || `API request failed with status ${response.status}`;
        throw new Error(errorMessage);
      }

      let botResponseText = "Sorry, I couldn't understand that. Could you try again? 🤔";
      
      if (responseData.candidates && responseData.candidates.length > 0 &&
          responseData.candidates[0].content && responseData.candidates[0].content.parts &&
          responseData.candidates[0].content.parts.length > 0) {
        botResponseText = responseData.candidates[0].content.parts[0].text;
      } else if (responseData.promptFeedback && responseData.promptFeedback.blockReason) {
        botResponseText = `I can't respond to that: ${responseData.promptFeedback.blockReason}. Please try something else.`;
      }

      this.history.push({
        role: 'model',
        parts: [{ text: botResponseText }]
      });

      // Keep history manageable
      if (this.history.length > 20) {
        this.history.splice(0, this.history.length - 20);
      }

      return botResponseText;

    } catch (error) {
      console.error("Error fetching from Gemini API:", error);
      throw error;
    }
  }

  setHistory(messages: Message[]) {
    this.history = [...messages];
  }

  getHistory(): Message[] {
    return [...this.history];
  }

  clearHistory() {
    this.history = [];
  }
}

export default GeminiService;