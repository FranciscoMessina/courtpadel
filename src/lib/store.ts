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
	addMatch: (matchData: Omit<Match, "id">) => {
		const newMatch: Match = {
			...matchData,
			id: Date.now().toString(),
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
		
		// Find the first available court (1-4)
		const occupiedCourts = inProgressMatches.map(match => match.courtId).filter(Boolean);
		let availableCourt = 1;
		while (occupiedCourts.includes(availableCourt)) {
			availableCourt++;
		}
		
		set((state) => ({
			matches: state.matches.map((match) =>
				match.id === matchId
					? { ...match, status: "in_progress" as const, courtId: availableCourt }
					: match
			),
		}));
	},

	endMatch: (matchId: string) => {
		set((state) => ({
			matches: state.matches.map((match) =>
				match.id === matchId
					? { ...match, status: "completed" as const, courtId: undefined }
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