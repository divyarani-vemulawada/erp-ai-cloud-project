const MFASetup = () => {
  return (
    <div>
      <h2>
        Multi Factor Authentication
      </h2>

      <p>
        scan QR Code and 
        verify OTP
      </p>

      <input
        placeholder="Enter OTP"
      />

      <button>
        Verify
      </button>
    </div>
  );
};

export default MFASetup;