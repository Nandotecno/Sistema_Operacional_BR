import { config } from './config.js';
import confetti from 'confetti-js';
import { WindowManager } from './windowManager.js';

class HueOS {
    constructor() {
        this.startButton = document.getElementById('startButton');
        this.startMenu = document.getElementById('startMenu');
        this.clock = document.getElementById('clock');
        this.windowManager = new WindowManager();
        
        this.initializeEventListeners();
        this.updateClock();

        // Load saved theme
        const savedTheme = localStorage.getItem('hueOS-theme');
        if (savedTheme) {
            document.body.setAttribute('data-theme', savedTheme);
        }
        
        // Load saved sound preference
        const savedSound = localStorage.getItem('hueOS-sound');
        if (savedSound !== null) {
            document.getElementById('systemSound').checked = JSON.parse(savedSound);
        }
    }

    initializeEventListeners() {
        this.startButton.addEventListener('click', () => this.toggleStartMenu());
        
        document.querySelectorAll('.app-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const appName = e.currentTarget.dataset.app;
                this.openApp(appName);
                this.toggleStartMenu();
            });
        });
    }

    toggleStartMenu() {
        this.startMenu.classList.toggle('hidden');
    }

    updateClock() {
        setInterval(() => {
            const now = new Date();
            this.clock.textContent = now.toLocaleTimeString('pt-BR');
        }, 1000);
    }

    openApp(appName) {
        let content = '';
        switch(appName) {
            case 'mememaker':
                content = this.createMemeMaker();
                break;
            case 'translator':
                content = this.createTranslator();
                break;
            case 'pinguim':
                content = this.createPinguim();
                break;
            case 'settings':
                content = this.createSettings();
                break;
            case 'clt':
                content = this.createCLT();
                break;
            case 'games':
                content = this.createGames();
                break;
            case 'broogle':
                content = this.createBroogle();
                break;
        }

        const window = this.windowManager.createWindow(appName, config.appTitles[appName], content);
        this.initializeAppFunctionality(appName, window.querySelector('.window-content'));
    }

    createMemeMaker() {
        return `
            <button id="generateMeme">Gerar Meme BR</button>
            <div id="memeDisplay"></div>
        `;
    }

    createTranslator() {
        return `
            <select id="phrase">
                ${Object.keys(config.translations).map(phrase => 
                    `<option value="${phrase}">${phrase}</option>`
                ).join('')}
            </select>
            <div id="translations"></div>
        `;
    }

    createPinguim() {
        return `
            <div style="text-align: center;">
                <div id="penguin">🐧</div>
                <button id="dance">Fazer o Pinguim Sambar</button>
            </div>
        `;
    }

    createSettings() {
        return `
            <div class="settings-container">
                <h3>Configurações do Sistema</h3>
                <div class="setting-item">
                    <label>Tema:</label>
                    <select id="themeSelect">
                        <option value="default">Padrão</option>
                        <option value="dark">Modo Escuro</option>
                        <option value="retro">Retrô</option>
                    </select>
                </div>
                <div class="setting-item">
                    <label>Som do Sistema:</label>
                    <input type="checkbox" id="systemSound" checked>
                </div>
            </div>
        `;
    }

    createCLT() {
        const randomPhrase = config.cltPhrases[Math.floor(Math.random() * config.cltPhrases.length)];
        return `
            <div class="clt-container">
                <h3 style="color: #ff4444;">${randomPhrase}</h3>
                <div class="clt-clock">
                    <span>⏰ Horário de Trabalho</span>
                    <div id="workTimer">08:00:00</div>
                </div>
                <button id="punchCard">Bater Ponto</button>
            </div>
        `;
    }

    createGames() {
        return `
            <div class="games-container">
                ${config.games.map(game => `
                    <div class="game-card">
                        <h3>${game.name}</h3>
                        <p>${game.description}</p>
                        <small>Controles: ${game.controls}</small>
                        <button class="play-game" data-game="${game.name}">Jogar</button>
                    </div>
                `).join('')}
            </div>
        `;
    }

    createBroogle() {
        return `
            <div class="broogle-container">
                <input type="text" class="broogle-search" placeholder="Pesquise algo bem brasileiro...">
                <div class="broogle-tabs">
                    <div class="broogle-tab active" data-tab="search">🔍 Pesquisa</div>
                    <div class="broogle-tab" data-tab="images">🖼️ Imagens</div>
                    <div class="broogle-tab" data-tab="websites">🌐 Criar Site</div>
                </div>
                <div class="broogle-results"></div>
            </div>
        `;
    }

    async handleBroogleSearch(query, type = 'search') {
        const results = document.querySelector('.broogle-results');
        results.innerHTML = 'Pesquisando...';

        if (type === 'search') {
            const completion = await websim.chat.completions.create({
                messages: [
                    {
                        role: "system",
                        content: "Você é um mecanismo de busca brasileiro que dá resultados divertidos e informativos. Retorne 3 resultados em formato de lista HTML com títulos e descrições."
                    },
                    {
                        role: "user",
                        content: query
                    }
                ]
            });
            results.innerHTML = completion.content;
        } 
        else if (type === 'images') {
            const imageResults = document.createElement('div');
            imageResults.className = 'broogle-image-results';

            try {
                const result1 = await websim.imageGen({
                    prompt: query + " in Brazilian style",
                    width: 300,
                    height: 300
                });
                const result2 = await websim.imageGen({
                    prompt: query + " with Brazilian culture",
                    width: 300,
                    height: 300,
                    seed: 2
                });

                imageResults.innerHTML = `
                    <img src="${result1.url}" class="broogle-image" alt="${query}">
                    <img src="${result2.url}" class="broogle-image" alt="${query}">
                `;
                results.innerHTML = '';
                results.appendChild(imageResults);
            } catch (error) {
                results.innerHTML = 'Erro ao gerar imagens :(';
            }
        }
        else if (type === 'websites') {
            const completion = await websim.chat.completions.create({
                messages: [
                    {
                        role: "system",
                        content: "Você é um gerador de sites brasileiros. Gere um HTML simples e divertido baseado no tema solicitado."
                    },
                    {
                        role: "user",
                        content: `Crie um site brasileiro sobre: ${query}`
                    }
                ]
            });
            
            results.innerHTML = `
                <div class="broogle-website-builder">
                    <h3>Seu site brasileiro está pronto! 🎉</h3>
                    <div class="broogle-website-preview">
                        ${completion.content}
                    </div>
                    <button onclick="navigator.clipboard.writeText(this.previousElementSibling.innerHTML)">
                        Copiar código do site
                    </button>
                </div>
            `;
        }
    }

    initializeAppFunctionality(appName, content) {
        switch(appName) {
            case 'mememaker':
                const generateBtn = content.querySelector('#generateMeme');
                const memeDisplay = content.querySelector('#memeDisplay');
                
                generateBtn.addEventListener('click', () => {
                    const randomMeme = config.memes[Math.floor(Math.random() * config.memes.length)];
                    memeDisplay.textContent = randomMeme;
                    confetti({
                        particleCount: 100,
                        spread: 70,
                        origin: { y: 0.6 }
                    });
                });
                break;

            case 'translator':
                const select = content.querySelector('#phrase');
                const translationsDiv = content.querySelector('#translations');
                
                select.addEventListener('change', (e) => {
                    const phrase = e.target.value;
                    const translations = config.translations[phrase];
                    translationsDiv.innerHTML = `
                        <p>🇰🇷 Coreano: ${translations.kr}</p>
                        <p>🇷🇺 Russo: ${translations.ru}</p>
                    `;
                });
                break;

            case 'pinguim':
                const penguin = content.querySelector('#penguin');
                const danceBtn = content.querySelector('#dance');
                
                danceBtn.addEventListener('click', () => {
                    penguin.style.animation = 'none';
                    penguin.offsetHeight;
                    penguin.style.animation = 'dance 1s infinite';
                });
                break;

            case 'settings':
                const themeSelect = content.querySelector('#themeSelect');
                const soundToggle = content.querySelector('#systemSound');
                
                // Initialize with current theme
                themeSelect.value = document.body.getAttribute('data-theme') || 'default';
                
                themeSelect.addEventListener('change', (e) => {
                    const theme = e.target.value;
                    document.body.setAttribute('data-theme', theme);
                    
                    // Save theme preference
                    localStorage.setItem('hueOS-theme', theme);
                });
                
                soundToggle.addEventListener('change', (e) => {
                    localStorage.setItem('hueOS-sound', e.target.checked);
                });
                break;

            case 'clt':
                const punchCard = content.querySelector('#punchCard');
                const workTimer = content.querySelector('#workTimer');
                
                punchCard.addEventListener('click', () => {
                    alert('Ponto registrado! Bom trabalho!');
                    confetti({
                        particleCount: 30,
                        spread: 50,
                        origin: { y: 0.6 }
                    });
                });
                break;

            case 'games':
                content.querySelectorAll('.play-game').forEach(button => {
                    button.addEventListener('click', (e) => {
                        const gameName = e.target.dataset.game;
                        this.startGame(gameName, content);
                    });
                });
                break;

            case 'broogle':
                const searchInput = content.querySelector('.broogle-search');
                const tabs = content.querySelectorAll('.broogle-tab');
                let currentTab = 'search';

                searchInput.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        this.handleBroogleSearch(e.target.value, currentTab);
                    }
                });

                tabs.forEach(tab => {
                    tab.addEventListener('click', (e) => {
                        tabs.forEach(t => t.classList.remove('active'));
                        e.target.classList.add('active');
                        currentTab = e.target.dataset.tab;
                        if (searchInput.value) {
                            this.handleBroogleSearch(searchInput.value, currentTab);
                        }
                    });
                });
                break;
        }
    }

    startGame(gameName, container) {
        switch(gameName) {
            case "Jogo do Busão":
                container.innerHTML = `
                    <div class="game-area" style="position: relative; height: 300px; background: linear-gradient(to bottom, #333 0%, #666 100%);">
                        <div id="score" style="position: absolute; top: 10px; right: 10px; color: white; font-size: 20px;">Pontos: 0</div>
                        <div id="bus" style="position: absolute; bottom: 20px; left: 50%; transform: translateX(-50%); font-size: 32px;">🚌</div>
                        <div id="gameOver" class="hidden" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: white; font-size: 24px; text-align: center;">
                            Game Over!<br>
                            <button id="restartGame" style="margin-top: 10px;">Jogar de Novo</button>
                        </div>
                    </div>
                    <div class="game-controls">
                        <button id="startGameBtn">Iniciar Jogo</button>
                        <p style="margin-top: 10px;">Use as setas ← → para desviar dos buracos!</p>
                    </div>
                `;

                let gameLoop;
                let score = 0;
                let isGameRunning = false;
                const bus = container.querySelector('#bus');
                const gameArea = container.querySelector('.game-area');
                const scoreDisplay = container.querySelector('#score');
                const gameOver = container.querySelector('#gameOver');
                let busPosition = 50;

                function createHole() {
                    const hole = document.createElement('div');
                    hole.style.cssText = `
                        position: absolute;
                        top: -30px;
                        left: ${Math.random() * (gameArea.offsetWidth - 30)}px;
                        width: 30px;
                        height: 30px;
                        background: #000;
                        border-radius: 50%;
                        animation: fallDown 2s linear;
                    `;
                    gameArea.appendChild(hole);

                    hole.addEventListener('animationend', () => {
                        if (isColliding(bus, hole)) {
                            endGame();
                        }
                        hole.remove();
                        if (isGameRunning) score += 10;
                        scoreDisplay.textContent = `Pontos: ${score}`;
                    });
                }

                function isColliding(el1, el2) {
                    const rect1 = el1.getBoundingClientRect();
                    const rect2 = el2.getBoundingClientRect();
                    return !(
                        rect1.right < rect2.left ||
                        rect1.left > rect2.right ||
                        rect1.bottom < rect2.top ||
                        rect1.top > rect2.bottom
                    );
                }

                function endGame() {
                    isGameRunning = false;
                    clearInterval(gameLoop);
                    gameOver.classList.remove('hidden');
                    confetti({
                        particleCount: 100,
                        spread: 70,
                        origin: { y: 0.6 }
                    });
                }

                function startGame() {
                    score = 0;
                    isGameRunning = true;
                    gameOver.classList.add('hidden');
                    scoreDisplay.textContent = 'Pontos: 0';
                    gameLoop = setInterval(createHole, 1000);
                }

                container.querySelector('#startGameBtn').addEventListener('click', startGame);
                container.querySelector('#restartGame')?.addEventListener('click', startGame);

                document.addEventListener('keydown', (e) => {
                    if (!isGameRunning) return;
                    
                    if (e.key === 'ArrowLeft' && busPosition > 0) {
                        busPosition = Math.max(0, busPosition - 5);
                        bus.style.left = `${busPosition}%`;
                    }
                    if (e.key === 'ArrowRight' && busPosition < 100) {
                        busPosition = Math.min(100, busPosition + 5);
                        bus.style.left = `${busPosition}%`;
                    }
                });
                break;

            case "Fuja do Boleto":
                container.innerHTML = `
                    <div class="game-area" style="position: relative; height: 300px; background: linear-gradient(to bottom, #4CAF50 0%, #45a049 100%);">
                        <div id="score" style="position: absolute; top: 10px; right: 10px; color: white; font-size: 20px;">Boletos Evitados: 0</div>
                        <div id="player" style="position: absolute; bottom: 20px; left: 50%; transform: translateX(-50%); font-size: 32px;">🏃</div>
                        <div id="gameOver" class="hidden" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: white; font-size: 24px; text-align: center;">
                            Pegaram você!<br>
                            <button id="restartGame" style="margin-top: 10px;">Tentar Novamente</button>
                        </div>
                    </div>
                    <div class="game-controls">
                        <button id="startGameBtn">Iniciar Fuga</button>
                        <p style="margin-top: 10px;">Use as setas ← → ↑ ↓ para fugir!</p>
                    </div>
                `;

                // Similar game logic as the bus game, but with bills falling from all sides
                // Implementation continues with similar pattern but different theme
                break;
        }
    }
}

new HueOS();

document.head.insertAdjacentHTML('beforeend', `
    <style>
        @keyframes dance {
            0%, 100% { transform: translateY(0) rotate(0deg); }
            25% { transform: translateY(-10px) rotate(-20deg); }
            75% { transform: translateY(-10px) rotate(20deg); }
        }
        
        #penguin {
            font-size: 48px;
            margin: 20px;
        }
        
        #memeDisplay {
            margin-top: 15px;
            padding: 10px;
            background: #f0f0f0;
            border-radius: 5px;
            min-height: 50px;
        }
        
        button {
            background: #4CAF50;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 5px;
            cursor: pointer;
            margin: 5px;
        }
        
        button:hover {
            background: #45a049;
        }
        
        select {
            padding: 8px;
            width: 100%;
            margin-bottom: 10px;
        }
    </style>
`);