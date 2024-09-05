import Wrapper from "../components/Wrapper";
import Input from "@/components/Input";
import Button from "@/components/Button";

export default function Home() {
  return (
    <Wrapper>
      <Input label="Email" type="email" placeholder="Enter your email" />
      <Input
        label="Password"
        type="password"
        placeholder="Enter your password"
      />
      <Button>Submit</Button>
    </Wrapper>
  );
}
