import Wrapper from "../components/Wrapper";
// import AddCompany from "@/components/addCompany";
// import AddShift from "@/components/AddShift";
// import Dropdown from "@/components/Dropdown";
import EarningsReport from "@/components/EarningsReport";

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
      {/* <Dropdown label="Select Option"></Dropdown> */}
      {/* <AddCompany></AddCompany> */}
      {/* <AddShift></AddShift> */}
      <EarningsReport></EarningsReport>
    </Wrapper>
  );
}
