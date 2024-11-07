// src/components/CreateInvestment.jsx

import React from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from "../api/axios.js";
import { toast } from 'react-toastify';

const CreateInvestment = () => {
  const navigate = useNavigate();

  const initialValues = {
    InvestmentID: "",
    InvestorName: "",
    InvestorID: "",
    Amount: "",
    ROI: "",
    Contract: null, // For file upload
    DepositDate: "",
    MaturityDate: "",
  };

  const validationSchema = Yup.object({
    InvestmentID: Yup.string()
      .required('Investment ID is required.')
      .trim(),
    InvestorName: Yup.string()
      .required('Investor Name is required.')
      .trim(),
    InvestorID: Yup.string()
      .required('Investor ID is required.')
      .trim(),
    Amount: Yup.number()
      .required('Amount is required.')
      .positive('Amount must be positive.'),
    ROI: Yup.string()
      .required('ROI is required.')
      .matches(/^\d+%$/, 'ROI must be a percentage (e.g., 10%).'),
    DepositDate: Yup.date()
      .required('Deposit Date is required.'),
    MaturityDate: Yup.date()
      .required('Maturity Date is required.')
      .min(Yup.ref('DepositDate'), 'Maturity Date cannot be before Deposit Date.'),
  });

  const handleSubmit = async (values, { setSubmitting, setFieldError, resetForm }) => {
    try {
      const formData = new FormData();
      formData.append("InvestmentID", values.InvestmentID);
      formData.append("InvestorName", values.InvestorName);
      formData.append("InvestorID", values.InvestorID);
      formData.append("Amount", values.Amount);
      formData.append("ROI", values.ROI);
      formData.append("DepositDate", values.DepositDate);
      formData.append("MaturityDate", values.MaturityDate);
      if (values.Contract) {
        formData.append("Contract", values.Contract);
      }

      const response = await axios.post("/investments", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 201) {
        toast.success("Investment created successfully!");
        navigate("/investments");
      }
    } catch (error) {
      if (error.response) {
        const { error: errorMessage } = error.response.data;
        if (errorMessage) {
          // Determine which field the error relates to
          if (errorMessage.toLowerCase().includes('investmentid')) {
            setFieldError('InvestmentID', errorMessage);
          } else if (errorMessage.toLowerCase().includes('investorname')) {
            setFieldError('InvestorName', errorMessage);
          } else if (errorMessage.toLowerCase().includes('investorid')) {
            setFieldError('InvestorID', errorMessage);
          } else if (errorMessage.toLowerCase().includes('amount')) {
            setFieldError('Amount', errorMessage);
          } else if (errorMessage.toLowerCase().includes('roi')) {
            setFieldError('ROI', errorMessage);
          } else if (errorMessage.toLowerCase().includes('depositdate')) {
            setFieldError('DepositDate', errorMessage);
          } else if (errorMessage.toLowerCase().includes('maturitydate')) {
            setFieldError('MaturityDate', errorMessage);
          } else {
            setFieldError('general', errorMessage);
          }
          toast.error(errorMessage);
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
    // Handle file upload logic here
    console.log("Uploaded file:", file);
    setFieldValue("Contract", file);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#322323]">
      <div className="bg-[#493939] shadow-2xl rounded-3xl p-8 w-full max-w-lg mx-auto flex flex-col">
        <h3 className="text-2xl font-bold mb-6 text-center text-white">
          Create New Investment
        </h3>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, errors, setFieldValue }) => (
            <Form className="space-y-4">
              {/* Investment ID */}
              <div>
                <label className="block text-white mb-1 pl-1 font-bold">
                  Investment ID
                </label>
                <Field
                  type="text"
                  name="InvestmentID"
                  className={`w-full px-4 py-2 rounded-xl border-2 ${
                    errors.InvestmentID ? 'border-red-500' : 'border-white'
                  } bg-white focus:outline-none focus:border-[#FF9321] transition duration-200`}
                  placeholder="Enter Investment ID"
                />
                <ErrorMessage name="InvestmentID" component="div" className="text-red-500 text-sm mt-1" />
              </div>
              {/* Investor Name */}
              <div>
                <label className="block text-white mb-1 pl-1 font-bold">
                  Investor Name
                </label>
                <Field
                  type="text"
                  name="InvestorName"
                  className={`w-full px-4 py-2 rounded-xl border-2 ${
                    errors.InvestorName ? 'border-red-500' : 'border-white'
                  } bg-white focus:outline-none focus:border-[#FF9321] transition duration-200`}
                  placeholder="Enter Investor Name"
                />
                <ErrorMessage name="InvestorName" component="div" className="text-red-500 text-sm mt-1" />
              </div>
              {/* Investor ID */}
              <div>
                <label className="block text-white mb-1 pl-1 font-bold">
                  Investor ID
                </label>
                <Field
                  type="text"
                  name="InvestorID"
                  className={`w-full px-4 py-2 rounded-xl border-2 ${
                    errors.InvestorID ? 'border-red-500' : 'border-white'
                  } bg-white focus:outline-none focus:border-[#FF9321] transition duration-200`}
                  placeholder="Enter Investor ID"
                />
                <ErrorMessage name="InvestorID" component="div" className="text-red-500 text-sm mt-1" />
              </div>
              {/* Amount */}
              <div>
                <label className="block text-white mb-1 pl-1 font-bold">
                  Amount
                </label>
                <Field
                  type="number"
                  name="Amount"
                  className={`w-full px-4 py-2 rounded-xl border-2 ${
                    errors.Amount ? 'border-red-500' : 'border-white'
                  } bg-white focus:outline-none focus:border-[#FF9321] transition duration-200`}
                  placeholder="Enter Amount"
                />
                <ErrorMessage name="Amount" component="div" className="text-red-500 text-sm mt-1" />
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
                  Contract
                </label>
                <input
                  type="file"
                  name="Contract"
                  onChange={(e) => handleFileUpload(e, setFieldValue)}
                  className={`w-full px-4 py-2 rounded-xl border-2 ${
                    errors.Contract ? 'border-red-500' : 'border-white'
                  } bg-white focus:outline-none focus:border-[#FF9321] transition duration-200`}
                />
                <ErrorMessage name="Contract" component="div" className="text-red-500 text-sm mt-1" />
              </div>
              {/* Deposit Date */}
              <div>
                <label className="block text-white mb-1 pl-1 font-bold">
                  Deposit Date
                </label>
                <Field
                  type="date"
                  name="DepositDate"
                  className={`w-full px-4 py-2 rounded-xl border-2 ${
                    errors.DepositDate ? 'border-red-500' : 'border-white'
                  } bg-white focus:outline-none focus:border-[#FF9321] transition duration-200`}
                />
                <ErrorMessage name="DepositDate" component="div" className="text-red-500 text-sm mt-1" />
              </div>
              {/* Maturity Date */}
              <div>
                <label className="block text-white mb-1 pl-1 font-bold">
                  Maturity Date
                </label>
                <Field
                  type="date"
                  name="MaturityDate"
                  className={`w-full px-4 py-2 rounded-xl border-2 ${
                    errors.MaturityDate ? 'border-red-500' : 'border-white'
                  } bg-white focus:outline-none focus:border-[#FF9321] transition duration-200`}
                />
                <ErrorMessage name="MaturityDate" component="div" className="text-red-500 text-sm mt-1" />
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

