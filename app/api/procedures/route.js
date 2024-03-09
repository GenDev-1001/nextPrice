import connectMongoDB from "@/libs/mongodb";
import Service from "@/models/service";
import { NextResponse } from "next/server";

export async function GET() {
	await connectMongoDB();
	const services = await Service.find();
	return NextResponse.json({ services });
}

export async function POST(request) {
	const { id, category, name, price, key } = await request.json();
	await connectMongoDB();
	await Service.create({ id, category, name, price, key });
	return NextResponse.json({ message: "Service Created" }, { status: 201 });
}

export async function DELETE(request) {
	const key = request.nextUrl.searchParams.get("key");
	await connectMongoDB();
	await Service.deleteOne({ key });
	return NextResponse.json({ message: "Service deleted" }, { status: 200 });
}


