import React from 'react';
import { Map, Phone, Mail } from 'lucide-react';

const ContactForm = () => {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen px-4 py-8 sm:py-16">
      {/* Feature Boxes */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-black mb-2">
          BHAVYA
        </h1>
        <p className="text-2xl italic  font-semibold">
          Haulage Services
        </p>
      </div>
      <div className="container mx-auto mb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureBox icon={<Map size={48} />} title="Find Us" content="Oﬃce 1420 - JAFZA 1 Tower, P.O. Box 124707 Jebel Ali Freezone, Dubai - U.A.E" />
          <FeatureBox icon={<Phone size={48} />} title="Call Us" content="+971 54 402 2577" />
          <FeatureBox icon={<Mail size={48} />} title="Mail" content="info@bhavya.ae" />
        </div>
      </div>

      {/* Contact Form */}
      <div className="container mx-auto max-w-md">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-700 to-purple-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
          <div className="relative bg-indigo-400 shadow-lg sm:rounded-3xl px-6 py-10 sm:p-16">
            <div className="text-center pb-6">
              <h1 className="text-3xl text-white font-bold">Contact Us!</h1>
              <p className="text-gray-200 mt-2">
                Fill up the form below to send us a message.
              </p>
            </div>
            <form className="space-y-6">
              <InputField type="text" placeholder="Name" name="name" />
              <InputField type="email" placeholder="Email" name="email" />
              <InputField type="text" placeholder="Subject" name="_subject" />
              <textarea
                className="w-full px-4 py-3 rounded-lg bg-indigo-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                placeholder="Type your message here..."
                name="message"
                rows="4"
              ></textarea>
              <div className="flex justify-between">
                <FormButton type="submit" value="Send ➤" />
                <FormButton type="reset" value="Reset" />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

const FeatureBox = ({ icon, title, content }) => (
  <div className="bg-white rounded-lg shadow-lg p-8">
    <div className="text-indigo-500 w-16 h-16 mx-auto mb-4">
      {icon}
    </div>
    <h3 className="font-semibold text-center mb-2 text-xl">{title}</h3>
    <p className="text-gray-600 text-center text-lg">{content}</p>
  </div>
);

const InputField = ({ type, placeholder, name }) => (
  <input
    className="w-full px-4 py-3 rounded-lg bg-indigo-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-600"
    type={type}
    placeholder={placeholder}
    name={name}
  />
);

const FormButton = ({ type, value }) => (
  <input
    className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
    type={type}
    value={value}
  />
);

export default ContactForm;