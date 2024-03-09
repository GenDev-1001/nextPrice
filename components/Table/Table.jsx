"use client";
import { Form, Input, InputNumber, Popconfirm, Table as TableAntd } from "antd";
import classNames from "classnames";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
	AiOutlineCheck,
	AiOutlineClose,
	AiOutlineDelete,
	AiOutlineEdit,
	AiOutlineSave,
} from "react-icons/ai";

const EditableCell = ({
	editing,
	dataIndex,
	title,
	inputType,
	record,
	index,
	children,
	...restProps
}) => {
	const inputNode = inputType === "number" ? <InputNumber /> : <Input />;
	return (
		<td className="table-td" {...restProps}>
			{editing ? (
				<Form.Item
					name={dataIndex}
					style={{
						margin: 0,
					}}
					rules={[
						{
							required: true,
							message: `Заполните поле ${title}!`,
						},
					]}
				>
					{inputNode}
				</Form.Item>
			) : (
				<>{dataIndex === "price" ? `${record.price} BYN` : children}</>
			)}
		</td>
	);
};

export const Table = ({
	originData,
	searchTerm,
	selectedCategory,
	handleAddToCheck,
	selectedServices,
	isLoggedIn,
}) => {
	const [form] = Form.useForm();
	const [data, setData] = useState(originData);
	const [editingKey, setEditingKey] = useState("");

	const [windowWidth, setWindowWidth] = useState(null);

	useEffect(() => {
		setData(originData)
	}, [originData]);

	useEffect(() => {
		const handleResize = () => {
			setWindowWidth(window.innerWidth);
		};

		window.addEventListener("resize", handleResize);

		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, []);

	const isSmallScreen = windowWidth <= 600;

	const dataSource = useMemo(
		() =>
			data.filter(
				(service) => !selectedCategory || service.category === selectedCategory
			),
		[data, selectedCategory]
	);

	const isEditing = useCallback(
		(record) => record.key === editingKey,
		[editingKey]
	);

	const edit = useCallback(
		(record) => {
			form.setFieldsValue({
				category: "",
				name: "",
				price: "",
				...record,
			});

			setEditingKey(record.key);
		},
		[form]
	);

	const cancel = useCallback(() => {
		setEditingKey("");
	}, []);

	const handleDelete = useCallback(
		async (record) => {
			const res = await fetch(
				`http://localhost:3000/api/procedures?key=${record.key}`,
				{
					method: "DELETE",
				}
			);

			const newData = dataSource.filter((item) => item.key !== record.key);
			setData(newData);
			if (editingKey && editingKey === record.key) setEditingKey("");
			if (selectedServices.some((service) => service.key === record.key))
				handleAddToCheck(record);
		},
		[dataSource, editingKey, handleAddToCheck, selectedServices]
	);

	const updateData = async (newData, row, key) => {
		setData(newData);
		setEditingKey("");

		try {
			const res = await fetch(`http://localhost:3000/api/procedures/${key}`, {
				method: "PUT",
				headers: {
					"Content-type": "application/json",
				},
				body: JSON.stringify(row),
			});

			if (!res.ok) {
				throw new Error("Failed to update service");
			}
		} catch (error) {
			console.log(error);
		}
	};

	const save = useCallback(
		async (key) => {
			try {
				const row = await form.validateFields();
				const newData = [...data];
				const index = newData.findIndex((item) => key === item.key);
				if (index > -1) {
					const item = newData[index];
					newData.splice(index, 1, {
						...item,
						...row,
					});
					updateData(newData, row, key);
				} else {
					newData.push(row);
					updateData(newData, row, key);
				}
			} catch (errInfo) {
				console.log("Validate Failed:", errInfo);
			}
		},
		[data, form]
	);

	const columns = useMemo(
		() => [
			{
				title: "КОД",
				dataIndex: "id",
				width: "10%",
				editable: true,
				filteredValue: [searchTerm],
				onFilter: (value, record) => {
					return (
						String(record.id).toLowerCase().includes(value.toLowerCase()) ||
						String(record.name).toLowerCase().includes(value.toLowerCase())
					);
				},
			},
			{
				title: "НАЗВАНИЕ ПРОЦЕДУРЫ",
				dataIndex: "name",
				width: "60%",
				editable: true,
			},
			{
				title: "СТОИМОСТЬ",
				dataIndex: "price",
				width: "10%",
				editable: true,
			},
			{
				title: "",
				dataIndex: "operation",
				render: (_, record) => {
					const editable = isEditing(record);
					return isLoggedIn ? (
						<span
							className="group-btns"
							onClick={(e) => {
								e.preventDefault();
								e.stopPropagation();
							}}
						>
							{editable ? (
								<span className="group-edit">
									<button
										className="save-proc"
										onClick={() => save(record.key)}
										style={{
											marginRight: 8,
										}}
									>
										{isSmallScreen ? <AiOutlineSave /> : "Сохранить"}
									</button>
								</span>
							) : (
								<button
									className="edit-proc"
									disabled={editingKey !== ""}
									onClick={() => edit(record)}
								>
									{isSmallScreen ? <AiOutlineEdit /> : "Редактировать"}
								</button>
							)}
							{data.length >= 1 ? (
								<Popconfirm
									title="Уверены, что хотите удалить?"
									cancelText="Отменить"
									onConfirm={() => {
										// if (editingKey) return;
										handleDelete(record);
									}}
								>
									<button className="delete-proc">
										{isSmallScreen ? <AiOutlineDelete /> : "Удалить"}
									</button>
								</Popconfirm>
							) : null}
						</span>
					) : (
						<button
							className={classNames("added-check", {
								active: selectedServices.some(
									(service) => service.key === record.key
								),
							})}
							onClick={() => handleAddToCheck(record)}
						>
							{windowWidth <= 600 ? (
								selectedServices.some(
									(service) => service.key === record.key
								) ? (
									<AiOutlineClose /> // Иконка для "Убрать из чека"
								) : (
									<AiOutlineCheck /> // Иконка для "Добавить в чек"
								)
							) : selectedServices.some(
									(service) => service.key === record.key
							  ) ? (
								"Убрать из чека"
							) : (
								"Добавить в чек"
							)}
						</button>
					);
				},
			},
		],
		[
			cancel,
			data.length,
			edit,
			editingKey,
			handleDelete,
			isEditing,
			save,
			searchTerm,
			isLoggedIn,
		]
	);

	const mergedColumns = useMemo(
		() =>
			columns.map((col) => {
				if (!col.editable) return col;
				return {
					...col,
					onCell: (record) => ({
						record,
						inputType: col.dataIndex === "price" ? "number" : "text",
						dataIndex: col.dataIndex,
						title: col.title,
						editing: isEditing(record),
					}),
				};
			}),
		[columns, isEditing]
	);

	return (
		<div className="table-container">
			<Form form={form} component={false}>
				<TableAntd
					components={{
						body: {
							cell: EditableCell,
						},
					}}
					bordered
					dataSource={dataSource}
					showSorterTooltip={false}
					columns={mergedColumns}
					rowClassName={(record, index) => {
						return classNames({
							"editable-row": true,
							active: selectedServices.some(
								(service) => service.key === record.key
							),
						});
					}}
					pagination={false}
					// onRow={(record) => {
					// 	return {
					// 		onClick: (event) => {
					// 			if (editingKey) return;
					// 			handleAddToCheck(record);
					// 		},
					// 	};
					// }}
				/>
			</Form>
		</div>
	);
};
