# 💔 Deranged Marriage Matcher 💔

The opposite of arranged marriage - scientifically matching the LEAST compatible couples!

## 🎮 What is this?

Deranged Marriage is a fun game where you input two people's characteristics and get a "Derangement Index" showing just how incompatible they are. The game uses AI to generate hilarious scenarios of their disastrous first week together.

## 🌟 Features

- **Derangement Index (0-100)**: Scientific calculation of incompatibility
- **Top 3 Incompatibilities**: Detailed breakdown of major conflicts
- **Week From Hell**: AI-generated day-by-day disaster scenarios
- **Deal-Breaker Bingo**: Visual checklist of major incompatibilities
- Beautiful, modern UI with animations

## 📋 Input Parameters

For each person, you'll enter:
- Name
- Zodiac Sign
- MBTI Type
- Cultural Background
- Chronotype (Early Bird / Night Owl)
- Kids Preference (Yes/No)
- Political Leaning (0-10 scale)
- Diet (Omnivore, Vegetarian, Vegan, Carnivore, Pescatarian)

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- OpenAI API Key ([Get one here](https://platform.openai.com/api-keys))

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory:
```bash
cp .env.example .env
```

3. Edit `.env` and add your OpenAI API key:
```
OPENAI_API_KEY=sk-your-actual-api-key-here
PORT=3000
```

### Running the Application

1. Start the server:
```bash
npm start
```

2. Open your browser and navigate to:
```
http://localhost:3000
```

3. Enter two people's information and click "Calculate Derangement Index"!

## 🎯 How It Works

### Incompatibility Scoring

The Derangement Index is calculated based on:

- **Zodiac Signs** (0-20 points): Opposite signs = maximum incompatibility
- **MBTI Types** (0-20 points): More different dimensions = higher score
- **Chronotype** (0-15 points): Early Bird + Night Owl = never awake together
- **Kids Preference** (0-20 points): Major dealbreaker if they disagree
- **Political Leaning** (0-15 points): Gap > 5 points = Thanksgiving nightmare
- **Diet** (0-10 points): Vegan + Carnivore = kitchen wars
- **Cultural Background** (0-10 points): Different cultures = misunderstandings

### AI Integration

The app uses OpenAI's GPT-3.5-turbo to generate:
- Funny, day-by-day "Week From Hell" descriptions
- Personalized scenarios based on actual incompatibilities
- Witty commentary on why the couple would drive each other crazy

## 🎨 Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Node.js, Express
- **AI**: OpenAI API (GPT-3.5-turbo)
- **Styling**: Custom CSS with gradients and animations

## ⚠️ Disclaimer

This is for entertainment purposes only! Please don't actually use this to make life decisions about relationships. Real compatibility is much more complex and nuanced than any algorithm can capture.

## 🤝 Contributing

Feel free to fork, modify, and improve! Some ideas for enhancements:
- Add more personality frameworks (Enneagram, Big Five, etc.)
- Include more cultural compatibility factors
- Add social media sharing
- Create a database of famous incompatible couples
- Add sound effects and more animations

## 🚀 Deployment to Vercel

### Quick Deploy

1. Push your code to GitHub (already done!)

2. Go to [Vercel](https://vercel.com) and import your repository

3. Set the environment variable:
   - Go to Project Settings → Environment Variables
   - Add: `OPENAI_API_KEY` with your OpenAI API key value

4. Deploy! Vercel will automatically build and deploy your app

### Environment Variable Setup

In Vercel Dashboard:
```
Key: OPENAI_API_KEY
Value: sk-your-actual-openai-api-key-here
```

Make sure to add it for all environments (Production, Preview, Development).

## 📝 License

MIT License - feel free to use this for your own projects!

---

Made with 💔 for celebrating incompatibility

