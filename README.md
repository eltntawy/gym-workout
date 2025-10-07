# Gym Workout Planner

An interactive web application for managing workout programs with a modular, data-driven architecture.

## Features

- **5-Day Workout Split**: Push, Pull, and Legs routine designed for beginners
- **Warmup Routines**: Each workout day includes a 2-minute warmup with options:
  - 🏃 Treadmill (light jog or brisk walk)
  - 🚴 Stationary Bike (moderate pace cycling)
  - 🚣 Rowing Machine (steady rowing for full body engagement)
- **Exercise Details**: Complete exercise information including sets, reps, rest periods, and form tips
- **Video Demonstrations**: Direct links to YouTube demos for each exercise
- **Responsive Design**: Mobile-friendly interface optimized for gym use
- **Modular Architecture**: JSON-based data structure for easy program management

## Architecture

### Overview

The application uses a modular architecture that separates data from presentation:

```
gym-workout/
├── index.html          # Main HTML structure
├── app.js              # Application logic and rendering
└── data/
    └── beginner-5day.json  # Workout program data
```

### Data Structure

Workout programs are defined in JSON files in the `data/` directory. Each program includes:

- **Program metadata**: Name, description, goals, and safety information
- **Weekly structure**: Duration for warmup, workout, cardio, and cooldown
- **Warmup options**: Multiple warmup exercises to choose from
- **Days**: Array of workout days with exercises
- **Exercise details**: Name, emoji, sets, reps, notes, rest periods, and video links
- **Cooldown**: Cardio and stretching routines

### Adding New Programs

To add a new workout program:

1. Create a new JSON file in the `data/` directory (e.g., `intermediate-program.json`)
2. Follow the same structure as `beginner-5day.json`
3. Update `app.js` to include the new program in the `loadPrograms()` method
4. (Optional) Add a program selector UI to switch between programs

### Example JSON Structure

```json
{
  "id": "program-id",
  "name": "Program Name",
  "description": "Program description",
  "goals": {
    "primary": "Primary goal",
    "safety": "Safety information"
  },
  "warmupOptions": [
    {
      "name": "Exercise Name",
      "duration": "2 minutes",
      "description": "Exercise description",
      "emoji": "🏃"
    }
  ],
  "days": [
    {
      "id": "day1",
      "name": "Day 1: Workout Type",
      "exercises": [...]
    }
  ]
}
```

## Usage

Simply open `index.html` in a web browser. The application will:

1. Load the workout program data from JSON
2. Render the program overview and weekly structure
3. Display workout days with warmup options and exercises
4. Allow navigation between days using tabs

## Customization

- **Styling**: Modify the Tailwind CSS classes in `index.html` or `app.js`
- **Warmup duration**: Update the duration in the JSON file
- **Exercise order**: Rearrange exercises in the JSON file
- **Add new exercises**: Add exercise objects to the day's exercises array

## Browser Compatibility

The application uses modern JavaScript features:
- Fetch API for loading JSON data
- Async/await for asynchronous operations
- ES6 classes and arrow functions

Recommended browsers: Chrome, Firefox, Safari, Edge (latest versions)

## License

Apache License 2.0 - See LICENSE file for details