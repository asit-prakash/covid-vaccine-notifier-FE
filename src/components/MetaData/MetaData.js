import Head from 'next/head';

const MetaData = () => {
  return (
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
  );
};

export default MetaData;
