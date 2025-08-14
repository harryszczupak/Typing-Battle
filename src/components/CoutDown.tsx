'use client';
import { useEffect, useState } from 'react';

interface CountdownProps {
	roundEndTime: number;
}

export default function Countdown({ roundEndTime }: CountdownProps) {
	const [secondsLeft, setSecondsLeft] = useState(
		Math.max(0, Math.floor((roundEndTime - Date.now()) / 1000))
	);

	useEffect(() => {
		const interval = setInterval(() => {
			setSecondsLeft(
				Math.max(0, Math.floor((roundEndTime - Date.now()) / 1000))
			);
		}, 200);

		return () => clearInterval(interval);
	}, [roundEndTime]);

	return <p className='mb-4 text-xl'>⏰ Czas do końca rundy: {secondsLeft}s</p>;
}
