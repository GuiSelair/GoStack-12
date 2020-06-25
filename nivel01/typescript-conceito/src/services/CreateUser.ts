
interface TechObject{
    title: string;
    experience: string;
}

interface CreateUserData {
    name?: string;
    email: string;
    password: string;
    techs: Array<string | TechObject>
    // techs: string[]; PODE SER ASSIM TAMBÉM QUANDO O VETOR TERA SEMPRE
    // O MESMO TIPO
}

export default function createUser({ name, email, password }: CreateUserData){
    const user = {
        name,
        email,
        password,
    }
    return user;
}