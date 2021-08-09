import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const LoadingToRedirect = () => {
    const [count, setCount] = useState(5);
    const navigate = useNavigate();

    useEffect(() => {
        const interval = setInterval(() => {
            setCount((currentCount) => --currentCount);
            count === 0 && navigate("/");
        }, 1000);
        return () => clearInterval(interval)
    }, [count])

    return (
        <div className="container p-5 text-center">
            <p>Redirecting you in {count} seconds</p>
        </div>
    )
}