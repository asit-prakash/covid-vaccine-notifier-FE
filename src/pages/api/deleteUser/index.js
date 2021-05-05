import axios from 'axios';

const deleteUser = async (req, res) => {
  try {
    const deleteUser = await axios.post(process.env.DELETE_USER, req.body);
    return res.status(deleteUser.status).json(deleteUser.data);
  } catch (error) {
    if (error.response) {
      return res.status(error.response.status).json(error.response.data);
    }
  }
};

const handler = (req, res) => {
  if (req.method === 'POST') return deleteUser(req, res);
};
export default handler;
