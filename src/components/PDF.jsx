// src/GeneratePdf.js
import React from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const GeneratePdf = () => {
  // Your JSON data
  const data = [
    {
      date: "2024-12-25",
      time: "01:23:04",
      x: 55.1080666,
      y: 24.9985516,
      ignition: "",
      fuelLevel: "",
      mileage: "",
      event: ""
    },
    {
      date: "2024-12-25",
      time: "01:23:22",
      x: "",
      y: "",
      ignition: "",
      fuelLevel: "",
      mileage: 554004000,
      event: ""
    },
    {
      date: "2024-12-25",
      time: "02:23:04",
      x: 55.1080666,
      y: 24.9985516,
      ignition: "",
      fuelLevel: "",
      mileage: "",
      event: ""
    },
    {
      date: "2024-12-25",
      time: "02:28:22",
      x: "",
      y: "",
      ignition: "",
      fuelLevel: "",
      mileage: 554004006,
      event: ""
    },
    {
      date: "2024-12-25",
      time: "02:33:22",
      x: "",
      y: "",
      ignition: "",
      fuelLevel: "",
      mileage: 554004000,
      event: ""
    },
    {
      date: "2024-12-25",
      time: "03:23:04",
      x: 55.1080666,
      y: 24.9985516,
      ignition: "",
      fuelLevel: "",
      mileage: "",
      event: ""
    },
    {
      date: "2024-12-25",
      time: "04:19:32",
      x: 55.1080533,
      y: 24.9984433,
      ignition: "",
      fuelLevel: "",
      mileage: "",
      event: ""
    },
    {
      date: "2024-12-25",
      time: "04:19:33",
      x: 55.1080533,
      y: 24.9984433,
      ignition: "",
      fuelLevel: "",
      mileage: "",
      event: ""
    },
  ];

  const generatePdf = () => {
    const doc = new jsPDF();

    // Define the table columns
    const tableColumn = ["Date", "Time", "X", "Y", "Ignition", "Fuel Level", "Mileage", "Event"];
    
    // Map the JSON data to table rows
    const tableRows = data.map(item => 
        Object.values(item)
    //   item.date || '-',
    //   item.time || '-',
    //   item.x !== "" ? item.x : '-',
    //   item.y !== "" ? item.y : '-',
    //   item.ignition || '-',
    //   item.fuelLevel || '-',
    //   item.mileage !== "" ? item.mileage : '-',
    //   item.event || '-',
    );
    console.log(data)
    console.log(tableRows)

    // Add a title to the PDF
    doc.setFontSize(18);
    doc.text("JSON Data Table", 14, 22);

    // Add the table
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 30,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [22, 160, 133] },
      alternateRowStyles: { fillColor: [238, 238, 238] },
      theme: 'striped',
      didDrawPage: (data) => {
        // Optional: Add page numbers or other footer/header content
      },
    });

    // Save the PDF
    doc.save("table.pdf");
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>JSON to PDF</h1>
      <button onClick={generatePdf} style={buttonStyle}>
        Download PDF
      </button>
    </div>
  );
};

// Optional: Styling for the button
const buttonStyle = {
  padding: '10px 20px',
  fontSize: '16px',
  backgroundColor: '#16a085',
  color: '#fff',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
};

export default GeneratePdf;
