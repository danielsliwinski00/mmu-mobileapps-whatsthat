/* eslint-disable eqeqeq */
/* eslint-disable consistent-return */
const validation = (value, type) => {
  if (type == 'email') {
    if (value.match(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)) {
      return true;
    }
  }
  if (type == 'password') {
    if (value.match(/^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[A-Z])[a-zA-Z0-9!@#$%^&*]{8,16}$/)) {
      return true;
    }
  }
};
export default validation;
