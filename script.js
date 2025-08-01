class TypingSpeedTest {
    constructor() {
        this.testTexts = [
            "The quick brown fox jumps over the lazy dog. This pangram contains every letter of the alphabet and is commonly used for typing practice. It's a simple sentence that helps test keyboard skills and typing speed.",
            "In a hole in the ground there lived a hobbit. Not a nasty, dirty, wet hole, filled with the ends of worms and an oozy smell, nor yet a dry, bare, sandy hole with nothing in it to sit down on or to eat.",
            "To be or not to be, that is the question. Whether 'tis nobler in the mind to suffer the slings and arrows of outrageous fortune, or to take arms against a sea of troubles and by opposing end them.",
            "It was the best of times, it was the worst of times. It was the age of wisdom, it was the age of foolishness. It was the epoch of belief, it was the epoch of incredulity, it was the season of light.",
            "Science is a way of thinking much more than it is a body of knowledge. It is a process of discovery that allows us to link isolated facts into coherent theories and understand the world around us better.",
            "The art of programming is the skill of controlling complexity. The great programs are written not in any particular language, but in the language of clear thought and logical expression.",
            "Success is not final, failure is not fatal. It is the courage to continue that counts. The difference between ordinary and extraordinary is that little extra effort and persistence in the face of challenges."
        ];
        
        this.currentText = '';
        this.currentIndex = 0;
        this.startTime = null;
        this.endTime = null;
        this.timerInterval = null;
        this.isTestActive = false;
        this.timeLimit = 60;
        this.timeLeft = 60;
        this.errors = 0;
        this.totalTyped = 0;
        
        this.initializeElements();
        this.setupEventListeners();
        this.generateNewText();
    }
    
    initializeElements() {
        this.textDisplay = document.getElementById('textDisplay');
        this.textInput = document.getElementById('textInput');
        this.startBtn = document.getElementById('startBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.timeSelect = document.getElementById('timeSelect');
        this.timerElement = document.getElementById('timer');
        this.wpmElement = document.getElementById('wpm');
        this.accuracyElement = document.getElementById('accuracy');
        this.errorsElement = document.getElementById('errors');
        this.resultsDiv = document.getElementById('results');
    }
    
    setupEventListeners() {
        this.startBtn.addEventListener('click', () => this.startTest());
        this.resetBtn.addEventListener('click', () => this.resetTest());
        this.textInput.addEventListener('input', (e) => this.handleInput(e));
        this.textInput.addEventListener('keydown', (e) => this.handleKeyDown(e));
        this.timeSelect.addEventListener('change', (e) => this.changeTimeLimit(e));
    }
    
    generateNewText() {
        const randomIndex = Math.floor(Math.random() * this.testTexts.length);
        this.currentText = this.testTexts[randomIndex];
        this.displayText();
    }
    
    displayText() {
        this.textDisplay.innerHTML = '';
        
        for (let i = 0; i < this.currentText.length; i++) {
            const span = document.createElement('span');
            span.textContent = this.currentText[i];
            span.classList.add('char');
            
            if (i === 0) {
                span.classList.add('current');
            }
            
            this.textDisplay.appendChild(span);
        }
    }
    
    startTest() {
        this.isTestActive = true;
        this.startTime = new Date().getTime();
        this.currentIndex = 0;
        this.errors = 0;
        this.totalTyped = 0;
        this.timeLeft = this.timeLimit;
        
        this.textInput.disabled = false;
        this.textInput.focus();
        this.textInput.value = '';
        this.startBtn.disabled = true;
        this.timeSelect.disabled = true;
        this.resultsDiv.style.display = 'none';
        
        this.startTimer();
        this.updateStats();
    }
    
    startTimer() {
        this.timerInterval = setInterval(() => {
            this.timeLeft--;
            this.timerElement.textContent = this.timeLeft;
            
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
        this.updateTextDisplay(inputValue);
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
    }
    
    updateTextDisplay(inputValue) {
        const chars = this.textDisplay.querySelectorAll('.char');
        
        chars.forEach((char, index) => {
            char.classList.remove('correct', 'incorrect', 'current');
            
            if (index < inputValue.length) {
                if (inputValue[index] === this.currentText[index]) {
                    char.classList.add('correct');
                } else {
                    char.classList.add('incorrect');
                }
            } else if (index === inputValue.length) {
                char.classList.add('current');
            }
        });
    }
    
    calculateWPM() {
        if (!this.startTime) return 0;
        
        const timeElapsed = (new Date().getTime() - this.startTime) / 1000 / 60; // in minutes
        const correctChars = this.getCorrectCharacters();
        const wordsTyped = correctChars / 5; // Standard: 5 characters = 1 word
        
        return Math.round(wordsTyped / timeElapsed) || 0;
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
        const wpm = this.calculateWPM();
        const accuracy = this.calculateAccuracy();
        const errors = this.countErrors();
        
        this.wpmElement.textContent = wpm;
        this.accuracyElement.textContent = accuracy + '%';
        this.errorsElement.textContent = errors;
    }
    
    endTest() {
        this.isTestActive = false;
        this.endTime = new Date().getTime();
        
        clearInterval(this.timerInterval);
        
        this.textInput.disabled = true;
        this.startBtn.disabled = false;
        this.timeSelect.disabled = false;
        
        this.showResults();
    }
    
    showResults() {
        const finalWpm = this.calculateWPM();
        const finalAccuracy = this.calculateAccuracy();
        const correctChars = this.getCorrectCharacters();
        const totalErrors = this.countErrors();
        
        document.getElementById('finalWpm').textContent = finalWpm;
        document.getElementById('finalAccuracy').textContent = finalAccuracy + '%';
        document.getElementById('totalChars').textContent = this.totalTyped;
        document.getElementById('correctChars').textContent = correctChars;
        document.getElementById('totalErrors').textContent = totalErrors;
        
        this.resultsDiv.style.display = 'block';
        
        // Scroll to results
        this.resultsDiv.scrollIntoView({ behavior: 'smooth' });
    }
    
    resetTest() {
        this.isTestActive = false;
        clearInterval(this.timerInterval);
        
        this.currentIndex = 0;
        this.errors = 0;
        this.totalTyped = 0;
        this.startTime = null;
        this.endTime = null;
        this.timeLeft = this.timeLimit;
        
        this.textInput.value = '';
        this.textInput.disabled = true;
        this.startBtn.disabled = false;
        this.timeSelect.disabled = false;
        
        this.timerElement.textContent = this.timeLimit;
        this.wpmElement.textContent = '0';
        this.accuracyElement.textContent = '100%';
        this.errorsElement.textContent = '0';
        
        this.resultsDiv.style.display = 'none';
        
        this.generateNewText();
    }
    
    changeTimeLimit(e) {
        this.timeLimit = parseInt(e.target.value);
        this.timeLeft = this.timeLimit;
        this.timerElement.textContent = this.timeLimit;
    }
}

// Initialize the typing speed test when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new TypingSpeedTest();
});

// Additional utility functions
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