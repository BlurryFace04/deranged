const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Calculate Derangement Index based on incompatibilities
function calculateDerangementIndex(person1, person2) {
  let score = 0;
  const incompatibilities = [];
  
  // Zodiac compatibility (0-20 points)
  const zodiacIncompat = calculateZodiacIncompatibility(person1.zodiac, person2.zodiac);
  score += zodiacIncompat;
  if (zodiacIncompat > 10) {
    incompatibilities.push({
      category: 'Zodiac Signs',
      description: `${person1.zodiac} and ${person2.zodiac} are cosmically cursed`,
      severity: zodiacIncompat
    });
  }
  
  // MBTI incompatibility (0-20 points)
  const mbtiIncompat = calculateMBTIIncompatibility(person1.mbti, person2.mbti);
  score += mbtiIncompat;
  if (mbtiIncompat > 10) {
    incompatibilities.push({
      category: 'Personality Types',
      description: `${person1.mbti} and ${person2.mbti} will drive each other insane`,
      severity: mbtiIncompat
    });
  }
  
  // Chronotype clash (0-15 points)
  if (person1.chronotype !== person2.chronotype) {
    score += 15;
    incompatibilities.push({
      category: 'Sleep Schedule',
      description: `${person1.chronotype} vs ${person2.chronotype} = never see each other awake`,
      severity: 15
    });
  }
  
  // Kids disagreement (0-20 points)
  if (person1.wantsKids !== person2.wantsKids) {
    score += 20;
    incompatibilities.push({
      category: 'Kids',
      description: 'One wants kids, one doesn\'t - dealbreaker central',
      severity: 20
    });
  }
  
  // Political divide (0-15 points)
  const politicalGap = Math.abs(person1.politicalLeaning - person2.politicalLeaning);
  if (politicalGap > 5) {
    const politicalScore = Math.min(15, (politicalGap / 10) * 15);
    score += politicalScore;
    incompatibilities.push({
      category: 'Politics',
      description: `${person1.politicalLeaning} vs ${person2.politicalLeaning} on the scale - thanksgiving dinner nightmare`,
      severity: politicalScore
    });
  }
  
  // Diet clash (0-10 points)
  if (person1.diet !== person2.diet) {
    const dietScore = calculateDietIncompatibility(person1.diet, person2.diet);
    score += dietScore;
    if (dietScore > 5) {
      incompatibilities.push({
        category: 'Diet',
        description: `${person1.diet} and ${person2.diet} - kitchen wars guaranteed`,
        severity: dietScore
      });
    }
  }
  
  // Cultural background (0-10 points) - simplified: different = incompatible for this game
  if (person1.culturalBackground.toLowerCase() !== person2.culturalBackground.toLowerCase()) {
    score += 10;
    incompatibilities.push({
      category: 'Cultural Background',
      description: 'Different cultures = eternal misunderstandings',
      severity: 10
    });
  }
  
  // Sort by severity and get top 3
  incompatibilities.sort((a, b) => b.severity - a.severity);
  const top3 = incompatibilities.slice(0, 3);
  
  return {
    score: Math.min(100, Math.round(score)),
    incompatibilities: top3
  };
}

function calculateZodiacIncompatibility(sign1, sign2) {
  // Simplified zodiac incompatibility (opposite signs = max incompatible)
  const signs = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 
                 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
  const idx1 = signs.indexOf(sign1);
  const idx2 = signs.indexOf(sign2);
  
  if (idx1 === -1 || idx2 === -1) return 10;
  
  const diff = Math.abs(idx1 - idx2);
  const distance = Math.min(diff, 12 - diff);
  
  // Opposite signs (6 apart) = most incompatible
  return Math.round((6 - distance) * 3.33);
}

function calculateMBTIIncompatibility(mbti1, mbti2) {
  // Count different dimensions
  let differences = 0;
  for (let i = 0; i < 4; i++) {
    if (mbti1[i] !== mbti2[i]) differences++;
  }
  return differences * 5; // 0, 5, 10, 15, or 20
}

function calculateDietIncompatibility(diet1, diet2) {
  const dietConflicts = {
    'Carnivore': ['Vegan', 'Vegetarian'],
    'Vegan': ['Carnivore', 'Omnivore'],
    'Vegetarian': ['Carnivore'],
    'Omnivore': ['Vegan']
  };
  
  if (dietConflicts[diet1] && dietConflicts[diet1].includes(diet2)) {
    return 10;
  }
  return 5;
}

function generateDealBreakerBingo(person1, person2) {
  return {
    kids: person1.wantsKids !== person2.wantsKids,
    politics: Math.abs(person1.politicalLeaning - person2.politicalLeaning) > 5,
    diet: calculateDietIncompatibility(person1.diet, person2.diet) === 10,
    schedule: person1.chronotype !== person2.chronotype,
    personality: calculateMBTIIncompatibility(person1.mbti, person2.mbti) >= 15,
    zodiac: calculateZodiacIncompatibility(person1.zodiac, person2.zodiac) >= 15
  };
}

// API endpoint for matching
app.post('/api/match', async (req, res) => {
  try {
    const { person1, person2 } = req.body;
    
    // Calculate derangement index
    const result = calculateDerangementIndex(person1, person2);
    
    // Generate Deal-Breaker Bingo
    const bingo = generateDealBreakerBingo(person1, person2);
    
    // Use OpenAI to generate funny "Week-From-Hell" description
    const prompt = `Generate a hilarious and satirical "Week From Hell" description for a completely incompatible couple. 

Person 1: ${person1.name}
- Zodiac: ${person1.zodiac}
- MBTI: ${person1.mbti}
- Cultural Background: ${person1.culturalBackground}
- Chronotype: ${person1.chronotype}
- Wants Kids: ${person1.wantsKids ? 'Yes' : 'No'}
- Political Leaning: ${person1.politicalLeaning}/10
- Diet: ${person1.diet}

Person 2: ${person2.name}
- Zodiac: ${person2.zodiac}
- MBTI: ${person2.mbti}
- Cultural Background: ${person2.culturalBackground}
- Chronotype: ${person2.chronotype}
- Wants Kids: ${person2.wantsKids ? 'Yes' : 'No'}
- Political Leaning: ${person2.politicalLeaning}/10
- Diet: ${person2.diet}

Their Derangement Index is ${result.score}/100.

Write a funny, day-by-day breakdown of their disastrous first week living together. Keep it witty, playful, and absurd. Format it as:

Monday: [disaster]
Tuesday: [disaster]
Wednesday: [disaster]
Thursday: [disaster]
Friday: [disaster]
Saturday: [disaster]
Sunday: [disaster]

Each day should be 1-2 sentences and highlight their incompatibilities in a humorous way.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a witty, sarcastic relationship comedian who specializes in pointing out why couples are hilariously incompatible."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.8,
      max_tokens: 500
    });
    
    const weekFromHell = completion.choices[0].message.content;
    
    res.json({
      derangementIndex: result.score,
      top3Incompatibilities: result.incompatibilities,
      weekFromHell: weekFromHell,
      dealBreakerBingo: bingo,
      person1: person1.name,
      person2: person2.name
    });
    
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      error: 'Failed to generate match',
      message: error.message 
    });
  }
});

app.listen(PORT, () => {
  console.log(`🎲 Deranged Marriage Game running on http://localhost:${PORT}`);
  if (!process.env.OPENAI_API_KEY) {
    console.warn('⚠️  WARNING: OPENAI_API_KEY not set in .env file');
  }
});

