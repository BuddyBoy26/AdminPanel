import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from "../api/axios.js";
import { toast } from 'react-toastify';
import Select from 'react-select';
import { AdminContext } from "../contexts/AdminContext.jsx"; // Import AdminContext

const CreateInvestment = () => {
  const navigate = useNavigate();
  const { admin, token } = useContext(AdminContext); // Access admin and token

  const [allInvestors, setAllInvestors] = useState([]);
  const [filteredInvestors, setFilteredInvestors] = useState([]);

  useEffect(() => {
    // Fetch all investors on component mount
    const fetchInvestors = async () => {
      try {
        const response = await axios.get("/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const investors = response.data.users.map(user => ({
          name: user.name,
          userId: user.userId,
          _id: user._id,
        }));
        setAllInvestors(investors);
        setFilteredInvestors(investors); // Initially display all
      } catch (error) {
        console.error("Error fetching investors:", error);
        toast.error("Failed to load investors. Please try again.");
      }
    };

    fetchInvestors();
  }, [token]);

  const today = new Date();
  const nextYear = new Date(today);
  nextYear.setFullYear(today.getFullYear() + 1);

  const initialValues = {
    investorName: null, // Will store the selected investor object
    investorID: null,   // Will store the selected investor object
    amount: "",
    ROI: "",
    contract: null, // For file upload
    investmentDate: today.toISOString().split('T')[0], // Today's date
    maturityDate: nextYear.toISOString().split('T')[0], // One year from today
  };

  const validationSchema = Yup.object({
    investorName: Yup.object()
      .required('Investor Name is required.'),
    investorID: Yup.object()
      .required('Investor ID is required.'),
    amount: Yup.number()
      .required('Amount is required.')
      .positive('Amount must be positive.'),
    ROI: Yup.string()
      .required('ROI is required.')
      .matches(/^\d+%$/, 'ROI must be a percentage (e.g., 10%).'),
    investmentDate: Yup.date()
      .required('Deposit Date is required.'),
    maturityDate: Yup.date()
      .required('Maturity Date is required.')
      .min(Yup.ref('investmentDate'), 'Maturity Date cannot be before Deposit Date.'),
    contract: Yup.mixed()
      .required('Contract PDF is required.')
      .test(
        "fileFormat",
        "Unsupported Format",
        value => value && ["application/pdf"].includes(value.type)
      ),
  }).test('match-investor', 'Investor Name and ID do not match.', function (values) {
    const { investorName, investorID } = values;
    if (investorName && investorID) {
      return investorName._id === investorID._id;
    }
    return true;
  });

  const handleSubmit = async (values, { setSubmitting, setFieldError, resetForm }) => {
    try {
      const formData = new FormData();
      formData.append("investor", values.investorID._id); // Send investor ID
      formData.append("amount", values.amount);
      formData.append("ROI", parseInt(values.ROI.replace('%', '')));
      formData.append("investmentDate", values.investmentDate);
      formData.append("maturityDate", values.maturityDate);
      if (values.contract) {
        formData.append("contract", values.contract);
      }

      const response = await axios.post("/investments", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.status === 201) {
        toast.success("Investment created successfully!");
        navigate("/investments");
      }
    } catch (error) {
      if (error.response) {
        const { message } = error.response.data;
        if (message) {
          // Determine which field the error relates to
          if (message.toLowerCase().includes('investor')) {
            setFieldError('investorName', message);
            setFieldError('investorID', message);
          } else if (message.toLowerCase().includes('amount')) {
            setFieldError('amount', message);
          } else if (message.toLowerCase().includes('roi')) {
            setFieldError('ROI', message);
          } else if (message.toLowerCase().includes('investmentDate')) {
            setFieldError('investmentDate', message);
          } else if (message.toLowerCase().includes('maturitydate')) {
            setFieldError('maturityDate', message);
          } else if (message.toLowerCase().includes('contract')) {
            setFieldError('contract', message);
          } else {
            setFieldError('general', message);
          }
          toast.error(message);
        } else {
          setFieldError('general', "Failed to create investment. Please try again.");
          toast.error("Failed to create investment. Please try again.");
        }
      } else if (error.request) {
        setFieldError('general', "No response from server. Please try again later.");
        toast.error("No response from server. Please try again later.");
      } else {
        setFieldError('general', "An unexpected error occurred.");
        toast.error("An unexpected error occurred.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleFileUpload = (e, setFieldValue) => {
    const file = e.target.files[0];
    if (file) {
      setFieldValue("contract", file);
    }
  };

  // Handle search input changes for frontend filtering
  const handleInvestorNameChange = (selectedOption, setFieldValue) => {
    setFieldValue('investorName', selectedOption);
    if (selectedOption) {
      const correspondingInvestor = allInvestors.find(inv => inv._id === selectedOption._id);
      setFieldValue('investorID', correspondingInvestor ? {
        label: correspondingInvestor.userId,
        value: correspondingInvestor._id,
        _id: correspondingInvestor._id,
        userId: correspondingInvestor.userId,
      } : null);
    } else {
      setFieldValue('investorID', null);
    }
  };

  const handleInvestorIDChange = (selectedOption, setFieldValue) => {
    setFieldValue('investorID', selectedOption);
    if (selectedOption) {
      const correspondingInvestor = allInvestors.find(inv => inv._id === selectedOption._id);
      setFieldValue('investorName', correspondingInvestor ? {
        label: correspondingInvestor.name,
        value: correspondingInvestor._id,
        _id: correspondingInvestor._id,
      } : null);
    } else {
      setFieldValue('investorName', null);
    }
  };

  // Frontend filtering functions
  const filterInvestorsByName = (inputValue) => {
    return allInvestors.filter(inv =>
      inv.name.toLowerCase().includes(inputValue.toLowerCase())
    ).map(user => ({
      label: user.name,
      value: user._id,
      _id: user._id,
      userId: user.userId,
    }));
  };

  const filterInvestorsByID = (inputValue) => {
    return allInvestors.filter(inv =>
      inv.userId.toLowerCase().includes(inputValue.toLowerCase())
    ).map(user => ({
      label: user.userId,
      value: user._id,
      _id: user._id,
      name: user.name,
    }));
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-[#322323]">
      <div className="bg-[#493939] shadow-2xl rounded-3xl p-8 w-full max-w-xl mx-auto flex flex-col">
        <h3 className="text-3xl font-bold mb-6 text-center text-white">
          Create New Investment
        </h3>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, errors, setFieldValue, values }) => (
            <Form className="space-y-6">
              {/* Investor Name */}
              <div>
                <label className="block text-white mb-1 pl-1 font-bold">
                  Investor Name
                </label>
                <Select
                  options={filterInvestorsByName("")} // Display all when no input
                  onInputChange={(inputValue) => {
                    setFilteredInvestors(filterInvestorsByName(inputValue));
                  }}
                  onChange={(selectedOption) => handleInvestorNameChange(selectedOption, setFieldValue)}
                  value={values.investorName}
                  placeholder="Select Investor Name"
                  isClearable
                  className={`react-select-container ${errors.investorName ? 'border-red-500' : 'border-white'}`}
                  classNamePrefix="react-select"
                />
                <ErrorMessage name="investorName" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              {/* Investor ID */}
              <div>
                <label className="block text-white mb-1 pl-1 font-bold">
                  Investor ID
                </label>
                <Select
                  options={filterInvestorsByID("")} // Display all when no input
                  onInputChange={(inputValue) => {
                    setFilteredInvestors(filterInvestorsByID(inputValue));
                  }}
                  onChange={(selectedOption) => handleInvestorIDChange(selectedOption, setFieldValue)}
                  value={values.investorID}
                  placeholder="Select Investor ID"
                  isClearable
                  className={`react-select-container ${errors.investorID ? 'border-red-500' : 'border-white'}`}
                  classNamePrefix="react-select"
                />
                <ErrorMessage name="investorID" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              {/* Amount */}
              <div>
                <label className="block text-white mb-1 pl-1 font-bold">
                  Amount
                </label>
                <Field
                  type="number"
                  name="amount"
                  className={`w-full px-4 py-2 rounded-xl border-2 ${
                    errors.amount ? 'border-red-500' : 'border-white'
                  } bg-white focus:outline-none focus:border-[#FF9321] transition duration-200`}
                  placeholder="Enter Amount"
                />
                <ErrorMessage name="amount" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              {/* ROI */}
              <div>
                <label className="block text-white mb-1 pl-1 font-bold">
                  ROI (%)
                </label>
                <Field
                  type="text"
                  name="ROI"
                  className={`w-full px-4 py-2 rounded-xl border-2 ${
                    errors.ROI ? 'border-red-500' : 'border-white'
                  } bg-white focus:outline-none focus:border-[#FF9321] transition duration-200`}
                  placeholder="Enter ROI (e.g., 15%)"
                />
                <ErrorMessage name="ROI" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              {/* Contract */}
              <div>
                <label className="block text-white mb-1 pl-1 font-bold">
                  Contract (PDF)
                </label>
                <input
                  type="file"
                  name="contract"
                  accept="application/pdf"
                  onChange={(e) => handleFileUpload(e, setFieldValue)}
                  className={`w-full px-4 py-2 rounded-xl border-2 ${
                    errors.contract ? 'border-red-500' : 'border-white'
                  } bg-white focus:outline-none focus:border-[#FF9321] transition duration-200`}
                />
                <ErrorMessage name="contract" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              {/* Deposit Date */}
              <div>
                <label className="block text-white mb-1 pl-1 font-bold">
                  Deposit Date
                </label>
                <Field
                  type="date"
                  name="investmentDate"
                  className={`w-full px-4 py-2 rounded-xl border-2 ${
                    errors.investmentDate ? 'border-red-500' : 'border-white'
                  } bg-white focus:outline-none focus:border-[#FF9321] transition duration-200`}
                />
                <ErrorMessage name="investmentDate" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              {/* Maturity Date */}
              <div>
                <label className="block text-white mb-1 pl-1 font-bold">
                  Maturity Date
                </label>
                <Field
                  type="date"
                  name="maturityDate"
                  className={`w-full px-4 py-2 rounded-xl border-2 ${
                    errors.maturityDate ? 'border-red-500' : 'border-white'
                  } bg-white focus:outline-none focus:border-[#FF9321] transition duration-200`}
                />
                <ErrorMessage name="maturityDate" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              {/* General Error */}
              {errors.general && (
                <p className="text-red-500 text-center">{errors.general}</p>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-[#FF9321] text-white text-lg py-2 rounded-xl hover:bg-[#e6821e] transition duration-300"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating Investment..." : "Create Investment"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default CreateInvestment;

