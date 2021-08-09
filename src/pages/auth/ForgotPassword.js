import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { auth } from "../../firebase";

export const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState("");
    const { user } = useSelector(state => ({ ...state }));
    const navigate = useNavigate();

    useEffect(() => {
        if (user && user.token) navigate("/");
    }, [user])

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const config = {
            url: process.env.REACT_APP_FORGOT_PASSWORD_REDIRECT,
            handleCodeInApp: true,
        };

        await auth.sendPasswordResetEmail(email, config)
            .then(() => {
                setEmail('');
                setLoading(false);
                toast.success("Check your email for password reset link");
            })
            .catch(err => {
                setLoading(false);
                toast.error(err.message);
                console.log("Error message in forgot password", err);
            })
    }
    return (
        <div className="container col-md-6 offset-md-3 p-5">
            {loading ? (<h4 className="text-danger">Loading...</h4>) : (
                <h4>Forgot Password</h4>
            )}

            <form onSubmit={handleSubmit}>
                <input
                    className="form-control"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoFocus
                    placeholder="Type your email"
                />
                <br />
                <button
                    disabled={!email}
                    className="btn btn-raised"
                >Submit</button>
            </form>
        </div>
    )
}