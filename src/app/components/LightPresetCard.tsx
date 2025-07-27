import { JSX } from "react"
import * as LucideIcons from "lucide-react"

interface Props {
    name: string;
    icon: JSX.Element;
    color: string;
    brightness: number;
    onActivate: () => void;
    onEdit?: () => void;
    onDelete?: () => void;
}

export function LightPresetCard({
                                    name,
                                    icon,
                                    color,
                                    brightness,
                                    onActivate,
                                    onEdit,
                                    onDelete
                                }: Props) {
    return (
        <div className="card bg-base-100 shadow-xl border border-base-300 transform transition-transform hover:scale-[1.02]">
            <div className="card-body">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full bg-base-200">
                            {icon}
                        </div>
                        <div>
                            <h2 className="card-title">{name}</h2>
                            <div className="flex items-center gap-2 mt-1">
                                <div
                                    className="w-4 h-4 rounded-full border border-base-content/20"
                                    style={{ backgroundColor: color }}
                                ></div>
                                <div className="text-sm text-base-content/80">
                                    {brightness}% luminosité
                                </div>
                            </div>
                        </div>
                    </div>
                    {onEdit && (
                        <button
                            className="btn btn-ghost btn-sm btn-square text-info"
                            onClick={onEdit}
                        >
                            <LucideIcons.Pencil size={16} />
                        </button>
                    )}
                    {onDelete && (
                        <button
                            className="btn btn-ghost btn-sm btn-square text-error"
                            onClick={onDelete}
                        >
                            <LucideIcons.Trash2 size={16} />
                        </button>
                    )}
                </div>

                <div className="card-actions mt-4">
                    <button
                        className="btn btn-primary flex-1 gap-2"
                        onClick={onActivate}
                    >
                        <LucideIcons.Power size={16} />
                        Activer
                    </button>
                </div>
            </div>
        </div>
    )
}