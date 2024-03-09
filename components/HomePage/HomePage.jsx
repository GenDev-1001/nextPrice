"use client";
import { Button, Input, Select } from "antd";
import { useEffect, useMemo, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { FaCirclePlus } from "react-icons/fa6";

import { Checkout } from "@/components/Checkout";
import { Header } from "@/components/Header";
import { ProcedureForm } from "@/components/ProcedureForm";
import { Table } from "@/components/Table";

export function HomePage({ data = [], addNewData }) {
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedCategory, setSelectedCategory] = useState("");

	const [isLoggedIn, setLoggedIn] = useState(false);
	const [isModalOpen, setModalOpen] = useState(false);

	const [selectedServices, setSelectedServices] = useState([]);
	const [quantityInput, setQuantityInput] = useState({});

	const [showProcedureForm, setShowProcedureForm] = useState(false);

	useEffect(() => {
		const storedLoggedInStatus = localStorage.getItem("isLoggedIn");
		if (storedLoggedInStatus === "true") {
			setLoggedIn(true);
		}
	}, []);

	const handleChange = (value) => {
		const currentSelectedCategory = value !== "Все" ? value : "";
		setSelectedCategory(currentSelectedCategory);
	};

	const handleLogin = () => {
		setLoggedIn(true);
		localStorage.setItem("isLoggedIn", "true");
	};

	const handleLogout = () => {
		setLoggedIn(false);
		localStorage.removeItem("isLoggedIn");
	};

	const openModal = () => {
		setModalOpen(true);
	};

	const closeModal = () => {
		setModalOpen(false);
	};

	const filteredServices = useMemo(
		() =>
			data.services
				? data.services.filter(
						(service) =>
							!selectedCategory || service.category === selectedCategory
				  )
				: [],
		[selectedCategory, data]
	);

	const handleAddToCheck = (service) => {
		const isAlreadySelected = selectedServices.some(
			(s) => s.key === service.key
		);

		if (isAlreadySelected) {
			const updatedServices = selectedServices.filter(
				(s) => s.key !== service.key
			);
			setSelectedServices(updatedServices);
			setQuantityInput({ ...quantityInput, [service.key]: 1 });
		} else {
			setSelectedServices([...selectedServices, { ...service, quantity: 1 }]);
			setQuantityInput({ ...quantityInput, [service.key]: 1 });
		}
	};

	const handleAddProcedure = (value) => {
		addNewData(value);

		setShowProcedureForm(false);
	};

	const categories = useMemo(() => {
		const isData = data.services ? data.services : [];

		const sortedCategories = [
			...new Set(isData.map((service) => service.category)),
		].map((category) => ({ label: category, value: category }));
		return [{ value: "Все", label: "Все" }, ...sortedCategories];
	}, [data]);

	return (
		<div className="App">
			<Header
				isLoggedIn={isLoggedIn}
				handleLogout={handleLogout}
				openModal={openModal}
				isModalOpen={isModalOpen}
				closeModal={closeModal}
				handleLogin={handleLogin}
			/>

			<div className="service__inner">
				<div className="selectForm">
					<div className="search-input">
						<label>Поиск по номеру услуги или названию услуги:</label>
						<div className="input-container">
							<Input
								type="text"
								placeholder="Введите номер или название услуги..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
							/>
							{searchTerm && (
								<FaTimes
									className="clear-icon"
									onClick={() => setSearchTerm("")}
								/>
							)}
						</div>
					</div>
					<div className="selectChoose">
						<label>Выбор категории услуги:</label>
						<Select
							defaultValue="Все"
							style={{
								width: "100%",
							}}
							onChange={handleChange}
							options={categories}
						/>
					</div>
					{isLoggedIn && (
						<>
							<Button
								className="addProc-btn"
								type="primary"
								onClick={() => setShowProcedureForm(true)}
							>
								Добавить новую процедуру{" "}
								<FaCirclePlus className="addProc-btnIcon" />
							</Button>
							{showProcedureForm && (
								<ProcedureForm
									onCancel={() => setShowProcedureForm(false)}
									onAddProcedure={handleAddProcedure}
								/>
							)}
						</>
					)}
				</div>

				<Checkout
					selectedServices={selectedServices}
					setSelectedServices={setSelectedServices}
					quantityInput={quantityInput}
					setQuantityInput={setQuantityInput}
				/>
			</div>

			<h2 className="title">
				{selectedCategory ? `Категория: ${selectedCategory}` : "Все услуги"}
			</h2>

			<div className="serviceWrapper">
				<Table
					isLoggedIn={isLoggedIn}
					originData={filteredServices}
					searchTerm={searchTerm}
					selectedCategory={selectedCategory}
					selectedServices={selectedServices}
					handleAddToCheck={handleAddToCheck}
				/>
			</div>
		</div>
	);
}
