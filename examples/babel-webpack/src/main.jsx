import { Config, CognitoIdentityCredentials } from "aws-sdk";
import {
  CognitoUserPool,
  CognitoUserAttribute
} from "amazon-cognito-identity-js";
import React from "react";
import ReactDOM from "react-dom";
import appConfig from "./config";
import FaceCapture from "@getyoti/react-face-capture"
import "@getyoti/react-face-capture/index.css"
// import FileUpload from "@amzn/awsui-components-react/polaris/file-upload";
// import FormField from "@amzn/awsui-components-react/polaris/form-field";


Config.region = appConfig.region;
Config.credentials = new CognitoIdentityCredentials({
  IdentityPoolId: appConfig.IdentityPoolId
});

const userPool = new CognitoUserPool({
  UserPoolId: appConfig.UserPoolId,
  ClientId: appConfig.ClientId,
});

class SignUpForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      surname: '',
      email: '',
      password: '',
      file: null, // Add file state
    };
  }

  handleNameChange(e) {
    this.setState({ name: e.target.value });
  }

  handleSurnameChange(e) {
    this.setState({ surname: e.target.value });
  }

  handleEmailChange(e) {
    this.setState({ email: e.target.value });
  }

  handlePasswordChange(e) {
    this.setState({ password: e.target.value });
  }

  handleFileChange(e) {
    const file = e.target.files[0];
    this.setState({ file });
  }

  handleSubmit(e) {
    e.preventDefault();
    const name = this.state.name.trim();
    const surname = this.state.surname.trim();
    const email = this.state.email.trim();
    const password = this.state.password.trim();
    const file = this.state.file;

    console.log('Name and Surname:' + name + " " + surname);
    const attributeList = [
      new CognitoUserAttribute({
        Name: 'name',
        Value: name + " " + surname,
      }),
      // new CognitoUserAttribute({
      //   Name: 'surname',
      //   Value: surname,
      // }),
      new CognitoUserAttribute({
        Name: 'email',
        Value: email,
      })
    ];

    if (file) {
      // Create a new FormData object
      const formData = new FormData();
      formData.append('file', new Blob([file]));

      userPool.signUp(email, password, attributeList, null, (err, result) => {
        if (err) {
          console.log(err);
          return;
        }
        console.log(file);
        console.log('File name :' + file.name);
        console.log('user name is ' + result.user.getUsername());
        console.log('call result: ' + result);

        fetch('https://xzzu27d0id.execute-api.us-east-1.amazonaws.com/Dev/user-photo-lib/' + file.name, {
          method: 'PUT',
          body: formData,
          statusCode: 200,
        //   headers: {
        //     "Access-Control-Allow-Origin": "*", 
        //     "Access-Control-Allow-Credentials": true,
        //     "Access-Control-Request-Method": 'PUT, OPTIONS',
        //     "Access-Control-Request-Headers": 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'
        // }
        })
        .then((response) => response.json())
        .then((data) => {
          this.setState(file.name);
        })
        .catch((error) => {
          console.log(error);
        });

    });
  }
}

render() {
  return (
    <div>
      <form onSubmit={this.handleSubmit.bind(this)}>
        <h1>Register Your Face</h1>

        <input type="text"
          value={this.state.name}
          placeholder="Name"
          id="name"
          name="name"
          onChange={this.handleNameChange.bind(this)} />
        <input type="text"
          value={this.state.surname}
          id="surname"
          placeholder="Surname"
          name="surname"
          onChange={this.handleSurnameChange.bind(this)} />
        <input type="text"
          value={this.state.email}
          placeholder="Email"
          onChange={this.handleEmailChange.bind(this)} />
        <input type="password"
          value={this.state.password}
          placeholder="Password"
          onChange={this.handlePasswordChange.bind(this)} />

        <div id="upload-photo-container">
          <div id="upload-photo-svg">
            <svg width="48" height="45" viewBox="0 0 48 45" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M13.2173 4.02545C15.9353 1.68137 19.7208 0 24 0C32.0707 0 38.7699 5.99831 39.4971 13.7369C44.2743 14.4123 48 18.4097 48 23.3182C48 28.7085 43.507 33 38.0625 33H30C29.1716 33 28.5 32.3284 28.5 31.5C28.5 30.6716 29.1716 30 30 30H38.0625C41.9378 30 45 26.9653 45 23.3182C45 19.6711 41.9378 16.6364 38.0625 16.6364H36.5625V15.1364C36.5625 8.47681 30.9819 3 24 3C20.5127 3 17.4076 4.37318 15.1766 6.29727C12.9069 8.25471 11.7188 10.6149 11.7188 12.4636V13.8078L10.3826 13.9547C6.19113 14.4154 3 17.858 3 21.9545C3 26.3548 6.69178 30 11.3438 30H18C18.8284 30 19.5 30.6716 19.5 31.5C19.5 32.3284 18.8284 33 18 33H11.3438C5.12261 33 0 28.098 0 21.9545C0 16.6653 3.79759 12.2854 8.82668 11.175C9.25438 8.5851 10.9196 6.0071 13.2173 4.02545Z" fill="black" />
              <path fill-rule="evenodd" clip-rule="evenodd" d="M22.9393 12.4393C23.5251 11.8536 24.4749 11.8536 25.0607 12.4393L34.0607 21.4393C34.6465 22.0251 34.6465 22.9749 34.0607 23.5607C33.4749 24.1464 32.5251 24.1464 31.9393 23.5607L25.5 17.1213V43.5C25.5 44.3284 24.8284 45 24 45C23.1716 45 22.5 44.3284 22.5 43.5V17.1213L16.0607 23.5607C15.4749 24.1464 14.5251 24.1464 13.9393 23.5607C13.3536 22.9749 13.3536 22.0251 13.9393 21.4393L22.9393 12.4393Z" fill="black" />
            </svg>
          </div>
          <input type="file" id="upload-photo" placeholder="Upload Photo" name="upload-photo" onChange={this.handleFileChange.bind(this)} />
        </div>


        <input type="submit" value="Register Your Face" />
      </form>
    </div>

  );
}
}

class SignInForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
    };
  }

  handleEmailChange(e) {
    this.setState({ email: e.target.value });
  }

  handlePasswordChange(e) {
    this.setState({ password: e.target.value });
  }

  handleSubmit(e) {
    e.preventDefault();
    const email = this.state.email.trim();
    const password = this.state.password.trim();
    const attributeList = [
      new CognitoUserAttribute({
        Name: 'email',
        Value: email,
      })
    ];
    userPool.signUp(email, password, attributeList, null, (err, result) => {
      if (err) {
        console.log(err);
        return;
      }
      console.log('user name is ' + result.user.getUsername());
      console.log('call result: ' + result);

    });
  }

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit.bind(this)}>
          <h1>Authenticate Face</h1>
          <input type="text"
            value={this.state.email}
            placeholder="Email"
            onChange={this.handleEmailChange.bind(this)} />
          <div id="camera">
            <img class="vector-icon1" alt="" src="./camera.svg" />
          </div>

          {/* <input type="password"
               value={this.state.password}
               placeholder="Password"
               onChange={this.handlePasswordChange.bind(this)}/> */}
          <input type="submit" value="Scan Your Face" class="icon" />
        </form>
      </div>

    );
  }
}

ReactDOM.render(<SignInForm />, document.getElementById('sign-in'));

ReactDOM.render(<SignUpForm />, document.getElementById('register'));

