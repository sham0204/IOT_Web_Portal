import { motion } from "framer-motion";
import { Cpu, Wifi, Database, Activity } from "lucide-react";

export const FloatingDevices = () => {
  const devices = [
    { icon: Cpu, label: "ESP32", x: "10%", y: "20%", delay: 0 },
    { icon: Wifi, label: "WiFi", x: "80%", y: "15%", delay: 0.5 },
    { icon: Database, label: "Data", x: "75%", y: "60%", delay: 1 },
    { icon: Activity, label: "Sensors", x: "15%", y: "65%", delay: 1.5 },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Circuit pattern background */}
      <div className="absolute inset-0 circuit-pattern opacity-30" />
      
      {/* Gradient orbs */}
      <motion.div
        className="absolute w-96 h-96 rounded-full bg-primary/20 blur-3xl"
        style={{ left: "20%", top: "30%" }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute w-80 h-80 rounded-full bg-secondary/20 blur-3xl"
        style={{ right: "15%", top: "20%" }}
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.4, 0.2, 0.4],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute w-64 h-64 rounded-full bg-accent/15 blur-3xl"
        style={{ left: "50%", bottom: "20%" }}
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Floating device icons */}
      {devices.map((device, index) => (
        <motion.div
          key={index}
          className="absolute glass-card p-4 rounded-2xl"
          style={{ left: device.x, top: device.y }}
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: 1,
            y: [0, -15, 0],
          }}
          transition={{
            opacity: { delay: device.delay, duration: 0.5 },
            y: {
              delay: device.delay,
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            },
          }}
        >
          <device.icon className="w-8 h-8 text-secondary" />
          <span className="text-xs text-muted-foreground mt-1 block">{device.label}</span>
        </motion.div>
      ))}

      {/* Connection lines */}
      <svg className="absolute inset-0 w-full h-full" style={{ zIndex: -1 }}>
        <motion.path
          d="M 150 200 Q 400 150 700 300"
          stroke="url(#gradient1)"
          strokeWidth="1"
          fill="none"
          strokeDasharray="5,5"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.3 }}
          transition={{ duration: 2, delay: 1 }}
        />
        <motion.path
          d="M 200 500 Q 500 400 800 450"
          stroke="url(#gradient2)"
          strokeWidth="1"
          fill="none"
          strokeDasharray="5,5"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.3 }}
          transition={{ duration: 2, delay: 1.5 }}
        />
        <defs>
          <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(233, 100%, 52%)" />
            <stop offset="100%" stopColor="hsl(187, 100%, 50%)" />
          </linearGradient>
          <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(187, 100%, 50%)" />
            <stop offset="100%" stopColor="hsl(156, 100%, 50%)" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};
