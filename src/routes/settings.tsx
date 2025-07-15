import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../components/ui/alert-dialog";
import { Button } from "../components/ui/button";
import { useAppStore } from "../lib/store";

export const Route = createFileRoute("/settings")({
	component: RouteComponent,
});

function RouteComponent() {
	const resetAllData = useAppStore((state) => state.resetAllData);

	const handleResetData = () => {
		resetAllData();
		toast.success("Todos los datos han sido reiniciados");
	};
	return (
		<div>
			<div className="mt-8 text-center">
				<AlertDialog>
					<AlertDialogTrigger asChild>
						<Button
							className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
						>
							Reiniciar Todos los Datos
						</Button>
					</AlertDialogTrigger>
					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
							<AlertDialogDescription>
								Esta acción eliminará todos los datos de la aplicación. ¿Deseas continuar?
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel>Cancelar</AlertDialogCancel>
							<AlertDialogAction asChild>
								<Button onClick={handleResetData} className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-colors">
									Sí, reiniciar
								</Button>
							</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
			</div>
		</div>
	);
}
