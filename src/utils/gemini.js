import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.REACT_APP_GEMINI_API_KEY;
const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

export const enhanceText = async (text, section, jobDescription = "") => {
    if (!genAI) {
        throw new Error("Gemini API key not found. Please add REACT_APP_GEMINI_API_KEY to your .env file.");
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    let prompt = "";

    if (section === "summary") {
        prompt = `Enhance the following professional summary for a resume. Make it compelling, professional, and highlight key strengths. 
    ${jobDescription ? `Ensure it aligns with this job description: ${jobDescription}` : ""}
    Original Text: ${text}
    Enhanced Summary:`;
    } else if (section === "experience") {
        prompt = `Enhance the following job experience description for a resume. Use strong action verbs, include metrics if possible, and make it professional. 
    ${jobDescription ? `Focus on keywords and skills relevant to this job description: ${jobDescription}` : ""}
    Original Text: ${text}
    Enhanced Description:`;
    } else if (section === "projects") {
        prompt = `Enhance the following project description for a resume. Focus on technical challenges, solutions, and impact.
    ${jobDescription ? `Highlight technical skills relevant to this job description: ${jobDescription}` : ""}
    Original Text: ${text}
    Enhanced Description:`;
    } else {
        prompt = `Improve the following text for a professional resume:
    Original Text: ${text}
    Enhanced Text:`;
    }

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text().trim();
    } catch (error) {
        console.error("Error enhancing text with Gemini:", error);
        throw error;
    }
};
