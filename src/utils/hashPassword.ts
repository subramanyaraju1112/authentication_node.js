import bcrypt from "bcryptjs";

const hashPassword = async (password: string): Promise<string> => {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds)

}

export default hashPassword;