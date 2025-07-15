import {
	IconBallTennis,
	IconHome,
	IconPlayHandball,
	IconSettings,
} from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";

export default function FooterNav() {
	return (
		<footer className="p-2 bg-white  gap-2  text-black justify-between shadow border-b fixed bottom-0 w-full z-50">
			<nav className="flex flex-row justify-evenly ">
				<Link to="/">
					{({ isActive }) => (
						<div
							className={`${isActive ? "text-indigo-500 font-semibold" : "text-gray-500"} text-center flex flex-col items-center p-2`}
						>
							<IconHome stroke={1} />
							<span className="sr-only">Inicio</span>
						</div>
					)}
				</Link>
				<Link to="/matches">
					{({ isActive }) => (
						<div
							className={`${isActive ? "text-indigo-500 font-semibold" : "text-gray-500"} text-center flex flex-col items-center p-2`}
						>
							<IconBallTennis stroke={1} />
							<span className="sr-only">Partidos</span>
						</div>
					)}
				</Link>
				<Link to="/players">
					{({ isActive }) => (
						<div
							className={`${isActive ? "text-indigo-500 font-semibold" : "text-gray-500"} text-center flex flex-col items-center p-2`}
						>
							<IconPlayHandball stroke={1} />
							<span className="sr-only">Jugadores</span>
						</div>
					)}
				</Link>
				<Link to="/settings">
					{({ isActive }) => (
						<div
							className={`${isActive ? "text-indigo-500 font-semibold" : "text-gray-500"} text-center flex flex-col items-center p-2`}
						>
							<IconSettings stroke={1} />
							<span className="sr-only">Jugadores</span>
						</div>
					)}
				</Link>
			</nav>
		</footer>
	);
}
