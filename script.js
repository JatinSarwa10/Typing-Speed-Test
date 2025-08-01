class TypingSpeedTest {
    constructor() {
        // Difficulty-based text samples
        this.testTexts = {
            easy: [
                "The cat sat on the mat. It was a sunny day. The birds were singing in the trees. Children were playing in the park.",
                "I like to eat apples and oranges. They are sweet and juicy. My mom makes the best apple pie in the world.",
                "The dog runs fast in the park. He likes to play with the ball. The sun is shining bright today."
            ],
            medium: [
                "The quick brown fox jumps over the lazy dog. This pangram contains every letter of the alphabet and is commonly used for typing practice.",
                "Technology has transformed the way we communicate, work, and live. From smartphones to social media, digital innovation continues to shape our world.",
                "Reading books expands our knowledge and imagination. Literature allows us to explore different worlds and understand diverse perspectives."
            ],
            hard: [
                "In a hole in the ground there lived a hobbit. Not a nasty, dirty, wet hole, filled with the ends of worms and an oozy smell, nor yet a dry, bare, sandy hole.",
                "To be or not to be, that is the question: Whether 'tis nobler in the mind to suffer the slings and arrows of outrageous fortune, or to take arms against a sea of troubles.",
                "It was the best of times, it was the worst of times, it was the age of wisdom, it was the age of foolishness, it was the epoch of belief, it was the epoch of incredulity."
            ],
            expert: [
                "function calculateWPM(chars, time) { return Math.round((chars / 5) / (time / 60)); } const accuracy = (correct / total) * 100;",
                "SELECT users.name, COUNT(orders.id) as order_count FROM users LEFT JOIN orders ON users.id = orders.user_id GROUP BY users.id HAVING order_count > 5;",
                "The Fourier transform decomposes a function into its constituent frequencies: F(ω) = ∫_{-∞}^{∞} f(t)e^{-iωt}dt where ω represents angular frequency."
            ]
        };
        
        // Keyboard layout for visualization
        this.keyboardLayout = [
            ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Backspace'],
            ['Tab', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '[', ']', '\\'],
            ['Caps', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ';', "'", 'Enter'],
            ['Shift', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.', '/', 'Shift'],
            ['Space']
        ];
        
        this.initializeProperties();
        this.initializeElements();
        this.setupEventListeners();
        this.createKeyboard();
        this.generateNewText();
        this.loadHighScores();
    }
    
    initializeProperties() {
        this.currentText = '';
        this.currentIndex = 0;
        this.startTime = null;
        this.endTime = null;
        this.timerInterval = null;
        this.countdownInterval = null;
        this.isTestActive = false;
        this.timeLimit = 60;
        this.timeLeft = 60;
        this.errors = 0;
        this.totalTyped = 0;
        this.difficulty = 'medium';
        this.keystrokes = [];
        this.errorMap = new Map();
        this.soundEnabled = true;
        this.highScores = [];
        this.rawWPM = 0;
        this.netWPM = 0;
    }
    
    initializeElements() {
        this.textDisplay = document.getElementById('textDisplay');
        this.textInput = document.getElementById('textInput');
        this.startBtn = document.getElementById('startBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.highScoresBtn = document.getElementById('highScoresBtn');
        this.timeSelect = document.getElementById('timeSelect');
        this.difficultySelect = document.getElementById('difficultySelect');
        this.timerElement = document.getElementById('timer');
        this.wpmElement = document.getElementById('wpm');
        this.accuracyElement = document.getElementById('accuracy');
        this.errorsElement = document.getElementById('errors');
        this.resultsDiv = document.getElementById('results');
        this.countdownOverlay = document.getElementById('countdownOverlay');
        this.countdownNumber = document.getElementById('countdownNumber');
        this.keyboardContainer = document.getElementById('keyboardContainer');
        this.keyboard = document.getElementById('keyboard');
        this.errorHeatmap = document.getElementById('errorHeatmap');
        this.highScoresModal = document.getElementById('highScoresModal');
        this.correctSound = document.getElementById('correctSound');
        this.incorrectSound = document.getElementById('incorrectSound');
    }
    
    setupEventListeners() {
        this.startBtn.addEventListener('click', () => this.startCountdown());
        this.resetBtn.addEventListener('click', () => this.resetTest());
        this.highScoresBtn.addEventListener('click', () => this.showHighScores());
        this.textInput.addEventListener('input', (e) => this.handleInput(e));
        this.textInput.addEventListener('keydown', (e) => this.handleKeyDown(e));
        this.timeSelect.addEventListener('change', (e) => this.changeTimeLimit(e));
        this.difficultySelect.addEventListener('change', (e) => this.changeDifficulty(e));
        
        // Modal event listeners
        document.getElementById('closeHighScores').addEventListener('click', () => this.hideHighScores());
        document.getElementById('clearScores').addEventListener('click', () => this.clearHighScores());
        
        // Close modal when clicking outside
        this.highScoresModal.addEventListener('click', (e) => {
            if (e.target === this.highScoresModal) {
                this.hideHighScores();
            }
        });
    }
    
    createKeyboard() {
        this.keyboard.innerHTML = '';
        
        this.keyboardLayout.forEach(row => {
            row.forEach(key => {
                const keyElement = document.createElement('div');
                keyElement.classList.add('key');
                keyElement.textContent = key;
                keyElement.setAttribute('data-key', key.toLowerCase());
                
                // Add special classes for layout
                if (key === 'Space') {
                    keyElement.classList.add('space');
                    keyElement.textContent = '';
                } else if (key === 'Enter') {
                    keyElement.classList.add('enter');
                } else if (key === 'Shift') {
                    keyElement.classList.add('shift');
                } else if (key === 'Tab') {
                    keyElement.classList.add('tab');
                }
                
                this.keyboard.appendChild(keyElement);
            });
        });
    }
    
    generateNewText() {
        const texts = this.testTexts[this.difficulty];
        const randomIndex = Math.floor(Math.random() * texts.length);
        this.currentText = texts[randomIndex];
        this.displayText();
        this.resetErrorMap();
    }
    
    resetErrorMap() {
        this.errorMap.clear();
        for (let i = 0; i < this.currentText.length; i++) {
            this.errorMap.set(i, 0);
        }
    }
    
    displayText() {
        this.textDisplay.innerHTML = '';
        
        for (let i = 0; i < this.currentText.length; i++) {
            const span = document.createElement('span');
            span.textContent = this.currentText[i];
            span.classList.add('char');
            span.setAttribute('data-index', i);
            
            if (i === 0) {
                span.classList.add('current');
            }
            
            this.textDisplay.appendChild(span);
        }
    }
    
    startCountdown() {
        this.countdownOverlay.style.display = 'flex';
        let countdown = 3;
        this.countdownNumber.textContent = countdown;
        
        this.countdownInterval = setInterval(() => {
            countdown--;
            if (countdown > 0) {
                this.countdownNumber.textContent = countdown;
            } else if (countdown === 0) {
                this.countdownNumber.textContent = 'GO!';
            } else {
                this.countdownOverlay.style.display = 'none';
                this.startTest();
                clearInterval(this.countdownInterval);
            }
        }, 1000);
    }
    
    startTest() {
        this.isTestActive = true;
        this.startTime = performance.now();
        this.currentIndex = 0;
        this.errors = 0;
        this.totalTyped = 0;
        this.timeLeft = this.timeLimit;
        this.keystrokes = [];
        this.rawWPM = 0;
        this.netWPM = 0;
        
        this.textInput.disabled = false;
        this.textInput.focus();
        this.textInput.value = '';
        this.startBtn.disabled = true;
        this.timeSelect.disabled = true;
        this.difficultySelect.disabled = true;
        this.resultsDiv.style.display = 'none';
        this.errorHeatmap.style.display = 'none';
        this.keyboardContainer.style.display = 'block';
        
        this.startTimer();
        this.updateStats();
        this.playSound('start');
    }
    
    startTimer() {
        this.timerInterval = setInterval(() => {
            this.timeLeft--;
            this.timerElement.textContent = this.timeLeft;
            this.updateStats();
            
            if (this.timeLeft <= 0) {
                this.endTest();
            }
        }, 1000);
    }
    
    handleInput(e) {
        if (!this.isTestActive) return;
        
        const inputValue = e.target.value;
        const inputLength = inputValue.length;
        
        // Handle the case where user types beyond the text length
        if (inputLength > this.currentText.length) {
            e.target.value = inputValue.slice(0, this.currentText.length);
            return;
        }
        
        this.totalTyped = Math.max(this.totalTyped, inputLength);
        
        // Record keystroke timing
        if (inputLength > this.keystrokes.length) {
            this.keystrokes.push({
                char: inputValue[inputLength - 1],
                timestamp: performance.now() - this.startTime,
                correct: inputValue[inputLength - 1] === this.currentText[inputLength - 1]
            });
        }
        
        this.updateTextDisplay(inputValue);
        this.updateKeyboard(inputValue);
        this.updateStats();
        
        // Check if test is complete
        if (inputLength === this.currentText.length && 
            inputValue === this.currentText) {
            this.endTest();
        }
    }
    
    handleKeyDown(e) {
        if (!this.isTestActive) return;
        
        // Prevent certain keys that might interfere with the test
        if (e.key === 'Tab') {
            e.preventDefault();
        }
        
        // Highlight the pressed key
        this.highlightKey(e.key);
    }
    
    highlightKey(key) {
        // Remove previous highlights
        document.querySelectorAll('.key.active').forEach(k => k.classList.remove('active'));
        
        // Highlight current key
        const keyElement = document.querySelector(`[data-key="${key.toLowerCase()}"]`);
        if (keyElement) {
            keyElement.classList.add('active');
            setTimeout(() => keyElement.classList.remove('active'), 200);
        }
    }
    
    updateTextDisplay(inputValue) {
        const chars = this.textDisplay.querySelectorAll('.char');
        
        chars.forEach((char, index) => {
            char.classList.remove('correct', 'incorrect', 'current');
            
            if (index < inputValue.length) {
                if (inputValue[index] === this.currentText[index]) {
                    char.classList.add('correct');
                    if (index === inputValue.length - 1) {
                        this.playSound('correct');
                    }
                } else {
                    char.classList.add('incorrect');
                    this.errorMap.set(index, this.errorMap.get(index) + 1);
                    if (index === inputValue.length - 1) {
                        this.playSound('incorrect');
                        this.highlightKeyError(inputValue[index]);
                    }
                }
            } else if (index === inputValue.length) {
                char.classList.add('current');
            }
        });
    }
    
    highlightKeyError(key) {
        const keyElement = document.querySelector(`[data-key="${key.toLowerCase()}"]`);
        if (keyElement) {
            keyElement.classList.add('error');
            setTimeout(() => keyElement.classList.remove('error'), 500);
        }
    }
    
    updateKeyboard(inputValue) {
        if (inputValue.length < this.currentText.length) {
            const nextChar = this.currentText[inputValue.length];
            
            // Remove previous highlights
            document.querySelectorAll('.key.active').forEach(k => k.classList.remove('active'));
            
            // Highlight next expected key
            const keyElement = document.querySelector(`[data-key="${nextChar.toLowerCase()}"]`);
            if (keyElement) {
                keyElement.classList.add('active');
            }
        }
    }
    
    playSound(type) {
        if (!this.soundEnabled) return;
        
        try {
            if (type === 'correct' && this.correctSound) {
                this.correctSound.currentTime = 0;
                this.correctSound.play().catch(() => {});
            } else if (type === 'incorrect' && this.incorrectSound) {
                this.incorrectSound.currentTime = 0;
                this.incorrectSound.play().catch(() => {});
            }
        } catch (error) {
            // Silently handle audio errors
        }
    }
    
    calculateAdvancedWPM() {
        if (!this.startTime || this.keystrokes.length === 0) return { raw: 0, net: 0 };
        
        const timeElapsed = (performance.now() - this.startTime) / 1000 / 60; // in minutes
        const correctKeystrokes = this.keystrokes.filter(k => k.correct).length;
        const totalKeystrokes = this.keystrokes.length;
        const errorCount = this.countErrors();
        
        // Raw WPM: All keystrokes / 5 / time
        const rawWPM = Math.round((totalKeystrokes / 5) / timeElapsed) || 0;
        
        // Net WPM: (Correct keystrokes / 5 - errors) / time
        const netWPM = Math.max(0, Math.round(((correctKeystrokes / 5) - errorCount) / timeElapsed)) || 0;
        
        return { raw: rawWPM, net: netWPM };
    }
    
    getCorrectCharacters() {
        const inputValue = this.textInput.value;
        let correctChars = 0;
        
        for (let i = 0; i < inputValue.length && i < this.currentText.length; i++) {
            if (inputValue[i] === this.currentText[i]) {
                correctChars++;
            }
        }
        
        return correctChars;
    }
    
    calculateAccuracy() {
        if (this.totalTyped === 0) return 100;
        
        const correctChars = this.getCorrectCharacters();
        return Math.round((correctChars / this.totalTyped) * 100);
    }
    
    countErrors() {
        const inputValue = this.textInput.value;
        let errorCount = 0;
        
        for (let i = 0; i < inputValue.length && i < this.currentText.length; i++) {
            if (inputValue[i] !== this.currentText[i]) {
                errorCount++;
            }
        }
        
        return errorCount;
    }
    
    updateStats() {
        const { raw, net } = this.calculateAdvancedWPM();
        const accuracy = this.calculateAccuracy();
        const errors = this.countErrors();
        
        this.rawWPM = raw;
        this.netWPM = net;
        
        this.wpmElement.textContent = net; // Display net WPM as primary metric
        this.accuracyElement.textContent = accuracy + '%';
        this.errorsElement.textContent = errors;
    }
    
    endTest() {
        this.isTestActive = false;
        this.endTime = performance.now();
        
        clearInterval(this.timerInterval);
        
        this.textInput.disabled = true;
        this.startBtn.disabled = false;
        this.timeSelect.disabled = false;
        this.difficultySelect.disabled = false;
        this.keyboardContainer.style.display = 'none';
        
        this.saveScore();
        this.showResults();
        this.generateErrorHeatmap();
        this.playSound('finish');
    }
    
    saveScore() {
        const score = {
            wpm: this.netWPM,
            rawWpm: this.rawWPM,
            accuracy: this.calculateAccuracy(),
            errors: this.countErrors(),
            difficulty: this.difficulty,
            duration: this.timeLimit,
            date: new Date().toISOString(),
            totalChars: this.totalTyped,
            correctChars: this.getCorrectCharacters()
        };
        
        this.highScores.push(score);
        this.highScores.sort((a, b) => b.wpm - a.wpm);
        this.highScores = this.highScores.slice(0, 10); // Keep top 10
        
        try {
            // Using regular variables instead of localStorage since it's not supported
            this.saveHighScoresToMemory();
        } catch (error) {
            console.log('Score saved to session memory only');
        }
    }
    
    saveHighScoresToMemory() {
        // Store in memory for the session
        window.typingTestScores = this.highScores;
    }
    
    loadHighScores() {
        try {
            // Load from session memory if available
            this.highScores = window.typingTestScores || [];
        } catch (error) {
            this.highScores = [];
        }
    }
    
    showResults() {
        const finalWpm = this.netWPM;
        const finalRawWpm = this.rawWPM;
        const finalAccuracy = this.calculateAccuracy();
        const correctChars = this.getCorrectCharacters();
        const totalErrors = this.countErrors();
        
        document.getElementById('finalWpm').textContent = `${finalWpm} (Raw: ${finalRawWpm})`;
        document.getElementById('finalAccuracy').textContent = finalAccuracy + '%';
        document.getElementById('totalChars').textContent = this.totalTyped;
        document.getElementById('correctChars').textContent = correctChars;
        document.getElementById('totalErrors').textContent = totalErrors;
        
        this.resultsDiv.style.display = 'block';
        
        // Scroll to results
        this.resultsDiv.scrollIntoView({ behavior: 'smooth' });
    }
    
    generateErrorHeatmap() {
        const heatmapContainer = document.getElementById('heatmapContainer');
        heatmapContainer.innerHTML = '';
        
        // Find max errors for normalization
        const maxErrors = Math.max(...Array.from(this.errorMap.values()));
        
        if (maxErrors === 0) {
            heatmapContainer.innerHTML = '<p>No errors detected! Perfect typing!</p>';
            this.errorHeatmap.style.display = 'block';
            return;
        }
        
        for (let i = 0; i < this.currentText.length; i++) {
            const char = this.currentText[i];
            const errors = this.errorMap.get(i) || 0;
            const intensity = errors / maxErrors;
            
            const charElement = document.createElement('div');
            charElement.classList.add('heatmap-char');
            charElement.textContent = char === ' ' ? '␣' : char;
            charElement.setAttribute('data-errors', errors);
            
            // Color based on error intensity
            const red = Math.floor(255 * intensity);
            const green = Math.floor(255 * (1 - intensity));
            const blue = 100;
            
            charElement.style.backgroundColor = `rgb(${red}, ${green}, ${blue})`;
            charElement.style.color = intensity > 0.5 ? 'white' : 'black';
            
            heatmapContainer.appendChild(charElement);
        }
        
        this.errorHeatmap.style.display = 'block';
    }
    
    showHighScores() {
        const content = document.getElementById('highScoresContent');
        content.innerHTML = '';
        
        if (this.highScores.length === 0) {
            content.innerHTML = '<p>No high scores yet. Complete a test to see your results here!</p>';
        } else {
            this.highScores.forEach((score, index) => {
                const scoreEntry = document.createElement('div');
                scoreEntry.classList.add('score-entry');
                
                scoreEntry.innerHTML = `
                    <div class="score-rank">#${index + 1}</div>
                    <div class="score-details">
                        <div class="score-wpm">${score.wpm} WPM</div>
                        <div class="score-meta">
                            ${score.accuracy}% accuracy • ${score.errors} errors • ${score.difficulty} • ${score.duration}s
                        </div>
                    </div>
                    <div class="score-date">
                        ${new Date(score.date).toLocaleDateString()}
                    </div>
                `;
                
                content.appendChild(scoreEntry);
            });
        }
        
        this.highScoresModal.style.display = 'flex';
    }
    
    hideHighScores() {
        this.highScoresModal.style.display = 'none';
    }
    
    clearHighScores() {
        if (confirm('Are you sure you want to clear all high scores?')) {
            this.highScores = [];
            this.saveHighScoresToMemory();
            this.showHighScores(); // Refresh the display
        }
    }
    
    resetTest() {
        this.isTestActive = false;
        clearInterval(this.timerInterval);
        clearInterval(this.countdownInterval);
        
        this.currentIndex = 0;
        this.errors = 0;
        this.totalTyped = 0;
        this.startTime = null;
        this.endTime = null;
        this.timeLeft = this.timeLimit;
        this.keystrokes = [];
        this.rawWPM = 0;
        this.netWPM = 0;
        
        this.textInput.value = '';
        this.textInput.disabled = true;
        this.startBtn.disabled = false;
        this.timeSelect.disabled = false;
        this.difficultySelect.disabled = false;
        
        this.timerElement.textContent = this.timeLimit;
        this.wpmElement.textContent = '0';
        this.accuracyElement.textContent = '100%';
        this.errorsElement.textContent = '0';
        
        this.resultsDiv.style.display = 'none';
        this.errorHeatmap.style.display = 'none';
        this.keyboardContainer.style.display = 'none';
        this.countdownOverlay.style.display = 'none';
        
        // Remove keyboard highlights
        document.querySelectorAll('.key.active, .key.error').forEach(k => {
            k.classList.remove('active', 'error');
        });
        
        this.generateNewText();
    }
    
    changeTimeLimit(e) {
        this.timeLimit = parseInt(e.target.value);
        this.timeLeft = this.timeLimit;
        this.timerElement.textContent = this.timeLimit;
    }
    
    changeDifficulty(e) {
        this.difficulty = e.target.value;
        this.generateNewText();
    }
}

// Initialize the typing speed test when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const typingTest = new TypingSpeedTest();
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey || e.metaKey) {
            switch (e.key) {
                case 'Enter':
                    e.preventDefault();
                    if (!typingTest.isTestActive) {
                        typingTest.startCountdown();
                    }
                    break;
                case 'r':
                    e.preventDefault();
                    typingTest.resetTest();
                    break;
            }
        }
        
        if (e.key === 'Escape') {
            if (typingTest.highScoresModal.style.display === 'flex') {
                typingTest.hideHighScores();
            }
        }
    });
    
    // Create synthetic audio data for sound effects
    const createAudioData = (frequency, duration, type = 'sine') => {
        const sampleRate = 44100;
        const samples = sampleRate * duration;
        const buffer = new ArrayBuffer(44 + samples * 2);
        const view = new DataView(buffer);
        
        // WAV header
        const writeString = (offset, string) => {
            for (let i = 0; i < string.length; i++) {
                view.setUint8(offset + i, string.charCodeAt(i));
            }
        };
        
        writeString(0, 'RIFF');
        view.setUint32(4, 36 + samples * 2, true);
        writeString(8, 'WAVE');
        writeString(12, 'fmt ');
        view.setUint32(16, 16, true);
        view.setUint16(20, 1, true);
        view.setUint16(22, 1, true);
        view.setUint32(24, sampleRate, true);
        view.setUint32(28, sampleRate * 2, true);
        view.setUint16(32, 2, true);
        view.setUint16(34, 16, true);
        writeString(36, 'data');
        view.setUint32(40, samples * 2, true);
        
        // Generate audio samples
        for (let i = 0; i < samples; i++) {
            const t = i / sampleRate;
            let sample = 0;
            
            if (type === 'correct') {
                sample = Math.sin(2 * Math.PI * frequency * t) * Math.exp(-t * 3);
            } else if (type === 'incorrect') {
                sample = (Math.random() * 2 - 1) * Math.exp(-t * 5);
            }
            
            const intSample = Math.max(-32767, Math.min(32767, sample * 32767));
            view.setInt16(44 + i * 2, intSample, true);
        }
        
        return buffer;
    };
    
    // Set up audio with synthetic data
    try {
        const correctBuffer = createAudioData(800, 0.1, 'correct');
        const incorrectBuffer = createAudioData(200, 0.15, 'incorrect');
        
        const correctBlob = new Blob([correctBuffer], { type: 'audio/wav' });
        const incorrectBlob = new Blob([incorrectBuffer], { type: 'audio/wav' });
        
        typingTest.correctSound.src = URL.createObjectURL(correctBlob);
        typingTest.incorrectSound.src = URL.createObjectURL(incorrectBlob);
    } catch (error) {
        console.log('Audio initialization failed, continuing without sound');
        typingTest.soundEnabled = false;
    }
});

// Utility functions
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// Prevent right-click context menu on the text display to avoid cheating
document.addEventListener('contextmenu', (e) => {
    if (e.target.closest('.text-display')) {
        e.preventDefault();
    }
});

// Prevent text selection on the text display
document.addEventListener('selectstart', (e) => {
    if (e.target.closest('.text-display')) {
        e.preventDefault();
    }
});

// Add sound toggle functionality
document.addEventListener('keydown', (e) => {
    if (e.key === 'm' || e.key === 'M') {
        const typingTest = window.typingTest;
        if (typingTest) {
            typingTest.soundEnabled = !typingTest.soundEnabled;
            
            // Show sound indicator
            let indicator = document.querySelector('.sound-indicator');
            if (!indicator) {
                indicator = document.createElement('div');
                indicator.classList.add('sound-indicator');
                document.body.appendChild(indicator);
            }
            
            indicator.textContent = typingTest.soundEnabled ? '🔊 Sound ON' : '🔇 Sound OFF';
            indicator.classList.add('show');
            
            setTimeout(() => {
                indicator.classList.remove('show');
            }, 2000);
        }
    }
});