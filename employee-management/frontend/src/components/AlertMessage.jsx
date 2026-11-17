function AlertMessage({ error, success, activeTab, setActiveTab }) {
    return (
        <>
            {error && (
                <p className="alert alert-error">{error}</p>
            )}

            {success && (
                <div className="alert alert-success">
                    <span>{success}</span>

                    {activeTab === "register" && (
                        <button
                            type="button"
                            className="alert-btn"
                            onClick={() => setActiveTab("directory")}
                        >
                            View in Directory →
                        </button>
                    )}
                </div>
            )}
        </>
    );
}

export default AlertMessage;