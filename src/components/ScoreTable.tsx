export default function ScoreTable({
	players,
}: {
	players: Array<{
		id: string;
		progress: string;
		name: string;
		wpm: number;
		accuracy: number;
	}>;
}) {
	return (
		<table className='w-full mt-8 border'>
			<thead>
				<tr>
					<th className='border p-2'>Live progress</th>
					<th className='border p-2'>Player name</th>
					<th className='border p-2'>WPM</th>
					<th className='border p-2'>Accuracy</th>
				</tr>
			</thead>
			<tbody>
				{players.map((p) => (
					<tr key={p.id}>
						<td className='border p-2'>{p.progress}</td>
						<td className='border p-2'>{p.name}</td>
						<td className='border p-2'>{p.wpm}</td>
						<td className='border p-2'>{p.accuracy}</td>
					</tr>
				))}
			</tbody>
		</table>
	);
}
