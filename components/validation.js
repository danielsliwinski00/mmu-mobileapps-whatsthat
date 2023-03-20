const validation = (email, password) => {
    if(email.match(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)){
      if(password.match(/^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[A-Z])[a-zA-Z0-9!@#$%^&*]{8,16}$/)){
        return true;
      }
      else{
        return false;
      }
    }
    else{
      return false;
    }
}

export default validation;