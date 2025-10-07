// Workout App - Modular Architecture
class WorkoutApp {
    constructor() {
        this.currentProgram = null;
        this.programs = [];
    }

    async init() {
        await this.loadPrograms();
        if (this.programs.length > 0) {
            await this.loadProgram(this.programs[0]);
        }
        this.setupEventListeners();
    }

    async loadPrograms() {
        // Load available programs
        // For now, we have one program, but this can be extended
        this.programs = ['beginner-5day'];
    }

    async loadProgram(programId) {
        try {
            const response = await fetch(`data/${programId}.json`);
            this.currentProgram = await response.json();
            this.renderProgram();
        } catch (error) {
            console.error('Error loading program:', error);
        }
    }

    renderProgram() {
        if (!this.currentProgram) return;

        // Update header
        document.getElementById('program-title').textContent = this.currentProgram.name;
        document.getElementById('program-description').textContent = this.currentProgram.description;
        
        // Update goals
        document.getElementById('primary-goal').textContent = this.currentProgram.goals.primary;
        document.getElementById('safety-note').textContent = this.currentProgram.goals.safety;
        
        // Update structure
        document.getElementById('warmup-duration').textContent = this.currentProgram.structure.warmup;
        document.getElementById('workout-moves').textContent = this.currentProgram.structure.workout;
        document.getElementById('cardio-duration').textContent = this.currentProgram.structure.cardio;
        document.getElementById('cooldown-duration').textContent = this.currentProgram.structure.cooldown;

        // Render tabs
        this.renderTabs();
        
        // Render workout days
        this.renderWorkoutDays();
        
        // Render cooldown
        this.renderCooldown();
        
        // Show first day
        this.showDay('day1');
    }

    renderTabs() {
        const tabsContainer = document.getElementById('tabs-container');
        tabsContainer.innerHTML = '';
        
        this.currentProgram.days.forEach((day, index) => {
            const button = document.createElement('button');
            button.setAttribute('data-day', day.id);
            button.className = 'tab-btn flex-1 sm:flex-initial py-3 px-3 sm:px-4 text-sm sm:text-base font-semibold border-b-2 min-w-[80px]';
            
            if (index === 0) {
                button.classList.add('border-teal-600', 'text-teal-700', 'bg-white', 'rounded-t-lg');
            } else {
                button.classList.add('border-transparent', 'text-stone-500', 'hover:bg-stone-50');
            }
            
            button.textContent = day.name;
            tabsContainer.appendChild(button);
        });
    }

    renderWorkoutDays() {
        const workoutContent = document.getElementById('workout-content');
        workoutContent.innerHTML = '';
        
        this.currentProgram.days.forEach((day, dayIndex) => {
            const dayDiv = document.createElement('div');
            dayDiv.id = day.id;
            dayDiv.className = 'workout-day space-y-4';
            if (dayIndex > 0) {
                dayDiv.classList.add('hidden');
            }

            // Add warmup section
            const warmupSection = this.createWarmupSection();
            dayDiv.appendChild(warmupSection);

            // Add exercises
            day.exercises.forEach(exercise => {
                const exerciseCard = this.createExerciseCard(exercise);
                dayDiv.appendChild(exerciseCard);
            });

            workoutContent.appendChild(dayDiv);
        });
    }

    createWarmupSection() {
        const section = document.createElement('div');
        section.className = 'bg-gradient-to-r from-teal-50 to-blue-50 rounded-xl shadow-sm p-4 sm:p-5 border-2 border-teal-200';
        
        let warmupHTML = `
            <h3 class="text-lg font-bold text-teal-800 mb-3">🔥 Warm-up (2 Minutes)</h3>
            <p class="text-sm text-stone-700 mb-3">Choose one of the following options to prepare your body:</p>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
        `;

        this.currentProgram.warmupOptions.forEach(option => {
            warmupHTML += `
                <div class="bg-white rounded-lg p-3 border border-teal-100">
                    <div class="flex items-center mb-2">
                        <span class="text-2xl mr-2">${option.emoji}</span>
                        <span class="font-semibold text-stone-800">${option.name}</span>
                    </div>
                    <p class="text-xs text-stone-600">${option.description}</p>
                    <p class="text-xs text-teal-700 font-semibold mt-1">Duration: ${option.duration}</p>
                </div>
            `;
        });

        warmupHTML += `
            </div>
        `;

        section.innerHTML = warmupHTML;
        return section;
    }

    createExerciseCard(exercise) {
        const card = document.createElement('div');
        card.className = 'bg-white rounded-xl shadow-sm p-4 sm:p-5';
        
        card.innerHTML = `
            <div class="flex flex-col sm:flex-row justify-between sm:items-center">
                <div class="flex-1">
                    <h3 class="text-lg font-bold text-stone-800">${exercise.emoji} ${exercise.name}</h3>
                    <p class="text-sm text-stone-600 mt-1">
                        <span class="font-semibold">Sets:</span> ${exercise.sets} | 
                        <span class="font-semibold">Reps:</span> ${exercise.reps} | 
                        ${exercise.notes}
                    </p>
                    <p class="text-xs text-amber-600 mt-1">⏱️ <span class="font-semibold">Rest:</span> ${exercise.rest}</p>
                </div>
                <a href="https://www.youtube.com/results?search_query=${exercise.videoQuery}" 
                   target="_blank" 
                   class="mt-3 sm:mt-0 sm:ml-4 inline-block bg-teal-600 text-white font-semibold py-2 px-4 rounded-lg text-sm text-center hover:bg-teal-700 transition-colors shrink-0 w-full sm:w-auto">
                    Watch Demo
                </a>
            </div>
        `;
        
        return card;
    }

    renderCooldown() {
        const cooldownSection = document.getElementById('cooldown-section');
        if (!cooldownSection) return;

        const cardio = this.currentProgram.cooldown.cardio;
        const stretch = this.currentProgram.cooldown.stretch;

        cooldownSection.innerHTML = `
            <h2 class="text-xl font-bold mb-4 text-teal-700">Cardio & Stretch (Cool-down)</h2>
            <div class="space-y-4">
                <div class="bg-white rounded-xl shadow-sm p-5">
                    <div class="flex flex-col sm:flex-row justify-between sm:items-center">
                        <div>
                            <h3 class="text-lg font-bold text-stone-800">${cardio.emoji} ${cardio.name}</h3>
                            <p class="text-sm text-stone-600 mt-1">${cardio.description}</p>
                        </div>
                    </div>
                </div>
                <div class="bg-white rounded-xl shadow-sm p-5">
                    <div class="flex flex-col sm:flex-row justify-between sm:items-center">
                        <div>
                            <h3 class="text-lg font-bold text-stone-800">${stretch.emoji} ${stretch.name}</h3>
                            <p class="text-sm text-stone-600 mt-1">${stretch.description}</p>
                        </div>
                        <a href="https://www.youtube.com/results?search_query=${stretch.videoQuery}" 
                           target="_blank" 
                           class="mt-3 sm:mt-0 sm:ml-4 inline-block bg-teal-600 text-white font-semibold py-2 px-4 rounded-lg text-sm text-center hover:bg-teal-700 transition-colors shrink-0">
                            View Stretching Guide
                        </a>
                    </div>
                </div>
            </div>
        `;
    }

    setupEventListeners() {
        const tabsContainer = document.getElementById('tabs-container');
        
        tabsContainer.addEventListener('click', (event) => {
            const button = event.target.closest('.tab-btn');
            if (button) {
                const dayId = button.getAttribute('data-day');
                this.showDay(dayId);
                this.setActiveTab(button);
            }
        });
    }

    showDay(dayId) {
        const workoutDays = document.querySelectorAll('.workout-day');
        workoutDays.forEach(day => {
            day.classList.add('hidden');
        });
        
        const targetDay = document.getElementById(dayId);
        if (targetDay) {
            targetDay.classList.remove('hidden');
        }
    }

    setActiveTab(activeButton) {
        const tabButtons = document.querySelectorAll('.tab-btn');
        tabButtons.forEach(btn => {
            btn.classList.remove('border-teal-600', 'text-teal-700', 'bg-white', 'rounded-t-lg');
            btn.classList.add('border-transparent', 'text-stone-500', 'hover:bg-stone-50');
        });

        activeButton.classList.add('border-teal-600', 'text-teal-700', 'bg-white', 'rounded-t-lg');
        activeButton.classList.remove('border-transparent', 'text-stone-500', 'hover:bg-stone-50');
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new WorkoutApp();
    app.init();
});
