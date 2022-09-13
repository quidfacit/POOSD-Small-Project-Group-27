function verifyInput(firstName, lastName, phone, email) {
  if (!firstName || !lastName || !phone || !email)
    return 'All fields are required';

  if (!verifyPhone(phone))
    return 'Invalid phone number, please use the format: 555-555-5555';

  if (!verifyEmail(email)) return 'Invalid email';

  return true;
}

function verifyEmail(email) {
  const re = /\S+@\S+\.\S+/;
  return re.test(email);
}

function verifyPhone(phone) {
  const re = /^\d{3}-\d{3}-\d{4}$/;
  return re.test(phone);
}
