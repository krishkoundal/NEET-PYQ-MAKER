const fs = require('fs');
const path = require('path');

const DUMP_PATH = path.join(__dirname, 'questions_dump.json');
const FIXED_DUMP_PATH = path.join(__dirname, 'questions_dump_fixed.json');

function cleanText(text) {
  if (!text) return text;
  // Remove JSON-LD leftovers like ","comment":{"@type":"Comment", ...
  let cleaned = text.replace(/\\"/g, '"'); // Unescape quotes
  cleaned = cleaned.replace(/","comment":\{"@type":"Comment".*$/gi, '');
  cleaned = cleaned.replace(/","suggestedAnswer":.*$/gi, '');
  cleaned = cleaned.replace(/\{"@type":"Answer".*$/gi, '');
  return cleaned.trim();
}

function fixAnswers() {
  console.log('--- Starting Data Restoration ---');
  
  if (!fs.existsSync(DUMP_PATH)) {
    console.error('Error: questions_dump.json not found at', DUMP_PATH);
    return;
  }

  const data = JSON.parse(fs.readFileSync(DUMP_PATH, 'utf8'));
  console.log(`Processing ${data.length} questions...`);

  let fixedViaExp = 0;
  let fixedViaOptionMatch = 0;
  let fixedViaStringMatch = 0;
  let alreadyValid = 0;
  let changedFromA = 0;

  const validKeys = ['A', 'B', 'C', 'D'];

  const newData = data.map((q, index) => {
    // PRE-CLEAN
    q.question = cleanText(q.question);
    q.optionA = cleanText(q.optionA);
    q.optionB = cleanText(q.optionB);
    q.optionC = cleanText(q.optionC);
    q.optionD = cleanText(q.optionD);
    q.explanation = cleanText(q.explanation);
    
    let currentAns = cleanText(q.correctAnswer);
    let newAns = null;
    let source = null;

    // 1. Try Extraction from Explanation
    if (q.explanation && q.explanation.length > 3) {
      const patterns = [
        { regex: /Ans\.?\s*\(?([A-D])\)?/i, name: 'Ans. (X)' },
        { regex: /Ans:\s*([A-D])/i, name: 'Ans: X' },
        { regex: /Ans\s*:\s*([A-D])/i, name: 'Ans : X' },
        { regex: /ANSWER:\s*\(?([A-D])\)?/i, name: 'ANSWER: (X)' },
        { regex: /Correct\s*(option|choice|answer)\s*is\s*\(?([A-D])\)?/i, name: 'Correct option is X' },
        { regex: /Ans\s+is\s+['"]([A-D])['"]/i, name: "Ans is 'x'" },
        { regex: /Ans\s*([A-D])\s*\./i, name: 'Ans X.' },
        { regex: /Ans\)\s*([A-D])/i, name: 'Ans) x' },
        { regex: /Option\s+([A-D])\s*=/i, name: 'Option X =' }
      ];

      for (const p of patterns) {
        const match = q.explanation.match(p.regex);
        if (match) {
          const extracted = (match[2] || match[1]).toUpperCase();
          if (validKeys.includes(extracted)) {
            newAns = extracted;
            source = 'exp';
            break;
          }
        }
      }
    }

    // 2. Try Option Text Matching (if not found in exp via markers)
    // We use the cleaned options here
    if (!newAns && q.explanation && q.explanation.length > 20) {
      const expLower = q.explanation.toLowerCase();
      const opts = { 'A': q.optionA, 'B': q.optionB, 'C': q.optionC, 'D': q.optionD };
      
      let matches = [];
      for (const [key, val] of Object.entries(opts)) {
        if (val && val.length > 5) {
          const valLower = val.toLowerCase().replace(/\\/g, '').trim();
          if (expLower.includes(valLower) || (valLower.length > 20 && expLower.includes(valLower.substring(0, 20)))) {
            matches.push(key);
          }
        }
      }

      if (matches.length === 1) {
        newAns = matches[0];
        source = 'option_text_match';
      }
    }

    // 3. Try String Matching for corrupted JSON-LD strings (if not found in exp)
    if (!newAns && !validKeys.includes(currentAns)) {
      const cleanTarget = currentAns.replace(/\\/g, '').toLowerCase();
      const opts = { 'A': q.optionA, 'B': q.optionB, 'C': q.optionC, 'D': q.optionD };
      for (const [key, val] of Object.entries(opts)) {
        if (val) {
          const cleanVal = val.toLowerCase().replace(/\\/g, '').trim();
          if (cleanVal.includes(cleanTarget) || cleanTarget.includes(cleanVal)) {
            newAns = key;
            source = 'string_match';
            break;
          }
        }
      }
    }

    if (newAns) {
      if (newAns !== currentAns) {
        if (source === 'exp') fixedViaExp++;
        if (source === 'option_text_match') fixedViaOptionMatch++;
        if (source === 'string_match') fixedViaStringMatch++;
        if (currentAns === 'A') changedFromA++;
        return { ...q, correctAnswer: newAns };
      }
      alreadyValid++;
      return { ...q, correctAnswer: newAns }; // already cleaned
    } else {
      if (validKeys.includes(currentAns)) {
        alreadyValid++;
      }
      return { ...q, correctAnswer: currentAns }; // already cleaned
    }
  });

  const stats = {
    total: data.length,
    fixedViaExp,
    fixedViaOptionMatch,
    fixedViaStringMatch,
    changedFromA,
    alreadyValid,
    finalA: newData.filter(q => q.correctAnswer === 'A').length,
    finalB: newData.filter(q => q.correctAnswer === 'B').length,
    finalC: newData.filter(q => q.correctAnswer === 'C').length,
    finalD: newData.filter(q => q.correctAnswer === 'D').length,
    finalInvalid: newData.filter(q => !validKeys.includes(q.correctAnswer)).length
  };

  fs.writeFileSync(FIXED_DUMP_PATH, JSON.stringify(newData, null, 2));
  console.log(JSON.stringify(stats, null, 2));
}

fixAnswers();
