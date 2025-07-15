import React from "react";
import { useState } from "react";

const About = () => {
    const [response, setResponse] = useState("");

    const handleClick = async () => {
        const res = await fetch("http://127.0.0.1:5000/api", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ message: "Hello from the client!" })
        });
        const data = await res.json();
        setResponse(data.message);
        console.log(data);
    };

    return (
        <div>
            <button onClick={handleClick}>Send Message</button>
            <p>Response: {response}</p>
        </div>
    );
};
export default About;
