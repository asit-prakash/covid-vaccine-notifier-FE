import { useState } from 'react';
import axios from 'axios';
import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';
import { isMobilePhone, isLength, isNumeric, isPostalCode } from 'validator';
import Loader from '../components/Loader/Loader';

const Home = () => {
  const [contact, setContact] = useState({
    value: '',
    isError: true,
    message: 'Please enter a valid phone number',
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
  const [registerUserData, setRegisterUserData] = useState('');

  const validateData = (type, value) => {
    let isValid = false;

    if (type === 'contact') {
      if (
        !isMobilePhone(value, 'en-IN') ||
        !isLength(value, { min: 10, max: 10 }) ||
        !isNumeric(value, { no_symbols: true })
      ) {
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
      case 'contact':
        setContact({
          value: value,
          isError: validateData(type, value),
          message: validateData(type, value)
            ? 'Please enter a valid phone number'
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
    if (contact.isError || pinCode.isError || ageGroup.isError) {
      return setShowError(true);
    }

    setShowError(false);
    setLoading(true);
    const data = {
      pincode: pinCode.value,
      phone_number: `+91${contact.value}`,
      age: ageGroup.value,
    };
    try {
      const registerUser = await axios.post('/api/register', data);
      console.log('data', registerUser);
      setLoading(false);
    } catch (error) {
      console.log('error', error);
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
        {registerUserData?.success && (
          <div className='alert alert-success'>{registerUserData.message}</div>
        )}
        <form onSubmit={handleUserFormSubmit}>
          <div className='form-group'>
            <label className='text-light' htmlFor='contact'>
              WhatsApp Number
            </label>
            <input
              type='text'
              className={`form-control ${
                showError && contact.isError ? 'is-invalid' : ''
              }`}
              id='contact'
              maxLength='10'
              value={contact.value}
              onChange={handleChange('contact')}
              placeholder='e.g: 9998881110'
            />
            <small id='emailHelp' className='form-text  text-light'>
              We'll never share your contact info with anyone else.
            </small>
            {showError && contact.isError && (
              <div className='invalid-feedback'>{contact.message}</div>
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
