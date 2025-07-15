import React from "react";
import type { Match } from "../lib/store";
import { Button } from "./ui/button";

interface CourtMatchProps {
	match: Match;
	onEndMatch: (matchId: string) => void;
}

export const CourtMatch = ({ match, onEndMatch }: CourtMatchProps) => {
	const teamANames = match.teamA.map((p) => p.name).join(" y ");
	const teamBNames = match.teamB.map((p) => p.name).join(" y ");

	// Timer logic
	const [now, setNow] = React.useState(Date.now());
	React.useEffect(() => {
		if (match.status === "in_progress" && match.startTime) {
			const interval = setInterval(() => setNow(Date.now()), 1000);
			return () => clearInterval(interval);
		}
	}, [match.status, match.startTime]);

	let duration = null;
	if (match.status === "in_progress" && match.startTime) {
		const elapsed = Math.floor((now - match.startTime) / 1000);
		const minutes = Math.floor(elapsed / 60);
		const seconds = elapsed % 60;
		duration = `${minutes}m ${seconds < 10 ? "0" : ""}${seconds}s`;
	}

	return (
		<div className="w-full flex flex-col gap-2">
			<div className="flex flex-row gap-2 items-center">
				<span className="text-sm text-gray-800">{teamANames}</span>
				<span className="text-sm font-semibold">vs.</span>
				<span className="text-sm text-gray-800">{teamBNames}</span>
			</div>
			{duration && (
				<div className="text-xs text-blue-600 font-medium ">
					Duración: {duration}
				</div>
			)}
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
