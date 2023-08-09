import mongoose from "mongoose"

export async function connect() {
    try {
        await mongoose.connect('mongodb+srv://micaelricardo:EfEbVQU6kTh180QQ@hero.qgffw5f.mongodb.net/hero');
        console.log("Connect database success")
    } catch (error) {
        console.log("file: database.ts ~ connect ~ error:", error)
    }
}