"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var http_1 = require("http");
var socket_io_1 = require("socket.io");
var httpServer = (0, http_1.createServer)();
var io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: '*',
    },
});
var players = new Map();
var sentences = [
    'The quick brown fox jumps over the lazy dog',
    'Lazy dogs lie under the warm sun',
    'Typing fast is a skill to master',
    'Next.js 13 makes server components easy',
    'Real time apps are fun to build',
];
var currentSentence = sentences[0];
var roundDuration = 30 * 1000;
var roundEndTime = Date.now() + roundDuration;
function calculateAccuracy(typed, target) {
    var correctChars = 0;
    for (var i = 0; i < typed.length; i++) {
        if (typed[i] === target[i])
            correctChars++;
    }
    return typed.length > 0 ? correctChars / typed.length : 0;
}
function calculateWPM(typed, elapsedMs) {
    var wordsTyped = typed
        .trim()
        .split(/\s+/)
        .filter(function (w) { return w !== ''; }).length;
    return elapsedMs > 0 ? wordsTyped / (elapsedMs / 60000) : 0;
}
function startNewRound() {
    currentSentence = sentences[Math.floor(Math.random() * sentences.length)];
    roundEndTime = Date.now() + roundDuration;
    players.forEach(function (p) {
        p.progress = '';
        p.wpm = 0;
        p.accuracy = 0;
    });
    io.emit('new-round', { sentence: currentSentence, roundEndTime: roundEndTime });
    io.emit('player-list', Array.from(players.values()));
}
io.on('connection', function (socket) {
    console.log('User connected:', socket.id);
    socket.on('join', function (data) {
        if (!players.has(data.id)) {
            players.set(data.id, __assign(__assign({}, data), { progress: '', wpm: 0, accuracy: 0 }));
        }
        socket.emit('new-round', { sentence: currentSentence, roundEndTime: roundEndTime });
        io.emit('player-list', Array.from(players.values()));
    });
    socket.on('progress-update', function (data) {
        var player = players.get(data.id);
        if (!player)
            return;
        player.progress = data.progress;
        var elapsed = Math.max(1, roundDuration - (roundEndTime - Date.now()));
        player.accuracy = calculateAccuracy(data.progress, currentSentence);
        player.wpm = calculateWPM(data.progress, elapsed);
        io.emit('player-list', Array.from(players.values()));
    });
    socket.on('disconnect', function () {
        console.log('User disconnected:', socket.id);
    });
});
setInterval(function () {
    if (Date.now() > roundEndTime) {
        startNewRound();
    }
}, 1000);
var PORT = 4000;
httpServer.listen(PORT, function () {
    console.log("Socket.io server running on port ".concat(PORT));
});
