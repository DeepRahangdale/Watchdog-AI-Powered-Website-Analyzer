import React, { useState } from 'react';
import { auth } from '../firebase'; 
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import './Login.css';
function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate(); 

    const handleEmailPasswordLogin = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate('/'); // Redirect to home page after successful login
        } catch (error) {
            setError(error.message); 
        }
    };

    const handleGoogleLogin = async () => {
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);
            navigate('/'); 
        } catch (error) {
            setError(error.message);
        }
    };

    // Login.js
    return (
        <div className="login-container">
            <div className="login-form">
                <h2 className="login-title">Login</h2>
                {error && <p className="error-message">{error}</p>}

                <form onSubmit={handleEmailPasswordLogin}>
                    <div className="form-group">
                        <label htmlFor="email">Email:</label>
                        <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password:</label>
                        <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                    <button type="submit" className="login-button">Login</button>
                </form>

                <button onClick={handleGoogleLogin} className="google-button">
                    Sign In with Google
                </button>
            </div>
        </div>
    );
}

export default Login;
