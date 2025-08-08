import React, { useState, useEffect, useContext, useRef } from 'react';
import { ThemeContext } from '../App'; // Asegúrate de que la ruta sea correcta
import { motion } from 'framer-motion';

const RemindersScreen = () => {
    const { theme } = useContext(ThemeContext);
    const styles = getStyles(theme);
    const [remindersEnabled, setRemindersEnabled] = useState(false);
    const [reminderTime, setReminderTime] = useState('08:00');
    const [permissionStatus, setPermissionStatus] = useState('default');
    const checkInterval = useRef(null);

    // 1. Cargar configuración guardada y verificar permisos
    useEffect(() => {
        // Cargar estado guardado
        const savedEnabled = localStorage.getItem('remindersEnabled') === 'true';
        const savedTime = localStorage.getItem('reminderTime') || '08:00';
        setRemindersEnabled(savedEnabled);
        setReminderTime(savedTime);

        // Verificar estado de permisos
        if ('Notification' in window) {
            setPermissionStatus(Notification.permission);
        }

        // Configurar el verificador periódico
        setupTimeChecker();

        // Limpieza al desmontar
        return () => {
            if (checkInterval.current) {
                clearInterval(checkInterval.current);
            }
        };
    }, []);

    // 2. Configurar el verificador de tiempo
    const setupTimeChecker = () => {
        // Limpiar intervalo existente
        if (checkInterval.current) {
            clearInterval(checkInterval.current);
        }

        // Configurar nuevo intervalo (verifica cada minuto)
        checkInterval.current = setInterval(() => {
            const now = new Date();
            const [hours, minutes] = reminderTime.split(':').map(Number);
            
            if (now.getHours() === hours && now.getMinutes() === minutes) {
                showNotification();
            }
        }, 60000); // 60,000 ms = 1 minuto
    };

    // 3. Mostrar notificación
    const showNotification = () => {
        // Si tenemos Service Worker (PWA)
        if ('serviceWorker' in navigator && 'PushManager' in window) {
            navigator.serviceWorker.ready.then(registration => {
                registration.showNotification('Recordatorio de Serenidad', {
                    body: 'Es hora de tu práctica de respiración diaria',
                    icon: '/logo192.png',
                    vibrate: [200, 100, 200],
                    badge: '/logo192.png'
                });
            });
        } 
        // Fallback a Notificación API
        else if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('Recordatorio de Serenidad', {
                body: 'Es hora de tu práctica de respiración diaria',
                icon: '/logo192.png'
            });
        }
    };

    // 4. Manejar cambio en recordatorios
    const toggleReminders = async () => {
        if (!remindersEnabled) {
            const granted = await requestNotificationPermission();
            if (!granted) return;
        }

        const newValue = !remindersEnabled;
        setRemindersEnabled(newValue);
        localStorage.setItem('remindersEnabled', newValue.toString());

        if (newValue) {
            setupTimeChecker();
            showNotification(); // Notificación de confirmación
        } else {
            clearInterval(checkInterval.current);
        }
    };

    // 5. Solicitar permisos
    const requestNotificationPermission = async () => {
        if (!('Notification' in window)) {
            alert('Tu navegador no soporta notificaciones');
            return false;
        }

        if (Notification.permission === 'denied') {
            alert('Por favor habilita las notificaciones manualmente en la configuración de tu navegador');
            return false;
        }

        const permission = await Notification.requestPermission();
        setPermissionStatus(permission);
        return permission === 'granted';
    };

    // 6. Manejar cambio de hora
    const handleTimeChange = (e) => {
        const newTime = e.target.value;
        setReminderTime(newTime);
        localStorage.setItem('reminderTime', newTime);

        if (remindersEnabled) {
            setupTimeChecker();
        }
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>Recordatorios Diarios</h2>
            <p style={styles.subtitle}>Establece un recordatorio para no olvidar tu práctica diaria.</p>
            
            <div style={styles.card}>
                <div style={styles.switchContainer}>
                    <span style={styles.switchLabel}>Recordatorios activados</span>
                    <button 
                        style={{
                            ...styles.toggleButton,
                            backgroundColor: remindersEnabled ? theme.primary : theme.border,
                            opacity: permissionStatus === 'denied' ? 0.5 : 1
                        }}
                        onClick={toggleReminders}
                        disabled={permissionStatus === 'denied'}
                        aria-label={remindersEnabled ? 'Desactivar recordatorios' : 'Activar recordatorios'}
                    >
                        <motion.div
                            style={styles.toggleHandle}
                            animate={{ x: remindersEnabled ? 20 : 0 }}
                            transition={{ type: 'spring', stiffness: 700, damping: 30 }}
                        />
                    </button>
                </div>

                {permissionStatus === 'denied' && (
                    <p style={styles.warningText}>
                        Has bloqueado las notificaciones. Por favor habilítalas manualmente en la configuración de tu navegador.
                    </p>
                )}

                {remindersEnabled && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        transition={{ duration: 0.3 }}
                        style={styles.timePickerContainer}
                    >
                        <label htmlFor="reminder-time" style={styles.timeLabel}>
                            Hora del recordatorio:
                        </label>
                        <input
                            type="time"
                            id="reminder-time"
                            value={reminderTime}
                            onChange={handleTimeChange}
                            style={styles.timeInput}
                        />
                        <p style={styles.hintText}>
                            Recibirás una notificación a esta hora cada día
                        </p>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

// Estilos (debes implementar getStyles según tu tema)
const getStyles = (theme) => ({
    container: {
        padding: '20px',
        width: '100%',
        maxWidth: '450px',
        textAlign: 'center'
    },
    title: {
        fontSize: '1.75rem',
        fontWeight: '500',
        color: theme.text,
        marginBottom: '8px'
    },
    subtitle: {
        color: theme.textSecondary,
        marginBottom: '32px',
        lineHeight: 1.5
    },
    card: {
        background: theme.card,
        border: `1px solid ${theme.border}`,
        borderRadius: '28px',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        boxShadow: `0 4px 6px rgba(0,0,0,0.1)`
    },
    switchContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%'
    },
    switchLabel: {
        fontSize: '1.1rem',
        color: theme.text
    },
    toggleButton: {
        width: '50px',
        height: '30px',
        borderRadius: '15px',
        border: 'none',
        position: 'relative',
        cursor: 'pointer',
        outline: 'none',
        padding: '0',
        transition: 'background-color 0.3s ease'
    },
    toggleHandle: {
        position: 'absolute',
        top: '3px',
        left: '3px',
        width: '24px',
        height: '24px',
        borderRadius: '50%',
        backgroundColor: '#fff',
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
    },
    timePickerContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        alignItems: 'flex-start',
        overflow: 'hidden'
    },
    timeLabel: {
        fontSize: '1rem',
        color: theme.text
    },
    timeInput: {
        padding: '12px',
        borderRadius: '12px',
        border: `1px solid ${theme.border}`,
        backgroundColor: theme.background,
        color: theme.text,
        fontSize: '1rem',
        width: '100%',
        outline: 'none',
        ':focus': {
            borderColor: theme.primary,
            boxShadow: `0 0 0 2px ${theme.primary}40`
        }
    },
    hintText: {
        fontSize: '0.8rem',
        color: theme.textSecondary,
        marginTop: '8px'
    },
    warningText: {
        color: '#f87171',
        fontSize: '0.9rem',
        marginTop: '8px'
    }
});

export default RemindersScreen;