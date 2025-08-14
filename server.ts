import { createServer } from 'http';
import { Server } from 'socket.io';

const httpServer = createServer();
const io = new Server(httpServer, {
	cors: {
		origin: '*',
	},
});

interface Player {
	id: string;
	name: string;
	progress: string;
	wpm: number;
	accuracy: number;
}

let players = new Map<string, Player>();
const sentences = [
	'The quick brown fox jumps over the lazy dog',
	'Lazy dogs lie under the warm sun',
	'Typing fast is a skill to master',
	'Next.js 13 makes server components easy',
	'Real time apps are fun to build',
];
let currentSentence = sentences[0];
let roundDuration = 30 * 1000;
let roundEndTime = Date.now() + roundDuration;

function calculateAccuracy(typed: string, target: string) {
	let correctChars = 0;
	for (let i = 0; i < typed.length; i++) {
		if (typed[i] === target[i]) correctChars++;
	}
	return typed.length > 0 ? correctChars / typed.length : 0;
}

function calculateWPM(typed: string, elapsedMs: number) {
	const wordsTyped = typed
		.trim()
		.split(/\s+/)
		.filter((w) => w !== '').length;
	return elapsedMs > 0 ? wordsTyped / (elapsedMs / 60000) : 0;
}

function startNewRound() {
	currentSentence = sentences[Math.floor(Math.random() * sentences.length)];
	roundEndTime = Date.now() + roundDuration;

	players.forEach((p) => {
		p.progress = '';
		p.wpm = 0;
		p.accuracy = 0;
	});

	io.emit('new-round', { sentence: currentSentence, roundEndTime });
	io.emit('player-list', Array.from(players.values()));
}

io.on('connection', (socket) => {
	console.log('User connected:', socket.id);

	socket.on('join', (data: { id: string; name: string }) => {
		if (!players.has(data.id)) {
			players.set(data.id, { ...data, progress: '', wpm: 0, accuracy: 0 });
		}
		socket.emit('new-round', { sentence: currentSentence, roundEndTime });
		io.emit('player-list', Array.from(players.values()));
	});

	socket.on('progress-update', (data: { id: string; progress: string }) => {
		const player = players.get(data.id);
		if (!player) return;

		player.progress = data.progress;

		const elapsed = Math.max(1, roundDuration - (roundEndTime - Date.now()));
		player.accuracy = calculateAccuracy(data.progress, currentSentence);
		player.wpm = calculateWPM(data.progress, elapsed);

		io.emit('player-list', Array.from(players.values()));
	});

	socket.on('disconnect', () => {
		console.log('User disconnected:', socket.id);
	});
});

setInterval(() => {
	if (Date.now() > roundEndTime) {
		startNewRound();
	}
}, 1000);

const PORT = 4000;
httpServer.listen(PORT, () => {
	console.log(`Socket.io server running on port ${PORT}`);
});
