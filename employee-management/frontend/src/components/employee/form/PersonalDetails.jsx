
import PermanentAddress from "./PermanentAddress.jsx";
import ProfilePhotoUpload from "./ProfilePhotoUpload.jsx";

function PersonalDetails({
    phone,
    setPhone,
    dateOfBirth,
    setDateOfBirth,
    gender,
    setGender,
    permanentAddress,
    setPermanentAddress,
    profilePhotoPreview,
    setProfilePhotoFile,
}) {
    const today = new Date().toISOString().split("T")[0];

    return (
        <div className="profile-section">

            <div className="profile-section-header">
                <span>02</span>
                <h3>Personal Details</h3>
            </div>

            <ProfilePhotoUpload
                profilePhotoPreview={profilePhotoPreview}
                setProfilePhotoFile={setProfilePhotoFile}
            />

            <div className="profile-grid">

                {/* Phone Number */}
                <div className="form-group">
                    <label>Phone Number</label>
                    <input
                        type="tel"
                        inputMode="numeric"
                        placeholder="Enter 10-digit phone number"
                        value={phone}
                        maxLength={10}
                        onChange={(e) => {
                            const value = e.target.value
                                .replace(/\D/g, "")
                                .slice(0, 10);

                            setPhone(value);
                        }}
                    />
                </div>

                {/* Date of Birth */}
                <div className="form-group">
                    <label>Date of Birth</label>
                    <input
                        type="date"
                        value={dateOfBirth}
                        max={today}
                        onChange={(e) => setDateOfBirth(e.target.value)}
                    />
                </div>

                {/* Gender */}
                <div className="form-group">
                    <label>Gender</label>
                    <select
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                    >
                        <option value="">Select gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                </div>

            </div>

            <PermanentAddress
                permanentAddress={permanentAddress}
                setPermanentAddress={setPermanentAddress}
            />

        </div>
    );
}

export default PersonalDetails;
