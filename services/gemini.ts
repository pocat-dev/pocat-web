import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AIAnalysisResult, ViralClip } from "../types";

// Helper to convert blob to base64
const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      // Remove data url prefix (e.g. "data:image/jpeg;base64,")
      resolve(base64String.split(',')[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

export const analyzeFrame = async (imageBlob: Blob, contextText: string): Promise<AIAnalysisResult> => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      throw new Error("API Key is missing");
    }

    const ai = new GoogleGenAI({ apiKey });
    const base64Data = await blobToBase64(imageBlob);

    const schema: Schema = {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING, description: "A catchy, viral-style title for this video clip" },
        viralScore: { type: Type.NUMBER, description: "A score from 1-100 indicating virality potential" },
        reasoning: { type: Type.STRING, description: "Short explanation of why this is engaging" },
        hashtags: { 
          type: Type.ARRAY, 
          items: { type: Type.STRING },
          description: "5 relevant hashtags for TikTok/Instagram" 
        },
        suggestedCaption: { type: Type.STRING, description: "A social media caption" }
      },
      required: ["title", "viralScore", "reasoning", "hashtags", "suggestedCaption"],
    };

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: base64Data
            }
          },
          {
            text: `Analyze this video frame. The user describes the context as: "${contextText || 'A general video clip'}". 
            Imagine this is a short clip for TikTok or YouTube Shorts. 
            Generate a catchy title, a virality score, hashtags, and a caption.`
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
        temperature: 0.7,
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as AIAnalysisResult;
    }
    
    throw new Error("No response from AI");

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    // Fallback mock data in case of API failure
    return {
      title: "AI Analysis Failed",
      viralScore: 0,
      reasoning: "Could not connect to Gemini API. Please check your API key.",
      hashtags: ["#error", "#tryagain"],
      suggestedCaption: "Please try again."
    };
  }
};

export const analyzeVideoSegments = async (
  frames: { timestamp: number; blob: Blob }[], 
  contextText: string
): Promise<ViralClip[]> => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) throw new Error("API Key is missing");

    const ai = new GoogleGenAI({ apiKey });

    // Prepare parts: Interleave text (timestamp) and image
    const parts: any[] = [{
      text: `I am providing frames from a video at specific timestamps. 
             Context: "${contextText}".
             Analyze these frames to identify potential viral clips. 
             Group adjacent or related frames into "clips".
             Return a list of 3-5 best clips.
             For each clip, estimate a start and end time based on the timestamps provided, give it a viral score, and a title.`
    }];

    for (const frame of frames) {
      const base64 = await blobToBase64(frame.blob);
      parts.push({ text: `Frame at ${Math.floor(frame.timestamp)} seconds:` });
      parts.push({
        inlineData: {
          mimeType: "image/jpeg",
          data: base64
        }
      });
    }

    const schema: Schema = {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING, description: "Unique ID" },
          title: { type: Type.STRING, description: "Catchy title for the clip" },
          start: { type: Type.STRING, description: "Start time in MM:SS format" },
          end: { type: Type.STRING, description: "End time in MM:SS format" },
          viralScore: { type: Type.NUMBER, description: "Score 1-100" },
          description: { type: Type.STRING, description: "What happens in this clip" },
          reasoning: { type: Type.STRING, description: "Why is it viral?" },
        },
        required: ["id", "title", "start", "end", "viralScore", "description", "reasoning"]
      }
    };

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: { parts },
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
        temperature: 0.7,
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as ViralClip[];
    }
    return [];

  } catch (error) {
    console.error("Segment Analysis Error:", error);
    return [];
  }
};