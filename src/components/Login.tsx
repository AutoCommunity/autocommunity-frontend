import axios from "axios";
import { Button, Form } from 'react-bootstrap';

export function Login(props: {username: string, saveUsername: any, getUserConfig: any}){
  const handleLoginClick = async (event: any) => {
    event.preventDefault();
    await axios
      .post(process.env.REACT_APP_API_URL + '/api/user/auth', {
          username: event.target.username.value,
          password: event.target.password.value,
      }, {
        withCredentials: true,
      })
      .then(async (_response) => {
        const { username }= await props.getUserConfig();
        props.saveUsername(username);
      })
      .catch((error) => {
        console.log(error.response.data)
        if (error.response.status === 400) {
          window.location.reload();
        }
      });
  }
  
  const handleLogoutClick = async(event: any) => {
    await axios
      .post(process.env.REACT_APP_API_URL + '/api/user/logout', {}, {
        withCredentials: true
      })
      .then(response => {
        props.saveUsername('');
      })
      .catch((error) => {
        console.log(error.response.data)
        if (error.response.status === 400) {
          window.location.reload()
        }
      });
  }
  
  if (props.username === '') {
    return (
      <Form onSubmit={handleLoginClick}>
        <Form.Group>
          <label htmlFor="username">Username</label>
          <input className="form-control" name="username"/>
        </Form.Group>
        <Form.Group>
        <label htmlFor="password">Password</label>
          <input className="form-control" type="password" name="password"/>
        </Form.Group>
        <Form.Group>
        <button className="form-control btn btn-primary" type="submit">
            Sign in / Sign up
          </button>
        </Form.Group>
      </Form>
    );
  } else {
    return (
      <>
      {props.username}
      <Button onClick={handleLogoutClick}>Logout</Button>
      </>
    )
  }
};