"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronDown, Search, Check, Loader2 } from "lucide-react"

export interface AddressOption {
    code: number
    name: string
}

interface AddressDropdownProps {
    placeholder: string
    value: AddressOption | null
    options: AddressOption[]
    onChange: (option: AddressOption) => void
    disabled?: boolean
    loading?: boolean
    icon: React.ReactNode
    error?: boolean
}

export function AddressDropdown({
    placeholder,
    value,
    options,
    onChange,
    disabled = false,
    loading = false,
    icon,
    error = false,
}: AddressDropdownProps) {
    const [open, setOpen] = useState(false)
    const [search, setSearch] = useState("")
    const containerRef = useRef<HTMLDivElement>(null)
    const searchRef = useRef<HTMLInputElement>(null)

    const filtered = options.filter(o =>
        o.name.toLowerCase().includes(search.toLowerCase())
    )

    useEffect(() => {
        if (open) {
            setTimeout(() => searchRef.current?.focus(), 50)
        } else {
            setSearch("")
        }
    }, [open])

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const handleSelect = (option: AddressOption) => {
        onChange(option)
        setOpen(false)
    }

    return (
        <div ref={containerRef} className="relative">
            <button
                type="button"
                disabled={disabled || loading}
                onClick={() => setOpen(v => !v)}
                className={[
                    "w-full flex items-center gap-3 px-3 h-11 rounded-xl border text-sm transition-all duration-200 text-left",
                    disabled || loading
                        ? "opacity-50 cursor-not-allowed bg-[var(--soft-gray)] border-[var(--border)]"
                        : open
                        ? "bg-white border-[var(--rose-gold)] ring-2 ring-[var(--rose-gold)]/20 cursor-pointer"
                        : error
                        ? "bg-white border-red-400 cursor-pointer"
                        : "bg-white border-[var(--input)] hover:border-[var(--rose-gold)]/60 cursor-pointer",
                ].join(" ")}
            >
                {loading ? (
                    <Loader2 className="h-4 w-4 text-[var(--muted-foreground)] animate-spin shrink-0" />
                ) : (
                    <span className="text-[var(--muted-foreground)] shrink-0 flex items-center">{icon}</span>
                )}
                <span className={`flex-1 truncate ${value ? "text-[var(--foreground)]" : "text-[var(--muted-foreground)]"}`}>
                    {value ? value.name : placeholder}
                </span>
                <ChevronDown
                    className={`h-4 w-4 text-[var(--muted-foreground)] shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
                />
            </button>

            {open && (
                <div className="absolute z-50 top-[calc(100%+6px)] left-0 right-0 bg-white rounded-2xl border border-[var(--border)] shadow-lg overflow-hidden animate-scale-in">
                    <div className="p-2 border-b border-[var(--border)]">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[var(--muted-foreground)]" />
                            <input
                                ref={searchRef}
                                type="text"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder={`Tìm ${placeholder.toLowerCase()}...`}
                                className="w-full pl-8 pr-3 py-2 text-sm rounded-xl bg-[var(--soft-gray)] border-0 outline-none focus:ring-1 focus:ring-[var(--rose-gold)]/30 placeholder:text-[var(--muted-foreground)]"
                            />
                        </div>
                    </div>
                    <div className="max-h-52 overflow-y-auto py-1">
                        {filtered.length === 0 ? (
                            <p className="text-center text-sm text-[var(--muted-foreground)] py-6">
                                Không tìm thấy kết quả
                            </p>
                        ) : (
                            filtered.map(option => (
                                <button
                                    key={option.code}
                                    type="button"
                                    onClick={() => handleSelect(option)}
                                    className={[
                                        "w-full flex items-center justify-between px-4 py-2.5 text-sm text-left transition-colors duration-150",
                                        value?.code === option.code
                                            ? "bg-[var(--blush)] text-[var(--rose-gold)] font-semibold"
                                            : "text-[var(--foreground)] hover:bg-[var(--blush)]",
                                    ].join(" ")}
                                >
                                    <span>{option.name}</span>
                                    {value?.code === option.code && (
                                        <Check className="h-3.5 w-3.5 text-[var(--rose-gold)] shrink-0" />
                                    )}
                                </button>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
