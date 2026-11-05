"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { OfficerShell } from "@/components/shell/OfficerShell";
import { T } from "@/components/T";
import { Icon } from "@/components/Icon";


type ActionType = "APPROVE" | "REJECT" | "CREATE" | "UPDATE" | "DELETE";
type EntityType = "Application" | "Scheme" | "User";
// ActorType removed - unused

interface AuditLogEntry {
  id: string;
  blockNumber: number;
  timestamp: string;
  timestampGu: string;
  timestampHi: string;
  actorNameGu: string;
  actorNameEn: string;
  actorNameHi: string;
  actorRoleGu: string;
  actorRoleEn: string;
  actorRoleHi: string;
  actorType: "user" | "system";
  actorRoleCategory: "admin" | "deo" | "school" | "system" | "tpeo";
  initials: string;
  action: ActionType;
  actionLabelGu: string;
  actionLabelEn: string;
  actionLabelHi: string;
  actionDescriptionGu: string;
  actionDescriptionEn: string;
  actionDescriptionHi: string;
  entityType: EntityType;
  entityId: string;
  ipAddress: string;
  locationGu: string;
  locationEn: string;
  locationHi: string;
  result: "SUCCESS" | "REJECTED" | "BLOCKED" | "TERMINATED";
  resultLabelGu: string;
  resultLabelEn: string;
  resultLabelHi: string;
  hash: string;
  previousHash: string;
  severity: "CRITICAL POLICY" | "FINANCIAL DBT" | "OFFICER ACTION" | "SECURITY ALERT" | "ROUTINE VERIFIED";
  dscStatusGu: string;
  dscStatusEn: string;
  dscStatusHi: string;
  networkGu: string;
  networkEn: string;
  networkHi: string;
  signatoryGu: string;
  signatoryEn: string;
  signatoryHi: string;
  merkleStatusGu: string;
  merkleStatusEn: string;
  merkleStatusHi: string;
  diffLines?: {
    type: "remove" | "add" | "comment";
    text: string;
    noteGu?: string;
    noteEn?: string;
    noteHi?: string;
  }[];
  payloadJson: Record<string, unknown>;
}

const MOCK_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: "LOG-GJ-2026-99412",
    blockNumber: 84921,
    timestamp: "26 Feb 2026, 11:45:18 AM IST",
    timestampGu: "૨૬ ફેબ્રુ ૨૦૨૬, ૧૧:૪૫:૧૮ AM IST",
    timestampHi: "26 फरवरी 2026, 11:45:18 पूर्वाह्न IST",
    actorNameGu: "ડૉ. વિનોદ રાવ, IAS",
    actorNameEn: "Dr. Vinod Rao, IAS",
    actorNameHi: "डॉ. विनोद राव, आईएएस",
    actorRoleGu: "State Admin (સચિવ)",
    actorRoleEn: "State Admin (Secretariat)",
    actorRoleHi: "राज्य प्रशासक (सचिवालय)",
    actorType: "user",
    actorRoleCategory: "admin",
    initials: "VR",
    action: "UPDATE",
    actionLabelGu: "યોજના નીતિ સંશોધન",
    actionLabelEn: "Scheme Policy Revision",
    actionLabelHi: "योजना नीति संशोधन",
    actionDescriptionGu: "નમો લક્ષ્મી યોજનામાં આવક મર્યાદા ₹ ૫ લાખથી વધારી ₹ ૬ લાખ કરી",
    actionDescriptionEn: "Income ceiling increased from ₹5L to ₹6L in Namo Lakshmi Scheme",
    actionDescriptionHi: "नमो लक्ष्मी योजना में आय सीमा ₹ 5 लाख से बढ़ाकर ₹ 6 लाख की गई",
    entityType: "Scheme",
    entityId: "SCH-NL-2026-RULE",
    ipAddress: "10.42.0.12",
    locationGu: "GSWAN ગાંધીનગર",
    locationEn: "GSWAN Gandhinagar",
    locationHi: "जीएसवान गांधीनगर",
    result: "SUCCESS",
    resultLabelGu: "સફળ",
    resultLabelEn: "Success",
    resultLabelHi: "सफल",
    hash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    previousHash: "7c9f4128de9a61b8451108c90962b9a786358110b647c210519ad671427231ab",
    severity: "CRITICAL POLICY",
    dscStatusGu: "માન્ય (NIC Sub-CA Class 3)",
    dscStatusEn: "Valid (NIC Sub-CA Class 3)",
    dscStatusHi: "मान्य (एनआईसी सब-सीए क्लास 3)",
    networkGu: "ગુજરાત સ્ટેટ વાઇડ એરિયા નેટવર્ક (GSWAN)",
    networkEn: "Gujarat State Wide Area Network (GSWAN)",
    networkHi: "गुजरात स्टेट वाइड एरिया नेटवर्क (GSWAN)",
    signatoryGu: "ડૉ. વિનોદ રાવ, IAS (Secretariat)",
    signatoryEn: "Dr. Vinod Rao, IAS (Secretariat)",
    signatoryHi: "डॉ. विनोद राव, आईएएस (सचिवालय)",
    merkleStatusGu: "માન્ય (0 ms)",
    merkleStatusEn: "Valid (0 ms)",
    merkleStatusHi: "मान्य (0 ms)",
    diffLines: [
      { type: "comment", text: "// ફેરફાર પહેલાં (Previous State - Red)" },
      { type: "remove", text: '- "income_ceiling": 500000,', noteGu: "મૂળ સીમા", noteEn: "Original Ceiling", noteHi: "मूल सीमा" },
      { type: "remove", text: '- "target_classes": [9, 10],', noteGu: "ફક્ત ધોરણ ૯-૧૦", noteEn: "Only Std 9-10", noteHi: "केवल कक्षा 9-10" },
      { type: "comment", text: "// ફેરફાર પછી (New Active State - Green)" },
      { type: "add", text: '+ "income_ceiling": 600000,', noteGu: "+ ₹ ૧,૦૦,૦૦૦ વધારો", noteEn: "+ ₹ 1,00,000 hike", noteHi: "+ ₹ 1,00,000 वृद्धि" },
      { type: "add", text: '+ "target_classes": [9, 10, 11, 12]', noteGu: "ધોરણ ૧૧-૧૨ વિસ્તરણ", noteEn: "Std 11-12 expansion", noteHi: "कक्षा 11-12 विस्तार" },
    ],
    payloadJson: {
      scheme_id: "SCH-NL-2026",
      change_type: "ELIGIBILITY_RULE_UPDATE",
      income_ceiling: { before: 500000, after: 600000 },
      target_classes: { before: [9, 10], after: [9, 10, 11, 12] },
      gazette_gr_number: "GR-EDU-2026-8812-H",
      authorized_by: "Secretary_Education",
    },
  },
  {
    id: "LOG-GJ-2026-99411",
    blockNumber: 84920,
    timestamp: "26 Feb 2026, 11:14:02 AM IST",
    timestampGu: "૨૬ ફેબ્રુ ૨૦૨૬, ૧૧:૧૪:૦૨ AM IST",
    timestampHi: "26 फरवरी 2026, 11:14:02 पूर्वाह्न IST",
    actorNameGu: "PFMS પેમેન્ટ ગેટવે",
    actorNameEn: "PFMS Payment Gateway",
    actorNameHi: "पीएफएमएस पेमेंट गेटवे",
    actorRoleGu: "Automated API Service",
    actorRoleEn: "Automated API Service",
    actorRoleHi: "स्वचालित एपीआई सेवा",
    actorType: "system",
    actorRoleCategory: "system",
    initials: "PF",
    action: "CREATE",
    actionLabelGu: "DBT બેચ ડિસ્પેચ (Batch Initiated)",
    actionLabelEn: "DBT Batch Dispatch (Initiated)",
    actionLabelHi: "डीबीटी बैच प्रेषण (शुरू किया गया)",
    actionDescriptionGu: "₹ ૨૭.૭૧ કરોડ નમો લક્ષ્મી બેચ ૩ સફળતાપૂર્વક રવાના",
    actionDescriptionEn: "₹ 27.71 Crore Namo Lakshmi Batch 3 dispatched",
    actionDescriptionHi: "₹ 27.71 करोड़ नमो लक्ष्मी बैच 3 सफलतापूर्वक भेजा गया",
    entityType: "Scheme",
    entityId: "PFMS-GJ-2026-B8841",
    ipAddress: "172.16.8.90",
    locationGu: "PFMS Gateway New Delhi",
    locationEn: "PFMS Gateway New Delhi",
    locationHi: "पीएफएमएस गेटवे नई दिल्ली",
    result: "SUCCESS",
    resultLabelGu: "સફળ",
    resultLabelEn: "Success",
    resultLabelHi: "सफल",
    hash: "a78f21bc980112aa54ef3381a17c98024419adba447289196b02a11b65826742",
    previousHash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    severity: "FINANCIAL DBT",
    dscStatusGu: "માન્ય (RBI / NPCI Banking CA)",
    dscStatusEn: "Valid (RBI / NPCI Banking CA)",
    dscStatusHi: "मान्य (आरबीआई / एनपीसीआई बैंकिंग सीए)",
    networkGu: "NIC Banking Leased Line (10 Gbps Direct)",
    networkEn: "NIC Banking Leased Line (10 Gbps Direct)",
    networkHi: "एनआईसी बैंकिंग लीज्ड लाइन (10 Gbps Direct)",
    signatoryGu: "PFMS Central Clearing Service",
    signatoryEn: "PFMS Central Clearing Service",
    signatoryHi: "पीएफएमएस केंद्रीय समाशोधन सेवा",
    merkleStatusGu: "માન્ય (0 ms)",
    merkleStatusEn: "Valid (0 ms)",
    merkleStatusHi: "मान्य (0 ms)",
    diffLines: [
      { type: "comment", text: "// DBT Batch Payload Snapshot" },
      { type: "add", text: '+ "batch_ref": "PFMS-GJ-2026-B8841",', noteGu: "બેચ ઓળખ", noteEn: "Batch ID", noteHi: "बैच आईडी" },
      { type: "add", text: '+ "beneficiary_count": 27710,', noteGu: "લાભાર્થી સંખ્યા", noteEn: "Beneficiaries", noteHi: "लाभार्थी संख्या" },
      { type: "add", text: '+ "total_amount_inr": 277100000,', noteGu: "કુલ રકમ", noteEn: "Total Amount", noteHi: "कुल राशि" },
      { type: "add", text: '+ "settlement_bank": "APBS/NACH NPCI"', noteGu: "ગેટવે રુટ", noteEn: "Gateway Route", noteHi: "गेटवे मार्ग" },
    ],
    payloadJson: {
      batch_ref: "PFMS-GJ-2026-B8841",
      beneficiary_count: 27710,
      total_amount_inr: 277100000,
      payment_mode: "APBS_NACH_DBT",
      sponsor_bank: "SBI_GANDHINAGAR_TREASURY",
      response_code: "PFMS_ACK_200",
    },
  },
  {
    id: "LOG-GJ-2026-99410",
    blockNumber: 84919,
    timestamp: "26 Feb 2026, 10:48:30 AM IST",
    timestampGu: "૨૬ ફેબ્રુ ૨૦૨૬, ૧૦:૪૮:૩૦ AM IST",
    timestampHi: "26 फरवरी 2026, 10:48:30 पूर्वाह्न IST",
    actorNameGu: "ડૉ. કલ્પેશ શાહ",
    actorNameEn: "Dr. Kalpesh Shah",
    actorNameHi: "डॉ. कल्पेश शाह",
    actorRoleGu: "આચાર્ય, આણંદ",
    actorRoleEn: "School Principal (Anand)",
    actorRoleHi: "प्राचार्य, आणंद",
    actorType: "user",
    actorRoleCategory: "school",
    initials: "KS",
    action: "APPROVE",
    actionLabelGu: "શાળા વેરિફિકેશન મંજૂર",
    actionLabelEn: "School Verification Approved",
    actionLabelHi: "स्कूल सत्यापन स्वीकृत",
    actionDescriptionGu: "વિદ્યાર્થી રિયા પટેલ GJ-AND-2026-004512 પ્રમાણિત કરાયેલ",
    actionDescriptionEn: "Student Riya Patel APP-2026-004512 verified and approved",
    actionDescriptionHi: "छात्रा रिया पटेल APP-2026-004512 का सत्यापन स्वीकृत",
    entityType: "Application",
    entityId: "APP-2026-004512",
    ipAddress: "117.204.42.10",
    locationGu: "શ્રી સરદાર પટેલ હાઇસ્કૂલ, આણંદ",
    locationEn: "Shree Sardar Patel High School, Anand",
    locationHi: "श्री सरदार पटेल हाई स्कूल, आणंद",
    result: "SUCCESS",
    resultLabelGu: "સફળ",
    resultLabelEn: "Success",
    resultLabelHi: "सफल",
    hash: "1b94e803ca845210998ea3221980ccfe721a9104b2a890918c54178a946241bb",
    previousHash: "a78f21bc980112aa54ef3381a17c98024419adba447289196b02a11b65826742",
    severity: "OFFICER ACTION",
    dscStatusGu: "માન્ય (Aadhaar eSign OTP Verified)",
    dscStatusEn: "Valid (Aadhaar eSign OTP Verified)",
    dscStatusHi: "मान्य (आधार ई-साइन ओटीपी सत्यापित)",
    networkGu: "BSNL Broadband (School Static IP)",
    networkEn: "BSNL Broadband (School Static IP)",
    networkHi: "बीएसएनएल ब्रॉडबैंड (स्कूल स्टेटिक आईपी)",
    signatoryGu: "ડૉ. કલ્પેશ શાહ (Principal ID: SCH-241502)",
    signatoryEn: "Dr. Kalpesh Shah (Principal ID: SCH-241502)",
    signatoryHi: "डॉ. कल्पेश शाह (प्रिंसिपल आईडी: SCH-241502)",
    merkleStatusGu: "માન્ય (0 ms)",
    merkleStatusEn: "Valid (0 ms)",
    merkleStatusHi: "मान्य (0 ms)",
    diffLines: [
      { type: "comment", text: "// Verification Status Update" },
      { type: "remove", text: '- "school_verification_status": "PENDING",', noteGu: "અગાઉ", noteEn: "Prior State", noteHi: "पूर्व स्थिति" },
      { type: "add", text: '+ "school_verification_status": "APPROVED",', noteGu: "મંજૂર", noteEn: "Approved", noteHi: "स्वीकृत" },
      { type: "add", text: '+ "attendance_percentage": 88.5,', noteGu: "હાજરી ૮૮.૫%", noteEn: "Attendance 88.5%", noteHi: "उपस्थिति 88.5%" },
      { type: "add", text: '+ "verified_by": "Dr. Kalpesh Shah (SCH-241502)"', noteGu: "સહીકર્તા", noteEn: "Signer", noteHi: "हस्ताक्षरकर्ता" },
    ],
    payloadJson: {
      application_id: "APP-2026-004512",
      student_name: "Riya M. Patel",
      scheme: "Namo Lakshmi Scheme",
      attendance_percentage: 88.5,
      documents_checked: ["income_cert", "marksheet_std_9", "aadhar_kyc"],
      signature_type: "AADHAAR_E_SIGN",
      remarks: "Eligible for 2nd tranche disbursal",
    },
  },
  {
    id: "LOG-GJ-2026-99409",
    blockNumber: 84918,
    timestamp: "26 Feb 2026, 10:18:45 AM IST",
    timestampGu: "૨૬ ફેબ્રુ ૨૦૨૬, ૧૦:૧૮:૪૫ AM IST",
    timestampHi: "26 फरवरी 2026, 10:18:45 पूर्वाह्न IST",
    actorNameGu: "પરેશ ત્રિવેદી (DEO આણંદ)",
    actorNameEn: "Paresh Trivedi (DEO Anand)",
    actorNameHi: "परेश त्रिवेदी (डीईओ आणंद)",
    actorRoleGu: "DEO આણંદ જીલ્લો",
    actorRoleEn: "DEO Office Anand",
    actorRoleHi: "डीईओ कार्यालय आणंद",
    actorType: "user",
    actorRoleCategory: "deo",
    initials: "PT",
    action: "APPROVE",
    actionLabelGu: "બલ્ક મંજૂરી (DSC Signed)",
    actionLabelEn: "Bulk Approved (DSC Signed)",
    actionLabelHi: "थोक अनुमोदन (डीएससी हस्ताक्षरित)",
    actionDescriptionGu: "૧,૨૪૦ પાસ થયેલ અરજીઓ ડિજિટલ સહી (DSC) સાથે મંજૂર",
    actionDescriptionEn: "1,240 verified applications approved with Class-3 DSC",
    actionDescriptionHi: "1,240 सत्यापित आवेदन डिजिटल हस्ताक्षर (डीएससी) से अनुमोदित",
    entityType: "Application",
    entityId: "BLK-AND-2026-44",
    ipAddress: "10.58.12.4",
    locationGu: "DEO Office Anand",
    locationEn: "DEO Office Anand",
    locationHi: "डीईओ कार्यालय आणंद",
    result: "SUCCESS",
    resultLabelGu: "સફળ",
    resultLabelEn: "Success",
    resultLabelHi: "सफल",
    hash: "9f2b881a8820c741499b2184ef4772109867c489218ab2401874288102123109",
    previousHash: "1b94e803ca845210998ea3221980ccfe721a9104b2a890918c54178a946241bb",
    severity: "OFFICER ACTION",
    dscStatusGu: "માન્ય (NIC Sub-CA Class 3 Dongle)",
    dscStatusEn: "Valid (NIC Sub-CA Class 3 Dongle)",
    dscStatusHi: "मान्य (एनआईसी सब-सीए क्लास 3 डोंगल)",
    networkGu: "GSWAN Anand Collectorate Node",
    networkEn: "GSWAN Anand Collectorate Node",
    networkHi: "जीएसवान आणंद समाहर्ता नोड",
    signatoryGu: "પરેશ ત્રિવેદી (DEO Anand District)",
    signatoryEn: "Paresh Trivedi (DEO Anand District)",
    signatoryHi: "परेश त्रिवेदी (डीईओ आणंद जिला)",
    merkleStatusGu: "માન્ય (0 ms)",
    merkleStatusEn: "Valid (0 ms)",
    merkleStatusHi: "मान्य (0 ms)",
    diffLines: [
      { type: "comment", text: "// Bulk Approval Execution" },
      { type: "add", text: '+ "bulk_batch_id": "BLK-AND-2026-44",', noteGu: "બેચ આઈડી", noteEn: "Batch ID", noteHi: "बैच आईडी" },
      { type: "add", text: '+ "total_approved": 1240,', noteGu: "મંજૂર અરજીઓ", noteEn: "Approved Count", noteHi: "स्वीकृत संख्या" },
      { type: "add", text: '+ "dsc_cert_serial": "NIC-CA-2026-990142",', noteGu: "સર્ટિફિકેટ સીરીયલ", noteEn: "Cert Serial", noteHi: "प्रमाणपत्र क्रम" },
      { type: "add", text: '+ "forwarded_to": "STATE_DBT_DISPATCH_QUEUE"', noteGu: "રાજ્ય કતાર", noteEn: "State Queue", noteHi: "राज्य कतार" },
    ],
    payloadJson: {
      bulk_batch_id: "BLK-AND-2026-44",
      district: "Anand",
      taluka_count: 8,
      approved_count: 1240,
      dsc_cert_serial: "NIC-CA-2026-990142",
      signing_time: "2026-02-26T10:18:45Z",
    },
  },
  {
    id: "LOG-GJ-2026-99408",
    blockNumber: 84917,
    timestamp: "26 Feb 2026, 09:55:11 AM IST",
    timestampGu: "૨૬ ફેબ્રુ ૨૦૨૬, ૦૯:૫૫:૧૧ AM IST",
    timestampHi: "26 फरवरी 2026, 09:55:11 पूर्वाह्न IST",
    actorNameGu: "વિજિલન્સ AI મોનિટર",
    actorNameEn: "Vigilance AI Monitor",
    actorNameHi: "सतर्कता एआई मॉनिटर",
    actorRoleGu: "Automated Flag Engine",
    actorRoleEn: "Automated Flag Engine",
    actorRoleHi: "स्वचालित फ्लैग इंजन",
    actorType: "system",
    actorRoleCategory: "system",
    initials: "AI",
    action: "REJECT",
    actionLabelGu: "ખાતું ફ્રીઝ (Payment Freeze)",
    actionLabelEn: "Payment Account Freeze",
    actionLabelHi: "खाता फ्रीज (भुगतान रोक)",
    actionDescriptionGu: "૧૪ વિદ્યાર્થી સિન્ડિકેટ ફ્લેગ FLG-GJ-2026-0891 હેઠળ ખાતું રોકાયેલ",
    actionDescriptionEn: "14 student syndicate flag FLG-GJ-2026-0891 blocked",
    actionDescriptionHi: "14 छात्र सिंडिकेट फ्लैग FLG-GJ-2026-0891 के तहत खाता फ्रीज",
    entityType: "User",
    entityId: "ACC-SBI-8812",
    ipAddress: "10.0.99.14",
    locationGu: "NIC Cloud Gandhinagar",
    locationEn: "NIC Cloud Gandhinagar",
    locationHi: "एनआईसी क्लाउड गांधीनगर",
    result: "BLOCKED",
    resultLabelGu: "અટકાવેલ",
    resultLabelEn: "Blocked",
    resultLabelHi: "अवरुद्ध",
    hash: "54d9aa216744091aef2140bb0912cca1419741a02981bc894510a97c231aef11",
    previousHash: "9f2b881a8820c741499b2184ef4772109867c489218ab2401874288102123109",
    severity: "SECURITY ALERT",
    dscStatusGu: "સિસ્ટમ ક્રિપ્ટોગ્રાફિક સીલ વેરિફાઇડ",
    dscStatusEn: "System Cryptographic Seal Verified",
    dscStatusHi: "सिस्टम क्रिप्टोग्राफिक सील सत्यापित",
    networkGu: "NIC Internal Vigilance Bus",
    networkEn: "NIC Internal Vigilance Bus",
    networkHi: "एनआईसी आंतरिक सतर्कता बस",
    signatoryGu: "AI Heuristic Sentinel Module v4",
    signatoryEn: "AI Heuristic Sentinel Module v4",
    signatoryHi: "एआई सेंटिनल मॉड्यूल v4",
    merkleStatusGu: "માન્ય (0 ms)",
    merkleStatusEn: "Valid (0 ms)",
    merkleStatusHi: "मान्य (0 ms)",
    diffLines: [
      { type: "comment", text: "// Fraud Detection Enforcement" },
      { type: "remove", text: '- "disbursement_status": "SCHEDULED",', noteGu: "અગાઉ", noteEn: "Prior State", noteHi: "पूर्व स्थिति" },
      { type: "add", text: '+ "disbursement_status": "FROZEN_INVESTIGATION",', noteGu: "ફ્રીઝ સ્થિતિ", noteEn: "Frozen", noteHi: "फ्रीज" },
      { type: "add", text: '+ "risk_score": 0.96,', noteGu: "જોખમ ૯૬%", noteEn: "Risk 96%", noteHi: "जोखिम 96%" },
      { type: "add", text: '+ "action_enforced": "SUSPEND_DISBURSEMENT_HOLD"', noteGu: "ચુકવણી સ્થગિત", noteEn: "Held", noteHi: "स्थगित" },
    ],
    payloadJson: {
      anomaly_code: "FRAUD_SYNDICATE_MULTI_ACC",
      target_account: "SBI-***8812",
      matched_applications: 14,
      risk_score: 0.96,
      action_enforced: "SUSPEND_DISBURSEMENT_HOLD",
      notified_officers: ["DEO_ANAND", "STATE_VIGILANCE_CELL"],
    },
  },
  {
    id: "LOG-GJ-2026-99407",
    blockNumber: 84916,
    timestamp: "26 Feb 2026, 09:30:15 AM IST",
    timestampGu: "૨૬ ફેબ્રુ ૨૦૨૬, ૦૯:૩૦:૧૫ AM IST",
    timestampHi: "26 फरवरी 2026, 09:30:15 पूर्वाह्न IST",
    actorNameGu: "DEO કચેરી સુરત",
    actorNameEn: "DEO Office Surat",
    actorNameHi: "डीईओ कार्यालय सूरत",
    actorRoleGu: "DEO સુરત જીલ્લો",
    actorRoleEn: "District Education Officer (Surat)",
    actorRoleHi: "डीईओ सूरत जिला",
    actorType: "user",
    actorRoleCategory: "deo",
    initials: "DS",
    action: "REJECT",
    actionLabelGu: "અરજી નામંજૂર (અમાન્ય આવક પ્રમાણપત્ર)",
    actionLabelEn: "Application Rejected (Expired Income Cert)",
    actionLabelHi: "आवेदन अस्वीकृत (अमान्य आय प्रमाण पत्र)",
    actionDescriptionGu: "આવક પ્રમાણપત્ર ૩ વર્ષની માન્યતા મર્યાદા બહાર હોવાથી અરજી નકારી",
    actionDescriptionEn: "Income certificate expired beyond 3-year validity threshold",
    actionDescriptionHi: "आय प्रमाण पत्र की 3 वर्ष की वैधता समाप्त होने के कारण अस्वीकृत",
    entityType: "Application",
    entityId: "APP-2026-009184",
    ipAddress: "10.45.22.18",
    locationGu: "DEO Office Surat",
    locationEn: "DEO Office Surat",
    locationHi: "डीईओ कार्यालय सूरत",
    result: "REJECTED",
    resultLabelGu: "નામંજૂર",
    resultLabelEn: "Rejected",
    resultLabelHi: "अस्वीकृत",
    hash: "4e29bb30551044a8219084cba1902319ef471801248ab29402484a91902811ac",
    previousHash: "54d9aa216744091aef2140bb0912cca1419741a02981bc894510a97c231aef11",
    severity: "OFFICER ACTION",
    dscStatusGu: "માન્ય (NIC Sub-CA Class 2)",
    dscStatusEn: "Valid (NIC Sub-CA Class 2)",
    dscStatusHi: "मान्य (एनआईसी सब-सीए क्लास 2)",
    networkGu: "GSWAN Surat District Server",
    networkEn: "GSWAN Surat District Server",
    networkHi: "जीएसवान सूरत जिला सर्वर",
    signatoryGu: "ડી. એમ. સોલંકી (Dy. DEO Surat)",
    signatoryEn: "D. M. Solanki (Dy. DEO Surat)",
    signatoryHi: "डी. एम. सोलंकी (उप डीईओ सूरत)",
    merkleStatusGu: "માન્ય (0 ms)",
    merkleStatusEn: "Valid (0 ms)",
    merkleStatusHi: "मान्य (0 ms)",
    diffLines: [
      { type: "comment", text: "// Application Rejection Reason" },
      { type: "remove", text: '- "status": "UNDER_DISTRICT_REVIEW",', noteGu: "અગાઉ", noteEn: "Prior State", noteHi: "पूर्व स्थिति" },
      { type: "add", text: '+ "status": "REJECTED",', noteGu: "નામંજૂર", noteEn: "Rejected", noteHi: "अस्वीकृत" },
      { type: "add", text: '+ "rejection_code": "INCOME_CERT_EXPIRED",', noteGu: "કોડ", noteEn: "Code", noteHi: "कोड" },
      { type: "add", text: '+ "reapplication_allowed": true', noteGu: "પુનઃ અરજી છૂટ", noteEn: "Reapply Allowed", noteHi: "पुनः आवेदन मान्य" },
    ],
    payloadJson: {
      application_id: "APP-2026-009184",
      rejection_reason: "INCOME_CERT_EXPIRED",
      document_issue_date: "2022-04-12",
      validity_max_years: 3,
      rejection_officer: "D. M. Solanki (DEO Surat)",
      reapplication_allowed: true,
    },
  },
  {
    id: "LOG-GJ-2026-99406",
    blockNumber: 84915,
    timestamp: "26 Feb 2026, 09:05:40 AM IST",
    timestampGu: "૨૬ ફેબ્રુ ૨૦૨૬, ૦૯:૦૫:૪૦ AM IST",
    timestampHi: "26 फरवरी 2026, 09:05:40 पूर्वाह्न IST",
    actorNameGu: "ડિજીલોકર વેરિફિકેશન બોટ",
    actorNameEn: "DigiLocker Verification Bot",
    actorNameHi: "डिजिलॉकर सत्यापन बॉट",
    actorRoleGu: "Automated API Service",
    actorRoleEn: "Automated API Service",
    actorRoleHi: "स्वचालित एपीआई सेवा",
    actorType: "system",
    actorRoleCategory: "system",
    initials: "DL",
    action: "APPROVE",
    actionLabelGu: "સિસ્ટમ ઓટો-વેરિફાઇડ (Caste & Aadhaar)",
    actionLabelEn: "System Auto-Verified (Caste & Aadhaar)",
    actionLabelHi: "सिस्टम स्वतः सत्यापित (जाति और आधार)",
    actionDescriptionGu: "જાતિ પ્રમાણપત્ર અને આધાર XML ડિજિટલ હસ્તાક્ષર સ્વચાલિત ચકાસાયેલ",
    actionDescriptionEn: "Caste cert & Aadhaar XML verified automatically via DigiLocker API",
    actionDescriptionHi: "जाति प्रमाण पत्र और आधार एक्सएमएल डिजिटल हस्ताक्षर स्वतः सत्यापित",
    entityType: "Application",
    entityId: "APP-2026-011245",
    ipAddress: "164.100.128.5",
    locationGu: "DigiLocker National Cloud",
    locationEn: "DigiLocker National Cloud",
    locationHi: "डिजिलॉकर राष्ट्रीय क्लाउड",
    result: "SUCCESS",
    resultLabelGu: "સફળ",
    resultLabelEn: "Success",
    resultLabelHi: "सफल",
    hash: "88c12a77329188fca02984ea0012ba9741a293817420184a29810a98091299de",
    previousHash: "4e29bb30551044a8219084cba1902319ef471801248ab29402484a91902811ac",
    severity: "ROUTINE VERIFIED",
    dscStatusGu: "માન્ય (CCA National eGov Root CA)",
    dscStatusEn: "Valid (CCA National eGov Root CA)",
    dscStatusHi: "मान्य (सीसीए राष्ट्रीय ई-गवर्नेंस सीए)",
    networkGu: "MeitY DigiLocker Secure Bus",
    networkEn: "MeitY DigiLocker Secure Bus",
    networkHi: "इलेक्ट्रॉनिक्स मंत्रालय सुरक्षित बस",
    signatoryGu: "DigiLocker Trust Authority v3",
    signatoryEn: "DigiLocker Trust Authority v3",
    signatoryHi: "डिजिलॉकर ट्रस्ट अथॉरिटी v3",
    merkleStatusGu: "માન્ય (0 ms)",
    merkleStatusEn: "Valid (0 ms)",
    merkleStatusHi: "मान्य (0 ms)",
    diffLines: [
      { type: "comment", text: "// Automated Verification Handshake" },
      { type: "remove", text: '- "caste_verified": false,', noteGu: "અગાઉ", noteEn: "Prior State", noteHi: "पूर्व स्थिति" },
      { type: "add", text: '+ "caste_verified": true,', noteGu: "વેરિફાઇડ", noteEn: "Verified", noteHi: "सत्यापित" },
      { type: "add", text: '+ "digilocker_uri": "in.gov.gujarat.edistrict-CERT-88192",', noteGu: "URI સંદર્ભ", noteEn: "URI Ref", noteHi: "यूआरआई संदर्भ" },
      { type: "add", text: '+ "confidence_score": 1.0', noteGu: "૧૦૦% સચોટ", noteEn: "100% Match", noteHi: "100% मेल" },
    ],
    payloadJson: {
      source: "DIGILOCKER_API_GJ",
      doc_type: "CASTE_CERTIFICATE",
      issuing_authority: "Mamlatdar Office Vadodara",
      xml_signature_valid: true,
      match_confidence: 1.0,
      auto_verified_at: "2026-02-26T09:05:40Z",
    },
  },
  {
    id: "LOG-GJ-2026-99405",
    blockNumber: 84914,
    timestamp: "26 Feb 2026, 08:42:19 AM IST",
    timestampGu: "૨૬ ફેબ્રુ ૨૦૨૬, ૦૮:૪૨:૧૯ AM IST",
    timestampHi: "26 फरवरी 2026, 08:42:19 पूर्वाह्न IST",
    actorNameGu: "હેતલબેન જોશી (TPEO)",
    actorNameEn: "Hetalben Joshi (TPEO)",
    actorNameHi: "हेतलबेन जोशी (टीपीईओ)",
    actorRoleGu: "TPEO બોરસદ",
    actorRoleEn: "Taluka Officer (TPEO Borsad)",
    actorRoleHi: "तालुका अधिकारी (टीपीईओ बोरसद)",
    actorType: "user",
    actorRoleCategory: "tpeo",
    initials: "HJ",
    action: "CREATE",
    actionLabelGu: "શાળા ઓનબોર્ડિંગ માન્યતા",
    actionLabelEn: "School Onboarding Verification",
    actionLabelHi: "स्कूल ऑनबोर्डिंग सत्यापन",
    actionDescriptionGu: "કવિતા કન્યા વિદ્યાલય UDISE ૨૪૧૫૦૨૦૧૦૧ નવું જોડાણ મંજૂર",
    actionDescriptionEn: "New school UDISE 2415020101 onboarded and verified",
    actionDescriptionHi: "कविता कन्या विद्यालय यू-डाइस 2415020101 नया संबद्धीकरण स्वीकृत",
    entityType: "User",
    entityId: "SCH-DISE-2415020101",
    ipAddress: "10.58.91.22",
    locationGu: "TPEO Office Borsad",
    locationEn: "TPEO Office Borsad",
    locationHi: "टीपीईओ कार्यालय बोरसद",
    result: "SUCCESS",
    resultLabelGu: "સફળ",
    resultLabelEn: "Success",
    resultLabelHi: "सफल",
    hash: "73da5e02882194bb102983ca492019ab7491048291048b291048a901847244f0",
    previousHash: "88c12a77329188fca02984ea0012ba9741a293817420184a29810a98091299de",
    severity: "OFFICER ACTION",
    dscStatusGu: "માન્ય (NIC Sub-CA Class 2 Token)",
    dscStatusEn: "Valid (NIC Sub-CA Class 2 Token)",
    dscStatusHi: "मान्य (एनआईसी सब-सीए क्लास 2 टोकन)",
    networkGu: "GSWAN Borsad Taluka Seva Sadan",
    networkEn: "GSWAN Borsad Taluka Seva Sadan",
    networkHi: "जीएसवान बोरसद तालुका सेवा सदन",
    signatoryGu: "હેતલબેન જોશી (TPEO Borsad)",
    signatoryEn: "Hetalben Joshi (TPEO Borsad)",
    signatoryHi: "हेतलबेन जोशी (टीपीईओ बोरसद)",
    merkleStatusGu: "માન્ય (0 ms)",
    merkleStatusEn: "Valid (0 ms)",
    merkleStatusHi: "मान्य (0 ms)",
    diffLines: [
      { type: "comment", text: "// School Registration Record" },
      { type: "add", text: '+ "udise_code": "2415020101",', noteGu: "UDISE કોડ", noteEn: "UDISE Code", noteHi: "यू-डाइस कोड" },
      { type: "add", text: '+ "school_name": "Kavitha Kanya Vidhyalaya",', noteGu: "શાળા નામ", noteEn: "School Name", noteHi: "स्कूल का नाम" },
      { type: "add", text: '+ "taluka": "Borsad", "district": "Anand",', noteGu: "સ્થાન", noteEn: "Location", noteHi: "स्थान" },
      { type: "add", text: '+ "status": "ACTIVE_VERIFIED"', noteGu: "સક્રિય સ્થિતિ", noteEn: "Active", noteHi: "सक्रिय" },
    ],
    payloadJson: {
      udise_code: "2415020101",
      school_name: "Kavitha Kanya Vidhyalaya",
      board: "GSEB",
      authorized_principal_pan: "ABCDE1234F",
      status: "ACTIVE_VERIFIED",
    },
  },
  {
    id: "LOG-GJ-2026-99404",
    blockNumber: 84913,
    timestamp: "25 Feb 2026, 06:15:52 PM IST",
    timestampGu: "૨૫ ફેબ્રુ ૨૦૨૬, ૦૬:૧૫:૫૨ PM IST",
    timestampHi: "25 फरवरी 2026, 06:15:52 अपराह्न IST",
    actorNameGu: "સુરક્ષા એન્જિન",
    actorNameEn: "Admin Security Guardian",
    actorNameHi: "प्रशासन सुरक्षा संरक्षक",
    actorRoleGu: "Automated Security Daemon",
    actorRoleEn: "Automated Security Daemon",
    actorRoleHi: "स्वचालित सुरक्षा डेमॉन",
    actorType: "system",
    actorRoleCategory: "system",
    initials: "SG",
    action: "DELETE",
    actionLabelGu: "અમાન્ય સત્ર સમાપ્તિ (Session Terminated)",
    actionLabelEn: "Unauthorized Session Terminated",
    actionLabelHi: "अनधिकृत सत्र समाप्त",
    actionDescriptionGu: "બહારના અજાણ્યા IP થી એકસાથે લૉગિન થતાં સત્ર તાત્કાલિક રદ કરાયું",
    actionDescriptionEn: "Concurrent login detected from external IP; session revoked",
    actionDescriptionHi: "बाहरी अज्ञात आईपी से दोहरा लॉगिन पाए जाने पर सत्र तुरंत रद्द",
    entityType: "User",
    entityId: "SES-2026-992147",
    ipAddress: "49.36.120.88",
    locationGu: "Outside GSWAN ISP (Public IP)",
    locationEn: "Outside GSWAN ISP (Public IP)",
    locationHi: "जीएसवान के बाहर का आईपी",
    result: "TERMINATED",
    resultLabelGu: "સમાપ્ત",
    resultLabelEn: "Terminated",
    resultLabelHi: "समाप्त",
    hash: "620fc1290042a98f129038ba018249fa8471049281a941829048a9102948ca09",
    previousHash: "73da5e02882194bb102983ca492019ab7491048291048b291048a901847244f0",
    severity: "SECURITY ALERT",
    dscStatusGu: "સુરક્ષા નીતિ ઓટો-એન્ફોર્સમેન્ટ",
    dscStatusEn: "Security Policy Auto-Enforcement",
    dscStatusHi: "सुरक्षा नीति स्वतः प्रवर्तन",
    networkGu: "GSWAN Perimeter Firewall (Palo Alto)",
    networkEn: "GSWAN Perimeter Firewall (Palo Alto)",
    networkHi: "जीएसवान परिधि फ़ायरवॉल",
    signatoryGu: "NIC Gujarat Cyber Security Cell",
    signatoryEn: "NIC Gujarat Cyber Security Cell",
    signatoryHi: "एनआईसी गुजरात साइबर सुरक्षा प्रकोष्ठ",
    merkleStatusGu: "માન્ય (0 ms)",
    merkleStatusEn: "Valid (0 ms)",
    merkleStatusHi: "मान्य (0 ms)",
    diffLines: [
      { type: "comment", text: "// Session Invalidation Log" },
      { type: "remove", text: '- "session_token": "SES-2026-992147", "active": true,', noteGu: "સક્રિય", noteEn: "Was Active", noteHi: "सक्रिय था" },
      { type: "add", text: '+ "session_token": "SES-2026-992147", "active": false,', noteGu: "રદ", noteEn: "Revoked", noteHi: "रद्द" },
      { type: "add", text: '+ "termination_reason": "CONCURRENT_IP_BREACH"', noteGu: "કારણ", noteEn: "Reason", noteHi: "कारण" },
    ],
    payloadJson: {
      user_id: "OFF-CLK-8812",
      session_token: "SES-2026-992147",
      event: "CONCURRENT_IP_LOGIN_BREACH",
      policy: "GSWAN_RESTRICTED_ONLY",
      action: "REVOKE_TOKEN_IMMEDIATELY",
    },
  },
  {
    id: "LOG-GJ-2026-99403",
    blockNumber: 84912,
    timestamp: "25 Feb 2026, 05:20:40 PM IST",
    timestampGu: "૨૫ ફેબ્રુ ૨૦૨૬, ૦૫:૨૦:૪૦ PM IST",
    timestampHi: "25 फरवरी 2026, 05:20:40 अपराह्न IST",
    actorNameGu: "ડૉ. કલ્પેશ શાહ",
    actorNameEn: "Dr. Kalpesh Shah",
    actorNameHi: "डॉ. कल्पेश शाह",
    actorRoleGu: "આચાર્ય, આણંદ",
    actorRoleEn: "School Principal (Anand)",
    actorRoleHi: "प्राचार्य, आणंद",
    actorType: "user",
    actorRoleCategory: "school",
    initials: "KS",
    action: "UPDATE",
    actionLabelGu: "વિદ્યાર્થી ત્રિમાસિક હાજરી અપડેટ",
    actionLabelEn: "Student Attendance Record Updated",
    actionLabelHi: "छात्र उपस्थिति रिकॉर्ड अद्यतन",
    actionDescriptionGu: "ત્રિમાસિક ૯૨.૪% હાજરી પ્રમાણપત્ર DBT હપ્તા માટે સબમિટ કર્યું",
    actionDescriptionEn: "92.4% verified quarterly attendance submitted for DBT tranche",
    actionDescriptionHi: "डीबीटी किस्त के लिए 92.4% त्रैमासिक उपस्थिति दर्ज की गई",
    entityType: "Application",
    entityId: "APP-2026-003889",
    ipAddress: "117.204.42.10",
    locationGu: "શ્રી સરદાર પટેલ હાઇસ્કૂલ, આણંદ",
    locationEn: "Shree Sardar Patel High School, Anand",
    locationHi: "श्री सरदार पटेल हाई स्कूल, आणंद",
    result: "SUCCESS",
    resultLabelGu: "સફળ",
    resultLabelEn: "Success",
    resultLabelHi: "सफल",
    hash: "33ea981182049182aa102938ca91048fa741940182948190284019284019520a",
    previousHash: "620fc1290042a98f129038ba018249fa8471049281a941829048a9102948ca09",
    severity: "ROUTINE VERIFIED",
    dscStatusGu: "માન્ય (Aadhaar eSign OTP)",
    dscStatusEn: "Valid (Aadhaar eSign OTP)",
    dscStatusHi: "मान्य (आधार ई-साइन ओटीपी)",
    networkGu: "BSNL Broadband (School Static IP)",
    networkEn: "BSNL Broadband (School Static IP)",
    networkHi: "बीएसएनएल ब्रॉडबैंड (स्कूल स्टेटिक आईपी)",
    signatoryGu: "ડૉ. કલ્પેશ શાહ (Principal ID: SCH-241502)",
    signatoryEn: "Dr. Kalpesh Shah (Principal ID: SCH-241502)",
    signatoryHi: "डॉ. कल्पेश शाह (प्रिंसिपल आईडी: SCH-241502)",
    merkleStatusGu: "માન્ય (0 ms)",
    merkleStatusEn: "Valid (0 ms)",
    merkleStatusHi: "मान्य (0 ms)",
    diffLines: [
      { type: "comment", text: "// Attendance Record Sync" },
      { type: "remove", text: '- "attendance_pct": 74.2, "eligible_tranche": false,', noteGu: "અગાઉ", noteEn: "Prior State", noteHi: "पूर्व स्थिति" },
      { type: "add", text: '+ "attendance_pct": 92.31, "eligible_tranche": true,', noteGu: "નવું ૯૨.૩%", noteEn: "New 92.3%", noteHi: "नया 92.3%" },
      { type: "add", text: '+ "days_present": 60, "total_days": 65', noteGu: "૬૦/૬૫ દિવસ", noteEn: "60/65 days", noteHi: "60/65 दिन" },
    ],
    payloadJson: {
      student_id: "STU-GJ-2026-9923",
      quarter: "Q3_2025_26",
      working_days: 65,
      days_present: 60,
      attendance_pct: 92.31,
      eligible_for_tranche: true,
    },
  },
];

export default function AdminAuditPage() {
  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [actorFilter, setActorFilter] = useState<string>("all");
  const [actionFilter, setActionFilter] = useState<string>("all");
  const [entityFilter, setEntityFilter] = useState<string>("all");
  const [dateRange, setDateRange] = useState<string>("7d");

  // Selection & UI States
  const [selectedLogId, setSelectedLogId] = useState<string>("LOG-GJ-2026-99412");
  const [expandedLogIds, setExpandedLogIds] = useState<Record<string, boolean>>({});
  const [perPage, setPerPage] = useState<number>(25);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  // Verification Animation State
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyMessage, setVerifyMessage] = useState<string | null>(null);

  // RTI Reference Number Generator State
  const [rtiRef, setRtiRef] = useState<string | null>(null);

  // Active selected log object
  const activeLog = useMemo(() => {
    return MOCK_AUDIT_LOGS.find((l) => l.id === selectedLogId) || MOCK_AUDIT_LOGS[0];
  }, [selectedLogId]);

  // Filtered logs
  const filteredLogs = useMemo(() => {
    return MOCK_AUDIT_LOGS.filter((log) => {
      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          log.id.toLowerCase().includes(query) ||
          log.actorNameEn.toLowerCase().includes(query) ||
          log.actorNameGu.includes(query) ||
          log.entityId.toLowerCase().includes(query) ||
          log.ipAddress.toLowerCase().includes(query) ||
          log.action.toLowerCase().includes(query) ||
          log.actionLabelEn.toLowerCase().includes(query) ||
          log.actionLabelGu.includes(query);

        if (!matchesSearch) return false;
      }

      // Actor Filter (all, user, system, or specific role)
      if (actorFilter !== "all") {
        if (actorFilter === "user" && log.actorType !== "user") return false;
        if (actorFilter === "system" && log.actorType !== "system") return false;
        if (actorFilter === "state_admin" && log.actorRoleCategory !== "admin") return false;
        if (actorFilter === "deo" && log.actorRoleCategory !== "deo") return false;
        if (actorFilter === "principal" && log.actorRoleCategory !== "school") return false;
      }

      // Action Filter
      if (actionFilter !== "all" && log.action !== actionFilter) {
        return false;
      }

      // Entity Filter
      if (entityFilter !== "all" && log.entityType !== entityFilter) {
        return false;
      }

      return true;
    });
  }, [searchQuery, actorFilter, actionFilter, entityFilter]);

  // Pagination calculation
  const totalLogs = filteredLogs.length;
  const totalPages = Math.ceil(totalLogs / perPage) || 1;
  const paginatedLogs = useMemo(() => {
    const start = (currentPage - 1) * perPage;
    return filteredLogs.slice(start, start + perPage);
  }, [filteredLogs, currentPage, perPage]);

  // Handle row expansion
  const toggleRowExpand = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedLogIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Handle row selection
  const selectRow = (id: string) => {
    setSelectedLogId(id);
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery("");
    setActorFilter("all");
    setActionFilter("all");
    setEntityFilter("all");
    setDateRange("7d");
    setCurrentPage(1);
  };

  // Copy hash helper
  const handleCopyHash = (hash: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => {
      setCopiedHash(null);
    }, 2000);
  };

  // Verify chain simulation
  const handleVerifyChain = () => {
    setIsVerifying(true);
    setVerifyMessage(null);
    setTimeout(() => {
      setIsVerifying(false);
      setVerifyMessage("verified");
      setTimeout(() => {
        setVerifyMessage(null);
      }, 3500);
    }, 850);
  };

  // Export to CSV function
  const handleExportCsv = () => {
    const headers = [
      "Event ID",
      "Block #",
      "Timestamp",
      "Actor Name",
      "Actor Role",
      "Actor Type",
      "Action",
      "Entity Type",
      "Entity ID",
      "IP Address",
      "Location",
      "Result",
      "SHA-256 Hash",
      "Previous Hash",
    ];

    const rows = filteredLogs.map((log) => [
      log.id,
      log.blockNumber,
      `"${log.timestamp}"`,
      `"${log.actorNameEn}"`,
      `"${log.actorRoleEn}"`,
      log.actorType,
      log.action,
      log.entityType,
      log.entityId,
      log.ipAddress,
      `"${log.locationEn}"`,
      log.result,
      log.hash,
      log.previousHash,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `vidya_pragati_audit_logs_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Generate RTI Query reference
  const handleGenerateRti = () => {
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    setRtiRef(`RTI-GJ-2026-${randomNum}`);
  };

  // Action badge color styling helper
  const getActionBadgeClass = (action: ActionType) => {
    switch (action) {
      case "APPROVE":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "REJECT":
        return "bg-rose-50 text-rose-700 border-rose-200";
      case "CREATE":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "UPDATE":
        return "bg-amber-50 text-amber-800 border-amber-200";
      case "DELETE":
        return "bg-purple-50 text-purple-700 border-purple-200";
      default:
        return "bg-surface-container-high text-on-surface";
    }
  };

  const getResultBadgeClass = (result: string) => {
    switch (result) {
      case "SUCCESS":
        return "bg-emerald-100 text-emerald-800";
      case "REJECTED":
        return "bg-rose-100 text-rose-800";
      case "BLOCKED":
        return "bg-error-container text-on-error-container";
      case "TERMINATED":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-surface-container-high text-on-surface";
    }
  };

  return (
    <OfficerShell role="admin">
      <div className="w-full bg-surface px-4 sm:px-6 py-6 flex flex-col gap-6">
        {/* 1. Header & Command Action Bar */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/60">
          <div className="flex flex-col gap-1.5">
            {/* Breadcrumb Navigation */}
            <nav className="flex items-center gap-2 font-caption text-caption text-outline">
              <Link href="/admin" className="hover:text-primary transition-colors">
                <T gu="શિક્ષણ વિભાગ" en="Education Department" hi="शिक्षा विभाग" />
              </Link>
              <span>›</span>
              <Link href="/admin" className="hover:text-primary transition-colors">
                <T gu="રાજ્ય કમાન્ડ એન્ડ એનાલિટિક્સ સેન્ટર" en="State Command & Analytics Centre" hi="राज्य कमान एवं विश्लेषिकी केंद्र" />
              </Link>
              <span>›</span>
              <span className="text-primary font-semibold">
                <T
                  gu="ઓડિટ લૉગ્સ અને ક્રિપ્ટોગ્રાફિક ટ્રેઇલ (GR: AUDIT/CAG/2026/03)"
                  en="Audit Logs & Cryptographic Trail (GR: AUDIT/CAG/2026/03)"
                  hi="ऑडिट लॉग और क्रिप्टोग्राफिक ट्रेल (GR: AUDIT/CAG/2026/03)"
                />
              </span>
            </nav>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
                <T
                  gu="સંપૂર્ણ ઓડિટ ટ્રેઇલ અને ક્રિપ્ટોગ્રાફિક સુરક્ષા"
                  en="Immutable Audit Trail & Cryptographic Security"
                  hi="संपूर्ण ऑडिट ट्रेल और क्रिप्टोग्राफिक सुरक्षा"
                />
              </h1>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-high text-primary font-label-md text-label-md">
                <Icon name="lock" size={16} fill className="text-primary" />
                <T
                  gu="બ્લોકચેન-ગ્રેડ ઇન્ટિગ્રિટી ચેઇન v2.4 (Verified Active)"
                  en="Blockchain-Grade Integrity Chain v2.4 (Verified Active)"
                  hi="ब्लॉकचेन-ग्रेड इंटीग्रिटी चेन v2.4 (Verified Active)"
                />
              </span>
            </div>

            <p className="font-body-sm text-body-sm text-on-surface-variant max-w-3xl">
              <T
                gu="CAG માર્ગદર્શિકા અને RTI અધિનિયમ ૨૦૦૫ હેઠળ તમામ વહીવટી, નીતિગત અને DBT નિર્ણયોની અપરિવર્તનીય (Immutable) ડિજિટલ સાબિતી."
                en="Tamper-evident, cryptographically chained proof of all administrative, policy, and DBT decisions under CAG guidelines and RTI Act 2005."
                hi="सीएजी दिशानिर्देशों और आरटीआई अधिनियम 2005 के तहत सभी प्रशासनिक, नीतिगत और डीबीटी निर्णयों का डिजिटल अपरिवर्तनीय प्रमाण।"
              />
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={handleVerifyChain}
              disabled={isVerifying}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-surface-container text-primary hover:bg-surface-container-high font-label-lg text-label-lg transition-colors shadow-sm border border-outline-variant/60"
            >
              {isVerifying ? (
                <>
                  <Icon name="refresh" size={18} className="animate-spin text-primary" />
                  <T gu="ચકાસણી ચાલુ છે..." en="Verifying Chain..." hi="सत्यापन जारी है..." />
                </>
              ) : verifyMessage === "verified" ? (
                <>
                  <Icon name="task_alt" size={18} fill className="text-emerald-600" />
                  <span className="text-emerald-700 font-bold">
                    <T gu="ચેઇન માન્ય છે (0 ભૂલ)" en="Chain Valid (0 Errors)" hi="चेन मान्य है (0 त्रुटि)" />
                  </span>
                </>
              ) : (
                <>
                  <Icon name="verified" size={18} className="text-primary" />
                  <T gu="ઇન્ટિગ્રિટી ચેઇન ચકાસો" en="Verify Integrity Chain" hi="इंटीग्रिटी चेन जांचें" />
                </>
              )}
            </button>

            <button
              onClick={handleExportCsv}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-on-primary hover:bg-primary-container font-label-lg text-label-lg transition-all shadow-sm"
              title="Export filtered records to CSV"
            >
              <Icon name="file_download" size={18} />
              <T gu="RTI / CAG એક્સપોર્ટ (.CSV)" en="Export to CSV (.CSV)" hi="आरटीआई / सीएजी निर्यात (.CSV)" />
            </button>
          </div>
        </div>

        {/* 2. Security & Audit KPI Strip (5 Bento Metric Cards) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Card 1 */}
          <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm border border-outline-variant/60 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <span className="font-caption text-caption text-on-surface-variant font-semibold">
                <T gu="કુલ ઓડિટેડ ઇવેન્ટ્સ" en="Total Audited Events" hi="कुल ऑडिटेड इवेंट्स" />
              </span>
              <div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-primary">
                <Icon name="timeline" size={20} className="text-primary" />
              </div>
            </div>
            <div className="pt-3">
              <div className="font-headline-md text-headline-md text-on-surface tracking-tight">
                <T gu="૨૪,૧૮,૫૪૦" en="24,18,540" hi="24,18,540" />
              </div>
              <div className="flex items-center gap-1 mt-1 font-caption text-caption text-emerald-700">
                <Icon name="trending_up" size={15} />
                <span className="font-semibold">
                  <T gu="+૧,૪૨૦ આજે લાઇવ રેકોર્ડ્ડ" en="+1,420 Live Today" hi="+1,420 आज लाइव दर्ज" />
                </span>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm border border-outline-variant/60 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <span className="font-caption text-caption text-on-surface-variant font-semibold">
                <T gu="ચેઇન અખંડિતતા સ્થિતિ" en="Chain Integrity Status" hi="चेन अखंडता स्थिति" />
              </span>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <Icon name="verified_user" size={20} fill className="text-emerald-700" />
              </div>
            </div>
            <div className="pt-3">
              <div className="font-headline-md text-headline-md text-on-surface tracking-tight">
                <T gu="૧૦૦% અખંડિત" en="100% Intact" hi="100% अखंडित" />
              </div>
              <div className="flex items-center gap-1.5 mt-1 font-caption text-caption">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                <span className="text-emerald-700 font-semibold">Tamper-Proof ✓ Verified</span>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm border border-outline-variant/60 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <span className="font-caption text-caption text-on-surface-variant font-semibold">
                <T gu="વહીવટી નિર્ણયો" en="Administrative Actions" hi="प्रशासनिक निर्णय" />
              </span>
              <div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-primary">
                <Icon name="manage_accounts" size={20} className="text-primary" />
              </div>
            </div>
            <div className="pt-3">
              <div className="font-headline-md text-headline-md text-on-surface tracking-tight">
                <T gu="૧૨,૮૪૫" en="12,845" hi="12,845" />
              </div>
              <span className="font-caption text-caption text-on-surface-variant mt-1 block">
                <T gu="યોજના નીતિ & DBT મંજૂરીઓ" en="Policy & DBT Approvals" hi="योजना नीति एवं डीबीटी अनुमोदन" />
              </span>
            </div>
          </div>

          {/* Card 4 */}
          <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm border border-outline-variant/60 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <span className="font-caption text-caption text-on-surface-variant font-semibold">
                <T gu="સિસ્ટમ અને સુરક્ષા એલર્ટ્સ" en="System & Security Alerts" hi="सिस्टम और सुरक्षा अलर्ट" />
              </span>
              <div className="w-8 h-8 rounded-lg bg-error-container text-on-error-container flex items-center justify-center">
                <Icon name="gpp_maybe" size={20} className="text-error" />
              </div>
            </div>
            <div className="pt-3">
              <div className="font-headline-md text-headline-md text-error tracking-tight">
                <T gu="૩,૮૧૨" en="3,812" hi="3,812" />
              </div>
              <span className="font-caption text-caption text-on-surface-variant mt-1 block">
                <T gu="ફ્રોડ બ્લોક & IP ડિટેક્શન" en="Fraud Block & IP Detections" hi="धोखाधड़ी ब्लॉक व आईपी पहचान" />
              </span>
            </div>
          </div>

          {/* Card 5 */}
          <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm border border-outline-variant/60 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <span className="font-caption text-caption text-on-surface-variant font-semibold">
                <T gu="છેલ્લો ઓડિટ સિંક" en="Last Audit Sync" hi="अंतिम ऑडिट सिंक" />
              </span>
              <div className="w-8 h-8 rounded-lg bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center">
                <Icon name="tag" size={20} className="text-secondary" />
              </div>
            </div>
            <div className="pt-3">
              <div className="font-headline-md text-headline-md text-on-surface tracking-tight">
                <T gu="૧૪ મિ. પહેલાં" en="14 min ago" hi="14 मिनट पहले" />
              </div>
              <div className="flex items-center gap-1 font-caption text-caption text-outline mt-1 font-mono">
                <span>
                  <T gu="બ્લોક #૮૪,૯૨૧ (SHA-256)" en="Block #84,921 (SHA-256)" hi="ब्लॉक #84,921 (SHA-256)" />
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Filter & Search Controls Bar */}
        <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm border border-outline-variant/60 flex flex-col gap-3">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            {/* Search Input */}
            <div className="md:col-span-4 relative flex items-center">
              <span className="absolute left-3 text-outline">
                <Icon name="search" size={20} />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full h-11 pl-10 pr-3 rounded-lg bg-surface border border-outline-variant/70 text-on-surface placeholder:text-outline font-body-sm text-body-sm focus:outline-none focus:border-primary focus:bg-surface-container-lowest shadow-sm transition-all"
                placeholder="ઇવેન્ટ ID, અધિકારીનું નામ, એન્ટિટી ID અથવા IP શોધો..."
              />
            </div>

            {/* Dropdown 1: Actor / Role (User / System) */}
            <div className="md:col-span-2">
              <select
                value={actorFilter}
                onChange={(e) => {
                  setActorFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full h-11 px-3 rounded-lg bg-surface border border-outline-variant/70 text-on-surface font-body-sm text-body-sm focus:outline-none focus:border-primary shadow-sm cursor-pointer"
              >
                <option value="all">ભૂમિકા: તમામ (All Actors)</option>
                <option value="user">વપરાશકર્તા (All Users)</option>
                <option value="system">સિસ્ટમ / AI (System Services)</option>
                <option value="state_admin">State Admin (સચિવાલય)</option>
                <option value="deo">DEO Office (જિલ્લા)</option>
                <option value="principal">School Principal (શાળા)</option>
              </select>
            </div>

            {/* Dropdown 2: Action Type */}
            <div className="md:col-span-2">
              <select
                value={actionFilter}
                onChange={(e) => {
                  setActionFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full h-11 px-3 rounded-lg bg-surface border border-outline-variant/70 text-on-surface font-body-sm text-body-sm focus:outline-none focus:border-primary shadow-sm cursor-pointer"
              >
                <option value="all">ક્રિયા: તમામ (All Actions)</option>
                <option value="APPROVE">APPROVE (મંજૂર)</option>
                <option value="REJECT">REJECT (નામંજૂર)</option>
                <option value="CREATE">CREATE (બનાવો)</option>
                <option value="UPDATE">UPDATE (સુધારો)</option>
                <option value="DELETE">DELETE (કાઢી નાખો)</option>
              </select>
            </div>

            {/* Dropdown 3: Entity Type */}
            <div className="md:col-span-2">
              <select
                value={entityFilter}
                onChange={(e) => {
                  setEntityFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full h-11 px-3 rounded-lg bg-surface border border-outline-variant/70 text-on-surface font-body-sm text-body-sm focus:outline-none focus:border-primary shadow-sm cursor-pointer"
              >
                <option value="all">એન્ટિટી: તમામ (All Entities)</option>
                <option value="Application">Application (અરજી)</option>
                <option value="Scheme">Scheme (યોજના)</option>
                <option value="User">User / Account (વપરાશકર્તા)</option>
              </select>
            </div>

            {/* Date Range Picker & Reset */}
            <div className="md:col-span-2 flex items-center gap-2">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="flex-1 h-11 px-2.5 rounded-lg bg-surface border border-outline-variant/70 text-on-surface font-label-md text-label-md focus:outline-none focus:border-primary shadow-sm cursor-pointer truncate"
              >
                <option value="today">આજે (Today)</option>
                <option value="7d">૧૯ ફેબ્રુ - ૨૬ ફેબ્રુ ૨૦૨૬ (7d)</option>
                <option value="30d">છેલ્લા ૩૦ દિવસ (30d)</option>
                <option value="all">તમામ તારીખો (All Time)</option>
              </select>

              <button
                onClick={resetFilters}
                className="w-11 h-11 rounded-lg bg-surface border border-outline-variant/70 hover:bg-surface-container-high text-on-surface-variant flex items-center justify-center shadow-sm transition-colors shrink-0"
                title="ફિલ્ટર રીસેટ કરો (Reset Filters)"
              >
                <Icon name="restart_alt" size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* 4. Main Content Area (Split 65% Main Audit Table, 35% Deep Inspection Panel) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left 65%: Audit Logs Table */}
          <div className="lg:col-span-8 bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/60 overflow-hidden flex flex-col">
            {/* Table Header Bar */}
            <div className="p-4 bg-surface-container-low flex flex-wrap items-center justify-between gap-3 border-b border-outline-variant/60">
              <div className="flex items-center gap-2.5">
                <Icon name="database" size={20} className="text-primary" />
                <span className="font-title-md text-title-md text-on-surface">
                  <T gu="લાઇવ ઇવેન્ટ ટ્રાન્ઝેક્શન લોગ્સ" en="Live Event Transaction Logs" hi="लाइव इवेंट लेनदेन लॉग्स" />
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-surface-container-high font-label-md text-label-md text-primary font-semibold">
                  <T
                    gu={`${totalLogs} રેકોર્ડ્સ`}
                    en={`${totalLogs} Records`}
                    hi={`${totalLogs} रिकॉर्ड`}
                  />
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
                <span className="font-caption text-caption text-on-surface-variant font-medium">
                  <T gu="રીયલ-ટાઇમ બ્લોક સમન્વયન" en="Real-Time Block Sync" hi="रियल-टाइम ब्लॉक सिंक" />
                </span>
              </div>
            </div>

            {/* Responsive Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-lowest font-label-md text-label-md text-outline uppercase tracking-wider border-b border-outline-variant/60">
                    <th className="py-3 px-4">
                      <T gu="ટાઈમસ્ટેમ્પ" en="Timestamp" hi="समय" />
                    </th>
                    <th className="py-3 px-4">
                      <T gu="અભિનેતા અને ભૂમિકા" en="Actor & Role" hi="अभिनेता व भूमिका" />
                    </th>
                    <th className="py-3 px-4">
                      <T gu="ક્રિયા અને વિગત" en="Action & Detail" hi="क्रिया और विवरण" />
                    </th>
                    <th className="py-3 px-4">
                      <T gu="એન્ટિટી" en="Entity" hi="इकाई" />
                    </th>
                    <th className="py-3 px-4">
                      <T gu="IP સરનામું" en="IP & Location" hi="आईपी और स्थान" />
                    </th>
                    <th className="py-3 px-4">
                      <T gu="પરિણામ" en="Result" hi="परिणाम" />
                    </th>
                    <th className="py-3 px-4">
                      <T gu="SHA-256 હેશ" en="Hash & Diff" hi="हैश और विवरण" />
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/40 text-on-surface">
                  {paginatedLogs.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-on-surface-variant">
                        <Icon name="search_off" size={32} className="mx-auto mb-2 text-outline" />
                        <p className="font-title-sm">
                          <T gu="કોઈ ઓડિટ રેકોર્ડ્સ મળ્યા નથી." en="No audit records matched your filter." hi="कोई ऑडिट रिकॉर्ड नहीं मिला।" />
                        </p>
                      </td>
                    </tr>
                  ) : (
                    paginatedLogs.map((log) => {
                      const isSelected = selectedLogId === log.id;
                      const isExpanded = !!expandedLogIds[log.id];

                      return (
                        <tr
                          key={log.id}
                          onClick={() => selectRow(log.id)}
                          className={`transition-colors cursor-pointer group ${
                            isSelected
                              ? "bg-primary/5 hover:bg-primary/10"
                              : "hover:bg-surface-container-low"
                          }`}
                        >
                          {/* Timestamp */}
                          <td className="py-3.5 px-4 font-body-sm text-body-sm whitespace-nowrap">
                            <div className="flex flex-col">
                              <span
                                className={`font-semibold ${
                                  isSelected ? "text-primary" : "text-on-surface"
                                }`}
                              >
                                {log.timestamp.split(",")[0]}
                              </span>
                              <span className="font-caption text-caption text-outline">
                                {log.timestamp.split(",")[1]?.trim()}
                              </span>
                            </div>
                          </td>

                          {/* Actor & Role */}
                          <td className="py-3.5 px-4 font-body-sm text-body-sm">
                            <div className="flex items-center gap-2">
                              {log.actorType === "system" ? (
                                <div className="w-7 h-7 rounded-full bg-surface-container-high flex items-center justify-center text-primary font-bold text-xs shrink-0">
                                  {log.initials}
                                </div>
                              ) : (
                                <span className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center font-label-md text-label-md text-primary font-bold shrink-0">•</span>
                              )}
                              <div className="flex flex-col min-w-[120px]">
                                <span className="font-semibold text-on-surface leading-tight">
                                  <T gu={log.actorNameGu} en={log.actorNameEn} hi={log.actorNameHi} />
                                </span>
                                <span
                                  className={`font-caption text-caption ${
                                    log.actorType === "system"
                                      ? "text-outline"
                                      : "text-primary font-semibold"
                                  }`}
                                >
                                  <T gu={log.actorRoleGu} en={log.actorRoleEn} hi={log.actorRoleHi} />
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* Action & Detail */}
                          <td className="py-3.5 px-4 font-body-sm text-body-sm max-w-[200px]">
                            <div className="flex flex-col">
                              <div className="flex items-center gap-1.5 mb-0.5">
                                <span
                                  className={`px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider border ${getActionBadgeClass(
                                    log.action
                                  )}`}
                                >
                                  {log.action}
                                </span>
                              </div>
                              <span
                                className="text-on-surface-variant font-caption text-caption truncate"
                                title={log.actionDescriptionEn}
                              >
                                <T
                                  gu={log.actionDescriptionGu}
                                  en={log.actionDescriptionEn}
                                  hi={log.actionDescriptionHi}
                                />
                              </span>
                            </div>
                          </td>

                          {/* Entity Type & ID */}
                          <td className="py-3.5 px-4 font-body-sm text-body-sm whitespace-nowrap">
                            <div className="flex flex-col">
                              <span className="font-caption text-caption text-outline uppercase font-semibold">
                                {log.entityType}
                              </span>
                              <span className="px-2 py-0.5 mt-0.5 rounded bg-surface-container font-mono text-xs font-semibold text-primary inline-block">
                                {log.entityId}
                              </span>
                            </div>
                          </td>

                          {/* IP & Location */}
                          <td className="py-3.5 px-4 font-body-sm text-body-sm whitespace-nowrap">
                            <div className="flex flex-col font-caption text-caption">
                              <span className="font-mono text-on-surface">{log.ipAddress}</span>
                              <span className="text-outline truncate max-w-[130px]">
                                <T gu={log.locationGu} en={log.locationEn} hi={log.locationHi} />
                              </span>
                            </div>
                          </td>

                          {/* Result */}
                          <td className="py-3.5 px-4 font-body-sm text-body-sm whitespace-nowrap">
                            <span
                              className={`px-2 py-0.5 rounded-full text-xs font-bold inline-flex items-center gap-1 ${getResultBadgeClass(
                                log.result
                              )}`}
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-current" />
                              <T gu={log.resultLabelGu} en={log.resultLabelEn} hi={log.resultLabelHi} />
                            </span>
                          </td>

                          {/* SHA-256 Hash Badge & Expand Action */}
                          <td className="py-3.5 px-4 font-body-sm text-body-sm whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              {/* Tamper-evident hash badge */}
                              <button
                                onClick={(e) => handleCopyHash(log.hash, e)}
                                title="Click to copy full SHA-256 hash"
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-caption text-caption font-mono border border-emerald-200 transition-colors"
                              >
                                <Icon name="check_circle" size={13} fill className="text-emerald-700" />
                                <span>
                                  {copiedHash === log.hash
                                    ? "Copied!"
                                    : `${log.hash.slice(0, 8)}...${log.hash.slice(-4)}`}
                                </span>
                              </button>

                              {/* Inline accordion expand button */}
                              <button
                                onClick={(e) => toggleRowExpand(log.id, e)}
                                className="w-7 h-7 rounded hover:bg-surface-container-high text-on-surface-variant flex items-center justify-center transition-colors"
                                title="Payload વિગત દર્શાવો / છુપાવો"
                              >
                                <Icon
                                  name={isExpanded ? "expand_less" : "expand_more"}
                                  size={18}
                                />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Inline Accordion Payloads (for rows toggled open) */}
            {paginatedLogs.map((log) => {
              if (!expandedLogIds[log.id]) return null;
              return (
                <div
                  key={`payload-${log.id}`}
                  className="bg-surface-container-low/70 border-t border-b border-outline-variant/60 p-4 animate-fade-in"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-label-md text-label-md font-bold text-on-surface flex items-center gap-1.5">
                      <Icon name="code" size={16} className="text-primary" />
                      <T
                        gu={`વિનંતી પેલોડ અને વિગત (${log.id})`}
                        en={`Request Payload & Audit Details (${log.id})`}
                        hi={`अनुरोध पेलोड एवं विवरण (${log.id})`}
                      />
                    </span>
                    <span className="font-mono text-xs text-outline">Block #{log.blockNumber}</span>
                  </div>
                  <pre className="bg-inverse-surface text-inverse-on-surface p-3 rounded-lg font-mono text-xs overflow-x-auto leading-relaxed shadow-inner">
                    {JSON.stringify(log.payloadJson, null, 2)}
                  </pre>
                </div>
              );
            })}

            {/* Pagination Footer */}
            <div className="p-4 bg-surface-container-low flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-outline-variant/60">
              <div className="flex items-center gap-3">
                <span className="font-body-sm text-body-sm text-on-surface-variant">
                  <T
                    gu={`દર્શાવેલ ${Math.min((currentPage - 1) * perPage + 1, totalLogs)} - ${Math.min(
                      currentPage * perPage,
                      totalLogs
                    )} ના કુલ ${totalLogs} ઓડિટ લોગ્સ`}
                    en={`Showing ${Math.min(
                      (currentPage - 1) * perPage + 1,
                      totalLogs
                    )} - ${Math.min(currentPage * perPage, totalLogs)} of ${totalLogs} audit logs`}
                    hi={`दिखाया गया ${Math.min(
                      (currentPage - 1) * perPage + 1,
                      totalLogs
                    )} - ${Math.min(currentPage * perPage, totalLogs)} कुल ${totalLogs} ऑडिट लॉग में से`}
                  />
                </span>

                {/* Show 25/50/100 per page requirement */}
                <div className="flex items-center gap-1 text-xs text-on-surface-variant">
                  <span className="font-medium">
                    <T gu="પ્રતિ પૃષ્ઠ:" en="Per page:" hi="प्रति पृष्ठ:" />
                  </span>
                  <select
                    value={perPage}
                    onChange={(e) => {
                      setPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="h-8 px-2 rounded bg-surface-container-lowest border border-outline-variant text-on-surface font-semibold text-xs cursor-pointer focus:outline-none"
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                </div>
              </div>

              {/* Page buttons */}
              <div className="flex items-center gap-1.5 font-label-md text-label-md">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="w-8 h-8 rounded flex items-center justify-center bg-surface-container-lowest border border-outline-variant/70 text-on-surface-variant hover:bg-surface-container-high transition-colors shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Icon name="chevron_left" size={18} />
                </button>

                {Array.from({ length: totalPages }).map((_, idx) => {
                  const pageNum = idx + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-8 h-8 rounded flex items-center justify-center font-bold shadow-sm transition-colors ${
                        currentPage === pageNum
                          ? "bg-primary text-on-primary"
                          : "bg-surface-container-lowest border border-outline-variant/70 text-on-surface hover:bg-surface-container-high"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="w-8 h-8 rounded flex items-center justify-center bg-surface-container-lowest border border-outline-variant/70 text-on-surface-variant hover:bg-surface-container-high transition-colors shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Icon name="chevron_right" size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Right 35%: Deep Inspection & Cryptographic Diff Drawer */}
          <div className="lg:col-span-4 bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/60 overflow-hidden flex flex-col gap-4 p-5 sticky top-20">
            {/* Card Header */}
            <div className="flex items-start justify-between gap-2 border-b border-outline-variant/60 pb-3">
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <Icon name="find_in_page" size={22} className="text-secondary" />
                  <h2 className="font-title-lg text-title-lg text-on-surface">
                    <T gu="ઇન્સ્પેક્શન અને ડિફ વિશ્લેષણ" en="Inspection & Diff Analysis" hi="निरीक्षण और डिफ विश्लेषण" />
                  </h2>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="font-caption text-caption text-outline">
                    <T gu="ઇવેન્ટ આઈડી:" en="Event ID:" hi="इवेंट आईडी:" />
                  </span>
                  <span className="font-mono text-xs px-2 py-0.5 rounded bg-surface-container-high text-primary font-bold">
                    {activeLog.id}
                  </span>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-error-container text-on-error-container font-label-md text-label-md font-bold whitespace-nowrap">
                {activeLog.severity}
              </span>
            </div>

            {/* Metadata Summary Grid */}
            <div className="bg-surface-container-low rounded-lg p-3 grid grid-cols-1 gap-2.5 font-body-sm text-body-sm border border-outline-variant/40">
              <div className="flex items-center justify-between">
                <span className="text-on-surface-variant font-caption text-caption">
                  <T gu="ડિજિટલ સહી (DSC):" en="Digital Signature (DSC):" hi="डिजिटल हस्ताक्षर (डीएससी):" />
                </span>
                <span className="font-mono font-semibold text-emerald-700 flex items-center gap-1 text-xs">
                  <Icon name="verified" size={15} fill className="text-emerald-700" />
                  <T gu={activeLog.dscStatusGu} en={activeLog.dscStatusEn} hi={activeLog.dscStatusHi} />
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-on-surface-variant font-caption text-caption">
                  <T gu="સુરક્ષિત નેટવર્ક:" en="Secure Network:" hi="सुरक्षित नेटवर्क:" />
                </span>
                <span className="font-semibold text-on-surface text-xs text-right truncate max-w-[200px]">
                  <T gu={activeLog.networkGu} en={activeLog.networkEn} hi={activeLog.networkHi} />
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-on-surface-variant font-caption text-caption">
                  <T gu="સત્તાવાર સહીકર્તા:" en="Authorized Signer:" hi="अधिकृत हस्ताक्षरकर्ता:" />
                </span>
                <span className="font-semibold text-primary text-xs text-right truncate max-w-[200px]">
                  <T gu={activeLog.signatoryGu} en={activeLog.signatoryEn} hi={activeLog.signatoryHi} />
                </span>
              </div>
            </div>

            {/* Cryptographic Chain Verification Block */}
            <div className="bg-surface-container rounded-lg p-3.5 flex flex-col gap-2.5 border border-outline-variant/50">
              <div className="flex items-center justify-between">
                <span className="font-label-md text-label-md font-bold text-primary flex items-center gap-1.5">
                  <Icon name="account_tree" size={18} className="text-primary" />
                  <T gu="ક્રિપ્ટોગ્રાફિક સાંકળ પુરાવો" en="Cryptographic Chain Proof" hi="क्रिप्टोग्राफिक चेन प्रमाण" />
                </span>
                <span className="font-caption text-caption bg-surface-container-lowest px-2 py-0.5 rounded text-emerald-700 font-semibold border border-emerald-200">
                  Merkle Root: Valid (0 ms)
                </span>
              </div>

              <div className="space-y-1.5 font-mono text-xs text-on-surface-variant">
                <div className="flex items-center justify-between bg-surface-container-lowest p-2 rounded border border-outline-variant/40">
                  <span className="text-outline">
                    Previous Hash (#{activeLog.blockNumber - 1}):
                  </span>
                  <span className="text-on-surface font-semibold truncate ml-2">
                    {activeLog.previousHash.slice(0, 8)}...{activeLog.previousHash.slice(-4)}
                  </span>
                </div>
                <div className="flex items-center justify-between bg-surface-container-lowest p-2 rounded border border-outline-variant/40">
                  <span className="text-primary font-semibold">
                    Current Hash (#{activeLog.blockNumber}):
                  </span>
                  <span className="text-primary font-bold truncate ml-2">
                    {activeLog.hash.slice(0, 8)}...{activeLog.hash.slice(-4)}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 p-2 rounded bg-emerald-50 text-emerald-800 font-caption text-caption leading-tight border border-emerald-200/70">
                <Icon name="gavel" size={18} className="text-emerald-700 shrink-0" />
                <span>
                  <T
                    gu="CAG અને RTI ઓડિટ કાયદા ૨૦૦૫ મુજબ આ ડિજિટલ સહી અદાલતમાં માન્ય અફર કાનૂની પુરાવો છે."
                    en="Under CAG guidelines and RTI Act 2005, this digital hash is legally binding and admissible in court."
                    hi="सीएजी और आरटीआई अधिनियम 2005 के तहत यह डिजिटल हैश न्यायालय में कानूनी रूप से मान्य साक्ष्य है।"
                  />
                </span>
              </div>
            </div>

            {/* Visual JSON Diff Panel */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span className="font-label-md text-label-md font-bold text-on-surface flex items-center gap-1.5">
                  <Icon name="difference" size={18} className="text-outline" />
                  <T gu="JSON વિગતવાર ફેરફાર (Diff)" en="JSON Detailed Diff / Payload" hi="JSON विस्तृत डिफ / पेलोड" />
                </span>
                <span className="font-caption text-caption text-outline font-mono">v1.2 → v2.0</span>
              </div>

              <div className="bg-inverse-surface text-inverse-on-surface p-3 rounded-lg font-mono text-xs overflow-x-auto leading-relaxed shadow-inner max-h-64">
                {activeLog.diffLines && activeLog.diffLines.length > 0 ? (
                  activeLog.diffLines.map((line, idx) => {
                    if (line.type === "comment") {
                      return (
                        <div key={idx} className="text-outline mb-1 mt-1 text-[11px]">
                          {line.text}
                        </div>
                      );
                    }
                    if (line.type === "remove") {
                      return (
                        <div
                          key={idx}
                          className="bg-error/20 text-rose-300 px-2 py-1 rounded mb-1.5 flex items-center justify-between"
                        >
                          <span className="truncate">{line.text}</span>
                          {line.noteEn && (
                            <span className="text-rose-400 text-[11px] font-sans ml-2 shrink-0">
                              <T gu={line.noteGu || line.noteEn} en={line.noteEn} hi={line.noteHi || line.noteEn} />
                            </span>
                          )}
                        </div>
                      );
                    }
                    return (
                      <div
                        key={idx}
                        className="bg-emerald-950 text-emerald-300 px-2 py-1 rounded mb-1.5 flex items-center justify-between"
                      >
                        <span className="truncate">{line.text}</span>
                        {line.noteEn && (
                          <span className="text-emerald-400 text-[11px] font-sans ml-2 shrink-0">
                            <T gu={line.noteGu || line.noteEn} en={line.noteEn} hi={line.noteHi || line.noteEn} />
                          </span>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <pre className="text-inverse-on-surface leading-relaxed">
                    {JSON.stringify(activeLog.payloadJson, null, 2)}
                  </pre>
                )}
              </div>
            </div>

            {/* Security Actions */}
            <div className="flex flex-col gap-2 pt-1 border-t border-outline-variant/60">
              <button
                onClick={() => {
                  const blob = new Blob(
                    [`-----BEGIN PKCS7-----\nMIIB...VIDYA_PRAGATI_AUDIT_CERTIFICATE_${activeLog.id}\n-----END PKCS7-----`],
                    { type: "application/x-pkcs7-certificates" }
                  );
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = `${activeLog.id}_cert.p7b`;
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                className="w-full py-2.5 px-3 rounded-lg bg-surface-container hover:bg-surface-container-high text-primary font-label-md text-label-md flex items-center justify-center gap-2 transition-colors border border-outline-variant/40"
              >
                <Icon name="download_for_offline" size={18} />
                <T
                  gu="ડિજિટલી સાઇન્ડ ઓડિટ સર્ટિફિકેટ (.p7b)"
                  en="Download Signed Audit Cert (.p7b)"
                  hi="हस्ताक्षरित ऑडिट प्रमाणपत्र (.p7b)"
                />
              </button>

              <button
                onClick={handleGenerateRti}
                className="w-full py-2.5 px-3 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md flex items-center justify-center gap-2 transition-colors border border-outline-variant/40"
              >
                <Icon name="content_paste_go" size={18} />
                <T
                  gu="RTI ક્વેરી સંદર્ભ નંબર જનરેટ કરો"
                  en="Generate RTI Query Ref Number"
                  hi="आरटीआई प्रश्न संदर्भ संख्या उत्पन्न करें"
                />
              </button>

              {rtiRef && (
                <div className="p-2.5 rounded bg-surface-container-high text-center font-mono text-xs text-primary font-bold animate-fade-in border border-primary/20">
                  <T gu="RTI સંદર્ભ:" en="RTI Reference:" hi="आरटीआई संदर्भ:" /> {rtiRef}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 5. Bottom Integrity Verification Banner */}
        <div className="bg-surface-container-lowest rounded-xl p-5 shadow-sm border border-outline-variant/60 flex flex-col md:flex-row items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
              <Icon name="lock_clock" size={28} className="text-emerald-700" />
            </div>
            <div className="flex flex-col">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-title-md text-title-md text-on-surface">
                  <T
                    gu="WORM (Write Once Read Many) સિસ્ટમ અખંડિતતા ગેરંટી"
                    en="WORM (Write Once Read Many) System Integrity Guarantee"
                    hi="WORM (Write Once Read Many) सिस्टम अखंडता गारंटी"
                  />
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-label-md text-label-md font-bold">
                  100% Immutable
                </span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant max-w-4xl mt-0.5">
                <T
                  gu="આ તમામ લૉગ્સ WORM સ્ટોરેજ અને નેશનલ ઇન્ફોર્મેટિક્સ સેન્ટર (NIC) સિક્યોર્ડ તિજોરીમાં એનક્રિપ્ટેડ છે. કોઈપણ ડેટાબેઝ એડમિનિસ્ટ્રેટર કે બાહ્ય યુઝર દ્વારા આ રેકોર્ડ્સમાં ફેરફાર કે ડિલીટ કરવું અશક્ય છે."
                  en="All logs are stored on WORM storage encrypted in the National Informatics Centre (NIC) secured digital vault. Unauthorized alteration or deletion by database administrators or external users is cryptographically prohibited."
                  hi="ये सभी लॉग WORM स्टोरेज और राष्ट्रीय सूचना विज्ञान केंद्र (एनआईसी) सुरक्षित डिजिटल तिजोरी में एन्क्रिप्टेड हैं। इनमें किसी भी प्रकार का अनधिकृत परिवर्तन या विलोपन असंभव है।"
                />
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <div className="flex flex-col text-right">
              <span className="font-caption text-caption text-outline">
                <T gu="સ્ટેટ ઓડિટ સુપરવાઇઝર" en="State Audit Supervisor" hi="राज्य ऑडिट पर्यवेक्षक" />
              </span>
              <span className="font-label-md text-label-md font-bold text-on-surface">
                <T gu="NIC / CAG સેલ ગુજરાત" en="NIC / CAG Cell Gujarat" hi="एनआईसी / सीएजी प्रकोष्ठ गुजरात" />
              </span>
            </div>
            <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center text-primary">
              <Icon name="verified" size={24} fill className="text-primary" />
            </div>
          </div>
        </div>
      </div>
    </OfficerShell>
  );
}
