import React from 'react';
import FacebookLogin from 'react-facebook-login';

class FBLogin extends React.Component {
    constructor(props) {
        super(props);

        this.responseFacebook = (response) => {
            console.log(response);
            return "localhost:8080"
        }
    }

    render() {
      return (
        <FacebookLogin
          appId="960532494079095"
          autoLoad={true}
          fields="name,email,picture"
          scope="public_profile,user_friends, user_events"
          callback={this.responseFacebook}
        />
      )
    }
  }
export default FBLogin;
