'use client';

import React from 'react';
import { Download } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { CalculationRow, CalculatorInputs } from '@/lib/types';
import { formatCurrency, formatPercent } from '@/lib/formatting';

interface PDFExportProps {
  data: CalculationRow[];
  inputs: CalculatorInputs;
  fileName?: string;
}

export const PDFExport: React.FC<PDFExportProps> = ({
  data,
  inputs,
  fileName = 'insurance_illustration',
}) => {
  const handleExportPDF = async () => {
    try {
      // Create a temporary container for PDF content
      const container = document.createElement('div');
      container.style.position = 'absolute';
      container.style.left = '-9999px';
      container.style.width = '1200px';
      container.style.backgroundColor = 'white';
      document.body.appendChild(container);

      // Create PDF header
      container.innerHTML = `
        <div style="padding: 20px; font-family: Arial, sans-serif;">
          <h1 style="text-align: center; margin-bottom: 20px;">Premium Finance Illustration</h1>

          <div style="margin-bottom: 20px;">
            <h2 style="font-size: 16px; margin-bottom: 10px;">Input Parameters</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr style="border-bottom: 1px solid #ccc;">
                <td style="padding: 8px; width: 50%;">Death Benefit:</td>
                <td style="padding: 8px; font-weight: bold;">${formatCurrency(inputs.deathBenefit)}</td>
              </tr>
              <tr style="border-bottom: 1px solid #ccc;">
                <td style="padding: 8px;">Rate of Return:</td>
                <td style="padding: 8px; font-weight: bold;">${formatPercent(inputs.rateOfReturn)}</td>
              </tr>
              <tr style="border-bottom: 1px solid #ccc;">
                <td style="padding: 8px;">Borrow Rate:</td>
                <td style="padding: 8px; font-weight: bold;">${formatPercent(inputs.borrowRate)}</td>
              </tr>
              <tr style="border-bottom: 1px solid #ccc;">
                <td style="padding: 8px;">Annual Out of Pocket:</td>
                <td style="padding: 8px; font-weight: bold;">${formatCurrency(inputs.outOfPocket)}</td>
              </tr>
              <tr style="border-bottom: 1px solid #ccc;">
                <td style="padding: 8px;">Payment Years:</td>
                <td style="padding: 8px; font-weight: bold;">${inputs.paymentYears}</td>
              </tr>
              <tr style="border-bottom: 1px solid #ccc;">
                <td style="padding: 8px;">Annual Premium:</td>
                <td style="padding: 8px; font-weight: bold;">${formatCurrency(inputs.annualPremium)}</td>
              </tr>
              <tr style="border-bottom: 1px solid #ccc;">
                <td style="padding: 8px;">Premium Years:</td>
                <td style="padding: 8px; font-weight: bold;">${inputs.premiumYears}</td>
              </tr>
              <tr style="border-bottom: 1px solid #ccc;">
                <td style="padding: 8px;">Start Age:</td>
                <td style="padding: 8px; font-weight: bold;">${inputs.startAge}</td>
              </tr>
            </table>
          </div>

          <div style="margin-bottom: 20px;">
            <h2 style="font-size: 16px; margin-bottom: 10px;">Summary Statistics</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr style="border-bottom: 1px solid #ccc;">
                <td style="padding: 8px;">Final Cash Value:</td>
                <td style="padding: 8px; font-weight: bold;">${formatCurrency(data[data.length - 1].cashValue)}</td>
              </tr>
              <tr style="border-bottom: 1px solid #ccc;">
                <td style="padding: 8px;">Total Out of Pocket:</td>
                <td style="padding: 8px; font-weight: bold;">${formatCurrency(data[data.length - 1].totalCost)}</td>
              </tr>
              <tr style="border-bottom: 1px solid #ccc;">
                <td style="padding: 8px;">Final Net Death Benefit:</td>
                <td style="padding: 8px; font-weight: bold;">${formatCurrency(data[data.length - 1].netDB)}</td>
              </tr>
            </table>
          </div>

          <div style="margin-top: 40px;">
            <h2 style="font-size: 16px; margin-bottom: 10px;">Year-by-Year Projections</h2>
            <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
              <thead>
                <tr style="background-color: #1e40af; color: white;">
                  <th style="padding: 8px; text-align: left;">Year</th>
                  <th style="padding: 8px; text-align: right;">Age</th>
                  <th style="padding: 8px; text-align: right;">Premium</th>
                  <th style="padding: 8px; text-align: right;">Cash Value</th>
                  <th style="padding: 8px; text-align: right;">Death Benefit</th>
                  <th style="padding: 8px; text-align: right;">EOY Balance</th>
                  <th style="padding: 8px; text-align: right;">Net DB</th>
                  <th style="padding: 8px; text-align: right;">Total Cost</th>
                </tr>
              </thead>
              <tbody>
                ${data
                  .map(
                    (row, idx) => `
                  <tr style="border-bottom: 1px solid #ddd; background-color: ${idx % 2 === 0 ? '#f9fafb' : 'white'};">
                    <td style="padding: 8px;">${row.year}</td>
                    <td style="padding: 8px; text-align: right;">${row.age}</td>
                    <td style="padding: 8px; text-align: right;">${formatCurrency(row.premium)}</td>
                    <td style="padding: 8px; text-align: right;">${formatCurrency(row.cashValue)}</td>
                    <td style="padding: 8px; text-align: right;">${formatCurrency(row.db)}</td>
                    <td style="padding: 8px; text-align: right;">${formatCurrency(row.eoyBal)}</td>
                    <td style="padding: 8px; text-align: right;">${formatCurrency(row.netDB)}</td>
                    <td style="padding: 8px; text-align: right;">${formatCurrency(row.totalCost)}</td>
                  </tr>
                `
                  )
                  .join('')}
              </tbody>
            </table>
          </div>

          <div style="margin-top: 20px; text-align: center; color: #666; font-size: 12px;">
            <p>Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
          </div>
        </div>
      `;

      // Convert HTML to canvas and then to PDF
      const canvas = await html2canvas(container, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
      });

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      const imgData = canvas.toDataURL('image/png');

      // Add image to PDF, creating new pages as needed
      while (heightLeft >= 0) {
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= 297; // A4 height
        if (heightLeft >= 0) {
          pdf.addPage();
          position = heightLeft - imgHeight;
        }
      }

      pdf.save(`${fileName}_${new Date().getTime()}.pdf`);

      // Clean up
      document.body.removeChild(container);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    }
  };

  return (
    <button
      onClick={handleExportPDF}
      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center gap-2"
    >
      <Download size={18} />
      Export to PDF
    </button>
  );
};
