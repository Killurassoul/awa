"use client";

import { AnimatePresence, motion, useInView, useMotionValue, useSpring } from "framer-motion";
import { ArrowDown, ArrowUpRight, Check, Heart, Music2, Pause, Sparkles, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const facts = [
  { number: "01", title: "Une fille drôle ?", answer: "Absolument.", color: "lilac", note: "le rire, c’est sérieux" },
  { number: "02", title: "Une fille gentille ?", answer: "Évidemment.", color: "butter", note: "preuve à l’appui" },
  { number: "03", title: "Une fille magnifique ?", answer: "Inutile de débattre.", color: "coral", note: "dossier classé" },
  { number: "04", title: "Une personne attachante ?", answer: "Malheureusement, oui.", color: "mint", note: "pour ceux qui résistent" },
  { number: "05", title: "Une fille incroyable ?", answer: "Le fait le plus évident.", color: "blue", note: "fin du débat" },
];

const compliments = [
  "Awa, tu es incroyable. Au cas où tu aurais oublié.",
  "Je suis fier de toi, vraiment.",
  "Tu as le droit de prendre ton temps.",
  "N’oublie pas de célébrer tes victoires.",
  "Tu es beaucoup plus capable que tu ne le penses.",
  "Continue de briller, madame.",
  "Ta gentillesse est une qualité précieuse.",
  "Et au fait, tu es toujours aussi belle.",
  "Les petits pas comptent aussi. Surtout les tiens.",
  "Tu rends les journées plus légères autour de toi.",
  "Ton courage est discret, mais il est immense.",
  "Tu n’as pas besoin d’être parfaite pour être formidable.",
  "Quelqu’un croit très fort en toi.",
  "Tu peux être fière de tout le chemin parcouru.",
  "Rappel amical : tu mérites le meilleur.",
  "Ton énergie est une petite lumière. Garde-la.",
];

function FloatingBits({ count = 18 }: { count?: number }) {
  return (
    <div className="floating-bits" aria-hidden="true">
      {Array.from({ length: count }, (_, index) => (
        <span key={index} className={`bit bit-${(index % 6) + 1}`} style={{ "--i": index } as React.CSSProperties} />
      ))}
    </div>
  );
}

function Petal({ className = "" }: { className?: string }) {
  return <span aria-hidden="true" className={`petal ${className}`} />;
}

function SectionMarker({ label, number, light = false }: { label: string; number: string; light?: boolean }) {
  return (
    <div className={`section-marker ${light ? "section-marker-light" : ""}`}>
      <span>{number}</span><i />{label}
    </div>
  );
}

export default function Home() {
  const [started, setStarted] = useState(false);
  const [activeFact, setActiveFact] = useState(0);
  const [compliment, setCompliment] = useState(compliments[0]);
  const [complimentIndex, setComplimentIndex] = useState(0);
  const [soundOn, setSoundOn] = useState(false);
  const [cursorVisible, setCursorVisible] = useState(false);
  const [cursorText, setCursorText] = useState("");
  const audioRef = useRef<AudioContext | null>(null);
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const springX = useSpring(cursorX, { stiffness: 500, damping: 35 });
  const springY = useSpring(cursorY, { stiffness: 500, damping: 35 });

  useEffect(() => {
    const move = (event: MouseEvent) => { cursorX.set(event.clientX); cursorY.set(event.clientY); };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [cursorX, cursorY]);

  const playChime = () => {
    if (!soundOn || typeof window === "undefined") return;
    const AudioCtx = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    audioRef.current ??= new AudioCtx();
    const ctx = audioRef.current;
    const now = ctx.currentTime;
    [523.25, 659.25, 783.99].forEach((frequency, index) => {
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();
      oscillator.type = "sine";
      oscillator.frequency.value = frequency;
      gain.gain.setValueAtTime(0, now + index * 0.12);
      gain.gain.linearRampToValueAtTime(0.035, now + index * 0.12 + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, now + index * 0.12 + 1.1);
      oscillator.connect(gain).connect(ctx.destination);
      oscillator.start(now + index * 0.12);
      oscillator.stop(now + index * 0.12 + 1.2);
    });
  };

  const openSurprise = () => {
    setStarted(true);
    window.setTimeout(() => document.getElementById("awa")?.scrollIntoView({ behavior: "smooth" }), 400);
  };

  const newCompliment = () => {
    const next = (complimentIndex + 1 + Math.floor(Math.random() * (compliments.length - 1))) % compliments.length;
    setComplimentIndex(next);
    setCompliment(compliments[next]);
    playChime();
  };

  return (
    <main className="site-shell">
      <motion.div className="custom-cursor" style={{ x: springX, y: springY, opacity: cursorVisible ? 1 : 0 }} aria-hidden="true"><span>{cursorText || "✦"}</span></motion.div>
      <AnimatePresence>{!started && <motion.div className="intro" initial={{ opacity: 1 }} exit={{ opacity: 0, scale: 1.06, filter: "blur(12px)" }} transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}>
        <FloatingBits count={26} />
        <div className="intro-top"><span className="eyebrow">une petite création privée</span><span className="intro-date">04 / 11 / 26</span></div>
        <div className="intro-art"><Petal className="petal-a" /><Petal className="petal-b" /><Petal className="petal-c" /><span className="scribble scribble-one">pssst…</span><span className="scribble scribble-two">pour toi</span></div>
        <div className="intro-copy"><p className="kicker">chapitre 00 <span>•</span> attention délicate</p><h1>Coucou<br /><em>Awaaa !</em></h1><p className="intro-lede">Bon, j’avais quelque chose à te dire…<br />Alors j’ai créé tout ça juste pour toi.</p><motion.button className="primary-button" onClick={openSurprise} whileHover={{ scale: 1.04, rotate: -1 }} whileTap={{ scale: 0.96 }} onMouseEnter={() => { setCursorVisible(true); setCursorText("ouvrir") }} onMouseLeave={() => setCursorVisible(false)}>Ouvrir ta surprise <Heart size={17} fill="currentColor" /></motion.button></div>
        <div className="intro-footer"><span>fait avec beaucoup de soin</span><ArrowDown size={16} /></div>
      </motion.div>}</AnimatePresence>

      <header className="floating-nav">
        <a className="nav-mark" href="#top" aria-label="Retour en haut">A<span>♥</span></a>
        <div className="nav-pips" aria-label="Chapitres"><a href="#awa" /><a href="#faits" /><a href="#fierte" /><a href="#final" /></div>
        <button className="sound-toggle" onClick={() => { setSoundOn(!soundOn); if (!soundOn) setTimeout(playChime, 30); }} aria-label={soundOn ? "Désactiver l'ambiance" : "Activer l'ambiance"}>{soundOn ? <Volume2 size={15} /> : <VolumeX size={15} />}<span>ambiance {soundOn ? "on" : "off"}</span></button>
      </header>

      <section id="top" className="chapter chapter-awa" aria-labelledby="awa-title">
        <FloatingBits count={13} /><div className="vertical-label">une personne rare <span>✦</span></div>
        <div className="chapter-inner awa-layout"><SectionMarker label="awa, c’est toi" number="01" /><div className="awa-heading"><span className="handnote note-left">tu vois ?</span><h2 id="awa-title" aria-label="Awa"><span>A</span><span>W</span><span>A</span></h2><span className="handnote note-right">oui, toi.</span></div><p className="chapter-intro">Je ne sais pas si tu te rends toujours compte de la belle personne que tu es,<br className="desktop-only" /> mais je tenais à te le rappeler.</p><div className="word-cloud"><span>BELLE.</span><span>DRÔLE.</span><span>GENTILLE.</span><span>INCROYABLE.</span><span>ATTACHANTE.</span><span>EXTRAORDINAIRE.</span></div></div>
        <div className="scroll-hint"><span>fais défiler</span><ArrowDown size={14} /></div>
      </section>

      <section id="faits" className="chapter chapter-facts" aria-labelledby="facts-title">
        <div className="chapter-inner facts-layout"><div className="facts-heading"><SectionMarker label="petite enquête" number="02" /><h2 id="facts-title">Quelques vérités<br /><em>incontestables.</em></h2><p>Et non, il n’y a pas de débat.</p><span className="facts-stamp">certifié<br /><strong>AWA</strong><br />depuis toujours</span></div><div className="facts-list">{facts.map((fact, index) => <motion.button key={fact.number} className={`fact-row ${fact.color} ${activeFact === index ? "is-active" : ""}`} onClick={() => { setActiveFact(index); playChime(); }} onMouseEnter={() => { setCursorVisible(true); setCursorText("lire") }} onMouseLeave={() => setCursorVisible(false)} whileHover={{ x: 8 }}><span className="fact-number">{fact.number}</span><span className="fact-text"><strong>{fact.title}</strong><AnimatePresence mode="wait"><motion.span key={activeFact === index ? fact.answer : "closed"} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>{activeFact === index ? fact.answer : "cliquer pour vérifier"}</motion.span></AnimatePresence></span><span className="fact-note">{activeFact === index ? <Check size={17} /> : fact.note}</span><ArrowUpRight className="fact-arrow" size={18} /></motion.button>)}</div></div><div className="facts-doodle" aria-hidden="true">✳</div>
      </section>

      <section id="fierte" className="chapter chapter-pride" aria-labelledby="pride-title">
        <div className="pride-orbit orbit-one" /><div className="pride-orbit orbit-two" /><div className="chapter-inner pride-layout"><SectionMarker label="le moment important" number="03" light /><div className="pride-kicker">à encadrer, à relire, à garder</div><h2 id="pride-title">Awa,<br /><em>je suis fier<br />de toi.</em></h2><div className="pride-letter"><p>Je suis fier de toi, de tout ce que tu entreprends, de tes efforts, de tes ambitions et de toutes ces choses que tu accomplis.</p><p>Je voulais que tu saches que même les petites victoires méritent d’être célébrées.</p><p>Continue d’avancer, continue de croire en toi et ne minimise jamais tes efforts.</p><p>Tu mérites de voir tes efforts porter leurs fruits et d’être fière de la personne que tu deviens.</p><div className="letter-sign"><span>avec sincérité,</span><strong>quelqu’un qui croit en toi <Heart size={14} fill="currentColor" /></strong></div></div></div><div className="pride-side-note">les efforts<br />ne sont jamais<br /><em>invisibles.</em></div></section>

      <section className="chapter chapter-dispenser" aria-labelledby="dispenser-title"><div className="chapter-inner dispenser-layout"><div className="dispenser-visual"><div className="sticker sticker-top">à consommer<br />sans modération</div><div className="dispenser-circle"><span className="circle-star">✦</span><span className="circle-label">le petit<br /><strong>distributeur</strong><br />de compliments</span><span className="circle-smile">☺</span></div><div className="dispenser-machine"><span /><span /><span /></div></div><div className="dispenser-copy"><SectionMarker label="un rappel, peut-être ?" number="04" /><h2 id="dispenser-title">Tu en veux<br /><em>un autre ?</em></h2><p>Appuie sur le bouton. On ne sait jamais, un compliment peut se cacher juste là.</p><motion.button className="outline-button" onClick={newCompliment} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.96 }} onMouseEnter={() => { setCursorVisible(true); setCursorText("✨") }} onMouseLeave={() => setCursorVisible(false)}><Sparkles size={17} /> J’ai besoin d’un petit rappel</motion.button><AnimatePresence mode="wait"><motion.div className="compliment-slip" key={compliment} initial={{ opacity: 0, y: 24, rotate: 2 }} animate={{ opacity: 1, y: 0, rotate: -2 }} transition={{ type: "spring", stiffness: 250, damping: 18 }}><span>rappel n°{String(complimentIndex + 1).padStart(2, "0")}</span><p>“{compliment}”</p><Heart size={16} fill="currentColor" /></motion.div></AnimatePresence></div></div></section>

      <section id="final" className="chapter chapter-final" aria-labelledby="final-title"><FloatingBits count={23} /><div className="final-flower flower-left"><Petal /><Petal /><Petal /><Petal /><i /></div><div className="final-flower flower-right"><Petal /><Petal /><Petal /><Petal /><i /></div><div className="chapter-inner final-layout"><SectionMarker label="pour finir" number="05" /><p className="final-pretitle">bref, Awa…</p><h2 id="final-title">Ne doute jamais<br /><em>de la belle personne<br />que tu es.</em></h2><p className="final-copy">Je te souhaite énormément de bonheur, de réussite et de belles opportunités.<br />Continue de rire, de sourire, de poursuivre tes rêves et surtout de rester cette fille formidable.</p><div className="final-heart"><Heart size={29} fill="currentColor" /></div><p className="signature">Une petite création,<br /><span>spécialement pour toi.</span></p><p className="final-micro">PS : oui, tout ceci était absolument nécessaire. <span>♥</span></p></div></section>
      <footer className="site-footer"><span>Awa, édition limitée</span><span>fait avec ♥ et beaucoup d’admiration</span><span>fin de la surprise <ArrowUpRight size={14} /></span></footer>
    </main>
  );
}
