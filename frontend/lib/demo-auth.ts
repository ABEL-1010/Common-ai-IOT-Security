/**
 * Sample login for the hackathon demo. Not a real account: the check runs in
 * the browser, nothing is sent anywhere and dashboard routes are not protected.
 */
export const demoCredentials = {
  email: "operator@sentinelai.example",
  password: "Sentinel!Demo2026",
}

export function isDemoLogin(email: string, password: string) {
  return (
    email.trim().toLowerCase() === demoCredentials.email &&
    password === demoCredentials.password
  )
}
