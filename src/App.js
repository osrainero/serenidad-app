import React, {
  useState,
  useEffect,
  useRef,
  createContext,
  useContext,
  useMemo,
  useCallback,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./App.css";

const staticThemes = {
  serenidad: {
    name: "Serenidad",
    primary: "#8A88F2",
    background: "#18181B",
    card: "#27272A",
    text: "#E4E4E7",
    textSecondary: "#A1A1AA",
    border: "#3F3F46",
  },
  oceano: {
    name: "Océano",
    primary: "#38BDF8",
    background: "#0C1E32",
    card: "#172A46",
    text: "#E0F2FE",
    textSecondary: "#94A3B8",
    border: "#334155",
  },
  bosque: {
    name: "Bosque",
    primary: "#4ADE80",
    background: "#1A2E29",
    card: "#223C36",
    text: "#D1FAE5",
    textSecondary: "#A3B3AF",
    border: "#374F49",
  },
  atardecer: {
    name: "Atardecer",
    primary: "#F97316",
    background: "#2A1A1E",
    card: "#42282E",
    text: "#FFEDD5",
    textSecondary: "#D4B8B0",
    border: "#5C3A3F",
  },
};

// --- ICONOS SVG ---
const MenuIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="3" y1="12" x2="21" y2="12"></line>
    <line x1="3" y1="6" x2="21" y2="6"></line>
    <line x1="3" y1="18" x2="21" y2="18"></line>
  </svg>
);

const CloseIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const LogoIcon = ({ color }) => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM16.6 14.24C16.34 14.7 15.93 15.11 15.47 15.37C14.72 15.79 13.82 16 12.89 16C10.98 16 9.43 14.89 8.93 13.03L8.92 13C8.88 12.84 8.86 12.67 8.84 12.5H14.5V11H8.68C8.67 10.84 8.66 10.67 8.66 10.5C8.66 9.17 9.64 8 11.23 8C12.23 8 12.96 8.34 13.47 8.95L14.53 7.89C13.74 7.09 12.68 6.5 11.23 6.5C8.82 6.5 7 8.26 7 10.5C7 10.71 7.01 10.93 7.04 11.14C6.39 11.6 6 12.32 6 13.13C6 14.49 7.11 15.6 8.47 15.6H8.5C9.29 16.81 10.91 17.5 12.89 17.5C14.18 17.5 15.34 17.15 16.29 16.5C16.81 16.14 17.25 15.68 17.58 15.13L16.6 14.24Z"
      fill={color || "#8A88F2"}
    />
  </svg>
);

const RelaxIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 12c.83-.67 2-1.5 3-1s2.17.33 3 1 1.67.67 2.5 0 2.5-1.5 3.5-1 .83.67 2 1.5 3 0 3-1" />
  </svg>
);

const BoxIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
  </svg>
);

const SleepIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

const BackArrowIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M19 12H5" />
    <path d="M12 19l-7-7 7-7" />
  </svg>
);

const CheckIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export const ThemeContext = createContext({
  theme: staticThemes.serenidad, // Valor por defecto
  changeTheme: () => {}, // Función vacía por defecto
});

const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("appTheme");
    return savedTheme && staticThemes[savedTheme]
      ? staticThemes[savedTheme]
      : staticThemes.serenidad;
  });

  const changeTheme = useCallback((themeName) => {
    if (staticThemes[themeName]) {
      setTheme(staticThemes[themeName]);
      localStorage.setItem("appTheme", themeName);
    }
  }, []);

  const value = useMemo(() => ({ theme, changeTheme }), [theme, changeTheme]);

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

// --- CONFIGURACIÓN DE EJERCICIOS Y AYUDA ---
const exercises = {
  relax: {
    name: "Relajante",
    description: "Calma tu mente y cuerpo con un ritmo suave.",
    timings: { inhale: 4, hold: 4, exhale: 6, holdAfter: 0 },
    icon: <RelaxIcon />,
    colors: {
      inhale: "radial-gradient(circle, #8A88F2, #6966D8)",
      exhale: "radial-gradient(circle, #58D7B3, #36B895)",
    },
  },
  box: {
    name: "Caja (Box)",
    description: "Mejora el enfoque y la concentración.",
    timings: { inhale: 4, hold: 4, exhale: 4, holdAfter: 4 },
    icon: <BoxIcon />,
    colors: {
      inhale: "radial-gradient(circle, #F5B342, #E69A28)",
      exhale: "radial-gradient(circle, #6AB7F5, #4A98E0)",
    },
  },
  sleep: {
    name: "4-7-8 (Dormir)",
    description: "Ideal para relajarse antes de dormir.",
    timings: { inhale: 4, hold: 7, exhale: 8, holdAfter: 0 },
    icon: <SleepIcon />,
    colors: {
      inhale: "radial-gradient(circle, #6B7280, #4B5563)",
      exhale: "radial-gradient(circle, #374151, #1F2937)",
    },
  },
};

const helpContent = [
  {
    title: "Respiración Relajante",
    content:
      "Esta técnica se centra en una exhalación prolongada para activar la respuesta de relajación del cuerpo. Es ideal para reducir el estrés general y calmar la mente en cualquier momento del día. \n1. Inhala suavemente por la nariz contando hasta 4. \n2. Sostén la respiración contando hasta 4. \n3. Exhala lentamente por la boca contando hasta 6. \n4. Repite el ciclo.",
  },
  {
    title: "Respiración de Caja",
    content:
      "Con su ritmo perfectamente simétrico, esta técnica es excelente para calmar la mente y aumentar la concentración. Es muy usada para mantener la calma bajo presión. \n1. Inhala por la nariz contando hasta 4. \n2. Sostén la respiración con los pulmones llenos, contando hasta 4. \n3. Exhala por la boca contando hasta 4. \n4. Sostén la respiración con los pulmones vacíos, contando hasta 4. \n5. Repite el ciclo.",
  },
  {
    title: "Respiración 4-7-8",
    content:
      "Esta técnica es un potente tranquilizante natural para el sistema nervioso, ideal para antes de dormir. \n1. Coloca la punta de la lengua detrás de los dientes frontales superiores, tocando el paladar. \n2. Expulsa todo el aire por la boca con fuerza, haciendo un sonido sibilante. \n3. Cierra la boca e inhala por la nariz contando mentalmente hasta 4 \n4. Sostén la respiración durante 7 segundos. \n5. Expulsa todo el aire de nuevo por la boca durante 8 segundos, produciendo el mismo sonido. \n6. Repite el ciclo 3 o 4 veces.",
  },
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
  const { theme = staticThemes.serenidad } = useContext(ThemeContext); // Valor por defecto
  const [currentScreen, setCurrentScreen] = useState("home");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState(null);

  const navigateTo = React.useCallback((screen) => {
    console.log("Navigating to:", screen); // Para debug
    setCurrentScreen(screen);
    setIsDrawerOpen(false);
  }, []);

  const startExercise = useCallback((exerciseKey) => {
    setSelectedExercise(exerciseKey);
    setCurrentScreen("breathing");
  }, []);

  // Renderizado de pantallas
  const renderScreen = useCallback(() => {
    switch (currentScreen) {
      case "home":
        return <HomeScreen onStart={startExercise} />;
      case "help":
        return <HelpScreen />;
      case "themes":
        return <ThemesScreen />;
      case "breathing":
        return selectedExercise ? ( // Verificación crítica
          <BreathingView
            exercise={exercises[selectedExercise]}
            onBack={() => setCurrentScreen("home")}
          />
        ) : (
          <div style={{ color: theme.text }}>
            Error: No se seleccionó ejercicio
            <button onClick={() => setCurrentScreen("home")}>
              Volver al inicio
            </button>
          </div>
        );
      default:
        return <HomeScreen onStart={startExercise} />;
    }
  }, [currentScreen, selectedExercise, theme.text, startExercise]);

  useEffect(() => {
    document.body.style.backgroundColor = theme.background;
    document.body.style.color = theme.text;
  }, [theme]);

  return (
    <div style={getStyles(theme).appContainer}>
      <Header onMenuClick={() => setIsDrawerOpen(true)} />
      <SideDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onNavigate={navigateTo}
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={currentScreen}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          style={{ width: "100%", flex: 1 }}
        >
          {renderScreen()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

// --- COMPONENTES DE UI ---
const Header = ({ onMenuClick }) => {
  const { theme } = useContext(ThemeContext);
  const styles = getStyles(theme);
  return (
    <div style={styles.header.container}>
      <button
        onClick={onMenuClick}
        style={styles.header.menuButton}
        aria-label="Abrir menú"
      >
        <MenuIcon />
      </button>
      <div style={styles.header.titleContainer}>
        <LogoIcon color={theme.primary} />
        <h1 style={styles.header.title}>Serenidad V1.7</h1>
      </div>
    </div>
  );
};

const SideDrawer = ({ isOpen, onClose, onNavigate }) => {
  const { theme } = useContext(ThemeContext);

  // Estilos corregidos para Material You
  const styles = {
    drawer: {
      container: {
        position: "fixed",
        top: 0,
        left: 0,
        width: "280px",
        height: "100%",
        backgroundColor:
          theme.name === "Material You"
            ? "var(--card, #3B2C4A)" // Fallback por si no existe la variable
            : theme.card,
        zIndex: 20,
        padding: "60px 20px",
        borderRight: `1px solid ${
          theme.name === "Material You"
            ? "var(--border, #58456B)"
            : theme.border
        }`,
        willChange: "transform",
      },
      overlay: {
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        zIndex: 15,
        willChange: "opacity",
      },
      closeButton: {
        position: "absolute",
        top: "16px",
        right: "16px",
        background: "none",
        border: "none",
        color:
          theme.name === "Material You" ? "var(--text, #F3E8FF)" : theme.text,
        cursor: "pointer",
        padding: "8px",
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        ":hover": {
          backgroundColor:
            (theme.name === "Material You"
              ? "var(--primary, #E879F9)"
              : theme.primary) + "20",
        },
      },
      navLink: {
        display: "block",
        width: "100%",
        padding: "16px",
        background: "none",
        border: "none",
        color:
          theme.name === "Material You" ? "var(--text, #F3E8FF)" : theme.text,
        fontSize: "1.1rem",
        textAlign: "left",
        borderRadius: "12px",
        cursor: "pointer",
        marginBottom: "8px",
        transition: "all 0.2s ease",
        ":hover": {
          backgroundColor:
            (theme.name === "Material You"
              ? "var(--primary, #E879F9)"
              : theme.primary) + "20",
        },
      },
    },
  };

  return (
    <>
      {isOpen && (
        <motion.div
          style={styles.drawer.overlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          key="overlay"
        />
      )}
      <motion.div
        style={styles.drawer.container}
        initial={{ x: "-100%" }}
        animate={{ x: isOpen ? 0 : "-100%" }}
        exit={{ x: "-100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        key="drawer"
      >
        <button
          onClick={onClose}
          style={styles.drawer.closeButton}
          aria-label="Cerrar menú"
        >
          <CloseIcon />
        </button>
        <nav>
          {["home", "help", "themes"].map((screen) => (
            <button
              key={screen}
              style={styles.drawer.navLink}
              onClick={() => onNavigate(screen)}
            >
              {screen === "home" && "Prácticas"}
              {screen === "help" && "Guía de Ayuda"}
              {screen === "themes" && "Temas"}
            </button>
          ))}
        </nav>
      </motion.div>
    </>
  );
};

const HomeScreen = ({ onStart }) => {
  const { theme } = useContext(ThemeContext);
  const styles = getStyles(theme);
  return (
    <div style={styles.menu.container}>
      <p style={styles.menu.subtitle}>
        Bienvenido. Elige una práctica para comenzar tu momento de calma.
      </p>
      <div style={styles.menu.cardGrid}>
        {Object.keys(exercises).map((key) => (
          <motion.button
            key={key}
            style={styles.menu.card}
            className="interactive-card"
            onClick={() => onStart(key)}
            whileHover={{ y: -5, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
            aria-label={`Iniciar ejercicio ${exercises[key].name}`}
          >
            <div style={{ ...styles.menu.cardIcon, color: theme.primary }}>
              {exercises[key].icon}
            </div>
            <h2 style={styles.menu.cardTitle}>{exercises[key].name}</h2>
            <p style={styles.menu.cardDescription}>
              {exercises[key].description}
            </p>
          </motion.button>
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
      <p style={styles.help.subtitle}>
        Aprende cómo realizar cada técnica correctamente.
      </p>
      <div style={styles.help.accordionContainer}>
        {helpContent.map((item, index) => (
          <motion.div
            key={index}
            style={styles.help.accordionItem}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <button
              style={styles.help.accordionHeader}
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              aria-expanded={openIndex === index}
              aria-controls={`accordion-content-${index}`}
            >
              <span>{item.title}</span>
              <motion.span
                animate={{ rotate: openIndex === index ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                ▼
              </motion.span>
            </button>
            <div
              style={{
                ...styles.help.accordionContent,
                maxHeight: openIndex === index ? "1000px" : "0px",
                padding: openIndex === index ? "15px 20px" : "0 20px",
              }}
            >
              <div style={{ padding: "5px 0" }}>
                {item.content.split("\n").map((paragraph, i) => (
                  <p key={i} style={{ margin: "8px 0" }}>
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const ThemesScreen = () => {
  const { theme, changeTheme } = useContext(ThemeContext);
  const styles = getStyles(theme);
  const [selectedTheme, setSelectedTheme] = useState(
    localStorage.getItem("appTheme") || "serenidad"
  );

  const handleThemeChange = (themeKey) => {
    changeTheme(themeKey);
    setSelectedTheme(themeKey);
  };

  return (
    <div style={styles.themes.container}>
      <h2 style={styles.themes.title}>Temas Visuales</h2>
      <p style={styles.themes.subtitle}>
        Elige la paleta de colores que más te relaje.
      </p>
      <div style={styles.themes.cardGrid}>
        {Object.keys(staticThemes).map((key) => (
          <motion.button
            key={key}
            style={{
              ...styles.themes.card,
              borderColor: selectedTheme === key ? theme.primary : theme.border,
            }}
            className="interactive-card"
            onClick={() => handleThemeChange(key)}
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
            aria-label={`Cambiar a tema ${staticThemes[key].name}`}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  background: staticThemes[key].primary,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {selectedTheme === key && <CheckIcon />}
              </div>
              <h3 style={styles.themes.cardTitle}>{staticThemes[key].name}</h3>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

const BreathingView = ({ exercise, onBack }) => {
  const { theme } = useContext(ThemeContext);
  const styles = getStyles(theme);

  // Estados
  const [phase, setPhase] = useState("ready");
  const [isActive, setIsActive] = useState(false);
  const [duration, setDuration] = useState(() => {
    const savedDuration = localStorage.getItem("breathDuration");
    return savedDuration ? parseInt(savedDuration) : 60;
  });
  const [timeLeft, setTimeLeft] = useState(duration);
  const [progressPercentage, setProgressPercentage] = useState(0);
  const timerRef = useRef(null);

  // Objetos estáticos (no cambian entre renders)
  const phaseInstructions = {
    ready: "Preparado",
    inhale: "Inhala",
    hold: "Mantén",
    exhale: "Exhala",
    holdAfter: "Espera",
  };

  const phaseColors = {
    ready: theme.primary, // Color del tema
    inhale: "#10B981", // Verde para inhalar
    hold: "#F59E0B", // Ámbar para mantener
    exhale: "#EF4444", // Rojo para exhalar
    holdAfter: "#3B82F6", // Azul para mantener después de exhalar
  };

  const PHASE_SCALES = {
    ready: 1, // Preparado: tamaño normal (100%)
    inhale: 2, // Inhala: crece al 200%
    hold: 2, // Mantén (después de inhalar): mantiene 200%
    exhale: 1, // Exhala: reduce al 100%
    holdAfter: 1, // Mantén (después de exhalar): mantiene 100%
  };

  const getTransitionConfig = (currentPhase) => {
    const baseDuration =
      {
        inhale: exercise.timings.inhale,
        hold: exercise.timings.hold,
        exhale: exercise.timings.exhale,
        holdAfter: exercise.timings.holdAfter,
      }[currentPhase] || 0.3;

    return {
      duration: baseDuration * 0.9, // Hacemos la animación un 10% más rápida que la fase
      ease: [0.43, 0.13, 0.23, 0.96], // Curva de easing suave
    };
  };

  // Memoización corregida
  const phaseDurations = React.useMemo(
    () => ({
      inhale: exercise.timings.inhale,
      hold: exercise.timings.hold,
      exhale: exercise.timings.exhale,
      holdAfter: exercise.timings.holdAfter,
    }),
    [
      exercise.timings.inhale,
      exercise.timings.hold,
      exercise.timings.exhale,
      exercise.timings.holdAfter,
    ]
  );

  // Funciones memoizadas
  const startBreathingCycle = useCallback(() => {
    setIsActive(true);
    setPhase("inhale");
    setTimeLeft(duration);
    setProgressPercentage(0);
    if (navigator.vibrate) navigator.vibrate(100);
  }, [duration]);

  const stopBreathingCycle = useCallback(() => {
    clearInterval(timerRef.current);
    setIsActive(false);
    setPhase("ready");
    setProgressPercentage(0);
  }, []);

  // Temporizador principal
  // Efecto principal optimizado
  useEffect(() => {
    if (!isActive) return;

    const totalPhaseTime =
      phaseDurations.inhale +
      phaseDurations.hold +
      phaseDurations.exhale +
      phaseDurations.holdAfter;

    timerRef.current = setInterval(() => {
      setTimeLeft((prevTime) => {
        const newTimeLeft = prevTime - 1;
        const newProgress = ((duration - newTimeLeft) / duration) * 100;
        setProgressPercentage(newProgress);

        const elapsedTime = duration - newTimeLeft;
        const currentPhaseTime = elapsedTime % totalPhaseTime;

        let newPhase;
        if (currentPhaseTime < phaseDurations.inhale) {
          newPhase = "inhale";
        } else if (
          currentPhaseTime <
          phaseDurations.inhale + phaseDurations.hold
        ) {
          newPhase = "hold";
        } else if (
          currentPhaseTime <
          phaseDurations.inhale + phaseDurations.hold + phaseDurations.exhale
        ) {
          newPhase = "exhale";
        } else {
          newPhase = "holdAfter";
        }

        if (newPhase !== phase) {
          setPhase(newPhase);
          if (navigator.vibrate) navigator.vibrate(50);
        }

        if (newTimeLeft <= 0) {
          clearInterval(timerRef.current);
          setIsActive(false);
          return 0;
        }

        return newTimeLeft;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [isActive, duration, phaseDurations, phase]);

  // Formatear tiempo
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Renderizar progressbar circular SVG
  const renderProgressCircle = () => {
    const radius = 140;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset =
      circumference - (progressPercentage / 100) * circumference;
    const rotation = -90; // Comienza en la parte superior (12 en punto)

    return (
      <svg
        width="300"
        height="300"
        viewBox="0 0 300 300"
        style={{
          position: "absolute",
          transform: `rotate(${rotation}deg)`,
        }}
      >
        {/* Círculo de fondo (gris) */}
        <circle
          cx="150"
          cy="150"
          r={radius}
          fill="none"
          stroke={theme.border}
          strokeWidth="10"
        />

        {/* Círculo de progreso (color primario) */}
        <circle
          cx="150"
          cy="150"
          r={radius}
          fill="none"
          stroke={theme.primary}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          transform="rotate(-90 150 150)"
          style={{
            transition: "stroke-dashoffset 1s linear",
          }}
        />
      </svg>
    );
  };

  return (
    <div style={styles.breathing.container}>
      <button
        onClick={onBack}
        style={styles.breathing.backButton}
        aria-label="Volver al menú principal"
      >
        <BackArrowIcon />
      </button>

      <div style={styles.breathing.circleContainer}>
        {/* Progressbar circular */}
        {renderProgressCircle()}

        {/* Círculo principal */}
        <motion.div
          style={styles.breathing.innerCircle}
          animate={{
            scale: PHASE_SCALES[phase],
            backgroundColor: phaseColors[phase],
          }}
          transition={getTransitionConfig(phase)}
        />
        {/* Contenedor de texto con tamaño fijo */}
        <div style={styles.breathing.textContainer}>
          <span style={styles.breathing.phaseText}>
            {phaseInstructions[phase]}
          </span>
          <div style={styles.breathing.phaseTime}>{formatTime(timeLeft)}</div>
        </div>
      </div>

      {isActive ? (
        <div style={styles.breathing.activeControls}>
          <button
            onClick={stopBreathingCycle}
            style={styles.breathing.stopButton}
          >
            Detener
          </button>
        </div>
      ) : (
        <div style={styles.breathing.controlsContainer}>
          <h2 style={styles.breathing.exerciseTitle}>{exercise.name}</h2>
          <div style={styles.breathing.controls}>
            {[1, 3, 5].map((min) => (
              <motion.button
                key={min}
                style={
                  duration === min * 60
                    ? styles.breathing.controlButtonActive
                    : styles.breathing.controlButton
                }
                onClick={() => setDuration(min * 60)}
                whileTap={{ scale: 0.95 }}
              >
                {min} min
              </motion.button>
            ))}
          </div>
          <motion.button
            style={styles.breathing.startButton}
            onClick={startBreathingCycle}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Comenzar
          </motion.button>
        </div>
      )}
    </div>
  );
};
// --- FUNCIÓN DE ESTILOS DINÁMICOS ---
const getStyles = (theme) => ({
  appContainer: {
    backgroundColor: theme.background,
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    fontFamily: "'Inter', sans-serif",
    color: theme.text,
    paddingTop: "80px",
    boxSizing: "border-box",
    position: "relative",
    overflowX: "hidden",
  },
  header: {
    container: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      height: "60px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "0 20px",
      backgroundColor: theme.background,
      zIndex: 10,
      borderBottom: `1px solid ${theme.border}`,
      boxShadow: `0 2px 10px rgba(0,0,0,0.1)`,
    },
    menuButton: {
      position: "absolute",
      left: "16px",
      background: "none",
      border: "none",
      color: theme.text,
      cursor: "pointer",
      padding: "8px",
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    titleContainer: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
    },
    title: {
      fontSize: "1.5rem",
      fontWeight: "500",
      color: theme.text,
      margin: 0,
    },
  },
  drawer: {
    container: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "280px",
      height: "100%",
      backgroundColor: theme.card,
      zIndex: 20,
      padding: "60px 20px",
      borderRight: `1px solid ${theme.border}`,
      willChange: "transform",
    },
    overlay: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0,0,0,0.5)",
      zIndex: 15,
      willChange: "opacity",
    },
    closeButton: {
      position: "absolute",
      top: "16px",
      right: "16px",
      background: "none",
      border: "none",
      color: theme.text,
      cursor: "pointer",
      padding: "8px",
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    navLink: {
      display: "block",
      width: "100%",
      padding: "16px",
      background: "none",
      border: "none",
      color: theme.text,
      fontSize: "1.1rem",
      textAlign: "left",
      borderRadius: "12px",
      cursor: "pointer",
      marginBottom: "8px",
      transition: "all 0.2s ease",
      ":hover": {
        backgroundColor: theme.primary + "20",
      },
    },
  },
  menu: {
    container: {
      textAlign: "center",
      padding: "20px",
      width: "100%",
      maxWidth: "400px",
      margin: "0 auto",
    },
    subtitle: {
      fontSize: "1rem",
      color: theme.textSecondary,
      marginBottom: "32px",
      lineHeight: 1.5,
    },
    cardGrid: {
      display: "flex",
      flexDirection: "column",
      gap: "16px",
      alignItems: "center",
    },
    card: {
      background: theme.card,
      border: `1px solid ${theme.border}`,
      borderRadius: "28px",
      padding: "24px",
      textAlign: "left",
      cursor: "pointer",
      transition: "all 0.3s ease",
      color: theme.text,
      boxShadow: `0 4px 6px rgba(0,0,0,0.1)`,
      outline: "none",
      width: "100%", // Ocupa todo el ancho disponible
      maxWidth: "350px", // Ancho máximo para las tarjetas
      ":focus": {
        boxShadow: `0 0 0 3px ${theme.primary}80`,
      },
    },
    cardIcon: {
      marginBottom: "16px",
      width: "48px",
      height: "48px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    cardTitle: {
      fontSize: "1.25rem",
      fontWeight: "500",
      margin: "0 0 8px 0",
      color: theme.text,
    },
    cardDescription: {
      fontSize: "0.9rem",
      color: theme.textSecondary,
      margin: 0,
      lineHeight: 1.5,
    },
  },
  themes: {
    container: {
      textAlign: "center",
      padding: "20px",
      width: "100%",
      maxWidth: "400px",
    },
    title: {
      fontSize: "1.75rem",
      fontWeight: "500",
      color: theme.text,
      marginBottom: "8px",
    },
    subtitle: {
      color: theme.textSecondary,
      marginBottom: "32px",
      lineHeight: 1.5,
    },
    cardGrid: {
      display: "flex",
      flexDirection: "column",
      gap: "16px",
    },
    card: {
      background: theme.card,
      border: `1px solid ${theme.border}`,
      borderRadius: "28px",
      padding: "20px",
      cursor: "pointer",
      transition: "all 0.3s ease",
      color: theme.text,
      width: "100%",
      boxShadow: `0 4px 6px rgba(0,0,0,0.1)`,
      outline: "none",
      ":focus": {
        boxShadow: `0 0 0 3px ${theme.primary}80`,
      },
    },
    cardTitle: {
      fontSize: "1.1rem",
      fontWeight: "500",
      margin: 0,
    },
  },
  help: {
    container: {
      padding: "20px",
      width: "100%",
      maxWidth: "600px",
      textAlign: "center",
    },
    title: {
      fontSize: "1.75rem",
      fontWeight: "500",
      color: theme.text,
      marginBottom: "8px",
    },
    subtitle: {
      color: theme.textSecondary,
      marginBottom: "32px",
      lineHeight: 1.5,
    },
    accordionContainer: {
      display: "flex",
      flexDirection: "column",
      gap: "12px",
    },
    accordionItem: {
      background: theme.card,
      borderRadius: "16px",
      border: `1px solid ${theme.border}`,
      overflow: "hidden",
      boxShadow: `0 2px 4px rgba(0,0,0,0.05)`,
    },
    accordionHeader: {
      width: "100%",
      padding: "20px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      background: "none",
      border: "none",
      color: theme.text,
      fontSize: "1.1rem",
      cursor: "pointer",
      textAlign: "left",
      ":focus": {
        outline: "none",
        backgroundColor: theme.primary + "10",
      },
    },
    accordionContent: {
      overflow: "hidden",
      transition: "all 0.3s ease-in-out",
      textAlign: "left",
      color: theme.textSecondary,
      lineHeight: "1.6",
      borderTop: `1px solid ${theme.border}`,
      maxHeight: "500px", // Aumenta este valor
      padding: "0 20px",
      // Nuevas propiedades para móvil:
      whiteSpace: "pre-wrap",
      wordBreak: "break-word",
      overflowY: "auto",
    },
  },
  reminders: {
    container: {
      padding: "20px",
      width: "100%",
      maxWidth: "450px",
      textAlign: "center",
    },
    title: {
      fontSize: "1.75rem",
      fontWeight: "500",
      color: theme.text,
      marginBottom: "8px",
    },
    subtitle: {
      color: theme.textSecondary,
      marginBottom: "32px",
      lineHeight: 1.5,
    },
    card: {
      background: theme.card,
      border: `1px solid ${theme.border}`,
      borderRadius: "28px",
      padding: "24px",
      display: "flex",
      flexDirection: "column",
      gap: "20px",
      boxShadow: `0 4px 6px rgba(0,0,0,0.1)`,
    },
    switchContainer: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      width: "100%",
    },
    switchLabel: {
      fontSize: "1.1rem",
      color: theme.text,
    },
    toggleButton: {
      width: "50px",
      height: "30px",
      borderRadius: "15px",
      border: "none",
      position: "relative",
      cursor: "pointer",
      outline: "none",
      padding: "0",
      transition: "background-color 0.3s ease",
    },
    toggleHandle: {
      position: "absolute",
      top: "3px",
      left: "3px",
      width: "24px",
      height: "24px",
      borderRadius: "50%",
      backgroundColor: "#fff",
      boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
    },
    timePickerContainer: {
      display: "flex",
      flexDirection: "column",
      gap: "12px",
      alignItems: "flex-start",
      overflow: "hidden",
    },
    timeLabel: {
      fontSize: "1rem",
      color: theme.text,
    },
    timeInput: {
      padding: "12px",
      borderRadius: "12px",
      border: `1px solid ${theme.border}`,
      backgroundColor: theme.background,
      color: theme.text,
      fontSize: "1rem",
      width: "100%",
      outline: "none",
      ":focus": {
        borderColor: theme.primary,
        boxShadow: `0 0 0 2px ${theme.primary}40`,
      },
    },
  },
  breathing: {
    container: {
      width: "100%",
      height: "calc(100vh - 80px)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px",
      boxSizing: "border-box",
      position: "relative",
    },
    backButton: {
      position: "absolute",
      top: "0px",
      left: "20px",
      background: "rgba(255, 255, 255, 0.1)",
      border: "none",
      color: theme.text,
      borderRadius: "50%",
      width: "44px",
      height: "44px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      zIndex: 1,
      ":hover": {
        backgroundColor: "rgba(255, 255, 255, 0.2)",
      },
    },
    circleContainer: {
      position: "relative",
      width: "300px",
      height: "300px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      marginTop: "-200px",
    },
    innerCircle: {
      position: "absolute",
      width: "120px",
      height: "120px",
      borderRadius: "50%",
      boxShadow: `0 0 25px ${theme.primary}80`, // Sombra difuminada
      filter: "drop-shadow(0 0 10px rgba(0,0,0,0.3))", // Sombra adicional
      willChange: "transform, background-color",
    },
    textContainer: {
      position: "absolute",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      width: "100%", // Ancho fijo
      height: "100%", // Alto fijo
      pointerEvents: "none",
      zIndex: 2, // Asegura que el texto esté sobre el círculo
    },

    phaseText: {
      color: "white",
      fontSize: "1.8",
      fontWeight: "600",
      marginBottom: "8px",
      textShadow: "0 2px 4px rgba(0,0,0,0.5)",
      pointerEvents: "none", // Evita que el texto interfiera con clicks
    },
    phaseTime: {
      color: "rgba(255,255,255,0.9)",
      fontSize: "1.4rem",
      fontWeight: "400",
      textShadow: "0 2px 4px rgba(0,0,0,0.2)",
      pointerEvents: "none",
    },
    progressBarContainer: {
      display: "none",
    },
    progressBar: {
      height: "100%",
      backgroundColor: "rgba(255,255,255,0.8)",
      borderRadius: "2px",
    },
    timerDisplay: {
      fontSize: "2.5rem",
      color: theme.text,
      fontWeight: "200",
      position: "absolute",
      bottom: "150px",
      left: 0,
      right: 0,
      textAlign: "center",
    },
    cyclesCounter: {
      position: "absolute",
      bottom: "120px",
      left: 0,
      right: 0,
      color: theme.textSecondary,
      fontSize: "0.9rem",
      textAlign: "center",
    },
    controlsContainer: {
      position: "absolute",
      bottom: 40,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "20px",
      width: "100%",
      padding: "0 20px",
      maxWidth: "400px",
    },
    activeControls: {
      position: "absolute",
      bottom: 40,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "20px",
      width: "100%",
      padding: "0 20px",
      maxWidth: "400px",
    },
    exerciseTitle: {
      color: theme.text,
      fontWeight: "400",
      fontSize: "1.5rem",
      margin: 0,
      textAlign: "center",
    },
    controls: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
      justifyContent: "center",
      flexWrap: "wrap",
    },
    controlButton: {
      padding: "10px 24px",
      background: theme.card,
      border: `1px solid ${theme.border}`,
      color: theme.text,
      borderRadius: "20px",
      cursor: "pointer",
      fontSize: "0.9rem",
      outline: "none",
      transition: "all 0.2s ease",
      ":hover": {
        backgroundColor: theme.primary + "20",
      },
      ":focus": {
        boxShadow: `0 0 0 3px ${theme.primary}40`,
      },
    },
    controlButtonActive: {
      padding: "10px 24px",
      background: theme.primary,
      border: "none",
      color: theme.background,
      fontWeight: "bold",
      borderRadius: "20px",
      cursor: "pointer",
      fontSize: "0.9rem",
      outline: "none",
      transition: "all 0.2s ease",
      ":hover": {
        opacity: 0.9,
      },
      ":focus": {
        boxShadow: `0 0 0 3px ${theme.primary}80`,
      },
    },
    startButton: {
      padding: "20px 70px",
      fontSize: "1.1rem",
      fontWeight: "bold",
      color: theme.background,
      background: theme.primary,
      border: "none",
      borderRadius: "24px",
      cursor: "pointer",
      marginTop: "16px",
      outline: "none",
      transition: "all 0.2s ease",
      ":hover": {
        transform: "translateY(-2px)",
        boxShadow: `0 4px 12px ${theme.primary}40`,
      },
      ":focus": {
        boxShadow: `0 0 0 3px ${theme.primary}80`,
      },
    },
    stopButton: {
      padding: "16px 40px",
      fontSize: "1rem",
      fontWeight: "bold",
      color: theme.text,
      background: "rgba(255,255,255,0.1)",
      border: `1px solid ${theme.border}`,
      borderRadius: "24px",
      cursor: "pointer",
      marginTop: "16px",
      outline: "none",
      transition: "all 0.2s ease",
      ":hover": {
        background: "rgba(255,255,255,0.2)",
      },
      ":focus": {
        boxShadow: `0 0 0 3px ${theme.primary}40`,
      },
    },
    muteButton: {
      position: "absolute",
      bottom: "20px",
      right: "20px",
      background: "rgba(255, 255, 255, 0.1)",
      border: "none",
      color: theme.text,
      borderRadius: "50%",
      width: "44px",
      height: "44px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "1.2rem",
      cursor: "pointer",
      transition: "all 0.2s ease",
      ":hover": {
        background: "rgba(255, 255, 255, 0.2)",
      },
    },
  },
});

// Inyectar estilos CSS para efectos de hover y fuentes
const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
  
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  
  body {
    font-family: 'Inter', sans-serif;
    transition: background-color 0.3s ease, color 0.3s ease;
  }
  
  button {
    cursor: pointer;
    font-family: inherit;
  }
  
  .interactive-card:hover {
    transform: translateY(-5px) scale(1.02);
    box-shadow: 0 10px 20px rgba(0,0,0,0.2);
  }
  
  .interactive-card:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(138, 136, 242, 0.5);
  }
`;

const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = globalStyles;
document.head.appendChild(styleSheet);

export default App;
