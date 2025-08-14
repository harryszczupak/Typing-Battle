'use client';

import { useEffect, useState } from 'react';
import { getSocket } from '../lib/socket';
import SentenceDisplay from '../../components/SentenceDisplay';
import ScoreTable from '../../components/ScoreTable';
import TypingInput from '../../components/TypingInput';
import Countdown from '../../components/CoutDown';

interface Player {
	id: string;
	name: string;
	progress: string;
	wpm: number;
	accuracy: number;
}

export default function GamePage() {
	const [players, setPlayers] = useState<Player[]>([]);
	const [sentence, setSentence] = useState('');
	const [roundEndTime, setRoundEndTime] = useState(Date.now() + 30000);
	const [playerId, setPlayerId] = useState('');

	useEffect(() => {
		const socket = getSocket();
		const id = localStorage.getItem('playerId') || crypto.randomUUID();
		setPlayerId(id);
		localStorage.setItem('playerId', id);

		socket.emit('join', { id, name: 'Gracz' + id.slice(0, 4) });

		socket.on(
			'new-round',
			({
				sentence,
				roundEndTime,
			}: {
				sentence: string;
				roundEndTime: number;
			}) => {
				setSentence(sentence);
				setRoundEndTime(roundEndTime);
			}
		);

		socket.on('player-list', (players: Player[]) => {
			setPlayers(players);
		});

		return () => {
			socket.off('new-round');
			socket.off('player-list');
		};
	}, []);

	return (
		<main className='p-8 max-w-3xl mx-auto'>
			<h1 className='text-3xl mb-6'>Typing Race 🏁</h1>
			<Countdown roundEndTime={roundEndTime} />
			<SentenceDisplay sentence={sentence} />
			<TypingInput sentence={sentence} playerId={playerId} />
			<ScoreTable players={players} />
		</main>
	);
}
