import { Switch } from "./ui/switch";

interface PlayerItemProps {
	name: string;
	gamesPlayed: number;
	isAvailable: boolean;
	onToggleAvailability: () => void;
}

export const PlayerItem = ({
	name,
	gamesPlayed,
	isAvailable,
	onToggleAvailability,
}: PlayerItemProps) => {
	return (
		<div className="p-2 border-b  ">
			<div className="flex items-center justify-between">
				<div className="flex-1">
					<div className="font-semibold text-lg">{name}</div>
					<div className="text-sm text-gray-600">
						{gamesPlayed} {gamesPlayed === 1 ? "partido" : "partidos"} jugados
					</div>
				</div>
				<div className="flex flex-col items-center gap-3">
					<Switch
						checked={isAvailable}
						onCheckedChange={onToggleAvailability}
					/>
					<span className="text-sm text-gray-600">
						{isAvailable ? "Disponible" : "No disponible"}
					</span>
				</div>
			</div>
		</div>
	);
};
