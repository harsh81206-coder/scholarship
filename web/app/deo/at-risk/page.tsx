"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { T } from "@/components/T";
import { OfficerShell } from "@/components/shell/OfficerShell";
import { Icon } from "@/components/Icon";
import { Avatar } from "@/components/ui";

interface RiskFactor {
  label: { gu: string; en: string; hi: string };
  icon: string;
  type: "error" | "warning" | "info" | "secondary";
}

interface ShapFactor {
  name: { gu: string; en: string; hi: string };
  impact: string;
  percent: number;
  icon: string;
  barColor: string;
  textColor: string;
}

interface ChecklistItem {
  id: string;
  title: { gu: string; en: string; hi: string };
  desc: { gu: string; en: string; hi: string };
}

interface Student {
  id: string;
  name: { gu: string; en: string; hi: string };
  initials: string;
  ctsId: string;
  school: { gu: string; en: string; hi: string };
  schoolKey: string;
  taluka: { gu: string; en: string; hi: string };
  talukaKey: string;
  grade: { gu: string; en: string; hi: string };
  gradeKey: string;
  gender: "female" | "male";
  riskScore: number;
  riskTier: "high" | "medium" | "low";
  parents: { gu: string; en: string; hi: string };
  nodalOfficer: {
    name: { gu: string; en: string; hi: string };
    role: { gu: string; en: string; hi: string };
    initials: string;
    phone: string;
  };
  factors: RiskFactor[];
  shapFactors: ShapFactor[];
  recommendedIntervention: {
    title: { gu: string; en: string; hi: string };
    sub: { gu: string; en: string; hi: string };
  };
  checklist: ChecklistItem[];
  projectionText: { gu: string; en: string; hi: string };
}

const MOCK_STUDENTS: Student[] = [
  {
    id: "riya",
    name: { gu: "રિયા વિનોદભાઈ ઠાકોર", en: "Riya Vinodbhai Thakor", hi: "रिया विनोदभाई ठाकोर" },
    initials: "રિયા",
    ctsId: "GJ-AND-2026-003891",
    school: { gu: "વિનય મંદિર હાઈસ્કૂલ", en: "Vinay Mandir High School", hi: "विनय मंदिर हाई स्कूल" },
    schoolKey: "vinay_mandir",
    taluka: { gu: "ખંભાત", en: "Khambhat", hi: "खंभात" },
    talukaKey: "khambhat",
    grade: { gu: "ધોરણ ૯-એ", en: "Class 9-A", hi: "कक्षा 9-ए" },
    gradeKey: "class_9",
    gender: "female",
    riskScore: 86,
    riskTier: "high",
    parents: { gu: "વિનોદભાઈ (પિતા), શાંતાબેન (માતા)", en: "Vinodbhai (Father), Shantaben (Mother)", hi: "विनोदभाई (पिता), शांताबेन (माता)" },
    nodalOfficer: {
      name: { gu: "શ્રીમતી મનીષાબેન પંચાલ", en: "Smt. Manishaben Panchal", hi: "श्रीमती मनीषाबेन पांचाल" },
      role: { gu: "મહિલા નોડલ શિક્ષક, ખંભાત ક્લસ્ટર", en: "Female Nodal Teacher, Khambhat Cluster", hi: "महिला नोडल शिक्षक, खंभात क्लस्टर" },
      initials: "મપ",
      phone: "+91 98250 14592",
    },
    factors: [
      { label: { gu: "૫૮% હાજરી", en: "58% Attendance", hi: "58% उपस्थिति" }, icon: "schedule", type: "error" },
      { label: { gu: "૬.૨ કિમી પગપાળા", en: "6.2 km Walking", hi: "6.2 किमी पैदल" }, icon: "near_me", type: "secondary" },
      { label: { gu: "સાયકલ પેન્ડિંગ", en: "Cycle Pending", hi: "साइकिल लंबित" }, icon: "pedal_bike", type: "error" },
      { label: { gu: "૨ વિષયમાં નપાસ", en: "Failed 2 Subjects", hi: "2 विषयों में अनुत्तीर्ण" }, icon: "assignment_late", type: "error" },
    ],
    shapFactors: [
      {
        name: { gu: "શાળાથી ઘર અંતર (૬.૨ કિમી પગપાળા)", en: "School Distance (6.2 km Walking)", hi: "स्कूल से दूरी (6.2 किमी पैदल)" },
        impact: "+૩૨%",
        percent: 78,
        icon: "route",
        barColor: "bg-secondary",
        textColor: "text-error",
      },
      {
        name: { gu: "સરસ્વતી સાધના સાયકલ હજુ ન મળવી", en: "Saraswati Sadhana Cycle Pending", hi: "सरस्वती साधना साइकिल लंबित" },
        impact: "+૨૮%",
        percent: 68,
        icon: "pedal_bike",
        barColor: "bg-primary",
        textColor: "text-error",
      },
      {
        name: { gu: "હાજરીમાં તીવ્ર ઘટાડો (૭૮% → ૫૮%)", en: "Steep Attendance Drop (78% → 58%)", hi: "उपस्थिति में तीव्र गिरावट (78% → 58%)" },
        impact: "+૨૨%",
        percent: 55,
        icon: "trending_down",
        barColor: "bg-error",
        textColor: "text-error",
      },
      {
        name: { gu: "નમો લક્ષ્મી DBT બેંક KYC પેન્ડિંગ", en: "Namo Lakshmi DBT KYC Pending", hi: "नमो लक्ष्मी डीबीटी केवाईसी लंबित" },
        impact: "+૧૪%",
        percent: 35,
        icon: "account_balance",
        barColor: "bg-warning",
        textColor: "text-secondary",
      },
    ],
    recommendedIntervention: {
      title: { gu: "સાયકલ પ્રાથમિકતા", en: "Priority Cycle Dispatch", hi: "प्राथमिकता साइकिल आवंटन" },
      sub: { gu: "+ મહિલા શિક્ષક મુલાકાત", en: "+ Female Teacher Home Visit", hi: "+ महिला शिक्षक गृह भेंट" },
    },
    checklist: [
      {
        id: "c1",
        title: { gu: "સરસ્વતી સાધના સાયકલ અગ્રતા ફાળવણી", en: "Saraswati Sadhana Priority Cycle Allocation", hi: "सरस्वती साधना प्राथमिकता साइकिल आवंटन" },
        desc: { gu: "બેચ B-0145 માંથી ૪૮ કલાકમાં ડિલિવરી હુકમ", en: "Delivery order within 48 hours from Batch B-0145", hi: "बैच B-0145 से 48 घंटे में डिलीवरी आदेश" },
      },
      {
        id: "c2",
        title: { gu: "મહિલા કાઉન્સિલર દ્વારા ઘર મુલાકાત", en: "Home Visit by Female Counselor", hi: "महिला काउंसलर द्वारा गृह भेंट" },
        desc: { gu: "વાલીઓ સાથે બાળકીના શિક્ષણ સાતત્ય અંગે પરામર્શ", en: "Consultation with parents regarding educational continuity", hi: "अभिभावकों से शिक्षा निरंतरता पर परामर्श" },
      },
      {
        id: "c3",
        title: { gu: "નમો લક્ષ્મી DBT કેમ્પિંગ પ્રાથમિકતા", en: "Namo Lakshmi DBT Camp Priority", hi: "नमो लक्ष्मी डीबीटी कैंप प्राथमिकता" },
        desc: { gu: "ઈ-કેવાયસી અને આધાર સીડિંગ તાત્કાલિક પૂર્ણ કરવું", en: "Immediate resolution of e-KYC and Aadhaar seeding", hi: "ई-केवाईसी और आधार सीडिंग तुरंत पूरा करें" },
      },
    ],
    projectionText: {
      gu: "આગામી ૩૦ દિવસમાં શાળા છોડવાની ૮૬% સંભાવના. તાત્કાલિક સાયકલ વિતરણ અને ઘર મુલાકાત જરૂરી.",
      en: "86% dropout probability in the next 30 days without immediate bicycle allocation and home consultation.",
      hi: "आगामी 30 दिनों में स्कूल छोड़ने की 86% संभावना। तत्काल साइकिल वितरण एवं गृह भेंट आवश्यक।",
    },
  },
  {
    id: "altaf",
    name: { gu: "અલ્તાફ મુસ્તફા શેખ", en: "Altaf Mustafa Shaikh", hi: "अल्ताफ मुस्तफा शेख" },
    initials: "અલ્તાફ",
    ctsId: "GJ-AND-2026-004112",
    school: { gu: "જનતા વિદ્યાલય", en: "Janata Vidyalaya", hi: "जनता विद्यालय" },
    schoolKey: "janata_vidyalaya",
    taluka: { gu: "તારાપુર", en: "Tarapur", hi: "तारापुर" },
    talukaKey: "tarapur",
    grade: { gu: "ધોરણ ૧૦-બી", en: "Class 10-B", hi: "कक्षा 10-बी" },
    gradeKey: "class_10",
    gender: "male",
    riskScore: 79,
    riskTier: "high",
    parents: { gu: "મુસ્તફાભાઈ (પિતા), ફાતિમાબેન (માતા)", en: "Mustafabhai (Father), Fatimaben (Mother)", hi: "मुस्तफाभाई (पिता), फातिमाबेन (माता)" },
    nodalOfficer: {
      name: { gu: "શ્રી ઇકબાલહુસેન મન્સૂરી", en: "Shri Iqbalhusen Mansoori", hi: "श्री इकबालहुसैन मंसूरी" },
      role: { gu: "માધ્યમિક નોડલ શિક્ષક, તારાપુર", en: "Secondary Nodal Teacher, Tarapur", hi: "माध्यमिक नोडल शिक्षक, तारापुर" },
      initials: "ઇમ",
      phone: "+91 94270 88210",
    },
    factors: [
      { label: { gu: "DBT ચૂકવણી અટકેલ", en: "DBT Payment Lapsed", hi: "डीबीटी भुगतान लंबित" }, icon: "credit_card_off", type: "error" },
      { label: { gu: "૬૨% હાજરી", en: "62% Attendance", hi: "62% उपस्थिति" }, icon: "schedule", type: "secondary" },
      { label: { gu: "૧ વિષયમાં નપાસ", en: "Failed 1 Subject", hi: "1 विषय में अनुत्तीर्ण" }, icon: "assignment_late", type: "warning" },
    ],
    shapFactors: [
      {
        name: { gu: "નમો સરસ્વતી/DBT બેંક KYC નિષ્ફળતા", en: "Namo Saraswati/DBT Bank KYC Failure", hi: "नमो सरस्वती/डीबीटी बैंक केवाईसी विफलता" },
        impact: "+૩૬%",
        percent: 82,
        icon: "account_balance",
        barColor: "bg-error",
        textColor: "text-error",
      },
      {
        name: { gu: "સાપ્તાહિક હાજરી ઘટાડો (<૬૫%)", en: "Weekly Attendance Drop (<65%)", hi: "साप्ताहिक उपस्थिति गिरावट (<65%)" },
        impact: "+૨૬%",
        percent: 62,
        icon: "trending_down",
        barColor: "bg-secondary",
        textColor: "text-error",
      },
      {
        name: { gu: "ગણિતમાં પૂરક ગુણ (<૩૫%)", en: "Remedial Math Score (<35%)", hi: "गणित में कम अंक (<35%)" },
        impact: "+૨૦%",
        percent: 48,
        icon: "calculate",
        barColor: "bg-primary",
        textColor: "text-primary",
      },
      {
        name: { gu: "વાલી સ્થળાંતર સંભાવના", en: "Parental Seasonal Migration Risk", hi: "अभिभावक मौसमी पलायन जोखिम" },
        impact: "+૧૨%",
        percent: 30,
        icon: "family_restroom",
        barColor: "bg-outline",
        textColor: "text-on-surface-variant",
      },
    ],
    recommendedIntervention: {
      title: { gu: "પ્રી-મેટ્રિક DBT સુધારણા", en: "Pre-Matric DBT Correction", hi: "प्री-मैट्रिक डीबीटी सुधार" },
      sub: { gu: "બેંક KYC કેમ્પિંગ", en: "Bank KYC Camp Enrolment", hi: "बैंक केवाईसी कैंप नामांकन" },
    },
    checklist: [
      {
        id: "c1",
        title: { gu: "બેંક આધાર સીડિંગ સ્પેશિયલ ડ્રાઇવ", en: "Special Bank Aadhaar Seeding Drive", hi: "विशेष बैंक आधार सीडिंग अभियान" },
        desc: { gu: "ગ્રામીણ બેંક શાખા સાથે સમન્વય કરી ૨૪ કલાકમાં ખાતું સક્રિય કરાવવું", en: "Coordinate with rural bank branch to activate account within 24h", hi: "ग्रामीण बैंक शाखा से समन्वय कर 24 घंटे में खाता सक्रिय कराएं" },
      },
      {
        id: "c2",
        title: { gu: "વર્ગશિક્ષક ફોન સમીક્ષા", en: "Class Teacher Follow-up Call", hi: "कक्षा शिक्षक फॉलो-अप कॉल" },
        desc: { gu: "વિદ્યાર્થીની ગેરહાજરીના કારણો ચકાસી રેકોર્ડ અપડેટ કરવો", en: "Verify absence causes and update Vidyasamiksha Kendra record", hi: "छात्र की अनुपस्थिति के कारणों की जांच करें" },
      },
    ],
    projectionText: {
      gu: "DBT અટકી જવાથી આર્થિક બોજને કારણે વર્ગ ૧૦ ની બોર્ડ પરીક્ષા પહેલાં શાળા છોડવાનું ઉચ્ચ જોખમ.",
      en: "High risk of pre-board drop-out due to financial stress caused by unpaid scholarship installments.",
      hi: "डीबीटी रुकने के कारण 10वीं बोर्ड परीक्षा से पूर्व स्कूल छोड़ने का उच्च जोखिम।",
    },
  },
  {
    id: "janki",
    name: { gu: "જાનકી મહેશભાઈ વાઘેલા", en: "Janki Maheshbhai Vaghela", hi: "जानकी महेशभाई वाघेला" },
    initials: "જાનકી",
    ctsId: "GJ-AND-2026-005619",
    school: { gu: "સાર્વજનિક હાઈસ્કૂલ", en: "Sarvajanik High School", hi: "सार्वजनिक हाई स्कूल" },
    schoolKey: "sarvajanik_high",
    taluka: { gu: "આંકલાવ", en: "Anklav", hi: "आंकलाव" },
    talukaKey: "anklav",
    grade: { gu: "ધોરણ ૯-સી", en: "Class 9-C", hi: "कक्षा 9-सी" },
    gradeKey: "class_9",
    gender: "female",
    riskScore: 74,
    riskTier: "high",
    parents: { gu: "મહેશભાઈ (પિતા), કૈલાશબેન (માતા)", en: "Maheshbhai (Father), Kailashben (Mother)", hi: "महेशभाई (पिता), कैलाशबेन (माता)" },
    nodalOfficer: {
      name: { gu: "શ્રી રોહિતભાઈ પરમાર", en: "Shri Rohitbhai Parmar", hi: "श्री रोहितभाई परमार" },
      role: { gu: "ક્લસ્ટર કાઉન્સેલર, આંકલાવ", en: "Cluster Counselor, Anklav", hi: "क्लस्टर काउंसलर, आंकलाव" },
      initials: "રોપ",
      phone: "+91 97140 23451",
    },
    factors: [
      { label: { gu: "માર્ક્સ < ૩૫%", en: "Marks < 35%", hi: "अंक < 35%" }, icon: "cancel", type: "error" },
      { label: { gu: "આર્થિક અસુરક્ષા", en: "Financial Distress", hi: "आर्थिक असुरक्षा" }, icon: "money_off", type: "secondary" },
      { label: { gu: "૬૫% હાજરી", en: "65% Attendance", hi: "65% उपस्थिति" }, icon: "schedule", type: "warning" },
    ],
    shapFactors: [
      {
        name: { gu: "ત્રિમાસિક પરીક્ષામાં ૨ વિષયમાં અસફળ (<૩૫%)", en: "Failed 2 Subjects in Quarterly Exams (<35%)", hi: "त्रैमासिक परीक्षा में 2 विषयों में अनुत्तीर्ण (<35%)" },
        impact: "+૩૪%",
        percent: 75,
        icon: "assignment_late",
        barColor: "bg-error",
        textColor: "text-error",
      },
      {
        name: { gu: "આર્થિક સંકટ અને પારિવારિક બોજ", en: "Family Financial Vulnerability", hi: "पारिवारिक आर्थिक संकट" },
        impact: "+૨૫%",
        percent: 58,
        icon: "savings",
        barColor: "bg-secondary",
        textColor: "text-secondary",
      },
      {
        name: { gu: "અનિયમિત ઉપસ્થિતિ (૬૫%)", en: "Irregular School Attendance (65%)", hi: "अनियमित उपस्थिति (65%)" },
        impact: "+૨૩%",
        percent: 50,
        icon: "schedule",
        barColor: "bg-primary",
        textColor: "text-primary",
      },
      {
        name: { gu: "શિક્ષણ સહાય સાધન અપૂર્ણ", en: "Study Kit & Material Deficiency", hi: "अध्ययन सामग्री की कमी" },
        impact: "+૧૨%",
        percent: 28,
        icon: "menu_book",
        barColor: "bg-outline",
        textColor: "text-on-surface-variant",
      },
    ],
    recommendedIntervention: {
      title: { gu: "જ્ઞાન સાધના કોચિંગ", en: "Gyan Sadhana Remedial Coaching", hi: "ज्ञान साधना उपचारात्मक कोचिंग" },
      sub: { gu: "+ વાલી કાઉન્સિલિંગ", en: "+ Parental Counseling Session", hi: "+ अभिभावक परामर्श सत्र" },
    },
    checklist: [
      {
        id: "c1",
        title: { gu: "રેમીડિયલ ક્લાસમાં નોંધણી", en: "Enrollment in Remedial Academic Classes", hi: "उपचारात्मक कक्षाओं में नामांकन" },
        desc: { gu: "ગણિત અને વિજ્ઞાન માટે વિશેષ ૧ કલાક વધારાનું માર્ગદર્શન", en: "Daily 1-hour special bridge tutoring in Math and Science", hi: "गणित एवं विज्ञान के लिए दैनिक 1 घंटा विशेष मार्गदर्शन" },
      },
      {
        id: "c2",
        title: { gu: "જ્ઞાન સાધના શિષ્યવૃત્તિ અરજી ચકાસણી", en: "Verify Gyan Sadhana Scholarship Form", hi: "ज्ञान साधना छात्रवृत्ति फॉर्म सत्यापन" },
        desc: { gu: "આવક દાખલો અને દસ્તાવેજો તાત્કાલિક અપલોડ કરવા", en: "Immediate upload of income certificate and required documents", hi: "आय प्रमाण पत्र और आवश्यक दस्तावेज तुरंत अपलोड करें" },
      },
    ],
    projectionText: {
      gu: "શૈક્ષણિક પછાતપણા અને નિરાશાને કારણે ડ્રોપઆઉટની ૭૪% સંભાવના. તાત્કાલિક કાઉન્સિલિંગ જરૂરી.",
      en: "74% likelihood of drop out driven by academic struggle and low test scores. Remedial tutoring recommended.",
      hi: "शैक्षणिक पिछड़ेपन के कारण स्कूल छोड़ने की 74% संभावना। तत्काल काउंसलिंग आवश्यक।",
    },
  },
  {
    id: "bhavika",
    name: { gu: "ભાવિકા કમલેશભાઈ પરમાર", en: "Bhavika Kamleshbhai Parmar", hi: "भाविका कमलेशभाई परमार" },
    initials: "ભાવિકા",
    ctsId: "GJ-AND-2026-006201",
    school: { gu: "મોડેલ સ્કૂલ", en: "Model School", hi: "मॉडल स्कूल" },
    schoolKey: "model_school",
    taluka: { gu: "ઉમરેઠ", en: "Umreth", hi: "उमरेठ" },
    talukaKey: "umreth",
    grade: { gu: "ધોરણ ૯-એ", en: "Class 9-A", hi: "कक्षा 9-ए" },
    gradeKey: "class_9",
    gender: "female",
    riskScore: 71,
    riskTier: "high",
    parents: { gu: "કમલેશભાઈ (પિતા), જયાબેન (માતા)", en: "Kamleshbhai (Father), Jayaben (Mother)", hi: "कमलेशभाई (पिता), जयाबेन (माता)" },
    nodalOfficer: {
      name: { gu: "કુ. રશ્મિકાબેન સોલંકી", en: "Kum. Rashmikaben Solanki", hi: "कु. रश्मिकाबेन सोलंकी" },
      role: { gu: "આચાર્યા, મોડેલ સ્કૂલ, ઉમરેઠ", en: "Principal, Model School, Umreth", hi: "प्रधानाचार्या, मॉडल स्कूल, उमरेठ" },
      initials: "રસ",
      phone: "+91 98980 56712",
    },
    factors: [
      { label: { gu: "૫.૫ કિમી અંતર", en: "5.5 km Distance", hi: "5.5 किमी दूरी" }, icon: "near_me", type: "secondary" },
      { label: { gu: "સાયકલ વિલંબ", en: "Cycle Delayed", hi: "साइकिल में देरी" }, icon: "pedal_bike", type: "error" },
      { label: { gu: "૭૦% હાજરી", en: "70% Attendance", hi: "70% उपस्थिति" }, icon: "schedule", type: "warning" },
    ],
    shapFactors: [
      {
        name: { gu: "દૈનિક પરિવહન સુવિધાનો અભાવ (૫.૫ કિમી)", en: "Lack of Daily Transport (5.5 km)", hi: "दैनिक परिवहन सुविधा का अभाव (5.5 किमी)" },
        impact: "+૩૮%",
        percent: 85,
        icon: "directions_walk",
        barColor: "bg-secondary",
        textColor: "text-error",
      },
      {
        name: { gu: "સરસ્વતી સાધના સાયકલ ડિલિવરી વિલંબ", en: "Saraswati Sadhana Bicycle Delay", hi: "सरस्वती साधना साइकिल वितरण में देरी" },
        impact: "+૨૭%",
        percent: 62,
        icon: "pedal_bike",
        barColor: "bg-primary",
        textColor: "text-error",
      },
      {
        name: { gu: "ચોમાસુ/અંતરિયાળ ગ્રામીણ રસ્તો", en: "Monsoon & Harsh Rural Terrain", hi: "कठिन ग्रामीण मार्ग" },
        impact: "+૧૮%",
        percent: 42,
        icon: "landscape",
        barColor: "bg-warning",
        textColor: "text-secondary",
      },
      {
        name: { gu: "હાજરી ઘટાડાનો ટ્રેન્ડ", en: "Progressive Attendance Decline", hi: "उपस्थिति में गिरावट की प्रवृत्ति" },
        impact: "+૧૧%",
        percent: 25,
        icon: "trending_down",
        barColor: "bg-outline",
        textColor: "text-on-surface-variant",
      },
    ],
    recommendedIntervention: {
      title: { gu: "ત્વરિત સાયકલ વિતરણ", en: "Fast-Track Bicycle Dispatch", hi: "त्वरित साइकिल वितरण" },
      sub: { gu: "બેચ B-0145 નોકરી", en: "Batch B-0145 Work Order", hi: "बैच B-0145 कार्य आदेश" },
    },
    checklist: [
      {
        id: "c1",
        title: { gu: "વેન્ડર એક્સપેડાઇટ નોટિસ", en: "Vendor Expedite Notice Issued", hi: "विक्रेता त्वरित आपूर्ति नोटिस" },
        desc: { gu: "જિલ્લા સ્ટોરમાંથી ૨૪ કલાકમાં સાયકલ રવાના કરવી", en: "Dispatch bicycle from district inventory hub within 24 hours", hi: "जिला गोदाम से 24 घंटे में साइकिल रवाना करें" },
      },
      {
        id: "c2",
        title: { gu: "રૂટ પૂલિંગ સમન્વય", en: "Village Student Route Pooling", hi: "ग्राम छात्र समूह परिवहन" },
        desc: { gu: "ગામની અન્ય ૪ વિદ્યાર્થીનીઓ સાથે સલામત સવારી જૂથ રચવું", en: "Form buddy travel group with 4 fellow village girl students", hi: "गांव की अन्य छात्राओं के साथ सुरक्षित यात्रा समूह बनाएं" },
      },
    ],
    projectionText: {
      gu: "૫.૫ કિમી પગપાળા અંતરના કારણે થાક અને સુરક્ષા ચિંતાથી હાજરી ઘટી રહી છે. સાયકલ મળતાં ૯૦% પુનઃપ્રાપ્તિ અંદાજિત.",
      en: "Fatigue from 5.5 km daily walk causing attendance decline. Immediate cycle allocation projects 90% retention recovery.",
      hi: "5.5 किमी पैदल दूरी के कारण उपस्थिति घट रही है। साइकिल मिलने पर 90% वापसी अनुमानित।",
    },
  },
  {
    id: "sachin",
    name: { gu: "સચીન દિનેશભાઈ સોલંકી", en: "Sachin Dineshbhai Solanki", hi: "सचिन दिनेशभाई सोलंकी" },
    initials: "સચીન",
    ctsId: "GJ-AND-2026-007844",
    school: { gu: "શ્રી વલ્લભ વિદ્યાલય", en: "Shri Vallabh Vidyalaya", hi: "श्री वल्लभ विद्यालय" },
    schoolKey: "vallabh_vidyalaya",
    taluka: { gu: "બોરસદ", en: "Borsad", hi: "बोरसद" },
    talukaKey: "borsad",
    grade: { gu: "ધોરણ ૧૧-સામાન્ય", en: "Class 11-General", hi: "कक्षा 11-सामान्य" },
    gradeKey: "class_11",
    gender: "male",
    riskScore: 52,
    riskTier: "medium",
    parents: { gu: "દિનેશભાઈ (પિતા), લીલાબેન (માતા)", en: "Dineshbhai (Father), Lilaben (Mother)", hi: "दिनेशभाई (पिता), लीलाबेन (माता)" },
    nodalOfficer: {
      name: { gu: "શ્રી પ્રવીણભાઈ પટેલ", en: "Shri Pravinbhai Patel", hi: "श्री प्रवीणभाई पटेल" },
      role: { gu: "સી.આર.સી. કોઓર્ડિનેટર, બોરસદ", en: "CRC Coordinator, Borsad", hi: "सीआरसी समन्वयक, बोरसद" },
      initials: "પ્રપ",
      phone: "+91 94088 12903",
    },
    factors: [
      { label: { gu: "ખેતી સહાય ગેરહાજરી", en: "Seasonal Farm Absence", hi: "मौसमी कृषि अनुपस्थिति" }, icon: "agriculture", type: "warning" },
      { label: { gu: "૬૮% હાજરી", en: "68% Attendance", hi: "68% उपस्थिति" }, icon: "schedule", type: "info" },
      { label: { gu: "વાલી પરામર્શ બાકી", en: "Parent Counseling Pending", hi: "अभिभावक परामर्श लंबित" }, icon: "contact_phone", type: "secondary" },
    ],
    shapFactors: [
      {
        name: { gu: "મોસમી ખેતીકામ દરમિયાન ગેરહાજરી", en: "Seasonal Farm Harvest Work Absence", hi: "मौसमी फसल कटाई में अनुपस्थिति" },
        impact: "+૪૦%",
        percent: 80,
        icon: "agriculture",
        barColor: "bg-secondary",
        textColor: "text-secondary",
      },
      {
        name: { gu: "પાછલી પરીક્ષામાં સરેરાશ ૩૮%", en: "Prior Exam Average (38%)", hi: "पिछली परीक्षा औसत (38%)" },
        impact: "+૨૨%",
        percent: 46,
        icon: "assessment",
        barColor: "bg-warning",
        textColor: "text-warning",
      },
      {
        name: { gu: "ઉચ્ચતર માધ્યમિક સહાય વિલંબ", en: "Higher Secondary Aid Delay", hi: "उच्चतर माध्यमिक सहायता में देरी" },
        impact: "+૧૮%",
        percent: 38,
        icon: "school",
        barColor: "bg-primary",
        textColor: "text-primary",
      },
      {
        name: { gu: "પિયર ગ્રુપ ડ્રોપઆઉટ ઈમ્પેક્ટ", en: "Peer Cohort Dropout Influence", hi: "सहपाठी ड्रॉपआउट प्रभाव" },
        impact: "+૧૨%",
        percent: 24,
        icon: "group",
        barColor: "bg-outline",
        textColor: "text-on-surface-variant",
      },
    ],
    recommendedIntervention: {
      title: { gu: "વાલી પરામર્શ", en: "Parental Consultation", hi: "अभिभावक परामर्श" },
      sub: { gu: "સી.આર.સી. કોઓર્ડિનેટર મુલાકાત", en: "CRC Coordinator Home Visit", hi: "सीआरसी समन्वयक गृह भेंट" },
    },
    checklist: [
      {
        id: "c1",
        title: { gu: "ખેતીની મોસમમાં લવચીક ગૃહકાર્ય સહાય", en: "Flexible Homework Support during Harvest", hi: "फसल मौसम में लचीला गृहकार्य सहयोग" },
        desc: { gu: "શાળા સમય બાદ અભ્યાસ સામગ્રી ડિજિટલ સ્વરૂપે પૂરી પાડવી", en: "Provide evening digital materials and bridge notes", hi: "शाम को डिजिटल अध्ययन सामग्री उपलब्ध कराएं" },
      },
      {
        id: "c2",
        title: { gu: "વાલી સાથે બેઠક", en: "Parent-Teacher Engagement Session", hi: "अभिभावक-शिक्षक बैठक" },
        desc: { gu: "શિક્ષણ પૂરું કરવાથી મળતા લાંબા ગાળાના લાભો અંગે સમજાવવું", en: "Demonstrate long-term benefits of Class 12 completion", hi: "12वीं कक्षा पूर्ण करने के लाभ समझाएं" },
      },
    ],
    projectionText: {
      gu: "મધ્યમ જોખમ સ્તર (૫૨%). પાક લણણીના દિવસોમાં શાળા ન છૂટે તે માટે સાપ્તાહિક મોનિટરિંગ જરૂરી.",
      en: "Medium risk level (52%). Weekly monitoring recommended during harvest months to maintain attendance threshold.",
      hi: "मध्यम जोखिम स्तर (52%)। फसल कटाई के दिनों में साप्ताहिक निगरानी आवश्यक।",
    },
  },
  {
    id: "pooja",
    name: { gu: "પૂજા અરવિંદભાઈ પટેલ", en: "Pooja Arvindbhai Patel", hi: "पूजा अरविंदभाई पटेल" },
    initials: "પૂજા",
    ctsId: "GJ-AND-2026-008120",
    school: { gu: "વિનય મંદિર હાઈસ્કૂલ", en: "Vinay Mandir High School", hi: "विनय मंदिर हाई स्कूल" },
    schoolKey: "vinay_mandir",
    taluka: { gu: "ખંભાત", en: "Khambhat", hi: "खंभात" },
    talukaKey: "khambhat",
    grade: { gu: "ધોરણ ૧૦-એ", en: "Class 10-A", hi: "कक्षा 10-ए" },
    gradeKey: "class_10",
    gender: "female",
    riskScore: 28,
    riskTier: "low",
    parents: { gu: "અરવિંદભાઈ (પિતા), રંજનબેન (માતા)", en: "Arvindbhai (Father), Ranjanben (Mother)", hi: "अरविंदभाई (पिता), रंजनबेन (माता)" },
    nodalOfficer: {
      name: { gu: "શ્રીમતી મનીષાબેન પંચાલ", en: "Smt. Manishaben Panchal", hi: "श्रीमती मनीषाबेन पांचाल" },
      role: { gu: "મહિલા નોડલ શિક્ષક, ખંભાત", en: "Female Nodal Teacher, Khambhat", hi: "महिला नोडल शिक्षक, खंभात" },
      initials: "મપ",
      phone: "+91 98250 14592",
    },
    factors: [
      { label: { gu: "૭૬% હાજરી", en: "76% Attendance", hi: "76% उपस्थिति" }, icon: "check_circle", type: "info" },
      { label: { gu: "સાયકલ પ્રાપ્ત", en: "Cycle Received", hi: "साइकिल प्राप्त" }, icon: "pedal_bike", type: "info" },
      { label: { gu: "તમામ વિષય પાસ", en: "All Passed", hi: "सभी उत्तीर्ण" }, icon: "school", type: "info" },
    ],
    shapFactors: [
      {
        name: { gu: "અગાઉ સરસ્વતી સાધના સાયકલ મળેલ છે", en: "Saraswati Sadhana Bicycle Received", hi: "सरस्वती साधना साइकिल पूर्व में प्राप्त" },
        impact: "-૩૦%",
        percent: 15,
        icon: "pedal_bike",
        barColor: "bg-success",
        textColor: "text-success",
      },
      {
        name: { gu: "હાજરી નિયમિત (>૭૫%)", en: "Stable Attendance (>75%)", hi: "नियमित उपस्थिति (>75%)" },
        impact: "-૧૫%",
        percent: 20,
        icon: "schedule",
        barColor: "bg-primary",
        textColor: "text-primary",
      },
      {
        name: { gu: "નમો લક્ષ્મી DBT સફળતાપૂર્વક જમા", en: "Namo Lakshmi DBT Successfully Credited", hi: "नमो लक्ष्मी डीबीटी सफलतापूर्वक जमा" },
        impact: "-૧૮%",
        percent: 12,
        icon: "account_balance",
        barColor: "bg-success",
        textColor: "text-success",
      },
      {
        name: { gu: "સામાન્ય બોર્ડ પરીક્ષા ચિંતા", en: "Routine Board Exam Anxiety", hi: "सामान्य बोर्ड परीक्षा चिंता" },
        impact: "+૧૨%",
        percent: 25,
        icon: "psychology",
        barColor: "bg-outline",
        textColor: "text-on-surface-variant",
      },
    ],
    recommendedIntervention: {
      title: { gu: "નિયમિત મોનિટરિંગ", en: "Routine Monitoring", hi: "नियमित निगरानी" },
      sub: { gu: "પ્રગતિ સમીક્ષા", en: "Periodic Progress Review", hi: "आवधिक प्रगति समीक्षा" },
    },
    checklist: [
      {
        id: "c1",
        title: { gu: "સાપ્તાહિક હાજરી લોગ ચકાસણી", en: "Weekly Attendance Log Verification", hi: "साप्ताहिक उपस्थिति लॉग सत्यापन" },
        desc: { gu: "હાજરી ૭૫% થી ઉપર જાળવી રાખવા માટે સામાન્ય દેખરેખ", en: "Routine oversight to ensure attendance stays above 75%", hi: "उपस्थिति 75% से ऊपर बनाए रखने हेतु सामान्य निगरानी" },
      },
    ],
    projectionText: {
      gu: "ઓછું જોખમ સ્તર (૨૮%). યોજનાકીય લાભો સમયસર મળવાથી વિદ્યાર્થીની નિયમિતપણે શાળાએ આવી રહી છે.",
      en: "Low risk level (28%). Timely disbursement of welfare benefits has stabilized attendance.",
      hi: "कम जोखिम स्तर (28%)। समय पर योजना लाभ मिलने से छात्रा नियमित उपस्थित है।",
    },
  },
];

export default function AtRiskStudentsPage() {
  const [selectedStudentId, setSelectedStudentId] = useState<string>("riya");
  const [riskFilter, setRiskFilter] = useState<string>("all"); // 'all' | 'high' | 'medium' | 'low'
  const [schoolFilter, setSchoolFilter] = useState<string>("all");
  const [classFilter, setClassFilter] = useState<string>("all");
  const [genderFilter, setGenderFilter] = useState<string>("all");
  const [, setCauseFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [chartTab, setChartTab] = useState<"tier" | "cause" | "class">("tier");

  // Multi-select state
  const [selectedIds, setSelectedIds] = useState<Record<string, boolean>>({
    riya: true,
  });

  // Action toasts / feedback banner
  const [actionNotice, setActionNotice] = useState<{
    text: { gu: string; en: string; hi: string };
    type: "success" | "warning" | "info";
  } | null>(null);

  // Student bundle checklist state
  const [checklistState, setChecklistState] = useState<Record<string, boolean>>({
    c1: true,
    c2: true,
    c3: true,
  });

  // Modal dialog states
  const [showClusterModal, setShowClusterModal] = useState<boolean>(false);
  const [showFastTrackModal, setShowFastTrackModal] = useState<boolean>(false);

  // Active selected student
  const selectedStudent = useMemo(() => {
    return MOCK_STUDENTS.find((s) => s.id === selectedStudentId) || MOCK_STUDENTS[0];
  }, [selectedStudentId]);

  // Filtered students
  const filteredStudents = useMemo(() => {
    return MOCK_STUDENTS.filter((student) => {
      // Risk filter
      if (riskFilter !== "all" && student.riskTier !== riskFilter) {
        return false;
      }
      // School filter
      if (schoolFilter !== "all" && student.schoolKey !== schoolFilter) {
        return false;
      }
      // Class filter
      if (classFilter !== "all" && student.gradeKey !== classFilter) {
        return false;
      }
      // Gender filter
      if (genderFilter !== "all" && student.gender !== genderFilter) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName =
          student.name.en.toLowerCase().includes(query) ||
          student.name.gu.toLowerCase().includes(query) ||
          student.name.hi.toLowerCase().includes(query);
        const matchesCts = student.ctsId.toLowerCase().includes(query);
        const matchesSchool =
          student.school.en.toLowerCase().includes(query) ||
          student.school.gu.toLowerCase().includes(query);
        if (!matchesName && !matchesCts && !matchesSchool) {
          return false;
        }
      }
      return true;
    });
  }, [riskFilter, schoolFilter, classFilter, genderFilter, searchQuery]);

  const handleResetFilters = () => {
    setRiskFilter("all");
    setSchoolFilter("all");
    setClassFilter("all");
    setGenderFilter("all");
    setCauseFilter("all");
    setSearchQuery("");
  };

  const handleToggleSelectAll = (checked: boolean) => {
    const updated: Record<string, boolean> = {};
    if (checked) {
      filteredStudents.forEach((s) => {
        updated[s.id] = true;
      });
    }
    setSelectedIds(updated);
  };

  const handleToggleRow = (id: string) => {
    setSelectedIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleAction = (studentName: string, actionType: "counseling" | "alert" | "review" | "assign") => {
    if (actionType === "counseling") {
      setActionNotice({
        text: {
          gu: `${studentName} માટે વાલી અને વિદ્યાર્થી કાઉન્સિલિંગ ફ્લેગ નોંધાયેલ છે. ક્લસ્ટર નોડલ શિક્ષકને સૂચના મોકલાઈ.`,
          en: `Counseling flagged for ${studentName}. Notification sent to Cluster Nodal Teacher.`,
          hi: `${studentName} के लिए परामर्श चिह्नित किया गया। क्लस्टर नोडल शिक्षक को सूचना भेजी गई।`,
        },
        type: "info",
      });
    } else if (actionType === "alert") {
      setActionNotice({
        text: {
          gu: `${studentName} ની વિગતો સાથે વર્ગશિક્ષક અને આચાર્યને ત્વરિત એલર્ટ એસએમએસ રવાના થયો.`,
          en: `Immediate alert SMS dispatched to Class Teacher and Principal for ${studentName}.`,
          hi: `${studentName} के विवरण के साथ कक्षा शिक्षक और प्रधानाचार्य को त्वरित अलर्ट भेजा गया।`,
        },
        type: "warning",
      });
    } else if (actionType === "review") {
      setActionNotice({
        text: {
          gu: `${studentName} નો રેકોર્ડ ડીઇઓ મોનિટરિંગ સમીક્ષા કતારમાં અગ્રતા સાથે મૂકવામાં આવ્યો છે.`,
          en: `${studentName}'s profile queued for DEO Priority Scrutiny Review.`,
          hi: `${studentName} का रिकॉर्ड डीईओ प्राथमिकता समीक्षा कतार में रखा गया है।`,
        },
        type: "info",
      });
    } else {
      setActionNotice({
        text: {
          gu: `${studentName} માટે હસ્તક્ષેપ પેકેજ સફળતાપૂર્વક મંજૂર કરી આદેશ જારી કરાયો.`,
          en: `Intervention bundle approved and work order issued for ${studentName}.`,
          hi: `${studentName} के लिए हस्तक्षेप पैकेज सफलतापूर्वक स्वीकृत किया गया।`,
        },
        type: "success",
      });
    }
    setTimeout(() => {
      setActionNotice(null);
    }, 5000);
  };

  const handleExport = () => {
    setActionNotice({
      text: {
        gu: "આણંદ જિલ્લાના ૩૧૨ અતિ ગંભીર જોખમી વિદ્યાર્થીઓની સ્પ્રેડશીટ (.xlsx) ડાઉનલોડ થઈ રહી છે...",
        en: "Downloading At-Risk Students Registry (.xlsx) for Anand District...",
        hi: "आणंद जिले के 312 उच्च जोखिम छात्रों की स्प्रेडशीट (.xlsx) डाउनलोड हो रही है...",
      },
      type: "success",
    });
    setTimeout(() => setActionNotice(null), 4000);
  };

  const allSelected =
    filteredStudents.length > 0 &&
    filteredStudents.every((s) => selectedIds[s.id]);

  return (
    <OfficerShell role="deo">
      <div className="flex flex-col w-full min-h-screen bg-surface">
        {/* Top Breadcrumb & Executive Action Header */}
        <div className="w-full px-6 py-6 bg-surface-container-low/70 border-b border-outline-variant/60">
          <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex flex-col space-y-1.5">
              {/* Breadcrumb Hierarchy */}
              <div className="flex items-center gap-2 font-caption text-caption text-on-surface-variant flex-wrap">
                <Link href="/deo" className="hover:text-primary transition-colors">
                  <T gu="જિલ્લા કચેરી (District HQ)" en="District HQ (Anand)" hi="जिला मुख्यालय (आणंद)" />
                </Link>
                <Icon name="chevron_right" size={14} className="text-outline" />
                <span className="hover:text-primary transition-colors">
                  <T gu="શાળા મોનિટરિંગ અને ડ્રોપઆઉટ નિવારણ" en="School Monitoring & Dropout Prevention" hi="स्कूल निगरानी एवं ड्रॉपआउट रोकथाम" />
                </span>
                <Icon name="chevron_right" size={14} className="text-outline" />
                <span className="text-primary font-semibold">
                  <T gu="શાળા છોડવાના જોખમ હેઠળના વિદ્યાર્થીઓ" en="At-Risk Students Dropout Predictor" hi="ड्रॉपआउट जोखिम छात्र" />
                </span>
              </div>

              {/* Screen Title & Metadata Subtitle */}
              <h1 className="font-headline-md text-headline-md text-on-surface font-bold tracking-tight">
                <T
                  gu="શાળા છોડવાના જોખમ હેઠળના વિદ્યાર્થીઓ (ડ્રોપઆઉટ પ્રિડિક્ટર & વહેલી ચેતવણી)"
                  en="At-Risk Students (Dropout Risk Predictor & Early Warning System)"
                  hi="ड्रॉपआउट जोखिम छात्र (प्रारंभिक चेतावनी एवं प्रेडिक्टर)"
                />
              </h1>
              <p className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1 font-label-md text-label-md text-primary bg-primary-fixed/80 px-2 py-0.5 rounded-full font-bold">
                  <Icon name="psychology" size={14} />
                  <T gu="AI મોડલ v3.2" en="AI Model v3.2" hi="एआई मॉडल v3.2" />
                </span>
                <span>
                  <T
                    gu="AI પ્રિડિક્ટિવ એનાલિટિક્સ, હાજરી ડ્રોપ ટ્રેકિંગ અને કલ્યાણકારી યોજના હસ્તક્ષેપ (શૈક્ષણિક વર્ષ ૨૦૨૫-૨૬ - આણંદ જિલ્લો)"
                    en="AI Predictive Analytics, Attendance Drop Tracking & Welfare Scheme Intervention (Academic Year 2025-26 - Anand District)"
                    hi="एआई प्रेडिक्टिव एनालिटिक्स, उपस्थिति ड्रॉप ट्रैकिंग एवं कल्याणकारी योजना हस्तक्षेप (शैक्षणिक वर्ष 2025-26 - आणंद जिला)"
                  />
                </span>
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 shrink-0 flex-wrap">
              <button
                onClick={handleExport}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-surface-container-lowest text-on-surface border border-outline-variant font-label-lg text-label-lg shadow-sm hover:bg-surface-container-high transition-colors"
                type="button"
              >
                <Icon name="file_download" size={18} className="text-primary" />
                <span>
                  <T gu="જોખમી વિદ્યાર્થી યાદી (.xlsx)" en="Export At-Risk Registry (.xlsx)" hi="जोखिम छात्र सूची (.xlsx)" />
                </span>
              </button>
              <button
                onClick={() => setShowFastTrackModal(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-secondary text-on-secondary font-label-lg text-label-lg font-bold shadow-md hover:brightness-105 active:scale-95 transition-all"
                type="button"
              >
                <Icon name="bolt" size={18} />
                <span>
                  <T gu="સહાય યોજના અગ્રતા આદેશ" en="Trigger Fast-Track Intervention" hi="त्वरित हस्तक्षेप आदेश जारी करें" />
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Global Feedback Toast / Notice */}
        {actionNotice && (
          <div className="max-w-[1440px] mx-auto w-full px-6 pt-4">
            <div
              className={`p-4 rounded-xl flex items-center justify-between gap-3 shadow-md animate-fade-in ${
                actionNotice.type === "success"
                  ? "bg-success-container text-on-success-container border border-success/30"
                  : actionNotice.type === "warning"
                  ? "bg-warning-container text-on-warning-container border border-warning/30"
                  : "bg-info-container text-on-info-container border border-info/30"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon
                  name={
                    actionNotice.type === "success"
                      ? "check_circle"
                      : actionNotice.type === "warning"
                      ? "warning"
                      : "info"
                  }
                  size={20}
                  fill
                />
                <span className="font-label-lg text-label-lg font-semibold">
                  <T
                    gu={actionNotice.text.gu}
                    en={actionNotice.text.en}
                    hi={actionNotice.text.hi}
                  />
                </span>
              </div>
              <button
                onClick={() => setActionNotice(null)}
                className="p-1 rounded-full hover:bg-black/10 transition-colors"
                aria-label="Close"
              >
                <Icon name="close" size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Main Body Content Area */}
        <div className="w-full px-6 py-6 max-w-[1440px] mx-auto space-y-6">
          {/* KPI Cards Row (4 Metric Blocks matching HTML) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: High Risk */}
            <div className="p-5 rounded-xl bg-surface-container-lowest border border-outline-variant/60 shadow-sm flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <span className="font-label-md text-label-md text-on-surface-variant font-semibold">
                    <T gu="અતિ ગંભીર જોખમ (High Risk >70%)" en="High Risk (>70%)" hi="अति गंभीर जोखिम (>70%)" />
                  </span>
                  <div className="flex items-baseline gap-2 pt-1">
                    <span className="font-display text-display text-error font-extrabold leading-none">
                      <T gu="૩૧૨" en="312" hi="312" />
                    </span>
                    <span className="font-label-md text-label-md text-on-surface-variant">
                      <T gu="વિદ્યાર્થીઓ" en="Students" hi="छात्र" />
                    </span>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-lg bg-error-container flex items-center justify-center text-error">
                  <Icon name="warning" size={22} fill />
                </div>
              </div>
              <div className="mt-4 pt-3 flex items-center justify-between bg-error-container/30 -mx-5 -mb-5 px-5 py-2.5">
                <span className="font-caption text-caption text-error font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-error animate-ping"></span>
                  <T gu="ત્વરિત પગલાં જરૂરી" en="Immediate Action Needed" hi="त्वरित कार्रवाई आवश्यक" />
                </span>
                <span className="font-label-md text-label-md text-on-surface font-semibold">
                  <T gu="૭૮% કન્યા વિદ્યાર્થીઓ" en="78% Female Students" hi="78% छात्राएं" />
                </span>
              </div>
            </div>

            {/* Card 2: Medium Risk */}
            <div className="p-5 rounded-xl bg-surface-container-lowest border border-outline-variant/60 shadow-sm flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <span className="font-label-md text-label-md text-on-surface-variant font-semibold">
                    <T gu="મધ્યમ જોખમ (Medium Risk 40-70%)" en="Medium Risk (40-70%)" hi="मध्यम जोखिम (40-70%)" />
                  </span>
                  <div className="flex items-baseline gap-2 pt-1">
                    <span className="font-display text-display text-secondary font-extrabold leading-none">
                      <T gu="૧,૧૪૦" en="1,140" hi="1,140" />
                    </span>
                    <span className="font-label-md text-label-md text-on-surface-variant">
                      <T gu="વિદ્યાર્થીઓ" en="Students" hi="छात्र" />
                    </span>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-lg bg-secondary-fixed flex items-center justify-center text-secondary">
                  <Icon name="troubleshoot" size={22} />
                </div>
              </div>
              <div className="mt-4 pt-3 flex items-center justify-between bg-surface-container-high/60 -mx-5 -mb-5 px-5 py-2.5">
                <span className="font-caption text-caption text-on-surface-variant font-medium">
                  <T gu="સાપ્તાહિક હાજરી સ્ક્રુટિની" en="Weekly Attendance Scrutiny" hi="साप्ताहिक उपस्थिति जांच" />
                </span>
                <span className="font-label-md text-label-md text-secondary font-bold">
                  <T gu="મોનિટરિંગ હેઠળ" en="Under Monitoring" hi="निगरानी में" />
                </span>
              </div>
            </div>

            {/* Card 3: Interventions Completed */}
            <div className="p-5 rounded-xl bg-surface-container-lowest border border-outline-variant/60 shadow-sm flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <span className="font-label-md text-label-md text-on-surface-variant font-semibold">
                    <T gu="સફળ હસ્તક્ષેપ પૂર્ણ" en="Interventions Resolved" hi="सफल हस्तक्षेप पूर्ण" />
                  </span>
                  <div className="flex items-baseline gap-2 pt-1">
                    <span className="font-display text-display text-primary font-extrabold leading-none">
                      <T gu="૨૦૫" en="205" hi="205" />
                    </span>
                    <span className="font-label-md text-label-md text-on-surface-variant">
                      <T gu="વિદ્યાર્થીઓ" en="Students" hi="छात्र" />
                    </span>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-lg bg-surface-container-highest flex items-center justify-center text-primary">
                  <Icon name="check_circle" size={22} fill />
                </div>
              </div>
              <div className="mt-4 pt-3 flex items-center justify-between bg-surface-container-high/60 -mx-5 -mb-5 px-5 py-2.5">
                <span className="font-caption text-caption text-on-surface-variant">
                  <T gu="પુનઃ નિયમિત હાજરી દર" en="Resumed Regular Attendance" hi="पुनः नियमित उपस्थिति" />
                </span>
                <span className="font-label-md text-label-md text-primary font-bold">
                  <T gu="૬૪% સફળતા દર" en="64% Success Rate" hi="64% सफलता दर" />
                </span>
              </div>
            </div>

            {/* Card 4: Welfare Interventions Active */}
            <div className="p-5 rounded-xl bg-surface-container-lowest border border-outline-variant/60 shadow-sm flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <span className="font-label-md text-label-md text-on-surface-variant font-semibold">
                    <T gu="યોજનાકીય સહાય પ્રક્રિયા" en="Active Pipeline" hi="सक्रिय योजना पाइपलाइन" />
                  </span>
                  <div className="flex items-baseline gap-2 pt-1">
                    <span className="font-title-lg text-title-lg text-on-surface font-extrabold">
                      <T gu="₹ ૧૮.૪૦ લાખ" en="₹ 18.40 Lakh" hi="₹ 18.40 लाख" />
                    </span>
                    <span className="font-caption text-caption text-on-surface-variant">
                      <T gu="નમો લક્ષ્મી DBT" en="Namo Lakshmi DBT" hi="नमो लक्ष्मी डीबीटी" />
                    </span>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-tertiary">
                  <Icon name="pedal_bike" size={22} />
                </div>
              </div>
              <div className="mt-4 pt-3 flex items-center justify-between bg-surface-container-high/60 -mx-5 -mb-5 px-5 py-2.5">
                <span className="font-caption text-caption text-tertiary font-medium">
                  <T gu="સાયકલ ફાસ્ટ-ટ્રેક" en="Cycle Fast-Track" hi="साइकिल फास्ट-ट्रैक" />
                </span>
                <span className="font-label-md text-label-md bg-primary-container text-on-primary px-2 py-0.5 rounded-full font-bold">
                  <T gu="૧૪૨ ફાળવેલ" en="142 Allocated" hi="142 आवंटित" />
                </span>
              </div>
            </div>
          </div>

          {/* Quick Risk Level Summary Chips (User Prompt Requirement: High Risk 12, Medium Risk 34, Low Risk 67) */}
          <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/60 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Icon name="speed" size={20} className="text-primary" />
              <span className="font-label-lg text-label-lg font-bold text-on-surface">
                <T gu="જોખમ સ્તર ઝડપી ફિલ્ટર સમરી:" en="Risk Level Cohort Filters:" hi="जोखिम स्तर त्वरित फ़िल्टर:" />
              </span>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => setRiskFilter("all")}
                className={`px-3.5 py-1.5 rounded-lg font-label-md text-label-md font-semibold transition-all flex items-center gap-1.5 ${
                  riskFilter === "all"
                    ? "bg-primary text-on-primary shadow-sm"
                    : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high"
                }`}
              >
                <span><T gu="તમામ સમૂહ" en="All Students" hi="सभी छात्र" /></span>
                <span className="px-1.5 py-0.2 rounded-full text-xs font-bold bg-white/20">113</span>
              </button>
              <button
                onClick={() => setRiskFilter("high")}
                className={`px-3.5 py-1.5 rounded-lg font-label-md text-label-md font-semibold transition-all flex items-center gap-1.5 ${
                  riskFilter === "high"
                    ? "bg-error text-on-error shadow-sm"
                    : "bg-error-container text-on-error-container hover:bg-error/20"
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-error" />
                <span><T gu="ઉચ્ચ જોખમ" en="High Risk" hi="उच्च जोखिम" /></span>
                <span className="px-1.5 py-0.2 rounded-full text-xs font-bold bg-error/20 text-on-error-container">12</span>
              </button>
              <button
                onClick={() => setRiskFilter("medium")}
                className={`px-3.5 py-1.5 rounded-lg font-label-md text-label-md font-semibold transition-all flex items-center gap-1.5 ${
                  riskFilter === "medium"
                    ? "bg-secondary text-on-secondary shadow-sm"
                    : "bg-secondary-fixed text-on-secondary-fixed hover:bg-secondary-fixed-dim"
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-secondary" />
                <span><T gu="મધ્યમ જોખમ" en="Medium Risk" hi="मध्यम जोखिम" /></span>
                <span className="px-1.5 py-0.2 rounded-full text-xs font-bold bg-secondary/20 text-on-secondary-fixed">34</span>
              </button>
              <button
                onClick={() => setRiskFilter("low")}
                className={`px-3.5 py-1.5 rounded-lg font-label-md text-label-md font-semibold transition-all flex items-center gap-1.5 ${
                  riskFilter === "low"
                    ? "bg-success text-on-success shadow-sm"
                    : "bg-success-container text-on-success-container hover:bg-success/20"
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-success" />
                <span><T gu="ઓછું જોખમ" en="Low Risk" hi="कम जोखिम" /></span>
                <span className="px-1.5 py-0.2 rounded-full text-xs font-bold bg-success/20 text-on-success-container">67</span>
              </button>
            </div>
          </div>

          {/* Bar Chart / Risk Distribution Visualization (Requirement: div-based bar chart or Recharts BarChart) */}
          <div className="p-5 rounded-xl bg-surface-container-lowest border border-outline-variant/60 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-outline-variant/40 gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-primary-fixed flex items-center justify-center text-primary">
                  <Icon name="bar_chart" size={22} />
                </div>
                <div>
                  <h3 className="font-title-md text-title-md text-on-surface font-bold">
                    <T gu="ડ્રોપઆઉટ જોખમ વિતરણ વિશ્લેષણ" en="Dropout Risk Distribution Analytics" hi="ड्रॉपआउट जोखिम वितरण विश्लेषण" />
                  </h3>
                  <p className="font-caption text-caption text-on-surface-variant">
                    <T
                      gu="જિલ્લા કક્ષાએ જોખમી પરિબળો અને વિદ્યાર્થી પ્રમાણનું તુલનાત્મક આલેખન"
                      en="District-wide comparative breakdown of risk levels, root causes, and standard distributions"
                      hi="जिला स्तर पर जोखिम कारकों एवं छात्र अनुपात का तुलनात्मक आलेखन"
                    />
                  </p>
                </div>
              </div>

              {/* Chart tabs */}
              <div className="flex items-center bg-surface-container-low p-1 rounded-lg">
                <button
                  onClick={() => setChartTab("tier")}
                  className={`px-3 py-1 rounded-md font-label-md text-label-md transition-all ${
                    chartTab === "tier" ? "bg-surface-container-lowest text-primary font-bold shadow-sm" : "text-on-surface-variant"
                  }`}
                >
                  <T gu="જોખમ સ્તર (Risk Tiers)" en="Risk Tiers" hi="जोखिम स्तर" />
                </button>
                <button
                  onClick={() => setChartTab("cause")}
                  className={`px-3 py-1 rounded-md font-label-md text-label-md transition-all ${
                    chartTab === "cause" ? "bg-surface-container-lowest text-primary font-bold shadow-sm" : "text-on-surface-variant"
                  }`}
                >
                  <T gu="મુખ્ય પરિબળો (Root Causes)" en="Root Causes" hi="मूल कारण" />
                </button>
                <button
                  onClick={() => setChartTab("class")}
                  className={`px-3 py-1 rounded-md font-label-md text-label-md transition-all ${
                    chartTab === "class" ? "bg-surface-container-lowest text-primary font-bold shadow-sm" : "text-on-surface-variant"
                  }`}
                >
                  <T gu="ધોરણ વાઇઝ (By Grade)" en="By Grade" hi="कक्षा अनुसार" />
                </button>
              </div>
            </div>

            {/* Interactive Div-Based Bar Chart */}
            {chartTab === "tier" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-error-container/20 border border-error/20 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-label-lg text-label-lg font-bold text-error flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-error" />
                        <T gu="ઉચ્ચ જોખમ (>૭૦%)" en="High Risk (>70%)" hi="उच्च जोखिम (>70%)" />
                      </span>
                      <span className="font-headline-sm text-headline-sm font-extrabold text-error">12</span>
                    </div>
                    <p className="font-caption text-caption text-on-surface-variant mt-1">
                      <T gu="૧૧% કુલ સમૂહ પૈકી • ત્વરિત પગલાં આવશ્યક" en="11% of cohort • Immediate intervention" hi="11% कुल छात्र • तत्काल कार्रवाई" />
                    </p>
                  </div>
                  <div className="mt-4">
                    <div className="w-full h-3 rounded-full bg-error-container overflow-hidden">
                      <div className="h-full bg-error rounded-full" style={{ width: "11%" }} />
                    </div>
                    <div className="flex justify-between text-xs text-on-surface-variant mt-1">
                      <span>0</span>
                      <span>12 / 113</span>
                      <span>100%</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-secondary-fixed/30 border border-secondary/20 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-label-lg text-label-lg font-bold text-secondary flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-secondary" />
                        <T gu="મધ્યમ જોખમ (૪૦-૭૦%)" en="Medium Risk (40-70%)" hi="मध्यम जोखिम (40-70%)" />
                      </span>
                      <span className="font-headline-sm text-headline-sm font-extrabold text-secondary">34</span>
                    </div>
                    <p className="font-caption text-caption text-on-surface-variant mt-1">
                      <T gu="૩૦% કુલ સમૂહ પૈકી • સાપ્તાહિક મોનિટરિંગ" en="30% of cohort • Weekly monitoring" hi="30% कुल छात्र • साप्ताहिक निगरानी" />
                    </p>
                  </div>
                  <div className="mt-4">
                    <div className="w-full h-3 rounded-full bg-secondary-fixed overflow-hidden">
                      <div className="h-full bg-secondary rounded-full" style={{ width: "30%" }} />
                    </div>
                    <div className="flex justify-between text-xs text-on-surface-variant mt-1">
                      <span>0</span>
                      <span>34 / 113</span>
                      <span>100%</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-success-container/30 border border-success/20 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-label-lg text-label-lg font-bold text-success flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-success" />
                        <T gu="ઓછું જોખમ (<૪૦%)" en="Low Risk (<40%)" hi="कम जोखिम (<40%)" />
                      </span>
                      <span className="font-headline-sm text-headline-sm font-extrabold text-success">67</span>
                    </div>
                    <p className="font-caption text-caption text-on-surface-variant mt-1">
                      <T gu="૫૯% કુલ સમૂહ પૈકી • સામાન્ય દેખરેખ" en="59% of cohort • Routine observation" hi="59% कुल छात्र • सामान्य अवलोकन" />
                    </p>
                  </div>
                  <div className="mt-4">
                    <div className="w-full h-3 rounded-full bg-success-container overflow-hidden">
                      <div className="h-full bg-success rounded-full" style={{ width: "59%" }} />
                    </div>
                    <div className="flex justify-between text-xs text-on-surface-variant mt-1">
                      <span>0</span>
                      <span>67 / 113</span>
                      <span>100%</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {chartTab === "cause" && (
              <div className="space-y-3 pt-2">
                <div className="space-y-1">
                  <div className="flex items-center justify-between font-label-md text-label-md">
                    <span className="font-medium text-on-surface flex items-center gap-2">
                      <Icon name="schedule" size={16} className="text-error" />
                      <T gu="હાજરી તીવ્ર ઘટાડો (<૬૦% ઉપસ્થિતિ)" en="Severe Attendance Drop (<60%)" hi="उपस्थिति में तीव्र गिरावट (<60%)" />
                    </span>
                    <span className="font-bold text-error">48 <T gu="વિદ્યાર્થીઓ" en="Students" hi="छात्र" /> (42%)</span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-surface-container-high overflow-hidden">
                    <div className="h-full bg-error rounded-full transition-all duration-500" style={{ width: "42%" }} />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between font-label-md text-label-md">
                    <span className="font-medium text-on-surface flex items-center gap-2">
                      <Icon name="near_me" size={16} className="text-secondary" />
                      <T gu="૫+ કિમી અંતર અને સાયકલ વિલંબ" en="5+ km Commute & Cycle Delay" hi="5+ किमी दूरी एवं साइकिल में देरी" />
                    </span>
                    <span className="font-bold text-secondary">35 <T gu="વિદ્યાર્થીઓ" en="Students" hi="छात्र" /> (31%)</span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-surface-container-high overflow-hidden">
                    <div className="h-full bg-secondary rounded-full transition-all duration-500" style={{ width: "31%" }} />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between font-label-md text-label-md">
                    <span className="font-medium text-on-surface flex items-center gap-2">
                      <Icon name="assignment_late" size={16} className="text-primary" />
                      <T gu="૨+ વિષયોમાં ઓછા ગુણ (<૩૫%)" en="Academic Struggle (Failed 2+ Subjects)" hi="2+ विषयों में कम अंक (<35%)" />
                    </span>
                    <span className="font-bold text-primary">21 <T gu="વિદ્યાર્થીઓ" en="Students" hi="छात्र" /> (19%)</span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-surface-container-high overflow-hidden">
                    <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: "19%" }} />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between font-label-md text-label-md">
                    <span className="font-medium text-on-surface flex items-center gap-2">
                      <Icon name="credit_card_off" size={16} className="text-tertiary" />
                      <T gu="નમો લક્ષ્મી DBT / બેંક KYC અટકેલ" en="Scholarship DBT / Bank KYC Lapsed" hi="छात्रवृत्ति डीबीटी / बैंक केवाईसी अटका" />
                    </span>
                    <span className="font-bold text-tertiary">9 <T gu="વિદ્યાર્થીઓ" en="Students" hi="छात्र" /> (8%)</span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-surface-container-high overflow-hidden">
                    <div className="h-full bg-tertiary rounded-full transition-all duration-500" style={{ width: "8%" }} />
                  </div>
                </div>
              </div>
            )}

            {chartTab === "class" && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
                <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/60 text-center">
                  <span className="font-label-md text-label-md text-on-surface-variant font-medium">
                    <T gu="ધોરણ ૯ (Class IX)" en="Class 9 (IX)" hi="कक्षा 9" />
                  </span>
                  <div className="text-headline-sm font-bold text-error mt-1">51 (45%)</div>
                  <div className="w-full h-1.5 rounded-full bg-surface-container-high mt-2 overflow-hidden">
                    <div className="h-full bg-error rounded-full" style={{ width: "45%" }} />
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/60 text-center">
                  <span className="font-label-md text-label-md text-on-surface-variant font-medium">
                    <T gu="ધોરણ ૧૦ (Class X)" en="Class 10 (X)" hi="कक्षा 10" />
                  </span>
                  <div className="text-headline-sm font-bold text-secondary mt-1">32 (28%)</div>
                  <div className="w-full h-1.5 rounded-full bg-surface-container-high mt-2 overflow-hidden">
                    <div className="h-full bg-secondary rounded-full" style={{ width: "28%" }} />
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/60 text-center">
                  <span className="font-label-md text-label-md text-on-surface-variant font-medium">
                    <T gu="ધોરણ ૧૧ (Class XI)" en="Class 11 (XI)" hi="कक्षा 11" />
                  </span>
                  <div className="text-headline-sm font-bold text-primary mt-1">19 (17%)</div>
                  <div className="w-full h-1.5 rounded-full bg-surface-container-high mt-2 overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: "17%" }} />
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/60 text-center">
                  <span className="font-label-md text-label-md text-on-surface-variant font-medium">
                    <T gu="ધોરણ ૧૨ (Class XII)" en="Class 12 (XII)" hi="कक्षा 12" />
                  </span>
                  <div className="text-headline-sm font-bold text-success mt-1">11 (10%)</div>
                  <div className="w-full h-1.5 rounded-full bg-surface-container-high mt-2 overflow-hidden">
                    <div className="h-full bg-success rounded-full" style={{ width: "10%" }} />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Alert / Mission Guidance Banner matching HTML */}
          <div className="w-full p-4 rounded-xl bg-secondary-fixed/50 border border-secondary/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-full bg-secondary text-on-secondary flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                <Icon name="notifications_active" size={22} />
              </div>
              <div className="space-y-1">
                <h2 className="font-title-md text-title-md text-on-secondary-fixed font-bold flex items-center gap-2">
                  <T
                    gu="તાકીદની જિલ્લા કક્ષાની ભલામણ (પ્રાયોરિટી એલર્ટ - હાઇ ક્લસ્ટર ઝોન)"
                    en="Priority Alert - High Cluster Zone Recommendation"
                    hi="प्राथमिकता अलर्ट - उच्च क्लस्टर जोन सिफारिश"
                  />
                </h2>
                <p className="font-body-sm text-body-sm text-on-surface leading-relaxed max-w-5xl">
                  <T
                    gu="ખંભાત અને તારાપુર તાલુકાના ૮૪ વિદ્યાર્થીઓમાં ૫+ કિમી શાળા અંતર અને સાયકલની ગેરહાજરીના કારણે હાજરી ૬૦% થી નીચે ગઈ છે. સરસ્વતી સાધના સાયકલ યોજના હેઠળ તાત્કાલિક સાયકલ ફાળવણી અને નમો લક્ષ્મી યોજના આધાર-સીડિંગ અનબ્લોક કરવાની તાતી જરૂરિયાત છે."
                    en="In Khambhat and Tarapur talukas, 84 students have attendance dropping below 60% due to >5 km commute distance and delayed bicycles. Fast-tracking Saraswati Sadhana bicycle orders and resolving Namo Lakshmi DBT Aadhaar-seeding is urgently recommended."
                    hi="खंभात और तारापुर तालुका के 84 छात्रों में 5+ किमी स्कूल दूरी और साइकिल न होने से उपस्थिति 60% से नीचे है। त्वरित साइकिल आवंटन एवं डीबीटी आधार सीडिंग अनिवार्य है।"
                  />
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
              <button
                onClick={() => setShowClusterModal(true)}
                className="px-4 py-2 rounded-lg bg-secondary text-on-secondary font-label-md text-label-md font-bold hover:brightness-110 shadow-sm transition-all flex items-center gap-1.5"
                type="button"
              >
                <Icon name="send" size={16} />
                <span>
                  <T gu="ક્લસ્ટર એકશન આદેશ" en="Issue Cluster Action Order" hi="क्लस्टर कार्रवाई आदेश जारी करें" />
                </span>
              </button>
            </div>
          </div>

          {/* Filter Control Bar matching HTML */}
          <div className="w-full p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/60 shadow-sm space-y-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-2 border-b border-outline-variant/40 gap-3">
              <div className="flex items-center gap-2">
                <Icon name="filter_alt" size={20} className="text-primary" />
                <span className="font-title-md text-title-md text-on-surface font-bold">
                  <T gu="ડ્રોપઆઉટ ફિલ્ટર્સ અને માપદંડ" en="Targeted Dropout Risk Cohort Filters" hi="ड्रॉपआउट फ़िल्टर एवं लक्षित समूह" />
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleResetFilters}
                  className="px-3.5 py-1.5 rounded-lg bg-surface-container-high text-on-surface-variant font-label-md text-label-md hover:bg-surface-container-highest transition-colors flex items-center gap-1"
                  type="button"
                >
                  <Icon name="restart_alt" size={16} />
                  <span><T gu="રીસેટ" en="Reset" hi="रीसेट" /></span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {/* Filter 1: Taluka */}
              <div className="flex flex-col space-y-1">
                <label className="font-label-md text-label-md text-on-surface-variant font-medium">
                  <T gu="તાલુકો (Taluka)" en="Taluka" hi="तालुका" />
                </label>
                <div className="relative">
                  <select
                    value={schoolFilter}
                    onChange={(e) => setSchoolFilter(e.target.value)}
                    className="w-full h-10 px-3 pr-8 rounded-lg bg-surface-container-low text-on-surface font-body-sm text-body-sm focus:outline-none focus:ring-1 focus:ring-primary appearance-none cursor-pointer"
                  >
                    <option value="all">તમામ તાલુકા (All Anand)</option>
                    <option value="vinay_mandir">ખંભાત (Khambhat)</option>
                    <option value="janata_vidyalaya">તારાપુર (Tarapur)</option>
                    <option value="sarvajanik_high">આંકલાવ (Anklav)</option>
                    <option value="model_school">ઉમરેઠ (Umreth)</option>
                    <option value="vallabh_vidyalaya">બોરસદ (Borsad)</option>
                  </select>
                  <span className="absolute right-2.5 top-2.5 text-outline pointer-events-none">
                    <Icon name="expand_more" size={18} />
                  </span>
                </div>
              </div>

              {/* Filter 2: School */}
              <div className="flex flex-col space-y-1">
                <label className="font-label-md text-label-md text-on-surface-variant font-medium">
                  <T gu="શાળા (School)" en="School" hi="स्कूल" />
                </label>
                <div className="relative">
                  <select
                    value={schoolFilter}
                    onChange={(e) => setSchoolFilter(e.target.value)}
                    className="w-full h-10 px-3 pr-8 rounded-lg bg-surface-container-low text-on-surface font-body-sm text-body-sm focus:outline-none focus:ring-1 focus:ring-primary appearance-none cursor-pointer"
                  >
                    <option value="all">તમામ શાળાઓ (All Schools)</option>
                    <option value="vinay_mandir">વિનય મંદિર હાઈસ્કૂલ</option>
                    <option value="janata_vidyalaya">જનતા વિદ્યાલય</option>
                    <option value="sarvajanik_high">સાર્વજનિક હાઈસ્કૂલ</option>
                    <option value="model_school">મોડેલ સ્કૂલ</option>
                    <option value="vallabh_vidyalaya">શ્રી વલ્લભ વિદ્યાલય</option>
                  </select>
                  <span className="absolute right-2.5 top-2.5 text-outline pointer-events-none">
                    <Icon name="expand_more" size={18} />
                  </span>
                </div>
              </div>

              {/* Filter 3: Grade / Class */}
              <div className="flex flex-col space-y-1">
                <label className="font-label-md text-label-md text-on-surface-variant font-medium">
                  <T gu="ધોરણ (Standard)" en="Class / Grade" hi="कक्षा" />
                </label>
                <div className="relative">
                  <select
                    value={classFilter}
                    onChange={(e) => setClassFilter(e.target.value)}
                    className="w-full h-10 px-3 pr-8 rounded-lg bg-surface-container-low text-on-surface font-body-sm text-body-sm focus:outline-none focus:ring-1 focus:ring-primary appearance-none cursor-pointer"
                  >
                    <option value="all">તમામ ધોરણ (All Classes)</option>
                    <option value="class_9">ધોરણ ૯ (Class IX)</option>
                    <option value="class_10">ધોરણ ૧૦ (Class X)</option>
                    <option value="class_11">ધોરણ ૧૧ (Class XI)</option>
                    <option value="class_12">ધોરણ ૧૨ (Class XII)</option>
                  </select>
                  <span className="absolute right-2.5 top-2.5 text-outline pointer-events-none">
                    <Icon name="expand_more" size={18} />
                  </span>
                </div>
              </div>

              {/* Filter 4: Gender */}
              <div className="flex flex-col space-y-1">
                <label className="font-label-md text-label-md text-on-surface-variant font-medium">
                  <T gu="જાતિ / લિંગ (Gender)" en="Gender" hi="लिंग" />
                </label>
                <div className="relative">
                  <select
                    value={genderFilter}
                    onChange={(e) => setGenderFilter(e.target.value)}
                    className="w-full h-10 px-3 pr-8 rounded-lg bg-surface-container-low text-on-surface font-body-sm text-body-sm focus:outline-none focus:ring-1 focus:ring-primary appearance-none cursor-pointer"
                  >
                    <option value="all">તમામ (All)</option>
                    <option value="female">કન્યા વિદ્યાર્થીઓ (Female Only)</option>
                    <option value="male">કુમાર વિદ્યાર્થીઓ (Male Only)</option>
                  </select>
                  <span className="absolute right-2.5 top-2.5 text-outline pointer-events-none">
                    <Icon name="expand_more" size={18} />
                  </span>
                </div>
              </div>

              {/* Filter 5: Risk Level */}
              <div className="flex flex-col space-y-1">
                <label className="font-label-md text-label-md text-on-surface-variant font-medium">
                  <T gu="જોખમ શ્રેણી (Risk Score)" en="Risk Level" hi="जोखिम श्रेणी" />
                </label>
                <div className="relative">
                  <select
                    value={riskFilter}
                    onChange={(e) => setRiskFilter(e.target.value)}
                    className="w-full h-10 px-3 pr-8 rounded-lg bg-surface-container-low text-on-surface font-body-sm text-body-sm focus:outline-none focus:ring-1 focus:ring-primary appearance-none cursor-pointer font-bold"
                  >
                    <option value="all">તમામ સ્કોર (All Scores)</option>
                    <option value="high" className="text-error font-bold">High Risk (&gt;૭૦%)</option>
                    <option value="medium" className="text-secondary font-bold">Medium Risk (૪૦-૭૦%)</option>
                    <option value="low" className="text-success font-bold">Low Risk (&lt;૪૦%)</option>
                  </select>
                  <span className="absolute right-2.5 top-2.5 text-outline pointer-events-none">
                    <Icon name="expand_more" size={18} />
                  </span>
                </div>
              </div>

              {/* Filter 6: Search by Name/CTS ID */}
              <div className="flex flex-col space-y-1">
                <label className="font-label-md text-label-md text-on-surface-variant font-medium">
                  <T gu="શોધો (Search CTS / Name)" en="Search CTS / Name" hi="खोजें" />
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search name or CTS..."
                    className="w-full h-10 pl-8 pr-3 rounded-lg bg-surface-container-low text-on-surface font-body-sm text-body-sm placeholder:text-outline focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  <span className="absolute left-2.5 top-2.5 text-outline pointer-events-none">
                    <Icon name="search" size={16} />
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Two-Column Main Interactive Workspace matching HTML layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* LEFT COLUMN: High-Risk Students Table (8 cols) */}
            <div className="lg:col-span-8 flex flex-col space-y-4">
              <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/60 shadow-sm overflow-hidden flex flex-col">
                {/* Table Section Action Header */}
                <div className="px-5 py-4 bg-surface-container-low flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-outline-variant/50">
                  <div className="flex items-center gap-2.5">
                    <span className="w-3 h-3 rounded-full bg-error animate-pulse"></span>
                    <span className="font-title-md text-title-md text-on-surface font-bold">
                      <T
                        gu="અગ્રતા યાદી: તાત્કાલિક હસ્તક્ષેપ પાત્ર વિદ્યાર્થીઓ"
                        en="Priority Roster: Actionable At-Risk Students"
                        hi="प्राथमिकता सूची: तत्काल हस्तक्षेप योग्य छात्र"
                      />
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-error-container text-on-error-container font-label-md text-label-md font-bold">
                      {filteredStudents.length} <T gu="કેસો" en="cases" hi="मामले" />
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowFastTrackModal(true)}
                      className="px-3 py-1.5 rounded-lg bg-surface-container-highest text-primary font-label-md text-label-md font-semibold hover:bg-primary hover:text-on-primary transition-all flex items-center gap-1.5"
                      type="button"
                    >
                      <Icon name="select_all" size={16} />
                      <span>
                        <T gu="સામૂહિક આદેશ (Batch Order)" en="Batch Order" hi="सामूहिक आदेश" />
                      </span>
                    </button>
                  </div>
                </div>

                {/* Table Wrapper */}
                <div className="w-full overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-surface-container font-label-md text-label-md text-on-surface-variant uppercase tracking-wider border-b border-outline-variant/50">
                        <th className="py-3 px-3 w-10 text-center">
                          <input
                            type="checkbox"
                            checked={allSelected}
                            onChange={(e) => handleToggleSelectAll(e.target.checked)}
                            className="w-4 h-4 rounded text-primary focus:ring-0 cursor-pointer"
                            aria-label="Select all"
                          />
                        </th>
                        <th className="py-3 px-3 min-w-[170px]">
                          <T gu="વિદ્યાર્થી અને CTS ID" en="Student & CTS ID" hi="छात्र और CTS ID" />
                        </th>
                        <th className="py-3 px-3 min-w-[150px]">
                          <T gu="શાળા અને વર્ગ" en="School & Class" hi="स्कूल और कक्षा" />
                        </th>
                        <th className="py-3 px-3 min-w-[120px]">
                          <T gu="જોખમ સ્કોર" en="Risk Score" hi="जोखिम स्कोर" />
                        </th>
                        <th className="py-3 px-3 min-w-[190px]">
                          <T gu="પ્રાથમિક પરિબળો" en="Risk Factors" hi="प्राथमिक कारक" />
                        </th>
                        <th className="py-3 px-3 min-w-[150px]">
                          <T gu="ભલામણ કરેલ હસ્તક્ષેપ" en="Recommended Action" hi="अनुशंसित कार्रवाई" />
                        </th>
                        <th className="py-3 px-3 text-right min-w-[180px]">
                          <T gu="કાર્યવાહી" en="Intervention Actions" hi="कार्रवाई" />
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant/40 font-body-sm text-body-sm text-on-surface">
                      {filteredStudents.map((student) => {
                        const isSelected = selectedStudentId === student.id;
                        return (
                          <tr
                            key={student.id}
                            onClick={() => setSelectedStudentId(student.id)}
                            className={`transition-colors cursor-pointer group ${
                              isSelected
                                ? "bg-primary-fixed/40 hover:bg-primary-fixed/50"
                                : "hover:bg-surface-container-low"
                            }`}
                          >
                            <td
                              className="py-3.5 px-3 text-center"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <input
                                type="checkbox"
                                checked={!!selectedIds[student.id]}
                                onChange={() => handleToggleRow(student.id)}
                                className="w-4 h-4 text-primary focus:ring-0 cursor-pointer rounded"
                              />
                            </td>

                            <td className="py-3.5 px-3">
                              <div className="flex items-center gap-2.5">
                                <Avatar
                                  name={student.name.en}
                                  size="sm"
                                  className={
                                    student.gender === "female"
                                      ? "bg-secondary text-on-secondary"
                                      : "bg-primary text-on-primary"
                                  }
                                />
                                <div className="flex flex-col min-w-0">
                                  <span
                                    className={`font-label-lg text-label-lg font-bold truncate flex items-center gap-1 ${
                                      isSelected ? "text-primary" : "text-on-surface"
                                    }`}
                                  >
                                    <T
                                      gu={student.name.gu}
                                      en={student.name.en}
                                      hi={student.name.hi}
                                    />
                                    {student.gender === "female" && (
                                      <Icon name="stars" size={16} className="text-secondary shrink-0" fill />
                                    )}
                                  </span>
                                  <span className="font-caption text-caption text-on-surface-variant font-mono">
                                    {student.ctsId}
                                  </span>
                                </div>
                              </div>
                            </td>

                            <td className="py-3.5 px-3">
                              <div className="flex flex-col">
                                <span className="font-label-md text-label-md text-on-surface font-medium truncate">
                                  <T
                                    gu={student.school.gu}
                                    en={student.school.en}
                                    hi={student.school.hi}
                                  />
                                </span>
                                <span className="font-caption text-caption text-on-surface-variant">
                                  <T gu={student.grade.gu} en={student.grade.en} hi={student.grade.hi} />
                                  {" | "}
                                  <T gu={student.taluka.gu} en={student.taluka.en} hi={student.taluka.hi} />
                                </span>
                              </div>
                            </td>

                            <td className="py-3.5 px-3">
                              <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-1.5">
                                  <span
                                    className={`px-2 py-0.5 rounded-full font-label-md text-label-md font-bold text-center ${
                                      student.riskTier === "high"
                                        ? "bg-error text-on-error"
                                        : student.riskTier === "medium"
                                        ? "bg-secondary-fixed text-on-secondary-fixed"
                                        : "bg-success-container text-on-success-container"
                                    }`}
                                  >
                                    {student.riskScore}%
                                  </span>
                                  <Icon
                                    name={
                                      student.riskTier === "high"
                                        ? "trending_up"
                                        : student.riskTier === "medium"
                                        ? "horizontal_rule"
                                        : "trending_down"
                                    }
                                    size={16}
                                    className={
                                      student.riskTier === "high"
                                        ? "text-error"
                                        : student.riskTier === "medium"
                                        ? "text-secondary"
                                        : "text-success"
                                    }
                                  />
                                </div>
                                <div className="w-16 h-1.5 rounded-full bg-surface-container-high overflow-hidden">
                                  <div
                                    className={`h-full rounded-full ${
                                      student.riskTier === "high"
                                        ? "bg-error"
                                        : student.riskTier === "medium"
                                        ? "bg-secondary"
                                        : "bg-success"
                                    }`}
                                    style={{ width: `${student.riskScore}%` }}
                                  />
                                </div>
                              </div>
                            </td>

                            {/* Risk Factor Pills */}
                            <td className="py-3.5 px-3">
                              <div className="flex flex-wrap gap-1 max-w-[220px]">
                                {student.factors.map((factor, idx) => (
                                  <span
                                    key={idx}
                                    className={`px-1.5 py-0.5 rounded font-caption text-caption font-semibold flex items-center gap-1 ${
                                      factor.type === "error"
                                        ? "bg-error-container text-on-error-container"
                                        : factor.type === "secondary"
                                        ? "bg-secondary-fixed text-on-secondary-fixed"
                                        : factor.type === "warning"
                                        ? "bg-warning-container text-on-warning-container"
                                        : "bg-surface-container-highest text-on-surface"
                                    }`}
                                  >
                                    <Icon name={factor.icon} size={12} />
                                    <T
                                      gu={factor.label.gu}
                                      en={factor.label.en}
                                      hi={factor.label.hi}
                                    />
                                  </span>
                                ))}
                              </div>
                            </td>

                            <td className="py-3.5 px-3">
                              <div className="flex flex-col">
                                <span className="font-label-md text-label-md text-on-surface font-semibold">
                                  <T
                                    gu={student.recommendedIntervention.title.gu}
                                    en={student.recommendedIntervention.title.en}
                                    hi={student.recommendedIntervention.title.hi}
                                  />
                                </span>
                                <span className="font-caption text-caption text-on-surface-variant">
                                  <T
                                    gu={student.recommendedIntervention.sub.gu}
                                    en={student.recommendedIntervention.sub.en}
                                    hi={student.recommendedIntervention.sub.hi}
                                  />
                                </span>
                              </div>
                            </td>

                            {/* Interactive Intervention Actions per student */}
                            <td
                              className="py-3.5 px-3 text-right"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <div className="flex items-center justify-end gap-1.5 flex-wrap">
                                <button
                                  onClick={() => handleAction(student.name.en, "counseling")}
                                  title="Flag for Counseling"
                                  className="p-1.5 rounded-lg bg-surface-container hover:bg-secondary-fixed text-secondary transition-colors"
                                  type="button"
                                >
                                  <Icon name="support_agent" size={16} />
                                </button>
                                <button
                                  onClick={() => handleAction(student.name.en, "alert")}
                                  title="Alert Teacher"
                                  className="p-1.5 rounded-lg bg-surface-container hover:bg-error-container text-error transition-colors"
                                  type="button"
                                >
                                  <Icon name="notification_important" size={16} />
                                </button>
                                <button
                                  onClick={() => handleAction(student.name.en, "review")}
                                  title="Review"
                                  className="p-1.5 rounded-lg bg-surface-container hover:bg-primary-fixed text-primary transition-colors"
                                  type="button"
                                >
                                  <Icon name="visibility" size={16} />
                                </button>
                                <button
                                  onClick={() => handleAction(student.name.en, "assign")}
                                  className="px-2.5 py-1.5 rounded-lg bg-secondary text-on-secondary font-label-md text-label-md font-bold shadow-sm hover:brightness-110 active:scale-95 transition-all flex items-center gap-1"
                                  type="button"
                                >
                                  <span><T gu="સોંપો" en="Assign" hi="सौंपें" /></span>
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Table Pagination Footer matching HTML */}
                <div className="px-5 py-3.5 bg-surface-container-lowest border-t border-outline-variant/40 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="font-body-sm text-body-sm text-on-surface-variant">
                    <T gu="દર્શાવેલ: " en="Showing: " hi="दिखाया गया: " />
                    <span className="font-bold text-on-surface">૧ થી {filteredStudents.length}</span>
                    <T gu=" પૈકી કુલ " en=" of " hi=" में से कुल " />
                    <span className="font-bold text-error">૩૧૨</span>
                    <T
                      gu=" ગંભીર જોખમી વિદ્યાર્થીઓ"
                      en=" high-risk students (Targeted Cohort)"
                      hi=" उच्च जोखिम छात्र"
                    />
                  </div>
                  <div className="flex items-center gap-1 font-label-md text-label-md">
                    <button
                      className="p-1.5 rounded-lg bg-surface-container text-outline hover:bg-surface-container-high transition-colors"
                      disabled
                      type="button"
                    >
                      <Icon name="chevron_left" size={18} />
                    </button>
                    <button className="w-8 h-8 rounded-lg bg-primary text-on-primary font-bold" type="button">
                      ૧
                    </button>
                    <button className="w-8 h-8 rounded-lg text-on-surface hover:bg-surface-container transition-colors" type="button">
                      ૨
                    </button>
                    <button className="w-8 h-8 rounded-lg text-on-surface hover:bg-surface-container transition-colors" type="button">
                      ૩
                    </button>
                    <span className="px-1 text-outline">...</span>
                    <button className="w-8 h-8 rounded-lg text-on-surface hover:bg-surface-container transition-colors" type="button">
                      ૬૩
                    </button>
                    <button className="p-1.5 rounded-lg bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors" type="button">
                      <Icon name="chevron_right" size={18} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Geographic & Cluster Context Mini Card matching HTML */}
              <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/60 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-surface-container-highest flex items-center justify-center text-primary shrink-0">
                    <Icon name="map" size={20} />
                  </div>
                  <div>
                    <p className="font-label-lg text-label-lg font-bold text-on-surface">
                      <T
                        gu="ભૌગોલિક ક્લસ્ટર વિશ્લેષણ: ખંભાત દરિયાકાંઠા પટ્ટો"
                        en="Geographic Cluster Insight: Khambhat Coastal Belt"
                        hi="भौगोलिक क्लस्टर विश्लेषण: खंभात तटीय क्षेत्र"
                      />
                    </p>
                    <p className="font-caption text-caption text-on-surface-variant">
                      <T
                        gu="ખંભાત અને તારાપુર ગ્રામ્ય વિસ્તારમાં વાહનવ્યવહારના અભાવે કન્યા વિદ્યાર્થીઓમાં ડ્રોપઆઉટ સંભાવના ૭૩% વધુ નોંધાયેલ છે."
                        en="Female student dropout vulnerability is 73% higher in rural Khambhat/Tarapur due to transport deficit."
                        hi="खंभात और तारापुर में परिवहन के अभाव में छात्राओं में ड्रॉपआउट जोखिम 73% अधिक दर्ज है।"
                      />
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowClusterModal(true)}
                  className="px-3.5 py-1.5 rounded-lg bg-surface-container-high text-primary font-label-md text-label-md font-semibold shrink-0 hover:bg-primary hover:text-on-primary transition-all flex items-center gap-1"
                  type="button"
                >
                  <Icon name="travel_explore" size={16} />
                  <span><T gu="ક્લસ્ટર નકશો જુઓ" en="View Cluster Map" hi="क्लस्टर नक्शा देखें" /></span>
                </button>
              </div>
            </div>

            {/* RIGHT COLUMN: Detailed Explainability Drawer (4 cols) matching HTML */}
            <div className="lg:col-span-4 flex flex-col space-y-4">
              <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/60 shadow-md p-5 flex flex-col space-y-5 sticky top-20">
                {/* Explainability Card Title */}
                <div className="flex items-center justify-between pb-3 border-b border-outline-variant/40">
                  <div className="flex items-center gap-2">
                    <Icon name="auto_awesome" size={22} className="text-primary" />
                    <h2 className="font-title-md text-title-md text-on-surface font-bold">
                      <T gu="ડ્રોપઆઉટ જોખમ એનાલિટિક્સ" en="Dropout Risk Analytics" hi="ड्रॉपआउट जोखिम एनालिटिक्स" />
                    </h2>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-primary-fixed text-primary font-label-md text-label-md font-bold">
                    <T gu="Explainable AI" en="Explainable AI" hi="Explainable AI" />
                  </span>
                </div>

                {/* Selected Student Profile Mini Card */}
                <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/50 flex items-center gap-3.5">
                  <div className="relative">
                    <Avatar
                      name={selectedStudent.name.en}
                      size="lg"
                      className={
                        selectedStudent.gender === "female"
                          ? "bg-secondary text-on-secondary shadow-sm"
                          : "bg-primary text-on-primary shadow-sm"
                      }
                    />
                    <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-error text-on-error flex items-center justify-center font-caption text-[10px] font-bold shadow">
                      !
                    </span>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-title-md text-title-md font-bold text-on-surface truncate">
                        <T
                          gu={selectedStudent.name.gu}
                          en={selectedStudent.name.en}
                          hi={selectedStudent.name.hi}
                        />
                      </span>
                    </div>
                    <span className="font-caption text-caption text-on-surface-variant">
                      <T gu={selectedStudent.grade.gu} en={selectedStudent.grade.en} hi={selectedStudent.grade.hi} />
                      {" | "}
                      <T gu={selectedStudent.school.gu} en={selectedStudent.school.en} hi={selectedStudent.school.hi} />
                    </span>
                    <span className="font-caption text-caption text-outline font-medium truncate">
                      <T gu="વાલી: " en="Guardians: " hi="अभिभावक: " />
                      <T
                        gu={selectedStudent.parents.gu}
                        en={selectedStudent.parents.en}
                        hi={selectedStudent.parents.hi}
                      />
                    </span>
                  </div>
                </div>

                {/* Total Risk Metric Widget */}
                <div
                  className={`p-4 rounded-xl flex flex-col space-y-2 border ${
                    selectedStudent.riskTier === "high"
                      ? "bg-error-container/40 border-error/30"
                      : selectedStudent.riskTier === "medium"
                      ? "bg-secondary-fixed/40 border-secondary/30"
                      : "bg-success-container/40 border-success/30"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`font-label-md text-label-md font-bold flex items-center gap-1.5 ${
                        selectedStudent.riskTier === "high"
                          ? "text-error"
                          : selectedStudent.riskTier === "medium"
                          ? "text-secondary"
                          : "text-success"
                      }`}
                    >
                      <Icon name="crisis_alert" size={16} />
                      <T
                        gu={`કુલ જોખમ સ્તર (${selectedStudent.riskTier === "high" ? "અતિ ગંભીર" : selectedStudent.riskTier === "medium" ? "મધ્યમ" : "ઓછું"})`}
                        en={`Total Risk Level (${selectedStudent.riskTier.toUpperCase()})`}
                        hi={`कुल जोखिम स्तर (${selectedStudent.riskTier === "high" ? "गंभीर" : "सामान्य"})`}
                      />
                    </span>
                    <span
                      className={`font-headline-sm text-headline-sm font-extrabold ${
                        selectedStudent.riskTier === "high"
                          ? "text-error"
                          : selectedStudent.riskTier === "medium"
                          ? "text-secondary"
                          : "text-success"
                      }`}
                    >
                      {selectedStudent.riskScore}%
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-surface-container-high overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        selectedStudent.riskTier === "high"
                          ? "bg-error"
                          : selectedStudent.riskTier === "medium"
                          ? "bg-secondary"
                          : "bg-success"
                      }`}
                      style={{ width: `${selectedStudent.riskScore}%` }}
                    />
                  </div>
                  <p className="font-caption text-caption text-on-surface leading-normal">
                    <T
                      gu={selectedStudent.projectionText.gu}
                      en={selectedStudent.projectionText.en}
                      hi={selectedStudent.projectionText.hi}
                    />
                  </p>
                </div>

                {/* Feature Contribution Breakdown (SHAP analysis bars) */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-label-lg text-label-lg font-bold text-on-surface">
                      <T gu="પરિબળ વિશ્લેષણ (Risk Breakdown)" en="Risk Factor Breakdown" hi="कारक विश्लेषण" />
                    </span>
                    <span className="font-caption text-caption text-outline">
                      <T gu="શાપલે યોગદાન (SHAP)" en="SHAP Contribution" hi="SHAP विश्लेषण" />
                    </span>
                  </div>

                  {selectedStudent.shapFactors.map((factor, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex items-center justify-between font-label-md text-label-md">
                        <span className="text-on-surface flex items-center gap-1.5 truncate max-w-[240px]">
                          <Icon name={factor.icon} size={16} className="text-primary shrink-0" />
                          <span className="truncate">
                            <T gu={factor.name.gu} en={factor.name.en} hi={factor.name.hi} />
                          </span>
                        </span>
                        <span className={`font-bold ${factor.textColor} shrink-0`}>
                          {factor.impact}
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-surface-container-high overflow-hidden">
                        <div
                          className={`h-full rounded-full ${factor.barColor}`}
                          style={{ width: `${factor.percent}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Actionable Interventions Checklist / Trigger Panel */}
                <div className="space-y-3 pt-2 border-t border-outline-variant/40">
                  <span className="font-label-lg text-label-lg font-bold text-on-surface flex items-center gap-1.5">
                    <Icon name="checklist" size={18} className="text-primary" />
                    <T gu="અમલીકરણ આદેશ ચેકલિસ્ટ" en="Fast-Track Intervention Bundle" hi="कार्रवाई चेकलिस्ट" />
                  </span>
                  <div className="space-y-2">
                    {selectedStudent.checklist.map((item) => (
                      <label
                        key={item.id}
                        className="flex items-start gap-2.5 p-2.5 rounded-lg bg-surface-container-low hover:bg-surface-container transition-colors cursor-pointer border border-outline-variant/40"
                      >
                        <input
                          type="checkbox"
                          checked={checklistState[item.id] ?? true}
                          onChange={(e) =>
                            setChecklistState((prev) => ({
                              ...prev,
                              [item.id]: e.target.checked,
                            }))
                          }
                          className="mt-0.5 w-4 h-4 rounded text-primary focus:ring-0 cursor-pointer"
                        />
                        <div className="flex flex-col">
                          <span className="font-label-md text-label-md text-on-surface font-semibold leading-tight">
                            <T gu={item.title.gu} en={item.title.en} hi={item.title.hi} />
                          </span>
                          <span className="font-caption text-caption text-on-surface-variant mt-0.5">
                            <T gu={item.desc.gu} en={item.desc.en} hi={item.desc.hi} />
                          </span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Assigned Nodal Officer Info Block matching HTML */}
                <div className="p-3 rounded-lg bg-surface-container-high/60 border border-outline-variant/50 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-caption shrink-0">
                      {selectedStudent.nodalOfficer.initials}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-caption text-caption text-outline font-medium">
                        <T gu="સોંપેલ જવાબદાર અધિકારી" en="Assigned Nodal Officer" hi="नामित नोडल अधिकारी" />
                      </span>
                      <span className="font-label-md text-label-md text-on-surface font-bold truncate">
                        <T
                          gu={selectedStudent.nodalOfficer.name.gu}
                          en={selectedStudent.nodalOfficer.name.en}
                          hi={selectedStudent.nodalOfficer.name.hi}
                        />
                      </span>
                      <span className="font-caption text-[11px] text-on-surface-variant truncate">
                        <T
                          gu={selectedStudent.nodalOfficer.role.gu}
                          en={selectedStudent.nodalOfficer.role.en}
                          hi={selectedStudent.nodalOfficer.role.hi}
                        />
                      </span>
                    </div>
                  </div>
                  <a
                    href={`tel:${selectedStudent.nodalOfficer.phone}`}
                    className="p-2 rounded-lg bg-surface-container-lowest text-primary hover:bg-primary-fixed transition-colors shadow-sm"
                    title={`Call: ${selectedStudent.nodalOfficer.phone}`}
                  >
                    <Icon name="phone" size={18} />
                  </a>
                </div>

                {/* Primary Dispatch Button matching HTML */}
                <button
                  onClick={() => handleAction(selectedStudent.name.en, "assign")}
                  className="w-full py-3 px-4 rounded-lg bg-secondary text-on-secondary font-label-lg text-label-lg font-bold shadow-md hover:brightness-105 active:scale-95 transition-all flex items-center justify-center gap-2"
                  type="button"
                >
                  <Icon name="assignment_turned_in" size={20} />
                  <span>
                    <T
                      gu="હસ્તક્ષેપ આદેશ મંજૂર કરો અને SMS નોટિસ મોકલો"
                      en="Approve Intervention & Dispatch SMS"
                      hi="हस्तक्षेप आदेश स्वीकृत करें और SMS भेजें"
                    />
                  </span>
                </button>

                {/* Governance Mandate Note */}
                <p className="font-caption text-caption text-outline text-center leading-normal">
                  <T
                    gu="ગુજરાત બાળ શિક્ષણ અધિકાર અને કન્યા કેળવણી સુરક્ષા અભિયાન ૨૦૨૫-૨૬ અંતર્ગત આપમેળે મોનિટર થયેલ."
                    en="Monitored in accordance with Gujarat Child Right to Education & Kanya Kelavani Suraksha 2025-26."
                    hi="गुजरात बाल शिक्षा अधिकार एवं कन्या केळवणी सुरक्षा अभियान 2025-26 के अंतर्गत स्वचालित निगरानी।"
                  />
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Cluster Action Order Modal */}
        {showClusterModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in">
            <div className="bg-surface-container-lowest rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-outline-variant space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-outline-variant">
                <div className="flex items-center gap-2.5 text-secondary">
                  <Icon name="hub" size={24} />
                  <h3 className="font-title-md text-title-md font-bold text-on-surface">
                    <T
                      gu="ખંભાત અને તારાપુર ક્લસ્ટર એકશન આદેશ"
                      en="Khambhat & Tarapur Cluster Emergency Order"
                      hi="खंभात एवं तारापुर क्लस्टर आपातकालीन आदेश"
                    />
                  </h3>
                </div>
                <button
                  onClick={() => setShowClusterModal(false)}
                  className="p-1 rounded-full text-on-surface-variant hover:bg-surface-container transition-colors"
                >
                  <Icon name="close" size={20} />
                </button>
              </div>

              <div className="space-y-3 font-body-sm text-body-sm text-on-surface">
                <p className="p-3 bg-secondary-fixed/30 rounded-lg border border-secondary/20">
                  <T
                    gu="આ આદેશ દ્વારા ખંભાત અને તારાપુર તાલુકાના ૮૪ કન્યા વિદ્યાર્થીઓ માટે ૪૮ કલાકમાં સરસ્વતી સાધના સાયકલ ડિલિવરી તથા નમો લક્ષ્મી બેંક કેમ્પિગ ફરજિયાત કરવામાં આવે છે."
                    en="This directive mandates 48-hour bicycle delivery and Namo Lakshmi bank camp priority for 84 vulnerable female students across Khambhat and Tarapur talukas."
                    hi="यह आदेश खंभात और तारापुर तालुका की 84 छात्राओं के लिए 48 घंटे में साइकिल वितरण एवं नमो लक्ष्मी बैंक कैंप अनिवार्य करता है।"
                  />
                </p>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs py-1.5 border-b border-outline-variant">
                    <span className="font-semibold text-on-surface-variant">
                      <T gu="લક્ષિત તાલુકા" en="Targeted Talukas" hi="लक्षित तालुका" />
                    </span>
                    <span className="font-bold text-on-surface">ખંભાત (૫૪ કેસ), તારાપુર (૩૦ કેસ)</span>
                  </div>
                  <div className="flex items-center justify-between text-xs py-1.5 border-b border-outline-variant">
                    <span className="font-semibold text-on-surface-variant">
                      <T gu="આદેશિત અધિકારીઓ" en="Mandated Officials" hi="आदेशित अधिकारी" />
                    </span>
                    <span className="font-bold text-on-surface">TPEO Khambhat, TPEO Tarapur, 12 CRC Nodal Teachers</span>
                  </div>
                  <div className="flex items-center justify-between text-xs py-1.5 border-b border-outline-variant">
                    <span className="font-semibold text-on-surface-variant">
                      <T gu="સાયકલ સ્ટોક સ્ત્રોત" en="Cycle Inventory Hub" hi="साइकिल भंडार" />
                    </span>
                    <span className="font-bold text-on-surface">Batch B-0145 (Central Anand Godown)</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  onClick={() => setShowClusterModal(false)}
                  className="px-4 py-2 rounded-lg bg-surface-container-high text-on-surface-variant font-label-md text-label-md font-semibold hover:bg-surface-container-highest transition-colors"
                >
                  <T gu="રદ કરો" en="Cancel" hi="रद्द करें" />
                </button>
                <button
                  onClick={() => {
                    setShowClusterModal(false);
                    setActionNotice({
                      text: {
                        gu: "ખંભાત અને તારાપુર ક્લસ્ટર એકશન આદેશ સફળતાપૂર્વક જારી કરાયો. ૮૪ નોટિસ ડિસ્પેચ થઈ.",
                        en: "Cluster Emergency Action Directive issued. 84 student intervention notices dispatched.",
                        hi: "क्लस्टर आपातकालीन कार्रवाई आदेश जारी किया गया। 84 नोटिस भेजे गए।",
                      },
                      type: "success",
                    });
                  }}
                  className="px-4 py-2 rounded-lg bg-secondary text-on-secondary font-label-md text-label-md font-bold hover:brightness-110 shadow-md transition-all flex items-center gap-1.5"
                >
                  <Icon name="check_circle" size={16} />
                  <span><T gu="હુકમ જારી કરો" en="Dispatch Directive" hi="आदेश जारी करें" /></span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Batch Fast Track Modal */}
        {showFastTrackModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in">
            <div className="bg-surface-container-lowest rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-outline-variant space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-outline-variant">
                <div className="flex items-center gap-2.5 text-primary">
                  <Icon name="bolt" size={24} />
                  <h3 className="font-title-md text-title-md font-bold text-on-surface">
                    <T
                      gu="સહાય યોજના અગ્રતા આદેશ (Batch Fast-Track)"
                      en="Batch Fast-Track Intervention Order"
                      hi="बैच त्वरित हस्तक्षेप आदेश"
                    />
                  </h3>
                </div>
                <button
                  onClick={() => setShowFastTrackModal(false)}
                  className="p-1 rounded-full text-on-surface-variant hover:bg-surface-container transition-colors"
                >
                  <Icon name="close" size={20} />
                </button>
              </div>

              <p className="font-body-sm text-body-sm text-on-surface">
                <T
                  gu={`પસંદ કરેલા ${Object.values(selectedIds).filter(Boolean).length || 1} વિદ્યાર્થીઓ માટે સરસ્વતી સાધના સાયકલ યોજના અને નમો લક્ષ્મી યોજના હેઠળ પ્રાથમિકતા આદેશ મોકલવામાં આવશે.`}
                  en={`Issue fast-track intervention bundle for ${Object.values(selectedIds).filter(Boolean).length || 1} selected students under Saraswati Sadhana & Namo Lakshmi schemes.`}
                  hi={`चयनित ${Object.values(selectedIds).filter(Boolean).length || 1} छात्रों के लिए त्वरित हस्तक्षेप आदेश जारी किया जाएगा।`}
                />
              </p>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  onClick={() => setShowFastTrackModal(false)}
                  className="px-4 py-2 rounded-lg bg-surface-container-high text-on-surface-variant font-label-md text-label-md font-semibold hover:bg-surface-container-highest transition-colors"
                >
                  <T gu="રદ કરો" en="Cancel" hi="रद्द करें" />
                </button>
                <button
                  onClick={() => {
                    setShowFastTrackModal(false);
                    setActionNotice({
                      text: {
                        gu: "સામૂહિક ફાસ્ટ-ટ્રેક આદેશ સફળતાપૂર્વક જિલ્લા પોર્ટલ પર નોંધાઈ ગયો છે.",
                        en: "Batch Fast-Track intervention directive successfully scheduled and logged.",
                        hi: "बैच फास्ट-ट्रैक हस्तक्षेप आदेश सफलतापूर्वक दर्ज किया गया।",
                      },
                      type: "success",
                    });
                  }}
                  className="px-4 py-2 rounded-lg bg-primary text-on-primary font-label-md text-label-md font-bold hover:bg-primary/90 shadow-md transition-all flex items-center gap-1.5"
                >
                  <Icon name="done_all" size={16} />
                  <span><T gu="સામૂહિક આદેશ મંજૂર કરો" en="Approve Batch Order" hi="सामूहिक आदेश स्वीकृत करें" /></span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </OfficerShell>
  );
}
