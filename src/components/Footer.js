const Footer = () => {
  const year = new Date().getFullYear()
  return (
    <>
      <footer className='text-center text-capitalize footer-style'>
        <span class="footerLine"></span>
        All rights reserved &copy; {year}
      </footer>
    </>
  )
}

export default Footer
