"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { ShoppingCart, User, Menu, X, Heart, Search, Loader2, ChevronDown, Truck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCartStore } from "@/store/cartStore"
import { useWishlistStore } from "@/store/wishlistStore"
import { useAuthStore } from "@/store/authStore"
import { useState, useEffect, useRef } from "react"
import api from "@/lib/api"
import { formatPrice } from "@/lib/formatPrice"

interface SearchResult {
    id: string
    name: string
    slug: string
    price: string
    images: string[]
    category: string
}

export function Navbar() {
    const router = useRouter()
    const [mobileOpen, setMobileOpen] = useState(false)
    const [searchOpen, setSearchOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [searchResults, setSearchResults] = useState<SearchResult[]>([])
    const [searchLoading, setSearchLoading] = useState(false)
    const searchRef = useRef<HTMLDivElement>(null)
    const searchInputRef = useRef<HTMLInputElement>(null)

    const items = useCartStore((s) => s.items)
    const wishlistItems = useWishlistStore((s) => s.items)
    const { user, token } = useAuthStore()

    const cartCount = items.reduce((sum, item) => sum + item.quantity, 0)
    const wishlistCount = wishlistItems.length

    const navLinks = [
        { href: "/", label: "Home" },
        {
            href: "#",
            label: "Sản phẩm",
            children: [
                { href: "/products/skin-care", label: "Chăm sóc da" },
                { href: "/products/hair-care", label: "Chăm sóc tóc" },
            ]
        },
        { href: `/tag/${encodeURIComponent('Best Seller')}`, label: "Bán chạy nhất" },
        { href: "/contact-us", label: "Liên hệ" },   
        { href: "/faqs", label: "FAQs" },   
        { href: "/sale", label: "Khuyến mãi" }      
    ]

    useEffect(() => {
        if (!searchQuery.trim()) { setSearchResults([]); return }
        const timer = setTimeout(async () => {
            setSearchLoading(true)
            try {
                const res = await api.get("/products", { params: { search: searchQuery, limit: 5 } })
                setSearchResults(res.data.products || [])
            } catch {
                setSearchResults([])
            } finally {
                setSearchLoading(false)
            }
        }, 300)
        return () => clearTimeout(timer)
    }, [searchQuery])

    useEffect(() => {
        if (searchOpen && searchInputRef.current) searchInputRef.current.focus()
    }, [searchOpen])

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
                setSearchOpen(false); setSearchQuery("")
            }
        }
        if (searchOpen) document.addEventListener("mousedown", handleClick)
        return () => document.removeEventListener("mousedown", handleClick)
    }, [searchOpen])

    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") { setSearchOpen(false); setSearchQuery("") }
        }
        document.addEventListener("keydown", handleKey)
        return () => document.removeEventListener("keydown", handleKey)
    }, [])

    const handleResultClick = (slug: string) => {
        setSearchOpen(false); setSearchQuery("")
        router.push(`/product/${slug}`)
    }

    const CATEGORY_LABELS: Record<string, string> = {
    "skin-care": "Chăm sóc da",
    "hair-care": "Chăm sóc tóc",
}

    return (
        <>
            <nav className="sticky top-0 left-0 right-0 z-50 navbar-luxury">
                <div className="container mx-auto px-4 lg:px-10 navbar-luxury-inner">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2.5 group shrink-0">
                        <img src="/logo.png" alt="Fluer" className="h-11 w-11 md:h-12 md:w-12 object-contain transition-transform duration-300 group-hover:scale-105" />
                        <span className="text-xl font-bold tracking-tight text-[#b8893c]">Fluer</span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex flex-1 items-center justify-between ml-8">
                        <div className="flex items-center justify-center flex-1 gap-6">
                            {navLinks.map((link, index) => (
                                <div key={index} className="relative group py-4 shrink-0">
                                    {link.children ? (
                                        <div className="relative cursor-pointer">
                                            <button className="flex items-center gap-1 text-[13px] uppercase tracking-wide font-semibold text-[#f6efe6] hover:text-[#b8893c] transition-all duration-300 whitespace-nowrap">
                                                {link.label}
                                                <ChevronDown className="h-3.5 w-3.5 transition-transform duration-300 group-hover:rotate-180 shrink-0" />
                                            </button>

                                            {/* Dropdown */}
                                            <div className="absolute top-full left-1/2 -translate-x-1/2 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 pt-2">
                                                <div className="bg-[#1f1a17] border border-white/10 shadow-2xl rounded-2xl py-3 overflow-hidden">
                                                    {link.children.map((child, childIndex) => (
                                                        <Link
                                                            key={childIndex}
                                                            href={child.href}
                                                            className="flex flex-col px-5 py-3 hover:bg-white/8 transition-colors group/item"
                                                        >
                                                            <span className="text-[14px] font-semibold text-[#f6efe6] group-hover/item:text-[#b8893c] transition-colors whitespace-nowrap">
                                                                {child.label}
                                                            </span>
                                                            {child.desc && (
                                                                <span className="text-xs text-white/40 mt-0.5 group-hover/item:text-white/60 transition-colors">
                                                                    {child.desc}
                                                                </span>
                                                            )}
                                                        </Link>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <Link
                                            href={link.href}
                                            className="relative text-[13px] uppercase tracking-wide font-semibold text-[#f6efe6] hover:text-[#b8893c] transition-all duration-300 whitespace-nowrap"
                                        >
                                            {link.label}
                                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#b8893c] transition-all duration-300 group-hover:w-full" />
                                        </Link>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Icons */}
                        <div className="flex items-center gap-2 ml-4 shrink-0">
                            <Button variant="ghost" size="icon" className="navbar-icon-btn" onClick={() => setSearchOpen(true)}>
                                <Search className="h-[18px] w-[18px]" />
                            </Button>
                            <Link href="/wishlist">
                                <Button variant="ghost" size="icon" className="navbar-icon-btn relative">
                                    <Heart className="h-[17px] w-[17px]" />
                                    {wishlistCount > 0 && (
                                        <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-[#b8893c] text-white text-[10px] font-semibold flex items-center justify-center">
                                            {wishlistCount}
                                        </span>
                                    )}
                                </Button>
                            </Link>
                            <Link href="/cart">
                                <Button variant="ghost" size="icon" className="navbar-icon-btn relative">
                                    <ShoppingCart className="h-[17px] w-[17px]" />
                                    {cartCount > 0 && (
                                        <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-[#b8893c] text-white text-[10px] font-semibold flex items-center justify-center">
                                            {cartCount}
                                        </span>
                                    )}
                                </Button>
                            </Link>
                            {user?.role === "shipper" && (
                                <Link href="/shipper/orders">
                                    <Button variant="ghost" size="icon" className="navbar-icon-btn" title="Trang Shipper">
                                        <Truck className="h-[17px] w-[17px]" />
                                    </Button>
                                </Link>
                            )}
                            <Link href={token ? "/dashboard" : "/login"}>
                                <Button variant="ghost" size="icon" className="navbar-icon-btn">
                                    <User className="h-[17px] w-[17px]" />
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Mobile icons + toggle */}
                    <div className="flex md:hidden items-center gap-0.5">
                        <Button variant="ghost" size="icon" className="navbar-icon-btn" onClick={() => setSearchOpen(true)}>
                            <Search className="h-[18px] w-[18px]" />
                        </Button>
                        <Link href="/wishlist">
                            <Button variant="ghost" size="icon" className="navbar-icon-btn relative">
                                <Heart className="h-[18px] w-[18px]" />
                                {wishlistCount > 0 && (
                                    <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-[#b8893c] text-white text-[10px] font-semibold flex items-center justify-center">
                                        {wishlistCount}
                                    </span>
                                )}
                            </Button>
                        </Link>
                        <Link href="/cart">
                            <Button variant="ghost" size="icon" className="navbar-icon-btn relative">
                                <ShoppingCart className="h-[18px] w-[18px]" />
                                {cartCount > 0 && (
                                    <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-[#b8893c] text-white text-[10px] font-semibold flex items-center justify-center">
                                        {cartCount}
                                    </span>
                                )}
                            </Button>
                        </Link>
                        <Button variant="ghost" size="icon" className="navbar-icon-btn" onClick={() => setMobileOpen(!mobileOpen)}>
                            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </Button>
                    </div>
                </div>
            </nav>

            {/* Search Overlay */}
            {/* Search Bar — thay thế Search Overlay cũ */}
                <div className={`fixed top-0 left-0 right-0 z-[60] transition-all duration-300 ${searchOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
                    <div className="bg-[#1f1a17] shadow-lg border-b border-[var(--border)]" ref={searchRef}>
                        <div className="container mx-auto px-6 lg:px-14">
                            <div className="flex items-center gap-4 h-20">
                                {/* Icon search */}
                                <Search className="h-5 w-5 text-[var(--muted-foreground)] shrink-0" />

                                {/* Input */}
                                <input
                                    ref={searchInputRef}
                                    type="text"
                                    placeholder="Tìm kiếm sản phẩm..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="flex-1 text-lg outline-none placeholder:text-white/30 bg-transparent text-white"
                                />

                                {/* Loading */}
                                {searchLoading && <Loader2 className="h-5 w-5 animate-spin text-[var(--rose-gold)] shrink-0" />}

                                {/* Nút đóng */}
                                <button
                                    onClick={() => { setSearchOpen(false); setSearchQuery("") }}
                                    className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-[var(--soft-gray)] transition-colors"
                                >
                                    <X className="h-5 w-5 text-[var(--muted-foreground)]" />
                                </button>
                            </div>

                            {/* Kết quả tìm kiếm */}
                            {searchQuery.trim() && (
                                <div className="border-t border-[var(--border)] max-h-80 overflow-y-auto">
                                    {searchResults.length > 0 ? (
                                        <div className="py-2">
                                            {searchResults.map((product) => (
                                                <button
                                                    key={product.id}
                                                    onClick={() => handleResultClick(product.slug)}
                                                    className="w-full flex items-center gap-4 px-2 py-3 hover:bg-[var(--soft-gray)] transition-colors text-left rounded-xl"
                                                >
                                                    <div className="w-12 h-12 rounded-xl bg-[var(--soft-gray)] border border-[var(--border)] flex items-center justify-center overflow-hidden shrink-0">
                                                        {product.images?.[0] ? (
                                                            <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <Search className="h-4 w-4 text-[var(--muted-foreground)]" />
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium truncate text-[#f6efe6]">{product.name}</p>
                                                        <p className="text-xs text-white/40">{CATEGORY_LABELS[product.category] || product.category?.replace(/-/g, " ")}</p>
                                                    </div>
                                                    <span className="text-sm font-semibold text-[var(--rose-gold)] shrink-0">
                                                        {formatPrice(parseFloat(product.price))}
                                                    </span>
                                                </button>
                                            ))}
                                        </div>
                                    ) : !searchLoading ? (
                                        <div className="py-8 text-center">
                                            <p className="text-sm text-[var(--muted-foreground)]">Không tìm thấy &ldquo;{searchQuery}&rdquo;</p>
                                        </div>
                                    ) : null}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Backdrop mờ phía dưới */}
                    {searchQuery.trim() && searchResults.length > 0 && (
                        <div
                            className="absolute inset-0 top-20 bg-black/30 -z-10"
                            onClick={() => { setSearchOpen(false); setSearchQuery("") }}
                        />
                    )}
                </div>
            {/* Mobile Menu */}
            <div className={`fixed inset-0 z-40 md:hidden transition-all duration-300 ${mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
                <div className={`absolute top-0 right-0 h-full w-72 bg-[#1f1a17] shadow-2xl transition-transform duration-300 ${mobileOpen ? "translate-x-0" : "translate-x-full"}`}>
                    <div className="flex justify-end p-4">
                        <Button variant="ghost" size="icon" className="navbar-icon-btn" onClick={() => setMobileOpen(false)}>
                            <X className="h-5 w-5" />
                        </Button>
                    </div>
                    <div className="flex flex-col gap-1 px-6">
                        <Link href="/" onClick={() => setMobileOpen(false)} className="px-4 py-3 rounded-lg text-sm font-medium text-[#f6efe6] hover:bg-white/5 hover:text-[#b8893c] transition-colors">Home</Link>
                        <p className="px-4 pt-3 pb-1 text-xs uppercase tracking-widest text-white/40">Sản phẩm</p>
                        <Link href="/products/skin-care" onClick={() => setMobileOpen(false)} className="px-4 py-2.5 rounded-lg text-sm font-medium text-[#f6efe6] hover:bg-white/5 hover:text-[#b8893c] transition-colors pl-6">Chăm sóc da</Link>
                        <Link href="/products/hair-care" onClick={() => setMobileOpen(false)} className="px-4 py-2.5 rounded-lg text-sm font-medium text-[#f6efe6] hover:bg-white/5 hover:text-[#b8893c] transition-colors pl-6">Chăm sóc tóc</Link>
                        <Link href={`/tag/${encodeURIComponent('Best Seller')}`} onClick={() => setMobileOpen(false)} className="px-4 py-2.5 rounded-lg text-sm font-medium text-[#f6efe6] hover:bg-white/5 hover:text-[#b8893c] transition-colors pl-6">Best Sellers</Link>
                        <Link href="/contact-us" onClick={() => setMobileOpen(false)} className="px-4 py-3 rounded-lg text-sm font-medium text-[#f6efe6] hover:bg-white/5 hover:text-[#b8893c] transition-colors">Contact</Link>
                        <Link href="/faqs" onClick={() => setMobileOpen(false)} className="px-4 py-3 rounded-lg text-sm font-medium text-[#f6efe6] hover:bg-white/5 hover:text-[#b8893c] transition-colors">FAQs</Link>
                        <div className="my-3 border-t border-white/10" />
                        <Link href={token ? "/dashboard" : "/login"} onClick={() => setMobileOpen(false)} className="px-4 py-3 rounded-lg text-sm font-medium text-[#f6efe6] hover:bg-white/5 hover:text-[#b8893c] transition-colors">
                            {token ? "Tài khoản của tôi" : "Đăng nhập"}
                        </Link>
                        {user?.role === "shipper" && (
                            <Link href="/shipper/orders" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium text-blue-400 hover:bg-white/5 transition-colors">
                                <Truck className="h-4 w-4" /> Trang Shipper
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}