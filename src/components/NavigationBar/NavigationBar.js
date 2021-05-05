import Link from 'next/link';
import { Nav, Navbar } from 'react-bootstrap';

const NavigationBar = () => {
  return (
    <div style={{ backgroundColor: '#222831' }}>
      <Navbar expand='lg'>
        <Navbar.Brand>
          <Link href='/' as='/'>
            <a className='navbar-brand text-light'>Vaccine Notifier</a>
          </Link>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls='basic-navbar-nav' />
        <Navbar.Collapse id='basic-navbar-nav'>
          <Nav className='ml-auto'>
            <Link  href='opt-out' as='opt-out'>
              <a className='text-light px-2'>Unsubscribe</a>
            </Link>
            <Link  href='/' as='/'>
              <a className='text-light px-2'>Home</a>
            </Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </div>
  );
};

export default NavigationBar;
