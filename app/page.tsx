"use client"

import { useState, createContext, useContext, useMemo, useRef, useEffect } from "react"
import Image from "next/image"
import {
  ShoppingCart,
  CreditCard,
  Palette,
  Languages,
  LogOut,
  UserPlus,
  LayoutDashboard,
  Trash2,
  Plus,
  Minus,
  Upload,
  RotateCw,
  Download,
  Users,
  Package,
  FileText,
  Truck,
  Edit3,
  Search,
  Move,
  Maximize,
  ShieldCheck,
  MapPin,
  FileArchive,
  Loader2,
  ChevronRight,
  CheckCircle,
  Printer,
  LogInIcon,
} from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"

// --- TYPE DEFINITIONS ---
// Provides a type for the translation object, ensuring all language objects have the same keys.
type TranslationSet = typeof translations.en

// Defines the structure for a product.
interface Product {
  id: number
  name: string
  price: number
  image: string
  categoryId: string
}

// Extends the Product type to include quantity for items in the shopping cart.
interface CartItem extends Product {
  quantity: number
}

// Defines the structure for a user account.
interface User {
  id: number
  email: string
  password?: string // Note: Included for mock data purposes. Avoid storing plain passwords.
  role: "client" | "admin" | "operations"
  customerNumber: string
}

// Defines the structure for a saved design.
interface Design {
  id: number
  name: string
  type: string
  preview: string
}

// Defines the structure for an order.
interface Order {
  id: string
  customer: string
  date: string
  total: number
  status: string
  items: { name: string; quantity: number }[]
}

// Defines the base structure for a vehicle.
interface Vehicle {
  make: string
  model: string
  svgPath: string
}

// A more specific type for the vehicle state, which can also hold an error message.
type VehicleState = Vehicle | { error: string }

// Defines the complete shape of the application's context.
interface AppContextType {
  page: string
  setPage: (page: string) => void
  goBack: () => void
  user: User | null
  setUser: React.Dispatch<React.SetStateAction<User | null>>
  lang: "en" | "sv"
  setLang: React.Dispatch<React.SetStateAction<"en" | "sv">>
  t: TranslationSet
  cart: CartItem[]
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>
  addToCart: (product: Product) => void
  updateQuantity: (productId: number, quantity: number) => void
  logout: () => void
  uploadedDesignForCar: string | null
  setUploadedDesignForCar: React.Dispatch<React.SetStateAction<string | null>>
}

// --- MOCK DATA & TRANSLATIONS ---
const translations = {
  en: {
    platformName: "PrintWrap Pro",
    homepageTitle: "Design. Wrap. Print. Delivered.", // Updated for typing animation
    homepageSubtitle:
      "High-quality custom prints and professional car wrapping services in Sweden. Inspired by Vistaprint, powered by innovation.",
    startDesigning: "Start Designing",
    viewProducts: "View Products",
    login: "Login",
    signup: "Sign Up",
    products: "Products",
    dashboard: "Dashboard",
    cart: "Cart",
    checkout: "Checkout",
    logout: "Logout",
    allCategories: "All Categories",
    vat: "VAT (25%)",
    shipping: "Shipping",
    total: "Total",
    price: "Price",
    quantity: "Quantity",
    language: "Language",
    email: "Email",
    password: "Password",
    confirmPassword: "Confirm Password",
    customerNumber: "Customer Number",
    alreadyHaveAccount: "Already have an account?",
    dontHaveAccount: "Don't have an account?",
    clientDashboard: "Client Dashboard",
    savedDesigns: "Saved Designs",
    orderHistory: "Order History",
    billingShippingInfo: "Billing & Shipping Info",
    adminDashboard: "Admin Dashboard",
    manageUsers: "Manage Users",
    manageProductsPrices: "Manage Products & Prices",
    operationsDashboard: "Operations Dashboard",
    activeOrdersQueue: "Active Orders Queue",
    designTool: "Design Tool",
    uploadImage: "Upload Image",
    addText: "Add Text",
    textProperties: "Text Properties",
    font: "Font",
    color: "Color",
    size: "Size",
    imageProperties: "Image Properties",
    dragResizeRotate: "Drag, Resize, Rotate",
    importDesign: "Import Design (PDF/AI)",
    previewExport: "Preview & Export",
    downloadPNG: "Download PNG",
    downloadPDF: "Download PDF",
    canvasArea: "Design Canvas",
    carWrapDesigner: "Car Wrap Designer",
    enterLicensePlate: "Enter Swedish License Plate",
    findVehicle: "Find Vehicle",
    vehicleMockup: "Vehicle Mockup",
    applyDesignToWrap: "Apply Design to Wrap",
    bleedGuidelines: "Bleed Guidelines",
    productCategories: "Product Categories",
    flyers: "Flyers",
    businessCards: "Business Cards",
    stickers: "Stickers",
    carWraps: "Car Wraps",
    decals: "Decals",
    apparel: "Apparel",
    promotionalItems: "Promotional Items",
    addToCart: "Add to Cart",
    shippingOptions: "Shipping Options",
    standardShipping: "Standard (5-7 days)",
    expressShipping: "Express (2-3 days)",
    paymentMethod: "Payment Method",
    payWithSwish: "Pay with Swish",
    payWithCard: "Pay with Card",
    payWithKlarna: "Pay with Klarna",
    payNow: "Pay Now",
    orderConfirmation: "Order Confirmation",
    thankYouForOrder: "Thank you for your order!",
    orderSummaryEmail: "A summary of your order and a PDF proof (simulated) has been sent to your email.",
    backToHome: "Back to Home",
    addNewProduct: "Add New Product",
    productName: "Product Name",
    category: "Category",
    actions: "Actions",
    edit: "Edit",
    delete: "Delete",
    userRole: "Role",
    orderId: "Order ID",
    customer: "Customer",
    date: "Date",
    status: "Status",
    updateStatus: "Update Status",
    exportPrintFile: "Export Print File",
    fullName: "Full Name",
    address: "Address",
    city: "City",
    postalCode: "Postal Code",
    country: "Country",
    phone: "Phone",
    saveInfo: "Save Information",
    processingPayment: "Processing Payment...",
    howItWorks: "How It Works",
    step1Title: "Design Online",
    step1Desc: "Use our easy tools to create or upload your perfect design.",
    step2Title: "Place Your Order",
    step2Desc: "Select products, quantity, and checkout in a few clicks.",
    step3Title: "Fast Delivery",
    step3Desc: "We print, pack, and ship your order right to your door.",
    featuredProducts: "Featured Products",
    popularProducts: "Popular Products",
    customize: "Customize",
  },
  sv: {
    platformName: "PrintWrap Pro",
    homepageTitle: "Designa. Foliera. Tryck. Levererat.", // Updated for typing animation
    homepageSubtitle:
      "Högkvalitativa anpassade tryck och professionella bilfolieringstjänster i Sverige. Inspirerad av Vistaprint, driven av innovation.",
    startDesigning: "Börja Designa",
    viewProducts: "Visa Produkter",
    login: "Logga In",
    signup: "Registrera Dig",
    products: "Produkter",
    dashboard: "Kontrollpanel",
    cart: "Varukorg",
    checkout: "Kassa",
    logout: "Logga Ut",
    allCategories: "Alla Kategorier",
    vat: "Moms (25%)",
    shipping: "Frakt",
    total: "Totalt",
    price: "Pris",
    quantity: "Antal",
    language: "Språk",
    email: "E-post",
    password: "Lösenord",
    confirmPassword: "Bekräfta Lösenord",
    customerNumber: "Kundnummer",
    alreadyHaveAccount: "Har du redan ett konto?",
    dontHaveAccount: "Har du inget konto?",
    clientDashboard: "Kundpanel",
    savedDesigns: "Sparade Designer",
    orderHistory: "Orderhistorik",
    billingShippingInfo: "Fakturerings- & Leveransinfo",
    adminDashboard: "Adminpanel",
    manageUsers: "Hantera Användare",
    manageProductsPrices: "Hantera Produkter & Priser",
    operationsDashboard: "Driftpanel",
    activeOrdersQueue: "Aktiva Beställningar",
    designTool: "Designverktyg",
    uploadImage: "Ladda Upp Bild",
    addText: "Lägg Till Text",
    textProperties: "Textegenskaper",
    font: "Typsnitt",
    color: "Färg",
    size: "Storlek",
    imageProperties: "Bildegenskaper",
    dragResizeRotate: "Dra, Ändra Storlek, Rotera",
    importDesign: "Importera Design (PDF/AI)",
    previewExport: "Förhandsgranska & Exportera",
    downloadPNG: "Ladda Ner PNG",
    downloadPDF: "Ladda Ner PDF",
    canvasArea: "Designyta",
    carWrapDesigner: "Bilfolieringsdesigner",
    enterLicensePlate: "Ange Svenskt Registreringsnummer",
    findVehicle: "Hitta Fordon",
    vehicleMockup: "Fordonsmockup",
    applyDesignToWrap: "Applicera Design på Foliering",
    bleedGuidelines: "Utfallslinjer",
    productCategories: "Produktkategorier",
    flyers: "Flygblad",
    businessCards: "Visitkort",
    stickers: "Klistermärken",
    carWraps: "Bilfoliering",
    decals: "Dekaler",
    apparel: "Kläder",
    promotionalItems: "Reklamartiklar",
    addToCart: "Lägg Till i Varukorg",
    shippingOptions: "Fraktalternativ",
    standardShipping: "Standard (5-7 dagar)",
    expressShipping: "Express (2-3 dagar)",
    paymentMethod: "Betalningsmetod",
    payWithSwish: "Betala med Swish",
    payWithCard: "Betala med Kort",
    payWithKlarna: "Betala med Klarna",
    payNow: "Betala Nu",
    orderConfirmation: "Orderbekräftelse",
    thankYouForOrder: "Tack för din beställning!",
    orderSummaryEmail:
      "En sammanfattning av din beställning och en PDF-korrektur (simulerad) har skickats till din e-post.",
    backToHome: "Tillbaka till Startsidan",
    addNewProduct: "Lägg Till Ny Produkt",
    productName: "Produktnamn",
    category: "Kategori",
    actions: "Åtgärder",
    edit: "Redigera",
    delete: "Ta Bort",
    userRole: "Roll",
    orderId: "Order-ID",
    customer: "Kund",
    date: "Datum",
    status: "Status",
    updateStatus: "Uppdatera Status",
    exportPrintFile: "Exportera Tryckfil",
    fullName: "Fullständigt Namn",
    address: "Adress",
    city: "Stad",
    postalCode: "Postnummer",
    country: "Land",
    phone: "Telefon",
    saveInfo: "Spara Information",
    processingPayment: "Bearbetar Betalning...",
    howItWorks: "Hur det fungerar",
    step1Title: "Designa Online",
    step1Desc: "Använd våra enkla verktyg för att skapa eller ladda upp din perfekta design.",
    step2Title: "Gör din beställning",
    step2Desc: "Välj produkter, antal och betala med några få klick.",
    step3Title: "Snabb leverans",
    step3Desc: "Vi trycker, packar och skickar din beställning direkt till din dörr.",
    featuredProducts: "Utvalda Produkter",
    popularProducts: "Populära Produkter",
    customize: "Anpassa",
  },
}

const mockUsers: User[] = [
  { id: 1, email: "client@example.com", password: "password", role: "client", customerNumber: "CUST-84371" },
  { id: 2, email: "admin@example.com", password: "password", role: "admin", customerNumber: "ADMIN-00001" },
  { id: 3, email: "ops@example.com", password: "password", role: "operations", customerNumber: "OPS-00001" },
]

const productCategories = [
  { id: "all", name: (t: TranslationSet) => t.allCategories },
  { id: "flyers", name: (t: TranslationSet) => t.flyers },
  { id: "business-cards", name: (t: TranslationSet) => t.businessCards },
  { id: "stickers", name: (t: TranslationSet) => t.stickers },
  { id: "car-wraps", name: (t: TranslationSet) => t.carWraps },
  { id: "decals", name: (t: TranslationSet) => t.decals },
  { id: "apparel", name: (t: TranslationSet) => t.apparel },
  { id: "promotional-items", name: (t: TranslationSet) => t.promotionalItems },
]

const mockProducts: Product[] = [
  { id: 1, name: "Premium Business Cards", price: 499, image: "/business-card.jpg", categoryId: "business-cards" },
  { id: 2, name: "A5 Flyers - Glossy", price: 799, image: "/paper.jpg", categoryId: "flyers" },
  { id: 3, name: "Vinyl Sticker Sheet", price: 249, image: "/vinyl.jpg", categoryId: "stickers" },
  { id: 4, name: "Full Car Wrap - Sedan", price: 25000, image: "/car-wrap.avif", categoryId: "car-wraps" },
  { id: 5, name: "Custom T-Shirt Print", price: 350, image: "/tshirt-custom.jpg", categoryId: "apparel" },
  { id: 6, name: "Promotional Mugs", price: 180, image: "/mugs.jpg", categoryId: "promotional-items" },
  { id: 7, name: "A3 Posters - Matte", price: 399, image: "/a3.jpg", categoryId: "flyers" },
  { id: 8, name: "Outdoor Vinyl Banner", price: 1200, image: "/vinyl.webp", categoryId: "promotional-items" },
  { id: 9, name: "Custom Hoodie Print", price: 550, image: "/custom-hoodie.webp", categoryId: "apparel" },
  { id: 10, name: "Laptop Decals", price: 150, image: "/laptop.webp", categoryId: "decals" },
  { id: 11, name: "Partial Car Wrap - Van", price: 10000, image: "/partial.jpg", categoryId: "car-wraps" },
]

const mockOrders: Order[] = [
  {
    id: "ORD-001",
    customer: "CUST-84371",
    date: "2025-06-01",
    total: 25000,
    status: "In Production",
    items: [{ name: "Full Car Wrap", quantity: 1 }],
  },
  {
    id: "ORD-002",
    customer: "CUST-12345",
    date: "2025-06-02",
    total: 799,
    status: "Printing",
    items: [{ name: "A5 Flyers", quantity: 500 }],
  },
  {
    id: "ORD-003",
    customer: "CUST-67890",
    date: "2025-06-03",
    total: 499,
    status: "Queued",
    items: [{ name: "Business Cards", quantity: 250 }],
  },
]

const mockDesigns: Design[] = [
  { id: 1, name: "My Awesome Car Design", type: "Car Wrap", preview: "/placeholder.svg?width=100&height=60" },
  { id: 2, name: "Company Business Card v2", type: "Business Cards", preview: "/placeholder.svg?width=100&height=60" },
  { id: 3, name: "Summer Fest Flyer", type: "Flyer", preview: "/placeholder.svg?width=100&height=60" },
]

const carDatabase: { [key: string]: Vehicle } = {
  // Use public/ path for Next.js static assets
  ABC123: { make: "Volvo", model: "XC90", svgPath: "/car-volvo-xc90-side.png" },
  // Add more vehicles here if you add more images
}

const fonts = ["Inter", "Arial", "Verdana", "Times New Roman", "Courier New", "Georgia", "Impact"]
const colors = ["#000000", "#ef4444", "#22c55e", "#3b82f6", "#eab308", "#a855f7", "#06b6d4", "#ec4899"]

// --- APP CONTEXT & PROVIDER ---
const AppContext = createContext<AppContextType | null>(null)
const useAppContext = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error("useAppContext must be used within an AppContext.Provider")
  }
  return context
}

export default function PrintShopPlatform() {
  const [page, setPage] = useState("home")
  const [user, setUser] = useState<User | null>(null)
  const [lang, setLang] = useState<"en" | "sv">("en")
  const [cart, setCart] = useState<CartItem[]>([])
  const [uploadedDesignForCar, setUploadedDesignForCar] = useState<string | null>(null)
  const [history, setHistory] = useState<string[]>(["home"])

  const t = useMemo(() => translations[lang], [lang])

  const navigate = (newPage: string) => {
    setHistory((prev) => [...prev, newPage])
    setPage(newPage)
  }

  const goBack = () => {
    if (history.length > 1) {
      const newHistory = [...history]
      newHistory.pop()
      setHistory(newHistory)
      setPage(newHistory[newHistory.length - 1])
    }
  }

  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id)
      if (existingItem) {
        return prevCart.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item))
      }
      return [...prevCart, { ...product, quantity: 1 }]
    })
    alert(`${product.name} added to cart!`)
  }

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      setCart((prevCart) => prevCart.filter((item) => item.id !== productId))
    } else {
      setCart((prevCart) => prevCart.map((item) => (item.id === productId ? { ...item, quantity } : item)))
    }
  }

  const logout = () => {
    setUser(null)
    setPage("home")
    setHistory(["home"])
    setCart([])
    setUploadedDesignForCar(null)
  }

  const contextValue: AppContextType = {
    page,
    setPage: navigate,
    goBack,
    user,
    setUser,
    lang,
    setLang,
    t,
    cart,
    setCart,
    addToCart,
    updateQuantity,
    logout,
    uploadedDesignForCar,
    setUploadedDesignForCar,
  }

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -20 },
  }

  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.4,
  }

  const renderPage = () => {
    switch (page) {
      case "home":
        return <HomePage />
      case "login":
        return <LoginPage />
      case "signup":
        return <SignupPage />
      case "dashboard":
        return <DashboardPage />
      case "products":
        return <ProductsPage />
      case "cart":
        return <CartPage />
      case "checkout":
        return <CheckoutPage />
      case "confirmation":
        return <OrderConfirmationPage />
      case "design-tool":
        return <DesignToolPage />
      case "car-mockup":
        return <CarMockupPage />
      default:
        return <HomePage />
    }
  }

  return (
    <AppContext.Provider value={contextValue}>
      <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
        <NavBar />
        <main className="container mx-auto px-4 py-8 sm:px-6 lg:px-8 overflow-x-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={page}
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              {renderPage()}
            </motion.div>
          </AnimatePresence>
        </main>
        <Footer />
      </div>
    </AppContext.Provider>
  )
}

// --- UI COMPONENTS ---

function NavBar() {
  const { user, setPage, logout, t, lang, setLang } = useAppContext()
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/90 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setPage("home")}>
          <Printer className="h-8 w-8 text-blue-600" />
          <h1 className="text-2xl font-bold text-slate-800">{t.platformName}</h1>
        </div>
        <nav className="hidden md:flex items-center gap-1">
          <Button variant="ghost" onClick={() => setPage("products")}>
            {t.products}
          </Button>
          <Button variant="ghost" onClick={() => setPage("design-tool")}>
            {t.designTool}
          </Button>
          <Button variant="ghost" onClick={() => setPage("car-mockup")}>
            {t.carWrapDesigner}
          </Button>
        </nav>
        <div className="flex items-center gap-2">
          <Select value={lang} onValueChange={(value) => setLang(value as "en" | "sv")}>
            <SelectTrigger className="w-[120px] text-sm">
              <Languages className="h-4 w-4 mr-2" />
              <SelectValue placeholder={t.language} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="sv">Svenska</SelectItem>
            </SelectContent>
          </Select>
          {user ? (
            <>
              <Button variant="ghost" onClick={() => setPage("dashboard")} className="hidden sm:inline-flex">
                <LayoutDashboard className="mr-2 h-4 w-4" /> {t.dashboard}
              </Button>
              <Button variant="outline" onClick={() => setPage("cart")}>
                <ShoppingCart className="mr-0 sm:mr-2 h-4 w-4" /> <span className="hidden sm:inline">{t.cart}</span>
              </Button>
              <Button onClick={logout} variant="secondary">
                <LogOut className="mr-0 sm:mr-2 h-4 w-4" /> <span className="hidden sm:inline">{t.logout}</span>
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" onClick={() => setPage("login")}>
                <LogInIcon className="mr-2 h-4 w-4 md:hidden" />
                <span className="hidden md:inline">{t.login}</span>
              </Button>
              <Button onClick={() => setPage("signup")} className="bg-blue-600 hover:bg-blue-700 text-white">
                <UserPlus className="mr-2 h-4 w-4" /> {t.signup}
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

function Footer() {
  const { t } = useAppContext()
  return (
    <footer className="border-t bg-slate-100">
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 text-center text-sm text-slate-500">
        <p>
          &copy; {new Date().getFullYear()} {t.platformName}. All rights reserved.
        </p>
        <p className="mt-1">Inspired by Vistaprint.se - Demo for Stakeholders</p>
      </div>
    </footer>
  )
}

function AnimatedText({
  text,
  el: Wrapper = "h1",
  className,
  stagger = 0.03,
  delay = 0,
}: {
  text: string
  el?: React.ElementType
  className?: string
  stagger?: number
  delay?: number
}) {
  const words = text.split(" ").map((word: string) => [...word, "\u00A0"]) // Add space after each word

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: stagger, delayChildren: i * delay },
    }),
  }

  const childVariants = {
    hidden: { opacity: 0, y: 20, transition: { type: "spring", damping: 12, stiffness: 200 } },
    visible: { opacity: 1, y: 0, transition: { type: "spring", damping: 12, stiffness: 200 } },
  }

  return (
    <Wrapper className={className}>
      <motion.span variants={containerVariants} initial="hidden" animate="visible" aria-label={text}>
        {words.map((word: string[], wordIndex: number) => (
          <span key={wordIndex} className="inline-block whitespace-nowrap">
            {word.map((char: string, charIndex: number) => (
              <motion.span key={charIndex} className="inline-block" variants={childVariants}>
                {char}
              </motion.span>
            ))}
          </span>
        ))}
      </motion.span>
    </Wrapper>
  )
}

function HomePage() {
  const { setPage, t } = useAppContext()

  const heroAnimationProps = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
  }

  const sectionAnimationProps = {
    initial: { opacity: 0, y: 50 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.2 },
    transition: { duration: 0.5, ease: "easeOut" },
  }

  const featured = [
    { name: t.businessCards, icon: "/biz-card.png", page: "products" },
    { name: t.apparel, icon: "/apparel.png", page: "products" },
    { name: t.carWraps, icon: "/carWraps.webp", page: "car-mockup" },
  ]

  const popularProductsData: Product[] = [
    mockProducts.find((p) => p.id === 1), // Business Cards
    mockProducts.find((p) => p.id === 4), // Car Wraps
    mockProducts.find((p) => p.id === 3), // Stickers
    mockProducts.find((p) => p.id === 2), // Flyers
  ].filter((p): p is Product => Boolean(p)) // Filter out undefined if IDs don't match

  const howItWorksSteps = [
    { title: t.step1Title, desc: t.step1Desc, icon: "/design-online.jpg" },
    { title: t.step2Title, desc: t.step2Desc, icon: "/place-order.png" },
    { title: t.step3Title, desc: t.step3Desc, icon: "/fast.png" },
  ]

  return (
    <div className="space-y-24 py-12">
      <div className="text-center flex flex-col items-center justify-center min-h-[calc(70vh-8rem)] animated-gradient rounded-3xl p-8 shadow-lg">
        <AnimatedText
          text={t.homepageTitle}
          el="h1"
          className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-4 text-white"
          stagger={0.02}
        />
        <motion.p
          {...heroAnimationProps}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto mb-8"
        >
          {t.homepageSubtitle}
        </motion.p>
        <motion.div
          {...heroAnimationProps}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Button
            size="lg"
            onClick={() => setPage("design-tool")}
            className="bg-white/90 hover:bg-white text-blue-600 shadow-lg"
          >
            <Palette className="mr-2 h-5 w-5" /> {t.startDesigning}
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => setPage("products")}
            className="shadow-lg bg-white/20 hover:bg-white/30 text-white border-white"
          >
            <Package className="mr-2 h-5 w-5" /> {t.viewProducts}
          </Button>
        </motion.div>
      </div>

      <motion.div {...sectionAnimationProps} className="space-y-12">
        <h2 className="text-3xl font-bold text-center">{t.featuredProducts}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {featured.map((item, index) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card
                className="text-center hover:shadow-xl transition-all duration-300 cursor-pointer h-full flex flex-col"
                onClick={() => setPage(item.page)}
              >
                <CardContent className="p-6 flex flex-col items-center justify-between gap-4 flex-grow">
                  <Image
                    src={item.icon || "/placeholder.svg?width=80&height=80&query=product+icon"}
                    alt={item.name}
                    width={80}
                    height={80}
                    className="mb-2"
                  />
                  <h3 className="text-xl font-semibold">{item.name}</h3>
                  <div className="flex items-center text-blue-600 mt-auto">
                    <span>Shop now</span>
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div {...sectionAnimationProps} className="space-y-12">
        <h2 className="text-3xl font-bold text-center">{t.popularProducts}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {popularProductsData.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="h-full"
            >
              <Card className="overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col bg-white h-full">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="h-full flex flex-col"
                >
                  <div className="relative w-full aspect-[4/3]">
                    <Image
                      src={product.image || "/placeholder.svg?width=300&height=225&query=popular+product"}
                      alt={product.name}
                      layout="fill"
                      objectFit="cover"
                      className="rounded-t-lg"
                    />
                  </div>
                  <CardContent className="p-4 flex-grow flex flex-col">
                    <h3 className="font-semibold text-md text-slate-800">{product.name}</h3>
                  </CardContent>
                  <CardFooter className="p-4 border-t mt-auto">
                    <Button
                      className="w-full bg-blue-500 hover:bg-blue-600 text-white text-sm"
                      onClick={() => setPage("design-tool") /* or product specific page */}
                    >
                      <Palette className="mr-2 h-4 w-4" /> {t.customize}
                    </Button>
                  </CardFooter>
                </motion.div>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div {...sectionAnimationProps} className="space-y-12">
        <h2 className="text-3xl font-bold text-center">{t.howItWorks}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {howItWorksSteps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="text-center border-none shadow-none bg-transparent">
                <CardContent className="p-6 flex flex-col items-center gap-4">
                  <div className="bg-blue-100 rounded-full p-4 mb-2">
                    <Image
                      src={step.icon || "/placeholder.svg?width=64&height=64&query=step+icon"}
                      alt=""
                      width={64}
                      height={64}
                    />
                  </div>
                  <h3 className="text-xl font-semibold">{step.title}</h3>
                  <p className="text-slate-600 text-sm">{step.desc}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

function AuthFormCard({
  title,
  children,
  footerContent,
}: {
  title: string
  children: React.ReactNode
  footerContent?: React.ReactNode
}) {
  return (
    <div className="flex justify-center items-center py-12">
      <Card className="w-full max-w-md shadow-xl bg-white">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">{title}</CardTitle>
        </CardHeader>
        <CardContent>{children}</CardContent>
        {footerContent && <CardFooter className="text-center text-sm justify-center">{footerContent}</CardFooter>}
      </Card>
    </div>
  )
}

function LoginPage() {
  const { setUser, setPage, t } = useAppContext()
  const [email, setEmail] = useState("client@example.com")
  const [password, setPassword] = useState("password")
  const [error, setError] = useState("")

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    const foundUser = mockUsers.find((u) => u.email === email && u.password === password)
    if (foundUser) {
      setUser(foundUser)
      setPage("dashboard")
    } else {
      setError("Invalid email or password. Try client@example.com / password")
    }
  }

  return (
    <AuthFormCard
      title={t.login}
      footerContent={
        <p>
          {t.dontHaveAccount}{" "}
          <Button variant="link" className="p-0 text-blue-600 hover:text-blue-700" onClick={() => setPage("signup")}>
            {t.signup}
          </Button>
        </p>
      }
    >
      <form onSubmit={handleLogin} className="space-y-6">
        <div className="space-y-1">
          <Label htmlFor="email">{t.email}</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="you@example.com"
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="password">{t.password}</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="••••••••"
          />
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
          {t.login}
        </Button>
      </form>
    </AuthFormCard>
  )
}

function SignupPage() {
  const { setUser, setPage, t } = useAppContext()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }
    if (mockUsers.find((u) => u.email === email)) {
      setError("User with this email already exists")
      return
    }
    const customerNumber = `CUST-${Math.floor(10000 + Math.random() * 90000)}`
    const newUser: User = { id: mockUsers.length + 1, email, password, role: "client", customerNumber }
    mockUsers.push(newUser)
    setUser(newUser)
    setPage("dashboard")
  }

  return (
    <AuthFormCard
      title={t.signup}
      footerContent={
        <p>
          {t.alreadyHaveAccount}{" "}
          <Button variant="link" className="p-0 text-blue-600 hover:text-blue-700" onClick={() => setPage("login")}>
            {t.login}
          </Button>
        </p>
      }
    >
      <form onSubmit={handleSignup} className="space-y-6">
        <div className="space-y-1">
          <Label htmlFor="email-signup">{t.email}</Label>
          <Input
            id="email-signup"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="you@example.com"
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="password-signup">{t.password}</Label>
          <Input
            id="password-signup"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="••••••••"
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="confirm-password-signup">{t.confirmPassword}</Label>
          <Input
            id="confirm-password-signup"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            placeholder="••••••••"
          />
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
          {t.signup}
        </Button>
      </form>
    </AuthFormCard>
  )
}

function DashboardPage() {
  const { user, t } = useAppContext()
  const renderDashboardContent = () => {
    switch (user?.role) {
      case "client":
        return <ClientDashboard />
      case "admin":
        return <AdminDashboard />
      case "operations":
        return <OperationsDashboard />
      default:
        return <p>No dashboard available for your role.</p>
    }
  }
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">{t.dashboard}</h1>
          <p className="text-slate-600">Welcome back, {user?.email}!</p>
        </div>
        <Card className="p-3 text-sm bg-white shadow">
          <p className="font-semibold text-slate-700">{t.customerNumber}:</p>
          <p className="text-slate-500">{user?.customerNumber}</p>
        </Card>
      </div>
      {renderDashboardContent()}
    </div>
  )
}

function ClientDashboard() {
  const { t } = useAppContext()
  return (
    <Tabs defaultValue="orders" className="w-full">
      <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 bg-slate-100">
        <TabsTrigger value="orders">
          <FileText className="mr-2 h-4 w-4" />
          {t.orderHistory}
        </TabsTrigger>
        <TabsTrigger value="designs">
          <Palette className="mr-2 h-4 w-4" />
          {t.savedDesigns}
        </TabsTrigger>
        <TabsTrigger value="billing">
          <MapPin className="mr-2 h-4 w-4" />
          {t.billingShippingInfo}
        </TabsTrigger>
      </TabsList>
      <TabsContent value="orders" className="mt-6">
        <Card className="shadow-lg bg-white">
          <CardHeader>
            <CardTitle>{t.orderHistory}</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t.orderId}</TableHead>
                  <TableHead>{t.date}</TableHead>
                  <TableHead>{t.status}</TableHead>
                  <TableHead className="text-right">{t.total}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockOrders
                  .filter((o) => o.customer === "CUST-84371") // Assuming current user for demo
                  .map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>{order.date}</TableCell>
                      <TableCell>
                        <Badge variant={order.status === "Completed" ? "default" : "secondary"}>{order.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right">{order.total} SEK</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="designs" className="mt-6">
        <Card className="shadow-lg bg-white">
          <CardHeader>
            <CardTitle>{t.savedDesigns}</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {mockDesigns.map((design) => (
              <Card key={design.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <Image
                  src={design.preview || "/placeholder.svg?width=300&height=180&query=design+preview"}
                  alt={design.name}
                  width={300}
                  height={180}
                  className="w-full h-32 object-cover"
                />
                <CardContent className="p-4">
                  <p className="font-semibold">{design.name}</p>
                  <p className="text-sm text-slate-500">{design.type}</p>
                  <Button variant="outline" size="sm" className="mt-2 w-full">
                    {t.edit}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="billing" className="mt-6">
        <Card className="shadow-lg bg-white">
          <CardHeader>
            <CardTitle>{t.billingShippingInfo}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="fullName">{t.fullName}</Label>
                <Input id="fullName" defaultValue="Test Testsson" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="phone">{t.phone}</Label>
                <Input id="phone" defaultValue="+46 70 123 45 67" />
              </div>
            </div>
            <div className="space-y-1">
              <Label htmlFor="address-client">{t.address}</Label>
              <Input id="address-client" defaultValue="Storgatan 1" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <Label htmlFor="city-client">{t.city}</Label>
                <Input id="city-client" defaultValue="Stockholm" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="postalCode-client">{t.postalCode}</Label>
                <Input id="postalCode-client" defaultValue="111 22" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="country-client">{t.country}</Label>
                <Input id="country-client" defaultValue="Sweden" />
              </div>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">{t.saveInfo}</Button>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}

function AdminDashboard() {
  const { t } = useAppContext()
  return (
    <Tabs defaultValue="users" className="w-full">
      <TabsList className="grid w-full grid-cols-2 bg-slate-100">
        <TabsTrigger value="users">
          <Users className="mr-2 h-4 w-4" />
          {t.manageUsers}
        </TabsTrigger>
        <TabsTrigger value="products">
          <Package className="mr-2 h-4 w-4" />
          {t.manageProductsPrices}
        </TabsTrigger>
      </TabsList>
      <TabsContent value="users" className="mt-6">
        <Card className="shadow-lg bg-white">
          <CardHeader>
            <CardTitle>{t.manageUsers}</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>{t.email}</TableHead>
                  <TableHead>{t.userRole}</TableHead>
                  <TableHead>{t.actions}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.customerNumber}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge variant={user.role === "admin" ? "destructive" : "outline"}>{user.role}</Badge>
                    </TableCell>
                    <TableCell className="space-x-2">
                      <Button variant="outline" size="sm">
                        <Edit3 className="mr-1 h-3 w-3" />
                        {t.edit}
                      </Button>
                      <Button variant="destructive" size="sm">
                        <Trash2 className="mr-1 h-3 w-3" />
                        {t.delete}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="products" className="mt-6">
        <Card className="shadow-lg bg-white">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>{t.manageProductsPrices}</CardTitle>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="mr-2 h-4 w-4" />
              {t.addNewProduct}
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>{t.productName}</TableHead>
                  <TableHead>{t.category}</TableHead>
                  <TableHead>{t.price}</TableHead>
                  <TableHead>{t.actions}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockProducts.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell>{p.id}</TableCell>
                    <TableCell>{p.name}</TableCell>
                    <TableCell>
                      {productCategories.find((c) => c.id === p.categoryId)?.name(t) || p.categoryId}
                    </TableCell>
                    <TableCell>{p.price} SEK</TableCell>
                    <TableCell className="space-x-2">
                      <Button variant="outline" size="sm">
                        <Edit3 className="mr-1 h-3 w-3" />
                        {t.edit}
                      </Button>
                      <Button variant="destructive" size="sm">
                        <Trash2 className="mr-1 h-3 w-3" />
                        {t.delete}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}

function OperationsDashboard() {
  const { t } = useAppContext()
  return (
    <Card className="shadow-lg bg-white">
      <CardHeader>
        <CardTitle>{t.activeOrdersQueue}</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t.orderId}</TableHead>
              <TableHead>{t.customer}</TableHead>
              <TableHead>{t.date}</TableHead>
              <TableHead>{t.status}</TableHead>
              <TableHead>{t.updateStatus}</TableHead>
              <TableHead>{t.exportPrintFile}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.id}</TableCell>
                <TableCell>{order.customer}</TableCell>
                <TableCell>{order.date}</TableCell>
                <TableCell>
                  <Badge>{order.status}</Badge>
                </TableCell>
                <TableCell>
                  <Select defaultValue={order.status}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder={t.updateStatus} />
                    </SelectTrigger>
                    <SelectContent>
                      {["Queued", "Printing", "In Production", "Shipped", "Completed"].map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Button variant="outline" size="sm" onClick={() => alert(`Simulating export for order ${order.id}`)}>
                    <FileArchive className="mr-2 h-4 w-4" />
                    {t.exportPrintFile}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

function ProductsPage() {
  const { addToCart, t } = useAppContext()
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const filteredProducts = mockProducts.filter(
    (p) =>
      (selectedCategory === "all" || p.categoryId === selectedCategory) &&
      p.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900">{t.products}</h1>
        <p className="mt-2 text-lg text-slate-600">Browse our extensive catalog of customizable products.</p>
      </div>
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="w-full md:w-1/3 relative">
          <Input
            type="search"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-10 pl-10 bg-white"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        </div>
        <div className="w-full md:w-2/3">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="h-10 bg-white">
              <SelectValue placeholder={t.productCategories} />
            </SelectTrigger>
            <SelectContent>
              {productCategories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name(t)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <Card
              key={product.id}
              className="overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col bg-white h-full"
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                className="h-full flex flex-col"
              >
                <div className="relative w-full aspect-[4/3]">
                  <Image
                    src={product.image || "/placeholder.svg?width=300&height=225&query=product"}
                    alt={product.name}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-t-lg"
                  />
                </div>
                <CardContent className="p-4 flex-grow flex flex-col">
                  <h3 className="font-semibold text-lg text-slate-800">{product.name}</h3>
                  <p className="text-blue-600 font-medium mt-1">{product.price} SEK</p>
                  <p className="text-xs text-slate-500 mt-1">
                    {productCategories.find((c) => c.id === product.categoryId)?.name(t)}
                  </p>
                </CardContent>
                <CardFooter className="p-4 border-t mt-auto">
                  <Button
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={() => addToCart(product)}
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" /> {t.addToCart}
                  </Button>
                </CardFooter>
              </motion.div>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-center text-slate-500 py-10">No products found matching your criteria.</p>
      )}
    </div>
  )
}

function CartPage() {
  const { cart, updateQuantity, setPage, t } = useAppContext()
  const subtotal = cart.reduce((total: number, item: CartItem) => total + item.price * item.quantity, 0)
  const vatAmount = subtotal * 0.25
  const cartTotal = subtotal + vatAmount

  if (cart.length === 0) {
    return (
      <div className="text-center py-12">
        <ShoppingCart className="mx-auto h-16 w-16 text-slate-400 mb-4" />
        <h1 className="text-3xl font-bold mb-4">{t.cart}</h1>
        <p className="text-slate-600 mb-6">Your cart is currently empty.</p>
        <Button onClick={() => setPage("products")} className="bg-blue-600 hover:bg-blue-700 text-white">
          Browse Products
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-center">{t.cart}</h1>
      <Card className="shadow-xl bg-white">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-2/5 min-w-[200px]">{t.products}</TableHead>
                  <TableHead className="min-w-[80px]">{t.price}</TableHead>
                  <TableHead className="text-center w-1/5 min-w-[150px]">{t.quantity}</TableHead>
                  <TableHead className="text-right min-w-[100px]">{t.total}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cart.map((item: CartItem) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium flex items-center gap-3">
                      <Image
                        src={item.image || "/placeholder.svg?width=60&height=45&query=cart+item"}
                        alt={item.name}
                        width={60}
                        height={45}
                        className="rounded-md object-cover"
                      />
                      {item.name}
                    </TableCell>
                    <TableCell>{item.price} SEK</TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-1 sm:gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 sm:h-9 sm:w-9"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <Input
                          type="number"
                          value={item.quantity}
                          readOnly
                          className="w-12 h-8 sm:h-9 text-center bg-white"
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 sm:h-9 sm:w-9"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 sm:h-9 sm:w-9 text-red-500 hover:text-red-600"
                          onClick={() => updateQuantity(item.id, 0)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-medium">{item.price * item.quantity} SEK</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-end gap-4 p-6 bg-slate-50">
          <div className="w-full sm:w-1/2 md:w-1/3 space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>{subtotal.toFixed(2)} SEK</span>
            </div>
            <div className="flex justify-between">
              <span>{t.vat}:</span>
              <span>{vatAmount.toFixed(2)} SEK</span>
            </div>
            <Separator />
            <div className="flex justify-between font-bold text-lg">
              <span>{t.total}:</span>
              <span>{cartTotal.toFixed(2)} SEK</span>
            </div>
          </div>
          <Button
            size="lg"
            onClick={() => setPage("checkout")}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white"
          >
            {t.checkout} <Truck className="ml-2 h-5 w-5" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

function CheckoutPage() {
  const { cart, setPage, t, setCart } = useAppContext()
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [shippingOption, setShippingOption] = useState("standard")
  const [isProcessing, setIsProcessing] = useState(false)

  const subtotal = cart.reduce((total: number, item: CartItem) => total + item.price * item.quantity, 0)
  const vatAmount = subtotal * 0.25
  const shippingCost = shippingOption === "express" ? 149 : 79
  const grandTotal = subtotal + vatAmount + shippingCost

  const handlePayment = () => {
    setIsProcessing(true)
    setTimeout(() => {
      setCart([])
      setPage("confirmation")
      setIsProcessing(false)
    }, 2000)
  }

  useEffect(() => {
    if (cart.length === 0 && !isProcessing) {
      setPage("products")
    }
  }, [cart, isProcessing, setPage])

  if (cart.length === 0 && !isProcessing) return null // Added !isProcessing to prevent redirect during payment simulation

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-center">{t.checkout}</h1>
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-lg bg-white">
            <CardHeader>
              <CardTitle>{t.billingShippingInfo}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="checkout-name">{t.fullName}</Label>
                  <Input id="checkout-name" defaultValue="Test Testsson" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="checkout-email">{t.email}</Label>
                  <Input id="checkout-email" type="email" defaultValue="client@example.com" />
                </div>
              </div>
              <div className="space-y-1">
                <Label htmlFor="checkout-address">{t.address}</Label>
                <Input id="checkout-address" defaultValue="Storgatan 1" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="checkout-city">{t.city}</Label>
                  <Input id="checkout-city" defaultValue="Stockholm" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="checkout-postal">{t.postalCode}</Label>
                  <Input id="checkout-postal" defaultValue="111 22" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="checkout-country">{t.country}</Label>
                  <Input id="checkout-country" defaultValue="Sweden" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-lg bg-white">
            <CardHeader>
              <CardTitle>{t.shippingOptions}</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup value={shippingOption} onValueChange={setShippingOption} className="space-y-2">
                <Label
                  htmlFor="std-shipping"
                  className="flex items-center gap-2 p-3 border rounded-md has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50 cursor-pointer"
                >
                  <RadioGroupItem value="standard" id="std-shipping" /> {t.standardShipping} (79 SEK)
                </Label>
                <Label
                  htmlFor="exp-shipping"
                  className="flex items-center gap-2 p-3 border rounded-md has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50 cursor-pointer"
                >
                  <RadioGroupItem value="express" id="exp-shipping" /> {t.expressShipping} (149 SEK)
                </Label>
              </RadioGroup>
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-1 space-y-6">
          <Card className="shadow-lg bg-white">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              {cart.map((item: CartItem) => (
                <div key={item.id} className="flex justify-between">
                  <span>
                    {item.name} x {item.quantity}
                  </span>
                  <span>{(item.price * item.quantity).toFixed(2)} SEK</span>
                </div>
              ))}
              <Separator />
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>{subtotal.toFixed(2)} SEK</span>
              </div>
              <div className="flex justify-between">
                <span>{t.vat}:</span>
                <span>{vatAmount.toFixed(2)} SEK</span>
              </div>
              <div className="flex justify-between">
                <span>{t.shipping}:</span>
                <span>{shippingCost.toFixed(2)} SEK</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>{t.total}:</span>
                <span>{grandTotal.toFixed(2)} SEK</span>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-lg bg-white">
            <CardHeader>
              <CardTitle>{t.paymentMethod}</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={paymentMethod} onValueChange={setPaymentMethod} className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-slate-100">
                  <TabsTrigger value="card">
                    <CreditCard className="h-4 w-4 mr-1 sm:mr-2" />
                    Card
                  </TabsTrigger>
                  <TabsTrigger value="swish">
                    <span className="font-bold text-purple-600 mr-1 sm:mr-2">S</span>Swish
                  </TabsTrigger>
                  <TabsTrigger value="klarna">
                    <span className="font-bold text-pink-500 mr-1 sm:mr-2">K.</span>Klarna
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="card" className="mt-4 text-sm">
                  <p>Mock card payment form here...</p>
                </TabsContent>
                <TabsContent value="swish" className="mt-4 text-sm">
                  <p>Mock Swish instructions here...</p>
                </TabsContent>
                <TabsContent value="klarna" className="mt-4 text-sm">
                  <p>Mock Klarna options here...</p>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter>
              <Button
                size="lg"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                onClick={handlePayment}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    {t.processingPayment}
                  </>
                ) : (
                  <>
                    <ShieldCheck className="mr-2 h-5 w-5" /> {t.payNow} ({grandTotal.toFixed(2)} SEK)
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}

function OrderConfirmationPage() {
  const { setPage, t } = useAppContext()
  return (
    <div className="text-center py-12 md:py-20">
      <Card className="max-w-lg mx-auto shadow-xl bg-white">
        <CardHeader className="items-center">
          <div className="p-3 rounded-full bg-green-100 mb-4">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <CardTitle className="text-3xl font-bold">{t.orderConfirmation}</CardTitle>
          <CardDescription className="text-lg">{t.thankYouForOrder}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-slate-600">{t.orderSummaryEmail}</p>
          <div className="flex items-center justify-center gap-2 p-3 bg-slate-100 rounded-md text-sm">
            <FileText className="h-5 w-5 text-blue-600" />
            <span>PDF_Proof_Order_12345.pdf (Simulated)</span>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" onClick={() => setPage("home")}>
            {t.backToHome}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

function DesignToolPage() {
  const { t } = useAppContext()
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [textValue, setTextValue] = useState("Your Text Here")
  const [selectedFont, setSelectedFont] = useState(fonts[0])
  const [selectedColor, setSelectedColor] = useState(colors[0])
  const [fontSize, setFontSize] = useState(32)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setUploadedImage(URL.createObjectURL(file))
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">{t.designTool}</h1>
      <div className="grid lg:grid-cols-[320px_1fr] gap-6">
        <Card className="shadow-lg bg-white">
          <CardHeader>
            <CardTitle>Controls</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="mr-2 h-4 w-4" /> {t.uploadImage}
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/jpeg,image/png,image/svg+xml"
              className="hidden"
            />
            <Button
              variant="outline"
              className="w-full"
              onClick={() => alert("Simulating PDF/AI import onto template.")}
            >
              <FileArchive className="mr-2 h-4 w-4" /> {t.importDesign}
            </Button>
            <Separator />
            <div>
              <h3 className="font-semibold mb-2">{t.textProperties}</h3>
              <Textarea
                value={textValue}
                onChange={(e) => setTextValue(e.target.value)}
                placeholder="Enter text"
                className="mb-2 bg-white"
              />
              <div className="grid grid-cols-2 gap-2">
                <Select value={selectedFont} onValueChange={setSelectedFont}>
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder={t.font} />
                  </SelectTrigger>
                  <SelectContent>
                    {fonts.map((f) => (
                      <SelectItem key={f} value={f} style={{ fontFamily: f }}>
                        {f}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  type="number"
                  value={fontSize}
                  onChange={(e) => setFontSize(Number.parseInt(e.target.value))}
                  placeholder={t.size}
                  className="w-full bg-white"
                />
              </div>
              <div className="flex gap-1 mt-2 flex-wrap">
                {colors.map((c) => (
                  <Button
                    key={c}
                    size="icon"
                    style={{ backgroundColor: c }}
                    className={`h-6 w-6 rounded-full border-2 ${selectedColor === c ? "border-blue-500 ring-2 ring-blue-500 ring-offset-1" : "border-white"}`}
                    onClick={() => setSelectedColor(c)}
                  />
                ))}
              </div>
            </div>
            <Separator />
            <div>
              <h3 className="font-semibold mb-2">{t.imageProperties}</h3>
              <p className="text-sm text-slate-500 mb-2">{t.dragResizeRotate} (Controls simulated)</p>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" title="Drag">
                  <Move className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" title="Resize">
                  <Maximize className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" title="Rotate">
                  <RotateCw className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <Separator />
            <div className="space-y-2">
              <h3 className="font-semibold">{t.previewExport}</h3>
              <Button variant="outline" className="w-full" onClick={() => alert("Simulating PNG download.")}>
                <Download className="mr-2 h-4 w-4" /> {t.downloadPNG}
              </Button>
              <Button variant="outline" className="w-full" onClick={() => alert("Simulating PDF download.")}>
                <Download className="mr-2 h-4 w-4" /> {t.downloadPDF}
              </Button>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-lg flex items-center justify-center bg-slate-200 aspect-[1.5] p-4 relative overflow-hidden">
          {/* Example template: Business Card */}
          <div className="absolute w-[350px] h-[200px] bg-white shadow-md rounded-lg flex items-center justify-center">
            <div className="absolute inset-0 border-2 border-dashed border-slate-300 m-2 rounded-md"></div>
            {uploadedImage && (
              <Image
                src={uploadedImage || "/placeholder.svg?width=300&height=150&query=design+element"}
                alt="Uploaded design"
                layout="fill"
                objectFit="contain"
                className="p-4"
              />
            )}
            <div
              className="absolute select-none pointer-events-none p-2 text-center"
              style={{
                fontFamily: selectedFont,
                color: selectedColor,
                fontSize: `${fontSize}px`,
                // Adjust positioning based on template, for now center
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                maxWidth: "90%", // Prevent text overflow
                maxHeight: "90%",
                overflow: "hidden",
              }}
            >
              {textValue}
            </div>
            {!uploadedImage && !textValue && <p className="text-slate-400">{t.canvasArea}</p>}
          </div>
        </Card>
      </div>
    </div>
  )
}

function CarMockupPage() {
  const { t, setUploadedDesignForCar } = useAppContext()
  const [plate, setPlate] = useState("")
  // Initialize vehicle state with Volvo by default
  const [vehicle, setVehicle] = useState<VehicleState>(carDatabase["ABC123"])
  const [selectedDesignUrl, setSelectedDesignUrl] = useState<string | null>(null)
  const carDesignUploadRef = useRef<HTMLInputElement>(null)

  const handleFindVehicle = () => {
    const formattedPlate = plate.toUpperCase().replace(/\s/g, "")
    console.log("Looking up plate:", formattedPlate)
    const found = carDatabase[formattedPlate]
    console.log("Found vehicle:", found)
    setVehicle(found || { error: "Vehicle not found. Try ABC123, DEF456, or GHI789." })
  }

  const handleCarDesignUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const designUrl = URL.createObjectURL(file)
      setSelectedDesignUrl(designUrl)
      setUploadedDesignForCar(designUrl) // Update context if needed elsewhere
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">{t.carWrapDesigner}</h1>
      <div className="grid lg:grid-cols-[320px_1fr] gap-6">
        <Card className="shadow-lg bg-white">
          <CardHeader>
            <CardTitle>Vehicle & Design</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="license-plate">{t.enterLicensePlate}</Label>
              <div className="flex gap-2">
                <Input
                  id="license-plate"
                  placeholder="ABC123"
                  value={plate}
                  onChange={(e) => setPlate(e.target.value)}
                  className="bg-white"
                />
                <Button onClick={handleFindVehicle} className="bg-blue-600 hover:bg-blue-700 text-white">
                  {t.findVehicle}
                </Button>
              </div>
              {"error" in vehicle ? (
                <p className="text-sm text-red-500">{vehicle.error}</p>
              ) : (
                <p className="text-sm text-green-600">
                  Found: {vehicle.make} {vehicle.model}
                </p>
              )}
            </div>
            <Separator />
            <div className="space-y-1">
              <Label>{t.applyDesignToWrap}</Label>
              <Button className="w-full" variant="outline" onClick={() => carDesignUploadRef.current?.click()}>
                <Upload className="mr-2 h-4 w-4" /> {t.uploadImage}
              </Button>
              <input
                type="file"
                ref={carDesignUploadRef}
                onChange={handleCarDesignUpload}
                accept="image/jpeg,image/png,image/svg+xml"
                className="hidden"
              />
              {selectedDesignUrl && (
                <div className="mt-2">
                  <Image
                    src={selectedDesignUrl || "/placeholder.svg?width=80&height=50&query=design+thumbnail"}
                    alt="Uploaded design preview"
                    width={80}
                    height={50}
                    className="rounded border object-cover"
                  />
                  <p className="text-xs text-green-600 mt-1">Image selected for mockup.</p>
                </div>
              )}
            </div>
            <Separator />
            <Button className="w-full" onClick={() => alert("Simulating download of car wrap mockup.")}>
              <Download className="mr-2 h-4 w-4" /> {t.previewExport}
            </Button>
          </CardContent>
        </Card>
        <Card className="shadow-lg flex items-center justify-center bg-slate-200 aspect-video p-4 relative overflow-hidden">
          <div className="relative w-full h-full min-h-[300px]">
            <Image
              src="/car-volvo-xc90-side.png"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-contain"
              alt="Volvo XC90 outline"
              priority
              onError={(e) => {
                console.error("Error loading image:", e)
              }}
            />
            {selectedDesignUrl && (
              <Image
                src={selectedDesignUrl}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-contain opacity-60 mix-blend-multiply p-8 md:p-12 lg:p-16"
                alt="Applied Design"
              />
            )}
            <div className="absolute inset-2 md:inset-3 border-2 border-dashed border-red-500 pointer-events-none">
              <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-red-500 text-white px-1.5 py-0.5 text-xs rounded-sm shadow">
                {t.bleedGuidelines}
              </span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
