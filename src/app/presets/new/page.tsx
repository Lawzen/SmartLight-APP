'use client'

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import * as LucideIcons from "lucide-react"
import { Toaster, toast } from 'sonner'

const availableIcons = [
  'Sun', 'Moon', 'Lightbulb', 'Star', 'Lamp',
  'Droplet', 'Flame', 'Sparkles', 'Palette', 'Cloud',
  'Tree', 'Flower', 'Coffee', 'Book', 'Music', 'Bed'
] as const

const colorOptions = [
  { name: "Rouge", value: "#ef4444" },
  { name: "Orange", value: "#f97316" },
  { name: "Jaune", value: "#eab308" },
  { name: "Vert", value: "#22c55e" },
  { name: "Bleu", value: "#3b82f6" },
  { name: "Violet", value: "#8b5cf6" },
  { name: "Rose", value: "#ec4899" },
  { name: "Turquoise", value: "#06b6d4" },
]

export default function NewPresetPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [selectedIcon, setSelectedIcon] = useState<keyof typeof LucideIcons>("Lightbulb")
  const [selectedColor, setSelectedColor] = useState("#3b82f6")
  const [brightness, setBrightness] = useState(80)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim()) {
      toast.error("Veuillez entrer un nom pour le preset")
      return
    }

    setIsSubmitting(true)

    try {
      const newPreset = {
        name,
        icon: selectedIcon,
        color: colorOptions.find(c => c.value === selectedColor)?.name.toLowerCase() || "blue",
        brightness,
        hexColor: selectedColor
      }

      const response = await fetch('/api/presets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newPreset)
      })

      if (response.ok) {
        toast.success("Preset créé avec succès!")
        router.push("/")
      } else {
        throw new Error('Échec de la création')
      }
    } catch (error) {
      console.error(error)
      toast.error("Erreur lors de la création du preset")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-200 to-base-300 p-6">
      <Toaster position="top-center" richColors />
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-8">
          <button
            onClick={() => router.back()}
            className="btn btn-ghost btn-circle"
          >
            <LucideIcons.ArrowLeft size={24} />
          </button>
          <h1 className="text-3xl font-bold ml-4">Créer un nouveau preset</h1>
        </div>

        <div className="bg-base-100 rounded-2xl shadow-xl p-6 md:p-8">
          <form onSubmit={handleSubmit}>
            <div className="mb-8">
              <label className="label">
                <span className="label-text text-lg font-medium">Nom du preset</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Lumière du soir"
                className="input input-bordered w-full text-lg"
                maxLength={30}
              />
            </div>

            <div className="mb-8">
              <label className="label">
                <span className="label-text text-lg font-medium">Icône</span>
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-8 gap-4">
                {availableIcons.map(icon => {
                  const Icon = LucideIcons[icon]

                  if (!Icon) {
                    console.warn(`L'icône "${icon}" n'existe pas dans lucide-react`)
                    return null
                  }
                  return (
                    <button
                      key={icon}
                      type="button"
                      className={`btn btn-square h-20 w-full flex flex-col items-center justify-center gap-1 ${
                        selectedIcon === icon 
                          ? 'btn-primary' 
                          : 'btn-ghost bg-base-200'
                      }`}
                      onClick={() => setSelectedIcon(icon)}
                    >
                      <Icon className="w-8 h-8" />
                      <span className="text-xs mt-1">{icon}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="mb-8">
              <label className="label">
                <span className="label-text text-lg font-medium">Couleur</span>
              </label>
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-4">
                {colorOptions.map(color => (
                  <button
                    key={color.value}
                    type="button"
                    className={`h-12 rounded-lg flex items-center justify-center transition-all ${
                      selectedColor === color.value
                        ? 'ring-4 ring-offset-2 ring-primary'
                        : ''
                    }`}
                    style={{ backgroundColor: color.value }}
                    onClick={() => setSelectedColor(color.value)}
                    aria-label={color.name}
                  >
                    {selectedColor === color.value && (
                      <LucideIcons.Check className="text-white" size={20} />
                    )}
                  </button>
                ))}
              </div>

              <div className="mt-4 flex items-center gap-4">
                <div
                  className="w-10 h-10 rounded-full border-2 border-base-300"
                  style={{ backgroundColor: selectedColor }}
                ></div>
                <div className="text-lg font-mono">{selectedColor}</div>
              </div>
            </div>

            <div className="mb-8">
              <label className="label">
                <span className="label-text text-lg font-medium">
                  Luminosité: <span className="text-primary">{brightness}%</span>
                </span>
              </label>
              <div className="flex items-center gap-4">
                <LucideIcons.SunDim className="text-yellow-500" size={24} />
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={brightness}
                  onChange={(e) => setBrightness(parseInt(e.target.value))}
                  className="range range-primary flex-1"
                />
                <LucideIcons.Sun className="text-yellow-500" size={24} />
              </div>

              <div className="mt-4 flex justify-center">
                <div className="relative w-32 h-32 rounded-full bg-base-300 flex items-center justify-center overflow-hidden">
                  <div
                    className="absolute inset-0 rounded-full"
                    style={{
                      backgroundColor: selectedColor,
                      opacity: brightness / 100
                    }}
                  ></div>
                  <div className="relative z-10 text-4xl">
                    {brightness}%
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-10 pt-6 border-t border-base-300">
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => router.push("/")}
                disabled={isSubmitting}
              >
                Annuler
              </button>
              <button
                type="submit"
                className="btn btn-primary gap-2"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="loading loading-spinner"></span>
                ) : (
                  <LucideIcons.Plus size={20} />
                )}
                Créer le preset
              </button>
            </div>
          </form>
        </div>

        <div className="mt-8 text-center text-base-content/70">
          <p>Créez vos ambiances lumineuses personnalisées pour votre ampoule connectée</p>
        </div>
      </div>
    </div>
  )
}