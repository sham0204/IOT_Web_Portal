import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { FloatingDevices } from "@/components/FloatingDevices";
import { AnimatedLetters, AnimatedText } from "@/components/AnimatedText";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ArrowRight, Cpu, Shield, Zap, BarChart3, Layers, Globe, Wifi, Server, Monitor, Settings, Bell, Lock, Cloud, Smartphone, Activity, Database, Cog } from "lucide-react";

const features = [
  {
    icon: Activity,
    title: "Real-Time Device Monitoring",
    description: "Monitor your connected devices in real time with ultra-low latency data updates. Live sensor data streaming, automatic dashboard refresh, millisecond-level response times, multi-device monitoring support.",
  },
  {
    icon: Wifi,
    title: "Seamless Device Connectivity",
    description: "Connect IoT devices effortlessly using industry-standard communication protocols. Plug-and-play device onboarding, Wi-Fi & MQTT based connectivity, supports ESP32, Arduino, Raspberry Pi & custom devices, flexible API-based data ingestion.",
  },
  {
    icon: Monitor,
    title: "Interactive Data Visualization",
    description: "Transform raw sensor data into meaningful insights using rich visual dashboards. Dynamic charts & graphs, historical data trends, real-time analytics panels, customizable widgets.",
  },
  {
    icon: Settings,
    title: "Device Management",
    description: "Manage your IoT ecosystem from a single centralized platform. Add, update, or remove devices, monitor device health & status, remote device control (future support), device logs & activity tracking.",
  },
  {
    icon: Bell,
    title: "Smart Alerts & Notifications",
    description: "Get notified instantly when something needs your attention. Threshold-based alerts, real-time notifications, email & push notification support, custom alert rules per device.",
  },
  {
    icon: Lock,
    title: "Security & Authentication",
    description: "Built with security-first principles to protect your data and devices. Secure user authentication, role-based access control, encrypted data communication, secure API access.",
  },
  {
    icon: Cloud,
    title: "Scalable Cloud Architecture",
    description: "SmartDrishti is designed to scale as your IoT network grows. Cloud-ready infrastructure, handles thousands of devices, high availability & reliability, easy integration with cloud services.",
  },
  {
    icon: Smartphone,
    title: "Responsive & Modern UI",
    description: "Access SmartDrishti from any device with a smooth user experience. Mobile-friendly design, dark & modern UI theme, fast, intuitive navigation, optimized performance.",
  },
  {
    icon: Cog,
    title: "Extensible & Developer-Friendly",
    description: "Designed for developers and innovators. Modular architecture, API-first approach, easy to extend with new features, well-structured documentation.",
  },
];

const upcomingFeatures = [
  {
    icon: Activity,
    title: "AI-based Anomaly Detection",
    description: "Identify unusual patterns and anomalies in your IoT data using artificial intelligence algorithms.",
  },
  {
    icon: Settings,
    title: "Predictive Maintenance",
    description: "Predict when devices or systems are likely to fail before it happens, reducing downtime.",
  },
  {
    icon: Server,
    title: "OTA Firmware Updates",
    description: "Remotely update device firmware without physical access to the devices.",
  },
  {
    icon: Smartphone,
    title: "Mobile Applications",
    description: "Native Android and iOS applications for on-the-go IoT monitoring and management.",
  },
];

const documentationSections = [
  {
    title: "What is SmartDrishti?",
    content: `SmartDrishti is a modern, real-time IoT monitoring and device integration platform designed to help users seamlessly connect, monitor, and analyze data from IoT devices.

It provides a centralized dashboard to visualize live sensor data, manage connected devices, and gain actionable insights — all with a secure, scalable, and user-friendly interface.

SmartDrishti is ideal for:
- Smart homes & smart cities
- Industrial IoT (IIoT)
- Academic & research projects
- Prototyping and real-world deployments

Vision: To enable a smarter, connected world through real-time visibility and intelligent monitoring.`
  },
  {
    title: "Supported Devices",
    content: `SmartDrishti is built to be device-agnostic and easily extensible.

Currently Supported:
- ESP32 (Wi-Fi enabled microcontrollers)
- Arduino (with Wi-Fi modules)
- Raspberry Pi
- Custom IoT devices with HTTP / MQTT support

Supported Communication Protocols:
- Wi-Fi
- MQTT
- REST APIs

Supported Sensors (examples):
- Temperature & Humidity sensors
- Motion & proximity sensors
- Gas & air-quality sensors
- Light, pressure & vibration sensors

New devices and sensors can be added without changing the core platform.`
  },
  {
    title: "System Requirements",
    content: `Frontend (User Interface):
- Node.js: v18+ (LTS recommended)
- Package Manager: npm or yarn
- Browser: Chrome, Edge, Firefox (latest versions)

Backend (if applicable):
- REST API / MQTT broker
- Cloud or local server support
- Database (SQL / NoSQL – configurable)

Device Side:
- Wi-Fi enabled IoT device
- Stable internet connection
- Sensor modules as per use case`
  }
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background overflow-hidden">
      <Header />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20">
        <FloatingDevices />
        
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <span className="inline-block px-4 py-2 rounded-full bg-primary/10 border border-primary/30 text-sm text-primary font-medium">
              IoT Monitoring Platform
            </span>
          </motion.div>

          <h1 className="text-5xl md:text-7xl font-heading font-bold mb-6">
            <AnimatedLetters text="SmartDrishti" className="gradient-text" delay={0.3} />
          </h1>
          
          <AnimatedText
            text="A smart vision for real-time IoT monitoring & device integration"
            className="text-xl md:text-2xl text-muted-foreground justify-center max-w-2xl mx-auto"
            delay={0.8}
          />

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center mt-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.5 }}
          >
            <Button variant="hero" size="xl" asChild>
              <Link to="/signup">
                Get Started
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button variant="hero-outline" size="xl" asChild>
              <Link to="/projects">
                Explore Platform
              </Link>
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            className="grid grid-cols-3 gap-8 mt-20 max-w-lg mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 0.5 }}
          >
            {[
              { value: "10K+", label: "Devices" },
              { value: "99.9%", label: "Uptime" },
              { value: "50ms", label: "Latency" },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <p className="text-3xl font-heading font-bold gradient-text">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-2">
            <motion.div
              className="w-1.5 h-1.5 rounded-full bg-primary"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6 relative">
        <div className="absolute inset-0 hero-gradient opacity-50" />
        
        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
              Powerful Features for <span className="gradient-text">IoT Excellence</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Everything you need to build, monitor, and scale your IoT projects.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="glass-card-hover h-full">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mb-4">
                      <feature.icon className="w-6 h-6 text-secondary" />
                    </div>
                    <h3 className="text-lg font-heading font-semibold mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Features Section */}
      <section className="py-24 px-6 relative">
        <div className="absolute inset-0 hero-gradient opacity-50" />
        
        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
              Future-Ready Capabilities <span className="gradient-text">(Coming Soon)</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Exciting features planned to enhance your IoT experience.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {upcomingFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="glass-card-hover h-full">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mb-4">
                      <feature.icon className="w-6 h-6 text-secondary" />
                    </div>
                    <h3 className="text-lg font-heading font-semibold mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Documentation Section */}
      <section className="py-24 px-6 relative">
        <div className="absolute inset-0 hero-gradient opacity-50" />
        
        <div className="max-w-4xl mx-auto relative z-10">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
              <span className="gradient-text">Documentation</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Learn more about SmartDrishti platform and its capabilities.
            </p>
          </motion.div>

          <div className="space-y-4">
            <Accordion type="single" collapsible className="w-full">
              {documentationSections.map((doc, index) => (
                <AccordionItem value={`item-${index}`} key={index}>
                  <AccordionTrigger className="text-lg font-semibold">
                    {doc.title}
                  </AccordionTrigger>
                  <AccordionContent>
                    <pre className="whitespace-pre-wrap text-sm text-muted-foreground p-4 bg-muted rounded-lg">
                      {doc.content}
                    </pre>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <motion.div
          className="max-w-4xl mx-auto text-center glass-card p-12 md:p-16"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
            Ready to Transform Your IoT Projects?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Join thousands of developers and makers who trust SmartDrishti for their IoT monitoring needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="hero" size="lg" asChild>
              <Link to="/signup">Start Free Trial</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/projects">View Demo Projects</Link>
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Cpu className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-heading font-semibold">SmartDrishti</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2024 SmartDrishti. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
