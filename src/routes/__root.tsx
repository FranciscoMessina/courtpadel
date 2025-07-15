import { Outlet, createRootRoute } from "@tanstack/react-router";

import FooterNav from "../components/FooterNav";
import { Toaster } from "../components/ui/sonner";

export const Route = createRootRoute({
	head: () => ({
		title: "Courtpadel",
		meta: [
			{
				name: "description",
				content: "Courtpadel",
			},
			{
				name: "viewport",
				content:
					"width=device-width, initial-scale=1.0, interactive-widget=resizes-content",
			},
		],
	}),
	component: () => (
		<>
			<FooterNav />
			<main className="mb-18 bg-slate-50">
				<Outlet />
			</main>
			<Toaster position="top-center" />
			{/* <TanStackRouterDevtools /> */}
		</>
	),
});
