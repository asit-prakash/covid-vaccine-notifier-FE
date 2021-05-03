import axios from 'axios';

const registerUser = async (req, res) => {
  try {
    const newUser = await axios.post(process.env.REGISTER_USER, req.body);
    return res.status(newUser.status).json(newUser.data);
  } catch (error) {
    if (error.response) {
      return res.status(error.response.status).json(error.response.data);
    }
  }
};

const handler = (req, res) => {
  if (req.method === 'POST') return registerUser(req, res);
};
export default handler;
