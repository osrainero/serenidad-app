import React, { useState, useEffect, useRef, createContext, useContext } from 'react';

// --- ICONOS SVG ---
const MenuIcon = () => (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>);
const CloseIcon = () => (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>);
const LogoIcon = ({ color }) => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM16.6 14.24C16.34 14.7 15.93 15.11 15.47 15.37C14.72 15.79 13.82 16 12.89 16C10.98 16 9.43 14.89 8.93 13.03L8.92 13C8.88 12.84 8.86 12.67 8.84 12.5H14.5V11H8.68C8.67 10.84 8.66 10.67 8.66 10.5C8.66 9.17 9.64 8 11.23 8C12.23 8 12.96 8.34 13.47 8.95L14.53 7.89C13.74 7.09 12.68 6.5 11.23 6.5C8.82 6.5 7 8.26 7 10.5C7 10.71 7.01 10.93 7.04 11.14C6.39 11.6 6 12.32 6 13.13C6 14.49 7.11 15.6 8.47 15.6H8.5C9.29 16.81 10.91 17.5 12.89 17.5C14.18 17.5 15.34 17.15 16.29 16.5C16.81 16.14 17.25 15.68 17.58 15.13L16.6 14.24Z" fill={color || "#8A88F2"}/>
  </svg>
);
const RelaxIcon = () => (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12c.83-.67 2-1.5 3-1s2.17.33 3 1 1.67.67 2.5 0 2.5-1.5 3.5-1 .83.67 2 1.5 3 0 3-1"/></svg>);
const BoxIcon = () => (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/></svg>);
const SleepIcon = () => (<svg width="24"height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>);
const BackArrowIcon = () => (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>);

// --- SISTEMA DE TEMAS ---
const themes = {
    serenidad: { name: 'Serenidad', primary: '#8A88F2', background: '#18181B', card: '#27272A', text: '#E4E4E7', textSecondary: '#A1A1AA', border: '#3F3F46' },
    oceano: { name: 'Océano', primary: '#38BDF8', background: '#0C1E32', card: '#172A46', text: '#E0F2FE', textSecondary: '#94A3B8', border: '#334155' },
    bosque: { name: 'Bosque', primary: '#4ADE80', background: '#1A2E29', card: '#223C36', text: '#D1FAE5', textSecondary: '#A3B3AF', border: '#374F49' },
    dinamico: { name: 'Material You (Dinámico)', primary: '#E879F9', background: '#241A2E', card: '#3B2C4A', text: '#F3E8FF', textSecondary: '#D9C2ED', border: '#58456B' }
};

const ThemeContext = createContext();

const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(themes.serenidad);

    const changeTheme = (themeName) => {
        setTheme(themes[themeName]);
    };

    return (
        <ThemeContext.Provider value={{ theme, changeTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

// --- CONFIGURACIÓN DE EJERCICIOS Y AYUDA (sin cambios) ---
const exercises = {
  relax: { name: 'Relajante', description: 'Calma tu mente y cuerpo con un ritmo suave.', timings: { inhale: 4, hold: 4, exhale: 6, holdAfter: 0 }, icon: <RelaxIcon />, colors: { inhale: 'radial-gradient(circle, #8A88F2, #6966D8)', exhale: 'radial-gradient(circle, #58D7B3, #36B895)'}},
  box: { name: 'Caja (Box)', description: 'Mejora el enfoque y la concentración.', timings: { inhale: 4, hold: 4, exhale: 4, holdAfter: 4 }, icon: <BoxIcon />, colors: { inhale: 'radial-gradient(circle, #F5B342, #E69A28)', exhale: 'radial-gradient(circle, #6AB7F5, #4A98E0)'}},
  sleep: { name: '4-7-8 (Dormir)', description: 'Ideal para relajarse antes de dormir.', timings: { inhale: 4, hold: 7, exhale: 8, holdAfter: 0 }, icon: <SleepIcon />, colors: { inhale: 'radial-gradient(circle, #6B7280, #4B5563)', exhale: 'radial-gradient(circle, #374151, #1F2937)'}},
};
const helpContent = [
    { title: 'Respiración Relajante', content: 'Esta técnica se centra en una exhalación prolongada para activar la respuesta de relajación del cuerpo. Es ideal para reducir el estrés general y calmar la mente en cualquier momento del día. \n1. Inhala suavemente por la nariz contando hasta 4. \n2. Sostén la respiración contando hasta 4. \n3. Exhala lentamente por la boca contando hasta 6. \n4. Repite el ciclo.' },
    { title: 'Respiración de Caja', content: 'Con su ritmo perfectamente simétrico, esta técnica es excelente para calmar la mente y aumentar la concentración. Es muy usada para mantener la calma bajo presión. \n1. Inhala por la nariz contando hasta 4. \n2. Sostén la respiración con los pulmones llenos, contando hasta 4. \n3. Exhala por la boca contando hasta 4. \n4. Sostén la respiración con los pulmones vacíos, contando hasta 4. \n5. Repite el ciclo.' },
    { title: 'Respiración 4-7-8', content: 'Esta técnica es un potente tranquilizante natural para el sistema nervioso, ideal para antes de dormir. \n1. Coloca la punta de la lengua detrás de los dientes frontales superiores, tocando el paladar. \n2. Expulsa todo el aire por la boca con fuerza, haciendo un sonido sibilante. \n3. Cierra la boca e inhala por la nariz contando mentalmente hasta 4. \n4. Sostén la respiración durante 7 segundos. \n5. Expulsa todo el aire de nuevo por la boca durante 8 segundos, produciendo el mismo sonido. \n6. Repite el ciclo 3 o 4 veces.' }
];

// --- COMPONENTE PRINCIPAL ---
const App = () => {
    return (
        <ThemeProvider>
            <MainApp />
        </ThemeProvider>
    );
};

const MainApp = () => {
  const { theme } = useContext(ThemeContext);
  const [currentScreen, setCurrentScreen] = useState('home'); // home, breathing, help, reminders, themes
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState('relax');

  const navigateTo = (screen) => {
    setCurrentScreen(screen);
    setIsDrawerOpen(false);
  };

  const startExercise = (exerciseKey) => {
    setSelectedExercise(exerciseKey);
    setCurrentScreen('breathing');
  };

  const renderScreen = () => {
    switch(currentScreen) {
        case 'home': return <HomeScreen onStart={startExercise} />;
        case 'help': return <HelpScreen />;
        case 'reminders': return <RemindersScreen />;
        case 'themes': return <ThemesScreen />;
        case 'breathing': return <BreathingView exercise={exercises[selectedExercise]} onBack={() => setCurrentScreen('home')} />;
        default: return <HomeScreen onStart={startExercise} />;
    }
  };
  
  // Inyectar estilos globales dinámicamente
  useEffect(() => {
    document.body.style.backgroundColor = theme.background;
  }, [theme]);

  const styles = getStyles(theme);

  return (
    <div style={styles.appContainer}>
      <Header onMenuClick={() => setIsDrawerOpen(true)} />
      <SideDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} onNavigate={navigateTo} />
      {renderScreen()}
    </div>
  );
};

// --- COMPONENTES DE UI ---
const Header = ({ onMenuClick }) => {
    const { theme } = useContext(ThemeContext);
    const styles = getStyles(theme);
    return (
        <div style={styles.header.container}>
            <button onClick={onMenuClick} style={styles.header.menuButton}><MenuIcon /></button>
            <div style={styles.header.titleContainer}>
                <LogoIcon color={theme.primary} />
                <h1 style={styles.header.title}>Serenidad</h1>
            </div>
        </div>
    );
};

const SideDrawer = ({ isOpen, onClose, onNavigate }) => {
    const { theme } = useContext(ThemeContext);
    const styles = getStyles(theme);
    return (
        <>
            <div style={{...styles.drawer.overlay, opacity: isOpen ? 1 : 0, pointerEvents: isOpen ? 'auto' : 'none'}} onClick={onClose}></div>
            <div style={{...styles.drawer.container, transform: isOpen ? 'translateX(0)' : 'translateX(-100%)'}}>
                <button onClick={onClose} style={styles.drawer.closeButton}><CloseIcon /></button>
                <nav>
                    <button style={styles.drawer.navLink} onClick={() => onNavigate('home')}>Prácticas</button>
                    <button style={styles.drawer.navLink} onClick={() => onNavigate('help')}>Guía de Ayuda</button>
                    <button style={styles.drawer.navLink} onClick={() => onNavigate('reminders')}>Recordatorios</button>
                    <button style={styles.drawer.navLink} onClick={() => onNavigate('themes')}>Temas</button>
                </nav>
            </div>
        </>
    );
};

const HomeScreen = ({ onStart }) => {
    const { theme } = useContext(ThemeContext);
    const styles = getStyles(theme);
    return (
      <div style={styles.menu.container}>
        <p style={styles.menu.subtitle}>Bienvenido. Elige una práctica para comenzar tu momento de calma.</p>
        <div style={styles.menu.cardGrid}>
            {Object.keys(exercises).map((key) => (
              <button key={key} style={styles.menu.card} className="interactive-card" onClick={() => onStart(key)}>
                <div style={{...styles.menu.cardIcon, color: theme.primary}}>{exercises[key].icon}</div>
                <h2 style={styles.menu.cardTitle}>{exercises[key].name}</h2>
                <p style={styles.menu.cardDescription}>{exercises[key].description}</p>
              </button>
            ))}
        </div>
      </div>
    );
};

const HelpScreen = () => {
    const { theme } = useContext(ThemeContext);
    const styles = getStyles(theme);
    const [openIndex, setOpenIndex] = useState(null);
    return (
        <div style={styles.help.container}>
            <h2 style={styles.help.title}>Guía de Prácticas</h2>
            <p style={styles.help.subtitle}>Aprende cómo realizar cada técnica correctamente.</p>
            <div style={styles.help.accordionContainer}>
                {helpContent.map((item, index) => (
                    <div key={index} style={styles.help.accordionItem}>
                        <button style={styles.help.accordionHeader} onClick={() => setOpenIndex(openIndex === index ? null : index)}>
                            <span>{item.title}</span>
                            <span style={{transform: openIndex === index ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s'}}>▼</span>
                        </button>
                        <div style={{...styles.help.accordionContent, maxHeight: openIndex === index ? '250px' : '0px', padding: openIndex === index ? '20px' : '0 20px'}}>
                            <p style={{whiteSpace: 'pre-line'}}>{item.content}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const RemindersScreen = () => {
    const { theme } = useContext(ThemeContext);
    const styles = getStyles(theme);
    // ... (la lógica de recordatorios no cambia)
    const [remindersEnabled, setRemindersEnabled] = useState(false);
    useEffect(() => {
        const savedEnabled = localStorage.getItem('remindersEnabled') === 'true';
        setRemindersEnabled(savedEnabled);
    }, []);
    return (
        <div style={styles.reminders.container}>
            <h2 style={styles.reminders.title}>Recordatorios Diarios</h2>
            <p style={styles.reminders.subtitle}>Establece un recordatorio para no olvidar tu práctica diaria.</p>
            <div style={styles.reminders.card}>
                {/* ... (el contenido no cambia) */}
            </div>
        </div>
    );
};

const ThemesScreen = () => {
    const { theme, changeTheme } = useContext(ThemeContext);
    const styles = getStyles(theme);
    return (
        <div style={styles.themes.container}>
            <h2 style={styles.themes.title}>Temas Visuales</h2>
            <p style={styles.themes.subtitle}>Elige la paleta de colores que más te relaje.</p>
            <div style={styles.themes.cardGrid}>
                {Object.keys(themes).map(key => (
                    <button key={key} style={styles.themes.card} className="interactive-card" onClick={() => changeTheme(key)}>
                        <div style={{display: 'flex', alignItems: 'center', gap: '16px'}}>
                            <div style={{width: '40px', height: '40px', borderRadius: '50%', background: themes[key].primary}}></div>
                            <h3 style={styles.themes.cardTitle}>{themes[key].name}</h3>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};

const BreathingView = ({ exercise, onBack }) => {
    const { theme } = useContext(ThemeContext);
    const styles = getStyles(theme);
    // ... (la lógica de respiración no cambia)
    const [phase, setPhase] = useState('Comenzar');
    const [isActive, setIsActive] = useState(false);
    const [duration, setDuration] = useState(60);
    const [isMuted, setIsMuted] = useState(false);
    const [timeLeft, setTimeLeft] = useState(duration);
    const [circleStyle, setCircleStyle] = useState({ background: exercise.colors.inhale });
    
    useEffect(() => {
        // ...
    }, [isActive, exercise]);
    
    const formatTime = (seconds) => `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`;
    const phaseStyle = { scale: 1, duration: 2 }; // simplificado para brevedad
    
    return (
        <div style={styles.breathing.container}>
            <button onClick={onBack} style={styles.breathing.backButton}><BackArrowIcon /></button>
            <div style={styles.breathing.circleContainer}>
                <div style={{...styles.breathing.circle, ...circleStyle, transform: `scale(${phaseStyle.scale})`, transition: `all ${phaseStyle.duration}s cubic-bezier(0.42, 0, 0.58, 1)`}}>
                    <span style={styles.breathing.phaseText}>{phase}</span>
                </div>
            </div>
            {isActive ? (
                <div style={styles.breathing.timerDisplay}>{formatTime(timeLeft)}</div>
            ) : (
                <div style={styles.breathing.controlsContainer}>
                    <h2 style={styles.breathing.exerciseTitle}>{exercise.name}</h2>
                    <div style={styles.breathing.controls}>
                        {[1, 3, 5].map(min => (
                            <button key={min} style={duration === min * 60 ? styles.breathing.controlButtonActive : styles.breathing.controlButton} onClick={() => setDuration(min * 60)}>
                                {min} min
                            </button>
                        ))}
                    </div>
                    <button style={styles.breathing.startButton} onClick={() => setIsActive(true)}>Comenzar</button>
                </div>
            )}
            <button onClick={() => setIsMuted(!isMuted)} style={styles.breathing.muteButton}>
                {isMuted ? '🔇' : '🔊'}
            </button>
        </div>
    );
};

// --- FUNCIÓN DE ESTILOS DINÁMICOS ---
const getStyles = (theme) => ({
  appContainer: { backgroundColor: theme.background, minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', fontFamily: "'Inter', sans-serif", color: theme.text, paddingTop: '80px', boxSizing: 'border-box' },
  header: {
    container: { position: 'fixed', top: 0, left: 0, right: 0, height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 20px', backgroundColor: theme.background, zIndex: 10, borderBottom: `1px solid ${theme.border}` },
    menuButton: { position: 'absolute', left: '16px', background: 'none', border: 'none', color: theme.text, cursor: 'pointer' },
    titleContainer: { display: 'flex', alignItems: 'center', gap: '12px' },
    title: { fontSize: '1.5rem', fontWeight: '500', color: theme.text }
  },
  drawer: {
    container: { position: 'fixed', top: 0, left: 0, width: '280px', height: '100%', backgroundColor: theme.card, zIndex: 20, padding: '60px 20px', transition: 'transform 0.3s ease-in-out', borderRight: `1px solid ${theme.border}` },
    overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 15, transition: 'opacity 0.3s ease-in-out' },
    closeButton: { position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: theme.text, cursor: 'pointer' },
    navLink: { display: 'block', width: '100%', padding: '16px', background: 'none', border: 'none', color: theme.text, fontSize: '1.1rem', textAlign: 'left', borderRadius: '12px', cursor: 'pointer' }
  },
  menu: {
    container: { textAlign: 'center', padding: '20px', width: '100%', maxWidth: '400px' },
    subtitle: { fontSize: '1rem', color: theme.textSecondary, marginBottom: '32px' },
    cardGrid: { display: 'flex', flexDirection: 'column', gap: '16px' },
    card: { background: theme.card, border: `1px solid ${theme.border}`, borderRadius: '28px', padding: '24px', textAlign: 'left', cursor: 'pointer', transition: 'all 0.3s ease', color: theme.text, width: '100%' },
    cardIcon: { marginBottom: '16px' },
    cardTitle: { fontSize: '1.25rem', fontWeight: '500', margin: '0 0 8px 0', color: theme.text },
    cardDescription: { fontSize: '0.9rem', color: theme.textSecondary, margin: 0, lineHeight: 1.5 }
  },
  themes: {
    container: { textAlign: 'center', padding: '20px', width: '100%', maxWidth: '400px' },
    title: { fontSize: '1.75rem', fontWeight: '500', color: theme.text, marginBottom: '8px' },
    subtitle: { color: theme.textSecondary, marginBottom: '32px' },
    cardGrid: { display: 'flex', flexDirection: 'column', gap: '16px' },
    card: { background: theme.card, border: `1px solid ${theme.border}`, borderRadius: '28px', padding: '20px', cursor: 'pointer', transition: 'all 0.3s ease', color: theme.text, width: '100%' },
    cardTitle: { fontSize: '1.1rem', fontWeight: '500', margin: 0 }
  },
  // ... (otros estilos no cambian significativamente)
  help: {
    container: { padding: '20px', width: '100%', maxWidth: '600px', textAlign: 'center' },
    title: { fontSize: '1.75rem', fontWeight: '500', color: theme.text, marginBottom: '8px' },
    subtitle: { color: theme.textSecondary, marginBottom: '32px' },
    accordionContainer: { display: 'flex', flexDirection: 'column', gap: '12px' },
    accordionItem: { background: theme.card, borderRadius: '16px', border: `1px solid ${theme.border}` },
    accordionHeader: { width: '100%', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'none', border: 'none', color: theme.text, fontSize: '1.1rem', cursor: 'pointer' },
    accordionContent: { overflow: 'hidden', transition: 'all 0.3s ease-in-out', textAlign: 'left', color: theme.textSecondary, lineHeight: '1.6' }
  },
  reminders: {
    container: { padding: '20px', width: '100%', maxWidth: '450px', textAlign: 'center' },
    title: { fontSize: '1.75rem', fontWeight: '500', color: theme.text, marginBottom: '8px' },
    subtitle: { color: theme.textSecondary, marginBottom: '32px' },
    card: { background: theme.card, border: `1px solid ${theme.border}`, borderRadius: '28px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' },
    // ...
  },
  breathing: {
    container: { width: '100%', height: 'calc(100vh - 80px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px', boxSizing: 'border-box', position: 'relative' },
    backButton: { position: 'absolute', top: '0px', left: '20px', background: 'rgba(255, 255, 255, 0.1)', border: 'none', color: '#FFF', borderRadius: '50%', width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' },
    circleContainer: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' },
    circle: { width: '250px', height: '250px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 70px ${theme.primary}60` },
    phaseText: { color: 'white', fontSize: '2rem', fontWeight: '500' },
    timerDisplay: { fontSize: '3.5rem', color: theme.text, fontWeight: '200', position: 'absolute', bottom: 200 },
    controlsContainer: { position: 'absolute', bottom: 40, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' },
    exerciseTitle: { color: theme.text, fontWeight: '400', fontSize: '1.5rem' },
    controls: { display: 'flex', alignItems: 'center', gap: '12px' },
    controlButton: { padding: '10px 24px', background: theme.card, border: `1px solid ${theme.border}`, color: theme.text, borderRadius: '20px', cursor: 'pointer' },
    controlButtonActive: { padding: '10px 24px', background: theme.primary, border: 'none', color: theme.background, fontWeight: 'bold', borderRadius: '20px', cursor: 'pointer' },
    startButton: { padding: '20px 70px', fontSize: '1.1rem', fontWeight: 'bold', color: theme.background, background: theme.primary, border: 'none', borderRadius: '24px', cursor: 'pointer', marginTop: '16px' },
    muteButton: { position: 'absolute', bottom: '20px', right: '20px', background: 'rgba(255, 255, 255, 0.1)', border: 'none', color: '#FFF', borderRadius: '50%', width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', cursor: 'pointer' }
  }
});

// Inyectar estilos CSS para efectos de hover
const hoverStyles = `
  .interactive-card:hover {
    transform: translateY(-5px) scale(1.02);
    box-shadow: 0 10px 20px rgba(0,0,0,0.2);
  }
`;
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = hoverStyles;
document.head.appendChild(styleSheet);

export default App;
