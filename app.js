// Workout App - Modular Architecture
class WorkoutApp {
    constructor() {
        this.currentProgram = null;
        this.programs = [];
        this.programsMetadata = [];
    }

    async init() {
        await this.loadPrograms();
        this.showWelcomePage();
        this.setupEventListeners();
    }

    async loadPrograms() {
        // Load available programs
        // Multiple programs available for different training goals
        this.programs = ['arturos-workout', 'mohamed-ali-workout'];
        
        // Load metadata for each program in parallel
        const loadPromises = this.programs.map(async (programId) => {
            try {
                const response = await fetch(`data/${programId}.json`);
                const data = await response.json();
                return {
                    id: programId,
                    name: data.name,
                    description: data.description,
                    goals: data.goals,
                    structure: data.structure
                };
            } catch (error) {
                console.error(`Error loading program ${programId}:`, error);
                return null;
            }
        });
        
        const results = await Promise.all(loadPromises);
        this.programsMetadata = results.filter(program => program !== null);
    }

    showWelcomePage() {
        // Hide program view and show welcome page
        const programView = document.getElementById('program-view');
        const welcomePage = document.getElementById('welcome-page');
        
        if (programView) {
            programView.classList.add('hidden');
        }
        if (welcomePage) {
            welcomePage.classList.remove('hidden');
        }
        
        // Render program selection cards
        this.renderProgramSelection();
    }

    renderProgramSelection() {
        const container = document.getElementById('program-selection');
        if (!container) return;
        
        container.innerHTML = '';
        
        this.programsMetadata.forEach(program => {
            const card = document.createElement('div');
            card.className = 'bg-white dark:bg-slate-900 rounded-xl shadow-lg dark:shadow-slate-950/50 p-6 border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-600 transition-all cursor-pointer';
            
            card.innerHTML = `
                <div class="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
                    <div class="flex-1">
                        <h2 class="text-2xl font-bold text-blue-700 dark:text-blue-400 mb-2">${program.name}</h2>
                        <p class="text-slate-600 dark:text-slate-400 mb-4">${program.description}</p>
                        
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                            <div class="bg-emerald-50 dark:bg-emerald-950/30 border-l-4 border-emerald-500 dark:border-emerald-600 p-3 rounded-r">
                                <h3 class="font-semibold text-sm text-emerald-900 dark:text-emerald-400 mb-1">🎯 Primary Goal</h3>
                                <p class="text-xs text-slate-700 dark:text-slate-300">${program.goals.primary}</p>
                            </div>
                            <div class="bg-blue-50 dark:bg-blue-950/30 border-l-4 border-blue-500 dark:border-blue-600 p-3 rounded-r">
                                <h3 class="font-semibold text-sm text-blue-900 dark:text-blue-400 mb-1">📋 Structure</h3>
                                <p class="text-xs text-slate-700 dark:text-slate-300">
                                    Warmup: ${program.structure.warmup} • Workout: ${program.structure.workout}<br>
                                    Cardio: ${program.structure.cardio} • Cooldown: ${program.structure.cooldown}
                                </p>
                            </div>
                        </div>
                    </div>
                    <button class="select-program-btn bg-blue-600 dark:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors shadow-md dark:shadow-slate-950/50 shrink-0 w-full sm:w-auto" data-program="${program.id}">
                        Start Program →
                    </button>
                </div>
            `;
            
            container.appendChild(card);
        });
    }

    async loadProgram(programId) {
        try {
            const response = await fetch(`data/${programId}.json`);
            this.currentProgram = await response.json();
            
            // Hide welcome page and show program view
            const welcomePage = document.getElementById('welcome-page');
            const programView = document.getElementById('program-view');
            
            if (welcomePage) {
                welcomePage.classList.add('hidden');
            }
            if (programView) {
                programView.classList.remove('hidden');
            }
            
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
            button.className = 'tab-btn flex-1 sm:flex-initial py-3 px-3 sm:px-4 text-sm sm:text-base font-semibold border-b-2 min-w-[80px] transition-colors';
            
            if (index === 0) {
                button.classList.add('border-blue-600', 'dark:border-blue-500', 'text-blue-700', 'dark:text-blue-400', 'bg-white', 'dark:bg-slate-900', 'rounded-t-lg', 'shadow-sm', 'dark:shadow-slate-950/50');
            } else {
                button.classList.add('border-transparent', 'text-slate-500', 'dark:text-slate-400', 'hover:bg-slate-100', 'dark:hover:bg-slate-800');
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
        section.className = 'bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-emerald-950/30 dark:to-blue-950/30 rounded-xl shadow-lg dark:shadow-slate-950/50 p-4 sm:p-5 border-2 border-emerald-300 dark:border-emerald-800';
        
        let warmupHTML = `
            <h3 class="text-lg font-bold text-emerald-700 dark:text-emerald-400 mb-3">🔥 Warm-up (2 Minutes)</h3>
            <p class="text-sm text-slate-700 dark:text-slate-300 mb-3">Choose one of the following options to prepare your body:</p>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
        `;

        this.currentProgram.warmupOptions.forEach(option => {
            warmupHTML += `
                <div class="bg-white dark:bg-slate-900 rounded-lg p-3 border border-emerald-200 dark:border-slate-700 shadow-sm dark:shadow-slate-950/50">
                    <div class="flex items-center mb-2">
                        <span class="text-2xl mr-2">${option.emoji}</span>
                        <span class="font-semibold text-slate-900 dark:text-slate-100">${option.name}</span>
                    </div>
                    <p class="text-xs text-slate-600 dark:text-slate-400">${option.description}</p>
                    <p class="text-xs text-emerald-700 dark:text-emerald-400 font-semibold mt-1">Duration: ${option.duration}</p>
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
        card.className = 'bg-white dark:bg-slate-900 rounded-xl shadow-lg dark:shadow-slate-950/50 p-4 sm:p-5 border border-slate-200 dark:border-slate-800';
        
        card.innerHTML = `
            <div class="flex flex-col sm:flex-row justify-between sm:items-center">
                <div class="flex-1">
                    <h3 class="text-lg font-bold text-slate-900 dark:text-slate-100">${exercise.emoji} ${exercise.name}</h3>
                    <p class="text-sm text-slate-600 dark:text-slate-400 mt-1">
                        <span class="font-semibold">Sets:</span> ${exercise.sets} | 
                        <span class="font-semibold">Reps:</span> ${exercise.reps} | 
                        ${exercise.notes}
                    </p>
                    <p class="text-xs text-amber-600 dark:text-amber-400 mt-1">⏱️ <span class="font-semibold">Rest:</span> ${exercise.rest}</p>
                </div>
                <a href="https://www.youtube.com/results?search_query=${exercise.videoQuery}" 
                   target="_blank" 
                   class="mt-3 sm:mt-0 sm:ml-4 inline-block bg-blue-600 dark:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg text-sm text-center hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors shadow-md dark:shadow-slate-950/50 shrink-0 w-full sm:w-auto">
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
            <h2 class="text-xl font-bold mb-4 text-blue-700 dark:text-blue-400">Cardio & Stretch (Cool-down)</h2>
            <div class="space-y-4">
                <div class="bg-white dark:bg-slate-900 rounded-xl shadow-lg dark:shadow-slate-950/50 p-5 border border-slate-200 dark:border-slate-800">
                    <div class="flex flex-col sm:flex-row justify-between sm:items-center">
                        <div>
                            <h3 class="text-lg font-bold text-slate-900 dark:text-slate-100">${cardio.emoji} ${cardio.name}</h3>
                            <p class="text-sm text-slate-600 dark:text-slate-400 mt-1">${cardio.description}</p>
                        </div>
                    </div>
                </div>
                <div class="bg-white dark:bg-slate-900 rounded-xl shadow-lg dark:shadow-slate-950/50 p-5 border border-slate-200 dark:border-slate-800">
                    <div class="flex flex-col sm:flex-row justify-between sm:items-center">
                        <div>
                            <h3 class="text-lg font-bold text-slate-900 dark:text-slate-100">${stretch.emoji} ${stretch.name}</h3>
                            <p class="text-sm text-slate-600 dark:text-slate-400 mt-1">${stretch.description}</p>
                        </div>
                        <a href="https://www.youtube.com/results?search_query=${stretch.videoQuery}" 
                           target="_blank" 
                           class="mt-3 sm:mt-0 sm:ml-4 inline-block bg-blue-600 dark:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg text-sm text-center hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors shadow-md dark:shadow-slate-950/50 shrink-0">
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
        
        // Program selection buttons
        document.addEventListener('click', (event) => {
            const selectBtn = event.target.closest('.select-program-btn');
            if (selectBtn) {
                const programId = selectBtn.getAttribute('data-program');
                this.loadProgram(programId);
            }
        });
        
        // Back to selection button
        const backBtn = document.getElementById('back-to-selection');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                this.showWelcomePage();
            });
        }
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
            btn.classList.remove('border-blue-600', 'dark:border-blue-500', 'text-blue-700', 'dark:text-blue-400', 'bg-white', 'dark:bg-slate-900', 'rounded-t-lg', 'shadow-sm', 'dark:shadow-slate-950/50');
            btn.classList.add('border-transparent', 'text-slate-500', 'dark:text-slate-400', 'hover:bg-slate-100', 'dark:hover:bg-slate-800');
        });

        activeButton.classList.add('border-blue-600', 'dark:border-blue-500', 'text-blue-700', 'dark:text-blue-400', 'bg-white', 'dark:bg-slate-900', 'rounded-t-lg', 'shadow-sm', 'dark:shadow-slate-950/50');
        activeButton.classList.remove('border-transparent', 'text-slate-500', 'dark:text-slate-400', 'hover:bg-slate-100', 'dark:hover:bg-slate-800');
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new WorkoutApp();
    app.init();
});
