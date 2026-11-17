
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children }) {
    const { isAuthenticated, user, logout } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    const initial = user?.name?.charAt(0).toUpperCase() || "U";

    return (
        <>
            <div className="vintage-userbar">
                <div className="vintage-user-profile">
                    <div className="vintage-user-avatar">
                        {initial}
                    </div>

                    <div className="vintage-user-details">
                        <span className="vintage-user-label">
                            SIGNED IN AS
                        </span>

                        <span className="vintage-user-name">
                            {user?.name || "User"}
                        </span>
                    </div>
                </div>

                <button
                    className="vintage-logout-btn"
                    onClick={logout}
                >
                    Logout
                    <span>↗</span>
                </button>
            </div>

            {children}
        </>
    );
}

export default ProtectedRoute;
