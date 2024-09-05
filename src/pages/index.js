import Wrapper from "../components/Wrapper";
import Form from "@/components/Form";

const formContents = [
  {
    label: "Company Name",
    type: "text",
    placeholder: "Enter the company name",
  },
  {
    label: "Location",
    type: "text",
    placeholder: "Enter your location",
  },
  {
    label: "Position",
    type: "text",
    placeholder: "Enter your Position",
  },
  {
    label: "Base rate",
    type: "number",
    placeholder: "Enter your base rate",
  },
];

export default function Home() {
  return (
    <Wrapper>
      <Form buttonLabel="Add Job" formContent={formContents}></Form>
    </Wrapper>
  );
}
