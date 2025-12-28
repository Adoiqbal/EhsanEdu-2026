import { GoogleGenAI, Type } from "@google/genai";
import { CalendarEvent, EventType } from "../types";

// Helper to generate IDs
const generateId = () => Math.random().toString(36).substr(2, 9);

export const generateScheduleSuggestions = async (prompt: string): Promise<CalendarEvent[]> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing. Please check your environment configuration.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const modelId = "gemini-3-flash-preview";

  const systemInstruction = `
    You are a helpful school administrator assistant for 'Sekolah Rendah Islam Integrasi Ehsan'. 
    Your goal is to generate a list of school events for the year 2026 based on the user's request.
    Always format dates as YYYY-MM-DD.
    The year MUST be 2026.
    
    If an event spans multiple days, provide an 'endDate'. If it is a single day event, 'endDate' can be null or omitted.
    
    Map the event type to one of these exact strings: 
    - 'Kurikulum' (Academic, Exams, Classes)
    - 'HEM' (Student Affairs, Discipline, Welfare)
    - 'Koko' (Co-curriculum, Sports, Clubs)
    - 'Diniah' (Religious events, Islamic studies, spiritual programs)
    - 'Pentadbiran Am' (Administration, Registration, Teachers Meeting)
    - 'Cuti' (Holidays, Breaks)
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              date: { type: Type.STRING },
              endDate: { type: Type.STRING },
              type: { type: Type.STRING, enum: Object.values(EventType) },
              description: { type: Type.STRING },
            },
            required: ["title", "date", "type", "description"],
          },
        },
      },
    });

    const rawEvents = JSON.parse(response.text || "[]");
    
    // Enrich with IDs
    return rawEvents.map((e: any) => ({
      ...e,
      id: generateId()
    }));

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to generate schedule suggestions.");
  }
};