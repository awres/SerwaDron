"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, useInView, AnimatePresence, Variants } from "framer-motion";
import {
  ArrowRight,
  Camera,
  Video,
  Building2,
  Calendar,
  Instagram,
  Mail,
  Phone,
  Play,
  Check,
  Sparkles,
  X,
  Maximize2,
} from "lucide-react";
import Image from "next/image";

// Optimized animation variants - reduced motion for better performance
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

const fadeInRight: Variants = {
  hidden: { opacity: 0, x: 20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.02,
    },
  },
};

const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.97 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

// Video Modal Component
function VideoModal({
  isOpen,
  onClose,
  src,
}: {
  isOpen: boolean;
  onClose: () => void;
  src: string;
}) {
  // 1. Definiujemy referencję dla elementu wideo
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleEscape);
    }
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  // 2. Hook ustawiający głośność po otwarciu i załadowaniu wideo
  useEffect(() => {
    if (isOpen && videoRef.current) {
      // 0.15 = 15% głośności. Zmień na np. 0.1, jeśli wciąż ma być ciszej
      videoRef.current.volume = 0.02;
    }
  }, [isOpen, src]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 modal-backdrop bg-black/80"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-5xl aspect-video rounded-2xl overflow-hidden bg-black shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-colors"
              aria-label="Zamknij"
            >
              <X className="w-5 h-5" />
            </button>
            <video
              ref={videoRef} // 3. Podpięcie referencji pod element video
              src={src}
              autoPlay
              loop
              controls
              playsInline
              className="w-full h-full object-contain"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // ... useEffect dla scrolla zostaje ...

  const navItems = [
    { label: "Usługi", id: "uslugi" },
    { label: "Portfolio", id: "portfolio" },
    { label: "Sprzęt", id: "sprzet" },
    { label: "Kontakt", id: "kontakt" },
  ];

  const handleNavClick = (e: React.MouseEvent, targetId: string | null) => {
    e.preventDefault();

    if (targetId) {
      const targetSection = document.getElementById(targetId);
      if (targetSection) {
        targetSection.scrollIntoView({ behavior: "smooth" });
      }
      window.history.replaceState(null, "", `#${targetId}`);
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
      window.history.pushState(null, "", window.location.pathname);
    }
    setIsMenuOpen(false);
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 left-0 right-0 z-50 px-4 md:px-6 py-4"
    >
      <div className="max-w-6xl mx-auto">
        <div
          className={`flex items-center justify-between px-6 py-3 rounded-2xl transition-all duration-500 ${
            scrolled
              ? "bg-card/80 backdrop-blur-xl border border-border shadow-2xl"
              : "bg-transparent"
          }`}
        >
          <a
            href="/"
            onClick={(e) => handleNavClick(e, null)}
            className="text-xl font-bold tracking-tight cursor-pointer text-foreground select-none"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            SerwaDron<span className="text-primary">.</span>
          </a>

          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item, i) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => handleNavClick(e, item.id)}
                className={`text-sm font-medium ${
                  i === 3
                    ? "bg-primary text-primary-foreground px-5 py-2.5 rounded-xl hover:bg-primary/90 transition-all duration-300"
                    : "text-foreground/70 hover:text-foreground transition-colors duration-300"
                } cursor-pointer`}
              >
                {item.label}
              </a>
            ))}
          </div>

          <button
            className="md:hidden text-sm font-medium px-4 py-2 rounded-xl bg-secondary text-foreground"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? "Zamknij" : "Menu"}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="md:hidden mt-2 mx-4 p-4 rounded-2xl bg-card/95 backdrop-blur-xl border border-border"
          >
            <div className="flex flex-col gap-1">
              {navItems.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => handleNavClick(e, item.id)}
                  className="text-base py-3 px-4 rounded-xl hover:bg-secondary text-foreground transition-colors cursor-pointer"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

function HeroSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section
      ref={ref}
      // USUNIĘTO: overflow-hidden
      className="h-screen min-h-[100dvh] w-full relative flex flex-col justify-center gpu-accelerated overflow-clip"
    >
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src="/images/bg-hero.jpg"
          alt=""
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-background/70" />
      </div>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 80% 50% at 50% -20%, oklch(0.45 0.18 250 / 0.3), transparent),
            radial-gradient(ellipse 60% 40% at 80% 60%, oklch(0.50 0.12 280 / 0.1), transparent)
          `,
        }}
      />

      <div className="relative z-10 w-full">
        <div className="max-w-6xl mx-auto px-4 md:px-6 flex flex-col items-center gap-6">
          <motion.div
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={fadeInUp}
          >
            <span className="inline-flex items-center gap-2 text-xs tracking-widest text-foreground/80 uppercase bg-secondary/50 backdrop-blur-sm border border-border px-4 py-2 rounded-full">
              <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
              DJI Mini 3 Pro
            </span>
          </motion.div>

          <motion.h1
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={fadeInUp}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-center leading-[1.1]"
          >
            <span className="block text-foreground font-sans">Sztuka</span>
            <span
              className="block bg-gradient-to-r from-primary via-blue-400 to-cyan-400 bg-clip-text text-transparent"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              z lotu ptaka
            </span>
          </motion.h1>

          <motion.p
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={fadeInUp}
            className="text-sm md:text-base text-foreground/60 max-w-md text-center leading-relaxed"
          >
            Profesjonalne ujęcia lotnicze dla nieruchomości, eventów i projektów
            kreatywnych.
          </motion.p>

          <motion.div
            className="relative w-full max-w-sm md:max-w-md my-2"
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={scaleIn}
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-32 bg-primary/25 blur-[80px] rounded-full pointer-events-none" />

            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="relative z-10"
            >
              <Image
                src="/images/drone.png"
                alt="DJI Mini 3 Pro"
                width={500}
                height={312}
                className="mx-auto drop-shadow-[0_30px_60px_rgba(59,130,246,0.3)] w-full h-auto"
                priority
              />
            </motion.div>
          </motion.div>

          <motion.div
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={fadeInUp}
            className="flex flex-col sm:flex-row gap-3"
          >
            <a
              href="#portfolio"
              onClick={(e) => {
                e.preventDefault();
                document
                  .getElementById("portfolio")
                  ?.scrollIntoView({ behavior: "smooth", block: "start" });
                window.history.replaceState(null, "", "#portfolio");
              }}
              className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-semibold hover:bg-primary/90 transition-all duration-200 text-sm shadow-lg shadow-primary/20"
            >
              <Play className="w-4 h-4" />
              Zobacz portfolio
            </a>
            <a
              href="#kontakt"
              onClick={(e) => {
                e.preventDefault();
                document
                  .getElementById("kontakt")
                  ?.scrollIntoView({ behavior: "smooth", block: "start" });
                window.history.replaceState(null, "", "#kontakt");
              }}
              className="inline-flex items-center justify-center gap-2 bg-secondary border border-border px-6 py-3 rounded-xl font-semibold hover:bg-accent transition-all duration-200 text-sm"
            >
              Zamów wycenę
              <ArrowRight className="w-4 h-4" />
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function ServicesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const services = [
    {
      icon: Camera,
      title: "Fotografia",
      description: "Profesjonalne zdjęcia z perspektywy ptaka w 48MP i RAW.",
      gradient: "from-blue-500/20 to-cyan-500/20",
    },
    {
      icon: Video,
      title: "Filmowanie",
      description: "Kinowe ujęcia wideo 4K/60fps z color gradingiem.",
      gradient: "from-purple-500/20 to-pink-500/20",
    },
    {
      icon: Building2,
      title: "Nieruchomości",
      description: "Kompleksowa obsługa agencji i deweloperów.",
      gradient: "from-emerald-500/20 to-teal-500/20",
    },
    {
      icon: Calendar,
      title: "Eventy",
      description: "Wesela, festiwale, imprezy firmowe z powietrza.",
      gradient: "from-orange-500/20 to-amber-500/20",
    },
  ];

  const stats = [
    { value: "Mnóstwo", label: "Projektów" },
    { value: "Wiele", label: "Klientów" },
    { value: "4K", label: "Jakość" },
    { value: "24h", label: "Odpowiedź" },
  ];

  return (
    <section
      id="uslugi"
      ref={ref}
      // DODANO: scroll-mt-24 (margines na navbar), ZMIENIONO overflow
      className="min-h-screen w-full relative flex items-center py-16 scroll-mt-24 overflow-clip gpu-accelerated"
    >
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src="/images/bg-services.jpg"
          alt=""
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-background/80" />
      </div>

      {/* Static glow effects */}
      <div className="glow-static glow-static-1" />
      <div className="glow-static glow-static-2" />

      {/* Grid pattern overlay */}
      <div className="grid-pattern" />

      <div className="max-w-6xl mx-auto px-4 md:px-6 w-full relative z-10">
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={staggerContainer}
          className="flex flex-col gap-10"
        >
          <motion.div variants={fadeInUp} className="text-center">
            <span className="inline-flex items-center gap-2 text-xs tracking-widest text-cyan-400 uppercase font-semibold mb-4">
              <Sparkles className="w-4 h-4" />
              Co oferuję
            </span>
            <h2
              className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Profesjonalne <span className="text-cyan-400">usługi</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {services.map((service, idx) => (
              <motion.div
                key={service.title}
                variants={fadeInUp}
                custom={idx}
                className={`group border border-white/10 bg-gradient-to-br ${service.gradient} backdrop-blur-md rounded-2xl p-5 md:p-6 flex flex-col hover:border-cyan-400/50 transition-colors duration-200`}
              >
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white mb-4 group-hover:bg-white/20 transition-colors duration-200">
                  <service.icon className="w-5 h-5" />
                </div>
                <h3
                  className="text-lg font-bold mb-2 text-white"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {service.title}
                </h3>
                <p className="text-sm text-white/70 leading-relaxed">
                  {service.description}
                </p>
              </motion.div>
            ))}
          </div>

          <motion.div
            variants={fadeInUp}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-white/10"
          >
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div
                  className="text-2xl md:text-3xl font-bold text-cyan-400 mb-1"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {stat.value}
                </div>
                <div className="text-xs text-white/60">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function PortfolioSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState("");

  const openVideoModal = useCallback((src: string) => {
    setSelectedVideo(src);
    setVideoModalOpen(true);
  }, []);

  const closeVideoModal = useCallback(() => {
    setVideoModalOpen(false);
    setSelectedVideo("");
  }, []);

  const items = [
    {
      type: "video",
      src: "/videos/dron.mp4",
      title: "Prezentacja posiadłości",
      cat: "Nieruchomości",
      gradient: "from-teal-600/40",
    },
    { title: "Festiwal muzyczny", cat: "Eventy", gradient: "from-blue-600/40" },
    { title: "Górski szlak", cat: "Krajobraz", gradient: "from-indigo-600/40" },
    {
      title: "Nowoczesna willa",
      cat: "Nieruchomości",
      gradient: "from-purple-600/40",
    },
    { title: "Wesele w plenerze", cat: "Eventy", gradient: "from-pink-600/40" },
    {
      title: "Miejska panorama",
      cat: "Krajobraz",
      gradient: "from-cyan-600/40",
    },
  ];

  return (
    <>
      <VideoModal
        isOpen={videoModalOpen}
        onClose={closeVideoModal}
        src={selectedVideo}
      />
      <section
        id="portfolio"
        ref={ref}
        // DODANO: scroll-mt-24 (margines na navbar), ZMIENIONO overflow
        className="min-h-screen w-full relative flex items-center py-16 scroll-mt-24 overflow-clip gpu-accelerated"
      >
        {/* Background image */}
        <div className="absolute inset-0">
          <Image
            src="/images/bg-portfolio.jpg"
            alt=""
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-background/80" />
        </div>

        {/* Static glow effects */}
        <div
          className="glow-static glow-static-1"
          style={{ top: "15%", right: "5%", left: "auto" }}
        />
        <div
          className="glow-static glow-static-2"
          style={{ bottom: "10%", left: "10%", right: "auto" }}
        />

        {/* Grid pattern overlay */}
        <div className="grid-pattern" />

        <div className="max-w-6xl mx-auto px-4 md:px-6 w-full relative z-10">
          <motion.div
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={staggerContainer}
            className="flex flex-col gap-8"
          >
            <motion.div variants={fadeInUp} className="text-center">
              <span className="inline-flex items-center gap-2 text-xs tracking-widest text-cyan-400 uppercase font-semibold mb-4">
                <Camera className="w-4 h-4" />
                Realizacje
              </span>
              <h2
                className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Moje <span className="text-cyan-400">portfolio</span>
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map((item, idx) => (
                <motion.div
                  key={idx}
                  variants={fadeInUp}
                  custom={idx}
                  className="border border-white/10 rounded-2xl relative overflow-hidden bg-linear-to-b from-teal-600/40 to-card p-5 h-36 md:h-44 flex flex-col justify-end group cursor-pointer hover:border-cyan-400/50 transition-colors duration-200"
                  onClick={() =>
                    item.type === "video" &&
                    item.src &&
                    openVideoModal(item.src)
                  }
                >
                  {item.type === "video" && (
                    <video
                      src={item.src}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  )}

                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors duration-200 pointer-events-none" />

                  {item.type === "video" ? (
                    <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20">
                      <Maximize2 className="w-3.5 h-3.5 text-white" />
                    </div>
                  ) : (
                    <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20">
                      <Play className="w-3 h-3 text-white" />
                    </div>
                  )}

                  <div className="relative z-10">
                    <span className="text-xs uppercase font-bold tracking-wider text-cyan-400">
                      {item.cat}
                    </span>
                    <h3
                      className="text-base md:text-lg font-bold text-white mt-1"
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      {item.title}
                    </h3>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div variants={fadeInUp} className="text-center">
              <a
                href="#kontakt"
                onClick={(e) => {
                  e.preventDefault();
                  document
                    .getElementById("kontakt")
                    ?.scrollIntoView({ behavior: "smooth", block: "start" });
                  window.history.replaceState(null, "", "#kontakt");
                }}
                className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-semibold group"
              >
                Zobacz więcej projektów
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  );
}

function EquipmentSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const specs = [
    { value: "4K", label: "Wideo HDR" },
    { value: "48MP", label: "Zdjęcia" },
    { value: "34min", label: "Lot" },
    { value: "249g", label: "Waga" },
  ];

  const features = [
    "Stabilizacja 3-osiowa",
    "Wykrywanie przeszkód",
    "Tryb nocny",
    "Śledzenie obiektów",
  ];

  return (
    <section
      id="sprzet"
      ref={ref}
      // DODANO: scroll-mt-24 (margines na navbar), ZMIENIONO overflow
      className="min-h-screen w-full relative flex items-center py-16 scroll-mt-24 overflow-clip"
    >
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src="/images/bg-equipment.jpg"
          alt=""
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-background/85" />
      </div>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 100% 60% at 50% 50%, oklch(0.30 0.10 250 / 0.1), transparent)",
        }}
      />

      <div className="max-w-6xl mx-auto px-4 md:px-6 w-full relative z-10">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-12 items-center">
          <motion.div
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={fadeInLeft}
          >
            <span className="inline-flex items-center gap-2 text-xs tracking-widest text-cyan-400 uppercase font-semibold mb-4">
              <Camera className="w-4 h-4" />
              Sprzęt
            </span>
            <h2
              className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6 text-white"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              DJI Mini 3 <span className="text-cyan-400">Pro</span>
            </h2>

            <p className="text-white/70 leading-relaxed mb-8 text-sm md:text-base">
              Kompaktowy dron o profesjonalnych możliwościach. Idealny do ujęć w
              trudno dostępnych miejscach, z zachowaniem najwyższej jakości
              obrazu.
            </p>

            <div className="grid grid-cols-4 gap-3 mb-8">
              {specs.map((spec) => (
                <div
                  key={spec.label}
                  className="text-center p-3 rounded-xl bg-white/5 border border-white/10"
                >
                  <div
                    className="text-lg md:text-xl font-bold text-cyan-400 mb-1"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {spec.value}
                  </div>
                  <div className="text-xs text-white/60">{spec.label}</div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-2">
              {features.map((feature) => (
                <div key={feature} className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                  <span className="text-white/80">{feature}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={fadeInRight}
            className="relative"
          >
            {/* Animated glow rings */}
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full border border-cyan-400/20"
              animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.1, 0.3] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 rounded-full border border-cyan-400/30"
              animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.15, 0.4] }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5,
              }}
            />

            {/* Main glow */}
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-400/20 blur-[100px] rounded-full pointer-events-none"
              animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.35, 0.2] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Drone with complex animation */}
            <motion.div
              animate={{
                y: [0, -12, 0],
                rotateZ: [0, 1, 0, -1, 0],
                rotateX: [0, 2, 0, -2, 0],
              }}
              transition={{
                y: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                rotateZ: { duration: 6, repeat: Infinity, ease: "easeInOut" },
                rotateX: { duration: 5, repeat: Infinity, ease: "easeInOut" },
              }}
              style={{ perspective: "1000px" }}
            >
              <motion.div
                animate={{ scale: [1, 1.02, 1] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.2,
                }}
              >
                <Image
                  src="/images/drone.png"
                  alt="DJI Mini 3 Pro"
                  width={500}
                  height={312}
                  className="mx-auto drop-shadow-[0_40px_80px_rgba(59,130,246,0.35)] w-full h-auto relative z-10"
                />
              </motion.div>
            </motion.div>

            {/* Shadow on the ground */}
            <motion.div
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-40 h-4 bg-black/20 blur-xl rounded-full"
              animate={{ scale: [1, 0.9, 1], opacity: [0.3, 0.2, 0.3] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function ContactSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Wystąpił błąd");
      }

      setStatus("success");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      setStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "Wystąpił błąd");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <section
      id="kontakt"
      ref={ref}
      // DODANO: scroll-mt-24 (margines na navbar), ZMIENIONO overflow
      className="min-h-screen w-full relative flex items-center py-16 scroll-mt-24 overflow-clip"
    >
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src="/images/bg-contact.jpg"
          alt=""
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-background/85" />
      </div>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% 100%, oklch(0.35 0.15 250 / 0.15), transparent)",
        }}
      />

      <div className="max-w-6xl mx-auto px-4 md:px-6 w-full relative z-10">
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={staggerContainer}
          className="flex flex-col gap-10"
        >
          <motion.div variants={fadeInUp} className="text-center">
            <span className="inline-flex items-center gap-2 text-xs tracking-widest text-cyan-400 uppercase font-semibold mb-4">
              <Mail className="w-4 h-4" />
              Kontakt
            </span>
            <h2
              className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4 text-white"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Rozpocznijmy <span className="text-cyan-400">współpracę</span>
            </h2>
            <p className="text-white/70 max-w-lg mx-auto text-sm md:text-base">
              Masz projekt? Chętnie omówię szczegóły i przygotują wycenę
              dopasowaną do Twoich potrzeb.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8">
            <motion.div variants={fadeInLeft}>
              <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-4 p-6 md:p-8 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10"
              >
                {status === "success" && (
                  <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/30 text-green-400 text-sm flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    Wiadomość została wysłana! Odpowiem najszybciej jak to
                    możliwe.
                  </div>
                )}
                {status === "error" && (
                  <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                    {errorMessage}
                  </div>
                )}
                <div className="grid sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Imię"
                    required
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:border-cyan-400/50 transition-colors text-sm"
                  />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email"
                    required
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:border-cyan-400/50 transition-colors text-sm"
                  />
                </div>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Temat"
                  required
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:border-cyan-400/50 transition-colors text-sm"
                />
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Opisz swój projekt..."
                  rows={4}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:border-cyan-400/50 transition-colors resize-none text-sm"
                />
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full bg-cyan-500 text-white py-3 rounded-xl font-semibold hover:bg-cyan-400 transition-all duration-200 text-sm shadow-lg shadow-cyan-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {status === "loading" ? (
                    <>
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Wysyłanie...
                    </>
                  ) : (
                    "Wyślij wiadomość"
                  )}
                </button>
              </form>
            </motion.div>

            <motion.div
              variants={fadeInRight}
              className="flex flex-col justify-center gap-6"
            >
              <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="w-12 h-12 rounded-xl bg-cyan-400/20 flex items-center justify-center text-cyan-400">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-white/50 mb-1">Email</div>
                  <a
                    href="mailto:filserw@gmail.com"
                    className="text-white hover:text-cyan-400 transition-colors font-medium text-sm"
                  >
                    filserw@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="w-12 h-12 rounded-xl bg-cyan-400/20 flex items-center justify-center text-cyan-400">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-white/50 mb-1">Telefon</div>
                  <a
                    href="tel:+48509121200"
                    className="text-white hover:text-cyan-400 transition-colors font-medium text-sm"
                  >
                    +48 509 121 200
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="w-12 h-12 rounded-xl bg-cyan-400/20 flex items-center justify-center text-cyan-400">
                  <Instagram className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-white/50 mb-1">Instagram</div>
                  <a
                    href="https://instagram.com/awres777"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-cyan-400 transition-colors font-medium text-sm"
                  >
                    @awres777
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="py-8 border-t border-white/10 bg-background">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div
            className="text-lg font-bold text-white"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            SerwaDron<span className="text-cyan-400">.</span>
          </div>
          <div className="text-xs text-white/50">
            © 2026 SerwaDron. Wszystkie prawa zastrzeżone.
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function Page() {
  return (
    <main className="bg-background text-foreground overflow-x-hidden">
      <Navbar />
      <HeroSection />
      <ServicesSection />
      <PortfolioSection />
      <EquipmentSection />
      <ContactSection />
      <Footer />
    </main>
  );
}
