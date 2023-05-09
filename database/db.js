import mongoose from "mongoose";

const Connection = async (username, password) => {
  const URL = `mongodb+srv://${username}:${password}@cluster0.qkw14ee.mongodb.net/SellCars`;
  try {
    await mongoose.connect(URL, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
    console.log(`Database Connected Successfully`);
  } catch (error) {
    console.log(`error while connecting to the database`, error);
  }
};
 
export default Connection;
