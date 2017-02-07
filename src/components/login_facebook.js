import React from 'react';
import FacebookLogin from 'react-facebook-login';

class FBLogin extends React.Component {
    constructor(props) {
        console.log(props);
        super(props);
    }

    render() {
      return (
        <FacebookLogin
            appId="960532494079095"
            autoLoad={true}
            fields="name,email,picture"
            scope="public_profile, user_friends, user_events, events"
            callback={this.props.callback}
        />
      )
    }
  }
export default FBLogin;

// FB.login(function(response) {
//     if (response.authResponse) {
//      console.log('Welcome!  Fetching your information.... ');
//      FB.api('/me', function(response) {
//        console.log('Good to see you, ' + response.name + '.');
//      });
//     } else {
//      console.log('User cancelled login or did not fully authorize.');
//     }
// });
