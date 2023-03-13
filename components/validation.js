const validation = (email, password) => {
    if(email.match(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)){
      if(password.match(/^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[A-Z])[a-zA-Z0-9!@#$%^&*]{8,16}$/)){
        alert(
          "your email and password are valid"
        )
      }
      else{
        alert(
          "your password is not valid"
        )
        location.reload()
      }
    }
    else{
      alert(
        "your email is not valid"
      )
      location.reload()
    }
}

export default validation;