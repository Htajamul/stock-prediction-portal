import { useParams } from "react-router-dom";
import { useState } from "react";
import axiosInstance from "../axiosinstance";
import { useNavigate } from "react-router-dom";
function ResetPassword() {
  const navigate = useNavigate()
  const { uid, token } = useParams();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleReset = async () => {
    // ✅ check passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await axiosInstance.post('reset-password/', {
        uid: uid,
        token: token,
        password: password
      });
      // console.log(response.data.message)
      alert("Password reset successful");
      navigate('/login')
    } catch (err) {
      // console.log(err.response.data.error)
      const errorMessage = err.response?.data?.error || "Something went wrong";
      setError(errorMessage);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card shadow p-4" style={{ width: "350px" }}>
        
        <h3 className="text-center mb-4">Reset Password</h3>

        {/* Error message */}
        {error && <div className="alert alert-danger">{error}</div>}

        {/* New Password */}
        <div className="mb-3">
          <label className="form-label">New Password</label>
          <input
            type="password"
            className="form-control"
            placeholder="Enter new password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* Confirm Password */}
        <div className="mb-3">
          <label className="form-label">Confirm Password</label>
          <input
            type="password"
            className="form-control"
            placeholder="Confirm password"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <button 
          className="btn btn-primary w-100"
          onClick={handleReset}
        >
          Reset Password
        </button>

      </div>
    </div>
  );
}

export default ResetPassword;