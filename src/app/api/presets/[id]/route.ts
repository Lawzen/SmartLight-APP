import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

const filePath = path.join(process.cwd(), "data", "presets.json")

function readPresets() {
    const data = fs.readFileSync(filePath, "utf-8")
    return JSON.parse(data)
}

function savePresets(presets: any[]) {
    fs.writeFileSync(filePath, JSON.stringify(presets, null, 2))
}

interface RouteParams {
    params: { id: string }
}

export async function GET(req: Request, { params }: RouteParams) {
    try {
        const presets = readPresets()
        const preset = presets.find((p: { id: string }) => p.id === params.id)

        if (!preset) {
            return NextResponse.json({ error: "Preset non trouvé" }, { status: 404 })
        }

        return NextResponse.json(preset)
    } catch (error) {
        return NextResponse.json({ error: "Erreur lecture" }, { status: 500 })
    }
}

export async function PUT(req: Request, { params }: RouteParams) {
    const id = params.id
    const updated = await req.json()

    try {
        const presets = readPresets()
        const index = presets.findIndex((p: { id: string }) => p.id === id)

        if (index === -1) {
            return NextResponse.json({ error: "Preset non trouvé" }, { status: 404 })
        }

        presets[index] = { ...presets[index], ...updated }
        savePresets(presets)

        return NextResponse.json({ success: true, preset: presets[index] })
    } catch (error) {
        return NextResponse.json({ error: "Erreur mise à jour" }, { status: 500 })
    }
}

export async function DELETE(req: Request, { params }: RouteParams) {
    const id = params.id

    try {
        const presets = readPresets()
        const filtered = presets.filter((p: { id: string }) => p.id !== id)
        savePresets(filtered)

        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json({ error: "Erreur suppression" }, { status: 500 })
    }
}