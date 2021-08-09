import React, { useEffect, useState } from 'react'
import { auth } from "../../firebase";
import { toast } from "react-toastify";
import { useNavigate } from 'react-router';
import { useDispatch } from 'react-redux';
import { LOGGED_IN_USER } from '../../reducers/userReducer';
import { createOrUpdateUser } from '../../functions/auth';

export const RegisterComplete = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const dispatch = useDispatch();

    useEffect(() => {
        setEmail(window.localStorage.getItem("emailForRegistration"));
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!email || !password) {
            toast.error('Email and password is required');
            return;
        }

        if (password.length < 6) {
            toast.error('Password must be at least 6 characters long');
            return;
        }
        try {
            const result = await auth.signInWithEmailLink(email,
                window.location.href)
            console.log(result)
            if (result.user.emailVerified) {
                window.localStorage.removeItem("emailForRegistration");

                // get user id token
                let user = auth.currentUser;
                await user.updatePassword(password);
                const idTokenResult = await user.getIdTokenResult();

                console.log("user", user, "idTokenResult", idTokenResult);

                createOrUpdateUser(idTokenResult.token)
                    .then((res) => {
                        dispatch({
                            type: LOGGED_IN_USER,
                            payload: {
                                name: res.data.name,
                                role: res.data.role,
                                email: res.data.email,
                                token: idTokenResult.token,
                                _id: res.data._id,
                            }
                        })

                    })
                    .catch()


                // redirect
                navigate("/");
            }
        }

        catch (err) {
            console.error(err);
            toast.error(err.message)
        }
    }

    const completeResgisterForm = () => <form onSubmit={handleSubmit}>
        <input
            type="email"
            className="form-control"
            value={email}
            placeholder="Your email"
            disabled
        />
        <input type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoFocus
            placeholder="Password"
        />

        <button type="submit"
            className="btn btn-raised" >Complete Registeration</button>
    </form>
    return (
        <div className="container p-5">
            <div className="row">
                <div className="col-md-6 offset-md-3">
                    <h4>Registeration Complete</h4>
                    {completeResgisterForm()}
                </div>
            </div>
        </div>
    )
}

