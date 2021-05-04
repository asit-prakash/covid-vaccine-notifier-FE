import { useState } from 'react';
import axios from 'axios';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import { isEmail, isLength, isNumeric, isPostalCode } from 'validator';
import Loader from '../components/Loader/Loader';

const Home = () => {
  const [email, setEmail] = useState({
    value: '',
    isError: true,
    message: 'Please enter a valid email',
  });
  const [pinCode, setPinCode] = useState({
    value: '',
    isError: true,
    message: 'Please enter a valid pin code',
  });
  const [ageGroup, setAgeGroup] = useState({
    value: '',
    isError: true,
    message: 'Please select an age group',
  });
  const [showError, setShowError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [registerUserData, setRegisterUserData] = useState(null);

  const validateData = (type, value) => {
    let isValid = false;

    if (type === 'email') {
      if (!isEmail(value)) {
        isValid = true;
      }
      return isValid;
    }
    if (type === 'pincode') {
      if (
        !isPostalCode(value, 'IN') ||
        !isLength(value, { min: 6, max: 6 }) ||
        !isNumeric(value, { no_symbols: true })
      ) {
        isValid = true;
      }
      return isValid;
    }
    if (type === 'age') {
      if (value.split(',').length < 1) {
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

      case 'pincode':
        setPinCode({
          value: value,
          isError: validateData(type, value),
          message: validateData(type, value)
            ? 'Please enter a valid pin code'
            : '',
        });
        break;

      case 'age':
        setAgeGroup({
          value: value.split(','),
          isError: validateData(type, value),
          message: validateData(type, value)
            ? 'Please select an age group'
            : '',
        });
        break;

      default:
        break;
    }
  };

  const handleUserFormSubmit = async (event) => {
    event.preventDefault();
    if (email.isError || pinCode.isError || ageGroup.isError) {
      return setShowError(true);
    }

    setShowError(false);
    setRegisterUserData(null);
    setLoading(true);
    const data = {
      pincode: pinCode.value,
      email: email.value,
      age: ageGroup.value,
    };
    try {
      const registerUser = await axios.post('/api/register', data);
      if (registerUser.status === 200) {
        setRegisterUserData(registerUser.data);
      }
      setEmail({
        value: '',
        isError: true,
        message: 'Please enter a valid phone number',
      });
      setPinCode({
        value: '',
        isError: true,
        message: 'Please enter a valid pin code',
      });
      setAgeGroup({
        value: '',
        isError: true,
        message: 'Please select an age group',
      });
      setLoading(false);
    } catch (error) {
      if (error.response) {
        if (error.response.status === 400) {
          if (!error.response.data.success) {
            let isemailError = error?.response?.data?.error?.phNumber;
            let isPinCodeError = error?.response?.data?.error?.pincode;
            setEmail((currentState) => ({
              ...currentState,
              isError: isemailError !== undefined ? isemailError : false,
              message: isemailError !== undefined ? isemailError : '',
            }));
            setPinCode((currentState) => ({
              ...currentState,
              isError: isPinCodeError !== undefined ? isPinCodeError : false,
              message: isPinCodeError !== undefined ? isPinCodeError : '',
            }));
            setShowError(true);
          }
        } else if (error.response.status === 403) {
          setRegisterUserData(error.response.data);
        }
      } else {
        console.error(error);
      }
      setLoading(false);
    }
  };

  return (
    <div className={`${styles.container} bg-dark`}>
      <Head>
        <title>Covid-19 Vaccine Notifier</title>
        <meta
          name='description'
          content='Get notification on covid-19 vaccine availability in India'
        />
        <link rel='icon' href='/favicon.ico' />
        <link
          rel='stylesheet'
          href='https://cdn.jsdelivr.net/npm/bootstrap@4.6.0/dist/css/bootstrap.min.css'
          integrity='sha384-B0vP5xmATw1+K9KRQjQERJvTumQW0nPEzvF6L/Z6nronJ3oUOFUFpCjEUQouq2+l'
          crossOrigin='anonymous'
        ></link>
      </Head>
      <div className='mt-5'>
        <h4 className='text-light text-center'>
          Covid-19 vaccine slot availability
        </h4>
        <p className='text-warning text-center'>
          Register yourself to get a notification immediately when a covid-19
          vaccine slot is available in your area
        </p>
      </div>
      <main className={styles.main}>
        {registerUserData !== null && (
          <>
            {registerUserData?.success ? (
              <div className='col-md-12 alert alert-success'>
                Registration successful
              </div>
            ) : (
              <div className='col-md-12 alert alert-danger'>
                {registerUserData?.error}
              </div>
            )}
          </>
        )}
        <form onSubmit={handleUserFormSubmit}>
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
              We'll never share your email info with anyone else.
            </small>
            {showError && email.isError && (
              <div className='invalid-feedback'>{email.message}</div>
            )}
          </div>

          <div className='form-group'>
            <label className='text-light' htmlFor='pincode'>
              Area Pin Code
            </label>
            <input
              type='text'
              maxLength='6'
              className={`form-control ${
                showError && pinCode.isError ? 'is-invalid' : ''
              }`}
              id='pincode'
              value={pinCode.value}
              onChange={handleChange('pincode')}
              placeholder='e.g: 888111'
            />
            {showError && pinCode.isError && (
              <div className='invalid-feedback'>{pinCode.message}</div>
            )}
          </div>

          <div className='form-group'>
            <select
              className={`custom-select ${
                showError && ageGroup.isError ? 'is-invalid' : ''
              }`}
              value={ageGroup.value}
              onChange={handleChange('age')}
            >
              <option value='' disabled>
                Select Age Group
              </option>
              <option value={['18']}>18+</option>
              <option value={['45']}>45+</option>
              <option value={['18', '45']}>Both</option>
            </select>
            {showError && ageGroup.isError && (
              <div className='invalid-feedback'>{ageGroup.message}</div>
            )}
          </div>
          <button type='submit' className='btn btn-outline-success btn-block'>
            {loading ? <Loader /> : 'Register'}
          </button>
        </form>
      </main>
    </div>
  );
};
export default Home;
