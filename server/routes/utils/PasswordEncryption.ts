const bcrypt = require("bcrypt");

const saltRounds: number = 10;
export async function encryptPassword(password: string): Promise<string> {
  const hash: string = await bcrypt
    .genSalt(saltRounds)
    .then((salt: string): Promise<string> => {
      return bcrypt.hash(password, salt);
    })
    .then((hash: string): string => {
      return hash;
    });
  return hash;
}
export async function comparePassword(
  password: string,
  hash: string
): Promise<boolean> {
  const match: boolean = await bcrypt.compare(password, hash);
  console.log(match, password, hash);
  return match;
}
