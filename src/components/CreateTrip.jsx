// src/components/CreateTrip.jsx

import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from "../api/axios.js";
import { toast } from 'react-toastify';
import { AdminContext } from "../contexts/AdminContext.jsx"; // Import AdminContext

const CreateTrip = () => {
  const navigate = useNavigate();
  const { admin, token } = useContext(AdminContext); // Access admin and token if needed

  const initialValues = {
    NumberPlate: "",
    to: "",
    from: "",
    startDate: "",
    endDate: "",
  };

  const validationSchema = Yup.object({
    NumberPlate: Yup.string()
      .required('Number Plate is required.')
      .trim(),
    to: Yup.string()
      .required('Destination (To) is required.')
      .trim(),
    from: Yup.string()
      .required('Origin (From) is required.')
      .trim(),
    startDate: Yup.date()
      .required('Start Date is required.'),
    endDate: Yup.date()
      .required('End Date is required.')
      .min(Yup.ref('startDate'), 'End Date cannot be before Start Date.'),
  });

  const handleSubmit = async (values, { setSubmitting, setFieldError, resetForm }) => {
    try {
      const response = await axios.post("/trips", values);
      if (response.status === 201) {
        toast.success("Trip created successfully!");
        navigate("/trips");
      }
    } catch (error) {
      if (error.response) {
        const { error: errorMessage } = error.response.data;
        if (errorMessage) {
          // Determine which field the error relates to
          if (errorMessage.toLowerCase().includes('numberplate')) {
            setFieldError('NumberPlate', errorMessage);
          } else if (errorMessage.toLowerCase().includes('to')) {
            setFieldError('to', errorMessage);
          } else if (errorMessage.toLowerCase().includes('from')) {
            setFieldError('from', errorMessage);
          } else {
            setFieldError('general', errorMessage);
          }
          toast.error(errorMessage);
        } else {
          setFieldError('general', "Failed to create trip. Please try again.");
          toast.error("Failed to create trip. Please try again.");
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
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#322323]">
      <div className="bg-[#493939] shadow-2xl rounded-3xl p-8 w-full max-w-lg mx-auto flex flex-col">
        <h3 className="text-2xl font-bold mb-6 text-center text-white">
          Create New Trip
        </h3>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, errors }) => (
            <Form className="space-y-4">
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
              {/* To */}
              <div>
                <label className="block text-white mb-1 pl-1 font-bold">
                  To
                </label>
                <Field
                  type="text"
                  name="to"
                  className={`w-full px-4 py-2 rounded-xl border-2 ${
                    errors.to ? 'border-red-500' : 'border-white'
                  } bg-white focus:outline-none focus:border-[#FF9321] transition duration-200`}
                  placeholder="Enter Destination"
                />
                <ErrorMessage name="to" component="div" className="text-red-500 text-sm mt-1" />
              </div>
              {/* From */}
              <div>
                <label className="block text-white mb-1 pl-1 font-bold">
                  From
                </label>
                <Field
                  type="text"
                  name="from"
                  className={`w-full px-4 py-2 rounded-xl border-2 ${
                    errors.from ? 'border-red-500' : 'border-white'
                  } bg-white focus:outline-none focus:border-[#FF9321] transition duration-200`}
                  placeholder="Enter Origin"
                />
                <ErrorMessage name="from" component="div" className="text-red-500 text-sm mt-1" />
              </div>
              {/* Start Date */}
              <div>
                <label className="block text-white mb-1 pl-1 font-bold">
                  Start Date
                </label>
                <Field
                  type="date"
                  name="startDate"
                  className={`w-full px-4 py-2 rounded-xl border-2 ${
                    errors.startDate ? 'border-red-500' : 'border-white'
                  } bg-white focus:outline-none focus:border-[#FF9321] transition duration-200`}
                />
                <ErrorMessage name="startDate" component="div" className="text-red-500 text-sm mt-1" />
              </div>
              {/* End Date */}
              <div>
                <label className="block text-white mb-1 pl-1 font-bold">
                  End Date
                </label>
                <Field
                  type="date"
                  name="endDate"
                  className={`w-full px-4 py-2 rounded-xl border-2 ${
                    errors.endDate ? 'border-red-500' : 'border-white'
                  } bg-white focus:outline-none focus:border-[#FF9321] transition duration-200`}
                />
                <ErrorMessage name="endDate" component="div" className="text-red-500 text-sm mt-1" />
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
                {isSubmitting ? "Creating Trip..." : "Create Trip"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default CreateTrip;
