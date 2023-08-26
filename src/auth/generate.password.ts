export function generatePassword(length:number) {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*!@#$%^&*!@#$%^&*";
    let password = "";
    for (let i = 0; i < length; i += 1) {
      const randomNumber = Math.floor(Math.random() * characters.length);
      password += characters.substring(randomNumber, randomNumber + 1);
    }
    return password;
  }