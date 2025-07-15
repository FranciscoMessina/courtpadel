import { Button } from "@/components/ui/button";
import { useAppStore } from "@/lib/store";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { CourtMatch } from "../components/CourtMatch";

export const Route = createFileRoute("/")({
	component: App,
});

function App() {
	const { matches, endMatch, resetAllData } = useAppStore();

	const inProgressMatches = matches.filter(
		(match) => match.status === "in_progress",
	);

	const handleEndMatch = (matchId: string) => {
		endMatch(matchId);
		toast.success("Partido terminado correctamente");
	};

	const handleResetData = () => {
		resetAllData();
		toast.success("Todos los datos han sido reiniciados");
	};

	// Create court slots (1-4)
	const courts = Array.from({ length: 4 }, (_, i) => i + 1);

	return (
		<div className="bg-slate-50 min-h-screen w-full p-2">
			<h1 className="text-xl font-bold mb-4 text-center">
				Estado de las Canchas
			</h1>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				{courts.map((courtNumber) => {
					const matchInCourt = inProgressMatches.find(
						(match) => match.courtId === courtNumber,
					);

					return (
						<div key={courtNumber} className="border-b pb-2">
							<h3 className=" font-semibold mb-3 text-gray-700">
								Cancha {courtNumber}
							</h3>
							{matchInCourt ? (
								<CourtMatch
									key={matchInCourt.id}
									match={matchInCourt}
									onEndMatch={handleEndMatch}
								/>
							) : (
								<div key={courtNumber} className="text-center ">
									<p className="text-gray-500">Libre</p>
								</div>
							)}
						</div>
					);
				})}
			</div>

			<div className="mt-8 text-center">
				<Button
					onClick={handleResetData}
					className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
				>
					Reiniciar Todos los Datos
				</Button>
			</div>
		</div>
	);
}
