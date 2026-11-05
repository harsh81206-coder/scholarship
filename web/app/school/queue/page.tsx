"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { OfficerShell } from "@/components/shell/OfficerShell";
import { T } from "@/components/T";
import { Icon } from "@/components/Icon";
import { StatusChip, Avatar, EmptyState } from "@/components/ui";

interface DocumentItem {
  nameGu: string;
  nameEn: string;
  statusTextGu: string;
  statusTextEn: string;
  statusType: "success" | "warning" | "error";
  icon: string;
  fileName: string;
}

interface Application {
  id: string;
  nameGu: string;
  nameEn: string;
  initials: string;
  fatherNameGu: string;
  fatherNameEn: string;
  revenueFatherNameGu: string;
  revenueFatherNameEn: string;
  ctsId: string;
  classGu: string;
  classEn: string;
  classKey: string;
  rollNo: string;
  schemeId: string;
  schemeGu: string;
  schemeEn: string;
  schemeIcon: string;
  appliedDateGu: string;
  appliedDateEn: string;
  status: "pending" | "approved" | "rejected" | "inprogress";
  aiStatusGu: string;
  aiStatusEn: string;
  aiStatusHi: string;
  aiSubtextGu: string;
  aiSubtextEn: string;
  aiFlagged: boolean;
  docsCountGu: string;
  docsCountEn: string;
  docsValid: boolean;
  amountGu: string;
  amountEn: string;
  amountNum: number;
  amountTypeGu: string;
  amountTypeEn: string;
  flagIssueGu: string;
  flagIssueEn: string;
  flagIssueSubGu: string;
  flagIssueSubEn: string;
  aiNoteGu: string;
  aiNoteEn: string;
  docs: DocumentItem[];
}

const INITIAL_APPLICATIONS: Application[] = [
  {
    id: "app-1",
    nameGu: "રિયા હસમુખભાઈ પટેલ",
    nameEn: "Riya Mansukhbhai Patel",
    initials: "RP",
    fatherNameGu: "મનસુખભાઈ રણછોડભાઈ પટેલ",
    fatherNameEn: "Mansukhbhai R. Patel",
    revenueFatherNameGu: "મનસુખલાલ આર. પટેલ",
    revenueFatherNameEn: "Mansukhlal R. Patel",
    ctsId: "GJ-AND-2026-004512",
    classGu: "ધોરણ ૯-B",
    classEn: "Class 9-B",
    classKey: "9-B",
    rollNo: "૨૪",
    schemeId: "namo_lakshmi",
    schemeGu: "નમો લક્ષ્મી યોજના",
    schemeEn: "Namo Lakshmi Yojana",
    schemeIcon: "savings",
    appliedDateGu: "૧૨ Oct, ૧૧:૩૦ AM",
    appliedDateEn: "12 Oct, 11:30 AM",
    status: "pending",
    aiStatusGu: "આવક નામ મેળ ખાતું નથી",
    aiStatusEn: "Income Name Mismatch",
    aiStatusHi: "आय प्रमाण पत्र नाम बेमेल",
    aiSubtextGu: "84% Match (મેન્યુઅલ તપાસ જરૂરી)",
    aiSubtextEn: "84% Match (Manual Check Needed)",
    aiFlagged: true,
    docsCountGu: "૩/૪ ચકાસાયેલ",
    docsCountEn: "3/4 Verified",
    docsValid: false,
    amountGu: "₹ ૧૦,૦૦૦",
    amountEn: "₹ 10,000",
    amountNum: 10000,
    amountTypeGu: "વાર્ષિક હપ્તો",
    amountTypeEn: "Annual Installment",
    flagIssueGu: "આવક પ્રમાણપત્ર નામ મેળ ખાતું નથી",
    flagIssueEn: "Guardian Name Discrepancy (AI Match: 84%)",
    flagIssueSubGu: "Guardian Name Discrepancy (AI Match: 84%)",
    flagIssueSubEn: "Guardian Name Discrepancy (AI Match: 84%)",
    aiNoteGu:
      "AI નોટ: પિતાના નામમાં 'ભાઈ' બદલે 'લાલ' છે. આધાર UID ટોકન અને રેશનકાર્ડ નંબર સમાન છે. આચાર્ય પોતાના વિવેકાધિકારથી મંજૂર કરી શકે છે.",
    aiNoteEn:
      "AI Note: Father's name has 'Lal' instead of 'Bhai'. Aadhaar UID token and ration card number match exactly. Principal can approve using discretionary powers.",
    docs: [
      {
        nameGu: "આવક પ્રમાણપત્ર (₹ ૬૮,૦૦૦)",
        nameEn: "Income Certificate (₹ 68,000)",
        statusTextGu: "⚠ નામમાં વિસંગતતા",
        statusTextEn: "⚠ Name discrepancy",
        statusType: "error",
        icon: "description",
        fileName: "income_certificate.pdf",
      },
      {
        nameGu: "જાતિ પ્રમાણપત્ર (SEBC/OBC)",
        nameEn: "Caste Certificate (SEBC/OBC)",
        statusTextGu: "✓ DigiLocker Verified",
        statusTextEn: "✓ DigiLocker Verified",
        statusType: "success",
        icon: "verified",
        fileName: "caste_certificate.pdf",
      },
      {
        nameGu: "ધોરણ ૮ માર્કશીટ (૮૪.૫%)",
        nameEn: "Grade 8 Marksheet (84.5%)",
        statusTextGu: "✓ GSEB Board Match",
        statusTextEn: "✓ GSEB Board Match",
        statusType: "success",
        icon: "task",
        fileName: "marksheet_std8.pdf",
      },
      {
        nameGu: "બેંક પાસબુક (BOB Anand)",
        nameEn: "Bank Passbook (BOB Anand)",
        statusTextGu: "✓ Aadhaar NPCI Seeded",
        statusTextEn: "✓ Aadhaar NPCI Seeded",
        statusType: "success",
        icon: "account_balance",
        fileName: "bank_passbook.pdf",
      },
    ],
  },
  {
    id: "app-2",
    nameGu: "પ્રિયા કિરણભાઈ વણકર",
    nameEn: "Priya Kiranbhai Vankar",
    initials: "PK",
    fatherNameGu: "કિરણભાઈ કાંતિભાઈ વણકર",
    fatherNameEn: "Kiranbhai K. Vankar",
    revenueFatherNameGu: "કિરણભાઈ કાંતિભાઈ વણકર",
    revenueFatherNameEn: "Kiranbhai K. Vankar",
    ctsId: "GJ-AND-2026-004529",
    classGu: "ધોરણ ૯-A",
    classEn: "Class 9-A",
    classKey: "9-A",
    rollNo: "૧૫",
    schemeId: "saraswati_sadhana",
    schemeGu: "સરસ્વતી સાધના સાઇકલ",
    schemeEn: "Saraswati Sadhana Cycle",
    schemeIcon: "pedal_bike",
    appliedDateGu: "૧૨ Oct, ૧૦:૧૫ AM",
    appliedDateEn: "12 Oct, 10:15 AM",
    status: "approved",
    aiStatusGu: "AI ઓટો-પાસ (૯૯% Match)",
    aiStatusEn: "AI Auto-Passed (99% Match)",
    aiStatusHi: "एआई ऑटो-पास (९९% मैच)",
    aiSubtextGu: "DigiLocker & Revenue OK",
    aiSubtextEn: "DigiLocker & Revenue OK",
    aiFlagged: false,
    docsCountGu: "૪/૪ માન્ય",
    docsCountEn: "4/4 Valid",
    docsValid: true,
    amountGu: "મફત સાઇકલ",
    amountEn: "Free Bicycle",
    amountNum: 4500,
    amountTypeGu: "Direct Voucher",
    amountTypeEn: "Direct Voucher",
    flagIssueGu: "કોઈ સમસ્યા નથી - ૧૦૦% માન્ય",
    flagIssueEn: "No issues - 100% Verified",
    flagIssueSubGu: "AI Match: 99% (DigiLocker & Revenue OK)",
    flagIssueSubEn: "AI Match: 99% (DigiLocker & Revenue OK)",
    aiNoteGu:
      "AI નોટ: તમામ દસ્તાવેજો ડિજીલોકર અને સરકારી રેકોર્ડ્સ સાથે મેળ ખાય છે. સાઇકલ વિતરણ વાઉચર સીધું જનરેટ થશે.",
    aiNoteEn:
      "AI Note: All documents match seamlessly with DigiLocker and government databases. Ready for cycle allocation voucher.",
    docs: [
      {
        nameGu: "આવક પ્રમાણપત્ર (₹ ૫૨,૦૦૦)",
        nameEn: "Income Certificate (₹ 52,000)",
        statusTextGu: "✓ DigiLocker Verified",
        statusTextEn: "✓ DigiLocker Verified",
        statusType: "success",
        icon: "verified",
        fileName: "income_cert.pdf",
      },
      {
        nameGu: "જાતિ પ્રમાણપત્ર (SC)",
        nameEn: "Caste Certificate (SC)",
        statusTextGu: "✓ DigiLocker Verified",
        statusTextEn: "✓ DigiLocker Verified",
        statusType: "success",
        icon: "verified",
        fileName: "caste_cert.pdf",
      },
      {
        nameGu: "ધોરણ ૮ પ્રવેશ પુરાવો",
        nameEn: "Grade 8 Admission Proof",
        statusTextGu: "✓ School CTS Verified",
        statusTextEn: "✓ School CTS Verified",
        statusType: "success",
        icon: "task",
        fileName: "admission_proof.pdf",
      },
      {
        nameGu: "રહેઠાણ પુરાવો (> ૪ કિમી)",
        nameEn: "Distance Proof (> 4 km)",
        statusTextGu: "✓ Geo-tagged Match",
        statusTextEn: "✓ Geo-tagged Match",
        statusType: "success",
        icon: "location_on",
        fileName: "distance_proof.pdf",
      },
    ],
  },
  {
    id: "app-3",
    nameGu: "દક્ષેશ સુરેશભાઈ પરમાર",
    nameEn: "Dakshesh Suresh Parmar",
    initials: "DS",
    fatherNameGu: "સુરેશભાઈ બાબુભાઈ પરમાર",
    fatherNameEn: "Sureshbhai B. Parmar",
    revenueFatherNameGu: "સુરેશભાઈ બાબુભાઈ પરમાર",
    revenueFatherNameEn: "Sureshbhai B. Parmar",
    ctsId: "GJ-AND-2026-004481",
    classGu: "ધોરણ ૧૦-A",
    classEn: "Class 10-A",
    classKey: "10-A",
    rollNo: "૦૮",
    schemeId: "gyan_sadhana",
    schemeGu: "જ્ઞાન સાધના શિષ્યવૃત્તિ",
    schemeEn: "Gyan Sadhana Scholarship",
    schemeIcon: "school",
    appliedDateGu: "૧૧ Oct, ૦૪:૪૫ PM",
    appliedDateEn: "11 Oct, 04:45 PM",
    status: "inprogress",
    aiStatusGu: "હાજરી ચકાસણી (૭૪%)",
    aiStatusEn: "Attendance Check (74%)",
    aiStatusHi: "उपस्थिति जांच (७४%)",
    aiSubtextGu: "Manual Approval Discretion",
    aiSubtextEn: "Manual Approval Discretion",
    aiFlagged: false,
    docsCountGu: "૪/૪ માન્ય",
    docsCountEn: "4/4 Valid",
    docsValid: true,
    amountGu: "₹ ૨૨,૫૦૦",
    amountEn: "₹ 22,500",
    amountNum: 22500,
    amountTypeGu: "વાર્ષિક મેરિટ",
    amountTypeEn: "Annual Merit",
    flagIssueGu: "હાજરી લઘુત્તમ ૭૫% થી ઓછી (૭૪%)",
    flagIssueEn: "Attendance slightly below 75% threshold (74%)",
    flagIssueSubGu: "Medical Certificate Attached (AI Discretion Triggered)",
    flagIssueSubEn: "Medical Certificate Attached (AI Discretion Triggered)",
    aiNoteGu:
      "AI નોટ: વિદ્યાર્થીની હાજરી ૭૪% છે (૭૫% આવશ્યક). બીમારીનું તબીબી પ્રમાણપત્ર શાળા દફતરે છે. આચાર્ય ૧% ની રાહત આપી મંજૂર કરી શકે છે.",
    aiNoteEn:
      "AI Note: Attendance is 74% (75% threshold). Medical certificate on file. Principal can grant 1% condonation under school discretion.",
    docs: [
      {
        nameGu: "મેરિટ સ્કોરકાર્ડ (Rank #1420)",
        nameEn: "Merit Scorecard (Rank #1420)",
        statusTextGu: "✓ State Exam Verified",
        statusTextEn: "✓ State Exam Verified",
        statusType: "success",
        icon: "school",
        fileName: "merit_score.pdf",
      },
      {
        nameGu: "આવક દાખલો (₹ ૧,૧૦,૦૦૦)",
        nameEn: "Income Certificate (₹ 1,10,000)",
        statusTextGu: "✓ Revenue Dept Verified",
        statusTextEn: "✓ Revenue Dept Verified",
        statusType: "success",
        icon: "verified",
        fileName: "income.pdf",
      },
      {
        nameGu: "ધોરણ ૯ પરિણામ (૭૮%)",
        nameEn: "Grade 9 Marksheet (78%)",
        statusTextGu: "✓ School CTS Verified",
        statusTextEn: "✓ School CTS Verified",
        statusType: "success",
        icon: "task",
        fileName: "marksheet9.pdf",
      },
      {
        nameGu: "બેંક આધાર સીડેડ ખાતું (SBI)",
        nameEn: "Bank Aadhaar Seeded (SBI)",
        statusTextGu: "✓ NPCI Active",
        statusTextEn: "✓ NPCI Active",
        statusType: "success",
        icon: "account_balance",
        fileName: "bank.pdf",
      },
    ],
  },
  {
    id: "app-4",
    nameGu: "જિયા ભાર્ગવભાઈ બ્રહ્મભટ્ટ",
    nameEn: "Jiya Bhargav Brahmbhatt",
    initials: "JB",
    fatherNameGu: "ભાર્ગવભાઈ રમેશભાઈ બ્રહ્મભટ્ટ",
    fatherNameEn: "Bhargavbhai R. Brahmbhatt",
    revenueFatherNameGu: "ભાર્ગવભાઈ રમેશભાઈ બ્રહ્મભટ્ટ",
    revenueFatherNameEn: "Bhargavbhai R. Brahmbhatt",
    ctsId: "GJ-AND-2026-004495",
    classGu: "ધોરણ ૯-B",
    classEn: "Class 9-B",
    classKey: "9-B",
    rollNo: "૧૨",
    schemeId: "namo_lakshmi",
    schemeGu: "નમો લક્ષ્મી યોજના",
    schemeEn: "Namo Lakshmi Yojana",
    schemeIcon: "savings",
    appliedDateGu: "૧૧ Oct, ૦૨:૧૫ PM",
    appliedDateEn: "11 Oct, 02:15 PM",
    status: "approved",
    aiStatusGu: "AI ઓટો-પાસ (૧૦૦% Match)",
    aiStatusEn: "AI Auto-Passed (100% Match)",
    aiStatusHi: "एआई ऑटो-पास (१००% मैच)",
    aiSubtextGu: "Jan Samarth & UIDAI Valid",
    aiSubtextEn: "Jan Samarth & UIDAI Valid",
    aiFlagged: false,
    docsCountGu: "૪/૪ માન્ય",
    docsCountEn: "4/4 Valid",
    docsValid: true,
    amountGu: "₹ ૧૦,૦૦૦",
    amountEn: "₹ 10,000",
    amountNum: 10000,
    amountTypeGu: "વાર્ષિક હપ્તો",
    amountTypeEn: "Annual Installment",
    flagIssueGu: "કોઈ સમસ્યા નથી - ૧૦૦% મેચ",
    flagIssueEn: "No issues - 100% Match",
    flagIssueSubGu: "Jan Samarth & UIDAI Valid",
    flagIssueSubEn: "Jan Samarth & UIDAI Valid",
    aiNoteGu:
      "AI નોટ: તમામ વિગતો સંપૂર્ણ સત્યાપિત છે. મંજૂરી માટે DBT લિસ્ટ તૈયાર.",
    aiNoteEn:
      "AI Note: All details fully verified. Ready for DBT batch processing.",
    docs: [
      {
        nameGu: "આવક પ્રમાણપત્ર (₹ ૭૫,૦૦૦)",
        nameEn: "Income Certificate (₹ 75,000)",
        statusTextGu: "✓ DigiLocker Verified",
        statusTextEn: "✓ DigiLocker Verified",
        statusType: "success",
        icon: "verified",
        fileName: "income.pdf",
      },
      {
        nameGu: "આધાર કાર્ડ પ્રમાણીકરણ",
        nameEn: "Aadhaar Card Verification",
        statusTextGu: "✓ UIDAI Biometric Match",
        statusTextEn: "✓ UIDAI Biometric Match",
        statusType: "success",
        icon: "verified",
        fileName: "aadhaar.pdf",
      },
      {
        nameGu: "શાળા પ્રવેશ પ્રમાણપત્ર",
        nameEn: "School Admission Certificate",
        statusTextGu: "✓ UDISE Verified",
        statusTextEn: "✓ UDISE Verified",
        statusType: "success",
        icon: "task",
        fileName: "udise.pdf",
      },
      {
        nameGu: "બેંક એકાઉન્ટ (HDFC Bank)",
        nameEn: "Bank Account (HDFC Bank)",
        statusTextGu: "✓ DBT Active",
        statusTextEn: "✓ DBT Active",
        statusType: "success",
        icon: "account_balance",
        fileName: "bank.pdf",
      },
    ],
  },
  {
    id: "app-5",
    nameGu: "મીત ચંદુભાઈ ચૌહાણ",
    nameEn: "Meet Chandubhai Chauhan",
    initials: "MC",
    fatherNameGu: "ચંદુભાઈ મગનભાઈ ચૌહાણ",
    fatherNameEn: "Chandubhai M. Chauhan",
    revenueFatherNameGu: "ચંદુભાઈ મગનભાઈ ચૌહાણ",
    revenueFatherNameEn: "Chandubhai M. Chauhan",
    ctsId: "GJ-AND-2026-004390",
    classGu: "ધોરણ ૧૧-સામાન્ય",
    classEn: "Class 11 (General)",
    classKey: "11",
    rollNo: "૩૧",
    schemeId: "sc_st",
    schemeGu: "SC/ST ઉચ્ચ શિક્ષણ સહાય",
    schemeEn: "SC/ST Higher Edu Aid",
    schemeIcon: "account_balance",
    appliedDateGu: "૧૦ Oct, ૦૯:૫૦ AM",
    appliedDateEn: "10 Oct, 09:50 AM",
    status: "rejected",
    aiStatusGu: "IFSC શાખા સુધારો જરૂરી",
    aiStatusEn: "IFSC Correction Required",
    aiStatusHi: "आईएफएससी सुधार आवश्यक",
    aiSubtextGu: "Merged Bank Baroda IFSC",
    aiSubtextEn: "Merged Bank Baroda IFSC",
    aiFlagged: true,
    docsCountGu: "૧ ખૂટે છે",
    docsCountEn: "1 Missing",
    docsValid: false,
    amountGu: "₹ ૧૫,૦૦૦",
    amountEn: "₹ 15,000",
    amountNum: 15000,
    amountTypeGu: "સાધન સહાય",
    amountTypeEn: "Equipment Aid",
    flagIssueGu: "બેંક ખાતાનો IFSC કોડ અમાન્ય (મર્જર બાદ)",
    flagIssueEn: "Bank Account IFSC Code Invalid (Post Merger)",
    flagIssueSubGu: "Dena Bank merged into BOB - New IFSC required",
    flagIssueSubEn: "Dena Bank merged into BOB - New IFSC required",
    aiNoteGu:
      "AI નોટ: બેંક ઓફ બરોડામાં દેના બેંકનું મર્જર થવાથી જૂનો IFSC સ્વીકાર્ય નથી. વિદ્યાર્થીને નવી પાસબુક અપલોડ કરવા સુધારો મોકલવો.",
    aiNoteEn:
      "AI Note: Due to Dena Bank merger into Bank of Baroda, obsolete IFSC was flagged. Student asked to upload new passbook.",
    docs: [
      {
        nameGu: "જાતિ પ્રમાણપત્ર (SC)",
        nameEn: "Caste Certificate (SC)",
        statusTextGu: "✓ DigiLocker Verified",
        statusTextEn: "✓ DigiLocker Verified",
        statusType: "success",
        icon: "verified",
        fileName: "caste.pdf",
      },
      {
        nameGu: "ધોરણ ૧૦ માર્કશીટ",
        nameEn: "Grade 10 Marksheet",
        statusTextGu: "✓ GSEB Board Verified",
        statusTextEn: "✓ GSEB Board Verified",
        statusType: "success",
        icon: "task",
        fileName: "marksheet10.pdf",
      },
      {
        nameGu: "બેંક પાસબુક (જૂનો Dena Bank)",
        nameEn: "Bank Passbook (Old Dena Bank)",
        statusTextGu: "✗ અમાન્ય IFSC કોડ",
        statusTextEn: "✗ Invalid IFSC Code",
        statusType: "error",
        icon: "report_problem",
        fileName: "passbook_old.pdf",
      },
      {
        nameGu: "આવક દાખલો",
        nameEn: "Income Certificate",
        statusTextGu: "✓ Valid till 2027",
        statusTextEn: "✓ Valid till 2027",
        statusType: "success",
        icon: "verified",
        fileName: "income.pdf",
      },
    ],
  },
  {
    id: "app-6",
    nameGu: "ભાવિક દિનેશભાઈ રોહિત",
    nameEn: "Bhavik Dineshbhai Rohit",
    initials: "BR",
    fatherNameGu: "દિનેશભાઈ બાબુભાઈ રોહિત",
    fatherNameEn: "Dineshbhai B. Rohit",
    revenueFatherNameGu: "દિનેશભાઈ બાબુભાઈ રોહિત",
    revenueFatherNameEn: "Dineshbhai B. Rohit",
    ctsId: "GJ-AND-2026-004310",
    classGu: "ધોરણ ૯-A",
    classEn: "Class 9-A",
    classKey: "9-A",
    rollNo: "૧૯",
    schemeId: "sc_st",
    schemeGu: "પ્રિ-મેટ્રિક શિષ્યવૃત્તિ",
    schemeEn: "Pre-Matric Scholarship",
    schemeIcon: "menu_book",
    appliedDateGu: "૧૦ Oct, ૦૮:૩૦ AM",
    appliedDateEn: "10 Oct, 08:30 AM",
    status: "pending",
    aiStatusGu: "જાતિ દાખલો ચકાસણી હેઠળ",
    aiStatusEn: "Caste Cert Under Review",
    aiStatusHi: "जाति प्रमाण पत्र समीक्षाधीन",
    aiSubtextGu: "91% Match (Manual Verification)",
    aiSubtextEn: "91% Match (Manual Verification)",
    aiFlagged: false,
    docsCountGu: "૩/૪ ચકાસાયેલ",
    docsCountEn: "3/4 Verified",
    docsValid: false,
    amountGu: "₹ ૩,૫૦૦",
    amountEn: "₹ 3,500",
    amountNum: 3500,
    amountTypeGu: "વાર્ષિક સહાય",
    amountTypeEn: "Annual Aid",
    flagIssueGu: "જાતિ દાખલામાં ડિજિટલ સહી અસ્પષ્ટ",
    flagIssueEn: "Digital Signature Faint on Caste Certificate",
    flagIssueSubGu: "Manual review against Taluka Welfare register",
    flagIssueSubEn: "Manual review against Taluka Welfare register",
    aiNoteGu:
      "AI નોટ: ડિજિટલ સહી અસ્પષ્ટ છે, તાલુકા સમાજ કલ્યાણ અધિકારીના પોર્ટલ સાથે ક્રોસ-વેરિફિકેશન ચાલી રહ્યું છે.",
    aiNoteEn:
      "AI Note: Digital signature is faint; background verification against Taluka Welfare portal in progress.",
    docs: [
      {
        nameGu: "આવક પ્રમાણપત્ર",
        nameEn: "Income Certificate",
        statusTextGu: "✓ Verified",
        statusTextEn: "✓ Verified",
        statusType: "success",
        icon: "verified",
        fileName: "income.pdf",
      },
      {
        nameGu: "જાતિ પ્રમાણપત્ર (SC)",
        nameEn: "Caste Certificate (SC)",
        statusTextGu: "⚠ સહી ચકાસણી બાકી",
        statusTextEn: "⚠ Signature check pending",
        statusType: "warning",
        icon: "pending_actions",
        fileName: "caste_pending.pdf",
      },
      {
        nameGu: "ધોરણ ૮ પરિણામ પત્રક (૭૬%)",
        nameEn: "Grade 8 Marksheet (76%)",
        statusTextGu: "✓ Verified",
        statusTextEn: "✓ Verified",
        statusType: "success",
        icon: "task",
        fileName: "marksheet.pdf",
      },
      {
        nameGu: "બેંક પાસબુક (PNB)",
        nameEn: "Bank Passbook (PNB)",
        statusTextGu: "✓ NPCI Seeded",
        statusTextEn: "✓ NPCI Seeded",
        statusType: "success",
        icon: "account_balance",
        fileName: "bank.pdf",
      },
    ],
  },
];

export default function VerificationQueuePage() {
  const [applications, setApplications] = useState<Application[]>(INITIAL_APPLICATIONS);
  const [searchQuery, setSearchQuery] = useState("");
  const [schemeFilter, setSchemeFilter] = useState("all");
  const [classFilter, setClassFilter] = useState("all");
  const [statusTab, setStatusTab] = useState<"pending" | "approved" | "rejected" | "all">("pending");
  const [selectedIds, setSelectedIds] = useState<string[]>(["app-1", "app-2", "app-3"]);
  const [activeAppId, setActiveAppId] = useState<string>("app-1");
  const [currentPage, setCurrentPage] = useState(1);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [previewDoc, setPreviewDoc] = useState<DocumentItem | null>(null);

  // Filtered applications
  const filteredApps = useMemo(() => {
    return applications.filter((app) => {
      // Status filter tab
      if (statusTab !== "all" && app.status !== statusTab) {
        return false;
      }

      // Scheme filter
      if (schemeFilter !== "all" && app.schemeId !== schemeFilter) {
        return false;
      }

      // Class filter
      if (classFilter !== "all" && app.classKey !== classFilter) {
        return false;
      }

      // Search query filter (matches student name in Gu/En, CTS ID, or scheme)
      if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase().trim();
        const matchesNameGu = app.nameGu.toLowerCase().includes(q);
        const matchesNameEn = app.nameEn.toLowerCase().includes(q);
        const matchesCts = app.ctsId.toLowerCase().includes(q);
        const matchesScheme = app.schemeGu.toLowerCase().includes(q) || app.schemeEn.toLowerCase().includes(q);
        if (!matchesNameGu && !matchesNameEn && !matchesCts && !matchesScheme) {
          return false;
        }
      }

      return true;
    });
  }, [applications, statusTab, schemeFilter, classFilter, searchQuery]);

  // Counts for tabs & badges
  const counts = useMemo(() => {
    return {
      pending: applications.filter((a) => a.status === "pending").length,
      approved: applications.filter((a) => a.status === "approved").length,
      rejected: applications.filter((a) => a.status === "rejected").length,
      all: applications.length,
    };
  }, [applications]);

  // Active student object for right inspection drawer
  const activeApp = useMemo(() => {
    return (
      applications.find((a) => a.id === activeAppId) ||
      filteredApps[0] ||
      applications[0]
    );
  }, [applications, activeAppId, filteredApps]);

  // Selected applications details & DBT total sum
  const selectedApps = useMemo(() => {
    return applications.filter((a) => selectedIds.includes(a.id));
  }, [applications, selectedIds]);

  const selectedDbtTotal = useMemo(() => {
    return selectedApps.reduce((acc, curr) => acc + curr.amountNum, 0);
  }, [selectedApps]);

  // Select all toggle for current filtered view
  const allFilteredSelected =
    filteredApps.length > 0 &&
    filteredApps.every((a) => selectedIds.includes(a.id));

  const handleSelectAllToggle = () => {
    if (allFilteredSelected) {
      // Unselect filtered items
      const filteredSet = new Set(filteredApps.map((a) => a.id));
      setSelectedIds((prev) => prev.filter((id) => !filteredSet.has(id)));
    } else {
      // Select all filtered items
      const newIds = new Set([...selectedIds, ...filteredApps.map((a) => a.id)]);
      setSelectedIds(Array.from(newIds));
    }
  };

  const handleRowCheckboxToggle = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Bulk Approve
  const handleBulkApprove = () => {
    if (selectedIds.length === 0) return;
    setApplications((prev) =>
      prev.map((app) =>
        selectedIds.includes(app.id)
          ? {
              ...app,
              status: "approved",
              aiFlagged: false,
              aiStatusGu: "આચાર્ય દ્વારા સામૂહિક મંજૂર",
              aiStatusEn: "Bulk Approved by Principal",
              aiStatusHi: "प्रधानाचार्य द्वारा थोक स्वीकृत",
            }
          : app
      )
    );
    setAlertMessage(`${selectedIds.length} અરજીઓ સફળતાપૂર્વક મંજૂર કરવામાં આવી!`);
    setTimeout(() => setAlertMessage(null), 4000);
  };

  // Bulk Reject / Request Correction
  const handleBulkReject = () => {
    if (selectedIds.length === 0) return;
    setApplications((prev) =>
      prev.map((app) =>
        selectedIds.includes(app.id)
          ? {
              ...app,
              status: "rejected",
              aiFlagged: true,
              aiStatusGu: "સુધારણા માટે પરત મોકલેલ",
              aiStatusEn: "Returned for Correction",
              aiStatusHi: "सुधार हेतु वापस भेजा गया",
            }
          : app
      )
    );
    setAlertMessage(`${selectedIds.length} અરજીઓ સુધારણા માટે પરત મોકલવામાં આવી.`);
    setTimeout(() => setAlertMessage(null), 4000);
  };

  // Single Approve from Drawer
  const handleSingleApprove = (id: string) => {
    setApplications((prev) =>
      prev.map((app) =>
        app.id === id
          ? {
              ...app,
              status: "approved",
              aiFlagged: false,
              aiStatusGu: "આચાર્ય વિશેષાધિકારથી મંજૂર",
              aiStatusEn: "Approved with Principal Discretion",
              aiStatusHi: "प्रधानाचार्य विशेषाधिकार द्वारा स्वीकृत",
            }
          : app
      )
    );
    setAlertMessage(`અરજી #${id} સફળતાપૂર્વક મંજૂર કરવામાં આવી!`);
    setTimeout(() => setAlertMessage(null), 4000);
  };

  // Single Reject / Request Fix from Drawer
  const handleSingleReject = (id: string) => {
    setApplications((prev) =>
      prev.map((app) =>
        app.id === id
          ? {
              ...app,
              status: "rejected",
              aiFlagged: true,
              aiStatusGu: "સુધારો મંગાવેલ",
              aiStatusEn: "Fix Requested",
              aiStatusHi: "सुधार मांगा गया",
            }
          : app
      )
    );
    setAlertMessage(`અરજી #${id} માટે વિદ્યાર્થીને સુધારણા નોટિસ મોકલવામાં આવી.`);
    setTimeout(() => setAlertMessage(null), 4000);
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery("");
    setSchemeFilter("all");
    setClassFilter("all");
    setStatusTab("all");
    setCurrentPage(1);
  };

  return (
    <OfficerShell role="school">
      <div className="p-4 sm:p-6 flex flex-col w-full gap-5">
        {/* Toast Notification Alert */}
        {alertMessage && (
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-success-container text-on-success-container border border-success/30 shadow-sm animate-fade-in">
            <div className="flex items-center gap-2">
              <Icon name="check_circle" size={20} className="text-success" />
              <span className="font-label-lg font-medium">{alertMessage}</span>
            </div>
            <button
              onClick={() => setAlertMessage(null)}
              className="text-on-success-container/70 hover:text-on-success-container"
              title="Close"
            >
              <Icon name="close" size={18} />
            </button>
          </div>
        )}

        {/* 1. Top Breadcrumb & Administrative Header Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 bg-surface-container-lowest p-5 rounded-xl shadow-sm border border-outline-variant">
          <div className="flex flex-col gap-1.5">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-on-surface-variant font-label-md text-label-md">
              <Link
                href="/school"
                className="hover:text-primary transition-colors flex items-center gap-1"
              >
                <Icon name="apartment" size={16} />
                <span>
                  <T gu="શાળાઓ" en="Schools" hi="स्कूल" />
                </span>
              </Link>
              <Icon name="chevron_right" size={14} />
              <span className="text-primary font-semibold">
                <T gu="વેરિફિકેશન કતાર" en="Verification Queue" hi="सत्यापन कतार" />
              </span>
            </div>

            {/* Title */}
            <div className="flex items-baseline gap-3 flex-wrap">
              <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
                <T
                  gu="શિષ્યવૃત્તિ અરજી ચકાસણી કતાર"
                  en="Scholarship Verification Queue"
                  hi="छात्रवृत्ति आवेदन सत्यापन कतार"
                />
              </h1>
              <span className="hidden md:inline-block font-label-lg text-label-lg text-on-surface-variant">
                <T
                  gu="Scholarship Verification Queue"
                  en="Scholarship Verification Queue"
                  hi="Scholarship Verification Queue"
                />
              </span>
            </div>

            {/* Subtitle */}
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              <T
                gu="ધોરણ ૯ થી ૧૨ ના વિદ્યાર્થીઓની શિષ્યવૃત્તિ અરજીઓ, AI ઓટો-વેરિફિકેશન અને દસ્તાવેજ ચકાસણી ડેસ્ક"
                en="Scholarship applications for grades 9-12, AI auto-verification, and document verification desk"
                hi="कक्षा ९ से १२ के छात्रों के छात्रवृत्ति आवेदन, एआई ऑटो-सत्यापन और दस्तावेज़ सत्यापन डेस्क"
              />
            </p>
          </div>

          {/* Summary Metric Badges */}
          <div className="flex items-center flex-wrap gap-2.5">
            <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-lg bg-secondary-fixed/50 text-on-secondary-fixed border border-secondary/20">
              <Icon name="pending_actions" size={20} className="text-secondary" />
              <div className="flex flex-col">
                <span className="font-caption text-caption text-on-surface-variant">
                  <T gu="કુલ પેન્ડિંગ" en="Pending" hi="लंबित" />
                </span>
                <span className="font-title-md text-title-md font-bold text-on-surface">
                  <T gu="૩૭" en="37" hi="३७" />
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-lg bg-surface-container-high text-on-surface border border-outline-variant">
              <Icon name="verified_user" size={20} className="text-primary" />
              <div className="flex flex-col">
                <span className="font-caption text-caption text-on-surface-variant">
                  <T gu="AI પાસ" en="Auto-Passed" hi="एआई पास" />
                </span>
                <span className="font-title-md text-title-md font-bold text-primary">
                  <T gu="૨૧૫" en="215" hi="२१५" />
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-lg bg-error-container text-on-error-container border border-error/20">
              <Icon name="warning" size={20} className="text-error" />
              <div className="flex flex-col">
                <span className="font-caption text-caption text-on-error-container">
                  <T gu="ફ્લેગ થયેલ" en="Flagged" hi="फ्लैग किया गया" />
                </span>
                <span className="font-title-md text-title-md font-bold text-error">
                  <T gu="૫" en="5" hi="५" />
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Filter & Controls Toolbar */}
        <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm border border-outline-variant flex flex-col gap-3.5">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            {/* Search Input */}
            <div className="md:col-span-5 relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant flex items-center pointer-events-none">
                <Icon name="search" size={18} />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="નામ, CTS ID અથવા અરજી નંબર શોધો... (Search by Student Name, CTS ID or App ID)"
                className="w-full h-11 pl-9 pr-9 rounded-lg bg-surface-container-low text-on-surface font-body-sm text-body-sm placeholder:text-on-surface-variant focus:outline-none focus:bg-surface-container-lowest border border-transparent focus:border-primary transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface"
                >
                  <Icon name="close" size={16} />
                </button>
              )}
            </div>

            {/* Scheme Selector */}
            <div className="md:col-span-3">
              <div className="relative">
                <select
                  value={schemeFilter}
                  onChange={(e) => setSchemeFilter(e.target.value)}
                  className="w-full h-11 px-3 pr-8 rounded-lg bg-surface-container-low text-on-surface font-body-sm text-body-sm appearance-none focus:outline-none focus:bg-surface-container-lowest border border-transparent focus:border-primary cursor-pointer transition-all"
                >
                  <option value="all">
                    બધા યોજનાઓ (All Schemes)
                  </option>
                  <option value="namo_lakshmi">
                    નમો લક્ષ્મી યોજના (Namo Lakshmi)
                  </option>
                  <option value="saraswati_sadhana">
                    સરસ્વતી સાધના સાઇકલ (Saraswati Cycle)
                  </option>
                  <option value="gyan_sadhana">
                    જ્ઞાન સાધના શિષ્યવૃત્તિ (Gyan Sadhana)
                  </option>
                  <option value="sc_st">
                    OBC / SC / ST શિષ્યવૃત્તિ સહાય
                  </option>
                </select>
                <span className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant flex items-center">
                  <Icon name="expand_more" size={18} />
                </span>
              </div>
            </div>

            {/* Class Selector */}
            <div className="md:col-span-2">
              <div className="relative">
                <select
                  value={classFilter}
                  onChange={(e) => setClassFilter(e.target.value)}
                  className="w-full h-11 px-3 pr-8 rounded-lg bg-surface-container-low text-on-surface font-body-sm text-body-sm appearance-none focus:outline-none focus:bg-surface-container-lowest border border-transparent focus:border-primary cursor-pointer transition-all"
                >
                  <option value="all">બધા ધોરણ (All Classes)</option>
                  <option value="9-B">ધોરણ ૯-B (Class 9-B)</option>
                  <option value="9-A">ધોરણ ૯-A (Class 9-A)</option>
                  <option value="10-A">ધોરણ ૧૦-A (Class 10-A)</option>
                  <option value="11">ધોરણ ૧૧ (સામાન્ય પ્રવાહ)</option>
                  <option value="12">ધોરણ ૧૨ (વિજ્ઞાન પ્રવાહ)</option>
                </select>
                <span className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant flex items-center">
                  <Icon name="tune" size={18} />
                </span>
              </div>
            </div>

            {/* Quick Action Controls */}
            <div className="md:col-span-2 flex items-center gap-2 justify-end">
              <button
                type="button"
                className="h-11 px-3 rounded-lg bg-surface-container-high text-on-surface font-label-md text-label-md flex items-center justify-center gap-1.5 hover:bg-surface-container-highest transition-colors w-full"
              >
                <Icon name="calendar_today" size={16} />
                <span>
                  <T gu="આ અઠવાડિયું" en="This Week" hi="इस सप्ताह" />
                </span>
              </button>
              <button
                type="button"
                onClick={resetFilters}
                className="h-11 w-11 shrink-0 rounded-lg bg-surface-container-low text-on-surface-variant hover:text-error hover:bg-error-container flex items-center justify-center transition-colors border border-transparent hover:border-error/20"
                title="Reset Filters"
              >
                <Icon name="restart_alt" size={18} />
              </button>
            </div>
          </div>

          {/* Status Segmented Pills */}
          <div className="flex items-center justify-between flex-wrap gap-2 pt-1 border-t border-surface-container-high/60">
            <div className="inline-flex p-1 rounded-lg bg-surface-container gap-1 flex-wrap">
              <button
                type="button"
                onClick={() => setStatusTab("pending")}
                className={`px-3 py-1.5 rounded-md font-label-md text-label-md transition-all flex items-center gap-1.5 ${
                  statusTab === "pending"
                    ? "bg-surface-container-lowest text-primary shadow-sm font-bold"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-secondary"></span>
                <span>
                  <T gu="પેન્ડિંગ" en="Pending" hi="लंबित" />
                </span>
                <span className="px-1.5 py-0.5 rounded-full bg-surface-container-high text-primary text-[10px] font-bold">
                  {counts.pending}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setStatusTab("approved")}
                className={`px-3 py-1.5 rounded-md font-label-md text-label-md transition-all flex items-center gap-1.5 ${
                  statusTab === "approved"
                    ? "bg-surface-container-lowest text-primary shadow-sm font-bold"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-primary"></span>
                <span>
                  <T gu="AI સ્વીકૃત / મંજૂર" en="Auto-Passed" hi="एआई पास" />
                </span>
                <span className="px-1.5 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant text-[10px] font-bold">
                  {counts.approved}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setStatusTab("rejected")}
                className={`px-3 py-1.5 rounded-md font-label-md text-label-md transition-all flex items-center gap-1.5 ${
                  statusTab === "rejected"
                    ? "bg-surface-container-lowest text-primary shadow-sm font-bold"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-error"></span>
                <span>
                  <T gu="ધ્યાન જરૂરી / ફ્લેગ્ડ" en="Flagged" hi="फ्लैग किया गया" />
                </span>
                <span className="px-1.5 py-0.5 rounded-full bg-error-container text-on-error-container text-[10px] font-bold">
                  {counts.rejected}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setStatusTab("all")}
                className={`px-3 py-1.5 rounded-md font-label-md text-label-md transition-all flex items-center gap-1.5 ${
                  statusTab === "all"
                    ? "bg-surface-container-lowest text-primary shadow-sm font-bold"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                <span>
                  <T gu="તમામ અરજીઓ" en="All Applications" hi="सभी आवेदन" />
                </span>
                <span className="px-1.5 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant text-[10px] font-bold">
                  {counts.all}
                </span>
              </button>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <span className="font-caption text-caption text-on-surface-variant">
                <T gu="સૉર્ટ કરો:" en="Sort by:" hi="क्रमबद्ध करें:" />
              </span>
              <button
                type="button"
                className="font-label-md text-label-md text-primary flex items-center gap-1 hover:underline"
              >
                <span>
                  <T
                    gu="સબમિટ તારીખ (સૌથી નવી)"
                    en="Submit Date (Newest)"
                    hi="जमा तिथि (नवीनतम)"
                  />
                </span>
                <Icon name="arrow_downward" size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* 3. Bulk Action Alert Strip */}
        <div className="bg-surface-container-high text-on-surface p-3.5 rounded-xl shadow-sm border border-outline-variant flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary-container text-on-primary flex items-center justify-center font-bold font-label-md shrink-0">
              {selectedIds.length}
            </div>
            <div className="flex flex-col">
              <span className="font-title-md text-title-md text-on-surface font-semibold">
                <T
                  gu={`${selectedIds.length} અરજીઓ પસંદ કરેલ (Bulk Processing Ready)`}
                  en={`${selectedIds.length} Applications Selected for Bulk Processing`}
                  hi={`${selectedIds.length} आवेदन थोक प्रसंस्करण हेतु चुने गए`}
                />
              </span>
              <span className="font-caption text-caption text-on-surface-variant">
                <T
                  gu={`કુલ મંજૂરી પાત્ર સહાય રકમ: ₹ ${selectedDbtTotal.toLocaleString(
                    "en-IN"
                  )}/- (Direct Benefit Transfer DBT Ready)`}
                  en={`Total Eligible DBT Amount: ₹ ${selectedDbtTotal.toLocaleString(
                    "en-IN"
                  )}/- (Direct Benefit Transfer Ready)`}
                  hi={`कुल पात्र डीबीटी राशि: ₹ ${selectedDbtTotal.toLocaleString(
                    "en-IN"
                  )}/- (प्रत्यक्ष लाभ अंतरण तैयार)`}
                />
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              disabled={selectedIds.length === 0}
              onClick={handleBulkApprove}
              className="h-10 px-4 rounded-lg bg-primary-container text-on-primary font-label-lg text-label-lg flex items-center gap-2 hover:bg-primary transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              <Icon name="verified" size={18} />
              <span>
                <T
                  gu={`સામૂહિક મંજૂર કરો (${selectedIds.length})`}
                  en={`Bulk Approve (${selectedIds.length})`}
                  hi={`थोक स्वीकृत करें (${selectedIds.length})`}
                />
              </span>
            </button>

            <button
              type="button"
              disabled={selectedIds.length === 0}
              onClick={handleBulkReject}
              className="h-10 px-3.5 rounded-lg bg-surface-container-lowest text-secondary font-label-md text-label-md flex items-center gap-1.5 hover:bg-surface-container-low transition-colors shadow-sm border border-outline-variant disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Icon name="edit_note" size={18} />
              <span>
                <T
                  gu="સુધારો મંગાવો (Correction)"
                  en="Request Correction"
                  hi="सुधार का अनुरोध करें"
                />
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                setAlertMessage("Excel રિપોર્ટ ડાઉનલોડ સફળતાપૂર્વક શરૂ થયો!");
                setTimeout(() => setAlertMessage(null), 3000);
              }}
              className="h-10 px-3 rounded-lg bg-surface-container-lowest text-on-surface-variant font-label-md text-label-md flex items-center gap-1.5 hover:bg-surface-container-low transition-colors shadow-sm border border-outline-variant"
            >
              <Icon name="download" size={18} />
              <span>
                <T gu="Excel ડાઉનલોડ" en="Download Excel" hi="एक्सेल डाउनलोड" />
              </span>
            </button>
          </div>
        </div>

        {/* 4. Main Split Layout (Table ~72% + Inspection Drawer ~28%) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Left Column: Verification Queue Table */}
          <div className="lg:col-span-8 flex flex-col gap-3 bg-surface-container-lowest p-4 rounded-xl shadow-sm border border-outline-variant">
            {filteredApps.length === 0 ? (
              <EmptyState
                icon="fact_check"
                title={
                  <T
                    gu="કોઈ અરજીઓ મળી નથી"
                    en="No applications found"
                    hi="कोई आवेदन नहीं मिला"
                  />
                }
                description={
                  <T
                    gu="તમારા ફિલ્ટર અથવા શોધ શબ્દ બદલીને ફરીથી પ્રયાસ કરો."
                    en="Try clearing search query or changing active status/scheme filters."
                    hi="फ़िल्टर या खोज बदलकर पुनः प्रयास करें।"
                  />
                }
                action={
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="h-10 px-4 rounded-lg bg-primary text-on-primary font-label-md text-label-md hover:bg-primary-container transition-colors mt-2"
                  >
                    <T
                      gu="ફિલ્ટર્સ રીસેટ કરો"
                      en="Reset Filters"
                      hi="फ़िल्टर रीसेट करें"
                    />
                  </button>
                }
              />
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-surface-container-low text-on-surface-variant font-label-md text-label-md uppercase tracking-wider">
                        <th className="p-3 rounded-l-lg w-10 text-center">
                          <input
                            type="checkbox"
                            checked={allFilteredSelected}
                            onChange={handleSelectAllToggle}
                            className="w-4 h-4 rounded text-primary focus:ring-0 cursor-pointer"
                            title="Select all"
                          />
                        </th>
                        <th className="p-3">
                          <T
                            gu="વિદ્યાર્થી (Student Details)"
                            en="Student Details"
                            hi="छात्र विवरण"
                          />
                        </th>
                        <th className="p-3">
                          <T gu="યોજના (Scheme)" en="Scheme" hi="योजना" />
                        </th>
                        <th className="p-3">
                          <T
                            gu="AI સ્કેન સ્થિતિ (AI Result)"
                            en="AI Result"
                            hi="एआई परिणाम"
                          />
                        </th>
                        <th className="p-3">
                          <T gu="દસ્તાવેજ" en="Docs" hi="दस्तावेज़" />
                        </th>
                        <th className="p-3">
                          <T gu="સહાય રકમ" en="Assistance" hi="सहायता राशि" />
                        </th>
                        <th className="p-3 rounded-r-lg text-right">
                          <T gu="કાર્યવાહી" en="Action" hi="कार्रवाई" />
                        </th>
                      </tr>
                    </thead>
                    <tbody className="font-body-sm text-body-sm text-on-surface divide-y divide-surface-container-high/40">
                      {filteredApps.map((app) => {
                        const isSelected = selectedIds.includes(app.id);
                        const isActive = activeApp?.id === app.id;

                        return (
                          <tr
                            key={app.id}
                            onClick={() => setActiveAppId(app.id)}
                            className={`cursor-pointer transition-colors ${
                              isActive
                                ? "bg-surface-container-high/70"
                                : isSelected
                                ? "bg-surface-container-low/80 hover:bg-surface-container-high/40"
                                : "hover:bg-surface-container-low/60"
                            }`}
                          >
                            {/* Checkbox */}
                            <td
                              className="p-3 text-center align-top pt-4"
                              onClick={(e) => handleRowCheckboxToggle(app.id, e)}
                            >
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => {}}
                                className="w-4 h-4 rounded text-primary focus:ring-0 cursor-pointer"
                              />
                            </td>

                            {/* Student Details */}
                            <td className="p-3 align-top">
                              <div className="flex items-start gap-2.5">
                                <Avatar
                                  name={app.nameEn}
                                  size="md"
                                  className={
                                    app.status === "rejected"
                                      ? "!bg-error/15 !text-error"
                                      : app.status === "approved"
                                      ? "!bg-primary/10 !text-primary"
                                      : "!bg-secondary-fixed !text-secondary"
                                  }
                                />
                                <div className="flex flex-col min-w-0">
                                  <span className="font-title-md text-title-md font-bold text-on-surface">
                                    <T
                                      gu={app.nameGu}
                                      en={app.nameEn}
                                      hi={app.nameEn}
                                    />
                                  </span>
                                  <span className="font-caption text-caption text-on-surface-variant truncate">
                                    {app.nameEn}
                                  </span>
                                  <div className="flex items-center gap-1.5 mt-1 font-caption text-caption text-on-surface-variant flex-wrap">
                                    <span className="px-1.5 py-0.5 rounded bg-surface-container text-on-surface font-mono">
                                      {app.ctsId}
                                    </span>
                                    <span className="px-1.5 py-0.5 rounded bg-surface-container-low text-primary font-semibold">
                                      <T
                                        gu={app.classGu}
                                        en={app.classEn}
                                        hi={app.classEn}
                                      />
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </td>

                            {/* Scheme Applied */}
                            <td className="p-3 align-top">
                              <div className="flex flex-col gap-1">
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary-container/10 text-primary font-label-md text-label-md font-semibold w-fit">
                                  <Icon name={app.schemeIcon} size={14} />
                                  <span>
                                    <T
                                      gu={app.schemeGu}
                                      en={app.schemeEn}
                                      hi={app.schemeEn}
                                    />
                                  </span>
                                </span>
                                <span className="font-caption text-caption text-on-surface-variant">
                                  <T
                                    gu={`અરજી: ${app.appliedDateGu}`}
                                    en={`Applied: ${app.appliedDateEn}`}
                                    hi={`आवेदन: ${app.appliedDateEn}`}
                                  />
                                </span>
                              </div>
                            </td>

                            {/* AI Result / Status */}
                            <td className="p-3 align-top">
                              <div className="flex flex-col gap-1">
                                <StatusChip
                                  status={app.status}
                                  label={
                                    <T
                                      gu={app.aiStatusGu}
                                      en={app.aiStatusEn}
                                      hi={app.aiStatusHi}
                                    />
                                  }
                                />
                                <span
                                  className={`font-caption text-caption ${
                                    app.aiFlagged
                                      ? "text-error font-medium"
                                      : "text-on-surface-variant"
                                  }`}
                                >
                                  <T
                                    gu={app.aiSubtextGu}
                                    en={app.aiSubtextEn}
                                    hi={app.aiSubtextEn}
                                  />
                                </span>
                              </div>
                            </td>

                            {/* Documents */}
                            <td className="p-3 align-top">
                              <span
                                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded font-label-md text-label-md ${
                                  app.docsValid
                                    ? "bg-surface-container-high text-primary"
                                    : "bg-surface-container text-on-surface"
                                }`}
                              >
                                <Icon
                                  name={
                                    app.docsValid
                                      ? "check"
                                      : app.status === "rejected"
                                      ? "close"
                                      : "warning"
                                  }
                                  size={14}
                                  className={
                                    app.docsValid
                                      ? "text-primary"
                                      : app.status === "rejected"
                                      ? "text-error"
                                      : "text-secondary"
                                  }
                                />
                                <span>
                                  <T
                                    gu={app.docsCountGu}
                                    en={app.docsCountEn}
                                    hi={app.docsCountEn}
                                  />
                                </span>
                              </span>
                            </td>

                            {/* Amount */}
                            <td className="p-3 align-top">
                              <div className="flex flex-col">
                                <span className="font-title-md text-title-md font-bold text-primary">
                                  <T
                                    gu={app.amountGu}
                                    en={app.amountEn}
                                    hi={app.amountEn}
                                  />
                                </span>
                                <span className="font-caption text-caption text-on-surface-variant">
                                  <T
                                    gu={app.amountTypeGu}
                                    en={app.amountTypeEn}
                                    hi={app.amountTypeEn}
                                  />
                                </span>
                              </div>
                            </td>

                            {/* Action Buttons */}
                            <td className="p-3 align-top text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <Link
                                  href={`/school/queue/${app.id}`}
                                  onClick={(e) => e.stopPropagation()}
                                  className="px-3 py-1.5 rounded-lg bg-primary-container text-on-primary font-label-md text-label-md hover:bg-primary transition-colors shadow-sm flex items-center gap-1"
                                >
                                  <span>
                                    <T gu="તપાસો" en="Review" hi="समीक्षा" />
                                  </span>
                                  <Icon name="chevron_right" size={14} />
                                </Link>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setActiveAppId(app.id);
                                  }}
                                  className="w-8 h-8 rounded-lg bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-on-surface-variant"
                                  title="Quick inspect"
                                >
                                  <Icon name="more_vert" size={18} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Pagination Footer */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-surface-container-high/40">
                  <span className="font-body-sm text-body-sm text-on-surface-variant">
                    <T
                      gu={`દર્શાવેલ: ૧ - ${filteredApps.length} માંથી કુલ ${applications.length} અરજીઓ | પાનાં ૧ / ૧`}
                      en={`Showing 1 - ${filteredApps.length} of ${applications.length} applications | Page 1 / 1`}
                      hi={`दर्शाया गया: १ - ${filteredApps.length} कुल ${applications.length} आवेदनों में से | पृष्ठ १ / १`}
                    />
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      className="w-8 h-8 rounded-lg bg-surface-container-low text-on-surface-variant disabled:opacity-50 flex items-center justify-center border border-outline-variant hover:bg-surface-container transition-colors disabled:cursor-not-allowed"
                      title="Previous page"
                    >
                      <Icon name="chevron_left" size={18} />
                    </button>
                    {[1, 2, 3].map((page) => (
                      <button
                        key={page}
                        type="button"
                        onClick={() => setCurrentPage(page)}
                        className={`w-8 h-8 rounded-lg font-label-md text-label-md flex items-center justify-center transition-colors border border-outline-variant ${
                          currentPage === page
                            ? "bg-primary-container text-on-primary font-bold"
                            : "bg-surface-container-low hover:bg-surface-container text-on-surface"
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    <span className="px-1 text-on-surface-variant">...</span>
                    <button
                      type="button"
                      onClick={() => setCurrentPage((p) => Math.min(3, p + 1))}
                      disabled={currentPage === 3}
                      className="w-8 h-8 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface-variant flex items-center justify-center transition-colors border border-outline-variant disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Next page"
                    >
                      <Icon name="chevron_right" size={18} />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Right Column: Quick Inspection / AI Detail Drawer */}
          {activeApp && (
            <div className="lg:col-span-4 flex flex-col gap-4 bg-surface-container-lowest p-4 rounded-xl shadow-sm border border-outline-variant">
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-2 border-b border-surface-container-high/60">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                      activeApp.aiFlagged
                        ? "bg-error-container text-error"
                        : "bg-surface-container-high text-primary"
                    }`}
                  >
                    <Icon name="policy" size={18} />
                  </div>
                  <div className="flex flex-col">
                    <h2 className="font-title-md text-title-md text-on-surface font-bold leading-tight">
                      <T
                        gu="AI તપાસ વિશ્લેષણ"
                        en="AI Inspection Report"
                        hi="एआई निरीक्षण विश्लेषण"
                      />
                    </h2>
                    <span className="font-caption text-caption text-on-surface-variant">
                      <T
                        gu="Inspection Report (Live Sync)"
                        en="Inspection Report (Live Sync)"
                        hi="निरीक्षण रिपोर्ट (लाइव सिंक)"
                      />
                    </span>
                  </div>
                </div>

                {activeApp.aiFlagged ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-error-container text-on-error-container font-label-md text-label-md font-bold">
                    <Icon name="warning" size={14} className="text-error" />
                    <span>
                      <T gu="ફ્લેગ થયેલ" en="Flagged" hi="फ्लैग किया गया" />
                    </span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-success-container text-on-success-container font-label-md text-label-md font-bold">
                    <Icon name="verified" size={14} className="text-success" />
                    <span>
                      <T gu="માન્ય" en="Verified" hi="सत्यापित" />
                    </span>
                  </span>
                )}
              </div>

              {/* Quick Student Snapshot */}
              <div className="flex items-center gap-3 p-3 rounded-lg bg-surface-container-low border border-outline-variant/60">
                <Avatar
                  name={activeApp.nameEn}
                  size="lg"
                  className="!w-12 !h-12 !text-base bg-secondary-container/20 text-secondary"
                />
                <div className="flex flex-col min-w-0">
                  <span className="font-title-md text-title-md font-bold text-on-surface truncate">
                    <T
                      gu={activeApp.nameGu}
                      en={activeApp.nameEn}
                      hi={activeApp.nameEn}
                    />
                  </span>
                  <span className="font-caption text-caption text-on-surface-variant truncate">
                    {activeApp.nameEn} •{" "}
                    <T
                      gu={`${activeApp.classGu} (રોલ નં: ${activeApp.rollNo})`}
                      en={`${activeApp.classEn} (Roll: ${activeApp.rollNo})`}
                      hi={`${activeApp.classEn} (रोल: ${activeApp.rollNo})`}
                    />
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="font-caption text-[11px] font-mono text-primary font-semibold">
                      CTS: {activeApp.ctsId}
                    </span>
                  </div>
                </div>
              </div>

              {/* Highlighted Warning or Validation Matrix */}
              <div
                className={`p-3.5 rounded-xl flex flex-col gap-2 border ${
                  activeApp.aiFlagged
                    ? "bg-error-container/30 border-error/30"
                    : "bg-surface-container-low border-surface-container-high"
                }`}
              >
                <div className="flex items-start gap-2">
                  <Icon
                    name={activeApp.aiFlagged ? "report_problem" : "check_circle"}
                    size={20}
                    className={`shrink-0 mt-0.5 ${
                      activeApp.aiFlagged ? "text-error" : "text-primary"
                    }`}
                  />
                  <div className="flex flex-col">
                    <span className="font-label-lg text-label-lg font-bold text-on-surface">
                      <T
                        gu={activeApp.flagIssueGu}
                        en={activeApp.flagIssueEn}
                        hi={activeApp.flagIssueEn}
                      />
                    </span>
                    <span className="font-caption text-caption text-on-surface-variant">
                      <T
                        gu={activeApp.flagIssueSubGu}
                        en={activeApp.flagIssueSubEn}
                        hi={activeApp.flagIssueSubEn}
                      />
                    </span>
                  </div>
                </div>

                {/* Comparison Box (When father name discrepancy exists) */}
                {activeApp.fatherNameGu !== activeApp.revenueFatherNameGu && (
                  <div className="grid grid-cols-2 gap-2 mt-1 p-2 rounded-lg bg-surface-container-lowest text-on-surface font-caption text-caption border border-outline-variant">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-on-surface-variant font-semibold">
                        <T
                          gu="શાળા CTS રેકોર્ડ:"
                          en="School CTS Record:"
                          hi="स्कूल सीटीएस रिकॉर्ड:"
                        />
                      </span>
                      <span className="font-title-md text-body-sm font-bold text-on-surface">
                        <T
                          gu={activeApp.fatherNameGu}
                          en={activeApp.fatherNameEn}
                          hi={activeApp.fatherNameEn}
                        />
                      </span>
                      <span className="text-on-surface-variant text-[11px]">
                        ({activeApp.fatherNameEn})
                      </span>
                    </div>

                    <div className="flex flex-col gap-0.5">
                      <span className="text-error font-semibold">
                        <T
                          gu="મહેસૂલ પ્રમાણપત્ર (TDO):"
                          en="Revenue Record (TDO):"
                          hi="राजस्व रिकॉर्ड (टीडीओ):"
                        />
                      </span>
                      <span className="font-title-md text-body-sm font-bold text-error">
                        <T
                          gu={activeApp.revenueFatherNameGu}
                          en={activeApp.revenueFatherNameEn}
                          hi={activeApp.revenueFatherNameEn}
                        />
                      </span>
                      <span className="text-on-surface-variant text-[11px]">
                        ({activeApp.revenueFatherNameEn})
                      </span>
                    </div>
                  </div>
                )}

                <p className="font-caption text-caption text-on-surface leading-relaxed">
                  <T
                    gu={activeApp.aiNoteGu}
                    en={activeApp.aiNoteEn}
                    hi={activeApp.aiNoteEn}
                  />
                </p>
              </div>

              {/* Verification Documents Checklist */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
                    <T
                      gu={`અપલોડ કરેલ દસ્તાવેજો (${activeApp.docs.length})`}
                      en={`Uploaded Documents (${activeApp.docs.length})`}
                      hi={`अपलोड किए गए दस्तावेज़ (${activeApp.docs.length})`}
                    />
                  </span>
                  <span className="font-caption text-caption text-primary font-semibold flex items-center gap-1">
                    <Icon name="cloud_done" size={14} />
                    <span>DigiLocker Synced</span>
                  </span>
                </div>

                <div className="flex flex-col gap-1.5">
                  {activeApp.docs.map((doc, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2.5 rounded-lg bg-surface-container-low hover:bg-surface-container transition-colors border border-outline-variant/40"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <Icon
                          name={doc.icon}
                          size={20}
                          className={`shrink-0 ${
                            doc.statusType === "error"
                              ? "text-error"
                              : doc.statusType === "warning"
                              ? "text-secondary"
                              : "text-primary"
                          }`}
                        />
                        <div className="flex flex-col min-w-0">
                          <span className="font-label-md text-label-md text-on-surface truncate">
                            <T gu={doc.nameGu} en={doc.nameEn} hi={doc.nameEn} />
                          </span>
                          <span
                            className={`font-caption text-caption ${
                              doc.statusType === "error"
                                ? "text-error"
                                : doc.statusType === "warning"
                                ? "text-secondary"
                                : "text-primary"
                            }`}
                          >
                            <T
                              gu={doc.statusTextGu}
                              en={doc.statusTextEn}
                              hi={doc.statusTextEn}
                            />
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setPreviewDoc(doc)}
                        className="px-2.5 py-1 rounded bg-surface-container-highest text-primary font-label-md text-label-md hover:bg-primary hover:text-on-primary transition-colors shrink-0"
                      >
                        <T gu="જુઓ" en="View" hi="देखें" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons in Right Panel */}
              <div className="flex flex-col gap-2 pt-2 border-t border-surface-container-high/60">
                <button
                  type="button"
                  onClick={() => handleSingleApprove(activeApp.id)}
                  className="w-full h-11 px-4 rounded-lg bg-primary-container text-on-primary font-label-lg text-label-lg flex items-center justify-center gap-2 hover:bg-primary transition-colors shadow-sm font-bold"
                >
                  <Icon name="verified" size={18} />
                  <span>
                    <T
                      gu="આચાર્ય વિશેષાધિકારથી મંજૂર કરો"
                      en="Approve with Principal Discretion"
                      hi="प्रधानाचार्य विशेषाधिकार द्वारा स्वीकृत करें"
                    />
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSingleReject(activeApp.id)}
                  className="w-full h-10 px-4 rounded-lg bg-surface-container text-secondary font-label-md text-label-md flex items-center justify-center gap-2 hover:bg-surface-container-high transition-colors border border-outline-variant"
                >
                  <Icon name="reply" size={18} />
                  <span>
                    <T
                      gu="વિદ્યાર્થીને સુધારો મોકલો (Request Fix)"
                      en="Send Correction Request to Student"
                      hi="छात्र को सुधार का अनुरोध भेजें"
                    />
                  </span>
                </button>

                <Link
                  href={`/school/queue/${activeApp.id}`}
                  className="w-full py-2 text-center text-primary font-label-md text-label-md hover:underline flex items-center justify-center gap-1 font-semibold"
                >
                  <span>
                    <T
                      gu="સંપૂર્ણ સમીક્ષા પેજ ખોલો (Full Review)"
                      en="Open Full Review Screen"
                      hi="पूर्ण समीक्षा पृष्ठ खोलें"
                    />
                  </span>
                  <Icon name="arrow_forward" size={16} />
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* 5. Document Preview Modal (Interactive) */}
        {previewDoc && (
          <div className="fixed inset-0 z-50 bg-on-surface/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-surface-container-lowest rounded-2xl max-w-lg w-full p-6 shadow-level-3 border border-outline-variant flex flex-col gap-4 animate-fade-in">
              <div className="flex items-center justify-between pb-3 border-b border-surface-container-high">
                <div className="flex items-center gap-2">
                  <Icon name="description" size={24} className="text-primary" />
                  <div>
                    <h3 className="font-title-md text-title-md font-bold text-on-surface">
                      <T
                        gu={previewDoc.nameGu}
                        en={previewDoc.nameEn}
                        hi={previewDoc.nameEn}
                      />
                    </h3>
                    <p className="font-caption text-caption text-on-surface-variant font-mono">
                      {previewDoc.fileName}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setPreviewDoc(null)}
                  className="w-8 h-8 rounded-lg hover:bg-surface-container-high flex items-center justify-center text-on-surface-variant"
                >
                  <Icon name="close" size={20} />
                </button>
              </div>

              {/* Preview Body Placeholder */}
              <div className="h-64 rounded-xl bg-surface-container-low border border-dashed border-outline flex flex-col items-center justify-center text-center p-6 gap-2">
                <Icon name="picture_as_pdf" size={48} className="text-error" />
                <span className="font-title-sm text-on-surface font-semibold">
                  <T
                    gu="સરકારી ડિજિટલ હસ્તાક્ષરિત દસ્તાવેજ"
                    en="Government Verified Signed Document"
                    hi="सरकारी सत्यापित हस्ताक्षरित दस्तावेज़"
                  />
                </span>
                <span className="font-caption text-caption text-on-surface-variant max-w-sm">
                  <T
                    gu="DigiLocker QR / e-Pramaan Token #GJ-ED-2026-99381. સુરક્ષિત કનેક્શન દ્વારા પ્રદર્શિત."
                    en="DigiLocker QR / e-Pramaan Token #GJ-ED-2026-99381 verified via state portal."
                    hi="डिजिलॉकर क्यूआर / ई-प्रमाण टोकन #GJ-ED-2026-99381 सत्यापित।"
                  />
                </span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setPreviewDoc(null)}
                  className="px-4 py-2 rounded-lg bg-surface-container text-on-surface font-label-md text-label-md hover:bg-surface-container-high transition-colors"
                >
                  <T gu="બંધ કરો" en="Close" hi="बंद करें" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAlertMessage("દસ્તાવેજ ડાઉનલોડ શરૂ થયો!");
                    setPreviewDoc(null);
                    setTimeout(() => setAlertMessage(null), 3000);
                  }}
                  className="px-4 py-2 rounded-lg bg-primary text-on-primary font-label-md text-label-md hover:bg-primary-container transition-colors flex items-center gap-1.5"
                >
                  <Icon name="download" size={16} />
                  <span>
                    <T gu="ડાઉનલોડ કરો" en="Download PDF" hi="पीडीएफ डाउनलोड करें" />
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 6. Bottom School Summary Banner / Quick Help Indicator */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-xl bg-surface-container-low text-on-surface font-body-sm text-body-sm shadow-sm border border-outline-variant">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-surface-container-highest text-primary flex items-center justify-center shrink-0">
              <Icon name="info" size={18} />
            </div>
            <div>
              <strong className="font-semibold text-on-surface">
                <T gu="નોંધ (Notice): " en="Notice: " hi="सूचना: " />
              </strong>
              <span className="text-on-surface-variant">
                <T
                  gu="નમો લક્ષ્મી યોજના હેઠળ માસિક હપ્તાની ચુકવણી દર મહિનાની ૭મી તારીખે સીધા DBT દ્વારા થાય છે. મંજૂરી સમયસર પૂર્ણ કરવી જરૂરી છે."
                  en="Under Namo Lakshmi Yojana, monthly installments are disbursed on the 7th of every month via DBT. Timely verification is mandatory."
                  hi="नमो लक्ष्मी योजना के तहत मासिक किस्तें प्रत्येक माह की ७ तारीख को सीधे डीबीटी द्वारा वितरित की जाती हैं।"
                />
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="font-caption text-caption text-on-surface-variant">
              <T
                gu="સહાયક હેલ્પડેસ્ક:"
                en="Support Helpdesk:"
                hi="सहायता हेल्पलाइन:"
              />
            </span>
            <span className="font-label-md text-label-md text-primary font-mono font-bold">
              1800 233 7955
            </span>
          </div>
        </div>
      </div>
    </OfficerShell>
  );
}
