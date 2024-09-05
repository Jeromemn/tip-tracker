import Wrapper from "../components/Wrapper";
import Input from "@/components/Input";

export default function Home() {
  return (
    <Wrapper>
      <Input label="Email" type="email" placeholder="Enter your email" />
      <Input
        label="Password"
        type="password"
        placeholder="Enter your password"
      />
    </Wrapper>
  );
}
