import { useNavigate } from "react-router-dom";

 function Signup() {
  const navigate = useNavigate();

  const handleSignup = () => {
    navigate("/candidate");
  };

  return (
    <div>
      <h2>Create Candidate Account</h2>
      <input placeholder="Full Name" />
      <input placeholder="Email" />
      <input placeholder="Password" />

      <button onClick={handleSignup}>Sign up</button>
    </div>
  );
}
export default Signup;
