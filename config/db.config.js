import mongoose from 'mongoose';


export const connectToDB = async () => {
    try {
        await mongoose.connect(`${process.env.DB_URL}${process.env.DB_NAME}`);
        console.log(`Connected to Database ==> ${process.env.DB_NAME}`);

    } catch (error) {
        console.error('Error connecting to database:', error.message);
    }
};


