import React, { useState, useEffect } from "react"

import Header from "./components/Header"
import imageTest from "./assets/ghost.png"
import api from "./services/api"

import "./App.css";


function App(){
    const [repositories, setRepositories] = useState([]);

    useEffect(() => {
        api.get("/repositories").then(response => {
            setRepositories(response.data)
        });
    }, [])
    
    async function handleAddProject() {
        const response = await api.post("/repositories", {
            title: `RANDOM ${Date.now()}`,
	        url: "https://github.com/GuiSelair",
	        techs: ["ReactNative"]
        });
        const repository = response.data;
        setRepositories([...repositories, repository])

    }

    return (
        <>
            <Header title="Home"/>
            <img src={imageTest} width={300} alt="GHOST"/>
            {repositories.map((repository) => <li key={repository.id}>{repository.title}</li>)}
            <button onClick={() => {handleAddProject()}}>Adicionar projeto</button>
        </>
    )
}

export default App;