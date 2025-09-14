import PDFDocument from "pdfkit";
import CustomError from "../errorHelper/CustomError";

export interface IInvoiceData {
  transactionId: string;
  deliveryDate: Date;
  userName: string;
  tourTitle: string
  totalAmount: number;
}

export const generatePdf = async (invoiceData: IInvoiceData): Promise<Buffer<ArrayBufferLike>> => {
  try {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ size: "A4", margin: 50 });

      const buffer: Uint8Array[] = [];

      doc.on("data", (chunk) => buffer.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(buffer)));
      doc.on("error", (err) => reject(err));

      // pdf content
      doc.fontSize(20).text("Invoice", { align: "center" });
      doc.moveDown();

      doc.fontSize(14).text(`Transaction Id : ${invoiceData.transactionId}`);
      doc.text(`Booking Date : ${invoiceData.deliveryDate}`);
      doc.text(`Customer : ${invoiceData.userName}`);
      doc.moveDown();

      doc.text(`Parcel : ${invoiceData.tourTitle}`);
      doc.text(`Total Delivery Charge : ${invoiceData.totalAmount.toFixed(2)}`);
      doc.moveDown();

      doc.text("Thank you for booking with us!", { align: "center" });

      doc.end();
    });

    // -------
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.log("invoice error", error);
    throw new CustomError(401, `Pdf creation error ${error.message}`);
  }
};
