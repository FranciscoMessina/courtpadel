import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { AddMatchModal } from "../components/AddMatchModal";
import { PendingMatch } from "../components/PendingMatch";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../components/ui/select";
import { type Player, useAppStore } from "../lib/store";

export const Route = createFileRoute("/matches")({
	component: RouteComponent,
});

function RouteComponent() {
	const { players, matches, addMatch, updateMatch, startMatch } = useAppStore();
	const [filter, setFilter] = useState<"pending" | "in_progress" | "completed">(
		"pending",
	);

	const handleAddMatch = (match: { teamA: Player[]; teamB: Player[] }) => {
		addMatch({ ...match, status: "pending", startTime: null, endTime: null });
	};

	const handleEditMatch = (
		matchId: string,
		updatedMatch: { teamA: Player[]; teamB: Player[] },
	) => {
		updateMatch(matchId, {
			...updatedMatch,
			status: "pending",
			startTime: null,
			endTime: null,
		});
	};

	const handleStartMatch = (matchId: string) => {
		try {
			startMatch(matchId);
			toast.success("Partido iniciado correctamente");
		} catch (error) {
			if (error instanceof Error) {
				toast.error(error.message);
			} else {
				toast.error("Error al iniciar el partido");
			}
		}
	};

	const filteredMatches = matches.filter((match) => {
		return match.status === filter;
	});

	const pendingMatches = filteredMatches.filter(
		(match) => match.status === "pending",
	);
	const completedMatches = filteredMatches.filter(
		(match) => match.status === "completed",
	);

	return (
		<div className="p-2 ">
			{/* Pending Matches */}
			{pendingMatches.length > 0 && (
				<div className="mt-4">
					<h3 className="ml-2 font-medium text-gray-700 mb-2">Pendientes</h3>
					<div className="space-y-2">
						{pendingMatches.map((match) => (
							<PendingMatch
								key={match.id}
								match={match}
								players={players}
								matches={matches}
								onEditMatch={handleEditMatch}
								onStartMatch={handleStartMatch}
							/>
						))}
					</div>
				</div>
			)}

			{/* Completed Matches */}
			{completedMatches.length > 0 && (
				<div className="mt-4">
					<h3 className="ml-2 font-medium text-gray-700 mb-2">Completados</h3>
					<div className="space-y-2">
						{completedMatches.map((match) => {
							let duration = null;
							if (match.startTime && match.endTime) {
								const elapsed = Math.floor((match.endTime - match.startTime) / 1000);
								const minutes = Math.floor(elapsed / 60);
								const seconds = elapsed % 60;
								duration = `${minutes}m ${seconds < 10 ? "0" : ""}${seconds}s`;
							}
							return (
								<div
									key={match.id}
									className="bg-white rounded-lg p-4 shadow-sm border"
								>
									<div className="flex flex-row gap-2 items-center justify-center">
										<span className="text-sm text-gray-800">
											{match.teamA.map((p) => p.name).join(" y ")}
										</span>
										<span className="text-sm font-semibold">vs.</span>
										<span className="text-sm text-gray-800">
											{match.teamB.map((p) => p.name).join(" y ")}
										</span>
									</div>
									<div className="mt-2 text-center">
										<span className="text-xs text-green-600 font-medium">
											Finalizado
										</span>
										{duration && (
											<div className="text-xs text-gray-700 mt-1">Duración: {duration}</div>
										)}
									</div>
								</div>
							);
						})}
					</div>
				</div>
			)}

			{/* No matches message */}
			{filteredMatches.length === 0 && (
				<div className="mt-8 text-center text-gray-500">
					{filter === "pending"
						? "No hay partidos pendientes"
						: filter === "in_progress"
							? "No hay partidos en progreso"
							: "No hay partidos completados"}
				</div>
			)}
			<div className=" fixed bottom-16 w-[calc(100vw-1rem)] ">
				<div className="flex items-center  justify-evenly w-full gap-2">
					<Select
						value={filter}
						onValueChange={(value: "pending" | "completed") => setFilter(value)}
					>
						<SelectTrigger className="w-full ">
							<SelectValue placeholder="Filtrar partidos" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="pending">Pendientes</SelectItem>

							<SelectItem value="completed">Completados</SelectItem>
						</SelectContent>
					</Select>
					<AddMatchModal
						players={players}
						matches={matches}
						onAddMatch={handleAddMatch}
					/>
				</div>
			</div>
		</div>
	);
}
