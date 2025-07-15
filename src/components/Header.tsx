import { Link } from "@tanstack/react-router";

export default function Header() {
	return (
		<header className="p-3  gap-2 bg-white text-black justify-between shadow border-b">
			<nav className="flex flex-row justify-evenly gap-2">
				<Link to="/">
					{({ isActive }) => (
						<div
							className={`${isActive ? "text-indigo-500 font-semibold" : "text-gray-500"}`}
						>
							Inicio
						</div>
					)}
				</Link>
				<Link to="/matches">
					{({ isActive }) => (
						<div
							className={`${isActive ? "text-indigo-500 font-semibold" : "text-gray-500"}`}
						>
							Partidos
						</div>
					)}
				</Link>
				<Link to="/players">
					{({ isActive }) => (
						<div
							className={`${isActive ? "text-indigo-500 font-semibold" : "text-gray-500"}`}
						>
							Jugadores
						</div>
					)}
				</Link>
			</nav>
		</header>
	);
}
