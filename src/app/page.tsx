'use client'

import React, { useEffect, useState } from "react"
import { LightPresetCard } from "@/app/components/LightPresetCard"
import * as LucideIcons from "lucide-react"
import { Toaster, toast } from 'sonner'
import {useRouter} from "next/navigation";

type Preset = {
    id: string
    name: string
    icon: keyof typeof LucideIcons
    color: string
    brightness: number
    hexColor: string
}

export default function Page() {
    const router = useRouter()
    const [presets, setPresets] = useState<Preset[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchPresets = async () => {
            try {
                const res = await fetch("/api/presets")
                const data = await res.json()
                setPresets(data)
            } catch (error) {
                console.error("Erreur de chargement des presets:", error)
                toast.error("Erreur de chargement des presets")
            } finally {
                setIsLoading(false)
            }
        }

        fetchPresets()
    }, [])

    const handleActivate = async (id: string) => {
        const preset = presets.find(p => p.id === id)

        if (!preset) return

        try {
            setIsLoading(true)
            const response = await fetch('/api/control', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    brightness: preset.brightness,
                    color: preset.hexColor
                })
            })

            if (response.ok) {
                toast.success(`Preset activé: ${preset.name}`)
            } else {
                const errorData = await response.json()
                throw new Error(errorData.error || 'Échec du contrôle cloud')
            }
        } catch (error) {
            console.error(error)
            toast.error("Erreur lors de l'activation")
        } finally {
            setIsLoading(false)
        }
    }

    const handleDelete = async (id: string) => {
        try {
            setIsLoading(true)
            await fetch(`/api/presets/${id}`, { method: "DELETE" })
            setPresets(prev => prev.filter(p => p.id !== id))
            toast.success("Préférence supprimée")
        } catch (error) {
            console.error("Erreur de suppression:", error)
            toast.error("Erreur de suppression")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <main className="min-h-screen bg-gradient-to-br from-base-200 to-base-300 p-6">
            <Toaster position="top-center" richColors />

            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="text-4xl font-bold text-primary">Mes Ambiances Lumineuses</h1>
                    </div>

                    <button
                        className="btn btn-primary gap-2"
                        onClick={() => router.push("/presets/new")}
                    >
                        <LucideIcons.Plus size={18} />
                        Preset
                    </button>
                </div>

                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="loading loading-spinner loading-lg text-primary"></div>
                    </div>
                ) : presets.length === 0 ? (
                    <div className="text-center py-20">
                        <LucideIcons.Lightbulb className="mx-auto w-16 h-16 text-primary mb-4" />
                        <h2 className="text-2xl font-bold mb-2">Aucun preset trouvé</h2>
                        <p className="text-base-content/80 mb-6">
                            Créez votre premier preset pour commencer à contrôler votre ampoule
                        </p>
                        <button
                            className="btn btn-primary"
                            onClick={() => router.push("/components/presets/new")}
                        >
                            Créer un preset
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {presets.map(preset => {
                            const Icon = LucideIcons[preset.icon] ?? LucideIcons.Lightbulb
                            if (!Icon) return null
                            return (
                                <LightPresetCard
                                    key={preset.id}
                                    name={preset.name}
                                    icon={<Icon className={`w-8 h-8 text-${preset.color}-500`} />}
                                    color={preset.hexColor}
                                    brightness={preset.brightness}
                                    onActivate={() => handleActivate(preset.id)}
                                    onEdit={() => router.push(`/presets/${preset.id}/edit`)}
                                    onDelete={() => handleDelete(preset.id)}
                                />
                            )
                        })}
                    </div>
                )}
            </div>
        </main>
    )
}