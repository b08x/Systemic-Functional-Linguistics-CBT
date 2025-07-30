import { GoogleGenAI, Chat, Type } from "@google/genai";
import type { SflAnalysis } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const baseSystemInstruction = "You are an expert linguist specializing in Systemic Functional Linguistics (SFL) applied to software engineering. You are a helpful AI assistant. Your goal is to help users understand SFL and apply it to their work (like software requirements, user stories, or code). Be conversational, helpful, and clear. If the user provides text and asks for a structured analysis, you can provide it, but your primary mode is a helpful chat assistant.";

const sflAnalysisSchema = {
    type: Type.OBJECT,
    properties: {
        ideational: {
            type: Type.OBJECT,
            properties: {
                processType: { type: Type.STRING, description: "e.g., Material, Mental, Relational" },
                participants: {
                    type: Type.ARRAY,
                    description: "The entities involved in the process.",
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            role: { type: Type.STRING, description: "e.g., Actor, Goal, Senser" },
                            entity: { type: Type.STRING, description: "The noun phrase." }
                        },
                        required: ["role", "entity"]
                    }
                },
                circumstances: {
                    type: Type.ARRAY,
                    description: "Contextual information about the process.",
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            type: { type: Type.STRING, description: "e.g., Location, Manner, Cause" },
                            details: { type: Type.STRING, description: "The phrase describing the circumstance." }
                        },
                        required: ["type", "details"]
                    }
                },
                summary: { type: Type.STRING, description: "A brief one-sentence summary of the ideational analysis." }
            },
            required: ["processType", "participants", "circumstances", "summary"]
        },
        interpersonal: {
            type: Type.OBJECT,
            properties: {
                mood: { type: Type.STRING, description: "e.g., Declarative, Interrogative, Imperative" },
                modality: { type: Type.STRING, description: "e.g., High, Median, Low obligation/certainty" },
                persona: { type: Type.STRING, description: "The conveyed tone, e.g., Authoritative, Collaborative" },
                summary: { type: Type.STRING, description: "A brief one-sentence summary of the interpersonal analysis." }
            },
            required: ["mood", "modality", "persona", "summary"]
        },
        textual: {
            type: Type.OBJECT,
            properties: {
                theme: { type: Type.STRING, description: "The Theme of the clause (topic)." },
                rheme: { type: Type.STRING, description: "The Rheme of the clause (comment)." },
                cohesion: {
                    type: Type.ARRAY,
                    description: "Elements that link the text together.",
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            type: { type: Type.STRING, description: "e.g., Conjunction, Pronoun Reference" },
                            example: { type: Type.STRING, description: "The word/phrase providing cohesion." }
                        },
                        required: ["type", "example"]
                    }
                },
                summary: { type: Type.STRING, description: "A brief one-sentence summary of the textual analysis." }
            },
            required: ["theme", "rheme", "cohesion", "summary"]
        },
        softwareEngineeringImplications: {
            type: Type.OBJECT,
            properties: {
                requirementsClarity: { type: Type.STRING, description: "Assessment of how clear the requirement is." },
                potentialAmbiguities: { type: Type.STRING, description: "Specific ambiguities identified. If none, state 'None identified'." },
                suggestedRefinement: { type: Type.STRING, description: "A rewritten, clearer version of the original text." }
            },
            required: ["requirementsClarity", "potentialAmbiguities", "suggestedRefinement"]
        }
    },
    required: ["ideational", "interpersonal", "textual", "softwareEngineeringImplications"]
};

export const analyzeTextWithSFL = async (text: string): Promise<SflAnalysis> => {
    const prompt = `Analyze the following text from a software engineering context (e.g., a requirement, user story, or commit message) using Systemic Functional Linguistics (SFL). Provide a detailed breakdown of the ideational, interpersonal, and textual metafunctions. Also, provide a summary of the software engineering implications, including potential ambiguities and a suggested refinement.

Text to analyze: "${text}"`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: sflAnalysisSchema,
            }
        });

        const jsonText = response.text.trim();
        const result = JSON.parse(jsonText);
        return result as SflAnalysis;
    } catch (error) {
        console.error("Error analyzing text with SFL:", error);
        throw new Error("Failed to get a valid analysis from the AI. The model may have returned an invalid format or the request failed.");
    }
};


export const createChatSession = (topicContext?: string, fileContext?: string): Chat => {
    let systemInstruction = baseSystemInstruction;

    if (topicContext) {
        systemInstruction += `\n\nThe user has initiated a conversation about the SFL topic: **${topicContext}**. Start the conversation by greeting them and asking an engaging question about this topic in relation to their work.`;
    }

    if (fileContext) {
        systemInstruction += `\n\nThe user has provided the following document as context. Reference this document in your conversation. Here is the document content:\n\n"""\n${fileContext}\n"""`;
    }

    const chat = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction: systemInstruction,
        },
    });
    return chat;
};