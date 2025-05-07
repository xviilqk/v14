import { NextResponse } from "next/server";
import pets from "@/app/data/mockData";

export async function GET() {
  return NextResponse.json(pets);
}