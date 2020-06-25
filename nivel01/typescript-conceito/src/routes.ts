import { Request, Response } from "express";
import createUser from "./services/CreateUser";

export function register(request:Request, response:Response){
    const user = createUser({
        email: "guilherme.lima1997@hotmail.com",
        password: "123",
        techs: ["NodeJS", "ReactJS", "React Native"]
    })

    return response.json({ message: user })
}