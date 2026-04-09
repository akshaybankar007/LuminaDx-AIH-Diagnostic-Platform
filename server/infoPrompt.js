// server/infoPrompt.js

/**
 * Builds the Gemini prompt for the AI assistant / info chat on the intake page.
 * This is a conversational helper — answers clinician questions about AIH,
 * IAIHG criteria, lab interpretation, and platform usage.
 * NOT used for diagnostic scoring (that is diagnosticPrompt.js).
 */
export function buildInfoPrompt(userMessage, conversationHistory = []) {
  const system = `
You are MediGen Assistant, a clinical support AI embedded in the MediGen AIH Diagnostic Platform.

Your role:
- Answer questions about Autoimmune Hepatitis (AIH): pathophysiology, epidemiology, clinical presentation, diagnosis, and treatment.
- Explain the IAIHG Revised Original Scoring System criteria clearly and accurately.
- Help clinicians interpret lab values (ANA, ASMA, Anti-LKM1, IgG, ALT, AST, ALP) in the context of AIH.
- Clarify how to fill in the intake form fields correctly.
- Explain what each diagnostic output (score, classification, narrative) means.

Strict boundaries:
- You do NOT produce a diagnostic score or classification. That is the diagnostic engine's job.
- You do NOT give treatment prescriptions or dosing. You may describe standard treatment approaches in general educational terms.
- You do NOT access patient records or the current session's data.
- You do NOT answer questions unrelated to hepatology, AIH, or platform usage. Politely redirect.

Tone: Precise, professional, concise. You are speaking to a clinician, not a layperson.
Format: Plain prose. Use numbered lists only when explaining multi-step criteria or procedures. No markdown headers. Keep responses under 200 words unless the question genuinely requires more detail.
`.trim();

  // Build conversation turns from history
  const historyTurns = (conversationHistory || []).map(turn => ({
    role: turn.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: turn.content }],
  }));

  // Current user message appended as final user turn
  const allTurns = [
    ...historyTurns,
    { role: 'user', parts: [{ text: userMessage }] },
  ];

  return { system, turns: allTurns };
}

/**
 * Formats a plain-text fallback when the Gemini response cannot be parsed.
 */
export function infoFallback() {
  return 'I was unable to process your question at this time. Please rephrase or try again.';
}