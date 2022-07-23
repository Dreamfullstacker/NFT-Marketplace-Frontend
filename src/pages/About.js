import Header from '../components/Header'
import Meta from '../components/Meta'

const About = () => {
  // page content
  const pageTitle = 'About'
  return (
    <div>
      <Meta title={pageTitle}/>
      <Header/>
    </div>
  )
}

export default About