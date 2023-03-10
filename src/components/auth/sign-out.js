import signOutPng from '../../imgs/signout.png';

function SignOut(props) {
  return props.auth.currentUser && (
    <li id="signout-li" onClick={() => props.auth.signOut()}>
      <img className='nav-icon' id='signout-icon' src={signOutPng} alt='signout_icon'/>
      Sign out
    </li>
  )
}

export default SignOut;