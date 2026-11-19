
function EmploymentBond({
    bondApplicable,
    setBondApplicable,
    bondStartDate,
    setBondStartDate,
    bondEndDate,
    setBondEndDate,
    bondAmount,
    setBondAmount,
}) {
    return (
        <div className="profile-section">

            <div className="profile-section-header">
                <span>04</span>
                <h3>Employment Bond</h3>
            </div>

            <label className="bond-toggle">
                <input
                    type="checkbox"
                    checked={bondApplicable}
                    onChange={(e) => {
                        setBondApplicable(e.target.checked);
                    }}
                />

                <span>Employment bond applicable</span>
            </label>

            {bondApplicable && (
                <div className="profile-grid bond-fields">

                    {/* Bond Start Date */}
                    <div className="form-group">
                        <label>Bond Start Date</label>
                        <input
                            type="date"
                            value={bondStartDate}
                            onChange={(e) =>
                                setBondStartDate(e.target.value)
                            }
                        />
                    </div>

                    {/* Bond End Date */}
                    <div className="form-group">
                        <label>Bond End Date</label>
                        <input
                            type="date"
                            value={bondEndDate}
                            onChange={(e) =>
                                setBondEndDate(e.target.value)
                            }
                            min={bondStartDate || undefined}
                        />
                    </div>

                    {/* Bond Amount */}
                    <div className="form-group">
                        <label>Bond Amount (₹)</label>
                        <input
                            type="number"
                            min="0"
                            placeholder="Enter bond amount"
                            value={bondAmount}
                            onChange={(e) =>
                                setBondAmount(e.target.value)
                            }
                        />
                    </div>

                </div>
            )}
        </div>
    );
}

export default EmploymentBond;
