import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Match the existing interfaces exactly
export interface Player {
	id: string;
	name: string;
	gamesPlayed: number;
	isAvailable: boolean;
}

export interface Match {
	id: string;
	status: "pending" | "in_progress" | "completed";
	teamA: Player[];
	teamB: Player[];
	courtId?: number; // Court number (1-4) when match is in progress
	startTime: number | null; // Timestamp when match starts
	endTime: number | null;   // Timestamp when match ends
}

interface AppState {
	// Players state
	players: Player[];
	addPlayer: (name: string) => void;
	togglePlayerAvailability: (playerId: string) => void;
	
	// Matches state
	matches: Match[];
	addMatch: (match: Omit<Match, "id">) => void;
	updateMatch: (matchId: string, updatedMatch: Omit<Match, "id">) => void;
	startMatch: (matchId: string) => void;
	endMatch: (matchId: string) => void;
	
	// Reset functionality
	resetAllData: () => void;
}

export const useAppStore = create<AppState>()(
	persist(
		(set, get) => ({
			// Initial state - match the existing data
			players: [
				// { id: "1", name: "Juan", gamesPlayed: 5, isAvailable: true },
				// { id: "2", name: "Rob", gamesPlayed: 3, isAvailable: true },
				// { id: "3", name: "Pedro", gamesPlayed: 7, isAvailable: true },
				// { id: "4", name: "Matias", gamesPlayed: 2, isAvailable: true },
				// { id: "5", name: "Lucas", gamesPlayed: 4, isAvailable: true },
				// { id: "6", name: "Santi", gamesPlayed: 6, isAvailable: true },
			],
			matches: [],

			// Player actions
			addPlayer: (name: string) => {
				const newPlayer: Player = {
					id: Date.now().toString(),
					name,
					gamesPlayed: 0,
					isAvailable: true,
				};
				set((state) => ({
					players: [...state.players, newPlayer],
				}));
			},

			togglePlayerAvailability: (playerId: string) => {
				set((state) => ({
					players: state.players.map((player) =>
						player.id === playerId
							? { ...player, isAvailable: !player.isAvailable }
							: player
					),
				}));
			},

				// Match actions
	addMatch: (matchData: Omit<Match, "id" | "startTime" | "endTime">) => {
		const newMatch: Match = {
			...matchData,
			id: Date.now().toString(),
			startTime: null,
			endTime: null,
		};
		set((state) => ({
			matches: [...state.matches, newMatch],
		}));
	},

	updateMatch: (matchId: string, updatedMatch: Omit<Match, "id">) => {
		set((state) => ({
			matches: state.matches.map((match) =>
				match.id === matchId
					? { ...updatedMatch, id: matchId }
					: match
			),
		}));
	},

	startMatch: (matchId: string) => {
		const state = get();
		const inProgressMatches = state.matches.filter(match => match.status === "in_progress");

		// Check if there are available courts (max 4 courts)
		if (inProgressMatches.length >= 4) {
			throw new Error("No hay canchas disponibles. Todas las canchas están ocupadas.");
		}

		// Find the match to be started
		const matchToStart = state.matches.find(match => match.id === matchId);
		if (!matchToStart) {
			throw new Error("El partido no existe.");
		}

		// Gather all player IDs in the match to be started
		const newMatchPlayerIds = [
			...matchToStart.teamA.map(p => p.id),
			...matchToStart.teamB.map(p => p.id)
		];

		// Gather all player IDs in all in-progress matches (excluding the match to be started)
		const activePlayerIds = inProgressMatches
			.filter(match => match.id !== matchId)
			.flatMap(match => [
				...match.teamA.map(p => p.id),
				...match.teamB.map(p => p.id)
			]);

		// Check for overlap
		const hasConflict = newMatchPlayerIds.some(id => activePlayerIds.includes(id));
		if (hasConflict) {
			throw new Error("Uno o más jugadores ya están en un partido en curso.");
		}

		// Find the first available court (1-4)
		const occupiedCourts = inProgressMatches.map(match => match.courtId).filter(Boolean);
		let availableCourt = 1;
		while (occupiedCourts.includes(availableCourt)) {
			availableCourt++;
		}

		set((state) => ({
			matches: state.matches.map((match) =>
				match.id === matchId
					? { ...match, status: "in_progress" as const, courtId: availableCourt, startTime: Date.now(), endTime: null }
					: match
			),
		}));
	},

	endMatch: (matchId: string) => {
		const match = get().matches.find(match => match.id === matchId);

		const playersInMatch = match ? [...match.teamA, ...match.teamB] : [];
		for (const player of playersInMatch) {
			set((state) => ({
				players: state.players.map(p => p.id === player.id ? { ...p, gamesPlayed: p.gamesPlayed + 1 } : p)
			}));
		}

		set((state) => ({
			matches: state.matches.map((match) =>
				match.id === matchId
					? { ...match, status: "completed" as const, courtId: undefined, endTime: Date.now() }
					: match
			),
		}));
	},

	resetAllData: () => {
		set(() => ({
			players: [
				// { id: "1", name: "Juan", gamesPlayed: 5, isAvailable: true },
				// { id: "2", name: "Rob", gamesPlayed: 3, isAvailable: true },
				// { id: "3", name: "Pedro", gamesPlayed: 7, isAvailable: true },
				// { id: "4", name: "Matias", gamesPlayed: 2, isAvailable: true },
				// { id: "5", name: "Lucas", gamesPlayed: 4, isAvailable: true },
				// { id: "6", name: "Santi", gamesPlayed: 6, isAvailable: true },
			],
			matches: [],
		}));
	},
		}),
		{
			name: 'courtpadel-storage',
			partialize: (state) => ({
				players: state.players,
				matches: state.matches,
			}),
		}
	)
); 