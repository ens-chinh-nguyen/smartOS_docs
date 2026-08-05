import Link from "next/link";
import {
  Key,
  Wrench,
  ArrowRight,
  ShieldCheck,
  FileText,
  Layers,
  Cpu,
  Clock,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 px-6 md:py-24 max-w-6xl mx-auto text-center w-full">
        {/* Background Accent Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-fd-primary/10 rounded-full blur-3xl pointer-events-none -z-10" />

        {/* SmartOS Internal Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-fd-primary/10 text-fd-primary dark:text-fd-primary border border-fd-primary/20 mb-6">
          <ShieldCheck className="w-4 h-4" />
          <span>SmartOS Internal Documentation Portal</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
          SmartOS{" "}
          <span className="text-fd-primary underline decoration-fd-primary/40 decoration-wavy underline-offset-8">
            Technical Docs
          </span>
        </h1>

        <p className="text-lg md:text-xl text-neutral-600 dark:text-neutral-400 max-w-3xl mx-auto mb-10 leading-relaxed">
          Centralized documentation portal for system architecture, API
          specifications, and operational workflows for two core independent
          modules:{" "}
          <span className="font-semibold text-neutral-800 dark:text-neutral-200">
            Access Management
          </span>{" "}
          and{" "}
          <span className="font-semibold text-neutral-800 dark:text-neutral-200">
            Maintenance Management
          </span>
          .
        </p>

        {/* CTA Button */}
        <div className="flex justify-center">
          <Link
            href="/docs"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium bg-fd-primary hover:bg-fd-primary/90 text-neutral-950 shadow-md hover:shadow-fd-primary/20 transition-all duration-200"
          >
            <span>Explore Documentation</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Core Modules Grid */}
      <section className="py-12 px-6 max-w-6xl mx-auto w-full">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-3">
            Product Modules Catalog
          </h2>
          <p className="text-neutral-500 dark:text-neutral-400">
            Select a module to access integration guides, workflows, and API
            specifications
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Card 1: Access Management */}
          <div className="group relative rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-8 shadow-sm hover:shadow-xl hover:border-fd-primary/50 transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-fd-primary/10 text-fd-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Key className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                Access Management Module
                <span className="text-xs px-2 py-0.5 rounded bg-fd-primary/10 text-fd-primary dark:text-fd-primary border border-fd-primary/20 font-normal">
                  New
                </span>
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400 text-sm mb-6 leading-relaxed">
                Enterprise access control solution for building entry, granular
                permission management, IoT device integrations (Smart Locks, QR
                Codes, RFID Cards, Biometrics), and real-time access logging.
              </p>

              <div className="space-y-2 mb-8">
                <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
                  <Cpu className="w-4 h-4 text-fd-primary shrink-0" />
                  <span>IoT Access Devices Configuration & Integration</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
                  <ShieldCheck className="w-4 h-4 text-fd-primary shrink-0" />
                  <span>
                    Granular Access Permissions by Floor / Room / Building
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
                  <Clock className="w-4 h-4 text-fd-primary shrink-0" />
                  <span>API Unlocking & Real-time Access Event Logs</span>
                </div>
              </div>
            </div>

            <Link
              href="/docs"
              className="inline-flex items-center justify-between w-full px-4 py-2.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 group-hover:bg-fd-primary group-hover:text-neutral-950 text-sm font-semibold transition-colors duration-200"
            >
              <span>Explore Access Management Docs</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Card 2: Maintenance Management */}
          <div className="group relative rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-8 shadow-sm hover:shadow-xl hover:border-fd-primary/50 transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-fd-primary/10 text-fd-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Wrench className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                Maintenance Management Module
                <span className="text-xs px-2 py-0.5 rounded bg-fd-primary/10 text-fd-primary dark:text-fd-primary border border-fd-primary/20 font-normal">
                  New
                </span>
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400 text-sm mb-6 leading-relaxed">
                End-to-end technical incident management, preventive maintenance
                scheduling, maintenance ticket tracking, and automated
                technician dispatching.
              </p>

              <div className="space-y-2 mb-8">
                <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
                  <FileText className="w-4 h-4 text-fd-primary shrink-0" />
                  <span>Incident Ticket Workflows & Service Requests</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
                  <Clock className="w-4 h-4 text-fd-primary shrink-0" />
                  <span>Preventive Equipment Maintenance Scheduling</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
                  <Layers className="w-4 h-4 text-fd-primary shrink-0" />
                  <span>Technician Dispatching & Status Reporting</span>
                </div>
              </div>
            </div>

            <Link
              href="/docs"
              className="inline-flex items-center justify-between w-full px-4 py-2.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 group-hover:bg-fd-primary group-hover:text-neutral-950 text-sm font-semibold transition-colors duration-200"
            >
              <span>Explore Maintenance Docs</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer Branding Banner */}
      <footer className="py-6 px-6 border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-center text-xs text-neutral-500 dark:text-neutral-400 mt-auto">
        <p>
          © {new Date().getFullYear()} SmartOS Solutions. Internal Documentation
          Portal.
        </p>
      </footer>
    </div>
  );
}
