
import Rootlayout from './Rootlayout';
import Aboutus from './Aboutus';
import Signin from './Signin';
import Signup from './Signup';
import './CSS/Home.css'
function Home() {
  return(
    <div className='text-center rootlayout'>
      <div>
      <textarea name="" id="" className='text-center'>QUIESZONE</textarea>
      </div>
      <input type="text" placeholder='Type a Subject Name' />
      <button className='bg-primary text-light'> DEMO </button>
    </div>
  )
}

export default Home;
