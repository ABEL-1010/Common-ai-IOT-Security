import type { Metadata } from "next"
import { BrainCircuit, Crosshair, ShieldHalf, Wrench } from "lucide-react"

import { LoginCard } from "@/components/landing/login-card"
import { ThemeToggle } from "@/components/dashboard/theme-toggle"

export const metadata: Metadata = {
  title: "SentinelAI — IoT / OT Defense",
}

const FEATURES = [
  {
    icon: Crosshair,
    title: "Red Team agent",
    description: "Attacks your own devices to find holes before hackers do.",
  },
  {
    icon: BrainCircuit,
    title: "AI anomaly detection",
    description: "Learns normal device behaviour and flags what rules miss.",
  },
  {
    icon: Wrench,
    title: "Automatic response",
    description: "Restores settings, locks accounts and blocks unknown IPs.",
  },
]

export default function LandingPage() {
  return (
    <div className="flex min-h-svh flex-col">
      <header className="flex items-center justify-between px-4 py-4 sm:px-8">
        <div className="flex items-center gap-3">
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <ShieldHalf className="size-4" aria-hidden />
          </span>
          <span className="font-semibold">SentinelAI</span>
        </div>
        <ThemeToggle />
      </header>

      <main className="mx-auto grid w-full max-w-6xl flex-1 items-center gap-10 px-4 py-8 sm:px-8 lg:grid-cols-[1fr_24rem] lg:gap-16">
        <section className="space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
              Protect the devices nobody audits
            </h1>
            <p className="max-w-xl text-lg leading-8 text-muted-foreground">
              Fridges, freezers and HVAC hold no financial data, so security
              audits skip them. One attack can still spoil a whole store&apos;s
              stock. SentinelAI finds the holes and stops the attack.
            </p>
          </div>

          <ul className="space-y-4">
            {FEATURES.map((feature) => (
              <li key={feature.title} className="flex gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                  <feature.icon className="size-4" aria-hidden />
                </span>
                <div>
                  <div className="font-medium">{feature.title}</div>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <LoginCard />
      </main>
    </div>
  )
}
