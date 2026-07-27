import React, { useEffect, useRef } from 'react';
import { X, Printer, Download } from 'lucide-react';
import html2pdf from 'html2pdf.js';
import './InvoicePrint.css';

const InvoicePrint = ({ invoice, settings, setPrinting }) => {
    useEffect(() => {
        // Prevent scrolling on body when overlay is active
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-LK', { minimumFractionDigits: 2 }).format(amount);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        }).replace(/ /g, '-');
    };

    function convertNumberToWords(amount) {
        const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
        const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
        
        if (amount === 0) return 'Zero Only';
        
        const num = Math.floor(amount); 
        
        function convertGroup(n) {
            if (n === 0) return '';
            if (n < 20) return ones[n];
            if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + ones[n % 10] : '');
            return ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 !== 0 ? ' And ' + convertGroup(n % 100) : '');
        }
        
        let words = '';
        if (Math.floor(num / 1000000) > 0) {
            words += convertGroup(Math.floor(num / 1000000)) + ' Million ';
        }
        if (Math.floor((num % 1000000) / 1000) > 0) {
            words += convertGroup(Math.floor((num % 1000000) / 1000)) + ' Thousand ';
        }
        if (num % 1000 > 0) {
            if (words !== '' && num % 1000 < 100) words += 'And ';
            words += convertGroup(num % 1000);
        }
        
        return words.trim() + ' Only';
    }

    const handlePrint = () => {
        window.print();
    };

    const handleDownloadPDF = () => {
        const element = document.querySelector('.print-document');
        
        // Hide elements that shouldn't be in the PDF if any, usually not needed since we select .print-document directly
        const opt = {
            margin:       0, // CSS already handles the padding
            filename:     `Invoice-${invoice.invoiceNo}.pdf`,
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 2, useCORS: true },
            jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        html2pdf().set(opt).from(element).save();
    };

    return (
        <div className="print-overlay">
            <div className="print-actions">
                <button className="btn btn-primary" onClick={handleDownloadPDF} style={{ marginRight: '10px' }}>
                    <Download size={18} /> Get PDF
                </button>
                <button className="btn btn-primary" onClick={handlePrint}>
                    <Printer size={18} /> Print Invoice
                </button>
                <button className="btn btn-secondary" onClick={() => setPrinting(false)}>
                    <X size={18} /> Close
                </button>
            </div>

            <div className="print-document">
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                    <div style={{ flex: 1, textAlign: 'left' }}>
                        <img src="/logo.png.jpeg" alt="Company Logo" style={{ maxHeight: '80px', objectFit: 'contain' }} />
                    </div>
                    <div className="print-title-container" style={{ flex: 1, marginBottom: 0 }}>
                        <div className="print-title">TAX INVOICE</div>
                    </div>
                    <div style={{ flex: 1 }}></div>
                </div>

                <div className="print-grid">
                    <div className="print-col">
                        <div className="print-row">
                            <div className="print-label">Date of Invoice</div>
                            <div className="print-value">{formatDate(invoice.date)}</div>
                        </div>
                    </div>
                    <div className="print-col">
                        <div className="print-row">
                            <div className="print-label">Tax Invoice No:</div>
                            <div className="print-value">{invoice.invoiceNo}</div>
                        </div>
                    </div>
                </div>

                <div className="print-grid" style={{ borderTop: 'none' }}>
                    <div className="print-col">
                        <div className="print-row">
                            <div className="print-label">Supplier's TIN No:</div>
                            <div className="print-value">{settings?.tinNumber || '-'}</div>
                        </div>
                        <div className="print-row">
                            <div className="print-label">Supplier's Name:</div>
                            <div className="print-value font-bold">{settings?.companyName || 'Your Company Name'}</div>
                        </div>
                        <div className="print-row">
                            <div className="print-label">Address:</div>
                            <div className="print-value" style={{ whiteSpace: 'pre-line' }}>{settings?.address || 'Company Address'}</div>
                        </div>
                        <div className="print-row" style={{ marginTop: '10px' }}>
                            <div className="print-label">Telephone No:</div>
                            <div className="print-value">{settings?.telephone || '-'}</div>
                        </div>
                        <div className="print-row">
                            <div className="print-label">Date of Delivery:</div>
                            <div className="print-value">{formatDate(invoice.date)}</div>
                        </div>
                    </div>
                    <div className="print-col">
                        <div className="print-row">
                            <div className="print-label">Purchaser's TIN No:</div>
                            <div className="print-value">{invoice.customer?.tinNo || '-'}</div>
                        </div>
                        <div className="print-row">
                            <div className="print-label">Purchaser's Name<br/>& Address:</div>
                            <div className="print-value font-bold">
                                {invoice.customer?.name} <br/>
                                <span style={{fontWeight: 'normal'}}>{invoice.customer?.address}</span>
                            </div>
                        </div>
                        <div className="print-row" style={{ marginTop: '30px' }}>
                            <div className="print-label">Place of Supply:</div>
                            <div className="print-value"></div>
                        </div>
                    </div>
                </div>

                <div className="print-additional-info">
                    <div className="print-info-header">Additional Information if any:</div>
                    <div className="print-info-cols">
                        <div className="print-info-col">
                            <div style={{ width: '80px' }}>P.O. No.</div>
                            <div>{invoice.poNumber || ''}</div>
                        </div>
                        <div className="print-info-col">
                            <div style={{ width: '80px' }}>Sales Rep:</div>
                            <div></div>
                        </div>
                    </div>
                </div>

                <table className="print-table">
                    <thead>
                        <tr>
                            <th className="col-desc">Description of Good or Service</th>
                            <th className="col-qty">Quantity</th>
                            <th className="col-price">Unit Price</th>
                            <th className="col-amount">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {invoice.products.map((item, index) => (
                            <tr key={index}>
                                <td>{item.product?.name} {item.product?.description ? `- ${item.product.description}` : ''}</td>
                                <td className="col-qty">{item.quantity}</td>
                                <td className="col-price">{formatCurrency(item.unitPrice)}</td>
                                <td className="col-amount">{formatCurrency(item.amount)}</td>
                            </tr>
                        ))}
                        <tr className="empty-row-stretch">
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                    </tbody>
                </table>

                <div className="print-totals-wrapper">
                    <div className="print-totals-row">
                        <div className="totals-label">Total Value of Supply:</div>
                        <div className="totals-value">LKR {formatCurrency(invoice.subtotal)}</div>
                    </div>
                    <div className="print-totals-row">
                        <div className="totals-label">VAT amount (Total Value of Supply) (18.0%):</div>
                        <div className="totals-value">LKR {formatCurrency(invoice.vatAmount)}</div>
                    </div>
                    <div className="print-totals-row totals-grand">
                        <div className="totals-label">Total Amount Including VAT:</div>
                        <div className="totals-value">LKR {formatCurrency(invoice.grandTotal)}</div>
                    </div>
                </div>

                <div className="amount-in-words-container">
                    <div className="amount-in-words-label">Amount in words:</div>
                    <div className="amount-in-words-value">
                        {convertNumberToWords(invoice.grandTotal)}
                    </div>
                </div>

                <div className="print-footer-box" style={{ marginTop: '5px' }}>
                    Mode of payments: Cash / Cheque / Online transfer
                </div>

                <div className="print-terms">
                    Payment : Cheque should be drawn in favour of "{settings?.companyName || 'Your Company Name'}"<br/>
                    No Warranty for: Key Boards, Mouse, Speakers, Power adaptors, Toners, Ink cartridges & Printer heads. For the item is BURN MARKS, PHYSICAL DAMAGES & CORROSION No warranty.
                </div>

                <div className="print-signatures">
                    <div className="sig-box">
                        <div className="sig-line"></div>
                        <div>Authorized by</div>
                    </div>
                    <div className="sig-box">
                        <div className="sig-line"></div>
                        <div>Customer Signature</div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default InvoicePrint;
