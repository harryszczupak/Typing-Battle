'use client';

import { useEffect, useState } from 'react';
import { getSocket } from '../app/lib/socket';

interface TypingInputProps {
	sentence: string;
	playerId: string;
}

export default function TypingInput({ sentence, playerId }: TypingInputProps) {
	const [input, setInput] = useState('');

	useEffect(() => {
		setInput(''); 
	}, [sentence]);

	useEffect(() => {
		const socket = getSocket();
		socket.emit('progress-update', { id: playerId, progress: input });
	}, [input, playerId]);

	return (
		<input
			type='text'
			className='border p-2 rounded w-full mb-4 font-mono text-lg'
			value={input}
			onChange={(e) => setInput(e.target.value)}
			placeholder='Zacznij pisać...'
			spellCheck={false}
			autoFocus
		/>
	);
}
