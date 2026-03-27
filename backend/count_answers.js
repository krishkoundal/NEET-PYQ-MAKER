const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
  input: fs.createReadStream('c:/Users/krish/OneDrive/Desktop/Projects/neet-pyq-maker/backend/questions_dump_fixed.json'),
  terminal: false
});

const counts = {};

rl.on('line', (line) => {
  // Use a simpler regex to avoid escaping issues
  const match = line.match(/"correctAnswer":\s*"(.*?)"/);
  if (match) {
    const val = match[1];
    counts[val] = (counts[val] || 0) + 1;
  }
});

rl.on('close', () => {
  fs.writeFileSync('c:/Users/krish/OneDrive/Desktop/Projects/neet-pyq-maker/backend/counts.json', JSON.stringify(counts, null, 2));
  console.log('Counts saved to counts.json');
});
