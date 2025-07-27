import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "data", "presets.json");

function readPresets() {
    const data = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(data);
}

function savePresets(presets: any[]) {
    fs.writeFileSync(filePath, JSON.stringify(presets, null, 2));
}

export async function GET() {
    try {
        const presets = readPresets();
        return NextResponse.json(presets);
    } catch {
        return NextResponse.json({ error: "Erreur lecture" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const newPreset = await req.json();
        const presets = readPresets();

        newPreset.id = Date.now().toString();

        presets.push(newPreset);
        savePresets(presets);

        return NextResponse.json({ success: true, preset: newPreset });
    } catch (error) {
        console.error("Erreur d'ajout:", error);
        return NextResponse.json({ error: "Erreur d'ajout" }, { status: 500 });
    }
}
