class TicTacToe {
    constructor() {
        this.board = ['', '', '', '', '', '', '', '', ''];
        this.player = 'X';
        this.active = true;
        this.mode = 'pvp';
        this.scores = { X: 0, O: 0 };
        this.wins = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]];
        this.playerNames = { X: 'Player X', O: 'Player O' };
        this.init();
    }
    
    init() {
        // Name input handlers
        document.getElementById('start-game').addEventListener('click', () => this.startGame());
        document.getElementById('back-to-names').addEventListener('click', () => this.showNameInput());
        
        // Game handlers
        document.querySelectorAll('.cell').forEach(cell => 
            cell.addEventListener('click', () => this.click(cell)));
        document.getElementById('pvp').addEventListener('click', () => this.setMode('pvp'));
        document.getElementById('pvai').addEventListener('click', () => this.setMode('pvai'));
        document.getElementById('reset').addEventListener('click', () => this.reset());
        
        // Enter key support for inputs
        document.getElementById('player1-name').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.startGame();
        });
        document.getElementById('player2-name').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.startGame();
        });
    }
    
    startGame() {
        const player1Name = document.getElementById('player1-name').value.trim() || 'Player X';
        const player2Name = document.getElementById('player2-name').value.trim() || 'Player O';
        
        this.playerNames.X = player1Name;
        this.playerNames.O = player2Name;
        
        document.getElementById('name-input').style.display = 'none';
        document.getElementById('game-section').style.display = 'block';
        
        this.updateStatus();
    }
    
    showNameInput() {
        document.getElementById('game-section').style.display = 'none';
        document.getElementById('name-input').style.display = 'block';
        this.reset();
    }
    
    setMode(mode) {
        this.mode = mode;
        document.querySelectorAll('.mode-btn').forEach(btn => btn.classList.remove('active'));
        document.getElementById(mode).classList.add('active');
        this.reset();
    }
    
    click(cell) {
        const i = parseInt(cell.dataset.index);
        if (this.board[i] || !this.active) return;
        
        this.move(i);
        if (this.mode === 'pvai' && this.player === 'O' && this.active) {
            setTimeout(() => this.aiMove(), 500);
        }
    }
    
    move(i) {
        this.board[i] = this.player;
        const cellElement = document.querySelector(`[data-index="${i}"]`);
        cellElement.textContent = this.player;
        cellElement.classList.add(this.player.toLowerCase());
        
        if (this.checkWin()) {
            this.end('win');
        } else if (this.board.every(cell => cell)) {
            this.end('draw');
        } else {
            this.player = this.player === 'X' ? 'O' : 'X';
            this.updateStatus();
        }
    }
    
    aiMove() {
        const empty = this.board.map((cell, i) => cell === '' ? i : null).filter(i => i !== null);
        if (empty.length) {
            const move = this.findWin('O') || this.findWin('X') || empty[Math.floor(Math.random() * empty.length)];
            this.move(move);
        }
    }
    
    findWin(p) {
        for (let win of this.wins) {
            const line = [this.board[win[0]], this.board[win[1]], this.board[win[2]]];
            if (line.filter(cell => cell === p).length === 2 && line.filter(cell => cell === '').length === 1) {
                return win[line.indexOf('')];
            }
        }
        return null;
    }
    
    checkWin() {
        for (let win of this.wins) {
            if (this.board[win[0]] && this.board[win[0]] === this.board[win[1]] && this.board[win[0]] === this.board[win[2]]) {
                win.forEach(i => document.querySelector(`[data-index="${i}"]`).classList.add('win'));
                return true;
            }
        }
        return false;
    }
    
    end(result) {
        this.active = false;
        document.getElementById('board').classList.add('game-over');
        if (result === 'win') {
            this.scores[this.player]++;
            this.updateStatus(`${this.playerNames[this.player]} wins!`);
        } else {
            this.updateStatus("It's a draw!");
        }
        this.updateScores();
    }
    
    updateStatus() {
        if (this.active) {
            const currentPlayerName = this.mode === 'pvai' && this.player === 'O' ? 'AI' : this.playerNames[this.player];
            document.getElementById('status').textContent = `${currentPlayerName}'s turn`;
        }
    }
    
    updateScores() {
        const scoreXElement = document.getElementById('score-x');
        const scoreOElement = document.getElementById('score-o');
        
        scoreXElement.textContent = this.scores.X;
        scoreOElement.textContent = this.scores.O;
        
        // Update score labels with player names
        scoreXElement.previousElementSibling.textContent = `${this.playerNames.X}:`;
        scoreOElement.previousElementSibling.textContent = `${this.playerNames.O}:`;
    }
    
    reset() {
        this.board = ['', '', '', '', '', '', '', '', ''];
        this.player = 'X';
        this.active = true;
        document.querySelectorAll('.cell').forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('x', 'o', 'win');
        });
        document.getElementById('board').classList.remove('game-over');
        this.updateStatus();
    }
}

document.addEventListener('DOMContentLoaded', () => new TicTacToe()); 