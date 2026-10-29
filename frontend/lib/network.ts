import type { CompanyNetwork } from "@/lib/types"

function ipToInt(ip: string) {
  return ip
    .split(".")
    .reduce((acc, octet) => (acc << 8) + Number(octet), 0) >>> 0
}

/** True when an IPv4 address falls inside a CIDR block, e.g. 10.20.0.0/16. */
export function inCidr(ip: string, cidr: string) {
  const [base, bits] = cidr.split("/")
  const mask = Number(bits) === 0 ? 0 : (~0 << (32 - Number(bits))) >>> 0
  return (ipToInt(ip) & mask) === (ipToInt(base) & mask)
}

/** Returns the company network an IP belongs to, or undefined if outside. */
export function matchCompanyNetwork(ip: string, networks: CompanyNetwork[]) {
  return networks.find((n) => inCidr(ip, n.cidr))
}
