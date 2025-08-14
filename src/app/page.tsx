'use client';

import { useRouter } from 'next/navigation';

export default function HomePage() {
	const router = useRouter();

	return (
		<main className='flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white p-6'>
			<h1 className='text-5xl font-extrabold mb-6 drop-shadow-lg'>
				Witaj w Typing Battle! ✍️🔥
			</h1>
			<p className='text-lg max-w-xl text-center mb-10 drop-shadow-md'>
				Dołącz do emocjonującej, szybkiej rozgrywki na czas! Sprawdź swoje
				umiejętności w pisaniu i rywalizuj z innymi w czasie rzeczywistym.
			</p>
			<button
				onClick={() => router.push('/game')}
				className='bg-white text-indigo-600 font-bold px-8 py-4 rounded-full shadow-lg hover:bg-indigo-100 transition'>
				Start Game
			</button>
		</main>
	);
}
