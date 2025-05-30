import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
export const exportToExcel = (data, fileName = "table-export.xlsx") => {
    // Convert JSON to worksheet
    const worksheet = XLSX.utils.json_to_sheet(data);
  
    // Create a new workbook and add the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  
    // Generate a buffer
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  
    // Create a Blob from buffer
    const dataBlob = new Blob([excelBuffer], { type: "application/octet-stream" });
  
    // Trigger file download
    saveAs(dataBlob, fileName);
  };