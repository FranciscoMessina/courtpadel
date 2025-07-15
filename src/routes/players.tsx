import { createFileRoute } from "@tanstack/react-router";
import React from "react";
import { AddPlayerModal } from "../components/AddPlayerModal";
import { PlayerItem } from "../components/PlayerItem";
import { Input } from "../components/ui/input";
import { useAppStore } from "../lib/store";

export const Route = createFileRoute("/players")({
	component: RouteComponent,
});

function RouteComponent() {
	const { players, addPlayer, togglePlayerAvailability } = useAppStore();
	const [search, setSearch] = React.useState("");

	const handleAddPlayer = (playerName: string) => {
		addPlayer(playerName);
	};

	const handleToggleAvailability = (playerId: string) => {
		togglePlayerAvailability(playerId);
	};

	const filteredPlayers = players
		.filter((player) =>
			player.name.toLowerCase().includes(search.toLowerCase()),
		)
		.sort((a, b) => {
			// First, available players come first
			if (a.isAvailable !== b.isAvailable) {
				return a.isAvailable ? -1 : 1;
			}
			// Then, sort by gamesPlayed (descending)
			return a.gamesPlayed - b.gamesPlayed;
		});

	return (
		<div className="p-2 ">
			<h2 className="text-xl font-semibold">Jugadores</h2>
			<div className="my-4">
				<Input
					placeholder="Buscar jugador..."
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					className="mb-2"
				/>
			</div>
			<div className="space-y-2 mb-6">
				{filteredPlayers.map((player) => (
					<PlayerItem
						key={player.id}
						name={player.name}
						gamesPlayed={player.gamesPlayed}
						isAvailable={player.isAvailable}
						onToggleAvailability={() => handleToggleAvailability(player.id)}
					/>
				))}
			</div>
			<div className=" fixed bottom-16 w-[calc(100vw-1rem)] ">
				<AddPlayerModal onAddPlayer={handleAddPlayer} />
			</div>
		</div>
	);
}
