export function assertAdmin(password: string) {
  const expected = process.env["ADMIN_PASSWORD"];
  if (!expected || password !== expected) {
    throw new Error("Palavra-passe incorreta.");
  }
}
