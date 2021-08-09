import React, { useEffect, useState } from 'react'
import { auth } from "../../firebase";
import { toast } from "react-toastify";
import { useNavigate } from 'react-router';
import { useSelector } from 'react-redux';

export const Register = () => {
    const [email, setEmail] = useState("");
    const navigate = useNavigate();
    const { user } = useSelector(state => ({ ...state }));

    useEffect(() => {
        if (user && user.token) navigate("/");
    }, [user])

    const handleSubmit = async (event) => {
        event.preventDefault();
        const config = {
            url: process.env.REACT_APP_REGISTER_REDIRECT_URL,
            handleCodeInApp: true,
        }

        await auth.sendSignInLinkToEmail(email, config)
        // .then(result => console.log(result))
        // .catch(err => console.log(err))
        toast.success(
            `Email is sent to ${email}. Click the link to complete your registeration.`
        );

        // save user email in local storage
        window.localStorage.setItem(`emailForRegistration`, email)

        // clear state
        setEmail("");

    }
    const resgisterForm = () => <form onSubmit={handleSubmit}>
        <input
            type="email"
            className="form-control"
            value={email}
            placeholder="Your email"
            onChange={(e) => setEmail(e.target.value)}
            autoFocus
        />
        <br />
        <button type="submit"
            className="btn btn-raised" >Register</button>
    </form>
    return (
        <div className="container p-5">
            <div className="row">
                <div className="col-md-6 offset-md-3">
                    <h4>Register</h4>
                    {resgisterForm()}
                </div>
            </div>
        </div>
    )
}

