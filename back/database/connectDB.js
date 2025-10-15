import mongoose from 'mongoose';
const connectDatabase = {
    DB: async() =>{
        try {
            await mongoose.connect('mongodb+srv://vtk:vtk@naksu.8wtkqy5.mongodb.net/test?retryWrites=true&w=majority&appName=naksu');
            console.log('Connect toi DB thanh cong');
        } catch (error) {
            console.log("Error: ", error);
        }
    }
}
export default connectDatabase;