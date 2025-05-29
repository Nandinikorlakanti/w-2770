
import { ParsedTask } from '../types/task';

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

export async function parseWithGemini(input: string, apiKey: string): Promise<ParsedTask> {
  const prompt = `
Parse the following natural language task input and extract structured information. Return ONLY valid JSON with this exact structure:

{
  "name": "main task description",
  "assignee": "person name or null",
  "dueDate": "ISO date string or null",
  "priority": "P1, P2, P3, or P4"
}

Rules:
- Extract the main action/objective as the task name
- Find person names (usually after "assign", "@", or before "by")
- Parse dates intelligently (today, tomorrow, next Friday, June 20th, etc.)
- Extract priority levels P1-P4 (default to P3 if not specified)
- P1 = Critical/Urgent, P2 = High, P3 = Medium, P4 = Low
- Return null for missing fields (except priority which defaults to P3)

Input: "${input}"

JSON:`;

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          temperature: 0.1,
          topK: 1,
          topP: 1,
          maxOutputTokens: 200,
        }
      })
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!text) {
      throw new Error('No response from Gemini API');
    }

    // Extract JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No valid JSON found in response');
    }

    const parsed = JSON.parse(jsonMatch[0]);
    
    // Validate and convert the response
    return {
      name: parsed.name || 'Untitled Task',
      assignee: parsed.assignee || undefined,
      dueDate: parsed.dueDate ? new Date(parsed.dueDate) : undefined,
      priority: ['P1', 'P2', 'P3', 'P4'].includes(parsed.priority) ? parsed.priority : 'P3'
    };
  } catch (error) {
    console.error('Gemini API error:', error);
    throw new Error('Failed to parse with AI. Please check your API key and try again.');
  }
}
