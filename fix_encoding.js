const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// Replacements map for double-encoded UTF-8 / Windows-1252 mojibake
const replacements = [
  // Emojis
  { from: /ðŸ‘‘/g, to: '👑' },
  { from: /ðŸ’Ž/g, to: '💎' },
  { from: /ðŸ’„/g, to: '💄' },
  { from: /ðŸŒŸ/g, to: '🌟' },
  { from: /ðŸŽ¨/g, to: '🎨' },
  { from: /ðŸ’¨/g, to: '💨' },
  { from: /ðŸŒ¿/g, to: '🌿' },
  { from: /ðŸ’§/g, to: '💧' },
  { from: /ðŸ”’/g, to: '🔒' },
  { from: /ðŸŽ“/g, to: '🎓' },
  { from: /ðŸŒ¸/g, to: '🌸' },
  { from: /âœ‚ï¸\s*/g, to: '✂️' },
  { from: /âœ‚/g, to: '✂️' },
  { from: /âœ¨/g, to: '✨' },
  { from: /â­\s*/g, to: '⭐' },
  { from: /â­/g, to: '⭐' },

  // Punctuation & Typography
  { from: /â€”/g, to: '&mdash;' },
  { from: /â€“/g, to: '&ndash;' },
  { from: /â€¢/g, to: '&bull;' },
  { from: /â€œ/g, to: '&ldquo;' },
  { from: /â€\s*/g, to: '&rdquo;' },
  { from: /â†’/g, to: '&rarr;' },
  { from: /âœ•/g, to: '&times;' },
  { from: /â˜…/g, to: '★' },
  { from: /Â©/g, to: '&copy;' },

  // Brand Names
  { from: /EstÃ©e/g, to: 'Estée' },
  { from: /KÃ©rastase/g, to: 'Kérastase' },
];

replacements.forEach(({ from, to }) => {
  html = html.replace(from, to);
});

// Explicitly ensure Hero Stat Cards have clean icons
html = html.replace(
  /<div class="hero-stat-card">\s*<span class="hero-stat-icon">[\s\S]*?<\/span>\s*<span class="hero-stat-number text-gold-gradient">22\+<\/span>/g,
  `<div class="hero-stat-card">\n                <span class="hero-stat-icon">👑</span>\n                <span class="hero-stat-number text-gold-gradient">22+</span>`
);

html = html.replace(
  /<div class="hero-stat-card">\s*<span class="hero-stat-icon">[\s\S]*?<\/span>\s*<span class="hero-stat-number text-gold-gradient">1,000\+<\/span>/g,
  `<div class="hero-stat-card">\n                <span class="hero-stat-icon">✨</span>\n                <span class="hero-stat-number text-gold-gradient">1,000+</span>`
);

html = html.replace(
  /<div class="hero-stat-card">\s*<span class="hero-stat-icon">[\s\S]*?<\/span>\s*<span class="hero-stat-number text-gold-gradient">4\.9\/5<\/span>/g,
  `<div class="hero-stat-card">\n                <span class="hero-stat-icon">⭐</span>\n                <span class="hero-stat-number text-gold-gradient">4.9/5</span>`
);

// Save back as UTF-8
fs.writeFileSync('index.html', html, 'utf8');
console.log('Encoding fix successfully applied!');

