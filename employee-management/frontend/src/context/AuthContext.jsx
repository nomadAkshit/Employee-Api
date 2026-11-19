
import {
    createContext,
    useContext,
    useEffect,
    useState
} from "react";

const AuthContext = createContext(null);

const API_URL = "http://localhost:5000/api/auth";

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Check existing cookie session
    async function checkAuth() {
        try {
            const response = await fetch(`${API_URL}/me`, {
                method: "GET",
                credentials: "include"
            });

            if (!response.ok) {
                setUser(null);
                return;
            }

            const data = await response.json();
            setUser(data.user);

        } catch (error) {
            console.error("Authentication check failed:", error);
            setUser(null);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        checkAuth();
    }, []);

    // Signup
    async function signup(name, email, password) {
        const response = await fetch(`${API_URL}/signup`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify({
                name,
                email,
                password
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Signup failed");
        }

        setUser(data.user);
        return data;
    }

    // Login
    async function login(email, password) {
        const response = await fetch(`${API_URL}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify({
                email,
                password
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Login failed");
        }

        setUser(data.user);
        return data;
    }

    // Logout
    async function logout() {
        try {
            const response = await fetch(`${API_URL}/logout`, {
                method: "POST",
                credentials: "include"
            });

            if (!response.ok) {
                throw new Error("Logout failed");
            }

            setUser(null);

        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                signup,
                login,
                logout,
                checkAuth,
                isAuthenticated: Boolean(user)
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
