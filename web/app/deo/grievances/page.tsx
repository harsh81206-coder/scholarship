"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { OfficerShell } from "@/components/shell/OfficerShell";
import { T } from "@/components/T";
import { Icon } from "@/components/Icon";
import {StatusChip} from "@/components/ui";

export type GrievanceType = "Payment" | "Document" | "Process";
export type GrievanceStatus = "new" | "inprogress" | "escalated" | "resolved";
export type GrievancePriority = "critical" | "medium" | "normal";

export interface TimelineEvent {
  id: string;
  time: string;
  date: string;
  title: string;
  description: string;
  badgeColor: string;
}

export interface Attachment {
  name: string;
  size: string;
  type: "image" | "pdf";
  uploadedBy: string;
}

export interface Grievance {
  id: string;
  studentName: string;
  studentInitials: string;
  ctsId: string;
  classGrade: string;
  rollNo: string;
  age: number;
  guardianName: string;
  contactNumber: string;
  schoolName: string;
  schoolDise: string;
  taluka: string;
  type: GrievanceType;
  typeLabelGu: string;
  typeLabelEn: string;
  schemeCategory: string;
  subjectGu: string;
  subjectEn: string;
  descriptionGu: string;
  descriptionEn: string;
  status: GrievanceStatus;
  daysOpen: number; // For SLA indicator! >7 days shows RED alert
  slaRemainingGu: string;
  slaRemainingEn: string;
  slaProgressPercent: number; // 0-100%
  priority: GrievancePriority;
  assignedOfficer: string;
  assignedRole: string;
  attachments: Attachment[];
  timeline: TimelineEvent[];
}

const INITIAL_GRIEVANCES: Grievance[] = [
  {
    id: "GRV-2026-0412",
    studentName: "રિયા હસમુખભાઈ પટેલ",
    studentInitials: "RP",
    ctsId: "GJ-AND-2026-004512",
    classGrade: "ધોરણ 9-બી",
    rollNo: "18",
    age: 14,
    guardianName: "મનસુખભાઈ પટેલ",
    contactNumber: "+91 98254-XXXXX",
    schoolName: "શ્રી સરદાર પટેલ હાઈસ્કૂલ, આણંદ શહેર",
    schoolDise: "DISE: 24150100201",
    taluka: "Anand",
    type: "Process",
    typeLabelGu: "સાયકલ ક્ષતિ",
    typeLabelEn: "Cycle Defect",
    schemeCategory: "સરસ્વતી સાધના યોજના (Saraswati Sadhna Yojana)",
    subjectGu: "સાયકલ હેન્ડઓવર વિલંબ અને ફ્રેમ ક્ષતિ રિપ્લેસમેન્ટ",
    subjectEn: "Bicycle Handover Delay & Damaged Frame Replacement Order",
    descriptionGu:
      "શાળામાં સાયકલ વિતરણ શરૂ થયું છે પરંતુ અમારી સાયકલની ફ્રેમ પર સ્ક્રેચ અને હેન્ડલ બેન્ડ છે. આચાર્યશ્રીએ વેન્ડર રિપ્લેસમેન્ટ માટે કહ્યું છે પરંતુ હજુ નવી સાયકલ મળી નથી. કૃપા કરીને નવી અખંડ સાયકલ તાકીદે આપવા વિનંતી.",
    descriptionEn:
      "Bicycle distribution started at school, but the allotted bicycle has a frame scratch and bent handlebar. The principal advised replacement from vendor Atlas, but new cycle has not yet been delivered. Requesting immediate replacement.",
    status: "inprogress",
    daysOpen: 3,
    slaRemainingGu: "નિકાલ સમયમર્યાદા: 24 કલાક બાકી",
    slaRemainingEn: "SLA Deadline: 24 hrs remaining",
    slaProgressPercent: 50,
    priority: "medium",
    assignedOfficer: "શ્રી કે. એમ. રાવલ",
    assignedRole: "નોડલ અધિકારી, આણંદ",
    attachments: [
      {
        name: "cycle_frame_defect.jpg",
        size: "1.8 MB",
        type: "image",
        uploadedBy: "વાલી અપલોડ કરેલ (Guardian)",
      },
    ],
    timeline: [
      {
        id: "t-1",
        date: "19 ઓક્ટોબર",
        time: "11:00 AM",
        title: "DEO સ્તર સમીક્ષા",
        description: "DEO સ્તર પર પ્રાથમિકતા 'મધ્યમ' તરીકે નિર્ધારિત અને વેન્ડર ટીમ સાથે સંકલન શરૂ કરાયું.",
        badgeColor: "bg-primary",
      },
      {
        id: "t-2",
        date: "18 ઓક્ટોબર",
        time: "02:30 PM",
        title: "આચાર્ય ટિપ્પણી",
        description: 'આચાર્ય ડૉ. કલ્પેશ શાહની ટિપ્પણી: "વેન્ડર Atlas Gujarat ને રિપ્લેસમેન્ટ વિનંતી મોકલેલ છે."',
        badgeColor: "bg-secondary",
      },
      {
        id: "t-3",
        date: "18 ઓક્ટોબર",
        time: "10:15 AM",
        title: "ફરિયાદ નોંધણી",
        description: "વાલી દ્વારા પોર્ટલ પરથી ફરિયાદ સફળતાપૂર્વક દાખલ.",
        badgeColor: "bg-outline",
      },
    ],
  },
  {
    id: "GRV-2026-0371",
    studentName: "અલ્તાફ મુસ્તફા શેખ",
    studentInitials: "AS",
    ctsId: "GJ-AND-2026-003891",
    classGrade: "ધોરણ 10-એ",
    rollNo: "07",
    age: 15,
    guardianName: "મુસ્તફા શેખ",
    contactNumber: "+91 94281-XXXXX",
    schoolName: "જનતા વિદ્યાલય, તારાપુર",
    schoolDise: "DISE: 24150200115",
    taluka: "Tarapur",
    type: "Payment",
    typeLabelGu: "DBT અટકેલ",
    typeLabelEn: "DBT Failure",
    schemeCategory: "નમો લક્ષ્મી યોજના (Namo Lakshmi Scheme)",
    subjectGu: "PFMS રિજેક્શન ક્લિયરન્સ અને ત્રિમાસિક હપ્તા વિલંબ",
    subjectEn: "PFMS Rejection Clearance & Direct Bank Transfer Delay",
    descriptionGu:
      "નમો લક્ષ્મી યોજના હેઠળ બીજા ત્રિમાસિક હપ્તાના ₹ ૨,૫૦૦ જમા થયા નથી. PFMS પોર્ટલ પર 'Bank Account Closed/Invalid' એરર બતાવે છે, પરંતુ બેંક શાખા કહે છે કે એકાઉન્ટ સક્રિય છે.",
    descriptionEn:
      "Quarterly installment of ₹ 2,500 under Namo Lakshmi Scheme has not been credited. PFMS portal shows error 'Bank Account Closed/Invalid' while local bank branch confirms account is active.",
    status: "escalated",
    daysOpen: 9, // > 7 DAYS! SLA BREACHED!
    slaRemainingGu: "SLA Breached: +36 કલાક વિલંબ (>7 દિવસ ખુલ્લી)",
    slaRemainingEn: "SLA Breached: +36 hrs overdue (>7 days open)",
    slaProgressPercent: 100,
    priority: "critical",
    assignedOfficer: "શ્રી એન. વી. જોષી",
    assignedRole: "એકાઉન્ટ ઓફિસર, આણંદ",
    attachments: [
      {
        name: "bank_passbook_copy.pdf",
        size: "2.4 MB",
        type: "pdf",
        uploadedBy: "તારાપુર તાલુકા સેલ",
      },
    ],
    timeline: [
      {
        id: "t-4",
        date: "20 ઓક્ટોબર",
        time: "09:30 AM",
        title: "રાજ્ય સ્તરે એસ્કેલેટ",
        description: "ગાંધીનગર રાજ્ય ડાયરેક્ટરેટ સ્તરે PFMS મેન્ડેટ સુધારણા અર્થે ફાઇલ મોકલવામાં આવી.",
        badgeColor: "bg-error",
      },
      {
        id: "t-5",
        date: "15 ઓક્ટોબર",
        time: "03:00 PM",
        title: "IFSC પુનઃ ચકાસણી",
        description: "તારાપુર TPEO દ્વારા બેંક શાખા સાથે IFSC કોડ સુધારણા પ્રક્રિયા ચકાસવામાં આવી.",
        badgeColor: "bg-secondary",
      },
      {
        id: "t-6",
        date: "11 ઓક્ટોબર",
        time: "11:20 AM",
        title: "ફરિયાદ નોંધણી",
        description: "વિદ્યાર્થી વાલી દ્વારા ગ્રામ પંચાયત ડિજિટલ સેવા કેન્દ્ર મારફતે ફરિયાદ દાખલ.",
        badgeColor: "bg-outline",
      },
    ],
  },
  {
    id: "GRV-2026-0425",
    studentName: "ભાવિકા પરમાર",
    studentInitials: "BP",
    ctsId: "GJ-AND-2026-005612",
    classGrade: "ધોરણ 9-સી",
    rollNo: "24",
    age: 14,
    guardianName: "સંજય પરમાર",
    contactNumber: "+91 97230-XXXXX",
    schoolName: "મોડેલ સ્કૂલ, ઉમરેઠ",
    schoolDise: "DISE: 24150300408",
    taluka: "Umreth",
    type: "Document",
    typeLabelGu: "આવક દાખલો",
    typeLabelEn: "Income Doc",
    schemeCategory: "ઓબીસી પ્રિ-મેટ્રિક શિષ્યવૃત્તિ (OBC Pre-Matric Scholarship)",
    subjectGu: "આવક દાખલામાં નામ સ્પેલિંગ મિસમેચ પ્રશ્ન",
    subjectEn: "Income Certificate Name Spelling Mismatch Correction",
    descriptionGu:
      "આવક પ્રમાણપત્રમાં પિતાના નામનો સ્પેલિંગ આધાર કાર્ડ સાથે મેળ ખાતો નથી, જેના કારણે પોર્ટલ પર વેરિફિકેશન રિજેક્ટ થઈ રહ્યું છે. તલાટી દ્વારા નવું પ્રમાણપત્ર અપલોડ કરવાની પરવાનગી આપો.",
    descriptionEn:
      "Spelling of father&apos;s name on Income Certificate does not match Aadhaar card, leading to system rejection. Requesting approval to re-upload revised digital certificate issued by Talati.",
    status: "new",
    daysOpen: 2,
    slaRemainingGu: "SLA: 3 દિવસ બાકી",
    slaRemainingEn: "SLA: 3 days remaining",
    slaProgressPercent: 30,
    priority: "normal",
    assignedOfficer: "દસ્તાવેજ ચકાસણી સેલ",
    assignedRole: "ઉમરેઠ તાલુકા શાખા",
    attachments: [
      {
        name: "income_certificate_revised.pdf",
        size: "1.1 MB",
        type: "pdf",
        uploadedBy: "વાલી અપલોડ કરેલ",
      },
    ],
    timeline: [
      {
        id: "t-7",
        date: "19 ઓક્ટોબર",
        time: "04:00 PM",
        title: "વેરિફિકેશન કતાર",
        description: "દસ્તાવેજ કચેરી સમક્ષ પુનઃ સમીક્ષા માટે ફાળવવામાં આવી.",
        badgeColor: "bg-primary",
      },
      {
        id: "t-8",
        date: "18 ઓક્ટોબર",
        time: "06:10 PM",
        title: "ફરિયાદ નોંધણી",
        description: "ઓનલાઇન સિટીઝન પોર્ટલ દ્વારા ફરિયાદ પ્રાપ્ત.",
        badgeColor: "bg-outline",
      },
    ],
  },
  {
    id: "GRV-2026-0398",
    studentName: "દક્ષેશ પરમાર",
    studentInitials: "DP",
    ctsId: "GJ-AND-2026-002341",
    classGrade: "ધોરણ 10-બી",
    rollNo: "11",
    age: 15,
    guardianName: "હિતેશભાઈ પરમાર",
    contactNumber: "+91 98982-XXXXX",
    schoolName: "સાર્વજનિક હાઈસ્કૂલ, આંકલાવ",
    schoolDise: "DISE: 24150400302",
    taluka: "Anklav",
    type: "Payment",
    typeLabelGu: "NPCI આધાર",
    typeLabelEn: "NPCI Seeding",
    schemeCategory: "નમો લક્ષ્મી યોજના (Namo Lakshmi Scheme)",
    subjectGu: "બેંક NPCI આધાર ડીબીટી સીડિંગ અસંગતતા",
    subjectEn: "Bank NPCI Aadhaar DBT Seeding Inconsistency",
    descriptionGu:
      "વિદ્યાર્થીના બેંક એકાઉન્ટમાં આધાર ડીબીટી સીડિંગ હોવા છતાં સ્ટેટસ ઇનએક્ટિવ બતાવે છે. બેંક ઓફ બરોડા શાખા દ્વારા NPCI મેપર અપડેટ કરવાની અરજી મોકલેલી છે.",
    descriptionEn:
      "Despite linking Aadhaar with bank account, DBT seeding status reflects inactive on portal. Request submitted to Bank of Baroda branch to refresh NPCI mapper.",
    status: "inprogress",
    daysOpen: 5,
    slaRemainingGu: "SLA: 18 કલાક બાકી",
    slaRemainingEn: "SLA: 18 hrs remaining",
    slaProgressPercent: 75,
    priority: "medium",
    assignedOfficer: "LDM આણંદ",
    assignedRole: "અગ્રણી જિલ્લા બેંક મેનેજર",
    attachments: [
      {
        name: "bob_npci_acknowledgment.pdf",
        size: "850 KB",
        type: "pdf",
        uploadedBy: "બેંક પ્રતિનિધિ",
      },
    ],
    timeline: [
      {
        id: "t-9",
        date: "19 ઓક્ટોબર",
        time: "01:15 PM",
        title: "બેંક સંપર્ક",
        description: "બેંક ઓફ બરોડા આંકલાવ શાખા સાથે ચકાસણી ચાલુ છે.",
        badgeColor: "bg-secondary",
      },
      {
        id: "t-10",
        date: "17 ઓક્ટોબર",
        time: "10:00 AM",
        title: "LDM સમીક્ષા",
        description: "અગ્રણી જિલ્લા મેનેજર દ્વારા NPCI કતારમાં કેસ મૂકવામાં આવ્યો.",
        badgeColor: "bg-primary",
      },
      {
        id: "t-11",
        date: "15 ઓક્ટોબર",
        time: "02:45 PM",
        title: "ફરિયાદ નોંધણી",
        description: "શાળા નોડલ શિક્ષક દ્વારા પોર્ટલ પર કેસ દાખલ કરવામાં આવ્યો.",
        badgeColor: "bg-outline",
      },
    ],
  },
  {
    id: "GRV-2026-0402",
    studentName: "પૂજા મકવાણા",
    studentInitials: "PM",
    ctsId: "GJ-AND-2026-006119",
    classGrade: "ધોરણ 9-એ",
    rollNo: "16",
    age: 14,
    guardianName: "મોહનભાઈ મકવાણા",
    contactNumber: "+91 99041-XXXXX",
    schoolName: "વિનય મંદિર, ખંભાત",
    schoolDise: "DISE: 24150500120",
    taluka: "Khambhat",
    type: "Process",
    typeLabelGu: "હેન્ડઓવર OTP",
    typeLabelEn: "Handover OTP",
    schemeCategory: "સરસ્વતી સાધના સાયકલ યોજના",
    subjectGu: "સાયકલ ડિલિવરી હેન્ડઓવર OTP ટેકનિકલ નિષ્ફળતા",
    subjectEn: "Bicycle Delivery Handover OTP Technical Failure",
    descriptionGu:
      "શાળામાં સાયકલ વિતરણ સમયે વાલીના મોબાઈલ પર ઓટીપી આવતો નથી, જેથી શિક્ષક સાયકલ હસ્તાંતરિત કરી શકતા નથી. વૈકલ્પિક ઓટીપી જનરેટ કરવા અથવા મેન્યુઅલ મંજૂરી આપવા વિનંતી.",
    descriptionEn:
      "During bicycle distribution at school, parent mobile is not receiving the verification OTP, preventing teacher from handing over the bike. Requesting alternative OTP dispatch or DEO override.",
    status: "inprogress",
    daysOpen: 4,
    slaRemainingGu: "SLA: 1 દિવસ બાકી",
    slaRemainingEn: "SLA: 1 day remaining",
    slaProgressPercent: 60,
    priority: "medium",
    assignedOfficer: "BPO ખંભાત",
    assignedRole: "બ્લોક પ્રોજેક્ટ ઓફિસર",
    attachments: [
      {
        name: "school_handover_slip.pdf",
        size: "540 KB",
        type: "pdf",
        uploadedBy: "આચાર્યશ્રી વિનય મંદિર",
      },
    ],
    timeline: [
      {
        id: "t-12",
        date: "18 ઓક્ટોબર",
        time: "05:20 PM",
        title: "શિક્ષક સાથે સંપર્ક",
        description: "BPO ખંભાત દ્વારા વર્ગ શિક્ષક સાથે ટેલિફોનિક ચકાસણી પૂર્ણ.",
        badgeColor: "bg-secondary",
      },
      {
        id: "t-13",
        date: "16 ઓક્ટોબર",
        time: "11:30 AM",
        title: "ફરિયાદ નોંધણી",
        description: "તાલુકા હેલ્પડેસ્ક પર નોંધાયેલ કેસ.",
        badgeColor: "bg-outline",
      },
    ],
  },
  {
    id: "GRV-2026-0355",
    studentName: "પ્રિયંકા સોલંકી",
    studentInitials: "PS",
    ctsId: "GJ-AND-2026-001208",
    classGrade: "ધોરણ 10-બી",
    rollNo: "05",
    age: 15,
    guardianName: "ભરતભાઈ સોલંકી",
    contactNumber: "+91 98250-XXXXX",
    schoolName: "સરકારી કન્યા હાઈસ્કૂલ, પેટલાદ",
    schoolDise: "DISE: 24150600210",
    taluka: "Petlad",
    type: "Document",
    typeLabelGu: "વેરિફિકેશન",
    typeLabelEn: "Verification",
    schemeCategory: "નમો લક્ષ્મી યોજના (Namo Lakshmi Scheme)",
    subjectGu: "નમો લક્ષ્મી પોર્ટલ બાયોમેટ્રિક વેરિફિકેશન સફળ",
    subjectEn: "Namo Lakshmi Biometric KYC Unblock & Re-verification",
    descriptionGu:
      "નમો લક્ષ્મી યોજના પોર્ટલ પર વિદ્યાર્થીની બાયોમેટ્રિક આધાર પ્રમાણીકરણ ભૂલ ઉકેલાઈ ગઈ છે અને લાભાર્થી યાદીમાં નામ મંજૂર કરવામાં આવ્યું છે.",
    descriptionEn:
      "Biometric Aadhaar authentication error resolved successfully on the scholarship portal. Benefit released to mapped DBT account.",
    status: "resolved",
    daysOpen: 1,
    slaRemainingGu: "નિકાલ પૂર્ણ (Resolved)",
    slaRemainingEn: "Resolved successfully",
    slaProgressPercent: 100,
    priority: "normal",
    assignedOfficer: "શ્રી જે. પી. પટેલ",
    assignedRole: "નોડલ અધિકારી, પેટલાદ",
    attachments: [
      {
        name: "kyc_confirmation_receipt.pdf",
        size: "620 KB",
        type: "pdf",
        uploadedBy: "પેટલાદ કચેરી",
      },
    ],
    timeline: [
      {
        id: "t-14",
        date: "19 ઓક્ટોબર",
        time: "04:15 PM",
        title: "નિકાલ પૂર્ણ",
        description: "સમસ્યા સફળતાપૂર્વક ઉકેલાઈ. વાલી તરફથી 5-Star સંતોષ રેટિંગ પ્રાપ્ત થયું.",
        badgeColor: "bg-primary",
      },
      {
        id: "t-15",
        date: "19 ઓક્ટોબર",
        time: "10:00 AM",
        title: "બાયોમેટ્રિક અપડેટ",
        description: "UIDAI સર્વર સાથે વિદ્યાર્થી ડેટા મેચ સફળ થયો.",
        badgeColor: "bg-secondary",
      },
      {
        id: "t-16",
        date: "18 ઓક્ટોબર",
        time: "09:00 AM",
        title: "ફરિયાદ નોંધણી",
        description: "પોર્ટલ દ્વારા અરજી દાખલ.",
        badgeColor: "bg-outline",
      },
    ],
  },
  {
    id: "GRV-2026-0340",
    studentName: "ચિરાગ વણકર",
    studentInitials: "CV",
    ctsId: "GJ-AND-2026-007812",
    classGrade: "ધોરણ 9-એ",
    rollNo: "09",
    age: 14,
    guardianName: "રમણભાઈ વણકર",
    contactNumber: "+91 98790-XXXXX",
    schoolName: "ડી.એન. હાઈસ્કૂલ, આણંદ",
    schoolDise: "DISE: 24150100105",
    taluka: "Anand",
    type: "Payment",
    typeLabelGu: "ટ્રેઝરી બિલ",
    typeLabelEn: "Treasury Delay",
    schemeCategory: "નેશનલ પ્રિ-મેટ્રિક શિષ્યવૃત્તિ",
    subjectGu: "શિષ્યવૃત્તિ ટ્રેઝરી ચુકવણી અટકેલ અને વિલંબ",
    subjectEn: "Scholarship Treasury Clearance Hold Overdue",
    descriptionGu:
      "પ્રિ-મેટ્રિક શિષ્યવૃત્તિ અગાઉના વર્ષની બાકી રકમ જમા થઈ નથી. 11 દિવસથી પેન્ડિંગ છે અને પોર્ટલ પર ટ્રેઝરી બિલ અટકેલું બતાવે છે. તાકીદે મંજૂરી આપવા વિનંતી.",
    descriptionEn:
      "Pre-matric scholarship grant for previous academic session remains unpaid. The case has been pending for 11 days with treasury sanction token held up. Requesting priority release.",
    status: "escalated",
    daysOpen: 11, // > 7 DAYS! SLA BREACHED!
    slaRemainingGu: "SLA Breached: 11 દિવસ (>7 દિવસ ઉલ્લંઘન)",
    slaRemainingEn: "SLA Breached: 11 days open (>7 days threshold)",
    slaProgressPercent: 100,
    priority: "critical",
    assignedOfficer: "સ્ટેટ નોડલ સચિવ",
    assignedRole: "ગાંધીનગર સચિવાલય",
    attachments: [
      {
        name: "treasury_token_receipt.pdf",
        size: "1.3 MB",
        type: "pdf",
        uploadedBy: "ડી.એન. હાઈસ્કૂલ ક્લાર્ક",
      },
    ],
    timeline: [
      {
        id: "t-17",
        date: "18 ઓક્ટોબર",
        time: "02:00 PM",
        title: "તાકીદ રીમાઇન્ડર 2",
        description: "ગાંધીનગર નાણાં વિભાગને તાકીદ સૂચના મોકલવામાં આવી.",
        badgeColor: "bg-error",
      },
      {
        id: "t-18",
        date: "14 ઓક્ટોબર",
        time: "11:00 AM",
        title: "રાજ્ય સ્તરે રી-એસ્કેલેટ",
        description: "જિલ્લા સ્તરેથી ફાઇલ ગાંધીનગર મોકલાઈ.",
        badgeColor: "bg-secondary",
      },
      {
        id: "t-19",
        date: "09 ઓક્ટોબર",
        time: "10:00 AM",
        title: "ફરિયાદ નોંધણી",
        description: "વાલી દ્વારા શાળા મારફતે ફરિયાદ દાખલ.",
        badgeColor: "bg-outline",
      },
    ],
  },
];

export default function DeoGrievancePage() {
  const [grievances, setGrievances] = useState<Grievance[]>(INITIAL_GRIEVANCES);
  const [selectedId, setSelectedId] = useState<string>("GRV-2026-0412");
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [talukaFilter, setTalukaFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"kanban" | "table">("kanban");

  // Interaction feedback states
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [responseTemplate, setResponseTemplate] = useState<string>("vendor");
  const [actionNotes, setActionNotes] = useState("");

  // Modals
  const [activeModal, setActiveModal] = useState<
    "none" | "resolve" | "escalate" | "reassign" | "more_info" | "new_grievance"
  >("none");

  // Reassign modal state
  const [newOfficer, setNewOfficer] = useState("શ્રી કે. એમ. રાવલ");
  // Escalate modal state
  const [escalateDepartment, setEscalateDepartment] = useState("ગાંધીનગર શિષ્યવૃત્તિ નિયામક કચેરી");
  // More info recipient
  const [infoRecipient, setInfoRecipient] = useState("આચાર્યશ્રી (School Principal)");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Currently selected grievance
  const selectedGrievance = useMemo(() => {
    return (
      grievances.find((g) => g.id === selectedId) ||
      grievances[0] ||
      INITIAL_GRIEVANCES[0]
    );
  }, [grievances, selectedId]);

  // Filtered grievances
  const filteredGrievances = useMemo(() => {
    return grievances.filter((item) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesQuery =
          item.id.toLowerCase().includes(q) ||
          item.studentName.toLowerCase().includes(q) ||
          item.ctsId.toLowerCase().includes(q) ||
          item.schoolName.toLowerCase().includes(q) ||
          item.subjectEn.toLowerCase().includes(q) ||
          item.subjectGu.toLowerCase().includes(q);
        if (!matchesQuery) return false;
      }
      // Type
      if (typeFilter !== "all" && item.type !== typeFilter) {
        return false;
      }
      // Taluka
      if (talukaFilter !== "all" && item.taluka !== talukaFilter) {
        return false;
      }
      // Priority
      if (priorityFilter !== "all" && item.priority !== priorityFilter) {
        return false;
      }
      // Status
      if (statusFilter !== "all" && item.status !== statusFilter) {
        return false;
      }
      return true;
    });
  }, [grievances, searchQuery, typeFilter, talukaFilter, priorityFilter, statusFilter]);

  // Actions
  const handleResolveGrievance = () => {
    if (!selectedGrievance) return;
    setGrievances((prev) =>
      prev.map((g) => {
        if (g.id === selectedGrievance.id) {
          const newEvent: TimelineEvent = {
            id: `t-${Date.now()}`,
            date: "આજે (Today)",
            time: "હમણાં જ",
            title: "નિકાલ પૂર્ણ (Resolved by DEO)",
            description: actionNotes
              ? `સત્તાવાર નોંધ: ${actionNotes}`
              : "DEO દ્વારા સત્તાવાર જવાબ જારી કરાયો અને ફરિયાદનો નિકાલ માન્ય રખાયો.",
            badgeColor: "bg-primary",
          };
          return {
            ...g,
            status: "resolved",
            slaRemainingGu: "નિકાલ પૂર્ણ (Resolved)",
            slaRemainingEn: "Resolved successfully",
            slaProgressPercent: 100,
            timeline: [newEvent, ...g.timeline],
          };
        }
        return g;
      })
    );
    setActiveModal("none");
    setActionNotes("");
    showToast(`ફરિયાદ ${selectedGrievance.id} નો સફળતાપૂર્વક નિકાલ કરવામાં આવ્યો!`);
  };

  const handleEscalateToState = () => {
    if (!selectedGrievance) return;
    setGrievances((prev) =>
      prev.map((g) => {
        if (g.id === selectedGrievance.id) {
          const newEvent: TimelineEvent = {
            id: `t-${Date.now()}`,
            date: "આજે (Today)",
            time: "હમણાં જ",
            title: "રાજ્ય સ્તરે એસ્કેલેટ",
            description: `DEO કક્ષાએથી ${escalateDepartment} ને કેસ તાકીદ માટે મોકલવામાં આવ્યો.`,
            badgeColor: "bg-error",
          };
          return {
            ...g,
            status: "escalated",
            priority: "critical",
            timeline: [newEvent, ...g.timeline],
          };
        }
        return g;
      })
    );
    setActiveModal("none");
    showToast(`ફરિયાદ ${selectedGrievance.id} રાજ્ય કક્ષાએ એસ્કેલેટ કરાઈ.`);
  };

  const handleReassignOfficer = () => {
    if (!selectedGrievance) return;
    setGrievances((prev) =>
      prev.map((g) => {
        if (g.id === selectedGrievance.id) {
          const newEvent: TimelineEvent = {
            id: `t-${Date.now()}`,
            date: "આજે (Today)",
            time: "હમણાં જ",
            title: "અધિકારી પુનઃ ફાળવણી",
            description: `કેસ શ્રી ${newOfficer} ને સોંપવામાં આવ્યો.`,
            badgeColor: "bg-secondary",
          };
          return {
            ...g,
            assignedOfficer: newOfficer,
            timeline: [newEvent, ...g.timeline],
          };
        }
        return g;
      })
    );
    setActiveModal("none");
    showToast(`નોડલ અધિકારી બદલીને ${newOfficer} કરવામાં આવ્યા.`);
  };

  const handleRequestMoreInfo = () => {
    if (!selectedGrievance) return;
    setGrievances((prev) =>
      prev.map((g) => {
        if (g.id === selectedGrievance.id) {
          const newEvent: TimelineEvent = {
            id: `t-${Date.now()}`,
            date: "આજે (Today)",
            time: "હમણાં જ",
            title: "વિગતો મંગાવાઈ (More Info Requested)",
            description: `${infoRecipient} ને ૪૮ કલાકમાં ખુલાસો આપવા નોટિસ જારી કરી.`,
            badgeColor: "bg-outline",
          };
          return {
            ...g,
            timeline: [newEvent, ...g.timeline],
          };
        }
        return g;
      })
    );
    setActiveModal("none");
    showToast(`${infoRecipient} ને ખુલાસો આપવા નોટિસ મોકલી.`);
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setTypeFilter("all");
    setTalukaFilter("all");
    setPriorityFilter("all");
    setStatusFilter("all");
  };

  // Helper for status chip mapping
  const renderStatusChip = (status: GrievanceStatus) => {
    switch (status) {
      case "resolved":
        return <StatusChip status="approved" label={<T gu="નિકાલ પૂર્ણ" en="Resolved" hi="हल किया गया" />} />;
      case "inprogress":
        return <StatusChip status="inprogress" label={<T gu="પ્રક્રિયા હેઠળ" en="In Progress" hi="प्रक्रियाधीन" />} />;
      case "new":
        return <StatusChip status="pending" label={<T gu="નવી ફરિયાદ" en="New" hi="नई शिकायत" />} />;
      case "escalated":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-error-container text-on-error-container border border-error/40">
            <Icon name="crisis_alert" size={13} className="text-error" />
            <T gu="રાજ્ય સ્તરે એસ્કેલેટ" en="Escalated" hi="अग्रेषित" />
          </span>
        );
    }
  };

  return (
    <OfficerShell role="deo">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-on-surface text-surface px-4 py-3 rounded-xl shadow-level-3 flex items-center gap-3 animate-fade-in border border-outline-variant">
          <Icon name="check_circle" size={20} className="text-emerald-400" />
          <span className="font-label-md text-sm">{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="text-surface/70 hover:text-surface ml-2"
          >
            <Icon name="close" size={16} />
          </button>
        </div>
      )}

      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 py-5 space-y-6">
        {/* Breadcrumb & Top Bar Section */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 text-on-surface-variant font-label-md text-label-md">
            <Link
              href="/deo"
              className="flex items-center gap-1.5 hover:text-primary transition-colors cursor-pointer"
            >
              <Icon name="account_balance" size={16} />
              <span>
                <T gu="જિલ્લા કચેરી" en="District HQ" hi="जिला कार्यालय" />
              </span>
            </Link>
            <Icon name="chevron_right" size={14} className="text-outline" />
            <span className="text-primary font-bold flex items-center gap-1">
              <Icon name="support_agent" size={16} />
              <span>
                <T
                  gu="ફરિયાદ નિવારણ અને પ્રતિક્રિયા મોનિટર"
                  en="Grievance Redressal System"
                  hi="शिकायत निवारण प्रणाली"
                />
              </span>
            </span>
          </div>

          {/* Title Header Card */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-surface-container-lowest p-5 rounded-xl border border-outline-variant shadow-level-1">
            <div className="space-y-1">
              <div className="flex items-center gap-2.5">
                <div className="w-2.5 h-6 bg-primary rounded-full"></div>
                <h1 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                  <T
                    gu="જિલ્લા કક્ષાનું ફરિયાદ નિવારણ ડેસ્ક"
                    en="District Grievance Management Desk"
                    hi="जिला स्तरीय शिकायत निवारण डेस्क"
                  />
                  <span className="font-title-lg text-title-lg text-primary font-semibold ml-2">
                    (DEO Anand Desk)
                  </span>
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-md text-label-md font-bold">
                  AY 2025-26
                </span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant pl-5">
                <T
                  gu="શિષ્યવૃત્તિ, સાયકલ વિતરણ, દસ્તાવેજ અને બેંક DBT સંબંધિત ફરિયાદોનું કેન્દ્રીય સંચાલન • આણંદ જિલ્લો (DEO-GJ-AND-04)"
                  en="Central grievance management for scholarships, bicycle distribution, certificates, and bank DBT • Anand District (DEO-GJ-AND-04)"
                  hi="छात्रवृत्ति, साइकिल वितरण, दस्तावेज़ और बैंक डीबीटी शिकायतों का केंद्रीय प्रबंधन • आणंद जिला (DEO-GJ-AND-04)"
                />
              </p>
            </div>

            {/* Header Action Buttons */}
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={() => showToast("ફરિયાદ નિવારણ રિપોર્ટ (.xlsx) ડાઉનલોડ શરૂ થયો")}
                className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-lg bg-surface-container-low hover:bg-surface-container-high text-on-surface transition-colors font-label-lg text-label-lg border border-outline-variant shadow-xs"
              >
                <Icon name="file_download" size={18} className="text-tertiary" />
                <span>
                  <T gu="નિકાસ રિપોર્ટ (.xlsx)" en="Export Report (.xlsx)" hi="निर्यात रिपोर्ट (.xlsx)" />
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setPriorityFilter("critical");
                  showToast("SLA ઉલ્લંઘન અને તાકીદના કેસ ફિલ્ટર કરાયા");
                }}
                className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-lg bg-error-container text-on-error-container hover:bg-error-container/80 transition-colors font-label-lg text-label-lg font-semibold"
              >
                <Icon name="crisis_alert" size={18} className="text-error" />
                <span>
                  <T
                    gu="SLA ઉલ્લંઘન તાકીદ સૂચના"
                    en="SLA Breach Alert (>7d)"
                    hi="SLA उल्लंघन चेतावनी (>7d)"
                  />
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveModal("new_grievance")}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-secondary text-on-secondary hover:opacity-90 transition-all font-label-lg text-label-lg font-bold shadow-md hover:shadow-lg"
              >
                <Icon name="add_circle" size={20} className="text-white" />
                <span>
                  <T gu="+ નવી ફરિયાદ નોંધણી" en="+ New Grievance" hi="+ नई शिकायत दर्ज करें" />
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Top KPI Metric Row (4 Cards as required: Total Open 23, Resolved Today 5, Avg Resolution Days 3.2, SLA Breached Critical) */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {/* KPI 1: Total Open (23) */}
          <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant shadow-level-1 hover:shadow-level-2 transition-shadow relative overflow-hidden flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="font-label-md text-label-md text-on-surface-variant font-semibold uppercase tracking-wider">
                  <T gu="કુલ સક્રિય ફરિયાદો" en="Active Grievances Open" hi="कुल सक्रिय शिकायतें" />
                </p>
                <p className="font-caption text-caption text-outline">
                  <T gu="ઓપન કેસ લિસ્ટ" en="Total Open Cases" hi="ओपन केस लिस्ट" />
                </p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-primary-fixed flex items-center justify-center text-primary">
                <Icon name="inbox" size={22} className="text-primary" />
              </div>
            </div>
            <div className="mt-3">
              <div className="flex items-baseline gap-2">
                <span className="font-headline-lg text-headline-lg text-on-surface font-extrabold tracking-tight">
                  23
                </span>
                <span className="font-label-md text-label-md text-primary font-bold">
                  <T gu="પેન્ડિંગ કેસ" en="Pending Cases" hi="लंबित मामले" />
                </span>
              </div>
              <div className="mt-2.5 pt-2 bg-surface-container-low px-2.5 py-1.5 rounded-lg flex items-center justify-between text-on-surface-variant font-caption text-caption">
                <span>14 DBT</span>
                <span className="text-outline">•</span>
                <span>6 સાયકલ</span>
                <span className="text-outline">•</span>
                <span>3 દસ્તાવેજ</span>
              </div>
            </div>
          </div>

          {/* KPI 2: Avg Resolution Turnaround (3.2 days) */}
          <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant shadow-level-1 hover:shadow-level-2 transition-shadow relative overflow-hidden flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="font-label-md text-label-md text-on-surface-variant font-semibold uppercase tracking-wider">
                  <T gu="સરેરાશ નિવારણ સમય" en="Avg Resolution Turnaround" hi="औसत समाधान समय" />
                </p>
                <p className="font-caption text-caption text-outline">
                  <T gu="નિવારણ ઝડપ દિવસોમાં" en="Avg Resolution Days" hi="समाधान दिन" />
                </p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-primary">
                <Icon name="schedule" size={22} className="text-primary" />
              </div>
            </div>
            <div className="mt-3">
              <div className="flex items-baseline gap-2">
                <span className="font-headline-lg text-headline-lg text-on-surface font-extrabold tracking-tight">
                  3.2
                </span>
                <span className="font-label-lg text-label-lg text-on-surface-variant font-semibold">
                  <T gu="દિવસ" en="Days" hi="दिन" />
                </span>
                <span className="ml-auto inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-label-md text-label-md font-bold border border-emerald-200">
                  <Icon name="trending_down" size={14} /> -0.8d
                </span>
              </div>
              <p className="mt-2 text-on-surface-variant font-caption text-caption">
                <T
                  gu="રાજ્ય લક્ષ્યાંક: ૩.૦ દિવસ • ૯૨% સમયસર નિકાલ"
                  en="State Target: 3.0 days • 92% SLA compliant"
                  hi="राज्य लक्ष्य: 3.0 दिन • 92% समय पर समाधान"
                />
              </p>
            </div>
          </div>

          {/* KPI 3: SLA Breached Critical (>7 days) */}
          <div className="bg-surface-container-lowest p-4 rounded-xl border border-error/30 shadow-level-1 hover:shadow-level-2 transition-shadow relative overflow-hidden flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="font-label-md text-label-md text-error font-bold uppercase tracking-wider">
                  <T gu="SLA ઉલ્લંઘન / તાકીદના કેસ" en="SLA Breached (>7 Days)" hi="SLA उल्लंघन (>7 दिन)" />
                </p>
                <p className="font-caption text-caption text-outline">
                  <T gu="રાજ્ય એસ્કેલેશન ભય" en="Critical / Escalation Risk" hi="गंभीर मामले" />
                </p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-error-container flex items-center justify-center text-error animate-pulse">
                <Icon name="crisis_alert" size={22} className="text-error" />
              </div>
            </div>
            <div className="mt-3">
              <div className="flex items-baseline gap-2">
                <span className="font-headline-lg text-headline-lg text-error font-extrabold tracking-tight">
                  06
                </span>
                <span className="font-label-md text-label-md text-error font-semibold">
                  <T gu="ગંભીર કેસ" en="Critical" hi="गंभीर" />
                </span>
                <span className="ml-auto px-2 py-0.5 rounded-full bg-error-container text-on-error-container font-label-md text-label-md font-bold border border-error/30">
                  <T gu="રાજ્ય એલર્ટ" en="State Alert" hi="राज्य अलर्ट" />
                </span>
              </div>
              <p className="mt-2 text-on-surface-variant font-caption text-caption">
                <T
                  gu="૨ કેસ >૭ દિવસથી ખુલ્લા • આપોઆપ ગાંધીનગર ફાળવણી"
                  en="2 cases open >7 days • Auto-escalating to State"
                  hi="2 मामले >7 दिनों से खुले हैं"
                />
              </p>
            </div>
          </div>

          {/* KPI 4: Resolved Today (5) */}
          <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant shadow-level-1 hover:shadow-level-2 transition-shadow relative overflow-hidden flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="font-label-md text-label-md text-on-surface-variant font-semibold uppercase tracking-wider">
                  <T gu="આજે નિકાલ થયેલ" en="Resolved Today" hi="आज हल किए गए" />
                </p>
                <p className="font-caption text-caption text-outline">
                  <T gu="મહિનામાં કુલ: ૨૧૪" en="Total This Month: 214" hi="इस महीने कुल: 214" />
                </p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200">
                <Icon name="task_alt" size={22} className="text-emerald-700" />
              </div>
            </div>
            <div className="mt-3">
              <div className="flex items-baseline gap-2">
                <span className="font-headline-lg text-headline-lg text-on-surface font-extrabold tracking-tight">
                  5
                </span>
                <span className="font-label-md text-label-md text-emerald-700 font-bold">
                  <T gu="આજના ઉકેલ" en="Today" hi="आज" />
                </span>
                <span className="ml-auto inline-flex items-center gap-1 text-primary font-label-md text-label-md font-bold">
                  <Icon name="star" size={14} className="text-amber-500" /> 96.4%
                </span>
              </div>
              <div className="w-full bg-surface-container-high h-1.5 rounded-full mt-2.5 overflow-hidden">
                <div className="bg-emerald-600 h-full rounded-full w-[96%]"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Filter & View Controls */}
        <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant shadow-level-1 flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-4">
          {/* Left: View Toggle & Search */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1 max-w-2xl">
            {/* View Switcher */}
            <div className="inline-flex p-1 bg-surface-container-low rounded-lg shrink-0 border border-outline-variant">
              <button
                type="button"
                onClick={() => setViewMode("kanban")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-label-md text-label-md transition-all ${
                  viewMode === "kanban"
                    ? "bg-surface-container-lowest text-primary font-bold shadow-xs"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                <Icon name="view_kanban" size={18} />
                <span>
                  <T gu="કાનબાન બોર્ડ (Kanban)" en="Kanban Board" hi="कानबन बोर्ड" />
                </span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("table")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-label-md text-label-md transition-all ${
                  viewMode === "table"
                    ? "bg-surface-container-lowest text-primary font-bold shadow-xs"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                <Icon name="table_rows" size={18} />
                <span>
                  <T gu="કોષ્ટક વ્યૂ (Table)" en="Table View" hi="टेबल व्यू" />
                </span>
              </button>
            </div>

            {/* Search Bar */}
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-outline">
                <Icon name="search" size={18} />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="GRV ID, વિદ્યાર્થી નામ, CTS ID અથવા શાળા શોધો..."
                className="w-full h-10 pl-9 pr-8 rounded-lg bg-surface-container-low text-on-surface placeholder:text-outline font-body-sm text-body-sm focus:outline-none focus:ring-2 focus:ring-primary border border-outline-variant"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface"
                >
                  <Icon name="cancel" size={16} />
                </button>
              )}
            </div>
          </div>

          {/* Right: Dropdown Filters */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Type Filter */}
            <div className="relative">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="h-10 pl-3 pr-8 rounded-lg bg-surface-container-low text-on-surface font-body-sm text-body-sm focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer appearance-none border border-outline-variant"
              >
                <option value="all">પ્રકાર: તમામ (All Types)</option>
                <option value="Payment">Payment (DBT / બેંક / PFMS)</option>
                <option value="Process">Process (સાયકલ / OTP)</option>
                <option value="Document">Document (દાખલા / KYC)</option>
              </select>
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-outline pointer-events-none">
                <Icon name="arrow_drop_down" size={18} />
              </span>
            </div>

            {/* Taluka Filter */}
            <div className="relative">
              <select
                value={talukaFilter}
                onChange={(e) => setTalukaFilter(e.target.value)}
                className="h-10 pl-3 pr-8 rounded-lg bg-surface-container-low text-on-surface font-body-sm text-body-sm focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer appearance-none border border-outline-variant"
              >
                <option value="all">તાલુકો: તમામ (All Talukas)</option>
                <option value="Anand">આણંદ (Anand)</option>
                <option value="Tarapur">તારાપુર (Tarapur)</option>
                <option value="Umreth">ઉમરેઠ (Umreth)</option>
                <option value="Anklav">આંકલાવ (Anklav)</option>
                <option value="Khambhat">ખંભાત (Khambhat)</option>
                <option value="Petlad">પેટલાદ (Petlad)</option>
              </select>
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-outline pointer-events-none">
                <Icon name="arrow_drop_down" size={18} />
              </span>
            </div>

            {/* Priority Filter */}
            <div className="relative">
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="h-10 pl-3 pr-8 rounded-lg bg-surface-container-low text-on-surface font-body-sm text-body-sm focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer appearance-none border border-outline-variant"
              >
                <option value="all">પ્રાથમિકતા: તમામ (All Priority)</option>
                <option value="critical">ગંભીર (Critical / SLA Risk)</option>
                <option value="medium">મધ્યમ (Medium)</option>
                <option value="normal">સામાન્ય (Normal)</option>
              </select>
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-outline pointer-events-none">
                <Icon name="arrow_drop_down" size={18} />
              </span>
            </div>

            {/* Status Filter */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-10 pl-3 pr-8 rounded-lg bg-surface-container-low text-on-surface font-body-sm text-body-sm focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer appearance-none border border-outline-variant"
              >
                <option value="all">સ્થિતિ: તમામ (All Status)</option>
                <option value="new">નવી (New)</option>
                <option value="inprogress">પ્રક્રિયા હેઠળ (In Progress)</option>
                <option value="escalated">રાજ્ય સ્તરે (Escalated)</option>
                <option value="resolved">ઉકેલાયેલ (Resolved)</option>
              </select>
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-outline pointer-events-none">
                <Icon name="arrow_drop_down" size={18} />
              </span>
            </div>

            {/* Reset Filter Button */}
            <button
              type="button"
              onClick={handleResetFilters}
              title="ફિલ્ટર રીસેટ કરો"
              className="h-10 w-10 flex items-center justify-center rounded-lg bg-surface-container-low hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface transition-colors border border-outline-variant"
            >
              <Icon name="restart_alt" size={18} />
            </button>
          </div>
        </div>

        {/* Main Content Split View (8 Cols Kanban/Table, 4 Cols Inspection Detail Drawer) */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
          {/* LEFT 65% / 8 Cols */}
          <div className="xl:col-span-8 space-y-4">
            {viewMode === "kanban" ? (
              /* KANBAN BOARD VIEW */
              <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 gap-3.5">
                {/* Column 1: New */}
                <div className="flex flex-col rounded-xl bg-surface-container-low p-3 min-h-[640px] border border-outline-variant shadow-xs">
                  <div className="flex items-center justify-between pb-3 px-1 border-b border-outline-variant/60">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-primary"></span>
                      <span className="font-title-md text-title-md text-on-surface font-bold">
                        <T gu="નવી ફરિયાદો" en="New Grievances" hi="नई शिकायतें" />
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-primary-fixed text-primary font-label-md text-xs font-bold">
                      {filteredGrievances.filter((g) => g.status === "new").length}
                    </span>
                  </div>

                  <div className="space-y-3 flex-1 overflow-y-auto pt-3">
                    {filteredGrievances
                      .filter((g) => g.status === "new")
                      .map((item) => (
                        <div
                          key={item.id}
                          onClick={() => setSelectedId(item.id)}
                          className={`p-3.5 rounded-xl border cursor-pointer transition-all relative overflow-hidden ${
                            selectedId === item.id
                              ? "bg-surface-container-lowest border-primary shadow-level-2 ring-2 ring-primary/20"
                              : "bg-surface-container-lowest border-outline-variant hover:border-primary/40 shadow-xs"
                          }`}
                        >
                          {selectedId === item.id && (
                            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary" />
                          )}
                          <div className="flex items-start justify-between gap-2">
                            <span className="font-label-md text-xs font-bold text-primary font-mono">
                              {item.id}
                            </span>
                            <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant font-label-md text-[10px] font-semibold">
                              {item.type}
                            </span>
                          </div>
                          <div className="mt-2 space-y-1">
                            <p className="font-label-lg text-sm text-on-surface font-bold">
                              {item.studentName}
                            </p>
                            <p className="font-caption text-caption text-on-surface-variant flex items-center gap-1">
                              <Icon name="badge" size={13} className="text-outline" />
                              <span className="font-mono text-xs">{item.ctsId}</span>
                            </p>
                            <p className="font-caption text-caption text-on-surface-variant line-clamp-1">
                              {item.schoolName}
                            </p>
                          </div>

                          {/* Days open & SLA tag */}
                          <div className="mt-3 pt-2.5 border-t border-surface-container-low flex items-center justify-between text-xs">
                            <div className="flex items-center gap-1">
                              {item.daysOpen > 7 ? (
                                <span className="text-error font-bold flex items-center gap-1 text-[11px]">
                                  <Icon name="crisis_alert" size={13} className="text-error" />
                                  {item.daysOpen}d (SLA Breached)
                                </span>
                              ) : (
                                <span className="text-on-surface-variant text-[11px] flex items-center gap-1">
                                  <Icon name="schedule" size={13} className="text-outline" />
                                  {item.daysOpen}d open
                                </span>
                              )}
                            </div>
                            <span className="text-primary font-medium text-[11px] truncate max-w-[90px]">
                              {item.assignedOfficer}
                            </span>
                          </div>
                        </div>
                      ))}
                    {filteredGrievances.filter((g) => g.status === "new").length === 0 && (
                      <p className="text-center text-xs text-on-surface-variant py-8 italic">
                        <T gu="આ કેટેગરીમાં કોઈ નવી ફરિયાદ નથી" en="No new grievances" hi="कोई नई शिकायत नहीं" />
                      </p>
                    )}
                  </div>
                </div>

                {/* Column 2: In Progress */}
                <div className="flex flex-col rounded-xl bg-surface-container-low p-3 min-h-[640px] border border-outline-variant shadow-xs">
                  <div className="flex items-center justify-between pb-3 px-1 border-b border-outline-variant/60">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-secondary"></span>
                      <span className="font-title-md text-title-md text-on-surface font-bold">
                        <T gu="પ્રક્રિયા હેઠળ" en="In Progress" hi="प्रक्रियाधीन" />
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-md text-xs font-bold">
                      {filteredGrievances.filter((g) => g.status === "inprogress").length}
                    </span>
                  </div>

                  <div className="space-y-3 flex-1 overflow-y-auto pt-3">
                    {filteredGrievances
                      .filter((g) => g.status === "inprogress")
                      .map((item) => (
                        <div
                          key={item.id}
                          onClick={() => setSelectedId(item.id)}
                          className={`p-3.5 rounded-xl border cursor-pointer transition-all relative overflow-hidden ${
                            selectedId === item.id
                              ? "bg-surface-container-lowest border-primary shadow-level-2 ring-2 ring-primary/20"
                              : "bg-surface-container-lowest border-outline-variant hover:border-primary/40 shadow-xs"
                          }`}
                        >
                          {selectedId === item.id && (
                            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary" />
                          )}
                          <div className="flex items-start justify-between gap-2">
                            <span className="font-label-md text-xs font-bold text-primary font-mono">
                              {item.id}
                            </span>
                            <span className="px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-md text-[10px] font-bold">
                              {item.typeLabelGu}
                            </span>
                          </div>
                          <div className="mt-2 space-y-1">
                            <p className="font-label-lg text-sm text-on-surface font-bold">
                              {item.studentName}
                            </p>
                            <p className="font-caption text-caption text-on-surface-variant flex items-center gap-1">
                              <Icon name="badge" size={13} className="text-outline" />
                              <span className="font-mono text-xs">{item.ctsId}</span>
                            </p>
                            <p className="font-caption text-caption text-on-surface-variant line-clamp-1">
                              {item.schoolName}
                            </p>
                          </div>

                          {/* SLA Alert banner */}
                          <div className="mt-3 pt-2.5 border-t border-surface-container-low flex items-center justify-between text-xs">
                            <div className="flex items-center gap-1">
                              {item.daysOpen > 7 ? (
                                <span className="text-error font-bold flex items-center gap-1 text-[11px]">
                                  <Icon name="crisis_alert" size={13} className="text-error" />
                                  {item.daysOpen}d (SLA Breached)
                                </span>
                              ) : (
                                <span className="text-secondary font-semibold text-[11px] flex items-center gap-1">
                                  <Icon name="hourglass_top" size={13} />
                                  {item.slaRemainingGu}
                                </span>
                              )}
                            </div>
                            <span className="text-on-surface-variant text-[11px] truncate max-w-[80px]">
                              {item.assignedOfficer}
                            </span>
                          </div>
                        </div>
                      ))}
                    {filteredGrievances.filter((g) => g.status === "inprogress").length === 0 && (
                      <p className="text-center text-xs text-on-surface-variant py-8 italic">
                        <T gu="કોઈ કેસ પ્રક્રિયા હેઠળ નથી" en="No cases in progress" hi="कोई मामला प्रक्रियाधीन नहीं" />
                      </p>
                    )}
                  </div>
                </div>

                {/* Column 3: Escalated to State */}
                <div className="flex flex-col rounded-xl bg-surface-container-low p-3 min-h-[640px] border border-outline-variant shadow-xs">
                  <div className="flex items-center justify-between pb-3 px-1 border-b border-outline-variant/60">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-error"></span>
                      <span className="font-title-md text-title-md text-error font-bold">
                        <T gu="રાજ્ય સ્તરે એસ્કેલેટ" en="Escalated to State" hi="राज्य स्तर पर अग्रेषित" />
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-error-container text-on-error-container font-label-md text-xs font-bold border border-error/20">
                      {filteredGrievances.filter((g) => g.status === "escalated").length}
                    </span>
                  </div>

                  <div className="space-y-3 flex-1 overflow-y-auto pt-3">
                    {filteredGrievances
                      .filter((g) => g.status === "escalated")
                      .map((item) => (
                        <div
                          key={item.id}
                          onClick={() => setSelectedId(item.id)}
                          className={`p-3.5 rounded-xl border cursor-pointer transition-all relative overflow-hidden ${
                            selectedId === item.id
                              ? "bg-surface-container-lowest border-error shadow-level-2 ring-2 ring-error/20"
                              : "bg-surface-container-lowest border-error/30 hover:border-error shadow-xs"
                          }`}
                        >
                          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-error" />
                          <div className="flex items-start justify-between gap-2">
                            <span className="font-label-md text-xs font-bold text-error font-mono">
                              {item.id}
                            </span>
                            <span className="px-2 py-0.5 rounded-full bg-error-container text-on-error-container font-label-md text-[10px] font-bold animate-pulse">
                              SLA Breached ({item.daysOpen}d)
                            </span>
                          </div>
                          <div className="mt-2 space-y-1">
                            <p className="font-label-lg text-sm text-on-surface font-bold">
                              {item.studentName}
                            </p>
                            <p className="font-caption text-caption text-on-surface-variant line-clamp-1">
                              {item.subjectGu}
                            </p>
                            <p className="font-caption text-caption text-error font-semibold line-clamp-1">
                              {item.schoolName}
                            </p>
                          </div>

                          <div className="mt-2.5 p-1.5 bg-error-container/30 rounded text-error font-caption text-[11px] flex items-center gap-1">
                            <Icon name="flag" size={13} />
                            <span className="truncate">ગાંધીનગર સ્તરે પેન્ડિંગ</span>
                          </div>

                          <div className="mt-2.5 pt-2 border-t border-surface-container-low flex items-center justify-between text-xs">
                            <span className="text-error font-bold text-[11px]">
                              {item.daysOpen} દિવસથી બાકી
                            </span>
                            <span className="text-on-surface-variant text-[11px] truncate max-w-[90px]">
                              {item.assignedOfficer}
                            </span>
                          </div>
                        </div>
                      ))}
                    {filteredGrievances.filter((g) => g.status === "escalated").length === 0 && (
                      <p className="text-center text-xs text-on-surface-variant py-8 italic">
                        <T gu="રાજ્ય સ્તરે કોઈ કેસ નથી" en="No escalated cases" hi="कोई अग्रेषित मामला नहीं" />
                      </p>
                    )}
                  </div>
                </div>

                {/* Column 4: Resolved */}
                <div className="flex flex-col rounded-xl bg-surface-container-low p-3 min-h-[640px] border border-outline-variant shadow-xs">
                  <div className="flex items-center justify-between pb-3 px-1 border-b border-outline-variant/60">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
                      <span className="font-title-md text-title-md text-on-surface font-bold">
                        <T gu="નિકાલ થયેલ" en="Resolved" hi="समाधानित" />
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-label-md text-xs font-bold border border-emerald-300">
                      {filteredGrievances.filter((g) => g.status === "resolved").length}
                    </span>
                  </div>

                  <div className="space-y-3 flex-1 overflow-y-auto pt-3">
                    {filteredGrievances
                      .filter((g) => g.status === "resolved")
                      .map((item) => (
                        <div
                          key={item.id}
                          onClick={() => setSelectedId(item.id)}
                          className={`p-3.5 rounded-xl border cursor-pointer transition-all relative overflow-hidden ${
                            selectedId === item.id
                              ? "bg-surface-container-lowest border-emerald-600 shadow-level-2 ring-2 ring-emerald-600/20"
                              : "bg-surface-container-lowest border-outline-variant hover:border-emerald-600/40 shadow-xs"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="font-label-md text-xs font-bold text-outline font-mono">
                              {item.id}
                            </span>
                            <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-label-md text-[10px] font-bold flex items-center gap-1 border border-emerald-200">
                              <Icon name="check_circle" size={11} fill /> ઉકેલાયેલ
                            </span>
                          </div>
                          <div className="mt-2 space-y-1">
                            <p className="font-label-lg text-sm text-on-surface font-bold">
                              {item.studentName}
                            </p>
                            <p className="font-caption text-caption text-on-surface-variant line-clamp-1">
                              {item.subjectGu}
                            </p>
                            <p className="font-caption text-caption text-outline line-clamp-1">
                              {item.schoolName}
                            </p>
                          </div>

                          <div className="mt-3 pt-2.5 border-t border-surface-container-low flex items-center justify-between text-xs">
                            <div className="flex items-center gap-1 text-emerald-700 font-semibold text-[11px]">
                              <Icon name="star" size={13} className="text-amber-500" />
                              5-Star સંતોષ
                            </div>
                            <span className="text-on-surface-variant text-[11px]">
                              {item.daysOpen} દિવસમાં નિકાલ
                            </span>
                          </div>
                        </div>
                      ))}
                    {filteredGrievances.filter((g) => g.status === "resolved").length === 0 && (
                      <p className="text-center text-xs text-on-surface-variant py-8 italic">
                        <T gu="હજુ કોઈ નિકાલ કેસ નથી" en="No resolved cases" hi="कोई हल किया गया मामला नहीं" />
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              /* TABLE VIEW */
              <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-level-1 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-surface-container-low border-b border-outline-variant font-label-md text-xs text-on-surface-variant uppercase tracking-wider">
                      <tr>
                        <th className="py-3 px-4">GRV ID</th>
                        <th className="py-3 px-4">
                          <T gu="વિદ્યાર્થી અને શાળા" en="Student & School" hi="छात्र और स्कूल" />
                        </th>
                        <th className="py-3 px-4">
                          <T gu="પ્રકાર (Type)" en="Type" hi="प्रकार" />
                        </th>
                        <th className="py-3 px-4">
                          <T gu="સ્થિતિ (Status)" en="Status" hi="स्थिति" />
                        </th>
                        <th className="py-3 px-4">
                          <T gu="ખુલ્લા દિવસો (Days Open / SLA)" en="Days Open / SLA" hi="दिन खुले / SLA" />
                        </th>
                        <th className="py-3 px-4">
                          <T gu="પ્રાથમિકતા" en="Priority" hi="प्राथमिकता" />
                        </th>
                        <th className="py-3 px-4 text-right">
                          <T gu="કાર્યવાહી" en="Action" hi="कार्रवाई" />
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant">
                      {filteredGrievances.map((item) => (
                        <tr
                          key={item.id}
                          onClick={() => setSelectedId(item.id)}
                          className={`hover:bg-surface-container-low/70 transition-colors cursor-pointer ${
                            selectedId === item.id ? "bg-primary/5 font-medium" : ""
                          }`}
                        >
                          <td className="py-3 px-4 font-mono font-bold text-primary text-xs">
                            {item.id}
                          </td>
                          <td className="py-3 px-4">
                            <p className="font-semibold text-on-surface text-sm">
                              {item.studentName}
                            </p>
                            <p className="text-xs text-on-surface-variant truncate max-w-xs">
                              {item.schoolName}
                            </p>
                            <span className="font-mono text-[11px] text-outline">
                              CTS: {item.ctsId}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-surface-container-high text-on-surface">
                              {item.type}
                            </span>
                          </td>
                          <td className="py-3 px-4">{renderStatusChip(item.status)}</td>
                          <td className="py-3 px-4">
                            {item.daysOpen > 7 ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-error-container text-on-error-container font-bold text-xs border border-error animate-pulse">
                                <Icon name="crisis_alert" size={13} className="text-error" />
                                {item.daysOpen}d (SLA Breached &gt;7d)
                              </span>
                            ) : item.daysOpen > 3 ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 font-medium text-xs border border-amber-200">
                                <Icon name="hourglass_bottom" size={13} />
                                {item.daysOpen}d ({item.slaRemainingGu})
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-container-low text-on-surface-variant text-xs">
                                <Icon name="check" size={13} className="text-emerald-600" />
                                {item.daysOpen}d (Normal)
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                                item.priority === "critical"
                                  ? "bg-error-container text-on-error-container"
                                  : item.priority === "medium"
                                  ? "bg-secondary-fixed text-on-secondary-fixed"
                                  : "bg-surface-container text-on-surface-variant"
                              }`}
                            >
                              {item.priority.toUpperCase()}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedId(item.id);
                              }}
                              className="px-2.5 py-1 rounded bg-surface-container-low hover:bg-primary hover:text-white transition-colors text-xs font-semibold text-primary"
                            >
                              <T gu="તપાસો" en="Inspect" hi="जांचें" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT 35% / 4 Cols: Inspection & Grievance Detail Drawer */}
          <div className="xl:col-span-4 bg-surface-container-lowest rounded-xl border border-outline-variant shadow-level-2 p-5 space-y-5 sticky top-20">
            {/* Drawer Top Header */}
            <div className="space-y-2 pb-4 bg-surface-container-low p-4 rounded-xl border border-outline-variant/60">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-md bg-primary text-on-primary font-mono text-xs font-bold tracking-wide">
                  {selectedGrievance.id}
                </span>
                <div className="flex items-center gap-1.5">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      selectedGrievance.priority === "critical"
                        ? "bg-error-container text-on-error-container"
                        : selectedGrievance.priority === "medium"
                        ? "bg-secondary-fixed text-on-secondary-fixed"
                        : "bg-surface-container-high text-on-surface-variant"
                    }`}
                  >
                    પ્રાથમિકતા: {selectedGrievance.priority.toUpperCase()}
                  </span>
                  <button
                    type="button"
                    onClick={() => showToast(`પ્રિન્ટ કેસ ફાઇલ: ${selectedGrievance.id}`)}
                    title="પ્રિન્ટ ફરિયાદ વિગત"
                    className="p-1 hover:bg-surface-container-highest rounded text-outline hover:text-on-surface transition-colors"
                  >
                    <Icon name="print" size={18} />
                  </button>
                </div>
              </div>

              <h2 className="font-title-lg text-title-lg text-on-surface font-bold leading-snug">
                {selectedGrievance.subjectGu}
              </h2>
              <p className="font-caption text-caption text-on-surface-variant">
                યોજના: {selectedGrievance.schemeCategory}
              </p>
            </div>

            {/* SLA Live Countdown / Indicator */}
            <div
              className={`p-3.5 rounded-xl space-y-2 border ${
                selectedGrievance.daysOpen > 7
                  ? "bg-error-container/40 border-error/50"
                  : "bg-surface-container-low border-outline-variant"
              }`}
            >
              <div className="flex items-center justify-between text-on-surface font-label-md text-xs">
                <span
                  className={`flex items-center gap-1.5 font-bold ${
                    selectedGrievance.daysOpen > 7 ? "text-error" : "text-secondary"
                  }`}
                >
                  <Icon
                    name={selectedGrievance.daysOpen > 7 ? "crisis_alert" : "hourglass_bottom"}
                    size={16}
                  />
                  <span>
                    {selectedGrievance.daysOpen > 7 ? (
                      <T
                        gu={`SLA ઉલ્લંઘન: ${selectedGrievance.daysOpen} દિવસ (>7 દિવસ લિમિટ)`}
                        en={`SLA Breached: ${selectedGrievance.daysOpen}d Open (>7d Threshold)`}
                        hi={`SLA उल्लंघन: ${selectedGrievance.daysOpen} दिन`}
                      />
                    ) : (
                      <span>{selectedGrievance.slaRemainingGu}</span>
                    )}
                  </span>
                </span>
                <span className="text-outline font-caption text-caption">નિયમ: ૪૮ કલાક</span>
              </div>
              <div className="w-full bg-surface-container-high h-2.5 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    selectedGrievance.daysOpen > 7 ? "bg-error w-full animate-pulse" : "bg-secondary"
                  }`}
                  style={{
                    width: selectedGrievance.daysOpen > 7 ? "100%" : `${selectedGrievance.slaProgressPercent}%`,
                  }}
                />
              </div>
            </div>

            {/* Student & School Details Card */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-label-md text-xs uppercase tracking-wider text-outline font-bold">
                  <T gu="વિદ્યાર્થી અને શાળા વિગત" en="Student & School Details" hi="छात्र और स्कूल विवरण" />
                </span>
                <span className="font-caption text-caption text-primary font-semibold flex items-center gap-1">
                  <Icon name="verified" size={14} fill className="text-primary" /> આધાર પ્રમાણિત
                </span>
              </div>

              <div className="p-3.5 bg-surface-container-low rounded-xl space-y-2.5 border border-outline-variant">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-title-md text-title-md text-on-surface font-bold">
                      {selectedGrievance.studentName}
                    </p>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      {selectedGrievance.classGrade} (રોલ નં: {selectedGrievance.rollNo}) • ઉંમર:{" "}
                      {selectedGrievance.age} વર્ષ
                    </p>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-surface-container-highest text-primary font-caption font-mono text-xs font-bold">
                    CTS: {selectedGrievance.ctsId}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 bg-surface-container-lowest p-2.5 rounded-lg text-on-surface-variant font-caption text-xs border border-outline-variant/60">
                  <div>
                    <span className="text-outline block">વાલીનું નામ:</span>
                    <span className="font-semibold text-on-surface">
                      {selectedGrievance.guardianName}
                    </span>
                  </div>
                  <div>
                    <span className="text-outline block">સંપર્ક નંબર:</span>
                    <span className="font-semibold text-on-surface">
                      {selectedGrievance.contactNumber}
                    </span>
                  </div>
                  <div className="col-span-2 pt-1 border-t border-surface-container-low">
                    <span className="text-outline block">શાળા:</span>
                    <span className="font-semibold text-on-surface">
                      {selectedGrievance.schoolName} ({selectedGrievance.schoolDise})
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Ticket Description & Photo Attachment */}
            <div className="space-y-2.5">
              <span className="font-label-md text-xs uppercase tracking-wider text-outline font-bold">
                <T gu="વાલી દ્વારા દાખલ ફરિયાદ વર્ણન" en="Guardian&apos;s Grievance Description" hi="शिकायत का विवरण" />
              </span>
              <div className="p-3.5 bg-surface-container-low rounded-xl space-y-3 border border-outline-variant">
                <p className="font-body-sm text-sm text-on-surface leading-relaxed italic">
                  &ldquo;{selectedGrievance.descriptionGu}&rdquo;
                </p>

                {/* Attachment Tile with placeholder replacing external CDN */}
                {selectedGrievance.attachments.map((att, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-2.5 bg-surface-container-lowest rounded-lg border border-outline-variant shadow-xs"
                  >
                    <div className="w-12 h-12 rounded-lg bg-surface-container-high overflow-hidden shrink-0 flex items-center justify-center text-primary relative border border-outline-variant">
                      <Icon
                        name={att.type === "image" ? "pedal_bike" : "picture_as_pdf"}
                        size={24}
                        className={att.type === "image" ? "text-primary" : "text-error"}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-label-md text-xs text-on-surface font-semibold truncate">
                        {att.name}
                      </p>
                      <p className="font-caption text-[11px] text-outline">
                        {att.size} • {att.uploadedBy}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => showToast(`દસ્તાવેજ પ્રિવ્યૂ: ${att.name}`)}
                      title="જુઓ (View Attachment)"
                      className="p-1.5 text-primary hover:bg-surface-container-high rounded-lg transition-colors"
                    >
                      <Icon name="visibility" size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Official Redressal Action Controls */}
            <div className="space-y-3 pt-2">
              <span className="font-label-md text-xs uppercase tracking-wider text-outline font-bold">
                <T gu="નિવારણ અને સત્તાવાર કાર્યવાહી" en="Official Action & Redressal" hi="अधिकारिक कार्रवाई" />
              </span>

              {/* Response Template Picker */}
              <div className="space-y-1">
                <label className="font-label-md text-xs text-on-surface font-semibold block">
                  <T gu="સત્તાવાર પ્રત્યુત્તર ટેમ્પલેટ પસંદ કરો:" en="Select Official Response Template:" hi="उत्तर टेम्पलेट चुनें:" />
                </label>
                <div className="relative">
                  <select
                    value={responseTemplate}
                    onChange={(e) => setResponseTemplate(e.target.value)}
                    className="w-full h-10 pl-3 pr-8 rounded-lg bg-surface-container-low text-on-surface font-body-sm text-xs focus:outline-none focus:ring-2 focus:ring-primary appearance-none border border-outline-variant"
                  >
                    <option value="vendor">વેન્ડર રિપ્લેસમેન્ટ નોટિસ (Vendor Replacement 48hr Order)</option>
                    <option value="principal">આચાર્યને તાકીદ સૂચના (Expedite School Principal Notice)</option>
                    <option value="bank">બેંક કેમ્પિંગ વિશેષ સૂચના (Direct Bank Mandate Order)</option>
                    <option value="clarification">દસ્તાવેજ પુનઃ ચકાસણી સુનાવણી (Document Clarification Notice)</option>
                  </select>
                  <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-outline pointer-events-none">
                    <Icon name="expand_more" size={18} />
                  </span>
                </div>
              </div>

              {/* Assigned Officer & Workflow Status */}
              <div className="grid grid-cols-2 gap-2.5">
                <div className="p-2.5 bg-surface-container-low rounded-lg space-y-1 border border-outline-variant">
                  <span className="font-caption text-[11px] text-outline block">સોંપાયેલ નોડલ અધિકારી</span>
                  <div className="flex items-center justify-between">
                    <span className="font-label-md text-xs font-bold text-on-surface truncate">
                      {selectedGrievance.assignedOfficer}
                    </span>
                    <div className="flex items-center gap-1 text-primary">
                      <button
                        type="button"
                        onClick={() => showToast(`કૉલ કરી રહ્યા છીએ: ${selectedGrievance.assignedOfficer}`)}
                        className="hover:bg-surface-container-high p-0.5 rounded"
                        title="કૉલ કરો"
                      >
                        <Icon name="call" size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => showToast(`SMS મોકલાઈ રહ્યો છે: ${selectedGrievance.assignedOfficer}`)}
                        className="hover:bg-surface-container-high p-0.5 rounded"
                        title="SMS મોકલો"
                      >
                        <Icon name="sms" size={16} />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-2.5 bg-surface-container-low rounded-lg space-y-1 border border-outline-variant">
                  <span className="font-caption text-[11px] text-outline block">સ્થિતિ બદલો</span>
                  <div className="relative">
                    <select
                      value={selectedGrievance.status}
                      onChange={(e) => {
                        const newStatus = e.target.value as GrievanceStatus;
                        setGrievances((prev) =>
                          prev.map((g) =>
                            g.id === selectedGrievance.id ? { ...g, status: newStatus } : g
                          )
                        );
                        showToast(`સ્થિતિ બદલાઈ: ${newStatus}`);
                      }}
                      className="w-full text-on-surface bg-transparent font-label-md text-xs font-bold focus:outline-none cursor-pointer appearance-none"
                    >
                      <option value="new">નવી (New)</option>
                      <option value="inprogress">પ્રક્રિયા હેઠળ (In Progress)</option>
                      <option value="escalated">રાજ્ય સ્તરે (Escalated)</option>
                      <option value="resolved">નિકાલ પૂર્ણ (Resolved)</option>
                    </select>
                    <span className="absolute right-0 top-1/2 -translate-y-1/2 text-outline pointer-events-none">
                      <Icon name="arrow_drop_down" size={16} />
                    </span>
                  </div>
                </div>
              </div>

              {/* Officer 4 Action CTA Buttons as required */}
              <div className="space-y-2 pt-1">
                {/* 1. Resolve */}
                <button
                  type="button"
                  onClick={() => setActiveModal("resolve")}
                  className="w-full py-2.5 px-3 rounded-xl bg-secondary text-on-secondary hover:opacity-90 font-label-lg text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <Icon name="task_alt" size={18} className="text-white" />
                  <span>
                    <T
                      gu="સત્તાવાર નિકાલ આદેશ જારી કરો (Resolve)"
                      en="Resolve Grievance & Issue Order"
                      hi="शिकायत हल करें और आदेश जारी करें"
                    />
                  </span>
                </button>

                {/* 2. Escalate to State */}
                <button
                  type="button"
                  onClick={() => setActiveModal("escalate")}
                  className="w-full py-2 px-3 rounded-lg bg-surface-container-low hover:bg-error-container text-error font-label-md text-xs font-bold transition-colors flex items-center justify-center gap-1.5 border border-outline-variant"
                >
                  <Icon name="upload_file" size={16} />
                  <span>
                    <T
                      gu="રાજ્ય સ્તરે મોકલો (Escalate to State)"
                      en="Escalate to State Directorate"
                      hi="राज्य निदेशालय को अग्रेषित करें"
                    />
                  </span>
                </button>

                <div className="grid grid-cols-2 gap-2">
                  {/* 3. Reassign */}
                  <button
                    type="button"
                    onClick={() => setActiveModal("reassign")}
                    className="py-2 px-2.5 rounded-lg bg-surface-container-low hover:bg-surface-container-high text-on-surface font-label-md text-xs font-semibold transition-colors flex items-center justify-center gap-1 border border-outline-variant"
                  >
                    <Icon name="swap_horiz" size={16} className="text-primary" />
                    <span>
                      <T gu="અધિકારી બદલો" en="Reassign" hi="पुनर्निर्देशन" />
                    </span>
                  </button>

                  {/* 4. Request More Info */}
                  <button
                    type="button"
                    onClick={() => setActiveModal("more_info")}
                    className="py-2 px-2.5 rounded-lg bg-surface-container-low hover:bg-surface-container-high text-on-surface font-label-md text-xs font-semibold transition-colors flex items-center justify-center gap-1 border border-outline-variant"
                  >
                    <Icon name="help_outline" size={16} className="text-secondary" />
                    <span>
                      <T gu="વિગતો મંગાવો" en="Request Info" hi="जानकारी मांगें" />
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Audit Trail / Timeline Log */}
            <div className="pt-3 space-y-2.5 bg-surface-container-low p-3.5 rounded-xl border border-outline-variant">
              <div className="flex items-center justify-between">
                <span className="font-label-md text-xs uppercase tracking-wider text-outline font-bold">
                  <T gu="ઓડિટ ટ્રેઇલ (Audit Trail)" en="Audit Trail Timeline" hi="ऑडिट ट्रेल" />
                </span>
                <span className="font-caption text-caption text-outline">
                  {selectedGrievance.timeline.length} પ્રવૃત્તિ નોંધાયેલ
                </span>
              </div>

              <div className="space-y-3 pl-2 relative before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-outline-variant">
                {selectedGrievance.timeline.map((event) => (
                  <div key={event.id} className="flex items-start gap-3 relative">
                    <div
                      className={`w-3.5 h-3.5 rounded-full ${event.badgeColor} ring-4 ring-surface-container-low shrink-0 mt-0.5`}
                    />
                    <div className="space-y-0.5 min-w-0">
                      <p className="font-caption text-xs font-bold text-on-surface">
                        {event.date}, {event.time}
                      </p>
                      <p className="font-caption text-xs text-on-surface-variant leading-snug">
                        {event.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RESOLVE GRIEVANCE MODAL */}
      {activeModal === "resolve" && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in backdrop-blur-xs">
          <div className="bg-surface-container-lowest rounded-2xl max-w-lg w-full p-6 border border-outline-variant shadow-level-3 space-y-4">
            <div className="flex items-center justify-between border-b border-outline-variant pb-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <Icon name="task_alt" size={20} />
                </div>
                <h3 className="font-title-lg text-title-lg font-bold text-on-surface">
                  <T gu="ફરિયાદ નિકાલની પુષ્ટિ કરો" en="Confirm Grievance Resolution" hi="शिकायत समाधान की पुष्टि करें" />
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveModal("none")}
                className="text-outline hover:text-on-surface"
              >
                <Icon name="close" size={20} />
              </button>
            </div>

            <div className="space-y-3 text-sm">
              <p className="text-on-surface-variant">
                કેસ ક્રમાંક <strong className="text-on-surface">{selectedGrievance.id}</strong> (
                {selectedGrievance.studentName}) નો સફળતાપૂર્વક નિકાલ જાહેર કરવા માટે અંતિમ નોંધ લખો:
              </p>

              <div>
                <label className="font-label-md text-xs font-semibold text-on-surface block mb-1">
                  સત્તાવાર નિવારણ નોંધ (Resolution Remarks):
                </label>
                <textarea
                  value={actionNotes}
                  onChange={(e) => setActionNotes(e.target.value)}
                  placeholder="દા.ત. વેન્ડર દ્વારા નવી સાયકલ ફાળવી દેવામાં આવી છે અને વાલી દ્વારા સંતોષ પુષ્ટિ પ્રાપ્ત થયેલ છે."
                  className="w-full p-3 rounded-lg bg-surface-container-low border border-outline-variant text-on-surface text-xs focus:ring-2 focus:ring-primary focus:outline-none min-h-[90px]"
                />
              </div>

              <div className="flex items-center gap-2 p-2.5 bg-emerald-50 rounded-lg text-emerald-800 text-xs border border-emerald-200">
                <Icon name="check_circle" size={16} />
                <span>વાલીના રજિસ્ટર્ડ નંબર પર આપોઆપ SMS સૂચના મોકલવામાં આવશે.</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setActiveModal("none")}
                className="px-4 py-2 rounded-lg bg-surface-container-low hover:bg-surface-container-high text-on-surface font-label-md text-xs font-semibold"
              >
                રદ કરો
              </button>
              <button
                type="button"
                onClick={handleResolveGrievance}
                className="px-4 py-2 rounded-lg bg-secondary text-on-secondary hover:opacity-90 font-label-md text-xs font-bold shadow-md"
              >
                નિકાલ કન્ફર્મ કરો
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ESCALATE TO STATE MODAL */}
      {activeModal === "escalate" && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in backdrop-blur-xs">
          <div className="bg-surface-container-lowest rounded-2xl max-w-lg w-full p-6 border border-outline-variant shadow-level-3 space-y-4">
            <div className="flex items-center justify-between border-b border-outline-variant pb-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-full bg-error-container text-error flex items-center justify-center">
                  <Icon name="upload_file" size={20} />
                </div>
                <h3 className="font-title-lg text-title-lg font-bold text-on-surface">
                  <T gu="રાજ્ય કક્ષાએ એસ્કેલેટ કરો" en="Escalate to State Directorate" hi="राज्य स्तर पर अग्रेषित करें" />
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveModal("none")}
                className="text-outline hover:text-on-surface"
              >
                <Icon name="close" size={20} />
              </button>
            </div>

            <div className="space-y-3 text-sm">
              <p className="text-on-surface-variant">
                આ કેસ જિલ્લા સ્તરેથી રાજ્ય શિક્ષણ વિભાગ, ગાંધીનગર કક્ષાએ મોકલવામાં આવશે.
              </p>

              <div>
                <label className="font-label-md text-xs font-semibold text-on-surface block mb-1">
                  રાજ્ય વિભાગ પસંદ કરો (Target Directorate):
                </label>
                <select
                  value={escalateDepartment}
                  onChange={(e) => setEscalateDepartment(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg bg-surface-container-low border border-outline-variant text-on-surface text-xs focus:ring-2 focus:ring-primary focus:outline-none"
                >
                  <option value="ગાંધીનગર શિષ્યવૃત્તિ નિયામક કચેરી">ગાંધીનગર શિષ્યવૃત્તિ નિયામક કચેરી (State Scholarship Directorate)</option>
                  <option value="PFMS રાજ્ય નોડલ સેલ">PFMS રાજ્ય નોડલ સેલ (PFMS State Finance Cell)</option>
                  <option value="GSRDA સાયકલ મોનિટરિંગ કમિટી">GSRDA સાયકલ મોનિટરિંગ કમિટી (Supply Chain Committee)</option>
                  <option value="ડાયરેક્ટર ઓફ પ્રાઇમરી એજ્યુકેશન">ડાયરેક્ટર ઓફ પ્રાઇમરી એજ્યુકેશન (DPE Gandhinagar)</option>
                </select>
              </div>

              <div className="p-3 bg-error-container/40 rounded-lg text-error text-xs flex items-center gap-2 border border-error/30">
                <Icon name="crisis_alert" size={16} />
                <span>આ કેસને રાજ્ય પોર્ટલ પર &apos;તાકીદ / ક્રિટિકલ&apos; તરીકે ફ્લેગ કરવામાં આવશે.</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setActiveModal("none")}
                className="px-4 py-2 rounded-lg bg-surface-container-low hover:bg-surface-container-high text-on-surface font-label-md text-xs font-semibold"
              >
                રદ કરો
              </button>
              <button
                type="button"
                onClick={handleEscalateToState}
                className="px-4 py-2 rounded-lg bg-error text-white hover:opacity-90 font-label-md text-xs font-bold shadow-md"
              >
                ગાંધીનગર એસ્કેલેટ કરો
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REASSIGN OFFICER MODAL */}
      {activeModal === "reassign" && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in backdrop-blur-xs">
          <div className="bg-surface-container-lowest rounded-2xl max-w-md w-full p-6 border border-outline-variant shadow-level-3 space-y-4">
            <div className="flex items-center justify-between border-b border-outline-variant pb-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                  <Icon name="swap_horiz" size={20} />
                </div>
                <h3 className="font-title-lg text-title-lg font-bold text-on-surface">
                  <T gu="નોડલ અધિકારી પુનઃ સોંપણી" en="Reassign Nodal Officer" hi="अधिकारी पुनर्निर्देशन" />
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveModal("none")}
                className="text-outline hover:text-on-surface"
              >
                <Icon name="close" size={20} />
              </button>
            </div>

            <div className="space-y-3 text-sm">
              <p className="text-on-surface-variant">
                ફરિયાદ <strong className="text-on-surface">{selectedGrievance.id}</strong> માટે નવો નોડલ
                અધિકારી પસંદ કરો:
              </p>

              <div>
                <label className="font-label-md text-xs font-semibold text-on-surface block mb-1">
                  અધિકારી યાદી:
                </label>
                <select
                  value={newOfficer}
                  onChange={(e) => setNewOfficer(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg bg-surface-container-low border border-outline-variant text-on-surface text-xs focus:ring-2 focus:ring-primary focus:outline-none"
                >
                  <option value="શ્રી કે. એમ. રાવલ (સાયકલ નોડલ અધિકારી)">શ્રી કે. એમ. રાવલ (સાયકલ નોડલ અધિકારી)</option>
                  <option value="શ્રી એન. વી. જોષી (એકાઉન્ટ ઓફિસર)">શ્રી એન. વી. જોષી (એકાઉન્ટ ઓફિસર)</option>
                  <option value="શ્રી જે. પી. પટેલ (તાલુકા નોડલ, પેટલાદ)">શ્રી જે. પી. પટેલ (તાલુકા નોડલ, પેટલાદ)</option>
                  <option value="LDM આણંદ (લીડ ડિસ્ટ્રિક્ટ બેંક મેનેજર)">LDM આણંદ (લીડ ડિસ્ટ્રિક્ટ બેંક મેનેજર)</option>
                  <option value="BPO ખંભાત (શિક્ષણ નિરીક્ષક)">BPO ખંભાત (શિક્ષણ નિરીક્ષક)</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setActiveModal("none")}
                className="px-4 py-2 rounded-lg bg-surface-container-low hover:bg-surface-container-high text-on-surface font-label-md text-xs font-semibold"
              >
                રદ કરો
              </button>
              <button
                type="button"
                onClick={handleReassignOfficer}
                className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary-container font-label-md text-xs font-bold shadow-md"
              >
                સોંપણી કન્ફર્મ કરો
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REQUEST MORE INFO MODAL */}
      {activeModal === "more_info" && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in backdrop-blur-xs">
          <div className="bg-surface-container-lowest rounded-2xl max-w-md w-full p-6 border border-outline-variant shadow-level-3 space-y-4">
            <div className="flex items-center justify-between border-b border-outline-variant pb-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-full bg-secondary/15 text-secondary flex items-center justify-center">
                  <Icon name="help_outline" size={20} />
                </div>
                <h3 className="font-title-lg text-title-lg font-bold text-on-surface">
                  <T gu="વધારાની વિગતો / ખુલાસો મંગાવો" en="Request More Information" hi="अतिरिक्त जानकारी मांगें" />
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveModal("none")}
                className="text-outline hover:text-on-surface"
              >
                <Icon name="close" size={20} />
              </button>
            </div>

            <div className="space-y-3 text-sm">
              <div>
                <label className="font-label-md text-xs font-semibold text-on-surface block mb-1">
                  કોની પાસેથી વિગત મંગાવવી છે?
                </label>
                <select
                  value={infoRecipient}
                  onChange={(e) => setInfoRecipient(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg bg-surface-container-low border border-outline-variant text-on-surface text-xs focus:ring-2 focus:ring-primary focus:outline-none"
                >
                  <option value="આચાર્યશ્રી (School Principal)">આચાર્યશ્રી (School Principal)</option>
                  <option value="વિદ્યાર્થી / વાલી (Parent)">વિદ્યાર્થી / વાલી (Parent)</option>
                  <option value="સાયકલ સપ્લાયર વેન્ડર (Vendor)">સાયકલ સપ્લાયર વેન્ડર (Vendor)</option>
                  <option value="તાલુકા શિક્ષણ અધિકારી (TPEO)">તાલુકા શિક્ષણ અધિકારી (TPEO)</option>
                </select>
              </div>

              <div>
                <label className="font-label-md text-xs font-semibold text-on-surface block mb-1">
                  જરૂરી સ્પષ્ટતા / દસ્તાવેજ વિગત:
                </label>
                <textarea
                  placeholder="કૃપા કરીને અપડેટેડ બેંક પાસબુક અથવા વિતરણ પાવતી ૪૮ કલાકમાં અપલોડ કરવા સૂચના."
                  className="w-full p-3 rounded-lg bg-surface-container-low border border-outline-variant text-on-surface text-xs focus:ring-2 focus:ring-primary focus:outline-none min-h-[80px]"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setActiveModal("none")}
                className="px-4 py-2 rounded-lg bg-surface-container-low hover:bg-surface-container-high text-on-surface font-label-md text-xs font-semibold"
              >
                રદ કરો
              </button>
              <button
                type="button"
                onClick={handleRequestMoreInfo}
                className="px-4 py-2 rounded-lg bg-secondary text-on-secondary hover:opacity-90 font-label-md text-xs font-bold shadow-md"
              >
                નોટિસ મોકલો
              </button>
            </div>
          </div>
        </div>
      )}

      {/* NEW GRIEVANCE REGISTRATION MODAL */}
      {activeModal === "new_grievance" && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in backdrop-blur-xs">
          <div className="bg-surface-container-lowest rounded-2xl max-w-lg w-full p-6 border border-outline-variant shadow-level-3 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-outline-variant pb-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-full bg-secondary text-on-secondary flex items-center justify-center font-bold">
                  <Icon name="add" size={20} />
                </div>
                <div>
                  <h3 className="font-title-lg text-title-lg font-bold text-on-surface">
                    <T gu="નવી ફરિયાદ નોંધણી ડેસ્ક" en="Register New Grievance" hi="नई शिकायत दर्ज करें" />
                  </h3>
                  <p className="text-xs text-on-surface-variant">રૂબરૂ / હેલ્પલાઇન દ્વારા પ્રાપ્ત ફરિયાદ</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveModal("none")}
                className="text-outline hover:text-on-surface"
              >
                <Icon name="close" size={20} />
              </button>
            </div>

            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-label-md text-xs font-semibold text-on-surface block mb-1">
                    વિદ્યાર્થી CTS ID:
                  </label>
                  <input
                    type="text"
                    defaultValue="GJ-AND-2026-009988"
                    className="w-full h-10 px-3 rounded-lg bg-surface-container-low border border-outline-variant text-xs"
                  />
                </div>
                <div>
                  <label className="font-label-md text-xs font-semibold text-on-surface block mb-1">
                    વિદ્યાર્થી નામ:
                  </label>
                  <input
                    type="text"
                    defaultValue="કિશન મહેશભાઈ પટેલ"
                    className="w-full h-10 px-3 rounded-lg bg-surface-container-low border border-outline-variant text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="font-label-md text-xs font-semibold text-on-surface block mb-1">
                  ફરિયાદ પ્રકાર:
                </label>
                <select className="w-full h-10 px-3 rounded-lg bg-surface-container-low border border-outline-variant text-xs">
                  <option>સાયકલ વિતરણ / ક્ષતિગ્રસ્ત (Cycles)</option>
                  <option>નમો લક્ષ્મી DBT જમા (Scholarship DBT)</option>
                  <option>બેંક NPCI આધાર અસંગતતા (Aadhaar Seeding)</option>
                  <option>આવક / જાતિ પ્રમાણપત્ર મિસમેચ (Certificates)</option>
                </select>
              </div>

              <div>
                <label className="font-label-md text-xs font-semibold text-on-surface block mb-1">
                  ફરિયાદ વિષય:
                </label>
                <input
                  type="text"
                  defaultValue="સાયકલ સાઇઝ બદલવા બાબત વિનંતી"
                  className="w-full h-10 px-3 rounded-lg bg-surface-container-low border border-outline-variant text-xs"
                />
              </div>

              <div>
                <label className="font-label-md text-xs font-semibold text-on-surface block mb-1">
                  વિગતવાર વર્ણન:
                </label>
                <textarea
                  defaultValue="શાળા દ્વારા ૨૦T સાયકલ આપવામાં આવી છે પરંતુ વિદ્યાર્થી માટે ૨૨T જરૂરી છે."
                  className="w-full p-3 rounded-lg bg-surface-container-low border border-outline-variant text-xs min-h-[70px]"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-outline-variant">
              <button
                type="button"
                onClick={() => setActiveModal("none")}
                className="px-4 py-2 rounded-lg bg-surface-container-low hover:bg-surface-container-high text-on-surface font-label-md text-xs font-semibold"
              >
                રદ કરો
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveModal("none");
                  showToast("નવી ફરિયાદ GRV-2026-0488 સફળતાપૂર્વક સિસ્ટમમાં દાખલ થઈ!");
                }}
                className="px-4 py-2 rounded-lg bg-secondary text-on-secondary hover:opacity-90 font-label-md text-xs font-bold shadow-md"
              >
                ફરિયાદ જનરેટ કરો
              </button>
            </div>
          </div>
        </div>
      )}
    </OfficerShell>
  );
}
