import React from "react";
import { useNavigate } from "react-router-dom";
import InvestmentsTable from "./InvestmentsTable.jsx"; // Adjust the import if needed
import { Search } from "lucide-react";

const Investments = () => {
  const navigate = useNavigate();

  const col = ["Investment ID", "Investor", "Investor ID", "Amount", "ROI", "Contract", "Deposit Date", "Maturity Date"];
  const data = [
    {
      InvestmentID: "INV001",
      Investor: "Deepak Bhagchandani",
      InvestorID: "I1",
      Amount: 50000,
      ROI: "100%",
      Contract: "contract_INV001.pdf",
      InvestmentDate: "2022-01-15",
      MaturityDate: "2023-01-15"
    },
    {
      InvestmentID: "INV002",
      Investor: "Pritvik Premkumar Shanmuga",
      InvestorID: "I2",
      Amount: 30000,
      ROI: "25%",
      Contract: "contract_INV002.pdf",
      InvestmentDate: "2022-02-10",
      MaturityDate: "2023-02-10"
    },
    {
      InvestmentID: "INV003",
      Investor: "Ananya Iyer",
      InvestorID: "I3",
      Amount: 20000,
      ROI: "15%",
      Contract: "contract_INV003.pdf",
      InvestmentDate: "2022-03-20",
      MaturityDate: "2023-03-20"
    },
    {
      InvestmentID: "INV004",
      Investor: "Siddharth Jadhav",
      InvestorID: "I4",
      Amount: 100000,
      ROI: "10%",
      Contract: "contract_INV004.pdf",
      InvestmentDate: "2022-04-05",
      MaturityDate: "2023-04-05"
    },
    {
      InvestmentID: "INV005",
      Investor: "Amrita Kapoor",
      InvestorID: "I5",
      Amount: 45000,
      ROI: "30%",
      Contract: "contract_INV005.pdf",
      InvestmentDate: "2022-05-15",
      MaturityDate: "2023-05-15"
    },
    {
      InvestmentID: "INV006",
      Investor: "Naveen Jain",
      InvestorID: "I6",
      Amount: 75000,
      ROI: "20%",
      Contract: "contract_INV006.pdf",
      InvestmentDate: "2022-06-10",
      MaturityDate: "2023-06-10"
    },
    {
      InvestmentID: "INV007",
      Investor: "Ritika Desai",
      InvestorID: "I7",
      Amount: 60000,
      ROI: "15%",
      Contract: "contract_INV007.pdf",
      InvestmentDate: "2022-07-15",
      MaturityDate: "2023-07-15"
    },
    {
      InvestmentID: "INV008",
      Investor: "Arjun Chawla",
      InvestorID: "I8",
      Amount: 52000,
      ROI: "18%",
      Contract: "contract_INV008.pdf",
      InvestmentDate: "2022-08-01",
      MaturityDate: "2023-08-01"
    },
    {
      InvestmentID: "INV009",
      Investor: "Shalini Reddy",
      InvestorID: "I9",
      Amount: 94000,
      ROI: "25%",
      Contract: "contract_INV009.pdf",
      InvestmentDate: "2022-09-20",
      MaturityDate: "2023-09-20"
    },
    {
      InvestmentID: "INV010",
      Investor: "Rahul Mehta",
      InvestorID: "I10",
      Amount: 85000,
      ROI: "10%",
      Contract: "contract_INV010.pdf",
      InvestmentDate: "2022-10-15",
      MaturityDate: "2023-10-15"
    },
    {
      InvestmentID: "INV011",
      Investor: "Kavya Bansal",
      InvestorID: "I11",
      Amount: 130000,
      ROI: "12%",
      Contract: "contract_INV011.pdf",
      InvestmentDate: "2022-11-05",
      MaturityDate: "2023-11-05"
    },
    {
      InvestmentID: "INV012",
      Investor: "Varun Bhatt",
      InvestorID: "I12",
      Amount: 47000,
      ROI: "22%",
      Contract: "contract_INV012.pdf",
      InvestmentDate: "2022-12-10",
      MaturityDate: "2023-12-10"
    },
    {
      InvestmentID: "INV013",
      Investor: "Meera Krishnan",
      InvestorID: "I13",
      Amount: 78000,
      ROI: "18%",
      Contract: "contract_INV013.pdf",
      InvestmentDate: "2023-01-20",
      MaturityDate: "2024-01-20"
    },
    {
      InvestmentID: "INV014",
      Investor: "Arnav Shah",
      InvestorID: "I14",
      Amount: 92000,
      ROI: "25%",
      Contract: "contract_INV014.pdf",
      InvestmentDate: "2023-02-15",
      MaturityDate: "2024-02-15"
    },
    {
      InvestmentID: "INV015",
      Investor: "Ishita Malhotra",
      InvestorID: "I15",
      Amount: 150000,
      ROI: "8%",
      Contract: "contract_INV015.pdf",
      InvestmentDate: "2023-03-05",
      MaturityDate: "2024-03-05"
    },
    {
      InvestmentID: "INV016",
      Investor: "Vivek Chaturvedi",
      InvestorID: "I16",
      Amount: 30000,
      ROI: "20%",
      Contract: "contract_INV016.pdf",
      InvestmentDate: "2023-04-20",
      MaturityDate: "2024-04-20"
    },
    {
      InvestmentID: "INV017",
      Investor: "Simran Kaur",
      InvestorID: "I17",
      Amount: 67000,
      ROI: "18%",
      Contract: "contract_INV017.pdf",
      InvestmentDate: "2023-05-15",
      MaturityDate: "2024-05-15"
    },
    {
      InvestmentID: "INV018",
      Investor: "Manish Gupta",
      InvestorID: "I18",
      Amount: 59000,
      ROI: "12%",
      Contract: "contract_INV018.pdf",
      InvestmentDate: "2023-06-10",
      MaturityDate: "2024-06-10"
    },
    {
      InvestmentID: "INV019",
      Investor: "Rajesh Patil",
      InvestorID: "I19",
      Amount: 120000,
      ROI: "20%",
      Contract: "contract_INV019.pdf",
      InvestmentDate: "2023-07-15",
      MaturityDate: "2024-07-15"
    },
    {
      InvestmentID: "INV020",
      Investor: "Alisha Verma",
      InvestorID: "I20",
      Amount: 105000,
      ROI: "15%",
      Contract: "contract_INV020.pdf",
      InvestmentDate: "2023-08-01",
      MaturityDate: "2024-08-01"
    }
  ];  

  const handleCreateInvestmentClick = () => {
    navigate("/create/investment");
  };

  return (
    <div className="w-full flex flex-col bg-[#322323] min-h-[calc(100vh-64px)] pb-2">
      <div className="flex justify-center items-center w-full px-10 py-2 relative mt-5">
        <h1 className="text-4xl font-bold text-[#FF9321]">Investments</h1>
        <button
          onClick={handleCreateInvestmentClick}
          className="absolute right-10 px-4 py-2 bg-[#FF9321] border border-[#FF9321] text-white rounded-md hover:border-white mr-48"
        >
          Create Investment
        </button>
      </div>
      <InvestmentsTable row={data} col={col} small={false} clickable={true} />
    </div>
  );
};

export default Investments;
