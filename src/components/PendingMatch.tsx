import type { Match, Player } from "../lib/store";
import { EditMatchModal } from "./EditMatchModal";
import { Button } from "./ui/button";

interface PendingMatchProps {
	match: Match;
	players: Player[];
	matches: Match[];
	onEditMatch: (
		matchId: string,
		updatedMatch: Omit<Match, "id" | "startTime" | "endTime">,
	) => void;
	onStartMatch: (matchId: string) => void;
}

export const PendingMatch = ({
	match,
	players,
	matches,
	onEditMatch,
	onStartMatch,
}: PendingMatchProps) => {
	const teamANames = match.teamA.map((p) => p.name).join(" y ");
	const teamBNames = match.teamB.map((p) => p.name).join(" y ");

	return (
		<div className="w-full p-2 h-full border-b flex flex-col gap-2">
			<div className="flex flex-row gap-2 items-center justify-between">
				<div className="flex flex-row gap-2 items-center">
					<span className="text-sm text-gray-800">{teamANames}</span>
					<span className="text-sm font-semibold">vs.</span>
					<span className="text-sm text-gray-800">{teamBNames}</span>
				</div>
				<EditMatchModal
					match={match}
					players={players}
					matches={matches}
					onEditMatch={onEditMatch}
				/>
			</div>
			<Button
				type="button"
				variant="outline"
				className="w-full font-semibold"
				onClick={() => onStartMatch(match.id)}
			>
				Empezar Partido
			</Button>
		</div>
	);
};
