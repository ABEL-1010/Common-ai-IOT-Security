"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { KeyRound } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { demoCredentials, isDemoLogin } from "@/lib/demo-auth"

export function LoginCard() {
  const router = useRouter()
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [error, setError] = React.useState(false)

  function fillDemo() {
    setEmail(demoCredentials.email)
    setPassword(demoCredentials.password)
    setError(false)
  }

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (isDemoLogin(email, password)) {
      router.push("/dashboard")
    } else {
      setError(true)
    }
  }

  return (
    <Card className="w-full rounded-2xl">
      <CardHeader>
        <CardTitle>Sign in</CardTitle>
        <CardDescription>Open the security operations dashboard.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <Input
              id="email"
              type="email"
              autoComplete="off"
              value={email}
              aria-invalid={error}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <Input
              id="password"
              type="password"
              autoComplete="off"
              value={password}
              aria-invalid={error}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>
          {error ? (
            <p role="alert" className="text-sm text-destructive">
              Those details don&apos;t match the demo account.
            </p>
          ) : null}
          <Button type="submit" className="w-full">
            Sign in
          </Button>
        </form>

        <div className="space-y-3 rounded-xl border bg-muted/40 p-4">
          <div className="flex items-center gap-2 text-sm font-medium">
            <KeyRound className="size-4 text-primary" aria-hidden />
            Demo account
          </div>
          <dl className="space-y-1 font-mono text-xs">
            <div className="flex flex-wrap justify-between gap-x-3">
              <dt className="text-muted-foreground">Email</dt>
              <dd className="break-all">{demoCredentials.email}</dd>
            </div>
            <div className="flex flex-wrap justify-between gap-x-3">
              <dt className="text-muted-foreground">Password</dt>
              <dd>{demoCredentials.password}</dd>
            </div>
          </dl>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-full"
            onClick={fillDemo}
          >
            Use demo account
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
