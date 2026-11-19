
function ProfilePhotoUpload({
    profilePhotoPreview,
    setProfilePhotoFile,
}) {
    function handlePhotoChange(e) {
        const file = e.target.files?.[0];

        if (!file) return;

        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp",
        ];

        if (!allowedTypes.includes(file.type)) {
            alert("Please select a JPG, PNG or WEBP image.");
            e.target.value = "";
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            alert("Image size must be less than 5 MB.");
            e.target.value = "";
            return;
        }

        setProfilePhotoFile(file);
    }

    return (
        <div className="profile-photo-upload">

            <div className="profile-photo-preview">
                {profilePhotoPreview ? (
                    <img
                        src={profilePhotoPreview}
                        alt="Employee profile preview"
                    />
                ) : (
                    <span>Photo</span>
                )}
            </div>

            <div className="profile-photo-controls">
                <label>Profile Photo</label>

                <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handlePhotoChange}
                />

                <small>
                    JPG, PNG or WEBP. Maximum size 5 MB.
                </small>
            </div>

        </div>
    );
}

export default ProfilePhotoUpload;
