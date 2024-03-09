"use client";
import { useCallback, useEffect, useState } from "react";
import { Loader } from "../components/Spin/Spin";

import { HomePage } from "@/components/HomePage";

const fetchServices = async () => {
	try {
		const res = await fetch("http://localhost:3000/api/procedures", {
			cache: "no-store",
		});

		if (!res.ok) {
			throw new Error("Failed to fetch services");
		}

		return res.json();
	} catch (error) {
		throw error;
	}
};

export default function Home() {
	const [state, setState] = useState({
		data: null,
		error: null,
		isLoading: true,
	});

	const addNewData = useCallback((value) => {
		setState((prev) => ({
			...prev,
			data: {
				services:
					prev.data && prev.data.services
						? [...prev.data.services, value]
						: [value],
			},
		}));
	}, []);

	useEffect(() => {
		const loadData = async () => {
			try {
				const fetchedData = await fetchServices();
				setState({ data: fetchedData, error: null, isLoading: false });
			} catch (error) {
				setState({ data: null, error: error.toString(), isLoading: false });
			}
		};

		loadData();
	}, []);

	if (state.isLoading)
		return (
			<div>
				<Loader />
			</div>
		);
	if (state.error) return <div>Error: {state.error}</div>;

	return <HomePage data={state.data} addNewData={addNewData} />;
}
