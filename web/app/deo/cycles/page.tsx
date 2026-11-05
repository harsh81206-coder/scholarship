"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { OfficerShell } from "@/components/shell/OfficerShell";
import { T } from "@/components/T";
import { Icon } from "@/components/Icon";


// Mock Data Types
interface SchoolCycleData {
  id: string;
  nameGu: string;
  nameEn: string;
  nameHi: string;
  taluka: string;
  udise: string;
  allocated: number;
  received: number;
  handedOver: number;
  pending: number;
  status: "completed" | "progress" | "delayed";
  batchId: string;
  nodalTeacher: string;
  nodalPhone: string;
  x?: number; // percent on map
  y?: number;
}

interface BatchData {
  batchId: string;
  vendor: string;
  quantity: number;
  dispatchDate: string;
  schoolsCovered: number;
  schoolsDescriptionGu: string;
  schoolsDescriptionEn: string;
  schoolsDescriptionHi: string;
  deliveredPercent: number;
  status: "delivered" | "transit" | "arrived" | "delayed";
  vehicleNumber: string;
  etaGu: string;
  etaEn: string;
  etaHi: string;
}

interface TalukaStat {
  id: string;
  nameGu: string;
  nameEn: string;
  nameHi: string;
  allocated: number;
  received: number;
  handedOver: number;
  schoolsCount: number;
  delayedCount: number;
}

const TALUKA_STATS: TalukaStat[] = [
  { id: "anand", nameGu: "આણંદ", nameEn: "Anand", nameHi: "आणंद", allocated: 3200, received: 3100, handedOver: 2850, schoolsCount: 42, delayedCount: 0 },
  { id: "borsad", nameGu: "બોરસદ", nameEn: "Borsad", nameHi: "बोरसद", allocated: 2100, received: 1950, handedOver: 1620, schoolsCount: 28, delayedCount: 2 },
  { id: "khambhat", nameGu: "ખંભાત", nameEn: "Khambhat", nameHi: "खंभात", allocated: 1800, received: 1420, handedOver: 1180, schoolsCount: 24, delayedCount: 4 },
  { id: "petlad", nameGu: "પેટલાદ", nameEn: "Petlad", nameHi: "पेटलाद", allocated: 1500, received: 1400, handedOver: 1250, schoolsCount: 20, delayedCount: 0 },
  { id: "umreth", nameGu: "ઉમરેઠ", nameEn: "Umreth", nameHi: "उमरेठ", allocated: 1200, received: 1150, handedOver: 1020, schoolsCount: 16, delayedCount: 1 },
  { id: "anklav", nameGu: "આંકલાવ", nameEn: "Anklav", nameHi: "आंकलाव", allocated: 900, received: 880, handedOver: 760, schoolsCount: 12, delayedCount: 0 },
  { id: "sojitra", nameGu: "સોજિત્રા", nameEn: "Sojitra", nameHi: "सोजित्रा", allocated: 700, received: 700, handedOver: 680, schoolsCount: 8, delayedCount: 0 },
  { id: "tarapur", nameGu: "તારાપુર", nameEn: "Tarapur", nameHi: "तारापुर", allocated: 600, received: 600, handedOver: 560, schoolsCount: 6, delayedCount: 0 },
];

const MOCK_SCHOOLS: SchoolCycleData[] = [
  {
    id: "sch-01",
    nameGu: "શ્રી સરદાર પટેલ હાઈસ્કૂલ, આણંદ",
    nameEn: "Shree Sardar Patel High School, Anand",
    nameHi: "श्री सरदार पटेल हाई स्कूल, आणंद",
    taluka: "anand",
    udise: "24150104502",
    allocated: 120,
    received: 120,
    handedOver: 96,
    pending: 24,
    status: "progress",
    batchId: "CYCLE-2026-AN-001",
    nodalTeacher: "શ્રી આર. કે. પટેલ",
    nodalPhone: "98791-23456",
    x: 58,
    y: 42,
  },
  {
    id: "sch-02",
    nameGu: "વિનય મંદિર હાઈસ્કૂલ, આણંદ",
    nameEn: "Vinay Mandir High School, Anand",
    nameHi: "विनय मंदिर हाई स्कूल, आणंद",
    taluka: "anand",
    udise: "24150102101",
    allocated: 110,
    received: 110,
    handedOver: 110,
    pending: 0,
    status: "completed",
    batchId: "CYCLE-2026-AN-001",
    nodalTeacher: "શ્રીમતી એમ. એન. દેસાઈ",
    nodalPhone: "98240-88123",
    x: 54,
    y: 33,
  },
  {
    id: "sch-03",
    nameGu: "સાર્વજનિક હાઇસ્કૂલ, ખંભાત",
    nameEn: "Sarvajanik High School, Khambhat",
    nameHi: "सार्वजनिक हाई स्कूल, खंभात",
    taluka: "khambhat",
    udise: "24150305204",
    allocated: 140,
    received: 60,
    handedOver: 45,
    pending: 95,
    status: "delayed",
    batchId: "CYCLE-2026-AN-002",
    nodalTeacher: "શ્રી ડી. બી. પરમાર",
    nodalPhone: "94260-19283",
    x: 26,
    y: 72,
  },
  {
    id: "sch-04",
    nameGu: "બોરસદ કન્યા વિદ્યાલય, બોરસદ",
    nameEn: "Borsad Kanya Vidyalaya, Borsad",
    nameHi: "बोरसद कन्या विद्यालय, बोरसद",
    taluka: "borsad",
    udise: "24150201809",
    allocated: 90,
    received: 88,
    handedOver: 75,
    pending: 15,
    status: "delayed",
    batchId: "CYCLE-2026-AN-003",
    nodalTeacher: "શ્રીમતી પી. એસ. વાઘેલા",
    nodalPhone: "97250-44910",
    x: 52,
    y: 68,
  },
  {
    id: "sch-05",
    nameGu: "જનતા વિદ્યાલય, તારાપુર",
    nameEn: "Janta Vidyalaya, Tarapur",
    nameHi: "जनता विद्यालय, तारापुर",
    taluka: "tarapur",
    udise: "24150801201",
    allocated: 80,
    received: 80,
    handedOver: 65,
    pending: 15,
    status: "progress",
    batchId: "CYCLE-2026-AN-004",
    nodalTeacher: "શ્રી કે. એલ. સોલંકી",
    nodalPhone: "98980-33211",
    x: 20,
    y: 38,
  },
  {
    id: "sch-06",
    nameGu: "મોડેલ સ્કૂલ, ઉમરેઠ",
    nameEn: "Model School, Umreth",
    nameHi: "मॉडल स्कूल, उमरेठ",
    taluka: "umreth",
    udise: "24150503302",
    allocated: 95,
    received: 95,
    handedOver: 78,
    pending: 17,
    status: "progress",
    batchId: "CYCLE-2026-AN-001",
    nodalTeacher: "શ્રી એન. આર. જોષી",
    nodalPhone: "94080-66772",
    x: 75,
    y: 28,
  },
  {
    id: "sch-07",
    nameGu: "આંકલાવ માધ્યમિક શાળા, આંકલાવ",
    nameEn: "Anklav Secondary School, Anklav",
    nameHi: "आंकलाव माध्यमिक स्कूल, आंकलाव",
    taluka: "anklav",
    udise: "24150601103",
    allocated: 75,
    received: 75,
    handedOver: 68,
    pending: 7,
    status: "progress",
    batchId: "CYCLE-2026-AN-003",
    nodalTeacher: "શ્રીમતી એ. વી. શાહ",
    nodalPhone: "98255-77890",
    x: 68,
    y: 78,
  },
  {
    id: "sch-08",
    nameGu: "સોજિત્રા સાર્વજનિક વિદ્યાલય, સોજિત્રા",
    nameEn: "Sojitra Sarvajanik Vidyalaya, Sojitra",
    nameHi: "सोजित्रा सार्वजनिक विद्यालय, सोजित्रा",
    taluka: "sojitra",
    udise: "24150700802",
    allocated: 65,
    received: 65,
    handedOver: 65,
    pending: 0,
    status: "completed",
    batchId: "CYCLE-2026-AN-004",
    nodalTeacher: "શ્રી એચ. પી. પટેલ",
    nodalPhone: "99090-11223",
    x: 42,
    y: 25,
  },
];

const MOCK_BATCHES: BatchData[] = [
  {
    batchId: "CYCLE-2026-AN-001",
    vendor: "Atlas Ltd",
    quantity: 200,
    dispatchDate: "28 Oct 2026",
    schoolsCovered: 12,
    schoolsDescriptionGu: "આણંદ અને ઉમરેઠની ૧૨ શાળાઓ",
    schoolsDescriptionEn: "12 schools in Anand & Umreth talukas",
    schoolsDescriptionHi: "आणंद और उमरेठ के 12 स्कूल",
    deliveredPercent: 85,
    status: "transit",
    vehicleNumber: "GJ-23-AT-8841",
    etaGu: "આજે સાંજે ૦૪:૩૦ વાગ્યે",
    etaEn: "Today at 04:30 PM",
    etaHi: "आज शाम 04:30 बजे",
  },
  {
    batchId: "CYCLE-2026-AN-002",
    vendor: "Atlas Logistics Ltd",
    quantity: 480,
    dispatchDate: "02 Nov 2026",
    schoolsCovered: 5,
    schoolsDescriptionGu: "વડોદરા ડેપો → ખંભાત ક્લસ્ટર (૫ શાળાઓ)",
    schoolsDescriptionEn: "Vadodara Depot → Khambhat Cluster (5 schools)",
    schoolsDescriptionHi: "वडोदरा डिपो → खंभात क्लस्टर (5 स्कूल)",
    deliveredPercent: 78,
    status: "delayed",
    vehicleNumber: "GJ-23-AT-8841",
    etaGu: "૪ દિવસ વિલંબ - વેન્ડર સ્પષ્ટીકરણ બાકી",
    etaEn: "4 Days Delayed - Vendor response pending",
    etaHi: "4 दिन विलंब - विक्रेता स्पष्टीकरण लंबित",
  },
  {
    batchId: "CYCLE-2026-AN-003",
    vendor: "Hero Cycles Ltd",
    quantity: 620,
    dispatchDate: "25 Oct 2026",
    schoolsCovered: 8,
    schoolsDescriptionGu: "કરમસદ ડેપો → પેટલાદ અને બોરસદ (૮ શાળાઓ)",
    schoolsDescriptionEn: "Karamsad Depot → Petlad & Borsad (8 schools)",
    schoolsDescriptionHi: "करमसद डिपो → पेटलाद और बोरसद (8 स्कूल)",
    deliveredPercent: 90,
    status: "arrived",
    vehicleNumber: "GJ-06-HC-4412",
    etaGu: "શાળા પહોંચી ગયેલ - આચાર્ય વેરિફિકેશન ચાલુ",
    etaEn: "Delivered to schools - Verification ongoing",
    etaHi: "स्कूल पहुंच गई - सत्यापन जारी",
  },
  {
    batchId: "CYCLE-2026-AN-004",
    vendor: "Avon Cycles Gujarat",
    quantity: 340,
    dispatchDate: "20 Oct 2026",
    schoolsCovered: 4,
    schoolsDescriptionGu: "સોજિત્રા અને તારાપુર (૪ શાળાઓ)",
    schoolsDescriptionEn: "Sojitra & Tarapur (4 schools)",
    schoolsDescriptionHi: "सोजित्रा और तारापुर (4 स्कूल)",
    deliveredPercent: 100,
    status: "delivered",
    vehicleNumber: "GJ-07-AC-9102",
    etaGu: "સંપૂર્ણ વિતરિત • ડિજિટલ લોગ ક્લોઝ્ડ",
    etaEn: "100% Completed • Digital audit closed",
    etaHi: "पूर्णतः वितरित • डिजिटल लॉग बंद",
  },
];

export default function CycleSupplyChainPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTaluka, setSelectedTaluka] = useState("all");
  const [selectedVendor, setSelectedVendor] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedSchoolId, setSelectedSchoolId] = useState<string>("sch-01");
  const [showSchools, setShowSchools] = useState(true);
  const [showGps, setShowGps] = useState(true);
  const [showDepot, setShowDepot] = useState(true);
  const [showDistrictStatsModal, setShowDistrictStatsModal] = useState(false);
  const [actionNotice, setActionNotice] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "batches" | "schools">("overview");

  const selectedSchool = useMemo(
    () => MOCK_SCHOOLS.find((s) => s.id === selectedSchoolId) || MOCK_SCHOOLS[0],
    [selectedSchoolId]
  );

  const filteredSchools = useMemo(() => {
    return MOCK_SCHOOLS.filter((school) => {
      const matchesSearch =
        searchQuery === "" ||
        school.nameGu.toLowerCase().includes(searchQuery.toLowerCase()) ||
        school.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
        school.udise.includes(searchQuery) ||
        school.batchId.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesTaluka = selectedTaluka === "all" || school.taluka === selectedTaluka;
      const matchesStatus =
        selectedStatus === "all" ||
        (selectedStatus === "100" && school.status === "completed") ||
        (selectedStatus === "progress" && school.status === "progress") ||
        (selectedStatus === "delayed" && school.status === "delayed");

      return matchesSearch && matchesTaluka && matchesStatus;
    });
  }, [searchQuery, selectedTaluka, selectedStatus]);

  const filteredBatches = useMemo(() => {
    return MOCK_BATCHES.filter((b) => {
      const matchesSearch =
        searchQuery === "" ||
        b.batchId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.vendor.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesVendor =
        selectedVendor === "all" ||
        (selectedVendor === "atlas" && b.vendor.toLowerCase().includes("atlas")) ||
        (selectedVendor === "hero" && b.vendor.toLowerCase().includes("hero")) ||
        (selectedVendor === "avon" && b.vendor.toLowerCase().includes("avon"));

      const matchesStatus =
        selectedStatus === "all" ||
        (selectedStatus === "100" && b.status === "delivered") ||
        (selectedStatus === "progress" && (b.status === "transit" || b.status === "arrived")) ||
        (selectedStatus === "delayed" && b.status === "delayed");

      return matchesSearch && matchesVendor && matchesStatus;
    });
  }, [searchQuery, selectedVendor, selectedStatus]);

  const triggerNotice = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 3500);
  };

  return (
    <OfficerShell role="deo">
      <div className="w-full bg-surface min-h-screen">
        {/* Action toast banner */}
        {actionNotice && (
          <div className="fixed top-20 right-8 z-50 bg-primary text-on-primary px-4 py-3 rounded-xl shadow-level-3 flex items-center gap-3 animate-fade-in">
            <Icon name="check_circle" size={20} className="text-white" />
            <span className="font-label-lg text-sm">{actionNotice}</span>
          </div>
        )}

        <div className="w-full px-6 py-5 max-w-[1440px] mx-auto space-y-6">
          {/* Breadcrumb & Context Header Area */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="space-y-1.5">
              <nav className="flex items-center gap-2 text-on-surface-variant font-label-md text-label-md">
                <Link href="/deo" className="hover:text-primary transition-colors">
                  <T gu="જિલ્લા કચેરી (આણંદ)" en="District HQ (Anand)" hi="जिला मुख्यालय (आणंद)" />
                </Link>
                <span className="text-outline">/</span>
                <span className="hover:text-primary transition-colors">
                  <T gu="સરસ્વતી સાધના યોજના" en="Saraswati Sadhna Scheme" hi="सरस्वती साधना योजना" />
                </span>
                <span className="text-outline">/</span>
                <span className="text-primary font-bold">
                  <T gu="સાયકલ સપ્લાય ચેઈન અને વિતરણ નકશો" en="Cycle Supply Chain & Distribution Map" hi="साइकिल आपूर्ति श्रृंखला और वितरण नक्शा" />
                </span>
              </nav>
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-7 bg-primary rounded-full" />
                <div>
                  <h1 className="font-headline-md text-headline-md text-on-surface font-bold tracking-tight">
                    <T
                      gu="સરસ્વતી સાધના સાયકલ સપ્લાય ચેઈન અને જીપીએસ વિતરણ મોનિટર"
                      en="Saraswati Sadhna Cycle Supply Chain & GPS Distribution Monitor"
                      hi="सरस्वती साधना साइकिल आपूर्ति श्रृंखला और जीपीएस वितरण मॉनिटर"
                    />
                  </h1>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                    <T
                      gu="આણંદ જિલ્લાની તમામ માધ્યમિક શાળાઓ માટે વેન્ડર ડિસ્પેચ, શાળા પ્રાપ્તિ અને વિદ્યાર્થી હેન્ડઓવરનું લાઈવ ટ્રેકિંગ (Academic Year 2025-26)"
                      en="Live tracking of vendor dispatch, school arrival, and student handover for all secondary schools in Anand district (Academic Year 2025-26)"
                      hi="आणंद जिले के सभी माध्यमिक स्कूलों के लिए विक्रेता प्रेषण, स्कूल प्राप्ति और छात्र हैंडओवर का लाइव ट्रैकिंग (Academic Year 2025-26)"
                    />
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-3 shrink-0 self-start lg:self-center">
              <button
                type="button"
                onClick={() => triggerNotice("Challan Report exported successfully (.xlsx)")}
                className="h-11 px-4 rounded-xl bg-surface-container-lowest text-primary font-label-lg text-label-lg font-semibold shadow-sm hover:bg-surface-container-high transition-all flex items-center gap-2 border border-outline-variant"
              >
                <Icon name="sim_card_download" size={20} className="text-primary" />
                <span>
                  <T gu="ચલણ રિપોર્ટ (.xlsx)" en="Challan Report (.xlsx)" hi="चालान रिपोर्ट (.xlsx)" />
                </span>
              </button>
              <button
                type="button"
                onClick={() => triggerNotice("Stock Allocation Order modal generated")}
                className="h-11 px-5 rounded-xl bg-secondary-container text-on-secondary font-label-lg text-label-lg font-bold shadow-md hover:bg-secondary transition-all flex items-center gap-2"
              >
                <Icon name="assignment_add" size={20} />
                <span>
                  <T gu="નવો સ્ટોક ફાળવણી આદેશ" en="New Stock Allocation Order" hi="नया स्टॉक आवंटन आदेश" />
                </span>
              </button>
            </div>
          </div>

          {/* 1. Top Funnel Stepper / Pipeline Progress Strip (5 Stages: Ordered → Manufactured → Dispatched → School Arrived → Handed Over) */}
          <section className="w-full bg-surface-container-lowest rounded-2xl p-5 shadow-sm border border-outline-variant">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3.5 mb-4 border-b border-surface-container gap-2">
              <div className="flex items-center gap-2.5 flex-wrap">
                <Icon name="alt_route" size={22} className="text-primary" />
                <span className="font-title-md text-title-md text-on-surface font-bold">
                  <T
                    gu="રાજ્ય ફાળવણી અને જિલ્લા વિતરણ પ્રોગ્રેસ પાઇપલાઇન"
                    en="State Allocation & District Distribution Pipeline"
                    hi="राज्य आवंटन और जिला वितरण प्रगति पाइपलाइन"
                  />
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-surface-container-highest text-primary font-label-md text-label-md font-bold">
                  <T gu="લક્ષ્યાંક: ૧૨,૦૦૦ કન્યા સાયકલો" en="Target: 12,000 Girls Bicycles" hi="लक्ष्य: 12,000 कन्या साइकिलें" />
                </span>
              </div>
              <div className="flex items-center gap-2 font-caption text-caption text-on-surface-variant">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span>
                  <T gu="છેલ્લું વેરિફિકેશન: આજે બપોરે ૦૨:૧૫ વાગ્યે" en="Last synced: Today at 02:15 PM" hi="अंतिम सत्यापन: आज दोपहर 02:15 बजे" />
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
              {/* Step 1: કુલ ઓર્ડર કરેલ (Ordered) */}
              <div className="relative bg-surface-container-low rounded-xl p-3.5 flex flex-col justify-between border border-outline-variant/60">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-primary-container text-on-primary font-label-md text-xs flex items-center justify-center font-bold">
                      1
                    </span>
                    <div>
                      <p className="font-label-md text-label-md text-on-surface font-bold leading-tight">
                        <T gu="કુલ ઓર્ડર કરેલ" en="Ordered" hi="कुल ऑर्डर" />
                      </p>
                      <p className="font-caption text-[11px] text-on-surface-variant">Atlas &amp; Hero</p>
                    </div>
                  </div>
                  <span className="px-1.5 py-0.5 rounded bg-primary-fixed text-primary font-label-md text-[11px] font-bold">
                    100%
                  </span>
                </div>
                <div className="mt-3">
                  <div className="flex items-baseline justify-between">
                    <span className="font-headline-sm text-headline-sm font-bold text-on-surface">૧૨,૦૦૦</span>
                    <span className="font-caption text-[11px] text-on-surface-variant">
                      <T gu="કુલ આદેશિત" en="Allocated" hi="कुल आवंटित" />
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-surface-container-high rounded-full mt-1.5 overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: "100%" }} />
                  </div>
                </div>
              </div>

              {/* Step 2: ઉત્પાદન પૂર્ણ (Manufactured) */}
              <div className="relative bg-surface-container-low rounded-xl p-3.5 flex flex-col justify-between border border-outline-variant/60">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-primary text-on-primary font-label-md text-xs flex items-center justify-center font-bold">
                      2
                    </span>
                    <div>
                      <p className="font-label-md text-label-md text-on-surface font-bold leading-tight">
                        <T gu="ઉત્પાદન પૂર્ણ" en="Manufactured" hi="उत्पादन पूर्ण" />
                      </p>
                      <p className="font-caption text-[11px] text-on-surface-variant">
                        <T gu="પ્લાન્ટ QA પાસ" en="Plant QA Pass" hi="प्लांट QA पास" />
                      </p>
                    </div>
                  </div>
                  <span className="px-1.5 py-0.5 rounded bg-primary-fixed text-primary font-label-md text-[11px] font-bold">
                    96.7%
                  </span>
                </div>
                <div className="mt-3">
                  <div className="flex items-baseline justify-between">
                    <span className="font-headline-sm text-headline-sm font-bold text-primary">૧૧,૬૦૦</span>
                    <span className="font-caption text-[11px] text-on-surface-variant">
                      <T gu="તૈયાર સ્ટોક" en="Ready Stock" hi="तैयार स्टॉक" />
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-surface-container-high rounded-full mt-1.5 overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: "96.7%" }} />
                  </div>
                </div>
              </div>

              {/* Step 3: વેન્ડર ડિસ્પેચ (Dispatched) */}
              <div className="relative bg-surface-container-low rounded-xl p-3.5 flex flex-col justify-between border border-outline-variant/60">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-primary text-on-primary font-label-md text-xs flex items-center justify-center font-bold">
                      3
                    </span>
                    <div>
                      <p className="font-label-md text-label-md text-on-surface font-bold leading-tight">
                        <T gu="વેન્ડર ડિસ્પેચ" en="Dispatched" hi="प्रेषित" />
                      </p>
                      <p className="font-caption text-[11px] text-on-surface-variant">
                        <T gu="ડેપોમાંથી રવાના" en="From Depot" hi="डिपो से रवाना" />
                      </p>
                    </div>
                  </div>
                  <span className="px-1.5 py-0.5 rounded bg-surface-container-highest text-primary font-label-md text-[11px] font-bold">
                    93.3%
                  </span>
                </div>
                <div className="mt-3">
                  <div className="flex items-baseline justify-between">
                    <span className="font-headline-sm text-headline-sm font-bold text-primary">૧૧,૨૦૦</span>
                    <span className="font-caption text-[11px] text-secondary font-semibold">
                      <T gu="+૪૮૦ માર્ગમાં" en="+480 Transit" hi="+480 मार्ग में" />
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-surface-container-high rounded-full mt-1.5 overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: "93.3%" }} />
                  </div>
                </div>
              </div>

              {/* Step 4: શાળાઓમાં પ્રાપ્ત (School Arrived) */}
              <div className="relative bg-surface-container-low rounded-xl p-3.5 flex flex-col justify-between border border-outline-variant/60">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-tertiary text-on-tertiary font-label-md text-xs flex items-center justify-center font-bold">
                      4
                    </span>
                    <div>
                      <p className="font-label-md text-label-md text-on-surface font-bold leading-tight">
                        <T gu="શાળાઓમાં પ્રાપ્ત" en="School Arrived" hi="स्कूल प्राप्त" />
                      </p>
                      <p className="font-caption text-[11px] text-on-surface-variant">
                        <T gu="આચાર્ય ઇનવર્ડ" en="Principal Inward" hi="प्राचार्य इनवर्ड" />
                      </p>
                    </div>
                  </div>
                  <span className="px-1.5 py-0.5 rounded bg-tertiary-fixed text-on-tertiary-fixed font-label-md text-[11px] font-bold">
                    81.7%
                  </span>
                </div>
                <div className="mt-3">
                  <div className="flex items-baseline justify-between">
                    <span className="font-headline-sm text-headline-sm font-bold text-tertiary">૯,૮૦૦</span>
                    <span className="font-caption text-[11px] text-on-surface-variant">
                      <T gu="૧૫૬ શાળાઓ" en="156 Schools" hi="156 स्कूल" />
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-surface-container-high rounded-full mt-1.5 overflow-hidden">
                    <div className="h-full bg-tertiary rounded-full" style={{ width: "81.7%" }} />
                  </div>
                </div>
              </div>

              {/* Step 5: વિદ્યાર્થી હેન્ડઓવર (Handed Over) */}
              <div className="relative bg-surface-container-low rounded-xl p-3.5 flex flex-col justify-between border border-outline-variant/60">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-secondary-container text-on-secondary font-label-md text-xs flex items-center justify-center font-bold">
                      5
                    </span>
                    <div>
                      <p className="font-label-md text-label-md text-on-surface font-bold leading-tight">
                        <T gu="વિદ્યાર્થી હેન્ડઓવર" en="Handed Over" hi="हस्तांतरित" />
                      </p>
                      <p className="font-caption text-[11px] text-on-surface-variant">
                        <T gu="QR + OTP માન્ય" en="QR + OTP Valid" hi="QR + OTP मान्य" />
                      </p>
                    </div>
                  </div>
                  <span className="px-1.5 py-0.5 rounded bg-secondary-fixed text-on-secondary-fixed font-label-md text-[11px] font-bold">
                    71.0%
                  </span>
                </div>
                <div className="mt-3">
                  <div className="flex items-baseline justify-between">
                    <span className="font-headline-sm text-headline-sm font-bold text-secondary">૮,૫૨૦</span>
                    <span className="font-caption text-[11px] text-on-surface-variant">
                      <T gu="બાકી: ૧,૨૮૦" en="Pending: 1,280" hi="लंबित: 1,280" />
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-surface-container-high rounded-full mt-1.5 overflow-hidden">
                    <div className="h-full bg-secondary-container rounded-full" style={{ width: "71%" }} />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 2. Filters & Controls Bar */}
          <section className="w-full bg-surface-container-lowest rounded-2xl p-4 shadow-sm border border-outline-variant space-y-3">
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
              {/* Search & Selectors */}
              <div className="flex flex-wrap items-center gap-3 flex-1">
                {/* Search Input */}
                <div className="relative flex-1 min-w-[240px]">
                  <Icon name="search" size={20} className="absolute left-3.5 top-3 text-outline" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="શાળાનું નામ, UDISE અથવા બેચ ID શોધો / Search school, UDISE, batch..."
                    className="w-full h-11 pl-10 pr-4 rounded-xl bg-surface-container-low text-on-surface placeholder:text-outline font-body-sm text-body-sm focus:outline-none focus:ring-2 focus:ring-primary border border-outline-variant"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-3 text-outline hover:text-on-surface"
                    >
                      <Icon name="close" size={18} />
                    </button>
                  )}
                </div>

                {/* Taluka Filter Dropdown */}
                <div className="relative min-w-[180px]">
                  <select
                    value={selectedTaluka}
                    onChange={(e) => setSelectedTaluka(e.target.value)}
                    className="w-full h-11 px-3.5 pr-8 rounded-xl bg-surface-container-low text-on-surface font-label-md text-label-md font-medium appearance-none cursor-pointer focus:outline-none border border-outline-variant"
                  >
                    <option value="all">તમામ ૮ તાલુકાઓ / All 8 Talukas</option>
                    <option value="anand">આણંદ (Anand)</option>
                    <option value="borsad">બોરસદ (Borsad)</option>
                    <option value="khambhat">ખંભાત (Khambhat)</option>
                    <option value="petlad">પેટલાદ (Petlad)</option>
                    <option value="umreth">ઉમરેઠ (Umreth)</option>
                    <option value="anklav">આંકલાવ (Anklav)</option>
                    <option value="sojitra">સોજિત્રા (Sojitra)</option>
                    <option value="tarapur">તારાપુર (Tarapur)</option>
                  </select>
                  <Icon name="expand_more" size={20} className="absolute right-2.5 top-3 pointer-events-none text-outline" />
                </div>

                {/* Vendor Filter Dropdown */}
                <div className="relative min-w-[170px]">
                  <select
                    value={selectedVendor}
                    onChange={(e) => setSelectedVendor(e.target.value)}
                    className="w-full h-11 px-3.5 pr-8 rounded-xl bg-surface-container-low text-on-surface font-label-md text-label-md font-medium appearance-none cursor-pointer focus:outline-none border border-outline-variant"
                  >
                    <option value="all">તમામ વેન્ડર્સ / All Vendors</option>
                    <option value="atlas">Atlas Logistics Ltd.</option>
                    <option value="hero">Hero Cycles Gujarat</option>
                    <option value="avon">Avon Nodal Delivery</option>
                  </select>
                  <Icon name="expand_more" size={20} className="absolute right-2.5 top-3 pointer-events-none text-outline" />
                </div>

                {/* Status Filter Dropdown */}
                <div className="relative min-w-[160px]">
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full h-11 px-3.5 pr-8 rounded-xl bg-surface-container-low text-on-surface font-label-md text-label-md font-medium appearance-none cursor-pointer focus:outline-none border border-outline-variant"
                  >
                    <option value="all">તમામ સ્થિતિ / All Status</option>
                    <option value="100">૧૦૦% વિતરિત (Completed)</option>
                    <option value="progress">પ્રગતિમાં (In Progress)</option>
                    <option value="delayed">વિલંબિત (Delayed Alert)</option>
                  </select>
                  <Icon name="expand_more" size={20} className="absolute right-2.5 top-3 pointer-events-none text-outline" />
                </div>
              </div>

              {/* Live Map Layer Toggles */}
              <div className="flex items-center gap-2 bg-surface-container-low p-1.5 rounded-xl shrink-0 border border-outline-variant">
                <label className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-surface-container-lowest text-primary shadow-xs cursor-pointer font-label-md text-xs font-semibold select-none">
                  <input
                    type="checkbox"
                    checked={showSchools}
                    onChange={(e) => setShowSchools(e.target.checked)}
                    className="w-3.5 h-3.5 accent-primary cursor-pointer"
                  />
                  <span>
                    <T gu="શાળાઓ (૧૫૬)" en="Schools (156)" hi="स्कूल (156)" />
                  </span>
                </label>
                <label className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-surface-container-lowest text-secondary shadow-xs cursor-pointer font-label-md text-xs font-semibold select-none">
                  <input
                    type="checkbox"
                    checked={showGps}
                    onChange={(e) => setShowGps(e.target.checked)}
                    className="w-3.5 h-3.5 accent-secondary cursor-pointer"
                  />
                  <span>
                    <T gu="ટ્રક GPS (૧૨)" en="Truck GPS (12)" hi="ट्रक GPS (12)" />
                  </span>
                </label>
                <label className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-surface-container-lowest text-on-surface shadow-xs cursor-pointer font-label-md text-xs font-semibold select-none">
                  <input
                    type="checkbox"
                    checked={showDepot}
                    onChange={(e) => setShowDepot(e.target.checked)}
                    className="w-3.5 h-3.5 accent-primary cursor-pointer"
                  />
                  <span>
                    <T gu="સેન્ટ્રલ ડેપો" en="Central Depot" hi="केंद्रीय डिपो" />
                  </span>
                </label>
              </div>
            </div>

            {/* View navigation switcher */}
            <div className="flex items-center justify-between pt-2 border-t border-surface-container">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab("overview")}
                  className={`px-3.5 py-1.5 rounded-lg font-label-md text-label-md font-semibold transition-all flex items-center gap-1.5 ${
                    activeTab === "overview"
                      ? "bg-primary text-on-primary shadow-sm"
                      : "text-on-surface-variant hover:bg-surface-container-high"
                  }`}
                >
                  <Icon name="map" size={18} />
                  <span>
                    <T gu="જિયો-નકશો અને લાઈવ ટ્રેકિંગ" en="Geospatial Map & Live Feed" hi="भू-स्थानिक नक्शा और लाइव फीड" />
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("batches")}
                  className={`px-3.5 py-1.5 rounded-lg font-label-md text-label-md font-semibold transition-all flex items-center gap-1.5 ${
                    activeTab === "batches"
                      ? "bg-primary text-on-primary shadow-sm"
                      : "text-on-surface-variant hover:bg-surface-container-high"
                  }`}
                >
                  <Icon name="inventory_2" size={18} />
                  <span>
                    <T gu="વેન્ડર બેચ યાદી" en="Batches Table" hi="बैच सूची" />
                  </span>
                  <span className="px-1.5 py-0.2 rounded-full bg-surface-container-highest text-primary text-[11px] font-bold">
                    {filteredBatches.length}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("schools")}
                  className={`px-3.5 py-1.5 rounded-lg font-label-md text-label-md font-semibold transition-all flex items-center gap-1.5 ${
                    activeTab === "schools"
                      ? "bg-primary text-on-primary shadow-sm"
                      : "text-on-surface-variant hover:bg-surface-container-high"
                  }`}
                >
                  <Icon name="school" size={18} />
                  <span>
                    <T gu="શાળાઓવાર વિતરણ યાદી" en="Per-School Breakdown" hi="स्कूलवार वितरण सूची" />
                  </span>
                  <span className="px-1.5 py-0.2 rounded-full bg-surface-container-highest text-primary text-[11px] font-bold">
                    {filteredSchools.length}
                  </span>
                </button>
              </div>

              {/* District summary button */}
              <button
                type="button"
                onClick={() => setShowDistrictStatsModal(!showDistrictStatsModal)}
                className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
              >
                <Icon name="equalizer" size={16} />
                <span>
                  <T gu="તાલુકાવાર આંકડા (૮ તાલુકા)" en="Taluka Stats (8 Talukas)" hi="तालुकावार आंकड़े (8 तालुका)" />
                </span>
              </button>
            </div>
          </section>

          {/* District Stats Overlay / Banner when requested */}
          {showDistrictStatsModal && (
            <section className="w-full bg-surface-container-lowest rounded-2xl p-5 shadow-level-2 border border-primary/20 space-y-3 animate-fade-in">
              <div className="flex items-center justify-between pb-2 border-b border-surface-container">
                <div className="flex items-center gap-2">
                  <Icon name="analytics" size={20} className="text-primary" />
                  <h3 className="font-title-md text-title-md text-on-surface font-bold">
                    <T
                      gu="આણંદ જિલ્લાના તમામ ૮ તાલુકાઓનો વિતરણ સારાંશ"
                      en="Anand District - All 8 Talukas Cycle Distribution Summary"
                      hi="आणंद जिले के सभी 8 तालुकाओं का वितरण सारांश"
                    />
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowDistrictStatsModal(false)}
                  className="text-outline hover:text-on-surface p-1 rounded-lg"
                >
                  <Icon name="close" size={18} />
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
                {TALUKA_STATS.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => {
                      setSelectedTaluka(t.id);
                      setShowDistrictStatsModal(false);
                    }}
                    className={`p-3 rounded-xl border text-center cursor-pointer transition-all ${
                      selectedTaluka === t.id
                        ? "bg-primary/5 border-primary shadow-xs ring-1 ring-primary"
                        : "bg-surface-container-low border-outline-variant hover:border-primary/40"
                    }`}
                  >
                    <p className="font-label-lg text-xs font-bold text-on-surface truncate">
                      <T gu={t.nameGu} en={t.nameEn} hi={t.nameHi} />
                    </p>
                    <p className="font-headline-sm text-sm font-extrabold text-primary mt-1">
                      {t.handedOver} / {t.allocated}
                    </p>
                    <div className="w-full bg-surface-container-high h-1.5 rounded-full mt-1.5 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${t.delayedCount > 0 ? "bg-error" : "bg-primary"}`}
                        style={{ width: `${Math.round((t.handedOver / t.allocated) * 100)}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-on-surface-variant mt-1">
                      {Math.round((t.handedOver / t.allocated) * 100)}%{" "}
                      {t.delayedCount > 0 && <span className="text-error font-bold">• {t.delayedCount} Delayed</span>}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 3. Main Content Split View (Two Columns) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column (8 cols): Geospatial Map Canvas or Active Tab Table */}
            <div className="lg:col-span-8 flex flex-col gap-4">
              {activeTab === "overview" && (
                <div className="w-full bg-surface-container-lowest rounded-2xl p-5 shadow-sm border border-outline-variant relative overflow-hidden">
                  {/* Map Canvas Header Bar */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                        <Icon name="map" size={22} className="text-primary" />
                      </div>
                      <div>
                        <h2 className="font-title-lg text-title-lg text-on-surface font-bold leading-tight">
                          <T
                            gu="આણંદ જિલ્લો - જિયો-સ્પેસિયલ વિતરણ નકશો"
                            en="Anand District - Geospatial Supply Chain Map"
                            hi="आणंद जिला - भू-स्थानिक आपूर्ति श्रृंखला नक्शा"
                          />
                        </h2>
                        <p className="font-caption text-caption text-on-surface-variant">
                          <T
                            gu="કરમસદ Nodal Hub થી ૮ તાલુકાઓના ક્લસ્ટર પોઈન્ટ્સ અને રીઅલ-ટાઇમ ટ્રક લોકેશન"
                            en="Real-time routes from Karamsad Nodal Hub to 8 taluka cluster points & active trucks"
                            hi="करमसद नोडल हब से 8 तालुका क्लस्टर पॉइंट्स और रियल-टाइम ट्रक लोकेशन"
                          />
                        </p>
                      </div>
                    </div>

                    {/* Map View Switcher / GPS Badge */}
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-full bg-surface-container-highest text-primary font-label-md text-xs font-bold flex items-center gap-1.5 border border-primary/20">
                        <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
                        <span>
                          <T gu="GPS લાઈવ ફીડ સક્રિય" en="GPS Live Feed Active" hi="GPS लाइव फीड सक्रिय" />
                        </span>
                      </span>
                    </div>
                  </div>

                  {/* Stylized Vector / Geospatial Map Canvas */}
                  <div className="relative w-full h-[580px] rounded-xl bg-[#eaf0fb] overflow-hidden select-none border border-outline-variant shadow-inner">
                    {/* SVG Vector Backdrop: Waterways, Boundaries, Supply Radiants */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                      <defs>
                        <linearGradient id="waterGrad" x1="0%" x2="50%" y1="100%" y2="0%">
                          <stop offset="0%" stopColor="#b6caff" stopOpacity="0.85" />
                          <stop offset="100%" stopColor="#d6e3ff" stopOpacity="0.35" />
                        </linearGradient>
                        <pattern id="gridPattern" width="40" height="40" patternUnits="userSpaceOnUse">
                          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#cbd5e1" strokeOpacity="0.5" strokeWidth="0.75" />
                        </pattern>
                      </defs>

                      {/* Grid */}
                      <rect width="100%" height="100%" fill="url(#gridPattern)" />

                      {/* Gulf of Khambhat (Bottom Left Water Curve) */}
                      <path d="M -20 640 Q 140 540 180 430 T 260 380 L -20 380 Z" fill="url(#waterGrad)" />
                      <text x="35" y="550" className="font-label-md text-xs font-semibold tracking-wider" fill="#1e3a8a" opacity="0.6">
                        ખંભાતનો અખાત (GULF OF KHAMBHAT)
                      </text>

                      {/* Mahi River Course (South-East edge) */}
                      <path d="M 720 180 Q 640 320 610 460 T 560 640" fill="none" stroke="#93c5fd" strokeLinecap="round" strokeOpacity="0.7" strokeWidth="9" />
                      <text x="590" y="380" transform="rotate(70 590 380)" className="font-caption text-xs font-semibold" fill="#1e3a8a" opacity="0.7">
                        મહી નદી (Mahi River)
                      </text>

                      {/* Taluka Boundary Polygons (Subtle dashed traces) */}
                      <path d="M 170 240 L 310 170 L 450 190 L 410 340 L 250 360 Z" fill="#ffffff" fillOpacity="0.35" stroke="#94a3b8" strokeDasharray="4,4" strokeWidth="1.5" />
                      <path d="M 310 170 L 500 110 L 620 180 L 530 300 L 450 190 Z" fill="#ffffff" fillOpacity="0.35" stroke="#94a3b8" strokeDasharray="4,4" strokeWidth="1.5" />
                      <path d="M 250 360 L 410 340 L 510 430 L 370 560 L 200 500 Z" fill="#ffffff" fillOpacity="0.35" stroke="#94a3b8" strokeDasharray="4,4" strokeWidth="1.5" />

                      {/* Supply Routes from Karamsad Nodal Hub (Centered at approx 380, 260) */}
                      {/* Delayed Route to Khambhat (Red dashed route) */}
                      <path d="M 380 260 Q 280 320 180 440" fill="none" stroke="#dc2626" strokeDasharray="6,4" strokeOpacity="0.85" strokeWidth="3" />
                      {/* Route to Tarapur */}
                      <path d="M 380 260 Q 260 250 150 230" fill="none" stroke="#1d4ed8" strokeOpacity="0.7" strokeWidth="2.5" />
                      {/* Route to Borsad / Anklav */}
                      <path d="M 380 260 Q 420 360 450 460" fill="none" stroke="#1d4ed8" strokeOpacity="0.7" strokeWidth="2.5" />
                      {/* Route to Umreth */}
                      <path d="M 380 260 Q 500 210 600 170" fill="none" stroke="#1d4ed8" strokeOpacity="0.7" strokeWidth="2.5" />
                      {/* Route to Petlad */}
                      <path d="M 380 260 Q 330 310 310 360" fill="none" stroke="#1d4ed8" strokeOpacity="0.7" strokeWidth="2.5" />
                    </svg>

                    {/* Taluka Name Watermark Labels */}
                    <div className="absolute top-[200px] left-[100px] font-label-md text-xs text-on-surface font-bold opacity-45 pointer-events-none">
                      તારાપુર (TARAPUR)
                    </div>
                    <div className="absolute top-[140px] left-[310px] font-label-md text-xs text-on-surface font-bold opacity-45 pointer-events-none">
                      સોજિત્રા (SOJITRA)
                    </div>
                    <div className="absolute top-[130px] right-[130px] font-label-md text-xs text-on-surface font-bold opacity-45 pointer-events-none">
                      ઉમરેઠ (UMRETH)
                    </div>
                    <div className="absolute bottom-[220px] left-[290px] font-label-md text-xs text-on-surface font-bold opacity-45 pointer-events-none">
                      પેટલાદ (PETLAD)
                    </div>
                    <div className="absolute bottom-[150px] left-[400px] font-label-md text-xs text-on-surface font-bold opacity-45 pointer-events-none">
                      બોરસદ (BORSAD)
                    </div>
                    <div className="absolute bottom-[80px] right-[200px] font-label-md text-xs text-on-surface font-bold opacity-45 pointer-events-none">
                      આંકલાવ (ANKLAV)
                    </div>
                    <div className="absolute bottom-[160px] left-[130px] font-label-md text-xs text-on-surface font-bold opacity-45 pointer-events-none">
                      ખંભાત (KHAMBHAT)
                    </div>

                    {/* Central Depot Warehouse: કરમસદ સેન્ટ્રલ ડેપો */}
                    {showDepot && (
                      <div
                        onClick={() => triggerNotice("Karamsad Central Depot: 800 cycles in reserve stock")}
                        className="absolute top-[245px] left-[380px] -translate-x-1/2 -translate-y-1/2 z-20 group cursor-pointer"
                        title="કરમસદ સેન્ટ્રલ ડેપો (Karamsad Central Depot)"
                      >
                        <div className="relative flex items-center justify-center">
                          <span className="absolute w-12 h-12 rounded-full bg-primary opacity-25 animate-ping" />
                          <div className="w-11 h-11 rounded-2xl bg-primary text-on-primary shadow-level-2 flex items-center justify-center ring-4 ring-white">
                            <Icon name="warehouse" size={24} className="text-white" />
                          </div>
                        </div>
                        <div className="absolute top-13 left-1/2 -translate-x-1/2 bg-surface-container-lowest px-2.5 py-1 rounded-xl shadow-md whitespace-nowrap text-center border border-outline-variant">
                          <p className="font-label-md text-xs text-primary font-bold">કરમસદ GIDC સેન્ટ્રલ ડેપો</p>
                          <p className="font-caption text-[10px] text-on-surface-variant">સ્ટોક: ૮૦૦ નંગ</p>
                        </div>
                      </div>
                    )}

                    {/* School Pins */}
                    {showSchools &&
                      MOCK_SCHOOLS.map((school) => {
                        const isSelected = school.id === selectedSchool.id;
                        let pinBg = "bg-primary";
                        let pinIcon = "school";
                        if (school.status === "completed") {
                          pinBg = "bg-emerald-600";
                          pinIcon = "verified";
                        } else if (school.status === "delayed") {
                          pinBg = "bg-error";
                          pinIcon = "warning";
                        } else if (school.status === "progress") {
                          pinBg = "bg-secondary";
                          pinIcon = "school";
                        }

                        return (
                          <div
                            key={school.id}
                            onClick={() => setSelectedSchoolId(school.id)}
                            style={{
                              left: `${school.x}%`,
                              top: `${school.y}%`,
                            }}
                            className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all ${
                              isSelected ? "z-30 scale-110" : "z-20 hover:scale-105"
                            }`}
                            title={school.nameEn}
                          >
                            <div className="relative flex items-center justify-center">
                              {school.status === "delayed" && (
                                <span className="absolute w-10 h-10 rounded-full bg-error opacity-40 animate-ping" />
                              )}
                              {isSelected && (
                                <span className="absolute w-10 h-10 rounded-full bg-secondary-container opacity-30 animate-pulse" />
                              )}
                              <div
                                className={`w-8 h-8 rounded-full ${pinBg} text-white shadow-md flex items-center justify-center ring-2 ring-white`}
                              >
                                <Icon name={pinIcon} size={16} className="text-white" />
                              </div>
                            </div>
                            <div
                              className={`absolute -bottom-5 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded text-[10px] font-bold whitespace-nowrap shadow-xs ${
                                isSelected
                                  ? "bg-on-surface text-white"
                                  : "bg-surface-container-lowest text-on-surface border border-outline-variant"
                              }`}
                            >
                              {school.nameGu.split(",")[0]} (
                              {Math.round((school.handedOver / school.allocated) * 100)}%)
                            </div>
                          </div>
                        );
                      })}

                    {/* Active GPS Trucks */}
                    {showGps && (
                      <>
                        {/* Truck 1: En route to Khambhat */}
                        <div
                          onClick={() => triggerNotice("Truck GJ-23-AT-8841: 22 km to Khambhat (ETA: 1h)")}
                          className="absolute top-[360px] left-[260px] -translate-x-1/2 -translate-y-1/2 z-25 cursor-pointer group"
                        >
                          <div className="flex items-center gap-1.5 bg-surface-container-lowest px-2.5 py-1 rounded-full shadow-lg border border-secondary">
                            <Icon name="local_shipping" size={16} className="text-secondary" />
                            <span className="font-label-md text-xs text-on-surface font-bold">GJ-23-AT-8841</span>
                            <span className="w-2 h-2 rounded-full bg-secondary animate-ping" />
                          </div>
                          <div className="hidden group-hover:block absolute top-8 left-1/2 -translate-x-1/2 bg-inverse-surface text-on-inverse-surface px-2.5 py-1 rounded-lg text-[10px] whitespace-nowrap z-40 shadow-xl">
                            Atlas Logistics | ૨૨ કિમી બાકી (ETA: ૧ કલાક)
                          </div>
                        </div>

                        {/* Truck 2: Near Borsad */}
                        <div
                          onClick={() => triggerNotice("Truck GJ-06-HC-4412: Near Borsad depot")}
                          className="absolute top-[410px] left-[420px] -translate-x-1/2 -translate-y-1/2 z-25 cursor-pointer group"
                        >
                          <div className="flex items-center gap-1.5 bg-surface-container-lowest px-2 py-1 rounded-full shadow-lg border border-primary">
                            <Icon name="local_shipping" size={16} className="text-primary" />
                            <span className="font-label-md text-xs text-on-surface font-bold">GJ-06-HC-4412</span>
                          </div>
                        </div>
                      </>
                    )}

                    {/* Active Selected School Popover Card (Floating on Map) */}
                    {selectedSchool && (
                      <div className="absolute top-4 left-4 max-w-xs sm:max-w-sm w-full bg-surface-container-lowest rounded-2xl p-4 shadow-level-3 z-35 border border-outline-variant animate-fade-in">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <span className="px-2 py-0.5 rounded-full bg-primary-fixed text-primary font-label-md text-[11px] font-bold">
                              <T
                                gu={`${selectedSchool.taluka.toUpperCase()} ક્લસ્ટર`}
                                en={`${selectedSchool.taluka.toUpperCase()} Cluster`}
                                hi={`${selectedSchool.taluka.toUpperCase()} क्लस्टर`}
                              />
                            </span>
                            <h3 className="font-title-sm text-title-sm text-on-surface font-bold mt-1 truncate">
                              <T gu={selectedSchool.nameGu} en={selectedSchool.nameEn} hi={selectedSchool.nameHi} />
                            </h3>
                            <p className="font-caption text-[11px] text-on-surface-variant font-mono">
                              UDISE: {selectedSchool.udise}
                            </p>
                          </div>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold shrink-0 ${
                              selectedSchool.status === "completed"
                                ? "bg-emerald-100 text-emerald-800"
                                : selectedSchool.status === "delayed"
                                ? "bg-error-container text-on-error-container animate-pulse"
                                : "bg-amber-100 text-amber-900"
                            }`}
                          >
                            {selectedSchool.status === "completed"
                              ? "૧૦૦% વિતરિત"
                              : selectedSchool.status === "delayed"
                              ? "વિલંબિત!"
                              : "પ્રગતિમાં"}
                          </span>
                        </div>

                        {/* Metric Mini-Grid */}
                        <div className="grid grid-cols-4 gap-1.5 mt-3 pt-2.5 border-t border-surface-container text-center">
                          <div className="p-1.5 rounded-lg bg-surface-container-low">
                            <p className="font-caption text-[10px] text-on-surface-variant">
                              <T gu="ફાળવેલ" en="Allocated" hi="आवंटित" />
                            </p>
                            <p className="font-label-lg text-sm font-bold text-on-surface">{selectedSchool.allocated}</p>
                          </div>
                          <div className="p-1.5 rounded-lg bg-surface-container-low">
                            <p className="font-caption text-[10px] text-on-surface-variant">
                              <T gu="પ્રાપ્ત" en="Received" hi="प्राप्त" />
                            </p>
                            <p className="font-label-lg text-sm font-bold text-primary">{selectedSchool.received}</p>
                          </div>
                          <div className="p-1.5 rounded-lg bg-emerald-50 border border-emerald-200">
                            <p className="font-caption text-[10px] text-emerald-800 font-semibold">
                              <T gu="વિતરિત" en="Given" hi="हस्तांतरित" />
                            </p>
                            <p className="font-label-lg text-sm font-bold text-emerald-700">{selectedSchool.handedOver}</p>
                          </div>
                          <div className="p-1.5 rounded-lg bg-surface-container-low">
                            <p className="font-caption text-[10px] text-on-surface-variant">
                              <T gu="બાકી" en="Pending" hi="बाकी" />
                            </p>
                            <p className="font-label-lg text-sm font-bold text-secondary">{selectedSchool.pending}</p>
                          </div>
                        </div>

                        {/* Details list */}
                        <div className="mt-2.5 space-y-1 text-xs text-on-surface-variant">
                          <div className="flex items-center justify-between">
                            <span>
                              <T gu="વેન્ડર બેચ:" en="Vendor Batch:" hi="बैच ID:" />
                            </span>
                            <span className="font-semibold text-on-surface font-mono text-[11px]">
                              {selectedSchool.batchId}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>
                              <T gu="નોડલ શિક્ષક:" en="Nodal Teacher:" hi="नोडल शिक्षक:" />
                            </span>
                            <span className="font-medium text-on-surface truncate max-w-[170px]">
                              {selectedSchool.nodalTeacher} ({selectedSchool.nodalPhone})
                            </span>
                          </div>
                        </div>

                        {/* CTA button */}
                        <button
                          type="button"
                          onClick={() => triggerNotice(`OTP & QR distribution log opened for ${selectedSchool.udise}`)}
                          className="w-full mt-3 h-8 rounded-xl bg-primary text-on-primary font-label-md text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-primary-container transition-colors shadow-sm"
                        >
                          <span>
                            <T
                              gu="વિગતવાર OTP અને QR વિતરણ લોગ જુઓ"
                              en="View Student OTP & QR Handover Log"
                              hi="विस्तृत OTP और QR वितरण लॉग देखें"
                            />
                          </span>
                          <Icon name="arrow_forward" size={14} />
                        </button>
                      </div>
                    )}

                    {/* Map Legend (Bottom Right Overlay) */}
                    <div className="absolute right-3 bottom-3 bg-surface-container-lowest/95 backdrop-blur-md rounded-xl p-2.5 shadow-md border border-outline-variant z-20">
                      <p className="font-label-md text-[10px] text-outline uppercase font-bold mb-1.5">
                        <T gu="નકશા સંકેતો (Legend)" en="Map Legend" hi="नक्शा संकेत" />
                      </p>
                      <div className="grid grid-cols-2 gap-x-2.5 gap-y-1 font-caption text-[11px] text-on-surface">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                          <span>૮૦% - ૧૦૦% વિતરિત</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-secondary" />
                          <span>૪૦% - ૭૯% પ્રગતિ</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-error" />
                          <span>વિલંબિત / વિસંગત</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Icon name="local_shipping" size={12} className="text-secondary" />
                          <span>ટ્રક જીપીએસ (GPS)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Batches View Tab (when activeTab === "batches") */}
              {activeTab === "batches" && (
                <div className="w-full bg-surface-container-lowest rounded-2xl p-5 shadow-sm border border-outline-variant space-y-4 animate-fade-in">
                  <div className="flex items-center justify-between pb-3 border-b border-surface-container">
                    <div className="flex items-center gap-2">
                      <Icon name="inventory_2" size={22} className="text-primary" />
                      <h2 className="font-title-md text-title-md text-on-surface font-bold">
                        <T gu="સાયકલ બેચ ટેબલ અને ડિસ્પેચ ટ્રેકિંગ" en="Cycle Batches Table & Tracking" hi="साइकिल बैच तालिका और प्रेषण ट्रैकिंग" />
                      </h2>
                    </div>
                    <span className="font-label-md text-xs font-semibold text-on-surface-variant">
                      {filteredBatches.length} Batches listed
                    </span>
                  </div>

                  {/* Responsive Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-body-sm font-body-sm">
                      <thead className="bg-surface-container-low text-on-surface font-label-md text-xs font-semibold border-b border-outline-variant">
                        <tr>
                          <th className="py-2.5 px-3">
                            <T gu="બેચ ID" en="Batch ID" hi="बैच ID" />
                          </th>
                          <th className="py-2.5 px-3">
                            <T gu="વેન્ડર (Vendor)" en="Vendor" hi="विक्रेता" />
                          </th>
                          <th className="py-2.5 px-3 text-right">
                            <T gu="જથ્થો" en="Quantity" hi="मात्रा" />
                          </th>
                          <th className="py-2.5 px-3">
                            <T gu="તારીખ" en="Dispatch Date" hi="डिस्पैच तिथि" />
                          </th>
                          <th className="py-2.5 px-3">
                            <T gu="કવરેજ શાળાઓ" en="Schools Covered" hi="कवर स्कूल" />
                          </th>
                          <th className="py-2.5 px-3">
                            <T gu="વિતરણ પ્રગતિ" en="Delivery Status" hi="वितरण स्थिति" />
                          </th>
                          <th className="py-2.5 px-3 text-right">
                            <T gu="એક્શન" en="Action" hi="कार्रवाई" />
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-surface-container">
                        {filteredBatches.map((b) => (
                          <tr key={b.batchId} className="hover:bg-surface-container-low/70 transition-colors">
                            <td className="py-3 px-3 font-mono font-bold text-primary text-xs">
                              {b.batchId}
                            </td>
                            <td className="py-3 px-3 font-medium text-on-surface">
                              {b.vendor}
                            </td>
                            <td className="py-3 px-3 text-right font-bold text-on-surface">
                              {b.quantity}
                            </td>
                            <td className="py-3 px-3 text-on-surface-variant text-xs">
                              {b.dispatchDate}
                            </td>
                            <td className="py-3 px-3 text-on-surface text-xs max-w-[200px] truncate">
                              <T gu={b.schoolsDescriptionGu} en={b.schoolsDescriptionEn} hi={b.schoolsDescriptionHi} />
                            </td>
                            <td className="py-3 px-3">
                              <div className="flex items-center gap-2">
                                <div className="w-16 bg-surface-container-high h-2 rounded-full overflow-hidden">
                                  <div
                                    className={`h-full rounded-full ${
                                      b.deliveredPercent === 100
                                        ? "bg-emerald-600"
                                        : b.status === "delayed"
                                        ? "bg-error"
                                        : "bg-primary"
                                    }`}
                                    style={{ width: `${b.deliveredPercent}%` }}
                                  />
                                </div>
                                <span className="text-xs font-bold text-on-surface">
                                  {b.deliveredPercent}%
                                </span>
                              </div>
                            </td>
                            <td className="py-3 px-3 text-right">
                              <button
                                type="button"
                                onClick={() => triggerNotice(`Challan details viewed for ${b.batchId}`)}
                                className="px-2.5 py-1 rounded-lg bg-surface-container text-primary hover:bg-surface-container-high text-xs font-semibold"
                              >
                                <T gu="ચલણ જુઓ" en="View Challan" hi="चालान देखें" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Per-School Breakdown Tab (when activeTab === "schools") */}
              {activeTab === "schools" && (
                <div className="w-full bg-surface-container-lowest rounded-2xl p-5 shadow-sm border border-outline-variant space-y-4 animate-fade-in">
                  <div className="flex items-center justify-between pb-3 border-b border-surface-container">
                    <div className="flex items-center gap-2">
                      <Icon name="school" size={22} className="text-primary" />
                      <h2 className="font-title-md text-title-md text-on-surface font-bold">
                        <T
                          gu="શાળાઓવાર સાયકલ વિતરણ બ્રેકડાઉન (Per-School Breakdown)"
                          en="Per-School Cycle Allocation & Delivery Breakdown"
                          hi="स्कूलवार साइकिल आवंटन और वितरण विवरण"
                        />
                      </h2>
                    </div>
                    <span className="font-label-md text-xs font-semibold text-on-surface-variant">
                      {filteredSchools.length} શાળાઓ
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-body-sm font-body-sm">
                      <thead className="bg-surface-container-low text-on-surface font-label-md text-xs font-semibold border-b border-outline-variant">
                        <tr>
                          <th className="py-2.5 px-3">
                            <T gu="શાળાનું નામ & UDISE" en="School Name & UDISE" hi="स्कूल का नाम और UDISE" />
                          </th>
                          <th className="py-2.5 px-3">
                            <T gu="તાલુકો" en="Taluka" hi="तालुका" />
                          </th>
                          <th className="py-2.5 px-3 text-right">
                            <T gu="ફાળવેલ" en="Allocated" hi="आवंटित" />
                          </th>
                          <th className="py-2.5 px-3 text-right">
                            <T gu="શાળા પહોંચેલ" en="Received" hi="प्राप्त" />
                          </th>
                          <th className="py-2.5 px-3 text-right">
                            <T gu="વિદ્યાર્થીઓને વિતરિત" en="Handed Over" hi="हस्तांतरित" />
                          </th>
                          <th className="py-2.5 px-3 text-right">
                            <T gu="બાકી" en="Pending" hi="बाकी" />
                          </th>
                          <th className="py-2.5 px-3">
                            <T gu="સ્થિતિ" en="Status" hi="स्थिति" />
                          </th>
                          <th className="py-2.5 px-3 text-right">
                            <T gu="વિગત" en="Action" hi="कार्रवाई" />
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-surface-container">
                        {filteredSchools.map((s) => {
                          const percent = Math.round((s.handedOver / s.allocated) * 100);
                          return (
                            <tr
                              key={s.id}
                              onClick={() => setSelectedSchoolId(s.id)}
                              className={`cursor-pointer transition-colors ${
                                s.id === selectedSchool.id
                                  ? "bg-primary/5 hover:bg-primary/10"
                                  : "hover:bg-surface-container-low/70"
                              }`}
                            >
                              <td className="py-3 px-3">
                                <p className="font-label-md text-xs font-bold text-on-surface">
                                  <T gu={s.nameGu} en={s.nameEn} hi={s.nameHi} />
                                </p>
                                <p className="font-caption text-[11px] text-on-surface-variant font-mono">
                                  {s.udise}
                                </p>
                              </td>
                              <td className="py-3 px-3 text-xs uppercase font-semibold text-on-surface-variant">
                                {s.taluka}
                              </td>
                              <td className="py-3 px-3 text-right font-semibold text-on-surface">
                                {s.allocated}
                              </td>
                              <td className="py-3 px-3 text-right font-semibold text-primary">
                                {s.received}
                              </td>
                              <td className="py-3 px-3 text-right font-bold text-emerald-700">
                                {s.handedOver}
                              </td>
                              <td className="py-3 px-3 text-right font-semibold text-secondary">
                                {s.pending}
                              </td>
                              <td className="py-3 px-3">
                                <span
                                  className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                                    s.status === "completed"
                                      ? "bg-emerald-100 text-emerald-800"
                                      : s.status === "delayed"
                                      ? "bg-error-container text-on-error-container"
                                      : "bg-amber-100 text-amber-900"
                                  }`}
                                >
                                  {percent}%{" "}
                                  {s.status === "delayed" && "• વિલંબ"}
                                </span>
                              </td>
                              <td className="py-3 px-3 text-right">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedSchoolId(s.id);
                                    setActiveTab("overview");
                                  }}
                                  className="text-xs font-semibold text-primary hover:underline"
                                >
                                  <T gu="નકશામાં જુઓ" en="View on Map" hi="नक्शे पर देखें" />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Bottom Quick Metric Bar */}
              <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-surface-container-lowest rounded-2xl p-4 shadow-sm flex items-center gap-3 border border-outline-variant">
                  <div className="w-11 h-11 rounded-xl bg-primary-fixed flex items-center justify-center text-primary shrink-0">
                    <Icon name="pin_drop" size={24} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-caption text-caption text-on-surface-variant">
                      <T gu="કવરેજ હેઠળ માધ્યમિક શાળાઓ" en="Secondary Schools Covered" hi="कवरेज के तहत स्कूल" />
                    </p>
                    <p className="font-title-md text-title-md font-bold text-on-surface">
                      ૧૫૬ / ૧૫૬ શાળાઓ (૧૦૦%)
                    </p>
                  </div>
                </div>

                <div className="bg-surface-container-lowest rounded-2xl p-4 shadow-sm flex items-center gap-3 border border-outline-variant">
                  <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-700 shrink-0">
                    <Icon name="verified_user" size={24} className="text-emerald-700" />
                  </div>
                  <div>
                    <p className="font-caption text-caption text-on-surface-variant">
                      <T gu="સંપૂર્ણ વિતરણ પૂર્ણ શાળાઓ" en="100% Handover Completed" hi="पूर्ण वितरण स्कूल" />
                    </p>
                    <p className="font-title-md text-title-md font-bold text-emerald-700">
                      ૧૧૨ શાળાઓ (૭૧.૮%)
                    </p>
                  </div>
                </div>

                <div className="bg-surface-container-lowest rounded-2xl p-4 shadow-sm flex items-center gap-3 border border-outline-variant">
                  <div className="w-11 h-11 rounded-xl bg-error-container flex items-center justify-center text-error shrink-0">
                    <Icon name="warning_amber" size={24} className="text-error" />
                  </div>
                  <div>
                    <p className="font-caption text-caption text-on-surface-variant">
                      <T gu="વિલંબિત / ધ્યાન આકર્ષિત શાળાઓ" en="Delayed / Attention Needed" hi="विलंबित / ध्यानाकर्षित स्कूल" />
                    </p>
                    <p className="font-title-md text-title-md font-bold text-error">
                      ૦૭ શાળાઓ (ખંભાત &amp; બોરસદ)
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column (4 cols): Batches, Alerts & Depot Summary */}
            <div className="lg:col-span-4 flex flex-col gap-5">
              {/* 3.1 Critical Alerts Card (સાવચેતી અને વિસંગતતા નોટિસ) */}
              <div className="w-full bg-surface-container-lowest rounded-2xl p-5 shadow-sm border border-outline-variant space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-surface-container">
                  <div className="flex items-center gap-2">
                    <Icon name="notification_important" size={22} className="text-error" />
                    <h2 className="font-title-md text-title-md text-on-surface font-bold">
                      <T gu="સાવચેતી અને વિસંગતતા નોટિસ" en="Critical Alerts & Notices" hi="चेतावनी और विसंगति नोटिस" />
                    </h2>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-error-container text-on-error-container font-label-md text-label-md font-bold">
                    <T gu="૨ એક્શન જરૂરી" en="2 Actions Needed" hi="2 कार्रवाई जरूरी" />
                  </span>
                </div>

                {/* Alert 1 (Red Delay Alert) */}
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 space-y-2.5">
                  <div className="flex items-start gap-2.5">
                    <Icon name="event_busy" size={20} className="text-red-700 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-label-md text-label-md text-red-700 font-bold">
                          <T gu="બેચ #CYCLE-2026-AN-002 : ૪ દિવસ વિલંબ" en="Batch #CYCLE-2026-AN-002 : 4 Days Delay" hi="बैच #CYCLE-2026-AN-002 : 4 दिन विलंब" />
                        </span>
                        <span className="font-caption text-[11px] text-red-700 font-semibold">
                          <T gu="ગંભીર ચેતવણી" en="Critical" hi="गंभीर" />
                        </span>
                      </div>
                      <p className="font-body-sm text-body-sm text-on-surface mt-1">
                        <T
                          gu="સાર્વજનિક હાઇસ્કૂલ ખંભાતમાં વેન્ડર ચલણ મુજબ ૧૧ ઓક્ટોબર પહોંચવાનું હતું. હાલ સુધી પ્રાપ્ત થયેલ નથી."
                          en="Sarvajanik High School Khambhat delivery was due on 11 Oct per vendor challan. Still pending receipt."
                          hi="सार्वजनिक हाई स्कूल खंभात में 11 अक्टूबर तक पहुंचना था। अभी तक प्राप्त नहीं हुआ है।"
                        />
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => triggerNotice("Tracking history retrieved for Batch CYCLE-2026-AN-002")}
                      className="h-8 px-3 rounded-lg bg-surface-container-lowest text-error font-label-md text-xs font-semibold hover:bg-error-container transition-colors border border-red-200"
                    >
                      <T gu="ટ્રેસ હિસ્ટ્રી" en="Trace History" hi="ट्रेस इतिहास" />
                    </button>
                    <button
                      type="button"
                      onClick={() => triggerNotice("Show-Cause notice issued to Atlas Logistics Ltd")}
                      className="h-8 px-3 rounded-lg bg-red-700 text-white font-label-md text-xs font-bold hover:bg-error transition-colors flex items-center gap-1 shadow-xs"
                    >
                      <Icon name="send" size={14} className="text-white" />
                      <span>
                        <T gu="શો-કોઝ નોટિસ મોકલો" en="Send Show-Cause" hi="कारण बताओ नोटिस भेजें" />
                      </span>
                    </button>
                  </div>
                </div>

                {/* Alert 2 (Amber Discrepancy Alert) */}
                <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 space-y-2.5">
                  <div className="flex items-start gap-2.5">
                    <Icon name="difference" size={20} className="text-amber-800 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-label-md text-label-md text-amber-900 font-bold">
                          <T gu="સ્ટોક વિસંગતતા (-૨ ખૂટે છે)" en="Stock Discrepancy (-2 Missing)" hi="स्टॉक विसंगति (-2 कम)" />
                        </span>
                        <span className="font-caption text-[11px] text-amber-800 font-semibold">
                          <T gu="ચકાસણી પેન્ડિંગ" en="Verification Pending" hi="सत्यापन लंबित" />
                        </span>
                      </div>
                      <p className="font-body-sm text-body-sm text-on-surface mt-1">
                        <T
                          gu="બોરસદ કન્યા વિદ્યાલયમાં ચલણ ૫૦ સાયકલ પરંતુ ક્યુઆર સ્કેન ૪૮ થયેલ. ૨ સાયકલ ભૌતિક રીતે ઓછી મળેલી છે."
                          en="Borsad Kanya Vidyalaya challan lists 50 bicycles but QR scanning logged 48. 2 bicycles physically missing."
                          hi="बोरसद कन्या विद्यालय में चालान 50 साइकिल था लेकिन QR स्कैन 48 हुआ। 2 साइकिलें कम पाई गईं।"
                        />
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => triggerNotice("Inquiry Officer assigned for Borsad Kanya Vidyalaya")}
                      className="h-8 px-3.5 rounded-lg bg-amber-800 text-white font-label-md text-xs font-bold hover:bg-amber-900 transition-colors flex items-center gap-1 shadow-xs"
                    >
                      <Icon name="person_search" size={14} className="text-white" />
                      <span>
                        <T gu="તપાસ અધિકારી નિયુક્ત કરો" en="Assign Inquiry Officer" hi="जांच अधिकारी नियुक्त करें" />
                      </span>
                    </button>
                  </div>
                </div>
              </div>

              {/* 3.2 Active Vendor Dispatch Batches List */}
              <div className="w-full bg-surface-container-lowest rounded-2xl p-5 shadow-sm border border-outline-variant space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-surface-container">
                  <div className="flex items-center gap-2">
                    <Icon name="conveyor_belt" size={22} className="text-primary" />
                    <h2 className="font-title-md text-title-md text-on-surface font-bold">
                      <T gu="સક્રિય વેન્ડર ડિસ્પેચ બેચ" en="Active Vendor Batches" hi="सक्रिय विक्रेता प्रेषण बैच" />
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab("batches")}
                    className="font-caption text-caption text-primary font-semibold hover:underline"
                  >
                    <T gu="બધા જુઓ (૪)" en="View All (4)" hi="सभी देखें (4)" />
                  </button>
                </div>

                {/* Batch Card 1: Atlas (Required mock data CYCLE-2026-AN-001) */}
                <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant space-y-2.5">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-label-md text-label-md font-bold text-primary font-mono">
                        #CYCLE-2026-AN-001
                      </span>
                      <span className="text-outline mx-1">•</span>
                      <span className="font-label-md text-label-md text-on-surface font-bold">
                        Atlas Ltd
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-md text-[11px] font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
                      <span>
                        <T gu="માર્ગમાં (૮૫%)" en="In Transit (85%)" hi="मार्ग में (85%)" />
                      </span>
                    </span>
                  </div>

                  <div className="space-y-1 font-body-sm text-[12px] text-on-surface-variant">
                    <div className="flex items-center justify-between">
                      <span>
                        <T gu="રૂટ / કવરેજ:" en="Route / Coverage:" hi="रूट / कवरेज:" />
                      </span>
                      <span className="font-medium text-on-surface">
                        <T
                          gu="૧૨ શાળાઓ (આણંદ જિલ્લો)"
                          en="12 schools in Anand district"
                          hi="12 स्कूल (आणंद जिला)"
                        />
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>
                        <T gu="જથ્થો:" en="Quantity:" hi="मात्रा:" />
                      </span>
                      <span className="font-bold text-on-surface">
                        <T gu="૨૦૦ સાયકલો" en="200 Cycles" hi="200 साइकिलें" />
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>
                        <T gu="જીપીએસ સ્થિતિ:" en="GPS Tracking:" hi="जीपीएस स्थिति:" />
                      </span>
                      <span className="text-secondary font-semibold font-mono">
                        GJ-23-AT-8841
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>
                        <T gu="અપેક્ષિત સમય (ETA):" en="ETA:" hi="अपेक्षित समय:" />
                      </span>
                      <span className="font-semibold text-on-surface">
                        <T gu="આજે સાંજે ૦૪:૩૦ વાગ્યે" en="Today at 04:30 PM" hi="आज शाम 04:30 बजे" />
                      </span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden">
                    <div className="bg-secondary-container h-full rounded-full" style={{ width: "85%" }} />
                  </div>
                </div>

                {/* Batch Card 2: Hero Cycles */}
                <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant space-y-2.5">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-label-md text-label-md font-bold text-primary font-mono">
                        #CYCLE-2026-AN-003
                      </span>
                      <span className="text-outline mx-1">•</span>
                      <span className="font-label-md text-label-md text-on-surface font-bold">
                        Hero Cycles Ltd
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-label-md text-[11px] font-bold">
                      <T gu="શાળાઓમાં પહોંચેલ" en="School Arrived" hi="स्कूल पहुंची" />
                    </span>
                  </div>

                  <div className="space-y-1 font-body-sm text-[12px] text-on-surface-variant">
                    <div className="flex items-center justify-between">
                      <span>
                        <T gu="રૂટ:" en="Route:" hi="रूट:" />
                      </span>
                      <span className="font-medium text-on-surface">
                        <T
                          gu="કરમસદ ડેપો → પેટલાદ & બોરસદ (૮ શાળાઓ)"
                          en="Karamsad → Petlad & Borsad (8 schools)"
                          hi="करमसद → पेटलाद और बोरसद (8 स्कूल)"
                        />
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>
                        <T gu="જથ્થો:" en="Quantity:" hi="मात्रा:" />
                      </span>
                      <span className="font-bold text-on-surface">
                        <T gu="૬૨૦ સાયકલો" en="620 Cycles" hi="620 साइकिलें" />
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>
                        <T gu="સ્થિતિ:" en="Status:" hi="स्थिति:" />
                      </span>
                      <span className="text-amber-800 font-semibold">
                        <T gu="આચાર્ય દ્વારા ઇનવર્ડ બાકી" en="Principal Inward Pending" hi="प्राचार्य इनवर्ड बाकी" />
                      </span>
                    </div>
                  </div>

                  <div className="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden">
                    <div className="bg-amber-500 h-full rounded-full" style={{ width: "90%" }} />
                  </div>
                </div>

                {/* Batch Card 3: Avon Cycles */}
                <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant space-y-2.5">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-label-md text-label-md font-bold text-primary font-mono">
                        #CYCLE-2026-AN-004
                      </span>
                      <span className="text-outline mx-1">•</span>
                      <span className="font-label-md text-label-md text-on-surface font-bold">
                        Avon Cycles Gujarat
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-label-md text-[11px] font-bold flex items-center gap-1">
                      <Icon name="check" size={13} className="text-emerald-800" />
                      <span>
                        <T gu="૧૦૦% સંપન્ન" en="100% Handed Over" hi="100% पूर्ण" />
                      </span>
                    </span>
                  </div>

                  <div className="space-y-1 font-body-sm text-[12px] text-on-surface-variant">
                    <div className="flex items-center justify-between">
                      <span>
                        <T gu="રૂટ:" en="Route:" hi="रूट:" />
                      </span>
                      <span className="font-medium text-on-surface">
                        <T
                          gu="સોજિત્રા & તારાપુર (૪ શાળાઓ)"
                          en="Sojitra & Tarapur (4 schools)"
                          hi="सोजित्रा और तारापुर (4 स्कूल)"
                        />
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>
                        <T gu="જથ્થો:" en="Quantity:" hi="मात्रा:" />
                      </span>
                      <span className="font-bold text-emerald-700">
                        <T gu="૩૪૦ સાયકલો (સંપૂર્ણ વિતરિત)" en="340 Cycles (Completed)" hi="340 साइकिलें (पूर्णतः वितरित)" />
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>
                        <T gu="ડિજિટલ ઓડિટ:" en="Digital Audit:" hi="डिजिटल ऑडिट:" />
                      </span>
                      <span className="text-primary font-semibold">
                        DigiLocker QR વેરિફાઇડ
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3.3 Nodal Depot Stock Summary Card */}
              <div className="w-full bg-surface-container-lowest rounded-2xl p-5 shadow-sm border border-outline-variant space-y-3.5">
                <div className="flex items-center justify-between pb-3 border-b border-surface-container">
                  <div className="flex items-center gap-2">
                    <Icon name="inventory_2" size={22} className="text-primary" />
                    <h2 className="font-title-md text-title-md text-on-surface font-bold">
                      <T gu="કરમસદ સેન્ટ્રલ ડેપો સ્ટોક સ્થિતિ" en="Karamsad Central Depot Stock" hi="करमसद केंद्रीय डिपो स्टॉक स्थिति" />
                    </h2>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-surface-container-highest text-primary font-label-md text-xs font-bold font-mono">
                    WH-ANAND-01
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-surface-container-low border border-outline-variant">
                    <p className="font-caption text-caption text-on-surface-variant">
                      <T gu="ઉપલબ્ધ રિઝર્વ સ્ટોક" en="Reserve Stock" hi="उपलब्ध रिजर्व स्टॉक" />
                    </p>
                    <p className="font-headline-sm text-headline-sm font-bold text-primary mt-1">
                      <T gu="૮૦૦ સાયકલો" en="800 Cycles" hi="800 साइकिलें" />
                    </p>
                    <p className="font-caption text-[10px] text-on-surface-variant mt-0.5">
                      <T gu="આકસ્મિક જરૂરિયાત અનામત" en="Contingency Buffer" hi="आकस्मिक आवश्यकता आरक्षित" />
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-surface-container-low border border-outline-variant">
                    <p className="font-caption text-caption text-on-surface-variant">
                      <T gu="ગુણવત્તા ચકાસણી (QA)" en="Quality Audit (QA)" hi="गुणवत्ता जांच (QA)" />
                    </p>
                    <p className="font-headline-sm text-headline-sm font-bold text-emerald-700 mt-1">
                      ૧૦૦% પાસ
                    </p>
                    <p className="font-caption text-[10px] text-on-surface-variant mt-0.5">
                      <T gu="DEO ટેકનિકલ ટીમ પ્રમાણિત" en="DEO Team Certified" hi="DEO तकनीकी टीम प्रमाणित" />
                    </p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-surface-container-low flex items-center justify-between border border-outline-variant">
                  <div className="flex items-center gap-2.5">
                    <Icon name="swap_horizontal_circle" size={20} className="text-secondary" />
                    <div>
                      <p className="font-label-md text-label-md text-on-surface font-semibold">
                        <T gu="રિટર્ન / ખામીયુક્ત સાયકલ" en="Return / Defective Cycles" hi="रिटर्न / दोषपूर्ण साइकिलें" />
                      </p>
                      <p className="font-caption text-caption text-on-surface-variant">
                        <T gu="વેન્ડર રિપ્લેસમેન્ટ પ્રોસેસમાં" en="Vendor replacement in progress" hi="विक्रेता रिप्लेसमेंट जारी" />
                      </p>
                    </div>
                  </div>
                  <span className="font-title-md text-title-md font-bold text-secondary">
                    ૧૪ નંગ
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 4. Bottom Compliance & Statutory Bar */}
          <div className="w-full bg-surface-container-low rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm border border-outline-variant">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-surface-container-highest flex items-center justify-center text-primary shrink-0">
                <Icon name="gavel" size={22} className="text-primary" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-label-md text-label-md bg-primary-container text-on-primary px-2 py-0.5 rounded font-bold">
                    સરકારી ઠરાવ ક્રમાંક: ED-SSY-2024-55
                  </span>
                  <span className="font-caption text-caption text-on-surface-variant font-medium">
                    <T gu="ગાંધીનગર શિક્ષણ વિભાગ પરિપત્ર" en="Gandhinagar Education Dept Resolution" hi="गांधीनगर शिक्षा विभाग परिपत्र" />
                  </span>
                </div>
                <p className="font-caption text-caption text-on-surface-variant mt-0.5">
                  <T
                    gu="સાયકલ વિતરણમાં ૧૦૦% કન્યા વિદ્યાર્થી QR સ્કેનિંગ, વાલીના મોબાઈલ પર OTP અને જીઓ-ટેગ ફોટો વેરિફિકેશન અનિવાર્ય છે. આ વિના ચુકવણું મંજૂર થશે નહીં."
                    en="100% girl student QR scanning, parent OTP, and geo-tagged photo verification are mandatory. Vendor payments will not be sanctioned without complete compliance."
                    hi="साइकिल वितरण में 100% कन्या छात्र QR स्कैनिंग, अभिभावक के मोबाइल पर OTP और जियो-टैग फोटो सत्यापन अनिवार्य है। इसके बिना भुगतान स्वीकृत नहीं होगा।"
                  />
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-surface-container-lowest text-on-surface font-label-md text-xs border border-outline-variant">
                <Icon name="verified" size={16} className="text-primary" />
                <span>
                  <T gu="DEO પ્રમાણીકરણ લોગ સિન્ક: સક્રિય" en="DEO Log Sync: Active" hi="DEO प्रमाणीकरण सिंक: सक्रिय" />
                </span>
              </div>
              <button
                type="button"
                onClick={() => triggerNotice("Daily Summary downloaded successfully")}
                className="h-10 px-4 rounded-xl bg-primary text-on-primary font-label-md text-xs font-semibold hover:bg-primary-container transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <Icon name="print" size={18} className="text-white" />
                <span>
                  <T gu="દૈનિક સારાંશ ડાઉનલોડ" en="Download Daily Summary" hi="दैनिक सारांश डाउनलोड" />
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </OfficerShell>
  );
}
