import {jwtDecode} from "jwt-decode"

export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem("token")
}

export function getUserFromToken(token: string | null) {
  if (!token) return null
  try {
    const decoded: any = jwtDecode(token)
    if (decoded.exp && decoded.exp * 1000 < Date.now()) {
      localStorage.removeItem("token")
      return null
    }
    return decoded
  } catch {
    return null
  }
}

export function logout() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token")
    window.location.href = "/login"
  }
}

export function requireAuth() {
  if (typeof window !== "undefined") {
    const token = getAuthToken()
    const user = getUserFromToken(token)
    if (!user) {
      window.location.href = "/login"
      return null
    }
    return user
  }
  return null
}
