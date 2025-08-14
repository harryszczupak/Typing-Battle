interface SentenceDisplayProps {
	sentence: string;
}

export default function SentenceDisplay({ sentence }: SentenceDisplayProps) {
	return (
		<div className='border p-4 rounded bg-gray-100 font-mono text-lg mb-4'>
			{sentence}
		</div>
	);
}
