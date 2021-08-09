import React, { useEffect, useState } from 'react'
import { auth, googleAuthProvider } from "../../firebase";
import { toast } from "react-toastify";
import { Button } from 'antd';
import { GoogleOutlined, MailOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { LOGGED_IN_USER } from '../../reducers/userReducer';
import { useLocation, useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import { createOrUpdateUser } from '../../functions/auth';



export const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector(state => ({ ...state }));
    const { state } = useLocation();


    useEffect(() => {
        if (state) {
            return;
        } else {
            if (user && user.token) navigate("/");
        }
    }, [user, navigate, state])

    console.log(state)
    const roleBasedRedirect = (res) => {
        // check if intended
        if (state) {
            navigate(state.from);
            console.log(state);
        } else {
            if (res.data.role === "admin") {
                navigate("/admin/dashboard");
            } else {
                navigate("/user/history");
            }
        }
    }


    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);

        try {
            const result = await auth.signInWithEmailAndPassword(email, password);
            // console.log(result);
            const { user } = result;
            const idTokenResult = await user.getIdTokenResult();

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
                    roleBasedRedirect(res);

                })
                .catch()

            // navigate('/');
        }
        catch (err) {
            console.log(err);
            toast.error(err.message);
            setLoading(false);
        }
    }

    const googleLogin = () => {
        auth.signInWithPopup(googleAuthProvider)
            .then(async (result) => {
                const { user } = result;
                const idTokenResult = await user.getIdTokenResult();
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
                        roleBasedRedirect(res)
                    })
                    .catch(err => console.error(err));
                // navigate('/');
            })
            .catch(err => {
                console.log(err);
                toast.error(err.message);
            })
    }
    const loginForm = () => <form onSubmit={handleSubmit}>
        <div className="form-group">
            <input
                type="email"
                className="form-control"
                value={email}
                placeholder="Your email"
                onChange={(e) => setEmail(e.target.value)}
                autoFocus
            />
        </div>
        <div className="form-group">
            <input
                type="password"
                className="form-control"
                value={password}
                placeholder="Your password"
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
            />
        </div>
        <br />
        <Button
            onClick={handleSubmit}
            type="primary"
            block
            shape="round"
            className="mb-3"
            size="large"
            disabled={!email || password.length < 6}
            icon={<MailOutlined />}
        >Login with Email/Password</Button>
    </form>
    return (
        <div className="container p-5">
            <div className="row">
                <div className="col-md-6 offset-md-3">
                    {loading ? <h4 className="text-danger">Loading....</h4> : <h4>Login</h4>}
                    {loginForm()}
                    <Button
                        onClick={googleLogin}
                        type="danger"
                        block
                        shape="round"
                        className="mb-3"
                        size="large"
                        icon={<GoogleOutlined />}
                    >Login with Google</Button>
                    <Link to="/forgot/password"
                        className="float-right text-danger"
                    >Forgot Password</Link>
                </div>
            </div>
        </div>
    )
}

