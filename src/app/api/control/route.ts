import { NextResponse } from "next/server";
import { TuyaContext } from "@tuya/tuya-connector-nodejs";

export async function POST(req: Request) {
    try {
        const { brightness, color } = await req.json();

        const context = new TuyaContext({
            baseUrl: "https://openapi.tuyaeu.com",
            accessKey: process.env.TUYA_ACCESS_KEY!,
            secretKey: process.env.TUYA_SECRET_KEY!,
            deviceId: process.env.TUYA_DEVICE_ID!,
        });

        const hsv = hexToHsv(color);
        const colourDataStr = `${Math.round(hsv.h)}:${Math.round(hsv.s * 1000)}:${Math.round(hsv.v * 1000)}`;

        if (colourDataStr.length > 255) {
            throw new Error("colour_data dépasse la limite de 255 caractères");
        }

        await context.request({
            path: `/v1.0/iot-03/devices/${process.env.TUYA_DEVICE_ID}/commands`,
            method: "POST",
            body: {
                commands: [
                    { code: "switch_led", value: true },
                    { code: "work_mode", value: "colour" },
                    {
                        code: "bright_value",
                        value: Math.max(10, Math.min(1000, Math.round(brightness * 10)))
                    },
                    {
                        code: "colour_data",
                        value: colourDataStr
                    }
                ]
            }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Erreur de contrôle Tuya :", error);
        return NextResponse.json(
            {
                error: "Échec du contrôle de l'ampoule",
                details: error instanceof Error ? error.message : String(error),
            },
            { status: 500 }
        );
    }
}

function hexToHsv(hex: string) {
    hex = hex.replace("#", "");
    const r = parseInt(hex.substring(0, 2), 16) / 255;
    const g = parseInt(hex.substring(2, 4), 16) / 255;
    const b = parseInt(hex.substring(4, 6), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    const v = max;
    const d = max - min;
    const s = max === 0 ? 0 : d / max;

    if (d === 0) {
        h = 0;
    } else {
        switch (max) {
            case r:
                h = (g - b) / d + (g < b ? 6 : 0);
                break;
            case g:
                h = (b - r) / d + 2;
                break;
            case b:
                h = (r - g) / d + 4;
                break;
        }
        h *= 60;
    }

    return {
        h: Math.max(0, Math.min(360, h)),
        s: Math.max(0, Math.min(1, s)),
        v: Math.max(0, Math.min(1, v))
    };
}