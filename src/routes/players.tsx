import { AddPlayerModal } from "@/components/AddPlayerModal";
import { PlayerItem } from "@/components/PlayerItem";
import { useAppStore } from "@/lib/store";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/players")({
	component: RouteComponent,
});

function RouteComponent() {
	const { players, addPlayer, togglePlayerAvailability } = useAppStore();

	const handleAddPlayer = (playerName: string) => {
		addPlayer(playerName);
	};

	const handleToggleAvailability = (playerId: string) => {
		togglePlayerAvailability(playerId);
	};

	return (
		<div className="p-2 bg-slate-50 min-h-screen">
			<AddPlayerModal onAddPlayer={handleAddPlayer} />
			<div className="mt-4 space-y-2">
				{players.map((player) => (
					<PlayerItem 
						key={player.id} 
						name={player.name}
						gamesPlayed={player.gamesPlayed}
						isAvailable={player.isAvailable}
						onToggleAvailability={() => handleToggleAvailability(player.id)}
					/>
				))}
			</div>
		</div>
	);
}
