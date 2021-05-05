import { useState, useEffect, useRef } from 'react';
import { isEmail } from 'validator';
import { useRouter } from 'next/router';
import axios from 'axios';

import MetaData from '../../components/MetaData/MetaData';
import NavigationBar from '../../components/NavigationBar/NavigationBar';
import Loader from '../../components/Loader/Loader';
import styles from '../../styles/Common/Common.module.css';
import Footer from '../../components/Footer/Footer';

const OptOut = () => {
  const router = useRouter();
  const deleteUserForm = useRef();

  const [email, setEmail] = useState({
    value: '',
    isError: true,
    message: 'Please enter a valid email',
  });
  const [showError, setShowError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleteUserData, setDeleteUserData] = useState(null);

  useEffect(() => {
    let email = router.query?.email;
    if (email) {
      setEmail({
        value: email,
        isError: validateData('email', email),
        message: validateData('email', email)
          ? 'Please enter a valid email'
          : '',
      });
    }
  }, [router]);

  useEffect(() => {
    if (router.query?.email) {
      // deleteUserForm.current.submit(new Event('submit'));
      handleUserFormSubmit(new Event('submit'));
    }
  }, [email.value]);

  const validateData = (type, value) => {
    let isValid = false;

    if (type === 'email') {
      if (!isEmail(value)) {
        isValid = true;
      }
      return isValid;
    }
  };

  const handleChange = (type) => ({ target }) => {
    const { value } = target;

    switch (type) {
      case 'email':
        setEmail({
          value: value,
          isError: validateData(type, value),
          message: validateData(type, value)
            ? 'Please enter a valid email'
            : '',
        });
        break;

      default:
        break;
    }
  };
  const handleUserFormSubmit = async (event) => {
    event.preventDefault();
    if (email.isError) {
      return setShowError(true);
    }
    setShowError(false);
    setDeleteUserData(null);
    const data = {
      email: email.value,
    };
    setLoading(true);
    try {
      const deleteUser = await axios.post('/api/deleteUser', data);
      if (deleteUser.status === 200) {
        setDeleteUserData(deleteUser.data);
      }
      setLoading(false);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setDeleteUserData(error.response.data);
      } else {
        console.error(error);
      }
      setLoading(false);
    }
  };

  return (
    <>
      <MetaData />
      <NavigationBar />
      <div className={`${styles.container} bg-dark`}>
        <main className={styles.main}>
          {deleteUserData !== null && (
            <>
              {deleteUserData?.status ? (
                <div className='col-md-12 alert alert-success'>
                  You have successfully unsubscribed
                </div>
              ) : (
                <div className='col-md-12 alert alert-danger'>
                  {deleteUserData?.errors}
                </div>
              )}
            </>
          )}
          <form ref={deleteUserForm} onSubmit={handleUserFormSubmit}>
            <div className='form-group'>
              <label className='text-light' htmlFor='email'>
                Email
              </label>
              <input
                type='text'
                className={`form-control ${
                  showError && email.isError ? 'is-invalid' : ''
                }`}
                id='email'
                value={email.value}
                onChange={handleChange('email')}
                placeholder='e.g: xyz@gmail.com'
              />
              <small id='emailHelp' className='form-text  text-light'>
                Your account details will be deleted permanently
              </small>
              {showError && email.isError && (
                <div className='invalid-feedback'>{email.message}</div>
              )}
            </div>
            <button type='submit' className='btn btn-outline-success btn-block'>
              {loading ? <Loader /> : 'Unsubscribe'}
            </button>
          </form>
        </main>
      </div>
      <Footer />
    </>
  );
};

export default OptOut;
