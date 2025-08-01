# Typing Speed Test

A modern, feature-rich typing speed test application that measures your typing speed (WPM), accuracy, and provides detailed analysis of your performance.
# ScreenShot

<img width="614" height="401" alt="Add a subheading" src="https://github.com/user-attachments/assets/de185e74-c112-4514-8226-8648c11e0a29" />



## Features

- **Multiple Difficulty Levels**: Choose from Easy, Medium, Hard, and Expert text samples
- **Customizable Test Duration**: 30 seconds, 1 minute, 2 minutes, or 5 minutes
- **Real-time Statistics**: 
  - Words Per Minute (WPM)
  - Accuracy percentage
  - Error count
  - Time remaining
- **Visual Keyboard**: Shows current and next expected keys
- **Error Heatmap**: Visual representation of where mistakes occur
- **Detailed Results**: Comprehensive test summary with raw and net WPM
- **High Scores**: Track your best performances
- **Responsive Design**: Works on desktop and mobile devices

## How to Use

1. **Select Test Options**:
   - Choose your preferred test duration
   - Select a difficulty level
2. **Start the Test**:
   - Click "Start Test" or press Ctrl+Enter
   - A 3-second countdown will begin
3. **Type the Text**:
   - Type the displayed text as quickly and accurately as possible
   - Current character is highlighted in blue
   - Correct characters turn green, incorrect ones turn red
4. **View Results**:
   - After time expires or you complete the text, results will display
   - Review your WPM, accuracy, and error analysis
5. **Improve**:
   - Use the error heatmap to identify problem areas
   - Try different difficulty levels to challenge yourself

## Keyboard Shortcuts

- **Ctrl+Enter**: Start test
- **Ctrl+R**: Reset test
- **Esc**: Close high scores modal

## Technical Details

- **WPM Calculation**: 
  - Raw WPM: All keystrokes divided by 5 (standard word length) per minute
  - Net WPM: (Correct keystrokes divided by 5 minus errors) per minute
- **Accuracy**: Percentage of correctly typed characters
- **Error Tracking**: Records position and frequency of mistakes

## Installation

No installation required! Simply open `index.html` in your web browser.

For local development:
1. Clone this repository
2. Open the project folder
3. Launch `index.html` in your browser

## Technologies Used

- HTML5
- CSS3 (with Flexbox and Grid)
- JavaScript (ES6+)
- Web Audio API (for sound effects)

## Future Improvements

- Add user accounts for persistent high scores
- Implement typing drills for common error patterns
- Add multiplayer/competitive mode
- Include more detailed progress tracking

## License

This project is open source and available under the [MIT License](LICENSE).

---

**Happy Typing!** 🚀
