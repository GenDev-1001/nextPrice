import connectMongoDB from "@/libs/mongodb";
import Service from "@/models/service";
import { NextResponse } from "next/server";

export async function PUT(request, { params }) {
  console.log(params);

	const { id: key } = params;
	const { id, name, price } = await request.json();

  console.log(id, name, price);
	await connectMongoDB();
	await Service.findOneAndUpdate({ key }, { id, name, price });
	return NextResponse.json({ message: "Service updated" }, { status: 200 });
}
