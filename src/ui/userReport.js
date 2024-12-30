import jsPDF from 'jspdf';
import 'jspdf-autotable';
    
    async function userReport(data, logoUrl = "logo_bhavya.png") {
      const doc = new jsPDF("p", "pt", "a4");

      let currentY = 40; // Starting Y position

      // 1. Add Logo if provided
      if (logoUrl) {
        try {
          // Check if logoUrl is a Base64 string or a URL
          if (logoUrl.startsWith("data:image")) {
            // It's a Base64 string
            doc.addImage(logoUrl, "PNG", 40, currentY, 70, 70);
          } else {
            // It's a URL - Fetch and convert to Base64
            const response = await fetch(logoUrl);
            const blob = await response.blob();
            const reader = new FileReader();
            const dataURL = await new Promise((resolve, reject) => {
              reader.onloadend = () => resolve(reader.result);
              reader.onerror = reject;
              reader.readAsDataURL(blob);
            });
            doc.addImage(dataURL, "PNG", 40, currentY, 70, 70);
          }
          currentY += 80; // Adjust Y position after logo
        } catch (error) {
          console.error("Error loading logo:", error);
        }
      }

      // 2. Title
      doc.setFontSize(22);
      doc.setFont("helvetica", "bold");
      doc.text("User Profile", 40, currentY);
      currentY += 30;

      // 3. Basic User Information
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      const basicInfo = [
        { label: "Name", value: data.name },
        { label: "Email", value: data.email },
        { label: "Phone", value: data.phone },
        { label: "User ID", value: data.userId },
        { label: "User Type", value: data.userType },
        { label: "Profile Completed", value: data.isProfileComplete ? "Yes" : "No" },
        { label: "Gender", value: data.gender },
        { label: "OTP Verified", value: data.isOtpVerified ? "Yes" : "No" },
        { label: "Number of Trips", value: data.NoofTrips }
      ];

      basicInfo.forEach(info => {
        doc.text(`${info.label}: ${info.value}`, 40, currentY);
        currentY += 15;
      });

      // 4. Bank Details
      if (data.individualDetails && data.individualDetails.bankDetails) {
        currentY += 10;
        doc.setFontSize(16);
        doc.setFont("helvetica", "bold");
        doc.text("Bank Details", 40, currentY);
        currentY += 20;

        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");
        const bank = data.individualDetails.bankDetails;
        const bankInfo = [
          { label: "Account Number", value: bank.accountNumber },
          { label: "Bank Name", value: bank.bankName },
          { label: "IBAN", value: bank.IBAN },
          { label: "Swift Code", value: bank.swiftCode }
        ];

        bankInfo.forEach(info => {
          doc.text(`${info.label}: ${info.value}`, 40, currentY);
          currentY += 15;
        });
      }

      // 5. Passport Details
      if (data.individualDetails && data.individualDetails.passportDetails) {
        currentY += 10;
        doc.setFontSize(16);
        doc.setFont("helvetica", "bold");
        doc.text("Passport Details", 40, currentY);
        currentY += 20;

        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");
        const passport = data.individualDetails.passportDetails;
        const passportInfo = [
          { label: "Passport Number", value: passport.passportNumber },
          { label: "Place of Issue", value: passport.placeOfIssue },
          { label: "Date of Issue", value: new Date(passport.dateOfExpiry).toLocaleDateString(), },
          { label: "Date of Expiry", value: new Date(passport.dateOfIssue).toLocaleDateString(), }
        ];

        passportInfo.forEach(info => {
          doc.text(`${info.label}: ${info.value}`, 40, currentY);
          currentY += 15;
        });

        // Add Passport Copy Image if available
        // if (passport.passportCopy) {
        //   try {
        //     doc.text("Passport Copy:", 40, currentY + 15);
        //     // Adjust image size as needed
        //     doc.addImage(passport.passportCopy, "PNG", 40, currentY + 20, 100, 100);
        //     currentY += 130;
        //   } catch (error) {
        //     console.error("Error adding passport copy:", error);
        //     currentY += 15;
        //   }
        // }
      }

      // 6. Emirates ID
      if (data.individualDetails && data.individualDetails.emiratesID) {
        currentY += 10;
        doc.setFontSize(16);
        doc.setFont("helvetica", "bold");
        doc.text("Emirates ID", 40, currentY);
        currentY += 20;

        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");
        const emirates = data.individualDetails.emiratesID;
        const emiratesInfo = [
          { label: "ID Number", value: emirates.idNumber },
          { label: "Country", value: emirates.country },
          { label: "Nationality", value: emirates.nationality },
          { label: "Date of Issue", value: new Date(emirates.dateOfIssue).toLocaleDateString() }
        ];

        emiratesInfo.forEach(info => {
          doc.text(`${info.label}: ${info.value}`, 40, currentY);
          currentY += 15;
        });
      }

      // 7. Nominee Details
      if (data.individualDetails && data.individualDetails.nominee) {
        currentY += 10;
        doc.setFontSize(16);
        doc.setFont("helvetica", "bold");
        doc.text("Nominee Details", 40, currentY);
        currentY += 20;

        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");
        const nominee = data.individualDetails.nominee;
        const nomineeInfo = [
          { label: "Name", value: nominee.name },
          { label: "Relationship", value: nominee.relationship },
          { label: "Address", value: nominee.contactDetails.address },
          { label: "PO Box", value: nominee.contactDetails.poBox },
          { label: "Phone Number", value: nominee.contactDetails.phoneNumber },
          { label: "Email", value: nominee.contactDetails.email }
        ];

        nomineeInfo.forEach(info => {
          doc.text(`${info.label}: ${info.value}`, 40, currentY);
          currentY += 15;
        });
      }

      // 8. Investments
      if (data.investments && data.investments.length > 0) {
        currentY += 10;
        doc.setFontSize(16);
        doc.setFont("helvetica", "bold");
        doc.text("Investments", 40, currentY);
        currentY += 20;

        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");

        // Prepare table data for investments
        const investmentTableBody = data.investments.map(inv => [
          inv.investmentId,
          inv.amount,
          `${inv.ROI}%`,
          new Date(inv.investmentDate).toLocaleDateString(),
          new Date(inv.maturityDate).toLocaleDateString()
        ]);

        doc.autoTable({
          startY: currentY,
          head: [["Investment ID", "Amount", "ROI", "Investment Date", "Maturity Date"]],
          body: investmentTableBody,
          theme: "striped",
          headStyles: { fillColor: [41, 128, 185], textColor: 255 },
          styles: { font: "helvetica", fontSize: 10, cellPadding: 5 },
          margin: { left: 40, right: 40 },
          tableLineColor: [0, 0, 0],
          tableLineWidth: 0.1,
        });

        currentY = doc.autoTable.previous.finalY + 20;

        // Iterate through each investment to add assets
        data.investments.forEach(inv => {
          doc.setFontSize(14);
          doc.setFont("helvetica", "bold");
          doc.text(`Investment ID: ${inv.investmentId}`, 40, currentY);
          currentY += 15;

          if (inv.assets && inv.assets.length > 0) {
            // Prepare table data for assets
            const assetsTableBody = inv.assets.map(asset => [
              asset.NumberPlate,
              asset.Type,
              asset.Brand,
              asset.Model,
              asset.Wialon || "N/A"
            ]);

            doc.autoTable({
              startY: currentY,
              head: [["Number Plate", "Type", "Brand", "Model", "Wialon"]],
              body: assetsTableBody,
              theme: "grid",
              headStyles: { fillColor: [22, 160, 133], textColor: 255 },
              styles: { font: "helvetica", fontSize: 10, cellPadding: 5 },
              margin: { left: 60, right: 40 },
              tableLineColor: [0, 0, 0],
              tableLineWidth: 0.1,
            });

            currentY = doc.autoTable.previous.finalY + 20;
          } else {
            doc.text("No assets associated with this investment.", 60, currentY);
            currentY += 15;
          }
        });
      }

      // 9. Additional Sections (Optional)
      // You can add more sections like assets separately if needed

      // 10. Save the PDF
      doc.save(`${data.name}.pdf`);
    }

export default userReport;