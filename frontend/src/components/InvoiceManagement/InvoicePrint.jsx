import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Printer, Download, Mail, Send } from 'lucide-react';
import html2pdf from 'html2pdf.js';
import { emailInvoice } from '../../services/api';
import './InvoicePrint.css';

const InvoicePrint = ({ invoice, settings, setPrinting, autoEmail }) => {
    const [showEmailModal, setShowEmailModal] = useState(false);
    const [emailForm, setEmailForm] = useState({ to: '', subject: '', body: '' });
    const [isSending, setIsSending] = useState(false);
    const [emailMessage, setEmailMessage] = useState(null);

    const handleOpenEmailModal = () => {
        setEmailForm({
            to: invoice.customer?.email || '',
            subject: settings?.email?.defaultSubject || `Invoice ${invoice.invoiceNo} from ${settings?.companyName || 'Us'}`,
            body: settings?.email?.defaultBody || `Dear ${invoice.customer?.name},\n\nPlease find attached the invoice ${invoice.invoiceNo}.\n\nThank you,\n${settings?.companyName || 'Us'}`
        });
        setShowEmailModal(true);
        setEmailMessage(null);
    };

    useEffect(() => {
        // Prevent scrolling on body when overlay is active
        document.body.style.overflow = 'hidden';
        
        if (autoEmail) {
            handleOpenEmailModal();
        }

        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [autoEmail]);

    const handleSendEmail = async (e) => {
        e.preventDefault();
        setIsSending(true);
        setEmailMessage(null);
        try {
            const element = document.querySelector('.print-document');
            const opt = {
                margin:       0,
                filename:     `Invoice-${invoice.invoiceNo}.pdf`,
                image:        { type: 'jpeg', quality: 0.98 },
                html2canvas:  { scale: 2, useCORS: true, windowWidth: 1024 },
                jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
            };
            
            // Generate PDF as base64 string
            const pdfBase64 = await html2pdf().set(opt).from(element).outputPdf('datauristring');
            
            await emailInvoice(invoice._id, {
                to: emailForm.to,
                subject: emailForm.subject,
                body: emailForm.body,
                pdfBase64: pdfBase64
            });
            
            setEmailMessage({ type: 'success', text: 'Email sent successfully!' });
            setTimeout(() => setShowEmailModal(false), 2000);
        } catch (err) {
            console.error('Email API Error:', err);
            let errorMsg = 'Failed to send email';
            if (err.response) {
                if (err.response.data && err.response.data.message) {
                    errorMsg = err.response.data.message;
                } else if (err.response.status === 413) {
                    errorMsg = 'PDF is too large to send.';
                } else {
                    errorMsg = `Server error: ${err.response.status}`;
                }
            } else if (err.message) {
                errorMsg = err.message;
            }
            setEmailMessage({ type: 'error', text: errorMsg });
        } finally {
            setIsSending(false);
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-LK', { minimumFractionDigits: 2 }).format(amount);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const year = date.getFullYear();
        return `${month}/${day}/${year}`;
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
            html2canvas:  { scale: 2, useCORS: true, windowWidth: 1024 },
            jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        html2pdf().set(opt).from(element).save();
    };

    return createPortal(
        <div className="print-overlay">
            <div className="print-actions">
                <button className="btn btn-secondary" onClick={handleOpenEmailModal} style={{ marginRight: '10px' }}>
                    <Mail size={18} /> Email Invoice
                </button>
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
                <div className="print-header-flex">
                    <div className="print-logo-col">
                        <img src="/logo.png.jpeg" alt="Company Logo" style={{ maxHeight: '80px', objectFit: 'contain' }} />
                    </div>
                    <div className="print-title-container">
                        <div className="print-title">TAX INVOICE</div>
                    </div>
                    <div className="print-empty-col"></div>
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

                <div className="table-responsive">
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
                                    <td style={{ whiteSpace: 'pre-wrap', color: '#000', fontSize: '1em' }}>
                                        {item.product?.name && (
                                            <div>{item.product.name}</div>
                                        )}
                                        {item.customDescription && (
                                            <div style={{ marginTop: item.product?.name ? '4px' : '0' }}>
                                                {item.customDescription}
                                            </div>
                                        )}
                                    </td>
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
                </div>

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

                <div className="print-signatures-wrapper">
                    <div className="print-signatures">
                        <div className="sig-box">
                            <div className="sig-line"></div>
                            <div className="sig-title">Authorized by</div>
                        </div>
                        <div className="sig-box">
                            <div className="sig-line"></div>
                            <div className="sig-title">Customer Signature</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Email Modal Overlay */}
            {showEmailModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1000000,
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                    <div style={{
                        backgroundColor: '#fff', borderRadius: '8px', padding: '24px',
                        width: '90%', maxWidth: '500px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
                        color: '#334155'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#1e293b' }}>Send Email to {invoice.customer?.name}</h3>
                            <button onClick={() => setShowEmailModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                                <X size={20} />
                            </button>
                        </div>

                        {emailMessage && (
                            <div style={{ 
                                padding: '12px', marginBottom: '16px', borderRadius: '6px',
                                backgroundColor: emailMessage.type === 'success' ? '#dcfce7' : '#fee2e2',
                                color: emailMessage.type === 'success' ? '#166534' : '#991b1b'
                            }}>
                                {emailMessage.text}
                            </div>
                        )}

                        <form onSubmit={handleSendEmail}>
                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.875rem', fontWeight: 600 }}>To Email Address</label>
                                <input 
                                    type="email" 
                                    className="input-field" 
                                    value={emailForm.to} 
                                    onChange={e => setEmailForm({...emailForm, to: e.target.value})} 
                                    required 
                                />
                            </div>
                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.875rem', fontWeight: 600 }}>Subject</label>
                                <input 
                                    type="text" 
                                    className="input-field" 
                                    value={emailForm.subject} 
                                    onChange={e => setEmailForm({...emailForm, subject: e.target.value})} 
                                    required 
                                />
                            </div>
                            <div style={{ marginBottom: '24px' }}>
                                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.875rem', fontWeight: 600 }}>Message Body</label>
                                <textarea 
                                    className="input-field" 
                                    rows="6"
                                    value={emailForm.body} 
                                    onChange={e => setEmailForm({...emailForm, body: e.target.value})} 
                                    required 
                                ></textarea>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                                <button type="button" className="btn btn-secondary" onClick={() => setShowEmailModal(false)} disabled={isSending}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary" disabled={isSending}>
                                    {isSending ? 'Sending...' : <><Send size={16} /> Send Email</>}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>,
        document.body
    );
};

export default InvoicePrint;
