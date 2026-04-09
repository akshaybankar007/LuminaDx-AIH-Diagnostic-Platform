// server/diagnosticPrompt.js

/**
 * Builds the Gemini prompt for IAIHG revised scoring.
 * Returns a string ready to pass as the user message.
 */
export function buildDiagnosticPrompt(patient) {
  return `
You are a specialist hepatologist AI trained on the International Autoimmune Hepatitis Group (IAIHG) Revised Original Scoring System.

You will receive structured patient data and must:
1. Score each IAIHG criterion accurately.
2. Sum the total IAIHG score.
3. Classify the result as: "Definite AIH", "Probable AIH", or "Not AIH".
4. Provide a confidence percentage (0–100).
5. State treatment indication.
6. Write a clinical narrative summary (3–5 sentences).
7. List 3–5 specific clinical recommendations.

---

IAIHG REVISED SCORING REFERENCE:

Sex:
  Female → +2

ALP:AST (or ALP:ALT) ratio:
  <1.5 → +2
  1.5–3.0 → 0
  >3.0 → -2

Serum globulins or IgG above normal:
  >2.0× → +3
  1.5–2.0× → +2
  1.0–1.5× → +1
  <1.0× → 0

ANA, SMA, or Anti-LKM1 titers:
  >1:80 → +3
  1:80 → +2
  1:40 → +1
  <1:40 → 0

AMA positive → -4

Hepatitis viral markers:
  Positive → -3
  Negative → +3

Drug history:
  Positive → -4
  Negative → +1

Average alcohol intake:
  <25 g/day → +2
  >60 g/day → -2

Liver histology:
  Interface hepatitis → +3
  Predominantly lymphoplasmacytic infiltrate → +1
  Rosette formation → +1
  None of above → -5
  Biliary changes → -3
  Other atypical features → -3

Response to therapy:
  Complete → +2
  Relapse → +3

CLASSIFICATION THRESHOLDS:
  Definite AIH: >15 (pre-treatment) or >17 (post-treatment)
  Probable AIH: 10–15 (pre-treatment) or 12–17 (post-treatment)
  Not AIH: <10

---

PATIENT DATA:
Name: ${patient.name}
Age: ${patient.age}
Sex: ${patient.sex}

SEROLOGY:
  ANA Titer: ${patient.anaTiter || 'Not provided'}
  ASMA Titer: ${patient.asmaTiter || 'Not provided'}
  Anti-LKM1: ${patient.antiLkm1 || 'Not provided'}
  IgG (g/L): ${patient.igg || 'Not provided'}
  ALT (U/L): ${patient.alt || 'Not provided'}
  AST (U/L): ${patient.ast || 'Not provided'}

VIRAL EXCLUSION:
  HBsAg: ${patient.hbsag || 'Not provided'}
  Anti-HCV: ${patient.antiHcv || 'Not provided'}
  Drug-Induced Liver Injury: ${patient.dili || 'Not provided'}

HISTOLOGY:
  Interface Hepatitis: ${patient.interfaceHepatitis || 'Not provided'}
  Rosette Formation: ${patient.rosette || 'Not provided'}
  Additional Notes: ${patient.histoNotes || 'None'}

CLINICAL SUMMARY:
${patient.clinicalNotes || 'None provided'}

---

RESPONSE INSTRUCTIONS:
Respond ONLY with a valid JSON object. No markdown, no code fences, no preamble.

Required shape:
{
  "iaihgScore": <integer>,
  "classification": "<Definite AIH | Probable AIH | Not AIH>",
  "confidence": <integer 0-100>,
  "treatmentIndication": "<string>",
  "scoreBreakdown": [
    { "criterion": "<name>", "points": <integer> }
  ],
  "narrative": "<3-5 sentence clinical narrative>",
  "recommendations": [
    "<recommendation 1>",
    "<recommendation 2>",
    "<recommendation 3>"
  ]
}
`.trim();
}