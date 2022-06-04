import axios from "axios";

async function onSubmit(event: any){
  event.preventDefault();
  await axios
    .post(process.env.REACT_APP_API_URL + '/api/user/auth', {
        username: event.target.username.value,
        password: event.target.password.value,
    },
    {
      withCredentials: true,
    },
    )
    .then(response => {
      if (response.data.status === 'SUCCESS') window.open(process.env.REACT_APP_FRONT_URL, '_self')
    })
    .catch((error) => {
      console.log(error.response.data)
      if (error.response.status === 400) {
        window.location.reload()
      }
    });
        
}

export function Login(){
  
  return (
    <form onSubmit={onSubmit}>
      <div className="form-group">
        <label htmlFor="username">Username</label>
        <input className="form-control" name="username"/>
      </div>
      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input className="form-control" type="password" name="password"/>
      </div>
      <div className="form-group">
        <button className="form-control btn btn-primary" type="submit">
          Sign in / Sign up
        </button>
      </div>
    </form>
  );
};