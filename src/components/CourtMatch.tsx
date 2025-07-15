import type { Match } from "../lib/store";
import { Button } from "./ui/button";

interface CourtMatchProps {
	match: Match;
	onEndMatch: (matchId: string) => void;
}

export const CourtMatch = ({ match, onEndMatch }: CourtMatchProps) => {
	const teamANames = match.teamA.map((p) => p.name).join(" y ");
	const teamBNames = match.teamB.map((p) => p.name).join(" y ");

	return (
		<div className="w-full flex flex-col gap-2">
			<div className="flex flex-row gap-2 items-center">
				<span className="text-sm text-gray-800">{teamANames}</span>
				<span className="text-sm font-semibold">vs.</span>
				<span className="text-sm text-gray-800">{teamBNames}</span>
			</div>
			<Button 
				variant="outline" 
				type="button" 
				className="w-full font-semibold"
				onClick={() => onEndMatch(match.id)}
			>
				Terminar Partido
			</Button>
		</div>
	);
};
