"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { OfficerShell } from "@/components/shell/OfficerShell";
import { T } from "@/components/T";
import { Icon } from "@/components/Icon";
import { StatusChip } from "@/components/ui";

interface SchoolAllocation {
  id: string;
  nameGu: string;
  nameEn: string;
  nameHi: string;
  udise: string;
  talukaGu: string;
  talukaEn: string;
  talukaHi: string;
  allocated: number;
  delivered: number;
  otpConfirmed: boolean;
  principalGu: string;
  principalEn: string;
  principalHi: string;
  contact: string;
  challanNo: string;
}

interface BatchRecord {
  id: string;
  modelGu: string;
  modelEn: string;
  modelHi: string;
  totalQuantity: number;
  deliveredQuantity: number;
  dispatchDateGu: string;
  dispatchDateEn: string;
  dispatchDateHi: string;
  status: "approved" | "pending" | "inprogress";
  statusType: "completed" | "in_transit" | "partial" | "pending";
  statusLabel: { gu: string; en: string; hi: string };
  vehicleNo: string;
  vehicleType: string;
  driverNameGu: string;
  driverNameEn: string;
  driverNameHi: string;
  driverContact: string;
  serialRange: string;
  currentLocationGu: string;
  currentLocationEn: string;
  currentLocationHi: string;
  speed: string;
  remainingTimeGu: string;
  remainingTimeEn: string;
  remainingTimeHi: string;
  eta: string;
  escrowAmount: string;
  escrowStatusGu: string;
  escrowStatusEn: string;
  escrowStatusHi: string;
  schools: SchoolAllocation[];
}

const INITIAL_BATCHES: BatchRecord[] = [
  {
    id: "CYCLE-2026-AN-001",
    modelGu: "એટલાસ ૨૨T (ગર્લ્સ મોડેલ ૨૦\")",
    modelEn: "Atlas 22T (Girl Model 20\")",
    modelHi: "एटलस 22T (गर्ल्स मॉडल 20\")",
    totalQuantity: 200,
    deliveredQuantity: 170,
    dispatchDateGu: "૨૪ ફેબ્રુઆરી ૨૦૨૬",
    dispatchDateEn: "24 Feb 2026",
    dispatchDateHi: "24 फ़रवरी 2026",
    status: "inprogress",
    statusType: "partial",
    statusLabel: {
      gu: "આંશિક વિતરિત (૮૫%)",
      en: "Partial Delivery (85%)",
      hi: "आंशिक वितरण (85%)",
    },
    vehicleNo: "GJ-23-AT-9012",
    vehicleType: "ટાટા 407 (Tata 407)",
    driverNameGu: "મહેશભાઈ રબારી",
    driverNameEn: "Maheshbhai Rabari",
    driverNameHi: "महेशभाई रबारी",
    driverContact: "+91 98254-41209",
    serialRange: "SSB-2026-077401 થી SSB-2026-077600",
    currentLocationGu: "વાંચ ટોલ પ્લાઝા (NH-48)",
    currentLocationEn: "Vanch Toll Plaza (NH-48)",
    currentLocationHi: "वांच टोल प्लाजा (NH-48)",
    speed: "૫૨ કિમી/કલાક (52 km/h)",
    remainingTimeGu: "બાકી ૪૨ મિનિટ",
    remainingTimeEn: "42 mins remaining",
    remainingTimeHi: "42 मिनट शेष",
    eta: "૨૪ ફેબ્રુ, બપોરે ૦૨:૩૦ વાગ્યે",
    escrowAmount: "₹ ૧૨.૮૦ લાખ",
    escrowStatusGu: "ઓડિટ & ચુકવણી સમીક્ષા",
    escrowStatusEn: "Audit & Payment Review",
    escrowStatusHi: "सत्यापन एवं भुगतान समीक्षा",
    schools: [
      {
        id: "sch-1",
        nameGu: "શ્રી સરદાર પટેલ હાઇસ્કૂલ",
        nameEn: "Shree Sardar Patel High School",
        nameHi: "श्री सरदार पटेल हाईस्कूल",
        udise: "24150100412",
        talukaGu: "પેટલાદ, આણંદ",
        talukaEn: "Petlad, Anand",
        talukaHi: "पेटलाद, आणंद",
        allocated: 120,
        delivered: 120,
        otpConfirmed: true,
        principalGu: "ડૉ. કલ્પેશ શાહ",
        principalEn: "Dr. Kalpesh Shah",
        principalHi: "डॉ. कल्पेश शाह",
        contact: "+91 98251-12001",
        challanNo: "CH-9921",
      },
      {
        id: "sch-2",
        nameGu: "નવજીવન કન્યા વિદ્યાલય",
        nameEn: "Navjivan Kanya Vidyalaya",
        nameHi: "नवजीवन कन्या विद्यालय",
        udise: "24150201103",
        talukaGu: "બોરસદ, આણંદ",
        talukaEn: "Borsad, Anand",
        talukaHi: "बोरसद, आणंद",
        allocated: 80,
        delivered: 50,
        otpConfirmed: false,
        principalGu: "શ્રીમતી મીનાબેન પટેલ",
        principalEn: "Mrs. Meenaben Patel",
        principalHi: "श्रीमती मीनाबेन पटेल",
        contact: "+91 94263-88219",
        challanNo: "CH-9922",
      },
    ],
  },
  {
    id: "CYCLE-2026-AN-002",
    modelGu: "એટલાસ ૨૨T (Atlas 22T)",
    modelEn: "Atlas 22T",
    modelHi: "एटलस 22T",
    totalQuantity: 150,
    deliveredQuantity: 0,
    dispatchDateGu: "૨૬ ફેબ્રુઆરી ૨૦૨૬",
    dispatchDateEn: "26 Feb 2026",
    dispatchDateHi: "26 फ़रवरी 2026",
    status: "inprogress",
    statusType: "in_transit",
    statusLabel: {
      gu: "રસ્તામાં (હમણાં જ રવાના)",
      en: "In Transit (Just Dispatched)",
      hi: "मार्ग में (हाल ही में रवाना)",
    },
    vehicleNo: "GJ-01-BX-4421",
    vehicleType: "આઇશર પ્રો ૨૦૪૯ (Eicher Pro)",
    driverNameGu: "રમેશભાઈ સોલંકી",
    driverNameEn: "Rameshbhai Solanki",
    driverNameHi: "रमेशभाई सोलंकी",
    driverContact: "+91 94280-55123",
    serialRange: "SSB-2026-077601 થી SSB-2026-077750",
    currentLocationGu: "નડિયાદ બાયપાસ ક્રોસિંગ",
    currentLocationEn: "Nadiad Bypass Crossing",
    currentLocationHi: "नडियाद बाईपास क्रॉसिंग",
    speed: "૪૮ કિમી/કલાક (48 km/h)",
    remainingTimeGu: "બાકી ૧ કલાક ૧૫ મિનિટ",
    remainingTimeEn: "1h 15m remaining",
    remainingTimeHi: "1 घंटा 15 मिनट शेष",
    eta: "૨૬ ફેબ્રુ, સાંજે ૦૪:૦૦ વાગ્યે",
    escrowAmount: "₹ ૧૧.૨૫ લાખ",
    escrowStatusGu: "ટ્રાન્ઝિટ એસ્ક્રો હોલ્ડ",
    escrowStatusEn: "Transit Escrow Hold",
    escrowStatusHi: "ट्रांजिट एस्क्रो होल्ड",
    schools: [
      {
        id: "sch-3",
        nameGu: "સરકારી ઉચ્ચતર માધ્યમિક શાળા, ઉમરેઠ",
        nameEn: "Govt Higher Secondary School, Umreth",
        nameHi: "सरकारी उच्चतर माध्यमिक शाला, उमरेठ",
        udise: "24150400819",
        talukaGu: "ઉમરેઠ, આણંદ",
        talukaEn: "Umreth, Anand",
        talukaHi: "उमरेठ, आणंद",
        allocated: 150,
        delivered: 0,
        otpConfirmed: false,
        principalGu: "શ્રી હિતેશભાઈ જોશી",
        principalEn: "Mr. Hiteshbhai Joshi",
        principalHi: "श्री हितेशभाई जोशी",
        contact: "+91 97129-30114",
        challanNo: "CH-9930",
      },
    ],
  },
  {
    id: "CYCLE-2026-AN-000",
    modelGu: "એટલાસ ૨૨T (Atlas 22T)",
    modelEn: "Atlas 22T",
    modelHi: "एटलस 22T",
    totalQuantity: 150,
    deliveredQuantity: 150,
    dispatchDateGu: "૨૨ ફેબ્રુઆરી ૨૦૨૬",
    dispatchDateEn: "22 Feb 2026",
    dispatchDateHi: "22 फ़रवरी 2026",
    status: "approved",
    statusType: "completed",
    statusLabel: {
      gu: "સફળ વિતરણ પૂર્ણ",
      en: "Completed (100%)",
      hi: "पूर्ण वितरण संपन्न",
    },
    vehicleNo: "GJ-23-AT-8810",
    vehicleType: "ટાટા 407 (Tata 407)",
    driverNameGu: "વિનોદભાઈ પ્રજાપતિ",
    driverNameEn: "Vinodbhai Prajapati",
    driverNameHi: "विनोदभाई प्रजापति",
    driverContact: "+91 98791-23456",
    serialRange: "SSB-2026-077251 થી SSB-2026-077400",
    currentLocationGu: "શાળા કેમ્પસ (હસ્તાંતરણ પૂર્ણ)",
    currentLocationEn: "School Campus (Delivered)",
    currentLocationHi: "स्कूल परिसर (वितरित)",
    speed: "૦ કિમી/કલાક",
    remainingTimeGu: "સંપૂર્ણ વિતરિત",
    remainingTimeEn: "Fully Delivered",
    remainingTimeHi: "पूर्ण वितरित",
    eta: "૨૨ ફેબ્રુ, બપોરે ૦૩:૪૦ વાગ્યે",
    escrowAmount: "₹ ૯.૬૦ લાખ મંજૂર",
    escrowStatusGu: "ટ્રેઝરી રિલીઝ આદેશ જારી",
    escrowStatusEn: "Treasury Release Order Issued",
    escrowStatusHi: "कोषागार रिलीज आदेश जारी",
    schools: [
      {
        id: "sch-4",
        nameGu: "સરકારી કન્યા હાઇસ્કૂલ, બોરસદ",
        nameEn: "Govt Girls High School, Borsad",
        nameHi: "सरकारी कन्या हाईस्कूल, बोरसद",
        udise: "24150200811",
        talukaGu: "બોરસદ, આણંદ",
        talukaEn: "Borsad, Anand",
        talukaHi: "बोरसद, आणंद",
        allocated: 150,
        delivered: 150,
        otpConfirmed: true,
        principalGu: "શ્રીમતી રંજનબેન દેસાઈ",
        principalEn: "Mrs. Ranjanben Desai",
        principalHi: "श्रीमती रंजनबेन देसाई",
        contact: "+91 98240-66778",
        challanNo: "CH-9884",
      },
    ],
  },
];

export default function VendorBatchDispatchPage() {
  const [batches, setBatches] = useState<BatchRecord[]>(INITIAL_BATCHES);
  const [expandedBatchId, setExpandedBatchId] = useState<string | null>("CYCLE-2026-AN-001");
  const [selectedBatchForMap, setSelectedBatchForMap] = useState<BatchRecord>(INITIAL_BATCHES[0]);
  const [activeFilter, setActiveFilter] = useState<"all" | "in_transit" | "partial" | "completed">("all");
  const [downloadToast, setDownloadToast] = useState<string | null>(null);
  const [createSuccessNotice, setCreateSuccessNotice] = useState<string | null>(null);

  // Form states
  const [formModel, setFormModel] = useState("Atlas 22T (Girl Model - 20 Inch)");
  const [formDistrict, setFormDistrict] = useState("આણંદ (Anand) — પેટલાદ (Petlad)");
  const [formSchool, setFormSchool] = useState("શ્રી સરદાર પટેલ હાઇસ્કૂલ, પેટલાદ (24150100412)");
  const [formQuantity, setFormQuantity] = useState("120");
  const [formVehicle, setFormVehicle] = useState("GJ-23-AT-9012 (ટાટા 407) | મહેશભાઈ રબારી");
  const [formEta, setFormEta] = useState("૨૬ ફેબ્રુઆરી ૨૦૨૬, બપોરે ૦૨:૩૦ વાગ્યે");

  const formSectionRef = useRef<HTMLDivElement>(null);

  const toggleExpand = (batchId: string) => {
    setExpandedBatchId((prev) => (prev === batchId ? null : batchId));
  };

  const scrollToForm = () => {
    if (formSectionRef.current) {
      formSectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      const selectEl = formSectionRef.current.querySelector("select");
      if (selectEl) {
        selectEl.focus();
      }
    }
  };

  const handleCreateBatch = (e: React.FormEvent) => {
    e.preventDefault();
    const qty = parseInt(formQuantity, 10) || 120;
    const newId = `CYCLE-2026-AN-00${batches.length + 1}`;
    const startSerial = 77751 + (batches.length - 2) * 200;
    const endSerial = startSerial + qty - 1;

    const newBatch: BatchRecord = {
      id: newId,
      modelGu: formModel,
      modelEn: formModel,
      modelHi: formModel,
      totalQuantity: qty,
      deliveredQuantity: 0,
      dispatchDateGu: "આજે (Today)",
      dispatchDateEn: "Today",
      dispatchDateHi: "आज",
      status: "inprogress",
      statusType: "in_transit",
      statusLabel: {
        gu: "નવી રવાના બેચ (GPS Active)",
        en: "Newly Dispatched (GPS Active)",
        hi: "हाल ही में रवाना (GPS सक्रिय)",
      },
      vehicleNo: formVehicle.split("|")[0]?.trim() || "GJ-23-AT-9012",
      vehicleType: "કન્ટેનર ટ્રક (Container Truck)",
      driverNameGu: formVehicle.split("|")[1]?.trim() || "ચાલક રબારી",
      driverNameEn: "Designated Driver",
      driverNameHi: "नामित चालक",
      driverContact: "+91 98254-41209",
      serialRange: `SSB-2026-0${startSerial} થી SSB-2026-0${endSerial}`,
      currentLocationGu: "વટવા GIDC ફેક્ટરી - ડિસ્પેચ યાર્ડ",
      currentLocationEn: "Vatva GIDC Factory - Dispatch Yard",
      currentLocationHi: "वटवा GIDC फैक्ट्री - प्रेषण यार्ड",
      speed: "૦ કિમી/કલાક (પ્રસ્થાન તૈયારી)",
      remainingTimeGu: "પ્રસ્થાન પ્રગતિમાં",
      remainingTimeEn: "Departure in progress",
      remainingTimeHi: "प्रस्थान प्रगति पर",
      eta: formEta,
      escrowAmount: `₹ ${(qty * 7500 / 100000).toFixed(2)} લાખ`,
      escrowStatusGu: "IFMS એસ્ક્રો બ્લોક સક્રિય",
      escrowStatusEn: "IFMS Escrow Block Active",
      escrowStatusHi: "IFMS एस्क्रो ब्लॉक सक्रिय",
      schools: [
        {
          id: `sch-new-${Date.now()}`,
          nameGu: formSchool.split("(")[0]?.trim() || formSchool,
          nameEn: formSchool.split("(")[0]?.trim() || formSchool,
          nameHi: formSchool.split("(")[0]?.trim() || formSchool,
          udise: formSchool.match(/\((.*?)\)/)?.[1] || "24150100412",
          talukaGu: formDistrict,
          talukaEn: formDistrict,
          talukaHi: formDistrict,
          allocated: qty,
          delivered: 0,
          otpConfirmed: false,
          principalGu: "આચાર્ય કચેરી",
          principalEn: "Principal Office",
          principalHi: "प्राचार्य कार्यालय",
          contact: "+91 98251-12000",
          challanNo: `CH-${Math.floor(1000 + Math.random() * 9000)}`,
        },
      ],
    };

    setBatches([newBatch, ...batches]);
    setSelectedBatchForMap(newBatch);
    setExpandedBatchId(newId);
    setCreateSuccessNotice(
      `બેચ ${newId} સફળતાપૂર્વક તૈયાર થઈ અને જીપીએસ ડિસ્પેચ શિડ્યુલ કરવામાં આવ્યું.`
    );
    setTimeout(() => setCreateSuccessNotice(null), 6000);
  };

  const handleDownloadChallan = (challanNo: string, batchId: string) => {
    setDownloadToast(`ચલણ #${challanNo} (${batchId}) PDF ડાઉનલોડ શરૂ થયું...`);
    setTimeout(() => setDownloadToast(null), 3500);
  };

  const filteredBatches = batches.filter((b) => {
    if (activeFilter === "in_transit") return b.statusType === "in_transit";
    if (activeFilter === "partial") return b.statusType === "partial";
    if (activeFilter === "completed") return b.statusType === "completed";
    return true;
  });

  return (
    <OfficerShell role="vendor">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Toast Notification */}
        {downloadToast && (
          <div className="fixed bottom-6 right-6 z-50 bg-inverse-surface text-inverse-on-surface px-4 py-3 rounded-xl shadow-lg flex items-center gap-3 animate-fade-in border border-outline-variant">
            <Icon name="download_done" size={20} className="text-secondary" />
            <span className="font-label-md text-label-md">{downloadToast}</span>
          </div>
        )}

        {/* Top Utility Ribbon / Context */}
        <div className="flex flex-col gap-1">
          <div className="flex flex-wrap items-center gap-1.5 text-on-surface-variant font-label-md text-label-md">
            <Link href="/vendor" className="hover:text-primary transition-colors">
              <T gu="સરસ્વતી સાધના યોજના" en="Saraswati Sadhana Yojana" hi="सरस्वती साधना योजना" />
            </Link>
            <Icon name="chevron_right" size={14} />
            <span className="hover:text-primary cursor-pointer transition-colors">
              <T gu="વેન્ડર સપ્લાય ચેઈન" en="Vendor Supply Chain" hi="विक्रेता आपूर्ति श्रृंखला" />
            </span>
            <Icon name="chevron_right" size={14} />
            <span className="text-primary font-semibold">
              <T gu="બેચ મેનેજમેન્ટ અને ડિસ્પેચ" en="Batch Management & Dispatch" hi="बैच प्रबंधन और प्रेषण" />
            </span>
            <span className="ml-2 px-2 py-0.5 rounded bg-surface-container-high text-tertiary font-mono text-xs font-normal">
              GR: EDU/SSY/SUPPLY/2026/02
            </span>
          </div>

          {/* Main Header Bar */}
          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 pt-2 pb-2">
            <div className="flex flex-col max-w-3xl">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-bold">
                  <T
                    gu="સાયકલ બેચ નિર્માણ અને ડિસ્પેચ કંટ્રોલ"
                    en="Bicycle Batch Creation & Dispatch Control"
                    hi="साइकिल बैच निर्माण एवं प्रेषण नियंत्रण"
                  />
                </h1>
                <span className="px-3 py-1 rounded-full bg-surface-container-highest text-primary font-label-md text-label-md font-medium">
                  Bicycle Batch &amp; Dispatch
                </span>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant mt-1.5">
                <T
                  gu="શાળાઓને સાયકલ વિતરણ માટે નવી બેચ બનાવો, વિશિષ્ટ QR કોડ સીરીયલ ટેગ્સ પ્રિન્ટ કરો, જીપીએસ ટ્રક લાઈવ ટ્રેક કરો અને ચુકવણી સ્થિતિ ચકાસો."
                  en="Create new bicycle batches for schools, generate tamper-proof QR tags, monitor live GPS transit, and verify milestone payments."
                  hi="स्कूलों को साइकिल वितरण हेतु नया बैच बनाएं, क्यूआर कोड टैग जेनरेट करें, लाइव जीपीएस ट्रैक करें और भुगतान स्थिति देखें।"
                />
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 shrink-0 flex-wrap">
              <Link
                href="/vendor/qr"
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-surface-container-lowest text-tertiary font-title-md text-title-md hover:bg-surface-container transition-all shadow-sm border border-outline-variant"
              >
                <Icon name="print" size={20} />
                <span>
                  <T gu="પ્રિન્ટ બેચ લેબલ્સ (.PDF)" en="Print Batch Labels (.PDF)" hi="बैच लेबल प्रिंट करें (.PDF)" />
                </span>
              </Link>
              <button
                onClick={scrollToForm}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-secondary text-on-secondary font-title-md text-title-md hover:opacity-90 transition-all shadow-md"
              >
                <Icon name="add_circle" size={20} />
                <span>
                  <T gu="+ નવી બેચ તૈયાર કરો" en="+ Create New Batch" hi="+ नया बैच तैयार करें" />
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Success Banner if batch created */}
        {createSuccessNotice && (
          <div className="bg-primary/10 border border-primary/30 rounded-xl p-4 flex items-center justify-between text-primary animate-fade-in">
            <div className="flex items-center gap-3">
              <Icon name="check_circle" size={24} className="text-primary" />
              <span className="font-title-md text-title-md font-semibold">{createSuccessNotice}</span>
            </div>
            <button
              onClick={() => setCreateSuccessNotice(null)}
              className="text-on-surface-variant hover:text-on-surface"
            >
              <Icon name="close" size={20} />
            </button>
          </div>
        )}

        {/* 5 High-Impact Metric Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Metric 1: Total Supply Quota */}
          <div className="bg-surface-container-lowest rounded-xl p-4 flex flex-col justify-between shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow border border-outline-variant">
            <div className="absolute top-0 right-0 w-24 h-24 bg-surface-container-high rounded-full -mr-8 -mt-8 opacity-40"></div>
            <div className="flex items-start justify-between relative z-10">
              <span className="font-label-md text-label-md text-on-surface-variant">
                <T gu="કુલ સપ્લાય ઓર્ડર (Quota)" en="Total Supply Quota" hi="कुल आपूर्ति कोटा" />
              </span>
              <Icon name="pedal_bike" size={22} className="text-primary" />
            </div>
            <div className="my-2 relative z-10 flex items-baseline justify-between">
              <div>
                <span className="font-headline-md text-headline-md text-on-surface font-bold">૧,૨૦,૦૦૦</span>
                <span className="font-caption text-caption text-on-surface-variant block">
                  <T gu="સાયકલો (AY 2025-26)" en="Cycles (AY 2025-26)" hi="साइकिलें (AY 2025-26)" />
                </span>
              </div>
              {/* Circular Progress Indicator */}
              <div className="relative w-12 h-12 flex items-center justify-center">
                <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-surface-container-high"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3.5"
                  />
                  <path
                    className="text-primary"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeDasharray="92, 100"
                    strokeLinecap="round"
                    strokeWidth="3.5"
                  />
                </svg>
                <span className="absolute font-label-md text-label-md text-primary font-bold">૯૨%</span>
              </div>
            </div>
            <div className="font-caption text-caption text-on-surface-variant relative z-10 flex items-center gap-1 pt-1 bg-surface-container-low px-2 py-0.5 rounded">
              <Icon name="check_circle" size={14} className="text-tertiary" />
              <span>
                <T
                  gu="૧,૧૦,૪૦૦ તૈયાર / વિતરિત"
                  en="1,10,400 Ready / Distributed"
                  hi="1,10,400 तैयार / वितरित"
                />
              </span>
            </div>
          </div>

          {/* Metric 2: Dispatched & In-Transit */}
          <div className="bg-surface-container-lowest rounded-xl p-4 flex flex-col justify-between shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow border border-outline-variant">
            <div className="flex items-start justify-between">
              <span className="font-label-md text-label-md text-on-surface-variant">
                <T gu="રવાના બેચ (In-Transit)" en="Dispatched (In-Transit)" hi="रवाना बैच (ट्रांजिट)" />
              </span>
              <div className="relative flex items-center justify-center">
                <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-secondary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary"></span>
              </div>
            </div>
            <div className="my-2">
              <div className="flex items-baseline gap-1.5">
                <span className="font-headline-md text-headline-md text-secondary font-bold">૧૪ બેચ</span>
                <span className="font-caption text-caption text-secondary font-semibold">(GPS Active)</span>
              </div>
              <span className="font-caption text-caption text-on-surface-variant block mt-0.5">
                <T gu="૧,૬૮૦ સાયકલો રસ્તામાં" en="1,680 cycles on route" hi="1,680 साइकिलें मार्ग में" />
              </span>
            </div>
            <div className="font-caption text-caption text-on-secondary-container bg-secondary-fixed px-2 py-0.5 rounded flex items-center justify-between">
              <span>
                <T gu="આણંદ, વડોદરા, ખેડા રૂટ" en="Anand, Vadodara, Kheda route" hi="आणंद, वडोदरा, खेड़ा रूट" />
              </span>
              <Icon name="local_shipping" size={14} />
            </div>
          </div>

          {/* Metric 3: Delivered & Verified */}
          <div className="bg-surface-container-lowest rounded-xl p-4 flex flex-col justify-between shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow border border-outline-variant">
            <div className="flex items-start justify-between">
              <span className="font-label-md text-label-md text-on-surface-variant">
                <T gu="શાળા સ્વીકૃત (Verified)" en="School Verified" hi="विद्यालय सत्यापित" />
              </span>
              <Icon name="verified" size={22} className="text-primary-container" />
            </div>
            <div className="my-2">
              <span className="font-headline-md text-headline-md text-on-surface font-bold">૧,૦૮,૭૨૦</span>
              <span className="font-caption text-caption text-on-surface-variant block mt-0.5">
                <T gu="શાળા ડિજિટલ રસીદ પૂર્ણ" en="School digital receipts complete" hi="विद्यालय डिजिटल रसीद पूर्ण" />
              </span>
            </div>
            <div className="font-caption text-caption text-on-surface-variant bg-surface-container-low px-2 py-0.5 rounded flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0"></span>
              <span className="truncate">
                <T gu="આચાર્ય QR સ્કેન અને OTP પાવતી" en="Principal QR scan & OTP verified" hi="प्राचार्य क्यूआर स्कैन और ओटीपी पावती" />
              </span>
            </div>
          </div>

          {/* Metric 4: Payment Ready */}
          <div className="bg-surface-container-lowest rounded-xl p-4 flex flex-col justify-between shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow border border-outline-variant">
            <div className="flex items-start justify-between">
              <span className="font-label-md text-label-md text-on-surface-variant">
                <T gu="ચુકવણી પાત્ર (Pay Ready)" en="Payment Ready" hi="भुगतान पात्र" />
              </span>
              <Icon name="payments" size={22} className="text-tertiary-container" />
            </div>
            <div className="my-2">
              <span className="font-headline-md text-headline-md text-tertiary font-bold">₹ ૨૧.૭૪ કરોડ</span>
              <span className="font-caption text-caption text-on-surface-variant block mt-0.5">
                <T gu="ટ્રેઝરી રિલીઝ આદેશ જારી" en="Treasury release orders issued" hi="कोषागार रिलीज आदेश जारी" />
              </span>
            </div>
            <div className="font-caption text-caption text-on-tertiary-container bg-surface-container px-2 py-0.5 rounded flex items-center justify-between">
              <span>
                <T gu="IFMS સરકારી એસ્ક્રો સત્ર" en="IFMS Gov Escrow Session" hi="IFMS सरकारी एस्क्रो सत्र" />
              </span>
              <Icon name="account_balance" size={14} />
            </div>
          </div>

          {/* Metric 5: QC Exceptions */}
          <div className="bg-surface-container-lowest rounded-xl p-4 flex flex-col justify-between shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow border border-outline-variant">
            <div className="flex items-start justify-between">
              <span className="font-label-md text-label-md text-on-surface-variant">
                <T gu="ક્વોલિટી રિપોર્ટ (QC)" en="QC Reports" hi="गुणवत्ता रिपोर्ट" />
              </span>
              <Icon name="report_problem" size={22} className="text-error" />
            </div>
            <div className="my-2">
              <div className="flex items-baseline gap-1">
                <span className="font-headline-md text-headline-md text-error font-bold">૩૨</span>
                <span className="font-caption text-caption text-on-surface-variant">(૦.૦૨%)</span>
              </div>
              <span className="font-caption text-caption text-error block mt-0.5 font-medium">
                <T gu="તાત્કાલિક રિપ્લેસમેન્ટ જારી" en="Immediate replacement issued" hi="तत्काल प्रतिस्थापन जारी" />
              </span>
            </div>
            <div className="font-caption text-caption text-on-error-container bg-error-container px-2 py-0.5 rounded flex items-center gap-1.5">
              <Icon name="autorenew" size={14} />
              <span className="truncate">
                <T gu="૪૮ કલાક રિપ્લેસમેન્ટ SLA" en="48-hr Replacement SLA" hi="48 घंटे का रिप्लेसमेंट SLA" />
              </span>
            </div>
          </div>
        </section>

        {/* Two Column Content Grid: 62% Left, 38% Right */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
          {/* LEFT COLUMN (xl:col-span-7) */}
          <div className="xl:col-span-7 flex flex-col gap-6">
            {/* Section A: Interactive Form Card (Create New Dispatch Batch) */}
            <div
              ref={formSectionRef}
              className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 gap-2 border-b border-surface-container">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-primary">
                    <Icon name="assignment_add" size={24} />
                  </div>
                  <div>
                    <h2 className="font-title-lg text-title-lg text-on-surface font-bold">
                      <T gu="નવી ડિસ્પેચ બેચ બનાવો" en="Create New Dispatch Batch" hi="नया प्रेषण बैच बनाएं" />
                    </h2>
                    <span className="font-caption text-caption text-on-surface-variant">
                      <T
                        gu="સાયકલ મોડેલ, જથ્થો અને શાળા ફાળવણી ફોર્મ"
                        en="Cycle model, quantity and school allocation form"
                        hi="साइकिल मॉडल, मात्रा और स्कूल आवंटन फॉर्म"
                      />
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-surface-container-high rounded-full w-fit">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                  <span className="font-label-md text-label-md text-primary font-mono font-bold">
                    બેચ ID: CYCLE-2026-AN-00{batches.length + 1}
                  </span>
                </div>
              </div>

              {/* Form Grid */}
              <form onSubmit={handleCreateBatch} className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                {/* Cycle Model Selection */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-label-lg text-label-lg text-on-surface flex items-center gap-1">
                    <T gu="સાયકલ મોડેલ (Cycle Model)" en="Cycle Model" hi="साइकिल मॉडल" />
                    <span className="text-error">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={formModel}
                      onChange={(e) => setFormModel(e.target.value)}
                      className="w-full h-11 px-3 bg-surface-container-low rounded-lg text-on-surface font-body-sm text-body-sm focus:outline-none focus:bg-surface-container-lowest shadow-sm appearance-none cursor-pointer border border-outline-variant/60"
                    >
                      <option value="Atlas 22T (Girl Model - 20 Inch)">Atlas 22T (Girl Model - 20 Inch)</option>
                      <option value="Atlas 22T Standard Road">Atlas 22T Standard Road</option>
                      <option value="Hero Empress 20T Special">Hero Empress 20T Special</option>
                      <option value="Avon Saraswati 22T Heavy Duty">Avon Saraswati 22T Heavy Duty</option>
                    </select>
                    <span className="absolute right-3 top-3 pointer-events-none text-on-surface-variant">
                      <Icon name="expand_more" size={20} />
                    </span>
                  </div>
                  <span className="font-caption text-caption text-on-surface-variant">
                    <T
                      gu="રંગ: સરસ્વતી સાધના સ્પેશિયલ મેટાલિક પિંક/સાયન"
                      en="Color: Metallic Pink / Cyan (State Standard)"
                      hi="रंग: स्पेशल मेटालिक पिंक/स्यान"
                    />
                  </span>
                </div>

                {/* District & Taluka */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-label-lg text-label-lg text-on-surface flex items-center gap-1">
                    <T gu="ટાર્ગેટ જિલ્લો / તાલુકો" en="Target District / Taluka" hi="लक्षित जिला / तालुका" />
                    <span className="text-error">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={formDistrict}
                      onChange={(e) => setFormDistrict(e.target.value)}
                      className="w-full h-11 px-3 bg-surface-container-low rounded-lg text-on-surface font-body-sm text-body-sm focus:outline-none focus:bg-surface-container-lowest shadow-sm appearance-none cursor-pointer border border-outline-variant/60"
                    >
                      <option value="આણંદ (Anand) — પેટલાદ (Petlad)">આણંદ (Anand) — પેટલાદ (Petlad)</option>
                      <option value="આણંદ (Anand) — બોરસદ (Borsad)">આણંદ (Anand) — બોરસદ (Borsad)</option>
                      <option value="ખેડા (Kheda) — નડિયાદ (Nadiad)">ખેડા (Kheda) — નડિયાદ (Nadiad)</option>
                      <option value="વડોદરા (Vadodara) — પાદરા (Padra)">વડોદરા (Vadodara) — પાદરા (Padra)</option>
                    </select>
                    <span className="absolute right-3 top-3 pointer-events-none text-on-surface-variant">
                      <Icon name="expand_more" size={20} />
                    </span>
                  </div>
                  <span className="font-caption text-caption text-on-surface-variant">
                    <T gu="જિલ્લા શિક્ષણ અધિકારી (DEO) અધિકૃત ઝોન" en="DEO Authorized Zone" hi="DEO अधिकृत ज़ोन" />
                  </span>
                </div>

                {/* Destination School */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-label-lg text-label-lg text-on-surface flex items-center gap-1">
                    <T gu="ટાર્ગેટ શાળા પસંદ કરો" en="Target School" hi="लक्षित विद्यालय चुनें" />
                    <span className="text-error">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={formSchool}
                      onChange={(e) => setFormSchool(e.target.value)}
                      className="w-full h-11 px-3 bg-surface-container-low rounded-lg text-on-surface font-body-sm text-body-sm focus:outline-none focus:bg-surface-container-lowest shadow-sm appearance-none cursor-pointer border border-outline-variant/60"
                    >
                      <option value="શ્રી સરદાર પટેલ હાઇસ્કૂલ, પેટલાદ (24150100412)">
                        શ્રી સરદાર પટેલ હાઇસ્કૂલ, પેટલાદ (24150100412)
                      </option>
                      <option value="નવજીવન કન્યા વિદ્યાલય, બોરસદ (24150201103)">
                        નવજીવન કન્યા વિદ્યાલય, બોરસદ (24150201103)
                      </option>
                      <option value="સરકારી ઉચ્ચતર માધ્યમિક શાળા, ઉમરેઠ (24150400819)">
                        સરકારી ઉચ્ચતર માધ્યમિક શાળા, ઉમરેઠ (24150400819)
                      </option>
                    </select>
                    <span className="absolute right-3 top-3 pointer-events-none text-on-surface-variant">
                      <Icon name="school" size={20} />
                    </span>
                  </div>
                  <span className="font-caption text-caption text-tertiary font-medium">
                    <T gu="માન્ય પાત્ર વિદ્યાર્થી ક્વોટા: ૧૨૦" en="Eligible Student Quota: 120" hi="पात्र छात्र कोटा: 120" />
                  </span>
                </div>

                {/* Quantity */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-label-lg text-label-lg text-on-surface flex items-center gap-1">
                    <T gu="સાયકલ જથ્થો (Quantity)" en="Cycle Quantity" hi="साइकिल मात्रा" />
                    <span className="text-error">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min={10}
                      max={500}
                      value={formQuantity}
                      onChange={(e) => setFormQuantity(e.target.value)}
                      className="w-full h-11 px-3 bg-surface-container-low rounded-lg text-on-surface font-body-sm text-body-sm focus:outline-none focus:bg-surface-container-lowest shadow-sm font-semibold border border-outline-variant/60"
                    />
                    <span className="absolute right-3 top-3 text-on-surface-variant">
                      <Icon name="pedal_bike" size={20} />
                    </span>
                  </div>
                  <span className="font-caption text-caption text-on-surface-variant">
                    <T gu="૧૨૦ કન્યા વિદ્યાર્થી ફાળવણી" en="Batch size: 120 units" hi="बैच आकार: 120 यूनिट" />
                  </span>
                </div>

                {/* Auto-Generated Serial Range */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-label-lg text-label-lg text-on-surface flex items-center gap-1">
                    <T
                      gu="સીરીયલ નંબર રેન્જ (Auto QR Assigned)"
                      en="Serial Range (Auto QR Assigned)"
                      hi="सीरियल नंबर रेंज (Auto QR)"
                    />
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      readOnly
                      value={`SSB-2026-077751 થી SSB-2026-0${77750 + (parseInt(formQuantity, 10) || 120)}`}
                      className="w-full h-11 px-3 bg-surface-container rounded-lg text-primary font-mono text-body-sm font-bold focus:outline-none shadow-sm border border-outline-variant/40"
                    />
                    <span className="absolute right-3 top-3 text-primary">
                      <Icon name="qr_code" size={20} />
                    </span>
                  </div>
                  <span className="font-caption text-caption text-on-surface-variant">
                    <T
                      gu="યુનિક એનક્રિપ્ટેડ બારકોડ લેબલ્સ તૈયાર થશે"
                      en="Encrypted unique barcode tags will be generated"
                      hi="यूनिक एन्क्रिप्टेड बारकोड टैग उत्पन्न होंगे"
                    />
                  </span>
                </div>

                {/* Vehicle & Driver */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-label-lg text-label-lg text-on-surface flex items-center gap-1">
                    <T gu="ટ્રાન્સપોર્ટ વાહન અને ચાલક" en="Transport Vehicle & Driver" hi="परिवहन वाहन और चालक" />
                    <span className="text-error">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formVehicle}
                      onChange={(e) => setFormVehicle(e.target.value)}
                      className="w-full h-11 px-3 bg-surface-container-low rounded-lg text-on-surface font-body-sm text-body-sm focus:outline-none focus:bg-surface-container-lowest shadow-sm border border-outline-variant/60"
                    />
                    <span className="absolute right-3 top-3 text-on-surface-variant">
                      <Icon name="pin_drop" size={20} />
                    </span>
                  </div>
                  <span className="font-caption text-caption text-on-surface-variant">
                    <T
                      gu="સંપર્ક: +91 98254-41209 (જીપીએસ ટ્રેકર જોડાયેલું છે)"
                      en="Contact: +91 98254-41209 (GPS Integrated)"
                      hi="संपर्क: +91 98254-41209 (GPS एकीकृत)"
                    />
                  </span>
                </div>

                {/* ETA */}
                <div className="flex flex-col gap-1.5 md:col-span-2">
                  <label className="font-label-lg text-label-lg text-on-surface flex items-center gap-1">
                    <T
                      gu="અંદાજિત પહોંચવાનો સમય (Estimated Arrival Time / ETA)"
                      en="Estimated Arrival Time (ETA)"
                      hi="अनुमानित आगमन समय (ETA)"
                    />
                    <span className="text-error">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formEta}
                      onChange={(e) => setFormEta(e.target.value)}
                      className="w-full h-11 px-3 bg-surface-container-low rounded-lg text-on-surface font-body-sm text-body-sm focus:outline-none focus:bg-surface-container-lowest shadow-sm border border-outline-variant/60"
                    />
                    <span className="absolute right-3 top-3 text-on-surface-variant">
                      <Icon name="schedule" size={20} />
                    </span>
                  </div>
                  <span className="font-caption text-caption text-on-surface-variant">
                    <T
                      gu="ગોડાઉન: વટવા GIDC ફેક્ટરી-૩ થી અંતર ૭૪ કિમી"
                      en="Depot: Vatva GIDC Factory-3, Distance: 74 km"
                      hi="गोदाम: वटवा GIDC फैक्ट्री-3, दूरी: 74 किमी"
                    />
                  </span>
                </div>

                {/* Form Action Footer */}
                <div className="col-span-1 md:col-span-2 flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 mt-1 bg-surface-container-low p-4 rounded-xl border border-outline-variant/40">
                  <div className="flex items-center gap-2 text-on-surface-variant font-caption text-caption">
                    <Icon name="verified_user" size={18} className="text-primary" />
                    <span>
                      <T
                        gu="રાજ્ય શિક્ષણ નિયામક કચેરી ડિજિટલ સહી પ્રોટોકોલ v2.4"
                        en="State Education Directorate Digital Protocol v2.4"
                        hi="राज्य शिक्षा निदेशालय डिजिटल प्रोटोकॉल v2.4"
                      />
                    </span>
                  </div>
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <Link
                      href="/vendor/qr"
                      className="w-full sm:w-auto px-4 py-2.5 rounded-lg bg-surface-container-lowest text-on-surface font-title-md text-title-md hover:bg-surface-container-high transition-colors shadow-sm flex items-center justify-center gap-2 border border-outline-variant/50"
                    >
                      <Icon name="visibility" size={18} />
                      <span>
                        <T gu="ક્યુઆર પ્રિવ્યુ" en="QR Preview" hi="क्यूआर पूर्वावलोकन" />
                      </span>
                    </Link>
                    <button
                      type="submit"
                      className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-primary text-on-primary font-title-md text-title-md hover:bg-primary-container transition-colors shadow-md flex items-center justify-center gap-2"
                    >
                      <Icon name="local_shipping" size={18} />
                      <span>
                        <T
                          gu="ડિસ્પેચ કન્ફર્મ કરો અને GPS ચાલુ કરો"
                          en="Confirm Dispatch & Start GPS"
                          hi="डिस्पैच पुष्टि करें और GPS चालू करें"
                        />
                      </span>
                    </button>
                  </div>
                </div>
              </form>
            </div>

            {/* Section B: Active Batches & Dispatch Tracking Table */}
            <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
                <div>
                  <h2 className="font-title-lg text-title-lg text-on-surface font-bold">
                    <T
                      gu="સક્રિય બેચ અને ડિસ્પેચ પાઇપલાઇન"
                      en="Active Batches & Real-Time Delivery Pipeline"
                      hi="सक्रिय बैच और प्रेषण पाइपलाइन"
                    />
                  </h2>
                  <span className="font-caption text-caption text-on-surface-variant">
                    <T
                      gu="તમામ ડિસ્પેચ બેચ, ફાળવેલ શાળાઓ, જીપીએસ સ્થિતિ અને ડિલિવરી ચલણ"
                      en="All dispatch batches, assigned schools, GPS status, and challans"
                      hi="सभी प्रेषण बैच, आवंटित स्कूल, जीपीएस स्थिति और डिलीवरी चालान"
                    />
                  </span>
                </div>

                {/* Filter Tabs */}
                <div className="flex items-center bg-surface-container-low p-1 rounded-lg gap-1 overflow-x-auto border border-outline-variant/40">
                  <button
                    onClick={() => setActiveFilter("all")}
                    className={`px-3 py-1 rounded font-label-md text-label-md transition-all ${
                      activeFilter === "all"
                        ? "bg-surface-container-lowest text-primary font-semibold shadow-sm"
                        : "hover:bg-surface-container-lowest text-on-surface-variant"
                    }`}
                  >
                    <T gu="તમામ બેચ" en="All Batches" hi="सभी बैच" /> ({batches.length})
                  </button>
                  <button
                    onClick={() => setActiveFilter("in_transit")}
                    className={`px-3 py-1 rounded font-label-md text-label-md transition-all ${
                      activeFilter === "in_transit"
                        ? "bg-surface-container-lowest text-primary font-semibold shadow-sm"
                        : "hover:bg-surface-container-lowest text-on-surface-variant"
                    }`}
                  >
                    <T gu="રસ્તામાં" en="In Transit" hi="मार्ग में" /> (
                    {batches.filter((b) => b.statusType === "in_transit").length})
                  </button>
                  <button
                    onClick={() => setActiveFilter("partial")}
                    className={`px-3 py-1 rounded font-label-md text-label-md transition-all ${
                      activeFilter === "partial"
                        ? "bg-surface-container-lowest text-primary font-semibold shadow-sm"
                        : "hover:bg-surface-container-lowest text-on-surface-variant"
                    }`}
                  >
                    <T gu="આંશિક વિતરિત" en="Partial" hi="आंशिक" /> (
                    {batches.filter((b) => b.statusType === "partial").length})
                  </button>
                  <button
                    onClick={() => setActiveFilter("completed")}
                    className={`px-3 py-1 rounded font-label-md text-label-md transition-all ${
                      activeFilter === "completed"
                        ? "bg-surface-container-lowest text-primary font-semibold shadow-sm"
                        : "hover:bg-surface-container-lowest text-on-surface-variant"
                    }`}
                  >
                    <T gu="સફળ ડિલિવરી" en="Completed" hi="पूर्ण" /> (
                    {batches.filter((b) => b.statusType === "completed").length})
                  </button>
                </div>
              </div>

              {/* Table Container */}
              <div className="overflow-x-auto -mx-2">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-surface-container-low text-on-surface-variant font-label-md text-label-md uppercase tracking-wider border-y border-outline-variant/40">
                      <th className="py-3 px-3 rounded-l-lg">
                        <T gu="બેચ ID & તારીખ" en="Batch ID & Date" hi="बैच ID व दिनांक" />
                      </th>
                      <th className="py-3 px-3">
                        <T gu="મોડેલ & જથ્થો" en="Model & Qty" hi="मॉडल व मात्रा" />
                      </th>
                      <th className="py-3 px-3">
                        <T gu="શાળા ફાળવણી" en="Allocated Schools" hi="आवंटित स्कूल" />
                      </th>
                      <th className="py-3 px-3">
                        <T gu="સ્થિતિ (Status)" en="Status" hi="स्थिति" />
                      </th>
                      <th className="py-3 px-3 text-right rounded-r-lg">
                        <T gu="ક્રિયાઓ" en="Actions" hi="कार्रवाई" />
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-container">
                    {filteredBatches.map((batch) => {
                      const isExpanded = expandedBatchId === batch.id;
                      const progressPct = Math.round((batch.deliveredQuantity / batch.totalQuantity) * 100);

                      return (
                        <tr key={batch.id} className="group">
                          <td colSpan={5} className="p-0">
                            {/* Main row card */}
                            <div
                              onClick={() => {
                                toggleExpand(batch.id);
                                setSelectedBatchForMap(batch);
                              }}
                              className={`grid grid-cols-12 items-center p-3 cursor-pointer transition-colors ${
                                isExpanded
                                  ? "bg-surface-container-low/70"
                                  : "hover:bg-surface-container-low/40"
                              }`}
                            >
                              {/* Col 1: Batch ID & Date (3 cols) */}
                              <div className="col-span-3 flex flex-col pr-2">
                                <div className="flex items-center gap-1.5">
                                  <span className="font-title-md text-title-md text-primary font-bold font-mono">
                                    {batch.id}
                                  </span>
                                  {batch.statusType === "in_transit" && (
                                    <span className="w-2 h-2 rounded-full bg-secondary animate-ping"></span>
                                  )}
                                </div>
                                <span className="font-caption text-caption text-on-surface-variant">
                                  <T
                                    gu={batch.dispatchDateGu}
                                    en={batch.dispatchDateEn}
                                    hi={batch.dispatchDateHi}
                                  />
                                </span>
                                <span className="font-caption text-caption text-tertiary font-mono text-[11px] mt-0.5 truncate">
                                  {batch.vehicleNo}
                                </span>
                              </div>

                              {/* Col 2: Model & Qty (3 cols) */}
                              <div className="col-span-3 flex flex-col pr-2">
                                <span className="font-body-sm text-body-sm font-semibold text-on-surface truncate">
                                  <T gu={batch.modelGu} en={batch.modelEn} hi={batch.modelHi} />
                                </span>
                                <div className="flex items-center gap-2 mt-0.5">
                                  <span className="font-title-sm text-title-sm font-bold text-on-surface">
                                    {batch.totalQuantity}{" "}
                                    <span className="font-caption text-caption font-normal text-on-surface-variant">
                                      <T gu="સાયકલો" en="units" hi="साइकिलें" />
                                    </span>
                                  </span>
                                </div>
                                <div className="w-28 h-1.5 rounded-full bg-surface-container mt-1 overflow-hidden">
                                  <div
                                    className={`h-full rounded-full ${
                                      progressPct === 100
                                        ? "bg-primary"
                                        : progressPct > 0
                                        ? "bg-secondary"
                                        : "bg-surface-container-high"
                                    }`}
                                    style={{ width: `${progressPct}%` }}
                                  ></div>
                                </div>
                                <span className="font-caption text-caption text-on-surface-variant mt-0.5">
                                  {batch.deliveredQuantity} / {batch.totalQuantity} (
                                  <T gu={`${progressPct}% પૂર્ણ`} en={`${progressPct}% done`} hi={`${progressPct}% पूर्ण`} />)
                                </span>
                              </div>

                              {/* Col 3: Schools Count & Summary (2 cols) */}
                              <div className="col-span-2 flex flex-col pr-2">
                                <span className="font-label-md text-label-md text-on-surface font-semibold">
                                  {batch.schools.length}{" "}
                                  <T gu="શાળાઓ" en="Schools" hi="स्कूल" />
                                </span>
                                <span className="font-caption text-caption text-on-surface-variant truncate">
                                  <T
                                    gu={batch.schools[0]?.nameGu || ""}
                                    en={batch.schools[0]?.nameEn || ""}
                                    hi={batch.schools[0]?.nameHi || ""}
                                  />
                                </span>
                                {batch.schools.length > 1 && (
                                  <span className="font-caption text-caption text-primary">
                                    +{batch.schools.length - 1} વધુ (more)
                                  </span>
                                )}
                              </div>

                              {/* Col 4: Status (2 cols) */}
                              <div className="col-span-2 flex flex-col items-start pr-2">
                                <StatusChip
                                  status={batch.status}
                                  label={
                                    <T
                                      gu={batch.statusLabel.gu}
                                      en={batch.statusLabel.en}
                                      hi={batch.statusLabel.hi}
                                    />
                                  }
                                />
                                <span className="font-caption text-caption text-on-surface-variant mt-1 truncate">
                                  <T
                                    gu={batch.currentLocationGu}
                                    en={batch.currentLocationEn}
                                    hi={batch.currentLocationHi}
                                  />
                                </span>
                              </div>

                              {/* Col 5: Actions & Expand Button (2 cols) */}
                              <div className="col-span-2 flex items-center justify-end gap-1.5">
                                <Link
                                  href={`/vendor/tracking?batch=${batch.id}`}
                                  onClick={(e) => e.stopPropagation()}
                                  className="w-8 h-8 rounded-lg bg-surface-container-high text-primary hover:bg-primary hover:text-on-primary flex items-center justify-center transition-colors"
                                  title="GPS Tracking"
                                >
                                  <Icon name="share_location" size={18} />
                                </Link>
                                <Link
                                  href={`/vendor/qr?batch=${batch.id}`}
                                  onClick={(e) => e.stopPropagation()}
                                  className="w-8 h-8 rounded-lg bg-surface-container-high text-on-surface-variant hover:bg-primary hover:text-on-primary flex items-center justify-center transition-colors"
                                  title="QR Generator"
                                >
                                  <Icon name="qr_code_2" size={18} />
                                </Link>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDownloadChallan(batch.schools[0]?.challanNo || "CH-9900", batch.id);
                                  }}
                                  className="w-8 h-8 rounded-lg bg-surface-container-high text-on-surface-variant hover:bg-surface-container flex items-center justify-center transition-colors"
                                  title="Download Challan PDF"
                                >
                                  <Icon name="download" size={18} />
                                </button>
                                <div className="text-on-surface-variant pl-1">
                                  <Icon name={isExpanded ? "expand_less" : "expand_more"} size={20} />
                                </div>
                              </div>
                            </div>

                            {/* Expandable School Breakdown Panel */}
                            {isExpanded && (
                              <div className="bg-surface-container-lowest border-t border-b border-surface-container p-4 animate-fade-in space-y-3">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-surface-container gap-2">
                                  <div className="flex items-center gap-2">
                                    <Icon name="school" size={20} className="text-primary" />
                                    <h3 className="font-title-md text-title-md font-bold text-on-surface">
                                      <T
                                        gu="શાળા-વાર સાયકલ ફાળવણી અને સ્વીકૃતિ સ્થિતિ"
                                        en="School-wise Cycle Allocation & OTP Verification"
                                        hi="स्कूल-वार साइकिल आवंटन एवं सत्यापन स्थिति"
                                      />
                                    </h3>
                                    <span className="font-caption text-caption px-2 py-0.5 rounded bg-surface-container-high text-tertiary font-mono">
                                      {batch.id}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Link
                                      href={`/vendor/qr?batch=${batch.id}`}
                                      className="px-3 py-1 rounded bg-surface-container text-primary hover:bg-surface-container-high font-label-md text-label-md flex items-center gap-1 transition-colors"
                                    >
                                      <Icon name="print" size={16} />
                                      <span>
                                        <T gu="આ બેચના તમામ QR પ્રિન્ટ કરો" en="Print Batch QR Labels" hi="बैच QR प्रिंट करें" />
                                      </span>
                                    </Link>
                                    <Link
                                      href={`/vendor/challan?batch=${batch.id}`}
                                      className="px-3 py-1 rounded bg-secondary-fixed text-on-secondary-fixed hover:opacity-90 font-label-md text-label-md flex items-center gap-1 transition-colors"
                                    >
                                      <Icon name="fact_check" size={16} />
                                      <span>
                                        <T gu="ચલણ પેજ પર જુઓ" en="View Challan Page" hi="चालान पृष्ठ देखें" />
                                      </span>
                                    </Link>
                                  </div>
                                </div>

                                {/* School Allocation Cards / Table */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                                  {batch.schools.map((school) => {
                                    const schPct = Math.round((school.delivered / school.allocated) * 100);
                                    return (
                                      <div
                                        key={school.id}
                                        className="bg-surface-container-low rounded-lg p-3.5 border border-outline-variant/60 flex flex-col justify-between gap-3 shadow-xs"
                                      >
                                        <div className="flex items-start justify-between gap-2">
                                          <div>
                                            <h4 className="font-label-lg text-label-lg font-bold text-on-surface">
                                              <T gu={school.nameGu} en={school.nameEn} hi={school.nameHi} />
                                            </h4>
                                            <p className="font-caption text-caption text-on-surface-variant">
                                              <T gu={school.talukaGu} en={school.talukaEn} hi={school.talukaHi} /> • UDISE: {school.udise}
                                            </p>
                                          </div>
                                          {school.otpConfirmed ? (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-chip-approved-bg text-chip-approved-text border border-chip-approved-border text-xs font-semibold shrink-0">
                                              <Icon name="check_circle" size={14} />
                                              <T gu="OTP પ્રમાણિત ✓" en="OTP Verified ✓" hi="OTP सत्यापित ✓" />
                                            </span>
                                          ) : (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed text-xs font-semibold shrink-0">
                                              <Icon name="hourglass_top" size={14} />
                                              <T gu="OTP સ્કેન બાકી" en="OTP Pending" hi="OTP लंबित" />
                                            </span>
                                          )}
                                        </div>

                                        {/* Progress bar */}
                                        <div className="space-y-1">
                                          <div className="flex items-center justify-between text-xs font-medium">
                                            <span className="text-on-surface-variant">
                                              <T gu="વિતરણ પ્રગતિ" en="Delivery Progress" hi="वितरण प्रगति" />:
                                            </span>
                                            <span className="text-on-surface font-bold">
                                              {school.delivered} / {school.allocated} <T gu="સાયકલો" en="cycles" hi="साइकिलें" /> ({schPct}%)
                                            </span>
                                          </div>
                                          <div className="w-full h-2 rounded-full bg-surface-container overflow-hidden">
                                            <div
                                              className={`h-full rounded-full transition-all duration-500 ${
                                                schPct === 100
                                                  ? "bg-primary"
                                                  : schPct > 0
                                                  ? "bg-secondary"
                                                  : "bg-surface-container-high"
                                              }`}
                                              style={{ width: `${schPct}%` }}
                                            ></div>
                                          </div>
                                        </div>

                                        {/* Principal & Challan info */}
                                        <div className="pt-2 border-t border-surface-container flex items-center justify-between text-xs text-on-surface-variant">
                                          <div>
                                            <span className="font-medium text-on-surface">
                                              <T gu={school.principalGu} en={school.principalEn} hi={school.principalHi} />
                                            </span>
                                            <span className="block text-[11px] text-on-surface-variant">{school.contact}</span>
                                          </div>
                                          <div className="flex items-center gap-2">
                                            <span className="font-mono font-bold text-tertiary">#{school.challanNo}</span>
                                            <button
                                              onClick={() => handleDownloadChallan(school.challanNo, batch.id)}
                                              className="p-1 rounded hover:bg-surface-container text-primary transition-colors"
                                              title="Download Challan"
                                            >
                                              <Icon name="download" size={16} />
                                            </button>
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN (xl:col-span-5) */}
          <div className="xl:col-span-5 flex flex-col gap-6">
            {/* Right Card A: Live Truck Fleet GPS Tracker & Route Map */}
            <div className="bg-surface-container-lowest rounded-xl p-5 shadow-sm overflow-hidden flex flex-col border border-outline-variant">
              <div className="flex items-center justify-between pb-3 border-b border-surface-container">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-secondary animate-ping"></span>
                  <h3 className="font-title-md text-title-md font-bold text-on-surface">
                    <T
                      gu={`લાઈવ GPS ટ્રેકિંગ (${selectedBatchForMap.vehicleNo})`}
                      en={`Live GPS Tracking (${selectedBatchForMap.vehicleNo})`}
                      hi={`लाइव GPS ट्रैकिंग (${selectedBatchForMap.vehicleNo})`}
                    />
                  </h3>
                </div>
                <span className="px-2 py-0.5 rounded bg-surface-container text-tertiary font-mono font-bold font-caption text-caption">
                  {selectedBatchForMap.id}
                </span>
              </div>

              {/* Simulated Crisp Route Map Graphic */}
              <div className="relative w-full h-56 rounded-xl overflow-hidden bg-gradient-to-br from-surface-container via-surface-container-high to-surface-container-low my-3 shadow-inner border border-outline-variant/60 flex flex-col justify-between p-4">
                {/* SVG Route Visualization */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 220" preserveAspectRatio="none">
                  {/* Highway Line Background */}
                  <path
                    d="M 40 180 Q 150 140, 220 110 T 360 40"
                    fill="none"
                    stroke="#c4c5d7"
                    strokeWidth="8"
                    strokeLinecap="round"
                  />
                  {/* Traveled Highway Line */}
                  <path
                    d="M 40 180 Q 150 140, 220 110"
                    fill="none"
                    stroke="#1d4ed8"
                    strokeWidth="8"
                    strokeLinecap="round"
                  />
                  {/* Moving Dashed Pulse Line */}
                  <path
                    d="M 220 110 Q 280 80, 360 40"
                    fill="none"
                    stroke="#fd761a"
                    strokeWidth="4"
                    strokeDasharray="6 6"
                    strokeLinecap="round"
                  />

                  {/* Origin: Vatva GIDC */}
                  <circle cx="40" cy="180" r="8" fill="#1d4ed8" />
                  <circle cx="40" cy="180" r="4" fill="#ffffff" />
                  <text x="40" y="202" fill="#434655" fontSize="10" fontWeight="bold" textAnchor="middle">
                    વટવા GIDC
                  </text>

                  {/* Waypoint: Nadiad Toll */}
                  <circle cx="150" cy="140" r="6" fill="#1d4ed8" />
                  <text x="150" y="162" fill="#434655" fontSize="9" textAnchor="middle">
                    નડિયાદ ટોલ
                  </text>

                  {/* Live Truck Marker at position (220, 110) */}
                  <circle cx="220" cy="110" r="14" fill="#fd761a" fillOpacity="0.3" className="animate-ping" />
                  <circle cx="220" cy="110" r="9" fill="#9d4300" />
                  <circle cx="220" cy="110" r="4" fill="#ffffff" />

                  {/* Destination: Petlad School */}
                  <circle cx="360" cy="40" r="8" fill="#233f8f" />
                  <circle cx="360" cy="40" r="4" fill="#ffffff" />
                  <text x="350" y="62" fill="#434655" fontSize="10" fontWeight="bold" textAnchor="middle">
                    પેટલાદ શાળા
                  </text>
                </svg>

                {/* Top Badge Overlay */}
                <div className="relative z-10 flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-md bg-surface-container-lowest/90 backdrop-blur-sm text-on-surface font-label-md text-label-md font-semibold shadow-xs">
                    NH-48 અમદાવાદ ➔ આણંદ એક્સપ્રેસવે
                  </span>
                  <Link
                    href={`/vendor/tracking?batch=${selectedBatchForMap.id}`}
                    className="px-2.5 py-1 rounded-md bg-primary text-on-primary font-label-md text-label-md shadow-sm hover:bg-primary-container transition-colors flex items-center gap-1"
                  >
                    <span>
                      <T gu="પૂર્ણ મેપ" en="Full Map" hi="पूर्ण मैप" />
                    </span>
                    <Icon name="arrow_outward" size={14} />
                  </Link>
                </div>

                {/* Route Overlay Card on Map */}
                <div className="relative z-10 bg-surface-container-lowest/95 backdrop-blur-sm p-3 rounded-lg flex items-center justify-between shadow-md border border-outline-variant/60">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-on-primary">
                      <Icon name="local_shipping" size={20} />
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1.5">
                        <span className="font-label-md text-label-md font-bold text-on-surface">
                          {selectedBatchForMap.vehicleNo}
                        </span>
                        <span className="font-caption text-caption px-1.5 py-0.2 rounded bg-surface-container-high text-primary font-semibold">
                          {selectedBatchForMap.speed}
                        </span>
                      </div>
                      <span className="font-caption text-caption text-on-surface-variant">
                        <T
                          gu="અમદાવાદ વટવા ➔ આણંદ હાઇવે NH-48"
                          en="Ahmedabad Vatva ➔ Anand Highway NH-48"
                          hi="अहमदाबाद वटवा ➔ आणंद हाईवे NH-48"
                        />
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-caption text-caption text-secondary font-bold block">
                      <T
                        gu={selectedBatchForMap.remainingTimeGu}
                        en={selectedBatchForMap.remainingTimeEn}
                        hi={selectedBatchForMap.remainingTimeHi}
                      />
                    </span>
                    <span className="font-caption text-caption text-on-surface-variant">
                      ETA: {selectedBatchForMap.eta}
                    </span>
                  </div>
                </div>
              </div>

              {/* Stepper / Route Milestone Chain */}
              <div className="flex flex-col gap-2 mt-2 px-1">
                {/* Step 1: Complete */}
                <div className="flex items-start gap-3 relative">
                  <div className="flex flex-col items-center">
                    <div className="w-6 h-6 rounded-full bg-primary text-on-primary flex items-center justify-center text-xs">
                      <Icon name="check" size={14} />
                    </div>
                    <div className="w-0.5 h-8 bg-primary"></div>
                  </div>
                  <div className="flex items-center justify-between w-full pt-0.5">
                    <div>
                      <span className="font-label-md text-label-md font-semibold text-on-surface block">
                        <T gu="વટવા GIDC ડેપો ડિસ્પેચ (અમદાવાદ)" en="Vatva GIDC Depot Dispatch" hi="वटवा GIDC डिपो प्रेषण" />
                      </span>
                      <span className="font-caption text-caption text-on-surface-variant">
                        <T gu="સવારે ૦૮:૦૦ AM - ટ્રક સીલ લોક પ્રમાણિત" en="08:00 AM - Truck seal lock verified" hi="सुबह 08:00 - ट्रक सील लॉक सत्यापित" />
                      </span>
                    </div>
                    <span className="font-caption text-caption text-primary font-mono font-semibold">
                      <T gu="પૂર્ણ ✓" en="Done ✓" hi="पूर्ण ✓" />
                    </span>
                  </div>
                </div>

                {/* Step 2: Complete */}
                <div className="flex items-start gap-3 relative">
                  <div className="flex flex-col items-center">
                    <div className="w-6 h-6 rounded-full bg-primary text-on-primary flex items-center justify-center text-xs">
                      <Icon name="check" size={14} />
                    </div>
                    <div className="w-0.5 h-8 bg-secondary"></div>
                  </div>
                  <div className="flex items-center justify-between w-full pt-0.5">
                    <div>
                      <span className="font-label-md text-label-md font-semibold text-on-surface block">
                        <T gu="નડિયાદ ટોલ બાયપાસ ક્રોસિંગ" en="Nadiad Toll Bypass Crossing" hi="नडियाद टोल बाईपास क्रॉसिंग" />
                      </span>
                      <span className="font-caption text-caption text-on-surface-variant">
                        <T gu="સવારે ૧૦:૧૫ AM - FASTag ઓટો લોગ #FT-889" en="10:15 AM - FASTag Auto Log #FT-889" hi="सुबह 10:15 - FASTag ऑटो लॉग #FT-889" />
                      </span>
                    </div>
                    <span className="font-caption text-caption text-primary font-mono font-semibold">
                      <T gu="પૂર્ણ ✓" en="Done ✓" hi="पूर्ण ✓" />
                    </span>
                  </div>
                </div>

                {/* Step 3: In Progress */}
                <div className="flex items-start gap-3 relative">
                  <div className="flex flex-col items-center">
                    <div className="w-6 h-6 rounded-full bg-secondary text-on-secondary flex items-center justify-center text-xs ring-4 ring-secondary-fixed">
                      <Icon name="navigation" size={14} />
                    </div>
                    <div className="w-0.5 h-8 bg-surface-container"></div>
                  </div>
                  <div className="flex items-center justify-between w-full pt-0.5">
                    <div>
                      <span className="font-label-md text-label-md font-bold text-secondary block">
                        <T gu="શ્રી સરદાર પટેલ હાઇસ્કૂલ, પેટલાદ" en="Shree Sardar Patel High School, Petlad" hi="श्री सरदार पटेल हाईस्कूल, पेटलाद" />
                      </span>
                      <span className="font-caption text-caption text-on-surface-variant">
                        <T gu="લાઇવ ટ્રાન્ઝિટ - અંદાજિત અંતર ૨૧ કિમી બાકી" en="Live transit - approx 21 km remaining" hi="लाइव ट्रांजिट - लगभग 21 किमी शेष" />
                      </span>
                    </div>
                    <span className="font-caption text-caption text-secondary font-mono font-bold">
                      <T gu="રસ્તામાં..." en="In Transit..." hi="मार्ग में..." />
                    </span>
                  </div>
                </div>

                {/* Step 4: Upcoming */}
                <div className="flex items-start gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-6 h-6 rounded-full bg-surface-container text-on-surface-variant flex items-center justify-center text-xs">
                      <Icon name="verified" size={14} />
                    </div>
                  </div>
                  <div className="flex items-center justify-between w-full pt-0.5">
                    <div>
                      <span className="font-label-md text-label-md text-on-surface-variant block">
                        <T gu="શાળા ડિજિટલ સ્વીકૃતિ અને ચલણ સાઇન" en="School Digital Receipt & Challan Sign" hi="स्कूल डिजिटल रसीद और चालान हस्ताक्षर" />
                      </span>
                      <span className="font-caption text-caption text-on-surface-variant">
                        <T gu="આચાર્ય દ્વારા સ્કેન અને સાયકલ ભૌતિક ચકાસણી" en="Principal QR scan and physical inspection" hi="प्राचार्य द्वारा क्यूआर स्कैन व भौतिक निरीक्षण" />
                      </span>
                    </div>
                    <span className="font-caption text-caption text-on-surface-variant">
                      <T gu="બાકી" en="Pending" hi="लंबित" />
                    </span>
                  </div>
                </div>
              </div>

              {/* Driver Quick Contact Row */}
              <div className="mt-4 pt-3 bg-surface-container-low p-3 rounded-lg flex items-center justify-between border border-outline-variant/40">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center text-primary">
                    <Icon name="person" size={18} />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-label-md text-label-md font-semibold text-on-surface">
                      <T
                        gu={selectedBatchForMap.driverNameGu}
                        en={selectedBatchForMap.driverNameEn}
                        hi={selectedBatchForMap.driverNameHi}
                      />
                    </span>
                    <span className="font-caption text-caption text-on-surface-variant">
                      {selectedBatchForMap.driverContact}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={`tel:${selectedBatchForMap.driverContact}`}
                    className="px-3 py-1.5 rounded-lg bg-surface-container-lowest text-primary font-label-md text-label-md hover:bg-surface-container flex items-center gap-1 shadow-sm border border-outline-variant/40"
                  >
                    <Icon name="call" size={16} />
                    <span>
                      <T gu="કોલ" en="Call" hi="कॉल" />
                    </span>
                  </a>
                  <button
                    type="button"
                    onClick={() => alert(`SOS Alert sent to DEO Anand control room for driver ${selectedBatchForMap.driverNameEn}`)}
                    className="px-3 py-1.5 rounded-lg bg-error-container text-on-error-container font-label-md text-label-md hover:bg-error hover:text-on-error flex items-center gap-1 transition-colors"
                  >
                    <Icon name="warning" size={16} />
                    <span>SOS</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Card B: Printable QR Code Tag Realistic Preview */}
            <div className="bg-surface-container-lowest rounded-xl p-5 shadow-sm flex flex-col border border-outline-variant">
              <div className="flex items-center justify-between pb-2 border-b border-surface-container">
                <div className="flex items-center gap-2">
                  <Icon name="qr_code_scanner" size={20} className="text-primary" />
                  <h3 className="font-title-md text-title-md font-bold text-on-surface">
                    <T
                      gu="ટેમ્પર-પ્રૂફ QR ટેગ સ્ટીકર પ્રીવ્યુ"
                      en="Tamper-Proof QR Tag Sticker Preview"
                      hi="टेम्पर-प्रूफ क्यूआर टैग स्टीकर पूर्वावलोकन"
                    />
                  </h3>
                </div>
                <span className="font-caption text-caption text-tertiary bg-surface-container px-2 py-0.5 rounded font-mono font-semibold">
                  ISO/IEC 18004
                </span>
              </div>
              <p className="font-caption text-caption text-on-surface-variant my-2">
                <T
                  gu="સાયકલ ફ્રેમ હેડટ્યુબ પર ચોંટાડવા માટે 3M મેટાલિક ટેમ્પર-એવિડન્ટ બારકોડ લેબલ નમૂનો."
                  en="3M metallic tamper-evident barcode label for cycle frame headtube."
                  hi="साइकिल फ्रेम हेडट्यूब पर चिपकाने हेतु 3M मेटालिक टेम्पर-एविडेंट बारकोड लेबल।"
                />
              </p>

              {/* Simulated Metallic Badge Card */}
              <div className="bg-gradient-to-br from-surface-container-lowest via-surface-container-low to-surface-container-high rounded-xl p-4 shadow-sm relative overflow-hidden border border-outline-variant">
                {/* Top Gov Watermark Header */}
                <div className="flex items-center justify-between pb-2 border-b border-outline-variant/40">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-on-primary">
                      <Icon name="account_balance" size={14} />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-label-md text-label-md font-bold text-primary leading-tight">
                        <T gu="ગુજરાત સરકાર • શિક્ષણ વિભાગ" en="Govt of Gujarat • Dept of Education" hi="गुजरात सरकार • शिक्षा विभाग" />
                      </span>
                      <span className="font-caption text-caption text-on-surface-variant">
                        <T gu="સરસ્વતી સાધના યોજના (AY 2025-26)" en="Saraswati Sadhana Yojana (AY 2025-26)" hi="सरस्वती साधना योजना (AY 2025-26)" />
                      </span>
                    </div>
                  </div>
                  <span className="font-caption text-caption px-2 py-0.5 rounded bg-surface-container-highest text-primary font-mono font-bold">
                    20 INCH
                  </span>
                </div>

                {/* Middle Content: QR Graphic & ID */}
                <div className="flex items-center gap-4 my-3 bg-surface-container-lowest p-3 rounded-lg shadow-sm border border-outline-variant/40">
                  {/* High-Fidelity SVG QR Code */}
                  <div className="w-20 h-20 bg-surface-container-lowest rounded p-1 shrink-0 flex items-center justify-center border border-outline-variant/40">
                    <svg className="w-full h-full text-on-surface" fill="currentColor" viewBox="0 0 100 100">
                      {/* Outer corners */}
                      <rect fill="currentColor" height="28" rx="2" width="28" x="5" y="5"></rect>
                      <rect fill="#FFFFFF" height="20" rx="1" width="20" x="9" y="9"></rect>
                      <rect fill="currentColor" height="10" width="10" x="14" y="14"></rect>
                      <rect fill="currentColor" height="28" rx="2" width="28" x="67" y="5"></rect>
                      <rect fill="#FFFFFF" height="20" rx="1" width="20" x="71" y="9"></rect>
                      <rect fill="currentColor" height="10" width="10" x="76" y="14"></rect>
                      <rect fill="currentColor" height="28" rx="2" width="28" x="5" y="67"></rect>
                      <rect fill="#FFFFFF" height="20" rx="1" width="20" x="9" y="71"></rect>
                      <rect fill="currentColor" height="10" width="10" x="14" y="76"></rect>
                      {/* Data noise dots */}
                      <rect fill="currentColor" height="6" width="6" x="38" y="8"></rect>
                      <rect fill="currentColor" height="6" width="8" x="48" y="14"></rect>
                      <rect fill="currentColor" height="6" width="6" x="38" y="24"></rect>
                      <rect fill="currentColor" height="6" width="12" x="48" y="34"></rect>
                      <rect fill="currentColor" height="8" width="6" x="8" y="38"></rect>
                      <rect fill="currentColor" height="6" width="12" x="22" y="48"></rect>
                      <rect fill="currentColor" height="14" width="14" x="38" y="46"></rect>
                      <rect fill="currentColor" height="10" width="6" x="58" y="48"></rect>
                      <rect fill="currentColor" height="6" width="10" x="68" y="38"></rect>
                      <rect fill="currentColor" height="8" width="10" x="82" y="48"></rect>
                      <rect fill="currentColor" height="8" width="8" x="38" y="68"></rect>
                      <rect fill="currentColor" height="8" width="8" x="52" y="68"></rect>
                      <rect fill="currentColor" height="6" width="12" x="68" y="68"></rect>
                      <rect fill="currentColor" height="8" width="8" x="84" y="80"></rect>
                      <rect fill="currentColor" height="10" width="10" x="48" y="82"></rect>
                    </svg>
                  </div>

                  {/* Details metadata */}
                  <div className="flex flex-col min-w-0">
                    <span className="font-caption text-caption text-on-surface-variant uppercase font-medium">
                      <T gu="યુનિક સાયકલ સીરીયલ ID" en="Unique Cycle Serial ID" hi="विशिष्ट साइकिल सीरियल ID" />
                    </span>
                    <span className="font-title-md text-title-md font-mono font-bold text-primary truncate">
                      SSB-2026-077432
                    </span>
                    <span className="font-body-sm text-body-sm font-semibold text-on-surface mt-0.5 truncate">
                      <T
                        gu="શ્રી સરદાર પટેલ હાઇસ્કૂલ, આણંદ"
                        en="Shree Sardar Patel High School, Anand"
                        hi="श्री सरदार पटेल हाईस्कूल, आणंद"
                      />
                    </span>
                    <div className="flex items-center gap-1 mt-1 font-caption text-caption text-tertiary">
                      <Icon name="shield" size={14} />
                      <span>
                        <T
                          gu="હીરો/એટલાસ સાયકલ વટવા પ્લાન્ટ-૩"
                          en="Atlas/Hero Cycles Vatva Plant-3"
                          hi="एटलस/हीरो साइकिल वटवा प्लांट-3"
                        />
                      </span>
                    </div>
                  </div>
                </div>

                {/* Statutory Warning Banner */}
                <div className="bg-error-container text-on-error-container px-2.5 py-1.5 rounded font-caption text-caption flex items-center gap-1.5 font-medium">
                  <Icon name="gavel" size={16} className="shrink-0" />
                  <span className="truncate">
                    <T
                      gu="ગુજરાત સરકારની મિલકત — વેચાણ કે ટ્રાન્સફર કાયદાકીય ગુનો છે."
                      en="Govt of Gujarat Property — Sale or transfer is punishable by law."
                      hi="गुजरात सरकार की संपत्ति — विक्रय या हस्तांतरण कानूनी अपराध है।"
                    />
                  </span>
                </div>
              </div>

              {/* Print Action Button */}
              <Link
                href="/vendor/qr"
                className="mt-3 w-full py-2.5 px-4 rounded-lg bg-surface-container text-primary font-title-md text-title-md hover:bg-surface-container-high transition-colors flex items-center justify-center gap-2 shadow-sm border border-outline-variant/40"
              >
                <Icon name="print" size={20} />
                <span>
                  <T
                    gu="૧૨૦ લેબલ્સ પ્રિન્ટ કરો (A4 Barcode Sheets)"
                    en="Print 120 Labels (A4 Barcode Sheets)"
                    hi="120 लेबल प्रिंट करें (A4 बारकोड शीट्स)"
                  />
                </span>
              </Link>
            </div>

            {/* Right Card C: Treasury Escrow & Milestone Payout */}
            <div className="bg-surface-container-lowest rounded-xl p-5 shadow-sm flex flex-col border border-outline-variant">
              <div className="flex items-center justify-between pb-2 border-b border-surface-container">
                <div className="flex items-center gap-2">
                  <Icon name="account_balance_wallet" size={20} className="text-tertiary" />
                  <h3 className="font-title-md text-title-md font-bold text-on-surface">
                    <T
                      gu="ટ્રેઝરી એસ્ક્રૉ અને માઇલસ્ટોન ચુકવણી"
                      en="Treasury Escrow & Milestone Payout"
                      hi="कोषागार एस्क्रो एवं माइलस्टोन भुगतान"
                    />
                  </h3>
                </div>
                <span className="px-2 py-0.5 rounded bg-surface-container-high text-tertiary font-label-md text-label-md font-bold">
                  IFMS-Escrow
                </span>
              </div>
              <p className="font-caption text-caption text-on-surface-variant my-2">
                <T
                  gu="ગુજરાત રાજ્ય શિક્ષણ વિભાગ દ્વારા સીધી બેંક ટ્રાન્સફર (DBT) પ્રગતિ ચાર્ટ."
                  en="Govt of Gujarat Education Department DBT payment progress chart."
                  hi="गुजरात राज्य शिक्षा विभाग द्वारा डीबीटी भुगतान प्रगति चार्ट।"
                />
              </p>

              {/* Waterfall Milestones */}
              <div className="flex flex-col gap-3">
                {/* Milestone 1 */}
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between font-label-md text-label-md">
                    <span className="font-semibold text-on-surface flex items-center gap-1.5">
                      <Icon name="check_circle" size={16} className="text-primary" />
                      <T
                        gu="તબક્કો ૧: ઉત્પાદન અને QC ક્લિયરન્સ (૩૦%)"
                        en="Phase 1: Production & QC Clearance (30%)"
                        hi="चरण 1: उत्पादन एवं QC क्लीयरेंस (30%)"
                      />
                    </span>
                    <span className="font-bold text-primary font-mono">₹ ૩૩.૬૦ કરોડ (100%)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-surface-container overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: "100%" }}></div>
                  </div>
                  <span className="font-caption text-caption text-on-surface-variant">
                    <T
                      gu="CIPET લેબ ટેસ્ટિંગ પાસ • ૨૨ જાન્યુઆરી ૨૦૨૬"
                      en="CIPET Lab Testing Approved • 22 Jan 2026"
                      hi="CIPET लैब टेस्टिंग पास • 22 जनवरी 2026"
                    />
                  </span>
                </div>

                {/* Milestone 2 */}
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between font-label-md text-label-md">
                    <span className="font-semibold text-on-surface flex items-center gap-1.5">
                      <Icon name="hourglass_bottom" size={16} className="text-secondary" />
                      <T
                        gu="તબક્કો ૨: શાળા ગોડાઉન ડિલિવરી પુરાવો (૪૦%)"
                        en="Phase 2: School Warehouse Delivery Proof (40%)"
                        hi="चरण 2: स्कूल गोदाम डिलीवरी प्रमाण (40%)"
                      />
                    </span>
                    <span className="font-bold text-secondary font-mono">₹ ૪૪.૮૦ કરોડ (82%)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-surface-container overflow-hidden">
                    <div className="h-full bg-secondary rounded-full" style={{ width: "82%" }}></div>
                  </div>
                  <span className="font-caption text-caption text-on-surface-variant">
                    <T
                      gu="શાળા આચાર્ય ચલણ સ્વીકૃતિ • ૮૨% પૂર્ણ"
                      en="School Principal Challan Acceptance • 82% Completed"
                      hi="स्कूल प्राचार्य चालान स्वीकृति • 82% पूर्ण"
                    />
                  </span>
                </div>

                {/* Milestone 3 */}
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between font-label-md text-label-md">
                    <span className="font-semibold text-on-surface flex items-center gap-1.5">
                      <Icon name="lock_clock" size={16} className="text-tertiary" />
                      <T
                        gu="તબક્કો ૩: વિદ્યાર્થીને અંતિમ OTP હસ્તાંતરણ (૩૦%)"
                        en="Phase 3: Final Student OTP Handover (30%)"
                        hi="चरण 3: छात्र को अंतिम OTP हस्तांतरण (30%)"
                      />
                    </span>
                    <span className="font-bold text-tertiary font-mono">₹ ૨૧.૭૪ કરોડ (45%)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-surface-container overflow-hidden">
                    <div className="h-full bg-tertiary rounded-full" style={{ width: "45%" }}></div>
                  </div>
                  <span className="font-caption text-caption text-on-surface-variant">
                    <T
                      gu="વાલી આધાર કાર્ડ બાયોમેટ્રિક / OTP વેરિફિકેશન આધારે"
                      en="Parent Aadhaar Biometric / OTP Verification Based"
                      hi="अभिभावक आधार बायोमेट्रिक / OTP सत्यापन आधार पर"
                    />
                  </span>
                </div>
              </div>

              {/* Trust Note Footer */}
              <div className="mt-4 p-3 rounded-lg bg-surface-container-high flex items-center gap-3 border border-outline-variant/30">
                <Icon name="verified" size={22} className="text-primary shrink-0" />
                <p className="font-caption text-caption text-on-surface">
                  <T
                    gu="ગાંધીનગર નાણાં વિભાગના પરિપત્ર મુજબ શાળા સ્વીકૃતિ થયાના ૭૨ કલાકમાં રકમ વેન્ડર ખાતામાં આપમેળે જમા થાય છે."
                    en="As per Gandhinagar Finance Dept circular, funds are credited to vendor account within 72 hours of school verification."
                    hi="गांधीनगर वित्त विभाग परिपत्र अनुसार विद्यालय स्वीकृति के 72 घंटे में राशि स्वतः जमा हो जाती है।"
                  />
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </OfficerShell>
  );
}
