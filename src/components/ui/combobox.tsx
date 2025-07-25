"use client";

import * as React from "react";

import { useMediaQuery } from "../../hooks/use-media-query";
import { Button } from "./button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "./command";
import { Drawer, DrawerContent, DrawerTrigger } from "./drawer";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "./popover";

export type ComboboxOption = {
	value: string;
	label: string;
	originalLabel?: string;
	matchCount?: number;
};

interface ComboboxProps {
	options: ComboboxOption[];
	value?: ComboboxOption | null;
	onValueChange?: (value: ComboboxOption | null) => void;
	placeholder?: string;
	triggerText?: string;
	searchPlaceholder?: string;
	emptyText?: string;
	className?: string;
	disabled?: boolean;
	disabledOptions?: string[];
}

export function Combobox({
	options,
	value,
	onValueChange,
	triggerText = "Elegir opción",
	searchPlaceholder = "Buscar...",
	emptyText = "No se encontraron resultados.",
	className = "",
	disabled = false,
	disabledOptions = [],
}: ComboboxProps) {
	const [open, setOpen] = React.useState(false);
	const isDesktop = useMediaQuery("(min-width: 768px)");

	const handleSelect = (selectedValue: string) => {
		const selectedOption =
			options.find((option) => option.value === selectedValue) || null;
		onValueChange?.(selectedOption);
		setOpen(false);
	};

	if (isDesktop) {
		return (
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild>
					<Button
						variant="outline"
						className={`justify-start ${className} `}
						disabled={disabled}
					>
						{value ? value.label : triggerText}
					</Button>
				</PopoverTrigger>
				<PopoverContent className={`p-0 ${className}`} align="start">
					<ComboboxList
						options={options}
						onSelect={handleSelect}
						searchPlaceholder={searchPlaceholder}
						emptyText={emptyText}
						disabledOptions={disabledOptions}
					/>
				</PopoverContent>
			</Popover>
		);
	}

	return (
		<Drawer open={open} onOpenChange={setOpen}>
			<DrawerTrigger asChild>
				<Button
					variant="outline"
					className={`justify-start ${className} max-w-[150px] overflow-hidden`}
					disabled={disabled}
				>
					{value ? value.label : triggerText}
				</Button>
			</DrawerTrigger>
			<DrawerContent>
				<div className="mt-4 border-t">
					<ComboboxList
						options={options}
						onSelect={handleSelect}
						searchPlaceholder={searchPlaceholder}
						emptyText={emptyText}
						disabledOptions={disabledOptions}
					/>
				</div>
			</DrawerContent>
		</Drawer>
	);
}

interface ComboboxListProps {
	options: ComboboxOption[];
	onSelect: (value: string) => void;
	searchPlaceholder?: string;
	emptyText?: string;
	disabledOptions?: string[];
}

function ComboboxList({
	options,
	onSelect,
	searchPlaceholder = "Buscar...",
	emptyText = "No hay resultados.",
	disabledOptions = [],
}: ComboboxListProps) {
	return (
		<Command>
			<CommandInput placeholder={searchPlaceholder} />
			<CommandList>
				<CommandEmpty>{emptyText}</CommandEmpty>
				<CommandGroup>
					{options.map((option) => {
						const isDisabled = disabledOptions.includes(option.value);
						return (
							<CommandItem
								key={option.value}
								value={`${option.value} ${option.label}`}
								onSelect={() => !isDisabled && onSelect(option.value)}
								disabled={isDisabled}
								className={isDisabled ? "opacity-50 cursor-not-allowed" : ""}
							>
								{option.label}
							</CommandItem>
						);
					})}
				</CommandGroup>
			</CommandList>
		</Command>
	);
}
