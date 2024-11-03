import React from "react";
import { ArrowRight, Mail, Phone, MapPin, Cake, User } from "lucide-react";
import { Link as RouteLink } from "react-router-dom";

const Card = ({ className, children }) => (
  <div className={`bg-[#493939] shadow-md rounded-lg ${className}`}>{children}</div>
);

const CardHeader = ({ children }) => (
  <div className="p-4 border-b border-[#FF9321]">{children}</div>
);

const CardContent = ({ children }) => <div className="p-4">{children}</div>;

const user = {
  name: "Antariksh",
  phone: 9748794406,
  email: "anta@gmail.com",
  DOB: "10/12/2005",
  address:
    "Indian Institute of Technology Kharagpur 721302, West Bengal, India",
  gender: "Male",
};

const ProfileCard = ({ title, children }) => (
  <Card className="w-full max-w-3xl mx-auto my-4">
    <CardHeader>
      <h3 className="text-xl font-semibold text-[#FF9321] text-center">
        {title}
      </h3>
    </CardHeader>
    <CardContent>{children}</CardContent>
  </Card>
);

const ProfileItem = ({ icon: Icon, label, value }) => (
  <div className="flex items-center py-2 border-b border-gray-600 last:border-b-0">
    <Icon className="w-5 h-5 text-[#FF9321] mr-3" />
    <div>
      <p className="font-medium text-white">{label}</p>
      <p className="text-gray-300">{value}</p>
    </div>
  </div>
);

function Profile() {
  const convertDate = (dateStr) => {
    const [day, month, year] = dateStr.split("/");
    const date = new Date(`${year}-${month}-${day}`);
    return new Intl.DateTimeFormat("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date);
  };

  return (
    <div className="w-full flex flex-col bg-[#322323] min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto bg-[#493939] shadow-lg rounded-lg overflow-hidden">
        <div className="bg-[#FF9321] p-6 text-center">
          <img
            className="h-32 w-32 rounded-full border-4 border-white mx-auto mb-4"
            src="unnamed.gif"
            alt={user.name}
          />
          <h1 className="text-3xl font-bold text-white mb-2">{user.name}</h1>
        </div>

        <div className="p-6 flex flex-col items-center">
          <ProfileCard title="Personal Information">
            <ProfileItem icon={User} label="Name" value={user.name} />
            <ProfileItem
              icon={Cake}
              label="Birthday"
              value={convertDate(user.DOB)}
            />
            <ProfileItem icon={User} label="Gender" value={user.gender} />
          </ProfileCard>

          <ProfileCard title="Contact Information">
            <ProfileItem icon={Mail} label="Email" value={user.email} />
            <ProfileItem icon={Phone} label="Phone" value={user.phone} />
            <ProfileItem icon={MapPin} label="Address" value={user.address} />
          </ProfileCard>
        </div>
      </div>
    </div>
  );
}

export default Profile;
