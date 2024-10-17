import { useSession, signIn, signOut } from "next-auth/react";
import Button from "./Button";

export default function LoginButton() {
  const { data: session } = useSession();

  if (session) {
    return <Button onClick={() => signOut()}>Sign out</Button>;
  } else {
    return <Button onClick={() => signIn()}>Sign in</Button>;
  }
}
