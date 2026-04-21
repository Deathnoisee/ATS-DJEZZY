import { useState } from "react";
import "../styles/idk.css";

function counter() {
    const [count, setcount] = useState(0);

    return (
        <>
            <div className="header">
                <head>
                    <title>Counter</title>
                </head>
            </div>
            <body>
                <div className="center">
                    <h1>Counter: {count}</h1>
                    <p>Status:
                        <span>
                            not clicked
                        </span>
                    </p>
                    <button className="clickButton" onClick={() => setcount(count + 1)}>
                        Click me
                    </button>
                </div>
            </body>
        </>
    );
}

export default counter;