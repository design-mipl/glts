export type LegalDocumentId =
  | 'terms'
  | 'privacy'
  | 'refund-cancellation'
  | 'security'
  | 'compliance'
  | 'disclaimer'
  | 'site-content-disclaimer'

export type LegalBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'heading'; text: string }
  | { type: 'important'; text: string }

export interface LegalDocument {
  id: LegalDocumentId
  path: string
  title: string
  eyebrow?: string
  blocks: LegalBlock[]
}

export const legalDocuments: Record<LegalDocumentId, LegalDocument> = {
  terms: {
    id: 'terms',
    path: '/legal/terms',
    title: 'Terms & Conditions',
    eyebrow: 'VISA SERVICE',
    blocks: [
      {
        type: 'paragraph',
        text: 'I/We, herein after referred as the ‘Applicant/s’, agree to avail services of Greenlight Travel Solutions Private Limited, hereinafter referred to as “GLTS”, as a service provider for Visa Facilitation.',
      },
      {
        type: 'paragraph',
        text: 'I/We note and agree that GLTS is only responsible for scheduling appointments, acceptance of applications, acceptance of visa and logistic fees, submission of applications and relevant documents at the Embassy / VFS Centre and where agreed, collecting, and returning the passport back to the applicant/s.',
      },
      {
        type: 'paragraph',
        text: 'I/We, who are desirous to avail visas for myself / ourselves, relatives, office staff, management etc., here by agree to submit relevant, accurate, up to date and authentic documents, including photographs, as demanded by the Visa issuing Country. For any discrepancies and issues arising out it, I /We the applicant/s shall be solely liable.',
      },
      {
        type: 'paragraph',
        text: 'clearly note and agree that the grant or refusal of the visa is at the sole discretion of the Embassy/Consulate. GTLS is neither involved in the verification and visa granting process nor is GLTS liable or responsible in any manner whatsoever for any delay in processing or grant or rejection of the visa application of any applicant by the concerned Embassy/Consulate. The Embassy/Consulate also reserves the right to ask for further documentation delay or failure to submit may lead to delay or refusal of the visa application.',
      },
      {
        type: 'paragraph',
        text: 'I/We applicants agree that GLTS has no way to verify the background of the applicants and hence the applicant agree to be liable for any damages, overstay fees, or charges levied to GLTS for any misdemeanor by the applicant. As per the guideline of the Embassy/High Commission/Consulate, the visa is granted for a period of stay and the applicant cannot overstay. In case of any overstay, the applicant will be liable for all the legal, penal and monetary obligations and consequences (including overstay penalties) arising out of the overstay, and as charged by the Embassy/High Commission/Consulate.',
      },
      {
        type: 'paragraph',
        text: 'I/We clearly understand and agree that GLTS will use its best endeavors to process applications for visas, passports and/or documents at my/our request. However, GLTS shall not be held responsible for, nor will accept any liability for, the actions of any consulate, embassy in delaying or not issuing such applications for any reason whatsoever. In addition, GLTS shall not be held responsible for expense and/or delay arising from or in connection with: (a) incomplete application forms or (b) incorrectly or falsely completed application forms or (c) inaccurate or incomplete supporting documentation. I/We agree that any expense or cost incurred by to me/us due to these delays or non-issuances shall not be the responsibility or liability of GLTS nor shall any charges be levied upon GLTS for the same.',
      },
      {
        type: 'paragraph',
        text: 'I/We clearly understand GLTS takes every reasonable precaution while handling the documents of the applicant/s and shall not be liable in any manner whatsoever to the applicant/s for any documents which are lost in transit by accident, theft, natural calamities (act of god) or any other reason outside the control of, or not arising out of a willful default of GLTS and also if documents are handed over directly to the applicant/s.',
      },
      {
        type: 'paragraph',
        text: 'I/We agree and accept that the courier acceptance and delivery service through which the documents are returned to the applicant/s by VFS is operated by a third-party vendor that is not contracted by GLTS. GLTS does not control or operate any courier company, neither does it control or operate any facility or service provided by the courier company. GLTS disclaims any and all liability for any loss or damage caused to the applicant/s in the event that his/her documents are delayed / misplaced / lost / damaged by the courier company, whether such delay / misplacement / loss / damage result from negligence, accident or any other cause. I/We agree that in no event shall GLTS and/or its representatives be liable for any direct, indirect, punitive, incidental, special, consequential damages or any damages whatsoever due to such delay / misplacement / loss / damage of the documents, including the Applicant’s passport.',
      },
      {
        type: 'paragraph',
        text: 'Without prejudice to the aforesaid, I/We agree that GLTS’ and/or its representatives’ sole and exclusive liability in case a passport is lost or damaged in transit by itself, is only limited/restricted to the reimbursement of the amount of fees charged by the Embassy for which the applicant applied, fees charged by GLTS, only if paid and for the replacement of a lost / damaged passport through normal application procedure. GLTS shall assist the applicant in the replacement of the lost visas, where possible. Such reimbursement of the fee amount will be made by GLTS to the applicant/s only on the presentation of the payment receipt by the applicant/s as issued by the Embassy. I/We agree that the foregoing limitation of liability is an agreed allocation of risk between the parties and this limitation of liability is and shall be an integral part of this disclaimer.',
      },
      {
        type: 'paragraph',
        text: 'I / We agree that GLTS is liable for any claims only if brought within Seven (7) days after completion of work by GLTS, beginning from the date of delivery of the visa and / or if not delivered, from the date of order. I/ We agree that once the above deadline has passed, any rights for rectification or compensation shall expire.',
      },
      {
        type: 'paragraph',
        text: 'I/We agree that the service charges & visa fees once received by GLTS from the applicant/s vide demand drafts, cheque or cash will not be refundable under any circumstances, irrespective of the outcome of the visa application to the Embassy.',
      },
      {
        type: 'paragraph',
        text: 'I/We agree that consular fees and availability of services are subject to change without notice. Fees and services may differ between the time the order is placed and when the ordered is completed. I/We agree to pay any increase in amount before the visa is applied for.',
      },
      {
        type: 'paragraph',
        text: 'I/We agree that GLTS, in its sole discretion, may change, amend, cancel or withdraw any or all of the terms and conditions mentioned herein at any time without any prior notice. No employee of GLTS has any authority whatsoever to change / amend / amplify or withdraw any or all of the terms and conditions mentioned herein without the prior written approval of GLTS.',
      },
      {
        type: 'paragraph',
        text: 'I/We agree that these terms and conditions shall be governed and construed in accordance with the laws. Any claims or disputes arising in relation to the services provided by GLTS to the applicant shall be subject to the exclusive jurisdiction of the Courts in Mumbai, India.',
      },
      {
        type: 'paragraph',
        text: 'I/We hereby accept and confirm that the I/We and/or my/our representative, prior to submitting the visa application, has read, understood and agreed to be bound by, without limitation or qualification, all of the terms, conditions and details provided herein',
      },
      {
        type: 'paragraph',
        text: 'I/We hereby agree that when Travel Insurance is availed from GLTS, then GLTS is only responsible for the issuance of Travel policy as per the customer/s choice and is in no way responsible or cannot be held accountable for settlement of claims. I agree that all claims, its demands, its procedures and submission and relevant work etc. of the settlements will strictly be between the myself/ourselves and the Insurance Company.',
      },
    ],
  },
  privacy: {
    id: 'privacy',
    path: '/legal/privacy',
    title: 'Privacy Policy',
    eyebrow: 'VISA SERVICE',
    blocks: [
      { type: 'heading', text: 'Collection, use and disclosure of personal information.' },
      {
        type: 'paragraph',
        text: 'For Visa & Passport applications, the applicants are required to provide personal information such as Full Name, Address, Date of Birth, Telephone number, Passport Details, Recent Photograph, Birth certificate, Income Proof, Citizenship Status, Marital Status, Employment Details, Criminal and Educational background Information etc. GLTS collects the information as per the requirement mandated by the concerned Diplomatic Missions and/or VFS Offices.',
      },
      {
        type: 'paragraph',
        text: 'GLTS only collects your personal information and uses it or discloses it to facilitate the processing of visa application(s) and/or request(s) and keeps it to successfully process the visa requests. We will never misuse the information provided by you.',
      },
      {
        type: 'paragraph',
        text: 'However, providing the personal information is voluntary. Do note that a refusal to provide personal information may limit or affect the ability and efficiency of GLTS to provide the requested services.',
      },
    ],
  },
  'refund-cancellation': {
    id: 'refund-cancellation',
    path: '/legal/refund-cancellation',
    title: 'Refund & Cancellation Policy',
    eyebrow: 'VISA SERVICE',
    blocks: [
      {
        type: 'paragraph',
        text: 'The below Terms of Service are applicable in case of cancellation and refund process.',
      },
      {
        type: 'paragraph',
        text: 'The mentioned policies are legal agreements between the User and GLTS. These terms and policies are considered to be comprehensive under all constitutional laws that are dealing with digital contracts. There is no physical signature required.',
      },
      {
        type: 'important',
        text: 'IMPORTANT:GLTS will not issue refunds for early service withdrawal under any circumstances.',
      },
      { type: 'heading', text: 'CANCELLATION POLICY :-' },
      {
        type: 'paragraph',
        text: 'The applicant can cancel their application at any time after submitting their case to GLTS, However, the service charges & visa fees once received by GLTS from the applicant/s vide demand drafts, cheque or cash will not be refundable under any circumstances, irrespective of whether or not the desired visa is granted by the Embassy.',
      },
      {
        type: 'paragraph',
        text: 'Consular fees and availability of services are subject to change without notice. Fees and services may differ between the time the order is placed and when the ordered is completed. GLTS will endeavor to communicate said changes to the client where possible',
      },
      { type: 'heading', text: 'CANCELLATION BY GLTS :-' },
      {
        type: 'paragraph',
        text: 'GLTS is authorized to cancel the application should we find any fraudulent documents prior to submission. GLTS may not be able to processes certain types/categories of visas and/or may not be authorized agents for certain Embassies/Consulates. In such cases, GLTS will seek assistance from third parties who are authorized. Once cases are submitted & processed and if cancelled, GLTS will not refund the charges once charged.',
      },
      { type: 'heading', text: 'CANCELLATION BY THE APPLICANT/CUSTOMER' },
      {
        type: 'paragraph',
        text: 'If a customer cancels his travel plans for any reason after submission of documents to GLTS, then he/she is liable is to pay our service charges fully. If the visa is not yet applied, then GLTS will refund the visa fees fully paid to GLTS within 10 working days. If the Visa is applied, then the Visa fee & Service fee of GLTS will be fully non-refundable. Visa fees & GLTS service fees are non-refundable if the case is cancelled, refused, denied and withdrawn.',
      },
      {
        type: 'paragraph',
        text: 'Miscellaneous fees such as courier charges, insurance cancellation, vendor fees are non-refundable once the service is used and must be borne by the customer.',
      },
      { type: 'heading', text: 'DELIVERY SERVICE :-' },
      {
        type: 'paragraph',
        text: 'The applicant/s agrees and accepts that the courier acceptance and delivery service through which the documents are returned to the applicant/s by VFS is operated by a third-party vendor that is not contracted by GLTS. GLTS does not control or operate any courier company, neither does it control or operate any facility or service provided by the courier company. GLTS disclaims any and all liability for any loss or damage caused to the applicant/s in the event that his/her documents are delayed/ misplaced/ lost/ damaged by the courier company, whether such delay/ misplacement/ loss/ damage result from negligence, accident or any other cause. In no event shall GLTS and/or its representatives be liable for any direct, indirect, punitive, incidental, special, consequential damages or any damages whatsoever due to such delay/ misplacement/ loss/ damage of the documents, including the Applicant’s passport. Without prejudice to the aforesaid, GLTS and/or its representatives’ sole and exclusive liability in case a passport is lost or damaged in transit, is limited/restricted to the reimbursement of the amount of fees charged by the Embassy, for the replacement of a lost / damaged passport through normal application procedure and shall assist the applicant in the replacement of the lost visas. Such reimbursement of the fee amount will be made by GLTS to the applicant/s only on the presentation by the applicant/s of the payment receipt issued by the Embassy. The applicant/s agrees that the foregoing limitation of liability is an agreed allocation of risk between the parties and this limitation of liability is and shall be an integral part of this disclaimer.',
      },
      { type: 'heading', text: 'CLAIMS PERIOD :-' },
      {
        type: 'paragraph',
        text: 'You have ninety (90) days after completion of work by GLTS beginning from the date of delivery of the visa (or if not delivered, from the date of order) to inform GLTS of any claim related to GLTS services. Once the relevant deadline has passed, any rights for rectification or compensation shall expire.',
      },
      {
        type: 'paragraph',
        text: 'GLTS, in its sole discretion, may change, amend, cancel, or withdraw any or all of the terms and conditions mentioned herein at any time without any prior notice. No employee of GLTS has any authority whatsoever to change / amend / amplify or withdraw any or all of the terms and conditions mentioned herein without the prior written approval of GLTS.',
      },
      {
        type: 'paragraph',
        text: 'These terms and conditions shall be governed and construed in accordance with the laws of Any claims or disputes arising in relation to the services provided by GLTS to the applicant shall be subject to the exclusive jurisdiction of the courts in India.',
      },
      {
        type: 'paragraph',
        text: 'The applicant hereby accepts and confirms that the applicant and/or his/her representative, prior to submitting the visa application, has read, understood and agreed to be bound by, without limitation or qualification, all of the terms, conditions and details provided herein.',
      },
      { type: 'heading', text: 'TRAVEL INSURANCE :-' },
      {
        type: 'paragraph',
        text: 'GLTS is only responsible for the issuance of Travel policy as per the customer/s choice and is in no way responsible or cannot be held accountable for settlement of claims. All claim settlements will strictly be between the customer/s and the Insurance Company.',
      },
    ],
  },
  security: {
    id: 'security',
    path: '/legal/security',
    title: 'Security',
    blocks: [{ type: 'paragraph', text: 'Content to be provided/approved by GLTS.' }],
  },
  compliance: {
    id: 'compliance',
    path: '/legal/compliance',
    title: 'Compliance',
    blocks: [{ type: 'paragraph', text: 'Content to be provided/approved by GLTS.' }],
  },
  disclaimer: {
    id: 'disclaimer',
    path: '/legal/disclaimer',
    title: 'Disclaimer',
    eyebrow: 'VISA SERVICE',
    blocks: [
      {
        type: 'paragraph',
        text: 'GLTS is responsible for scheduling appointments, acceptance of applications, acceptance of visa and logistic fees, submission of applications at the Embassy /VFS Centre and returning the passport back to the applicants.',
      },
      {
        type: 'paragraph',
        text: 'It must be noted that the grant or refusal of the visa is at the sole discretion of the Embassy/Consulate. GTLS is neither involved in the process nor is liable or responsible in any manner whatsoever for any delay in processing or grant or rejection of the visa application of any applicant by the Embassy/Consulate which reserves the right to ask for further documentation and to refuse the visa application.',
      },
      {
        type: 'paragraph',
        text: 'As per the guideline of the Embassy/High Commission/Consulate an applicant cannot overstay. In case of overstay, he/she will be responsible for all the legal obligations and consequences (including overstay penalties).',
      },
      {
        type: 'paragraph',
        text: 'GLTS will use its best endeavors to process applications for visas, passports and/or documents at the client’s request. However, GLTS shall not be held responsible for, nor will accept any liability for, the actions of any consulate, embassy, or passport office in delaying or not issuing such applications for any reason whatsoever. In addition, GLTS shall not be held responsible for expense and/or delay arising from or in connection with: (a) incomplete application forms or (b) incorrectly or falsely completed application forms or (c) inaccurate or incomplete supporting documentation. Any expense or cost incurred by the client due to these delays or non-issuances shall not be the responsibility of, nor shall any charges be levied upon GLTS.',
      },
      {
        type: 'paragraph',
        text: 'GLTS takes every reasonable precaution while handling the documents of the applicant/s and shall not be liable in any manner whatsoever to the applicant/s for any documents which are lost in transit by accident, theft, natural calamities (act of god) or any other reason outside the control of, or not arising out of a willful default of GLTS and also if documents are handed over directly to the applicant/s.',
      },
      { type: 'heading', text: 'Legal Disclaimer' },
      {
        type: 'paragraph',
        text: 'GREENLIGHT Travel Solution is a non-government organisation and we solely act as a service provider. All the information on the website is general information based on the available information on the internet and authorities. We shouldn’t be held responsible if any changes or any guidelines at actual get altered.',
      },
    ],
  },
  'site-content-disclaimer': {
    id: 'site-content-disclaimer',
    path: '/legal/site-content-disclaimer',
    title: 'Site Content Disclaimer',
    blocks: [
      {
        type: 'paragraph',
        text: 'GLTS has taken all reasonable steps to ensure the accuracy of the information on this web site. However, we can give no guarantee regarding the accuracy or completeness of the content of this web site. Hence, we accept no liability for any losses or damages (whether direct, indirect, special, consequential, or otherwise) arising out of errors or omissions contained in this web site.',
      },
      {
        type: 'paragraph',
        text: 'We reserve the right to update, add, amend, remove, replace, or change any part of the web site content, including but not limited to functionality and navigation at any time without prior notice.',
      },
      {
        type: 'paragraph',
        text: 'We shall not be liable for distortion of data arising from any technical fault including transmission errors, technical defects, interruptions, third party intervention or viruses.',
      },
      { type: 'heading', text: '2. Exclusion of Liability' },
      {
        type: 'paragraph',
        text: 'We cannot guarantee that this web site shall be available on an uninterrupted basis, and we will not be liable for any losses, costs or damages resulting from this web site not being accessible or for delays in access.',
      },
      {
        type: 'paragraph',
        text: 'Access to and use of this web site is at the user’s own risk, and we cannot warrant that the use of this web site or any material downloaded from it will not cause damage to any property, including but not limited to loss of data, computer viruses, Trojan horses and others. In addition, we accept no liability in respect of losses or damages arising out of changes made to the content of this web site by unauthorized third parties.',
      },
      { type: 'heading', text: '3. Third Party Links' },
      {
        type: 'paragraph',
        text: 'This web site contains links to other web sites which are hosted and maintained by third parties. Such links are provided for your convenience only. GLTS does not control such websites and is not responsible for their contents under any circumstances. We make no representation as to the accuracy, completeness or relevance of the information contained on such Third-Party Sites. You follow links to such sites at your own risk, and we will not be liable for any loss or damage rising from your reliance upon or use of Third-Party Sites.',
      },
    ],
  },
}

export const primaryLegalDocumentIds: LegalDocumentId[] = [
  'terms',
  'privacy',
  'refund-cancellation',
]

export const legacyNoticeDocumentIds: LegalDocumentId[] = ['disclaimer', 'site-content-disclaimer']
