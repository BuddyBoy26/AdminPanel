// src/components/CreateAsset.jsx

import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from "../api/axios.js";
import { toast } from 'react-toastify';
import { AdminContext } from "../contexts/AdminContext.jsx"; // Import AdminContext

const CreateAsset = () => {
  const navigate = useNavigate();
  const { admin, token } = useContext(AdminContext); // Access admin and token if needed

  const [investments, setInvestments] = useState([]);
  const [loadingInvestments, setLoadingInvestments] = useState(true);
  const [investmentsError, setInvestmentsError] = useState(null);

  useEffect(() => {
    const fetchInvestments = async () => {
      try {
        const response = await axios.get("/investments", {
          headers: {
            Authorization: `Bearer ${token}`, // Include token if required
          },
        });
        setInvestments(response.data.investments);
      } catch (error) {
        console.error("Failed to fetch investments:", error);
        setInvestmentsError("Failed to load investments. Please try again.");
        toast.error("Failed to load investments. Please try again.");
      } finally {
        setLoadingInvestments(false);
      }
    };

    fetchInvestments();
  }, [token]);

  const initialValues = {
    NumberPlate: "",
    investment: "",
    Type: "",
    Brand: "",
    Model: "",
  };

  const validationSchema = Yup.object({
    NumberPlate: Yup.string()
      .required('Number Plate is required.')
      .trim(),
    investment: Yup.string()
      .required('Investment is required.'),
    Type: Yup.string()
      .required('Type is required.')
      .trim(),
    Brand: Yup.string()
      .required('Brand is required.')
      .trim(),
    Model: Yup.string()
      .required('Model is required.')
      .trim(),
  });

  const handleSubmit = async (values, { setSubmitting, setFieldError, resetForm }) => {
    try {
      const response = await axios.post("/assets", values, {
        headers: {
          Authorization: `Bearer ${token}`, // Include token if required
        },
      });
      if (response.status === 201) {
        toast.success("Asset created successfully!");
        navigate("/assets");
      }
    } catch (error) {
      if (error.response) {
        const { error: errorMessage } = error.response.data;
        if (errorMessage) {
          // Determine which field the error relates to
          if (errorMessage.toLowerCase().includes('numberplate')) {
            setFieldError('NumberPlate', errorMessage);
          } else if (errorMessage.toLowerCase().includes('investment')) {
            setFieldError('investment', errorMessage);
          } else if (errorMessage.toLowerCase().includes('type')) {
            setFieldError('Type', errorMessage);
          } else if (errorMessage.toLowerCase().includes('brand')) {
            setFieldError('Brand', errorMessage);
          } else if (errorMessage.toLowerCase().includes('model')) {
            setFieldError('Model', errorMessage);
          } else {
            setFieldError('general', errorMessage);
          }
          toast.error(errorMessage);
        } else {
          setFieldError('general', "Failed to create asset. Please try again.");
          toast.error("Failed to create asset. Please try again.");
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

  return (
    <div className="min-h-screen flex items-center w-full justify-center p-4 bg-[#322323]">
      <div className="bg-[#493939] shadow-2xl rounded-3xl p-8 w-full max-w-xl mx-auto flex flex-col h-full">
        <h3 className="text-3xl font-bold mb-6 text-center text-white">
          Create New Asset
        </h3>
        {loadingInvestments ? (
          <div className="text-white text-center">Loading investments...</div>
        ) : investmentsError ? (
          <div className="text-red-500 text-center">{investmentsError}</div>
        ) : (
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, errors }) => (
              <Form className="space-y-6 flex-1 flex flex-col justify-between">
                {/* Number Plate */}
                <div>
                  <label className="block text-white mb-1 pl-1 font-bold">
                    Number Plate
                  </label>
                  <Field
                    type="text"
                    name="NumberPlate"
                    className={`w-full px-4 py-2 rounded-xl border-2 ${
                      errors.NumberPlate ? 'border-red-500' : 'border-white'
                    } bg-white focus:outline-none focus:border-[#FF9321] transition duration-200`}
                    placeholder="Enter Number Plate"
                  />
                  <ErrorMessage name="NumberPlate" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                {/* Investment Dropdown */}
                <div>
                  <label className="block text-white mb-1 pl-1 font-bold">
                    Investment
                  </label>
                  <Field
                    as="select"
                    name="investment"
                    className={`w-full px-4 py-2 rounded-xl border-2 ${
                      errors.investment ? 'border-red-500' : 'border-white'
                    } bg-white focus:outline-none focus:border-[#FF9321] transition duration-200`}
                  >
                    <option value="">Select Investment</option>
                    {investments.map((investment) => (
                      <option key={investment._id} value={investment._id}>
                        {investment.name} - {investment.investmentDate ? new Date(investment.investmentDate).toLocaleDateString() : 'N/A'}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage name="investment" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                {/* Type */}
                <div>
                  <label className="block text-white mb-1 pl-1 font-bold">
                    Type
                  </label>
                  <Field
                    type="text"
                    name="Type"
                    className={`w-full px-4 py-2 rounded-xl border-2 ${
                      errors.Type ? 'border-red-500' : 'border-white'
                    } bg-white focus:outline-none focus:border-[#FF9321] transition duration-200`}
                    placeholder="Enter Asset Type (e.g., Car, Van)"
                  />
                  <ErrorMessage name="Type" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                {/* Brand */}
                <div>
                  <label className="block text-white mb-1 pl-1 font-bold">
                    Brand
                  </label>
                  <Field
                    type="text"
                    name="Brand"
                    className={`w-full px-4 py-2 rounded-xl border-2 ${
                      errors.Brand ? 'border-red-500' : 'border-white'
                    } bg-white focus:outline-none focus:border-[#FF9321] transition duration-200`}
                    placeholder="Enter Brand"
                  />
                  <ErrorMessage name="Brand" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                {/* Model */}
                <div>
                  <label className="block text-white mb-1 pl-1 font-bold">
                    Model
                  </label>
                  <Field
                    type="text"
                    name="Model"
                    className={`w-full px-4 py-2 rounded-xl border-2 ${
                      errors.Model ? 'border-red-500' : 'border-white'
                    } bg-white focus:outline-none focus:border-[#FF9321] transition duration-200`}
                    placeholder="Enter Model"
                  />
                  <ErrorMessage name="Model" component="div" className="text-red-500 text-sm mt-1" />
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
                  {isSubmitting ? "Creating Asset..." : "Create Asset"}
                </button>
              </Form>
            )}
          </Formik>
        )}
      </div>
    </div>
  );
};

export default CreateAsset;
