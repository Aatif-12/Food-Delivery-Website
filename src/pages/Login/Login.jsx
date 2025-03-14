import React, { useEffect, useState } from "react";
import { FaLock } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { FaGoogle } from "react-icons/fa";
import { FaFacebookF } from "react-icons/fa";
import { database, provider, fbAuthProvider } from "../../FirebaseConfig";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import "./Login.css";

const Login = () => {
    const [loginactive, setLoginActive] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [value, setvalue] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [isErrorShown, setIsErrorShown] = useState(false); 
    const navigate = useNavigate();

    const handleClick = () => {
        setLoginActive((curr) => !curr);
    };

    const handleLoginSubmit = (e) => {
        e.preventDefault();
        if (password.length < 6) {
            toast.error("Password should be at least 6 characters long", { id: "password-length-error" });
            return;
        }
        signInWithEmailAndPassword(database, email, password)
            .then(data => {
                navigate("/");
            }).catch(err => {
                if (!isErrorShown && err.code === "auth/invalid-credential") {
                    setIsErrorShown(true);
                    setErrorMessage("Invalid credentials. Please try again.");
                } else {
                    setErrorMessage(err.message); // For other errors
                }
                setEmail("");
                setPassword("");
            });
    }

    const handleSignUpSubmit = (e) => {
        e.preventDefault();
        if (password.length < 6) {
            toast.error("Password should be at least 6 characters long", { id: "password-length-error" });
            return;
        }
        createUserWithEmailAndPassword(database, email, password)
            .then(() => {
                navigate("/");
            })
            .catch((err) => {
                if (!isErrorShown && err.code === "auth/email-already-in-use") {
                    setIsErrorShown(true);
                    setErrorMessage("This email is already in use. Please use a different email.");
                } else if (!isErrorShown && err.code === "auth/invalid-credential") {
                    setErrorMessage("Invalid credentials. Please try again.");
                }else {
                    setErrorMessage(err.message); // For other errors
                }
                setEmail("");
                setPassword("");
            });
    }

    const handleClickGoogleAuth = () => {
        signInWithPopup(database, provider).then((data) => {
            setvalue(data.user.email);
            localStorage.setItem("email", data.user.email);
            navigate("/");
        })
            .catch((err) => {
                if (!isErrorShown && err.code === "auth/invalid-credential") {
                    setIsErrorShown(true);
                    setErrorMessage("Invalid credentials. Please try again.");
                } else {
                    setErrorMessage(err.message); 
                }
                setEmail("");
                setPassword("");
            });
    }

    const handleFacebookAuth = () => {
        fbAuthProvider.setCustomParameters({ display: 'popup' });
        signInWithPopup(database, fbAuthProvider)
            .then((userCredential) => {
                navigate("/");
            })
            .catch((error) => {
                console.error("Facebook authentication error:", error);
                toast.error("Failed to authenticate with Facebook. Please try again.");
            });
    }
    

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(database, (user) => {
            if (user) {
                setvalue(user.email);
            } else {
                setvalue(null);
            }
        });

        return () => unsubscribe();
    }, []);

    return (
        <div className="Login-screen">
        {isErrorShown && errorMessage && (
            toast.error(errorMessage) 
        ) && setIsErrorShown(false)}
            <div className={loginactive ? "cantainer active" : "cantainer"}>
                <div className="curved-shape"></div>
                <div className="curved-shape2"></div>
                <div className="form-box Login">
                    <h2 className="animation">Login</h2>
                    <form className="cc" style={{ width: "100%" }} onSubmit={handleLoginSubmit}>
                        <div className="input-box animation">
                            <input type="email" value={email} onChange={(e) => { setEmail(e.target.value) }} required />
                            <label htmlFor="c">Email</label>
                            <MdEmail className="Login-icons" />
                        </div>
                        <div className="input-box animation">
                            <input type="password" value={password} onChange={(e) => { setPassword(e.target.value) }} required />
                            <label htmlFor="hh">Password</label>
                            <FaLock className="Login-icons" />
                        </div>
                        <div className="login-with animation">
                            <div className="additonal-login">
                                <div className="line"></div>
                                <p>Or LogIn</p>
                                <div className="line"></div>
                            </div>
                            <div className="or-login-icons">
                                {(
                                    <button className="login-btn" onClick={handleClickGoogleAuth}>
                                        <FaGoogle />
                                    </button>
                                )}

                                <button className="login-btn" onClick={handleFacebookAuth}>
                                    <FaFacebookF className="fb-icon"></FaFacebookF>
                                </button>
                            </div>
                        </div>
                        <div className="input-box animation">
                            <button className="btn" type="submit">
                                Login
                            </button>
                        </div>
                        <div className="regi-link animation">
                            <p>
                                Don't have an account? <br />
                                <a href="#" className={loginactive ? "active" : "SignUpLink"} onClick={handleClick}>
                                    Sign Up
                                </a>
                            </p>
                        </div>
                    </form>
                </div>
                <div className="info-content Login">
                    <h2 className="animation">Welcome Back!!</h2>
                    <p className="animation">
                        Enter your credentials to log in
                    </p>
                </div>

                {/* sign up form */}
                <div style={!loginactive ? { pointerEvents: "none" } : {}} className="form-box Register ">
                    <h2 className="animation">Sign Up</h2>
                    <form className="df" onSubmit={handleSignUpSubmit}>
                        <div className="input-box animation">
                            <input type="email" value={email} onChange={(e) => { setEmail(e.target.value) }} required />
                            <label htmlFor="b">Email</label>
                            <MdEmail className="Login-icons" />
                        </div>
                        <div className="input-box animation">
                            <input type="password" value={password} onChange={(e) => { setPassword(e.target.value) }} required />
                            <label htmlFor="">Password</label>
                            <FaLock className="Login-icons" />
                        </div>
                        <div className="input-box animation">
                            <button className="btn" type="submit">
                                Register
                            </button>
                        </div>
                        <div className="regi-link animation">
                            <p>
                                Already have an account?{" "} <br />
                                <a href="#" className={loginactive ? "SignInLink" : "active"} onClick={handleClick}>
                                    Log In
                                </a>
                            </p>
                        </div>
                    </form>
                </div>
                <div className="info-content Register">
                    <h2 className="animation">Welcome Back!!</h2>
                    <p className="animation">
                        Create a new account to get started
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
