// Initialize range sliders
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('politics1').addEventListener('input', (e) => {
        document.getElementById('politics1-value').textContent = e.target.value;
    });

    document.getElementById('politics2').addEventListener('input', (e) => {
        document.getElementById('politics2-value').textContent = e.target.value;
    });
});

// Randomize button handler
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('randomize-btn').addEventListener('click', () => {
        const person1 = RandomGenerator.generatePerson();
        const person2 = RandomGenerator.generatePerson();
        RandomGenerator.fillForm(person1, 1);
        RandomGenerator.fillForm(person2, 2);
    });
});

// Match button handler
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('match-btn').addEventListener('click', async () => {
    // Get all input values
    const person1 = {
        name: document.getElementById('name1').value.trim(),
        zodiac: document.getElementById('zodiac1').value,
        mbti: document.getElementById('mbti1').value.split(' ')[0],
        culturalBackground: document.getElementById('culture1').value.trim(),
        chronotype: document.getElementById('chronotype1').value,
        wantsKids: document.getElementById('kids1').value === 'true',
        politicalLeaning: parseInt(document.getElementById('politics1').value),
        diet: document.getElementById('diet1').value
    };

    const person2 = {
        name: document.getElementById('name2').value.trim(),
        zodiac: document.getElementById('zodiac2').value,
        mbti: document.getElementById('mbti2').value.split(' ')[0],
        culturalBackground: document.getElementById('culture2').value.trim(),
        chronotype: document.getElementById('chronotype2').value,
        wantsKids: document.getElementById('kids2').value === 'true',
        politicalLeaning: parseInt(document.getElementById('politics2').value),
        diet: document.getElementById('diet2').value
    };

    // Validate
    if (!person1.name || !person2.name) {
        alert('Please enter both names!');
        return;
    }

    if (!person1.culturalBackground || !person2.culturalBackground) {
        alert('Please enter cultural backgrounds for both people!');
        return;
    }

    // Show loading
    document.getElementById('loading').classList.remove('hidden');
    document.getElementById('match-btn').disabled = true;

    try {
        // Use relative URL so it works in both development and production
        const response = await fetch('/api/match', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ person1, person2 })
        });

        if (!response.ok) {
            throw new Error('Failed to calculate match');
        }

        const result = await response.json();
        
        // Update game state
        GameState.playerData.totalMatches++;
        
        // Track session matches
        const sessionMatches = parseInt(sessionStorage.getItem('sessionMatches') || '0') + 1;
        sessionStorage.setItem('sessionMatches', sessionMatches.toString());
        
        // Update best score
        if (result.derangementIndex > GameState.playerData.bestScore) {
            GameState.playerData.bestScore = result.derangementIndex;
        }
        
        // Add to leaderboard
        Leaderboard.addScore(result.person1, result.person2, result.derangementIndex);
        
        // Check for achievements
        const newAchievements = Achievements.check(GameState.playerData, result);
        
        // Calculate XP and bonuses
        let bonusXP = 0;
        let bonuses = [];
        
        // Challenge mode bonus
        if (GameState.currentMode === 'challenge') {
            const challengeBonus = DailyChallenge.checkCompletion(result.derangementIndex);
            if (challengeBonus > 0) {
                bonusXP += challengeBonus;
                bonuses.push(`🎯 Challenge Complete: +${challengeBonus} XP`);
            }
        }
        
        // High score bonuses
        if (result.derangementIndex >= 90) {
            bonusXP += 50;
            bonuses.push('🔥 Catastrophic Match: +50 XP');
        } else if (result.derangementIndex >= 80) {
            bonusXP += 25;
            bonuses.push('⚠️ Epic Mismatch: +25 XP');
        }
        
        // Full bingo bonus
        if (Object.values(result.dealBreakerBingo).every(v => v === true)) {
            bonusXP += 100;
            bonuses.push('🎯 Full Bingo: +100 XP');
        }
        
        const baseXP = result.derangementIndex;
        const totalXP = baseXP + bonusXP;
        GameState.addXP(totalXP);
        GameState.savePlayerData();
        GameState.updateStatsDisplay();
        
        // Display results with game data
        displayResults(result, { baseXP, bonusXP, totalXP, bonuses, newAchievements });
        
        // Show achievements
        newAchievements.forEach((achievement, index) => {
            setTimeout(() => showAchievementPopup(achievement), (index + 1) * 3500);
        });
        
        // Scroll to results
        document.getElementById('results-section').scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
        });
    } catch (error) {
        console.error('Error:', error);
        alert('Error calculating match. Make sure the server is running and OpenAI API key is set!');
    } finally {
        document.getElementById('loading').classList.add('hidden');
        document.getElementById('match-btn').disabled = false;
    }
    });
});

function displayResults(result, gameData = null) {
    // Show results section
    document.getElementById('results-section').classList.remove('hidden');

    // Display derangement index with animation
    const scoreElement = document.getElementById('score');
    const scoreFillElement = document.getElementById('score-fill');
    const scoreDescriptionElement = document.getElementById('score-description');
    
    animateScore(scoreElement, 0, result.derangementIndex, 1500);
    
    setTimeout(() => {
        scoreFillElement.style.width = result.derangementIndex + '%';
    }, 100);

    // Score description
    let description = '';
    if (result.derangementIndex >= 80) {
        description = '🔥 CATASTROPHICALLY INCOMPATIBLE 🔥';
    } else if (result.derangementIndex >= 60) {
        description = '⚠️ SERIOUSLY MISMATCHED ⚠️';
    } else if (result.derangementIndex >= 40) {
        description = '😬 MODERATELY INCOMPATIBLE 😬';
    } else if (result.derangementIndex >= 20) {
        description = '🤔 SOMEWHAT MISMATCHED 🤔';
    } else {
        description = '😊 SURPRISINGLY COMPATIBLE 😊';
    }
    scoreDescriptionElement.textContent = description;
    
    // Display bonus points if game data provided
    if (gameData) {
        const bonusSection = document.getElementById('bonus-section');
        bonusSection.classList.remove('hidden');
        document.getElementById('base-score').textContent = gameData.baseXP;
        document.getElementById('bonus-points').textContent = `+${gameData.bonusXP}`;
        document.getElementById('total-xp').textContent = gameData.totalXP;
    }

    // Display top 3 incompatibilities
    const incompatibilitiesList = document.getElementById('incompatibilities-list');
    incompatibilitiesList.innerHTML = '';
    
    result.top3Incompatibilities.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'incompatibility-item';
        div.style.animationDelay = `${index * 0.2}s`;
        div.innerHTML = `
            <h4>${index + 1}. ${item.category}</h4>
            <p>${item.description}</p>
        `;
        incompatibilitiesList.appendChild(div);
    });

    // Display Deal-Breaker Bingo
    const bingoGrid = document.getElementById('bingo-grid');
    bingoGrid.innerHTML = '';
    
    const bingoItems = [
        { label: '👶 Kids', active: result.dealBreakerBingo.kids },
        { label: '🗳️ Politics', active: result.dealBreakerBingo.politics },
        { label: '🍽️ Diet', active: result.dealBreakerBingo.diet },
        { label: '⏰ Schedule', active: result.dealBreakerBingo.schedule },
        { label: '🧠 Personality', active: result.dealBreakerBingo.personality },
        { label: '⭐ Zodiac', active: result.dealBreakerBingo.zodiac }
    ];

    bingoItems.forEach(item => {
        const div = document.createElement('div');
        div.className = `bingo-item ${item.active ? 'active' : 'inactive'}`;
        div.innerHTML = item.active ? `✓ ${item.label}` : `✗ ${item.label}`;
        bingoGrid.appendChild(div);
    });

    // Display Week From Hell
    document.getElementById('week-content').textContent = result.weekFromHell;
}

function animateScore(element, start, end, duration) {
    const range = end - start;
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const current = Math.floor(start + range * easeOutQuart);
        
        element.textContent = current;

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);
}

// Reset button handler
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('reset-btn').addEventListener('click', () => {
        document.getElementById('results-section').classList.add('hidden');
        
        if (GameState.currentMode === 'quickplay') {
            // Generate new random couple
            const person1 = RandomGenerator.generatePerson();
            const person2 = RandomGenerator.generatePerson();
            RandomGenerator.fillForm(person1, 1);
            RandomGenerator.fillForm(person2, 2);
        }
        
        document.getElementById('input-section').scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
        });
    });
});

