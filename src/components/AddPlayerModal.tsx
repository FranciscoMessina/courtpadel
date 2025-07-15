import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

interface AddPlayerModalProps {
	onAddPlayer: (playerName: string) => void;
}

export const AddPlayerModal = ({ onAddPlayer }: AddPlayerModalProps) => {
	const [playerName, setPlayerName] = useState("");
	const [isOpen, setIsOpen] = useState(false);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (playerName.trim()) {
			onAddPlayer(playerName.trim());
			setPlayerName("");
			setIsOpen(false);
		}
	};

	const handleOpenChange = (open: boolean) => {
		setIsOpen(open);
		if (!open) {
			setPlayerName("");
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={handleOpenChange}>
			<DialogTrigger asChild>
				<Button
					type="button"
					variant="outline"
					className="w-full font-semibold"
				>
					Agregar Jugador
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Agregar Nuevo Jugador</DialogTitle>
					<DialogDescription>
						Ingresa el nombre del jugador que deseas agregar.
					</DialogDescription>
				</DialogHeader>
				<form onSubmit={handleSubmit}>
					<div className="grid gap-4 py-4">
						<div className="flex flex-col gap-2">
							<Label htmlFor="playerName" className="text-right">
								Nombre
							</Label>
							<Input
								id="playerName"
								value={playerName}
								onChange={(e) => setPlayerName(e.target.value)}
								placeholder="Pepito Montenegro"
								autoFocus
							/>
						</div>
					</div>
					<DialogFooter>
						<div className="flex flex-row gap-2 justify-evenly">
							<Button
								type="button"
								variant="outline"
								onClick={() => setIsOpen(false)}
							>
								Cancelar
							</Button>
							<Button type="submit" disabled={!playerName.trim()}>
								Agregar
							</Button>
						</div>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
};
