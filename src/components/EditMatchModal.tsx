import { useMemo, useState } from "react";
import type { Match, Player } from "../lib/store";
import { Button } from "./ui/button";
import { Combobox } from "./ui/combobox";
import type { ComboboxOption } from "./ui/combobox";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "./ui/dialog";

interface EditMatchModalProps {
	match: Match;
	players: Player[];
	matches: Match[];
	onEditMatch: (
		matchId: string,
		updatedMatch: Omit<Match, "id" | "startTime" | "endTime">,
	) => void;
}

export function EditMatchModal({
	match,
	players,
	matches,
	onEditMatch,
}: EditMatchModalProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [teamA1, setTeamA1] = useState<ComboboxOption | null>(
		match.teamA[0]
			? { value: match.teamA[0].id, label: match.teamA[0].name }
			: null,
	);
	const [teamA2, setTeamA2] = useState<ComboboxOption | null>(
		match.teamA[1]
			? { value: match.teamA[1].id, label: match.teamA[1].name }
			: null,
	);
	const [teamB1, setTeamB1] = useState<ComboboxOption | null>(
		match.teamB[0]
			? { value: match.teamB[0].id, label: match.teamB[0].name }
			: null,
	);
	const [teamB2, setTeamB2] = useState<ComboboxOption | null>(
		match.teamB[1]
			? { value: match.teamB[1].id, label: match.teamB[1].name }
			: null,
	);

	// Calculate matches played for each player
	const playerMatchCounts = useMemo(() => {
		const counts: Record<string, number> = {};

		// Initialize all players with 0 matches
		for (const player of players) {
			counts[player.id] = 0;
		}

		// Count matches for each player (excluding current match being edited)
		for (const m of matches) {
			if (m.id !== match.id) {
				for (const player of [...m.teamA, ...m.teamB]) {
					counts[player.id] = (counts[player.id] || 0) + 1;
				}
			}
		}

		return counts;
	}, [players, matches, match.id]);

	// Create player options sorted by least played, with match counts and playing status
	const playerOptions: ComboboxOption[] = useMemo(() => {
		// Find all player IDs currently playing (excluding this match)
		const playingPlayerIds = new Set(
			matches
				.filter((m) => m.status === "in_progress" && m.id !== match.id)
				.flatMap((m) => [...m.teamA, ...m.teamB].map((p) => p.id))
		);
		return players
			.filter((p) => p.isAvailable)
			.map((p) => {
				const isPlaying = playingPlayerIds.has(p.id);
				return {
					value: p.id,
					label: `${p.name} (${playerMatchCounts[p.id]} partidos)${isPlaying ? ' (jugando)' : ''}`,
					originalLabel: p.name,
					matchCount: playerMatchCounts[p.id],
					isPlaying,
				};
			})
			// Sort: not playing first, then by matchCount, then playing last
			.sort((a, b) => {
				if (a.isPlaying !== b.isPlaying) return a.isPlaying ? 1 : -1;
				return a.matchCount - b.matchCount;
			});
	}, [players, playerMatchCounts, matches, match.id]);

	const selectedIds = [
		teamA1?.value,
		teamA2?.value,
		teamB1?.value,
		teamB2?.value,
	].filter(Boolean);

	const getDisabledOptions = (currentValue: string | undefined) =>
		selectedIds.filter(
			(id): id is string => id !== undefined && id !== currentValue,
		);

	const handleSave = () => {
		const teamA = [teamA1, teamA2]
			.map((option) => option && players.find((p) => p.id === option.value))
			.filter(Boolean) as Player[];
		const teamB = [teamB1, teamB2]
			.map((option) => option && players.find((p) => p.id === option.value))
			.filter(Boolean) as Player[];

		onEditMatch(match.id, { teamA, teamB, status: match.status });
		setIsOpen(false);
	};

	const isValid =
		teamA1 &&
		teamA2 &&
		teamB1 &&
		teamB2 &&
		new Set([teamA1.value, teamA2.value, teamB1.value, teamB2.value]).size ===
			4;

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button variant="outline" size="sm" className="text-xs">
					Editar
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Editar Partido</DialogTitle>
				</DialogHeader>
				<div className="grid gap-4 py-4">
					<div className="flex flex-col gap-2 w-full">
						<span className="font-semibold">Equipo A</span>
						<Combobox
							options={playerOptions}
							value={teamA1}
							onValueChange={setTeamA1}
							triggerText="Jugador 1"
							disabledOptions={getDisabledOptions(teamA1?.value)}
						/>
						<Combobox
							options={playerOptions}
							value={teamA2}
							onValueChange={setTeamA2}
							triggerText="Jugador 2"
							disabledOptions={getDisabledOptions(teamA2?.value)}
						/>
					</div>
					<div className="flex flex-col gap-2 mt-2">
						<span className="font-semibold">Equipo B</span>
						<Combobox
							options={playerOptions}
							value={teamB1}
							onValueChange={setTeamB1}
							triggerText="Jugador 1"
							disabledOptions={getDisabledOptions(teamB1?.value)}
						/>
						<Combobox
							options={playerOptions}
							value={teamB2}
							onValueChange={setTeamB2}
							triggerText="Jugador 2"
							disabledOptions={getDisabledOptions(teamB2?.value)}
						/>
					</div>
				</div>
				<DialogFooter>
					<Button
						type="button"
						onClick={handleSave}
						disabled={!isValid}
						className="w-full font-semibold"
					>
						Guardar Cambios
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
