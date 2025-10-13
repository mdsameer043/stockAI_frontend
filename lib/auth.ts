export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem("token")
}

export function getUserFromToken(token: string | null) {
  if (!token) return null

  try {
    const decoded = JSON.parse(Buffer.from(token, "base64").toString())

    // Check if token is expired
    if (decoded.exp && decoded.exp < Date.now()) {
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
