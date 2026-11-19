
function PermanentAddress({ permanentAddress, setPermanentAddress }) {

    function updateAddress(field, value) {
        setPermanentAddress((prev) => ({
            ...prev,
            [field]: value
        }));
    }

    return (
        <div className="permanent-address-section">

            <h4 className="profile-subheading">
                Permanent Address
            </h4>

            <div className="profile-grid">

                {/* Street Address */}
                <div className="form-group profile-full-width">
                    <label>Street Address</label>
                    <input
                        type="text"
                        placeholder="Enter street address"
                        value={permanentAddress.street}
                        maxLength={150}
                        onChange={(e) =>
                            updateAddress("street", e.target.value)
                        }
                    />
                </div>

                {/* City */}
                <div className="form-group">
                    <label>City</label>
                    <input
                        type="text"
                        placeholder="Enter city"
                        value={permanentAddress.city}
                        maxLength={50}
                        onChange={(e) => {
                            const value = e.target.value;

                            if (/^[a-zA-Z\s-]*$/.test(value)) {
                                updateAddress("city", value);
                            }
                        }}
                    />
                </div>

                {/* State */}
                <div className="form-group">
                    <label>State</label>
                    <input
                        type="text"
                        placeholder="Enter state"
                        value={permanentAddress.state}
                        maxLength={50}
                        onChange={(e) => {
                            const value = e.target.value;

                            if (/^[a-zA-Z\s-]*$/.test(value)) {
                                updateAddress("state", value);
                            }
                        }}
                    />
                </div>

                {/* Pincode */}
                <div className="form-group">
                    <label>Pincode</label>
                    <input
                        type="text"
                        inputMode="numeric"
                        placeholder="Enter 6-digit pincode"
                        value={permanentAddress.pincode}
                        maxLength={6}
                        onChange={(e) => {
                            const value = e.target.value
                                .replace(/\D/g, "")
                                .slice(0, 6);

                            updateAddress("pincode", value);
                        }}
                    />
                </div>

            </div>
        </div>
    );
}

export default PermanentAddress;
