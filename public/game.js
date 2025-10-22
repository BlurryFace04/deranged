// Game State Management
const GameState = {
    currentMode: null,
    playerData: {
        totalMatches: 0,
        bestScore: 0,
        level: 1,
        xp: 0,
        achievements: [],
        leaderboard: []
    },
    
    init() {
        this.loadPlayerData();
        this.updateStatsDisplay();
    },
    
    loadPlayerData() {
        const saved = localStorage.getItem('derangedMarriageData');
        if (saved) {
            this.playerData = { ...this.playerData, ...JSON.parse(saved) };
        }
    },
    
    savePlayerData() {
        localStorage.setItem('derangedMarriageData', JSON.stringify(this.playerData));
    },
    
    updateStatsDisplay() {
        document.getElementById('best-score').textContent = this.playerData.bestScore;
        document.getElementById('total-matches').textContent = this.playerData.totalMatches;
        document.getElementById('player-level').textContent = this.playerData.level;
    },
    
    addXP(amount) {
        this.playerData.xp += amount;
        const xpForNextLevel = this.playerData.level * 100;
        
        if (this.playerData.xp >= xpForNextLevel) {
            this.playerData.level++;
            this.playerData.xp -= xpForNextLevel;
            this.showLevelUpNotification();
        }
    },
    
    showLevelUpNotification() {
        alert(`🎉 Level Up! You're now Level ${this.playerData.level}!`);
        this.updateStatsDisplay();
    }
};

// Achievements System
const Achievements = {
    list: [
        {
            id: 'first_match',
            name: 'First Blood',
            description: 'Complete your first match',
            icon: '🎯',
            condition: (data) => data.totalMatches >= 1
        },
        {
            id: 'perfectionist',
            name: 'Perfectly Incompatible',
            description: 'Get a derangement score of 100',
            icon: '💯',
            condition: (data) => data.bestScore === 100
        },
        {
            id: 'catastrophe',
            name: 'Catastrophe Creator',
            description: 'Get a score of 90 or higher',
            icon: '🔥',
            condition: (data) => data.bestScore >= 90
        },
        {
            id: 'serial_matcher',
            name: 'Serial Matcher',
            description: 'Complete 10 matches',
            icon: '🎲',
            condition: (data) => data.totalMatches >= 10
        },
        {
            id: 'matchmaker',
            name: 'Matchmaker (or Breaker)',
            description: 'Complete 50 matches',
            icon: '💔',
            condition: (data) => data.totalMatches >= 50
        },
        {
            id: 'bingo_master',
            name: 'Full House',
            description: 'Get all 6 deal-breakers in one match',
            icon: '🎯',
            special: true
        },
        {
            id: 'speed_demon',
            name: 'Speed Demon',
            description: 'Complete 5 matches in one session',
            icon: '⚡',
            special: true
        },
        {
            id: 'explorer',
            name: 'Mode Explorer',
            description: 'Try all three game modes',
            icon: '🗺️',
            special: true
        }
    ],
    
    check(playerData, matchData = null) {
        const newAchievements = [];
        
        this.list.forEach(achievement => {
            if (!playerData.achievements.includes(achievement.id)) {
                if (achievement.special) {
                    // Handle special achievements with custom logic
                    if (matchData && this.checkSpecialAchievement(achievement.id, matchData, playerData)) {
                        newAchievements.push(achievement);
                        playerData.achievements.push(achievement.id);
                    }
                } else if (achievement.condition(playerData)) {
                    newAchievements.push(achievement);
                    playerData.achievements.push(achievement.id);
                }
            }
        });
        
        return newAchievements;
    },
    
    checkSpecialAchievement(id, matchData, playerData) {
        switch(id) {
            case 'bingo_master':
                if (!matchData.dealBreakerBingo) return false;
                return Object.values(matchData.dealBreakerBingo).every(v => v === true);
            case 'speed_demon':
                // Track in session storage
                const sessionMatches = parseInt(sessionStorage.getItem('sessionMatches') || '0');
                return sessionMatches >= 5;
            case 'explorer':
                const modes = JSON.parse(sessionStorage.getItem('modesPlayed') || '[]');
                return modes.length >= 3;
            default:
                return false;
        }
    },
    
    getAll() {
        return this.list;
    },
    
    getUnlocked(playerData) {
        return this.list.filter(a => playerData.achievements.includes(a.id));
    }
};

// Daily Challenge System
const DailyChallenge = {
    getChallenge() {
        const today = new Date().toDateString();
        const saved = localStorage.getItem('dailyChallenge');
        
        if (saved) {
            const challenge = JSON.parse(saved);
            if (challenge.date === today) {
                return challenge;
            }
        }
        
        // Generate new challenge
        const challenges = [
            { target: 75, description: 'Reach a Derangement Index of 75+', bonus: 50 },
            { target: 85, description: 'Reach a Derangement Index of 85+', bonus: 100 },
            { target: 95, description: 'Reach a Derangement Index of 95+', bonus: 200 },
        ];
        
        const selectedChallenge = challenges[Math.floor(Math.random() * challenges.length)];
        const challenge = {
            date: today,
            ...selectedChallenge,
            completed: false
        };
        
        localStorage.setItem('dailyChallenge', JSON.stringify(challenge));
        return challenge;
    },
    
    checkCompletion(score) {
        const challenge = this.getChallenge();
        if (!challenge.completed && score >= challenge.target) {
            challenge.completed = true;
            localStorage.setItem('dailyChallenge', JSON.stringify(challenge));
            return challenge.bonus;
        }
        return 0;
    }
};

// Random Person Generator
const RandomGenerator = {
    names: [
        'Alex', 'Jordan', 'Taylor', 'Morgan', 'Casey', 'Riley', 'Avery', 'Quinn',
        'Cameron', 'Blake', 'Drew', 'Parker', 'Skyler', 'Sage', 'River', 'Phoenix'
    ],
    
    cultures: [
        'American', 'Japanese', 'Italian', 'French', 'Brazilian', 'Indian',
        'Mexican', 'Korean', 'Spanish', 'German', 'Chinese', 'British',
        'Nigerian', 'Australian', 'Russian', 'Canadian'
    ],
    
    zodiacs: ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 
              'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'],
    
    mbtis: ['INTJ', 'INTP', 'ENTJ', 'ENTP', 'INFJ', 'INFP', 'ENFJ', 'ENFP',
            'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ', 'ISTP', 'ISFP', 'ESTP', 'ESFP'],
    
    chronotypes: ['Early Bird', 'Night Owl'],
    
    diets: ['Omnivore', 'Vegetarian', 'Vegan', 'Carnivore', 'Pescatarian'],
    
    random(array) {
        return array[Math.floor(Math.random() * array.length)];
    },
    
    generatePerson() {
        return {
            name: this.random(this.names),
            zodiac: this.random(this.zodiacs),
            mbti: this.random(this.mbtis),
            culturalBackground: this.random(this.cultures),
            chronotype: this.random(this.chronotypes),
            wantsKids: Math.random() > 0.5,
            politicalLeaning: Math.floor(Math.random() * 11),
            diet: this.random(this.diets)
        };
    },
    
    fillForm(person, personNum) {
        document.getElementById(`name${personNum}`).value = person.name;
        document.getElementById(`zodiac${personNum}`).value = person.zodiac;
        
        // Find MBTI option that starts with the type
        const mbtiSelect = document.getElementById(`mbti${personNum}`);
        for (let option of mbtiSelect.options) {
            if (option.value.startsWith(person.mbti)) {
                mbtiSelect.value = option.value;
                break;
            }
        }
        
        document.getElementById(`culture${personNum}`).value = person.culturalBackground;
        document.getElementById(`chronotype${personNum}`).value = person.chronotype;
        document.getElementById(`kids${personNum}`).value = person.wantsKids.toString();
        document.getElementById(`politics${personNum}`).value = person.politicalLeaning;
        document.getElementById(`politics${personNum}-value`).textContent = person.politicalLeaning;
        document.getElementById(`diet${personNum}`).value = person.diet;
    }
};

// Leaderboard System
const Leaderboard = {
    addScore(name1, name2, score) {
        const entry = {
            couple: `${name1} & ${name2}`,
            score: score,
            date: new Date().toLocaleDateString()
        };
        
        GameState.playerData.leaderboard.push(entry);
        GameState.playerData.leaderboard.sort((a, b) => b.score - a.score);
        GameState.playerData.leaderboard = GameState.playerData.leaderboard.slice(0, 10);
        GameState.savePlayerData();
    },
    
    getTop10() {
        return GameState.playerData.leaderboard;
    }
};

// Navigation Functions
function startMode(mode) {
    GameState.currentMode = mode;
    
    // Track modes played
    const modesPlayed = JSON.parse(sessionStorage.getItem('modesPlayed') || '[]');
    if (!modesPlayed.includes(mode)) {
        modesPlayed.push(mode);
        sessionStorage.setItem('modesPlayed', JSON.stringify(modesPlayed));
    }
    
    document.getElementById('main-menu').classList.add('hidden');
    document.getElementById('input-section').classList.remove('hidden');
    
    if (mode === 'quickplay') {
        // Auto-fill with random people
        const person1 = RandomGenerator.generatePerson();
        const person2 = RandomGenerator.generatePerson();
        RandomGenerator.fillForm(person1, 1);
        RandomGenerator.fillForm(person2, 2);
    } else if (mode === 'challenge') {
        const challenge = DailyChallenge.getChallenge();
        document.getElementById('challenge-info').classList.remove('hidden');
        document.getElementById('challenge-description').textContent = challenge.description;
        document.getElementById('daily-target').textContent = challenge.target + '+';
    }
}

function backToMenu() {
    document.getElementById('main-menu').classList.remove('hidden');
    document.getElementById('input-section').classList.add('hidden');
    document.getElementById('results-section').classList.add('hidden');
    document.getElementById('achievements-section').classList.add('hidden');
    document.getElementById('leaderboard-section').classList.add('hidden');
    document.getElementById('challenge-info').classList.add('hidden');
}

function showAchievements() {
    document.getElementById('main-menu').classList.add('hidden');
    document.getElementById('achievements-section').classList.remove('hidden');
    
    const grid = document.getElementById('achievements-grid');
    grid.innerHTML = '';
    
    Achievements.getAll().forEach(achievement => {
        const unlocked = GameState.playerData.achievements.includes(achievement.id);
        const div = document.createElement('div');
        div.className = `achievement-card ${unlocked ? 'unlocked' : 'locked'}`;
        div.innerHTML = `
            <div class="achievement-icon-large">${unlocked ? achievement.icon : '🔒'}</div>
            <h4>${achievement.name}</h4>
            <p>${achievement.description}</p>
            ${unlocked ? '<div class="unlocked-badge">✓ Unlocked</div>' : ''}
        `;
        grid.appendChild(div);
    });
}

function showLeaderboard() {
    document.getElementById('main-menu').classList.add('hidden');
    document.getElementById('leaderboard-section').classList.remove('hidden');
    
    const list = document.getElementById('leaderboard-list');
    const top10 = Leaderboard.getTop10();
    
    if (top10.length === 0) {
        list.innerHTML = '<p class="empty-leaderboard">No matches yet! Be the first to create a catastrophically incompatible couple!</p>';
    } else {
        list.innerHTML = top10.map((entry, index) => `
            <div class="leaderboard-entry">
                <div class="rank">#${index + 1}</div>
                <div class="couple-name">${entry.couple}</div>
                <div class="score-badge">${entry.score}</div>
                <div class="date">${entry.date}</div>
            </div>
        `).join('');
    }
}

function showAchievementPopup(achievement) {
    const popup = document.getElementById('achievement-popup');
    document.getElementById('achievement-name').textContent = `${achievement.icon} ${achievement.name}`;
    popup.classList.remove('hidden');
    
    setTimeout(() => {
        popup.classList.add('hidden');
    }, 3000);
}

// Initialize game state on load
document.addEventListener('DOMContentLoaded', () => {
    GameState.init();
});

