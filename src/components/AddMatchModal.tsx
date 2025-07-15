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

interface AddMatchModalProps {
	players: Player[];
	matches: Match[];
	onAddMatch: (match: Omit<Match, "id">) => void;
}

export function AddMatchModal({
	players,
	matches,
	onAddMatch,
}: AddMatchModalProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [teamA1, setTeamA1] = useState<ComboboxOption | null>(null);
	const [teamA2, setTeamA2] = useState<ComboboxOption | null>(null);
	const [teamB1, setTeamB1] = useState<ComboboxOption | null>(null);
	const [teamB2, setTeamB2] = useState<ComboboxOption | null>(null);

	// Calculate matches played for each player
	const playerMatchCounts = useMemo(() => {
		const counts: Record<string, number> = {};

		// Initialize all players with 0 matches
		for (const player of players) {
			counts[player.id] = 0;
		}

		// Count matches for each player
		for (const match of matches) {
			for (const player of [...match.teamA, ...match.teamB]) {
				counts[player.id] = (counts[player.id] || 0) + 1;
			}
		}

		return counts;
	}, [players, matches]);

	// Create player options sorted by least played, with match counts
	const playerOptions: ComboboxOption[] = useMemo(() => {
		return players
			.filter((p) => p.isAvailable) // Only show available players
			.map((p) => ({
				value: p.id,
				label: `${p.name} (${playerMatchCounts[p.id]} partidos)`,
				originalLabel: p.name,
				matchCount: playerMatchCounts[p.id],
			}))
			.sort((a, b) => a.matchCount - b.matchCount);
	}, [players, playerMatchCounts]);

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

	const handleAdd = () => {
		const teamA = [teamA1, teamA2]
			.map((option) => option && players.find((p) => p.id === option.value))
			.filter(Boolean) as Player[];
		const teamB = [teamB1, teamB2]
			.map((option) => option && players.find((p) => p.id === option.value))
			.filter(Boolean) as Player[];
		onAddMatch({ teamA, teamB, status: "pending" });
		setTeamA1(null);
		setTeamA2(null);
		setTeamB1(null);
		setTeamB2(null);
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
				<Button variant="outline" className="font-semibold">
					+ Partido
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Crear Partido</DialogTitle>
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
						onClick={handleAdd}
						disabled={!isValid}
						className="w-full font-semibold"
					>
						Agregar Partido
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
