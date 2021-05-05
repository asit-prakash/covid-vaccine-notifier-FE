import React from 'react';
import Link from 'next/link';

const Footer = () => {
  return (
    <div
      className='py-3'
      style={{
        backgroundColor: '#3c4f65',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexGrow: 1,
      }}
    >
      <footer>
        <span className='mr-1 text-light'>Developed By:</span>
        <Link
          style={{ textDecoration: 'none' }}
          href='https://www.linkedin.com/in/asit-prakash-96a91b13a/'
          as='https://www.linkedin.com/in/asit-prakash-96a91b13a/'
        >
          <a target='_blank' className='text-light mr-1'>
            Asit Prakash
          </a>
        </Link>
        <Link
          href='https://www.linkedin.com/in/jaswin-singh-7152b2111/'
          as='https://www.linkedin.com/in/jaswin-singh-7152b2111/'
        >
          <a target='_blank' className='text-light'>
            Jaswin Singh
          </a>
        </Link>
      </footer>
    </div>
  );
};

export default Footer;
