import React from "react"

import Header from "./components/Header"

function App(){
    return (
        <>
            <Header title="Home">
                <ul>
                    <li>Projetos</li>
                    <li>Experiencias</li>
                </ul>
            </Header>
            <Header title="Store"/>
        </>
    )
}

export default App;