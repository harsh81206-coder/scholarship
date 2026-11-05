"use client";

import { useState, useId } from "react";
import Link from "next/link";
import { OfficerShell } from "@/components/shell/OfficerShell";
import { T } from "@/components/T";
import { Icon } from "@/components/Icon";

export default function SimulateNextYearPage() {
  const enrollmentInputId = useId();
  const budgetInputId = useId();
  const dropoutInputId = useId();
  const dbtInputId = useId();
  const attendanceInputId = useId();

  // Academic year selector
  const [selectedYear, setSelectedYear] = useState<string>("2026-27");

  // Scenario parameter controls
  const [enrollmentGrowth, setEnrollmentGrowth] = useState<number>(5.0);
  const [budgetIncrease, setBudgetIncrease] = useState<number>(20.1);
  const [dropoutThreshold, setDropoutThreshold] = useState<number>(75);
  const [dbtTarget, setDbtTarget] = useState<number>(96);
  const [enableGyanSadhana, setEnableGyanSadhana] = useState<boolean>(true);
  const [enableStemGrant, setEnableStemGrant] = useState<boolean>(true);

  // Student specific sandbox states
  const [attendance, setAttendance] = useState<number>(82);
  const [dbtState, setDbtState] = useState<"idle" | "success" | "failed">("idle");
  const [isRunningSim, setIsRunningSim] = useState<boolean>(false);
  const [simCompleted, setSimCompleted] = useState<boolean>(false);
  const [engineTime, setEngineTime] = useState<string>("140ms");
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  // Derived simulation calculations
  const baseBeneficiaries = 118380;
  const growthBeneficiaries = Math.round(baseBeneficiaries * (enrollmentGrowth / 100));
  const newSchemesBeneficiaries = (enableGyanSadhana ? 8500 : 0) + (enableStemGrant ? 4200 : 0);
  const projectedBeneficiaries = baseBeneficiaries + growthBeneficiaries + newSchemesBeneficiaries;

  const baseDisbursement = 42.6; // in Crores
  const schemeDisbursementDelta = (enableGyanSadhana ? 5.2 : 0) + (enableStemGrant ? 3.4 : 0);
  const projectedDisbursement = Number((baseDisbursement * (1 + budgetIncrease / 100) + schemeDisbursementDelta * 0.4).toFixed(1));

  const dropoutReduction = Math.min(
    28.5,
    Math.max(4.0, (90 - dropoutThreshold) * 0.65 + (enableGyanSadhana ? 3.5 : 0) + (enableStemGrant ? 2.5 : 0))
  ).toFixed(1);

  const activeSchemesCount = 14 + (enableGyanSadhana ? 1 : 0) + (enableStemGrant ? 1 : 0);

  // Reset to default baseline values
  function handleReset() {
    setSelectedYear("2026-27");
    setEnrollmentGrowth(5.0);
    setBudgetIncrease(20.1);
    setDropoutThreshold(75);
    setDbtTarget(96);
    setEnableGyanSadhana(true);
    setEnableStemGrant(true);
    setAttendance(82);
    setDbtState("idle");
    setSimCompleted(false);
    setEngineTime("140ms");
    setExportNotice(null);
  }

  // Trigger Simulation Execution
  function handleRunSimulation() {
    setIsRunningSim(true);
    setTimeout(() => {
      setIsRunningSim(false);
      setSimCompleted(true);
      setEngineTime("88ms");
      setTimeout(() => {
        setSimCompleted(false);
      }, 4000);
    }, 700);
  }

  // Export JSON Simulation Report
  function handleExportReport() {
    const reportData = {
      title: "Vidya Pragati Setu - Gujarat Scholarship Simulation Report",
      academicYear: selectedYear,
      generatedAt: new Date().toISOString(),
      scenarioParameters: {
        enrollmentGrowthPct: enrollmentGrowth,
        budgetIncreasePct: budgetIncrease,
        dropoutRiskCutoffPct: dropoutThreshold,
        dbtSuccessRateTargetPct: dbtTarget,
        schemes: {
          cmGyanSadhanaExpanded: enableGyanSadhana,
          girlsStemIncentiveGrant: enableStemGrant,
        },
      },
      projectedOutputs: {
        currentYearBeneficiaries: baseBeneficiaries,
        projectedBeneficiaries,
        currentYearDisbursementCr: baseDisbursement,
        projectedDisbursementCr: projectedDisbursement,
        estimatedDropoutReductionPct: `${dropoutReduction}%`,
        targetDbtSuccessRate: `${dbtTarget}%`,
        activeSchemesCount,
      },
      pilotDistrict: "Anand",
      disclaimer: "This is a simulation tool for planning purposes only.",
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `VPS_Simulation_Report_${selectedYear}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setExportNotice(`સિસ્ટમ રિપોર્ટ (VPS_Simulation_Report_${selectedYear}.json) સફળતાપૂર્વક એક્સપોર્ટ થયો!`);
    setTimeout(() => setExportNotice(null), 5000);
  }

  return (
    <OfficerShell role="demo">
      <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
        {/* Top Sandbox Alert Banner */}
        <div className="bg-secondary-fixed text-on-secondary-fixed p-4 rounded-xl shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-secondary/20">
          <div className="flex items-start gap-3">
            <span className="w-10 h-10 rounded-lg bg-secondary text-on-secondary flex items-center justify-center shrink-0 shadow-sm">
              <Icon name="bolt" size={22} fill />
            </span>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-title-md text-title-md text-on-secondary-fixed font-bold">
                  <T
                    gu="સેન્ડબોક્સ વાતાવરણ (Demo Sandbox Mode)"
                    en="Demo Sandbox Mode"
                    hi="डेमो सैंडबॉक्स मोड"
                  />
                </span>
                <span className="bg-surface-container-lowest px-2 py-0.5 rounded text-secondary font-label-md text-label-md font-semibold">
                  <T
                    gu="માત્ર પ્રેઝન્ટેશન અને આયોજન હેતુ માટે"
                    en="For presentation & planning purposes only"
                    hi="केवल प्रस्तुति और नियोजन उद्देश्य के लिए"
                  />
                </span>
              </div>
              <p className="font-body-sm text-body-sm text-on-secondary-fixed-variant mt-0.5">
                <T
                  gu="આ માત્ર આયોજન હેતુ માટેનું સિમ્યુલેશન ટૂલ છે. કોઈપણ લાઈવ પ્રોડક્શન ડેટાબેઝ બદલાશે નહીં. વાસ્તવિક લાભાર્થી રેકોર્ડ સુરક્ષિત છે."
                  en="This is a simulation tool for planning purposes only. No live production database will be altered. Actual beneficiary records remain secure."
                  hi="यह केवल नियोजन उद्देश्यों के लिए सिमुलेशन उपकरण है। लाइव डेटाबेस में कोई बदलाव नहीं होगा। वास्तविक लाभार्थी रिकॉर्ड सुरक्षित हैं।"
                />
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0 w-full md:w-auto justify-end">
            <div className="bg-surface-container-lowest/90 px-3 py-1.5 rounded-lg text-on-surface-variant font-label-md text-label-md border border-outline-variant/50">
              <span className="text-on-surface-variant mr-1">
                <T gu="સત્ર:" en="Session:" hi="सत्र:" />
              </span>
              <span className="font-bold text-primary font-mono">#SIM-GUJ-2026-X1</span>
            </div>
            <button
              onClick={handleReset}
              className="bg-surface-container-lowest hover:bg-surface-container text-secondary px-3.5 py-1.5 rounded-lg font-label-md text-label-md transition-colors flex items-center gap-1.5 shadow-sm border border-secondary/30 active:scale-95"
            >
              <Icon name="replay" size={18} />
              <span>
                <T gu="રીસેટ ડેટા" en="Reset Data" hi="रीसेट डेटा" />
              </span>
            </button>
          </div>
        </div>

        {/* Export Notification Toast */}
        {exportNotice && (
          <div className="bg-primary text-on-primary p-3 rounded-lg flex items-center justify-between shadow-level-2 animate-fade-in">
            <div className="flex items-center gap-2 font-label-md text-label-md">
              <Icon name="check_circle" size={20} fill />
              <span>{exportNotice}</span>
            </div>
            <button onClick={() => setExportNotice(null)} className="hover:opacity-80 p-1">
              <Icon name="close" size={18} />
            </button>
          </div>
        )}

        {/* Page Header & Academic Year Controls */}
        <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/40 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-primary-fixed text-on-primary-fixed px-3 py-0.5 rounded-full font-label-md text-label-md font-semibold">
                <T gu="સિમ્યુલેશન ડેસ્ક" en="Simulation Desk" hi="सिमुलेशन डेस्क" />
              </span>
              <span className="text-on-surface-variant font-caption text-caption">
                <T
                  gu="• સ્ટેટ સ્કોલરશિપ નોડલ એન્જિન (Gujarat State Engine)"
                  en="• State Scholarship Nodal Engine"
                  hi="• राज्य छात्रवृत्ति नोडल इंजन"
                />
              </span>
            </div>
            <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
              <T
                gu="શૈક્ષણિક વર્ષ રોલઓવર અને પ્રમોશન સિમ્યુલેટર"
                en="Academic Year Rollover & Next Year Simulation Control Panel"
                hi="शैक्षणिक वर्ष रोलओवर और सिमुलेशन नियंत्रण कक्ष"
              />
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant mt-1.5">
              <T
                gu="વિદ્યાર્થીઓની આપોઆપ વર્ગબઢતી, નવી શિષ્યવૃત્તિ પાત્રતા એન્જિન રિ-રન, ઓટો-રિન્યુઅલ સંમતિ (Consent) અને DBT સિમ્યુલેશનનું લાઈવ પ્રદર્શન."
                en="Automated student promotion, scholarship eligibility rule re-evaluation, auto-renewal consent, and DBT transfer live simulation."
                hi="छात्रों की स्वचालित पदोन्नति, छात्रवृत्ति पात्रता नियम पुनर्मूल्यांकन, ऑटो-नवीनीकरण सहमति और डीबीटी सिमुलेशन का लाइव प्रदर्शन।"
              />
            </p>
          </div>

          {/* Academic Year Selector & Pilot Badge */}
          <div className="bg-surface-container-low p-4 rounded-xl flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto shadow-sm border border-outline-variant/30">
            <div className="flex items-center gap-3">
              <div className="text-left">
                <span className="font-caption text-caption text-on-surface-variant block uppercase tracking-wide">
                  <T gu="વર્તમાન વર્ષ" en="Current Year" hi="वर्तमान वर्ष" />
                </span>
                <span className="font-title-lg text-title-lg text-on-surface font-semibold">AY 2025-26</span>
              </div>
              <div className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-sm">
                <Icon name="arrow_forward" size={18} />
              </div>
              <div className="text-left">
                <label htmlFor="academic-year-select" className="font-caption text-caption text-secondary block uppercase tracking-wide font-medium">
                  <T gu="આગામી (સિમ્યુલેટેડ)" en="Simulated Year" hi="सिम्युलेटेड वर्ष" />
                </label>
                <select
                  id="academic-year-select"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="font-title-lg text-title-lg text-secondary font-bold bg-transparent border-b-2 border-secondary/60 pb-0.5 cursor-pointer focus:outline-none"
                >
                  <option value="2026-27">AY 2026-27</option>
                  <option value="2027-28">AY 2027-28</option>
                  <option value="2028-29">AY 2028-29</option>
                </select>
              </div>
            </div>

            <div className="h-10 w-px bg-outline-variant hidden sm:block" />

            <div className="flex flex-col text-left">
              <span className="font-caption text-caption text-on-surface-variant">
                <T gu="ટાર્ગેટ જિલ્લો / પાયલોટ" en="Target District / Pilot" hi="लक्षित जिला / पायलट" />
              </span>
              <div className="flex items-center gap-1.5 font-label-lg text-label-lg text-on-surface font-medium">
                <Icon name="location_on" size={18} className="text-primary" />
                <span>
                  <T gu="આણંદ (Anand)" en="Anand District" hi="आणंद जिला" />
                </span>
                <span className="bg-surface-container px-2 py-0.5 rounded font-caption text-caption text-primary font-bold">
                  ૧,૨૪૦
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Header Ribbon: Run Simulation, Export Report, Reset Defaults */}
        <div className="bg-surface-container-low p-4 rounded-xl flex flex-wrap items-center justify-between gap-3 border border-outline-variant/40">
          <div className="flex items-center gap-2 text-on-surface-variant">
            <Icon name="tune" size={20} className="text-primary" />
            <span className="font-label-lg text-label-lg font-medium">
              <T
                gu="સિમ્યુલેશન મોડેલિંગ કંટ્રોલ પેનલ"
                en="Simulation Scenario Modeling Control Panel"
                hi="सिमुलेशन परिदृश्य मॉडलिंग नियंत्रण कक्ष"
              />
            </span>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={handleRunSimulation}
              disabled={isRunningSim}
              className={`px-5 py-2.5 rounded-lg font-title-sm text-title-sm flex items-center gap-2 shadow-sm transition-all active:scale-95 ${
                simCompleted
                  ? "bg-green-700 text-white"
                  : isRunningSim
                  ? "bg-secondary/70 text-on-secondary cursor-not-allowed"
                  : "bg-secondary text-on-secondary hover:bg-secondary/90 hover:shadow-md"
              }`}
            >
              {isRunningSim ? (
                <>
                  <span className="animate-spin">
                    <Icon name="refresh" size={18} />
                  </span>
                  <span>
                    <T
                      gu="નિયમ એન્જિન ચકાસી રહ્યું છે..."
                      en="Evaluating Rule Engine..."
                      hi="नियम इंजन जांच रहा है..."
                    />
                  </span>
                </>
              ) : simCompleted ? (
                <>
                  <Icon name="check_circle" size={18} fill />
                  <span>
                    <T
                      gu="સિમ્યુલેશન પૂર્ણ થયું!"
                      en="Simulation Complete!"
                      hi="सिमुलेशन पूर्ण हुआ!"
                    />
                  </span>
                </>
              ) : (
                <>
                  <Icon name="rocket_launch" size={18} />
                  <span>
                    <T
                      gu="સિમ્યુલેશન રન કરો (Run Simulation)"
                      en="Run Simulation"
                      hi="सिमुलेशन चलाएं"
                    />
                  </span>
                </>
              )}
            </button>

            <button
              onClick={handleExportReport}
              className="bg-surface-container-lowest hover:bg-surface-container text-primary border border-outline-variant px-4 py-2.5 rounded-lg font-label-lg text-label-lg flex items-center gap-2 shadow-sm transition-colors active:scale-95"
            >
              <Icon name="download" size={18} />
              <span>
                <T
                  gu="રિપોર્ટ એક્સપોર્ટ કરો"
                  en="Export Simulation Report"
                  hi="सिमुलेशन रिपोर्ट निर्यात करें"
                />
              </span>
            </button>

            <button
              onClick={handleReset}
              className="bg-surface-container-lowest hover:bg-surface-container text-on-surface-variant hover:text-error border border-outline-variant px-3 py-2.5 rounded-lg font-label-md text-label-md flex items-center gap-1.5 transition-colors"
              title="Reset all parameters to default"
            >
              <Icon name="restart_alt" size={18} />
              <span>
                <T gu="ડિફોલ્ટ રીસેટ" en="Reset Defaults" hi="डिफ़ॉल्ट रीसेट" />
              </span>
            </button>
          </div>
        </div>

        {/* Scenario Controls Panel (Sliders & Toggles) */}
        <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/40">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-outline-variant/30 flex-wrap gap-2">
            <div>
              <h2 className="font-title-lg text-title-lg text-on-surface flex items-center gap-2">
                <Icon name="sliders" size={22} className="text-secondary" />
                <T
                  gu="સિમ્યુલેશન પરિમાણો (Scenario Controls)"
                  en="Simulation Scenario Controls"
                  hi="सिमुलेशन परिदृश्य नियंत्रण"
                />
              </h2>
              <p className="font-caption text-caption text-on-surface-variant mt-0.5">
                <T
                  gu="નીચેના સ્લાઇડર્સ અને ટૉગલ્સ બદલીને શૈક્ષણિક વર્ષ ૨૦૨૬-૨૭ ની અસર તાત્કાલિક ચકાસો."
                  en="Adjust sliders and toggles to simulate outcomes for AY 2026-27 in real-time."
                  hi="वास्तविक समय में शैक्षणिक वर्ष 2026-27 के परिणामों को अनुकरण करने के लिए स्लाइडर्स और टॉगल समायोजित करें।"
                />
              </p>
            </div>
            <span className="font-caption text-caption bg-surface-container-low text-primary px-3 py-1 rounded-full font-mono flex items-center gap-1">
              <Icon name="speed" size={14} />
              <T
                gu={`એન્જિન રિસ્પોન્સ: ${engineTime}`}
                en={`Engine Response: ${engineTime}`}
                hi={`इंजन रिस्पांस: ${engineTime}`}
              />
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Control 1: Enrollment Growth % */}
            <div className="bg-surface-container-low p-4 rounded-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor={enrollmentInputId} className="font-title-sm text-title-sm text-on-surface">
                    <T gu="વિદ્યાર્થી પ્રવેશ વૃદ્ધિ" en="Enrollment Growth" hi="नामांकन वृद्धि" />
                  </label>
                  <span className="bg-primary/10 text-primary font-bold px-2 py-0.5 rounded text-sm font-mono">
                    +{enrollmentGrowth}%
                  </span>
                </div>
                <p className="font-caption text-caption text-on-surface-variant mb-3">
                  <T
                    gu="રાજ્યવ્યાપી નવા વિદ્યાર્થી દાખલા દર"
                    en="State-wide new admissions rate"
                    hi="राज्यव्यापी नए प्रवेश दर"
                  />
                </p>
              </div>
              <div className="space-y-1">
                <input
                  id={enrollmentInputId}
                  type="range"
                  min="0"
                  max="20"
                  step="0.5"
                  value={enrollmentGrowth}
                  onChange={(e) => setEnrollmentGrowth(parseFloat(e.target.value))}
                  className="w-full accent-primary cursor-pointer h-2 bg-surface-container rounded-lg"
                />
                <div className="flex justify-between font-caption text-caption text-on-surface-variant text-[11px]">
                  <span>0%</span>
                  <span>+10%</span>
                  <span>+20%</span>
                </div>
              </div>
            </div>

            {/* Control 2: Budget Increase % */}
            <div className="bg-surface-container-low p-4 rounded-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor={budgetInputId} className="font-title-sm text-title-sm text-on-surface">
                    <T gu="તિજોરી બજેટ વૃદ્ધિ" en="Budget Increase" hi="बजट वृद्धि" />
                  </label>
                  <span className="bg-secondary/10 text-secondary font-bold px-2 py-0.5 rounded text-sm font-mono">
                    +{budgetIncrease}%
                  </span>
                </div>
                <p className="font-caption text-caption text-on-surface-variant mb-3">
                  <T
                    gu="શિક્ષણ વિભાગ ફાળવણી વધારો"
                    en="Education dept treasury allocation"
                    hi="शिक्षा विभाग आवंटन वृद्धि"
                  />
                </p>
              </div>
              <div className="space-y-1">
                <input
                  id={budgetInputId}
                  type="range"
                  min="5"
                  max="35"
                  step="0.5"
                  value={budgetIncrease}
                  onChange={(e) => setBudgetIncrease(parseFloat(e.target.value))}
                  className="w-full accent-secondary cursor-pointer h-2 bg-surface-container rounded-lg"
                />
                <div className="flex justify-between font-caption text-caption text-on-surface-variant text-[11px]">
                  <span>+5%</span>
                  <span>+20%</span>
                  <span>+35%</span>
                </div>
              </div>
            </div>

            {/* Control 3: Dropout Risk Threshold */}
            <div className="bg-surface-container-low p-4 rounded-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor={dropoutInputId} className="font-title-sm text-title-sm text-on-surface">
                    <T gu="ડ્રોપઆઉટ જોખમ કટ-ઓફ" en="Dropout Risk Cutoff" hi="ड्रॉपआउट जोखिम कट-ऑफ" />
                  </label>
                  <span className="bg-surface-container text-on-surface font-bold px-2 py-0.5 rounded text-sm font-mono">
                    {dropoutThreshold}%
                  </span>
                </div>
                <p className="font-caption text-caption text-on-surface-variant mb-3">
                  <T
                    gu="હાજરી / ગ્રેડ ચેતવણી થ્રેશોલ્ડ"
                    en="Attendance / marks warning threshold"
                    hi="उपस्थिति / ग्रेड चेतावनी सीमा"
                  />
                </p>
              </div>
              <div className="space-y-1">
                <input
                  id={dropoutInputId}
                  type="range"
                  min="60"
                  max="90"
                  step="1"
                  value={dropoutThreshold}
                  onChange={(e) => setDropoutThreshold(parseInt(e.target.value))}
                  className="w-full accent-primary cursor-pointer h-2 bg-surface-container rounded-lg"
                />
                <div className="flex justify-between font-caption text-caption text-on-surface-variant text-[11px]">
                  <span>60% (કડક)</span>
                  <span>75% (સામાન્ય)</span>
                  <span>90% (ઉદાર)</span>
                </div>
              </div>
            </div>

            {/* Control 4: DBT Success Rate Target */}
            <div className="bg-surface-container-low p-4 rounded-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor={dbtInputId} className="font-title-sm text-title-sm text-on-surface">
                    <T gu="DBT સફળતા લક્ષ્યાંક" en="DBT Success Target" hi="डीबीटी सफलता लक्ष्य" />
                  </label>
                  <span className="bg-green-100 text-green-800 font-bold px-2 py-0.5 rounded text-sm font-mono">
                    {dbtTarget}%
                  </span>
                </div>
                <p className="font-caption text-caption text-on-surface-variant mb-3">
                  <T
                    gu="Aadhaar / NPCI મેપિંગ ચોકસાઈ"
                    en="Aadhaar-seeded direct transfer target"
                    hi="आधार-सीडेड प्रत्यक्ष अंतरण लक्ष्य"
                  />
                </p>
              </div>
              <div className="space-y-1">
                <input
                  id={dbtInputId}
                  type="range"
                  min="80"
                  max="99"
                  step="1"
                  value={dbtTarget}
                  onChange={(e) => setDbtTarget(parseInt(e.target.value))}
                  className="w-full accent-green-600 cursor-pointer h-2 bg-surface-container rounded-lg"
                />
                <div className="flex justify-between font-caption text-caption text-on-surface-variant text-[11px]">
                  <span>80%</span>
                  <span>90%</span>
                  <span>99%</span>
                </div>
              </div>
            </div>
          </div>

          {/* New Scheme Toggle Controls */}
          <div className="mt-5 pt-4 border-t border-outline-variant/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <span className="font-label-lg text-label-lg text-on-surface font-semibold flex items-center gap-1.5">
              <Icon name="library_add" size={18} className="text-primary" />
              <T
                gu="નવી યોજનાઓ સક્રિય કરો (Policy Expansion):"
                en="Toggle New Schemes (Policy Expansion):"
                hi="नई योजनाएं सक्षम करें:"
              />
            </span>

            <div className="flex flex-wrap items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer bg-surface-container-low px-3 py-1.5 rounded-lg border border-outline-variant/40 hover:bg-surface-container transition-colors">
                <input
                  type="checkbox"
                  checked={enableGyanSadhana}
                  onChange={(e) => setEnableGyanSadhana(e.target.checked)}
                  className="rounded text-primary focus:ring-primary w-4 h-4 cursor-pointer"
                />
                <span className="font-label-md text-label-md text-on-surface">
                  <T
                    gu="મુખ્યમંત્રી જ્ઞાન સાધના વિસ્તરણ (+૮,૫૦૦)"
                    en="CM Gyan Sadhana Expanded (+8,500)"
                    hi="मुख्यमंत्री ज्ञान साधना विस्तार (+8,500)"
                  />
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer bg-surface-container-low px-3 py-1.5 rounded-lg border border-outline-variant/40 hover:bg-surface-container transition-colors">
                <input
                  type="checkbox"
                  checked={enableStemGrant}
                  onChange={(e) => setEnableStemGrant(e.target.checked)}
                  className="rounded text-secondary focus:ring-secondary w-4 h-4 cursor-pointer"
                />
                <span className="font-label-md text-label-md text-on-surface">
                  <T
                    gu="કન્યા STEM પ્રોત્સાહન અનુદાન (+૪,૨૦૦)"
                    en="Girls STEM Incentive Grant (+4,200)"
                    hi="कन्या STEM प्रोत्साहन अनुदान (+4,200)"
                  />
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Key KPI Output Summary Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* KPI 1: Projected Beneficiaries */}
          <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden border border-outline-variant/40">
            <div className="flex items-start justify-between">
              <div>
                <span className="font-caption text-caption text-on-surface-variant block uppercase tracking-wider font-medium">
                  <T
                    gu="કુલ સિમ્યુલેટેડ વિદ્યાર્થીઓ"
                    en="Projected Beneficiaries"
                    hi="कुल सिम्युलेटेड लाभार्थी"
                  />
                </span>
                <h2 className="font-headline-lg text-headline-lg text-on-surface mt-1 font-bold">
                  {projectedBeneficiaries.toLocaleString("gu-IN")}
                </h2>
              </div>
              <div className="w-12 h-12 rounded-xl bg-primary-fixed text-on-primary-fixed flex items-center justify-center shrink-0">
                <Icon name="groups" size={26} />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <span className="bg-surface-container text-primary font-label-md text-label-md px-2 py-0.5 rounded-full flex items-center gap-1 font-semibold">
                <Icon name="trending_up" size={14} />
                +{(projectedBeneficiaries - baseBeneficiaries).toLocaleString("gu-IN")}
              </span>
              <span className="font-caption text-caption text-on-surface-variant">
                <T
                  gu="ગત વર્ષ કરતાં વધારો"
                  en="vs Current Year (1,18,380)"
                  hi="वर्तमान वर्ष की तुलना में वृद्धि"
                />
              </span>
            </div>
          </div>

          {/* KPI 2: Projected Disbursement */}
          <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden border border-outline-variant/40">
            <div className="flex items-start justify-between">
              <div>
                <span className="font-caption text-caption text-on-surface-variant block uppercase tracking-wider font-medium">
                  <T
                    gu="અંદાજિત વિતરણ ભંડોળ"
                    en="Projected Disbursement"
                    hi="अनुमानित वितरण राशि"
                  />
                </span>
                <h2 className="font-headline-lg text-headline-lg text-secondary mt-1 font-bold">
                  ₹ {projectedDisbursement} <span className="text-title-md font-normal">કરોડ</span>
                </h2>
              </div>
              <div className="w-12 h-12 rounded-xl bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center shrink-0">
                <Icon name="payments" size={26} />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <span className="bg-secondary-fixed-dim text-on-secondary-fixed font-label-md text-label-md px-2 py-0.5 rounded-full flex items-center gap-1 font-semibold">
                <Icon name="add_circle" size={14} />
                +₹ {(projectedDisbursement - baseDisbursement).toFixed(1)} Cr
              </span>
              <span className="font-caption text-caption text-on-surface-variant">
                <T
                  gu="બજેટ સરપ્લસ અંદર"
                  en="Within Safe Surplus"
                  hi="सुरक्षित अधिशेष के भीतर"
                />
              </span>
            </div>
          </div>

          {/* KPI 3: Estimated Dropout Reduction */}
          <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden border border-outline-variant/40">
            <div className="flex items-start justify-between">
              <div>
                <span className="font-caption text-caption text-on-surface-variant block uppercase tracking-wider font-medium">
                  <T
                    gu="ડ્રોપઆઉટ ઘટાડાનો અંદાજ"
                    en="Estimated Dropout Reduction"
                    hi="अनुमानित ड्रॉपआउट कमी"
                  />
                </span>
                <h2 className="font-headline-lg text-headline-lg text-green-700 mt-1 font-bold">
                  -{dropoutReduction}%
                </h2>
              </div>
              <div className="w-12 h-12 rounded-xl bg-green-100 text-green-800 flex items-center justify-center shrink-0">
                <Icon name="trending_down" size={26} />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <span className="bg-green-100 text-green-800 font-label-md text-label-md px-2 py-0.5 rounded-full flex items-center gap-1 font-semibold">
                <Icon name="verified" size={14} />
                <T gu="ઉચ્ચ અસર" en="High Impact" hi="उच्च प्रभाव" />
              </span>
              <span className="font-caption text-caption text-on-surface-variant">
                <T
                  gu="શાળા જાળવણી સુધારો"
                  en="Retention Improvement"
                  hi="प्रतिधारण में सुधार"
                />
              </span>
            </div>
          </div>

          {/* KPI 4: Target DBT Success */}
          <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden border border-outline-variant/40">
            <div className="flex items-start justify-between">
              <div>
                <span className="font-caption text-caption text-on-surface-variant block uppercase tracking-wider font-medium">
                  <T
                    gu="DBT સફળતા લક્ષ્યાંક"
                    en="Target DBT Success"
                    hi="लक्षित डीबीटी सफलता"
                  />
                </span>
                <h2 className="font-headline-lg text-headline-lg text-primary mt-1 font-bold">
                  {dbtTarget}%
                </h2>
              </div>
              <div className="w-12 h-12 rounded-xl bg-surface-container text-primary flex items-center justify-center shrink-0">
                <Icon name="account_balance_wallet" size={26} />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <span className="bg-surface-container text-primary font-label-md text-label-md px-2 py-0.5 rounded-full flex items-center gap-1 font-semibold">
                <Icon name="check_circle" size={14} />
                +{(dbtTarget - 91.2).toFixed(1)}%
              </span>
              <span className="font-caption text-caption text-on-surface-variant">
                <T
                  gu="NPCI સીડિંગ ઓટો-મેપ"
                  en="Aadhaar auto-seeded"
                  hi="आधार ऑटो-सीडेड"
                />
              </span>
            </div>
          </div>
        </div>

        {/* Comparison Table: Current Year (AY 2025-26) vs Simulated Year (AY 2026-27) */}
        <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/40">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-outline-variant/30 flex-wrap gap-2">
            <div>
              <h2 className="font-title-lg text-title-lg text-on-surface flex items-center gap-2 font-bold">
                <Icon name="table_chart" size={22} className="text-primary" />
                <T
                  gu="સરખામણી કોષ્ટક: વર્તમાન વર્ષ વિ. સિમ્યુલેટેડ વર્ષ"
                  en="Side-by-Side Comparison: Current Year vs Simulated Year"
                  hi="तुलना तालिका: वर्तमान वर्ष बनाम सिम्युलेटेड वर्ष"
                />
              </h2>
              <p className="font-caption text-caption text-on-surface-variant mt-0.5">
                <T
                  gu="આયોજન હેતુ માટે વાર્ષિક બજેટ, લાભાર્થીઓ અને કામગીરીના તુલનાત્મક પરિમાણો."
                  en="Comparative planning metrics side-by-side for strategic budget decisions."
                  hi="रणनीतिक बजट निर्णयों के लिए तुलनात्मक नियोजन मेट्रिक्स।"
                />
              </p>
            </div>
            <span className="bg-surface-container text-on-surface-variant font-label-md text-label-md px-3 py-1 rounded-lg">
              <T
                gu="આધાર વર્ષ: ૨૦૨૫-૨૬ (વાસ્તવિક)"
                en="Base Year: 2025-26 (Actuals)"
                hi="आधार वर्ष: 2025-26 (वास्तविक)"
              />
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low text-on-surface-variant font-label-md text-label-md border-b border-outline-variant/40">
                  <th className="py-3 px-4">
                    <T gu="મેટ્રિક્સ / પરિમાણ" en="Metric / Parameter" hi="मापदंड / पैरामीटर" />
                  </th>
                  <th className="py-3 px-4">
                    <T gu="વર્તમાન વર્ષ (AY 2025-26)" en="Current Year (AY 2025-26)" hi="वर्तमान वर्ष (AY 2025-26)" />
                  </th>
                  <th className="py-3 px-4 text-primary font-bold">
                    <T gu={`સિમ્યુલેટેડ વર્ષ (AY ${selectedYear})`} en={`Simulated (AY ${selectedYear})`} hi={`सिम्युलेटेड (AY ${selectedYear})`} />
                  </th>
                  <th className="py-3 px-4">
                    <T gu="તફાવત (Variance)" en="Variance / Change" hi="अंतर / बदलाव" />
                  </th>
                  <th className="py-3 px-4 text-right">
                    <T gu="અંદાજિત સ્થિતિ" en="Status / Impact" hi="अनुमानित स्थिति" />
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/30 font-body-sm text-body-sm text-on-surface">
                {/* Row 1 */}
                <tr className="hover:bg-surface-container-low/50 transition-colors">
                  <td className="py-3 px-4 font-medium flex items-center gap-2">
                    <Icon name="groups" size={18} className="text-primary" />
                    <T
                      gu="કુલ નોંધાયેલ લાભાર્થી વિદ્યાર્થીઓ"
                      en="Total Enrolled Beneficiaries"
                      hi="कुल नामांकित लाभार्थी छात्र"
                    />
                  </td>
                  <td className="py-3 px-4 font-mono">૧,૧૮,૩૮૦ (118,380)</td>
                  <td className="py-3 px-4 font-bold text-primary font-mono">
                    {projectedBeneficiaries.toLocaleString("gu-IN")}
                  </td>
                  <td className="py-3 px-4">
                    <span className="bg-green-100 text-green-800 font-label-md text-label-md px-2 py-0.5 rounded font-mono font-semibold">
                      +{((projectedBeneficiaries - baseBeneficiaries) / 1000).toFixed(1)}k (+{(((projectedBeneficiaries - baseBeneficiaries) / baseBeneficiaries) * 100).toFixed(1)}%)
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="bg-primary-fixed text-on-primary-fixed text-caption font-caption px-2 py-0.5 rounded font-medium">
                      <T gu="વિસ્તરણ સક્ષમ" en="Scale Ready" hi="विस्तार सक्षम" />
                    </span>
                  </td>
                </tr>

                {/* Row 2 */}
                <tr className="hover:bg-surface-container-low/50 transition-colors">
                  <td className="py-3 px-4 font-medium flex items-center gap-2">
                    <Icon name="payments" size={18} className="text-secondary" />
                    <T
                      gu="કુલ શિષ્યવૃત્તિ વિતરણ (Disbursement)"
                      en="Total Scholarship Disbursement"
                      hi="कुल छात्रवृत्ति वितरण"
                    />
                  </td>
                  <td className="py-3 px-4 font-mono">₹ ૪૨.૬૦ કરોડ</td>
                  <td className="py-3 px-4 font-bold text-secondary font-mono">
                    ₹ {projectedDisbursement} કરોડ
                  </td>
                  <td className="py-3 px-4">
                    <span className="bg-secondary-fixed-dim text-on-secondary-fixed font-label-md text-label-md px-2 py-0.5 rounded font-mono font-semibold">
                      +₹ {(projectedDisbursement - baseDisbursement).toFixed(1)} Cr (+{(((projectedDisbursement - baseDisbursement) / baseDisbursement) * 100).toFixed(1)}%)
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="bg-surface-container text-secondary text-caption font-caption px-2 py-0.5 rounded font-medium">
                      <T gu="તિજોરી મંજૂર" en="Treasury Safe" hi="कोषागार स्वीकृत" />
                    </span>
                  </td>
                </tr>

                {/* Row 3 */}
                <tr className="hover:bg-surface-container-low/50 transition-colors">
                  <td className="py-3 px-4 font-medium flex items-center gap-2">
                    <Icon name="policy" size={18} className="text-primary" />
                    <T
                      gu="સક્રિય સરકારી યોજનાઓ"
                      en="Active Policy Schemes"
                      hi="सक्रिय सरकारी योजनाएं"
                    />
                  </td>
                  <td className="py-3 px-4 font-mono">૧૪ યોજનાઓ</td>
                  <td className="py-3 px-4 font-bold text-primary font-mono">
                    {activeSchemesCount} યોજનાઓ
                  </td>
                  <td className="py-3 px-4">
                    <span className="bg-surface-container text-primary font-label-md text-label-md px-2 py-0.5 rounded font-mono font-semibold">
                      +{activeSchemesCount - 14} નવી યોજના
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="bg-surface-container-high text-primary text-caption font-caption px-2 py-0.5 rounded font-medium">
                      <T gu="સુધારેલ નિયમો" en="Updated Rules" hi="संशोधित नियम" />
                    </span>
                  </td>
                </tr>

                {/* Row 4 */}
                <tr className="hover:bg-surface-container-low/50 transition-colors">
                  <td className="py-3 px-4 font-medium flex items-center gap-2">
                    <Icon name="currency_rupee" size={18} className="text-on-surface-variant" />
                    <T
                      gu="સરેરાશ પ્રતિ વિદ્યાર્થી સહાય"
                      en="Average Per Student Assistance"
                      hi="औसत प्रति छात्र सहायता"
                    />
                  </td>
                  <td className="py-3 px-4 font-mono">₹ ૩,૫૯૮</td>
                  <td className="py-3 px-4 font-bold text-on-surface font-mono">
                    ₹ {Math.round((projectedDisbursement * 10000000) / projectedBeneficiaries).toLocaleString("gu-IN")}
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-primary font-mono font-semibold">
                      +₹ {(Math.round((projectedDisbursement * 10000000) / projectedBeneficiaries) - 3598).toLocaleString("gu-IN")}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="bg-surface-container text-on-surface-variant text-caption font-caption px-2 py-0.5 rounded font-medium">
                      <T gu="મેરિટ વેઇટેજ" en="Merit Weightage" hi="मेरिट वेटेज" />
                    </span>
                  </td>
                </tr>

                {/* Row 5 */}
                <tr className="hover:bg-surface-container-low/50 transition-colors">
                  <td className="py-3 px-4 font-medium flex items-center gap-2">
                    <Icon name="account_balance" size={18} className="text-green-700" />
                    <T
                      gu="DBT ડાયરેક્ટ ટ્રાન્સફર સફળતા દર"
                      en="DBT Direct Transfer Success Rate"
                      hi="डीबीटी प्रत्यक्ष अंतरण सफलता दर"
                    />
                  </td>
                  <td className="py-3 px-4 font-mono">૯૧.૨%</td>
                  <td className="py-3 px-4 font-bold text-green-700 font-mono">
                    {dbtTarget}%
                  </td>
                  <td className="py-3 px-4">
                    <span className="bg-green-100 text-green-800 font-label-md text-label-md px-2 py-0.5 rounded font-mono font-semibold">
                      +{(dbtTarget - 91.2).toFixed(1)}%
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="bg-green-100 text-green-800 text-caption font-caption px-2 py-0.5 rounded font-medium">
                      <T gu="PFMS લિન્ક" en="PFMS Integrated" hi="पीएफएमएस लिंक" />
                    </span>
                  </td>
                </tr>

                {/* Row 6 */}
                <tr className="hover:bg-surface-container-low/50 transition-colors">
                  <td className="py-3 px-4 font-medium flex items-center gap-2">
                    <Icon name="warning" size={18} className="text-error" />
                    <T
                      gu="ઉચ્ચ જોખમ ડ્રોપઆઉટ દર"
                      en="High Risk Dropout Rate"
                      hi="उच्च जोखिम ड्रॉपआउट दर"
                    />
                  </td>
                  <td className="py-3 px-4 font-mono">૧૧.૪%</td>
                  <td className="py-3 px-4 font-bold text-green-700 font-mono">
                    {(11.4 * (1 - parseFloat(dropoutReduction) / 100)).toFixed(1)}%
                  </td>
                  <td className="py-3 px-4">
                    <span className="bg-green-100 text-green-800 font-label-md text-label-md px-2 py-0.5 rounded font-mono font-semibold">
                      -{dropoutReduction}% ઘટાડો
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="bg-green-100 text-green-800 text-caption font-caption px-2 py-0.5 rounded font-medium">
                      <T gu="સુધારાત્મક ક્રિયા" en="Early Intervened" hi="सुधारात्मक कार्रवाई" />
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Main Dual Column Layout (Engine Diff & Interactive Sandbox) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT COLUMN: Engine & Diff Viewer (8 cols out of 12) */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            {/* Student Grade Rollover Simulator Card */}
            <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/40">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-outline-variant/30">
                <div>
                  <div className="flex items-center gap-2">
                    <Icon name="person_check" size={24} className="text-primary" />
                    <h3 className="font-headline-sm text-headline-sm text-on-surface">
                      <T
                        gu="વિદ્યાર્થી સિમ્યુલેશન અને વર્ગબઢતી કંટ્રોલ"
                        en="Student Grade Rollover Simulator & Rule Engine Tester"
                        hi="छात्र सिमुलेशन और पदोन्नति नियंत्रण"
                      />
                    </h3>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    <T
                      gu="લાઇવ પ્રોફાઇલ આધારિત વાર્ષિક શિષ્યવૃત્તિ નિયમ એન્જિન"
                      en="Live profile based annual scholarship rule engine testing"
                      hi="लाइव प्रोफाइल आधारित वार्षिक छात्रवृत्ति नियम इंजन परीक्षण"
                    />
                  </p>
                </div>
                <span className="bg-surface-container px-3 py-1 rounded-full text-primary font-label-md text-label-md flex items-center gap-1.5 font-medium">
                  <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
                  <T gu="લાઈવ પ્રોફાઇલ" en="Live Profile" hi="लाइव प्रोफ़ाइल" />
                </span>
              </div>

              {/* Student Profile Box */}
              <div className="bg-surface-container-low p-4 rounded-xl mt-4 mb-4 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between border border-outline-variant/30">
                <div className="flex items-center gap-4">
                  {/* Avatar Initials Placeholder */}
                  <div className="w-16 h-16 rounded-xl bg-primary text-on-primary font-title-lg flex items-center justify-center font-bold shadow-sm shrink-0">
                    RP
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-title-lg text-title-lg text-on-surface font-bold">
                        <T
                          gu="રિયા હસમુખભાઈ પટેલ (Riya Patel)"
                          en="Riya Hasmukhbhai Patel"
                          hi="रिया हसमुखभाई पटेल"
                        />
                      </span>
                      <span className="bg-primary text-on-primary font-caption text-caption px-2 py-0.5 rounded-full font-mono">
                        GJ-AND-2026-004512
                      </span>
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                      <T
                        gu="શ્રી સરદાર પટેલ હાઇસ્કૂલ, આણંદ • કેટેગરી: SEBC • ધોરણ ૯-બી"
                        en="Shree Sardar Patel High School, Anand • Category: SEBC • Class 9-B"
                        hi="श्री सरदार पटेल हाई स्कूल, आणंद • श्रेणी: SEBC • कक्षा 9-बी"
                      />
                    </p>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span className="font-caption text-caption bg-surface-container px-2 py-0.5 rounded text-on-surface">
                        <T gu="વાર્ષિક સ્કોર: ૭૮%" en="Annual Score: 78%" hi="वार्षिक स्कोर: 78%" />
                      </span>
                      <span
                        className={`font-caption text-caption px-2 py-0.5 rounded font-medium ${
                          attendance < 75
                            ? "bg-error-container text-on-error-container"
                            : "bg-surface-container text-on-surface"
                        }`}
                      >
                        <T
                          gu={`હાજરી: ${attendance}% (${attendance < 75 ? "જોખમી / અયોગ્ય" : "નિયમિત"})`}
                          en={`Attendance: ${attendance}% (${attendance < 75 ? "At Risk" : "Regular"})`}
                          hi={`उपस्थिति: ${attendance}% (${attendance < 75 ? "जोखिम" : "नियमित"})`}
                        />
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:items-end gap-1 w-full md:w-auto">
                  <span className="font-caption text-caption text-on-surface-variant">
                    <T gu="લક્ષિત પ્રમોશન વર્ગ" en="Target Promotion Class" hi="लक्षित पदोन्नति कक्षा" />
                  </span>
                  <div className="bg-surface-container-lowest px-3 py-1.5 rounded-lg shadow-sm flex items-center gap-2 border border-outline-variant/40">
                    <span className="font-label-lg text-label-lg text-on-surface font-semibold">
                      <T gu="ધોરણ ૧૦ (SSC Board)" en="Class 10 (SSC Board)" hi="कक्षा 10 (SSC बोर्ड)" />
                    </span>
                    <Icon name="verified" size={18} className="text-primary" fill />
                  </div>
                </div>
              </div>

              {/* Action Promote Bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-surface-container p-4 rounded-xl">
                <div className="flex items-center gap-2 text-on-surface-variant">
                  <Icon name="psychology" size={20} className="text-primary" />
                  <span className="font-body-sm text-body-sm">
                    <T
                      gu="પ્રમોશન રન કરવાથી ગુજરાત સ્કોલરશિપ પોર્ટલના તમામ નિયમો આપોઆપ લાગુ થશે."
                      en="Running promotion automatically triggers all Gujarat scholarship portal rule engines."
                      hi="पदोन्नति चलाने से गुजरात छात्रवृत्ति पोर्टल के सभी नियम स्वतः लागू हो जाएंगे।"
                    />
                  </span>
                </div>
                <button
                  onClick={handleRunSimulation}
                  disabled={isRunningSim}
                  className="w-full sm:w-auto bg-secondary hover:bg-secondary/90 text-on-secondary px-5 py-2.5 rounded-lg font-title-sm text-title-sm transition-all flex items-center justify-center gap-2 shadow-md active:scale-95"
                >
                  <Icon name="rocket_launch" size={18} />
                  <span>
                    <T
                      gu="પ્રમોટ કરો અને નિયમ એન્જિન ચલાવો"
                      en="Promote & Run Rule Engine"
                      hi="पदोन्नत करें और नियम इंजन चलाएं"
                    />
                  </span>
                </button>
              </div>
            </div>

            {/* Live Animated Diff & Eligibility Engine Output */}
            <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/40">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-4 border-b border-outline-variant/30">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-primary animate-pulse" />
                  <h3 className="font-headline-sm text-headline-sm text-on-surface">
                    <T
                      gu="સ્કીમ પાત્રતા ડિફ આઉટપુટ (Live Eligibility Diff)"
                      en="Live Scheme Eligibility Diff Output"
                      hi="लाइव योजना पात्रता डिफ आउटपुट"
                    />
                  </h3>
                </div>
                <span className="bg-surface-container-low text-primary font-caption text-caption px-3 py-1 rounded-full flex items-center gap-1 font-mono">
                  <Icon name="speed" size={14} />
                  <T
                    gu={`Engine Re-Run Complete in ${engineTime}`}
                    en={`Engine Re-Run Complete in ${engineTime}`}
                    hi={`Engine Re-Run Complete in ${engineTime}`}
                  />
                </span>
              </div>

              <div className="flex flex-col gap-4 mt-4">
                {/* Category 1: Newly Eligible */}
                <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/30">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="bg-secondary-fixed text-on-secondary-fixed px-2 py-0.5 rounded font-label-md text-label-md font-bold uppercase tracking-wider flex items-center gap-1">
                        <Icon name="stars" size={16} fill />
                        <T
                          gu="નવી પાત્ર થયેલ યોજનાઓ (+New Eligible Schemes)"
                          en="Newly Eligible Schemes (+New)"
                          hi="नई पात्र योजनाएं (+New)"
                        />
                      </span>
                      <span className="text-on-surface-variant font-caption text-caption">
                        <T gu="૨ યોજનાઓ નવી અનલોક" en="2 Schemes Unlocked" hi="2 योजनाएं अनलॉक" />
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Scheme Card 1 */}
                    <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow border border-outline-variant/30">
                      <div>
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="font-title-md text-title-md text-on-surface font-semibold">
                            <T
                              gu="મુખ્યમંત્રી જ્ઞાન સાધના મેરિટ સ્કોલરશિપ"
                              en="Mukhya Mantri Gyan Sadhana Merit Scholarship"
                              hi="मुख्यमंत्री ज्ञान साधना मेरिट छात्रवृत्ति"
                            />
                          </h4>
                          <span className="bg-surface-container text-primary font-label-md text-label-md px-2 py-0.5 rounded-full shrink-0 font-bold">
                            + NEW
                          </span>
                        </div>
                        <p className="font-caption text-caption text-on-surface-variant mt-1">
                          Class 10 SSC Special Incentive Quota
                        </p>
                        <div className="my-3 p-2.5 bg-surface-container-low rounded-lg">
                          <p className="font-body-sm text-body-sm text-on-surface">
                            <T
                              gu="ધોરણ ૧૦ બોર્ડ પરીક્ષા પ્રોત્સાહન હેઠળ રિયા હવે વાર્ષિક રકમ માટે આપોઆપ લાયક બની છે."
                              en="Under Class 10 Board incentive criteria, Riya is now automatically eligible for the annual grant."
                              hi="कक्षा 10 बोर्ड प्रोत्साहन के तहत रिया अब वार्षिक अनुदान के लिए स्वचालित रूप से पात्र हो गई है।"
                            />
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-outline-variant/20">
                        <div>
                          <span className="font-caption text-caption text-on-surface-variant block">
                            <T gu="સહાય રકમ" en="Assistance Amount" hi="सहायता राशि" />
                          </span>
                          <span className="font-title-lg text-title-lg text-primary font-bold">
                            ₹ ૧૫,૦૦૦/વર્ષ
                          </span>
                        </div>
                        <span className="bg-surface-container-high text-primary px-2 py-1 rounded text-caption font-caption flex items-center gap-1 font-medium">
                          <Icon name="send" size={14} />
                          <T gu="વાલી સંમતિ SMS મોકલાયો" en="Parent Consent SMS Sent" hi="अभिभावक सहमति एसएमएस भेजा" />
                        </span>
                      </div>
                    </div>

                    {/* Scheme Card 2 */}
                    <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow border border-outline-variant/30">
                      <div>
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="font-title-md text-title-md text-on-surface font-semibold">
                            <T
                              gu="સરસ્વતી સાધના સાયકલ મેન્ટેનન્સ ગ્રાન્ટ"
                              en="Saraswati Sadhana Cycle Maintenance Grant"
                              hi="सरस्वती साधना साइकिल रखरखाव अनुदान"
                            />
                          </h4>
                          <span className="bg-surface-container text-primary font-label-md text-label-md px-2 py-0.5 rounded-full shrink-0 font-bold">
                            + UNLOCKED
                          </span>
                        </div>
                        <p className="font-caption text-caption text-on-surface-variant mt-1">
                          Bicycle Annual Upkeep Allowance
                        </p>
                        <div className="my-3 p-2.5 bg-surface-container-low rounded-lg">
                          <p className="font-body-sm text-body-sm text-on-surface">
                            <T
                              gu="અગાઉ પ્રાપ્ત સાયકલનું વેરિફિકેશન મંજૂર થયેલ છે. વાર્ષિક જાળવણી ભથ્થું એકાઉન્ટમાં જમા થશે."
                              en="Previously distributed bicycle physical verification approved. Annual upkeep grant ready for transfer."
                              hi="पूर्व वितरित साइकिल का सत्यापन स्वीकृत। वार्षिक रखरखाव अनुदान बैंक खाते में अंतरण हेतु तैयार।"
                            />
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-outline-variant/20">
                        <div>
                          <span className="font-caption text-caption text-on-surface-variant block">
                            <T gu="સહાય રકમ" en="Assistance Amount" hi="सहायता राशि" />
                          </span>
                          <span className="font-title-lg text-title-lg text-primary font-bold">
                            ₹ ૧,૫૦૦/વર્ષ
                          </span>
                        </div>
                        <span className="bg-surface-container-high text-on-surface px-2 py-1 rounded text-caption font-caption flex items-center gap-1 font-medium">
                          <Icon name="inventory_2" size={14} />
                          <T gu="ગ્રાન્ટ પાત્ર" en="Grant Eligible" hi="अनुदान पात्र" />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Category 2: Auto-Renewed with Consent */}
                <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/30">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="bg-primary-fixed text-on-primary-fixed px-2 py-0.5 rounded font-label-md text-label-md font-bold uppercase tracking-wider flex items-center gap-1">
                        <Icon name="sync" size={16} />
                        <T
                          gu="આપોઆપ નવીકરણ (Auto-Renewed with Consent)"
                          en="Auto-Renewed with Consent"
                          hi="सहमति से स्वतः नवीनीकृत"
                        />
                      </span>
                      <span className="text-on-surface-variant font-caption text-caption">
                        <T gu="૧ યોજના સક્રિય રિન્યુ" en="1 Scheme Active Renewed" hi="1 योजना सक्रिय नवीनीकृत" />
                      </span>
                    </div>
                  </div>

                  <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm border border-outline-variant/30">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-title-lg text-title-lg text-on-surface font-semibold">
                            <T
                              gu="નમો લક્ષ્મી યોજના (Namo Lakshmi Yojana - Phase 2)"
                              en="Namo Lakshmi Yojana - Phase 2"
                              hi="नमो लक्ष्मी योजना - चरण 2"
                            />
                          </h4>
                          <span className="bg-surface-container text-primary font-caption text-caption px-2 py-0.5 rounded font-semibold">
                            <T gu="ધોરણ ૧૦ હપ્તો" en="Class 10 Installment" hi="कक्षा 10 किस्त" />
                          </span>
                        </div>
                        <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                          <T
                            gu="નિયમિત શિક્ષણ જાળવણી પ્રોત્સાહન • પાત્રતા માપદંડ પૂર્ણ"
                            en="Regular secondary education retention incentive • Eligibility criteria met"
                            hi="नियमित माध्यमिक शिक्षा प्रतिधारण प्रोत्साहन • पात्रता मानदंड पूर्ण"
                          />
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="font-title-lg text-title-lg text-primary font-bold">₹ ૧૫,૦૦૦</span>
                        <span className="block font-caption text-caption text-secondary font-medium">
                          <T gu="+₹ ૨,૫૦૦ ગત વર્ષ કરતાં વધારો" en="+₹ 2,500 increase over last year" hi="+₹ 2,500 पिछले वर्ष की तुलना में वृद्धि" />
                        </span>
                      </div>
                    </div>

                    {/* Rule Verification Pill Chain */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3 pt-3 bg-surface-container-low p-3 rounded-lg border border-outline-variant/20">
                      <div className="flex items-center gap-2">
                        {attendance < 75 ? (
                          <>
                            <Icon name="cancel" size={18} className="text-error" fill />
                            <span className="font-caption text-caption text-error font-semibold">
                              <T
                                gu={`હાજરી ${attendance}% (જરૂરિયાત ૮૦%) ✕ અયોગ્ય`}
                                en={`Attendance ${attendance}% (Req 80%) ✕ Ineligible`}
                                hi={`उपस्थिति ${attendance}% (आवश्यक 80%) ✕ अपात्र`}
                              />
                            </span>
                          </>
                        ) : (
                          <>
                            <Icon name="check_circle" size={18} className="text-primary" fill />
                            <span className="font-caption text-caption text-on-surface">
                              <T
                                gu={`હાજરી ${attendance}% (જરૂરિયાત ૮૦%) ✓`}
                                en={`Attendance ${attendance}% (Req 80%) ✓`}
                                hi={`उपस्थिति ${attendance}% (आवश्यक 80%) ✓`}
                              />
                            </span>
                          </>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-on-surface">
                        <Icon name="verified_user" size={18} className="text-primary" fill />
                        <span className="font-caption text-caption">
                          <T gu="આધાર સીડિંગ માન્ય ✓" en="Aadhaar Seeding Valid ✓" hi="आधार सीडिंग मान्य ✓" />
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-on-surface">
                        <Icon name="description" size={18} className="text-primary" fill />
                        <span className="font-caption text-caption">
                          <T gu="વાર્ષિક આવક દાખલો માન્ય ✓" en="Annual Income Cert Valid ✓" hi="आय प्रमाण पत्र मान्य ✓" />
                        </span>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between flex-wrap gap-2 text-on-surface-variant font-caption text-caption">
                      <span className="flex items-center gap-1 text-primary">
                        <Icon name="fingerprint" size={16} />
                        <T
                          gu="ઓટો-રિન્યુઅલ કન્સેન્ટ સક્રિય (DPDP Act 2023 મુજબ માન્ય સંમતિ)"
                          en="Auto-renewal consent active (DPDP Act 2023 verified)"
                          hi="ऑटो-नवीनीकरण सहमति सक्रिय (DPDP Act 2023 सत्यापित)"
                        />
                      </span>
                      <span className="bg-surface-container px-2 py-0.5 rounded text-on-surface">
                        <T gu="સંમતિ તારીખ: ૧૨ માર્ચ ૨૦૨૬" en="Consent Date: 12 Mar 2026" hi="सहमति तिथि: 12 मार्च 2026" />
                      </span>
                    </div>
                  </div>
                </div>

                {/* Category 3: Discontinued / Graduated Out */}
                <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/30">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="bg-surface-container-highest text-on-surface-variant px-2 py-0.5 rounded font-label-md text-label-md font-bold uppercase tracking-wider flex items-center gap-1">
                        <Icon name="block" size={16} />
                        <T
                          gu="હવે લાગુ પડતી નથી / આપોઆપ મુક્ત"
                          en="Discontinued / Graduated Out"
                          hi="अब लागू नहीं / पूर्ण हो चुकी"
                        />
                      </span>
                      <span className="text-on-surface-variant font-caption text-caption">
                        <T gu="૧ યોજના મર્યાદા સમાપ્ત" en="1 Scheme Expired" hi="1 योजना समाप्त" />
                      </span>
                    </div>
                  </div>

                  <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 opacity-80 border border-outline-variant/30">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-surface-container text-on-surface-variant flex items-center justify-center shrink-0">
                        <Icon name="history_edu" size={20} />
                      </div>
                      <div>
                        <h4 className="font-title-md text-title-md text-on-surface font-medium">
                          <T
                            gu="પૂર્વ-મેટ્રિક પ્રાથમિક શિષ્યવૃત્તિ (Pre-Matric Lower School)"
                            en="Pre-Matric Lower School Scholarship"
                            hi="पूर्व-मैट्रिक प्राथमिक छात्रवृत्ति"
                          />
                        </h4>
                        <p className="font-caption text-caption text-on-surface-variant">
                          <T
                            gu="આ યોજના ધોરણ ૮-૯ સુધી પૂરતી મર્યાદિત હતી. ધોરણ ૧૦ માં વિદ્યાર્થી આપોઆપ મુક્ત થાય છે."
                            en="This scheme was restricted up to Class 9. Student successfully completed and graduated out for Class 10."
                            hi="यह योजना कक्षा 9 तक सीमित थी। कक्षा 10 में छात्र सफलतापूर्वक पूर्ण होकर मुक्त होता है।"
                          />
                        </p>
                      </div>
                    </div>
                    <span className="bg-surface-container px-3 py-1 rounded-full font-label-md text-label-md text-outline shrink-0">
                      <T gu="મર્યાદા સમાપ્ત (Discontinued)" en="Discontinued" hi="समाप्त" />
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bulk School Simulation Bar */}
            <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/40">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
                <div className="flex items-center gap-2">
                  <Icon name="domain_verification" size={24} className="text-primary" />
                  <div>
                    <h3 className="font-title-lg text-title-lg text-on-surface font-semibold">
                      <T
                        gu="સમગ્ર શાળા / જિલ્લા સ્તરે રોલઓવર કરો"
                        en="School / District Level Bulk Rollover Engine"
                        hi="संपूर्ण स्कूल / जिला स्तर रोलओवर इंजन"
                      />
                    </h3>
                    <p className="font-caption text-caption text-on-surface-variant">
                      <T
                        gu="શ્રી સરદાર પટેલ હાઇસ્કૂલ, આણંદ • બલ્ક રોલઓવર બેચ પરિણામ"
                        en="Shree Sardar Patel High School, Anand • Bulk Batch Results"
                        hi="श्री सरदार पटेल हाई स्कूल, आणंद • बल्क बैच परिणाम"
                      />
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => alert("બલ્ક SMS / વોટ્સએપ નોટિફિકેશન સફળતાપૂર્વક મોકલાઈ ગયું છે.")}
                  className="bg-surface-container hover:bg-surface-container-high text-primary px-3.5 py-1.5 rounded-lg font-label-lg text-label-lg transition-colors flex items-center gap-1.5"
                >
                  <Icon name="forward_to_inbox" size={18} />
                  <span>
                    <T
                      gu="બલ્ક SMS / વોટ્સએપ ટ્રિગર કરો"
                      en="Trigger Bulk SMS / WhatsApp"
                      hi="बल्क एसएमएस / व्हाट्सएप भेजें"
                    />
                  </span>
                </button>
              </div>

              <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/30">
                <div className="flex justify-between items-center mb-1.5 font-label-md text-label-md">
                  <span className="text-on-surface">
                    <T
                      gu="૮૪૨ વિદ્યાર્થીઓમાંથી ૮૩૦ સફળતાપૂર્વક પ્રમોટ"
                      en="830 of 842 students successfully promoted"
                      hi="842 में से 830 छात्र सफलतापूर्वक पदोन्नत"
                    />
                  </span>
                  <span className="text-primary font-bold font-mono">૯૮.૬% (98.6%)</span>
                </div>
                <div className="w-full bg-surface-container rounded-full h-3 overflow-hidden">
                  <div className="bg-primary h-3 rounded-full transition-all duration-700 w-[98.6%]" />
                </div>
                <div className="flex justify-between items-center mt-2 text-on-surface-variant font-caption text-caption">
                  <span>
                    <T
                      gu="૧૨ કેસ વેરિફિકેશન માટે પેન્ડિંગ (આધાર / ટ્રાન્સફર સર્ટિફિકેટ વિલંબ)"
                      en="12 cases pending manual verification (transfer certificate delay)"
                      hi="12 मामले सत्यापन हेतु लंबित (स्थानांतरण प्रमाण पत्र विलंब)"
                    />
                  </span>
                  <span className="text-primary font-semibold font-mono">#BAT-AND-098</span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Interactive Scenario Triggers & Fiscal Chart (4 cols out of 12) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            {/* Scenario Triggers Card */}
            <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/40">
              <div className="flex items-center gap-2 mb-4">
                <Icon name="tune" size={24} className="text-secondary" />
                <div>
                  <h3 className="font-title-lg text-title-lg text-on-surface font-semibold">
                    <T
                      gu="લાઇવ પરિસ્થિતિ ટ્રિગર્સ"
                      en="Interactive Scenario Triggers"
                      hi="लाइव परिदृश्य ट्रिगर्स"
                    />
                  </h3>
                  <p className="font-caption text-caption text-on-surface-variant">
                    <T
                      gu="વિદ્યાર્થી સ્તરે શરતો ચકાસો"
                      en="Real-time condition tester"
                      hi="वास्तविक समय शर्त परीक्षक"
                    />
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                {/* Scenario 1: Attendance Drop Test */}
                <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/30">
                  <div className="flex items-center justify-between mb-1">
                    <label htmlFor={attendanceInputId} className="font-title-sm text-title-sm text-on-surface">
                      <T
                        gu="૧. હાજરી ઘટાડાની અસર"
                        en="1. Attendance Drop Impact"
                        hi="1. उपस्थिति गिरावट प्रभाव"
                      />
                    </label>
                    <span
                      className={`px-2 py-0.5 rounded font-bold font-mono text-sm ${
                        attendance < 75
                          ? "bg-error-container text-on-error-container"
                          : "bg-surface-container text-primary"
                      }`}
                    >
                      {attendance}%
                    </span>
                  </div>
                  <p className="font-caption text-caption text-on-surface-variant mb-2">
                    <T
                      gu="હાજરી સ્લાઇડર ખસેડીને સ્કોલરશિપ અટકાવાનો નિયમ ચકાસો."
                      en="Move attendance slider to test automated scholarship pause trigger."
                      hi="छात्रवृत्ति रोकने के नियम का परीक्षण करने के लिए उपस्थिति स्लाइडर को हिलाएं।"
                    />
                  </p>
                  <div className="space-y-1">
                    <input
                      id={attendanceInputId}
                      type="range"
                      min="60"
                      max="95"
                      value={attendance}
                      onChange={(e) => setAttendance(parseInt(e.target.value))}
                      className="w-full accent-primary cursor-pointer h-2 bg-surface-container rounded-lg"
                    />
                    <div className="flex justify-between font-caption text-caption text-on-surface-variant text-[11px]">
                      <span>60% (ગંભીર)</span>
                      <span>75% (કટ-ઓફ)</span>
                      <span>95% (ઉત્કૃષ્ટ)</span>
                    </div>
                  </div>

                  <div
                    className={`mt-3 p-2.5 rounded-lg text-caption font-caption flex items-start gap-2 transition-all ${
                      attendance < 75
                        ? "bg-error-container text-on-error-container"
                        : "bg-surface-container text-on-surface"
                    }`}
                  >
                    <Icon
                      name={attendance < 75 ? "warning" : "info"}
                      size={18}
                      className={attendance < 75 ? "text-error" : "text-primary"}
                      fill
                    />
                    <span>
                      {attendance < 75 ? (
                        <T
                          gu="ચેતવણી: ૭૫% થી ઓછી હાજરી! નમો લક્ષ્મી યોજના હપ્તો અટકી શકે છે."
                          en="Warning: Attendance below 75%! Namo Lakshmi Yojana installment will be paused."
                          hi="चेतावनी: उपस्थिति 75% से कम! नमो लक्ष्मी योजना की किस्त रोकी जा सकती है।"
                        />
                      ) : (
                        <T
                          gu="હાજરી નિયમ મુજબ માન્ય છે (૮૦% ઉપર). યોજના સુરક્ષિત."
                          en="Attendance compliant (above 80% norm). Scholarship payout secured."
                          hi="उपस्थिति नियमानुसार मान्य (80% से ऊपर)। योजना सुरक्षित।"
                        />
                      )}
                    </span>
                  </div>
                </div>

                {/* Scenario 2: DBT Payment Simulate */}
                <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/30">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-title-sm text-title-sm text-on-surface">
                      <T
                        gu="૨. DBT ચૂકવણી ટેસ્ટિંગ"
                        en="2. DBT Payout Testing"
                        hi="2. डीबीटी भुगतान परीक्षण"
                      />
                    </span>
                    <span className="bg-surface-container px-2 py-0.5 rounded text-on-surface font-caption text-caption">
                      PFMS Bridge
                    </span>
                  </div>
                  <p className="font-caption text-caption text-on-surface-variant mb-3">
                    <T
                      gu="બેંક ટ્રાન્સફર સફળતા અથવા નિષ્ફળતાનું લાઈવ સિમ્યુલેશન."
                      en="Live simulation of bank credit success vs NPCI reject."
                      hi="बैंक हस्तांतरण सफलता या विफलता का लाइव सिमुलेशन।"
                    />
                  </p>
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <button
                      onClick={() => setDbtState("success")}
                      className={`p-2 rounded-lg shadow-sm font-label-md text-label-md flex items-center justify-center gap-1.5 active:scale-95 transition-all border ${
                        dbtState === "success"
                          ? "bg-green-700 text-white border-green-800"
                          : "bg-surface-container-lowest text-primary border-outline-variant/40 hover:bg-surface-container"
                      }`}
                    >
                      <Icon name="check_circle" size={16} fill={dbtState === "success"} />
                      <span>
                        <T gu="સફળ DBT" en="DBT Success" hi="सफल डीबीटी" />
                      </span>
                    </button>
                    <button
                      onClick={() => setDbtState("failed")}
                      className={`p-2 rounded-lg shadow-sm font-label-md text-label-md flex items-center justify-center gap-1.5 active:scale-95 transition-all border ${
                        dbtState === "failed"
                          ? "bg-error text-white border-error"
                          : "bg-surface-container-lowest text-error border-outline-variant/40 hover:bg-error-container"
                      }`}
                    >
                      <Icon name="cancel" size={16} fill={dbtState === "failed"} />
                      <span>
                        <T gu="NPCI અનસીડેડ" en="NPCI Failed" hi="एनपीसीआई विफल" />
                      </span>
                    </button>
                  </div>

                  <div
                    className={`p-2.5 rounded-lg text-caption font-caption flex items-center gap-2 border transition-all ${
                      dbtState === "success"
                        ? "bg-green-50 text-green-900 border-green-200"
                        : dbtState === "failed"
                        ? "bg-error-container text-on-error-container border-error/30"
                        : "bg-surface-container text-on-surface border-outline-variant/20"
                    }`}
                  >
                    <Icon
                      name={
                        dbtState === "success"
                          ? "check_circle"
                          : dbtState === "failed"
                          ? "error"
                          : "account_balance"
                      }
                      size={18}
                      className={
                        dbtState === "success"
                          ? "text-green-700"
                          : dbtState === "failed"
                          ? "text-error"
                          : "text-primary"
                      }
                      fill
                    />
                    <span>
                      {dbtState === "success" ? (
                        <T
                          gu="DBT સફળ: ₹ ૧૫,૦૦૦ એકાઉન્ટ (A/C **4589) માં ક્રેડિટ સિમ્યુલેટ થયું ✓"
                          en="DBT Success: ₹ 15,000 credit simulation completed for A/C **4589 ✓"
                          hi="डीबीटी सफल: खाता (A/C **4589) में ₹ 15,000 जमा सिमुलेशन सफल ✓"
                        />
                      ) : dbtState === "failed" ? (
                        <T
                          gu="DBT નિષ્ફળ: NPCI મેપર અન-સીડેડ (Reject Code: NPCI-042)"
                          en="DBT Failed: NPCI mapper unseeded (Reject Code: NPCI-042)"
                          hi="डीबीटी विफल: एनपीसीआई मैपर अन-सीडेड (रिजेक्ट कोड: NPCI-042)"
                        />
                      ) : (
                        <T
                          gu="સ્ટેટ બેંક ઓફ ઇન્ડિયા (Aadhaar Seeding: Active)"
                          en="State Bank of India (Aadhaar Seeding: Active)"
                          hi="भारतीय स्टेट बैंक (आधार सीडिंग: सक्रिय)"
                        />
                      )}
                    </span>
                  </div>
                </div>

                {/* Scenario 3: Income Certificate Expiry */}
                <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/30">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-title-sm text-title-sm text-on-surface">
                      <T
                        gu="૩. આવક પ્રમાણપત્ર ચકાસણી"
                        en="3. Income Certificate Check"
                        hi="3. आय प्रमाण पत्र सत्यापन"
                      />
                    </span>
                    <span className="bg-surface-container text-primary font-caption text-caption px-2 py-0.5 rounded font-medium">
                      Digital Seva
                    </span>
                  </div>
                  <p className="font-caption text-caption text-on-surface-variant">
                    <T
                      gu="પ્રમાણપત્ર માન્યતા: ૩૧ માર્ચ ૨૦૨૭ (માન્ય છે). ડીજીલોકર કનેક્શન સક્રિય."
                      en="Validity: 31 March 2027 (Valid). DigiLocker auto-fetch connected."
                      hi="प्रमाण पत्र वैधता: 31 मार्च 2027 (मान्य)। डिजिलॉकर कनेक्शन सक्रिय।"
                    />
                  </p>
                  <div className="mt-3 flex items-center justify-between text-caption font-caption bg-surface-container-lowest p-2 rounded-lg border border-outline-variant/30">
                    <span className="text-on-surface">
                      <T gu="વાર્ષિક આવક: ₹ ૧,૨૦,૦૦૦" en="Annual Income: ₹ 1,20,000" hi="वार्षिक आय: ₹ 1,20,000" />
                    </span>
                    <span className="text-primary font-bold">
                      <T gu="પાત્રતા મર્યાદા અંદર" en="Within Limit" hi="पात्रता सीमा के भीतर" />
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Projected Fiscal Impact Mini Chart */}
            <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/40">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-title-lg text-title-lg text-on-surface font-semibold">
                    <T
                      gu={`શૈક્ષણિક વર્ષ ${selectedYear} બજેટ અંદાજ`}
                      en={`AY ${selectedYear} Fiscal Impact`}
                      hi={`शैक्षणिक वर्ष ${selectedYear} बजट अनुमान`}
                    />
                  </h3>
                  <p className="font-caption text-caption text-on-surface-variant">
                    Projected Fiscal Impact & Treasury Demand
                  </p>
                </div>
                <Icon name="query_stats" size={24} className="text-primary" />
              </div>

              {/* Inline SVG Bar Comparison */}
              <div className="bg-surface-container-low p-4 rounded-xl mb-4 border border-outline-variant/30">
                <div className="flex items-center justify-between text-caption font-caption text-on-surface-variant mb-2">
                  <span>
                    <T gu="બજેટ સરખામણી (કરોડમાં)" en="Budget Comparison (₹ Cr)" hi="बजट तुलना (करोड़ में)" />
                  </span>
                  <span className="text-secondary font-bold font-mono">
                    +{budgetIncrease}% અંદાજિત વધારો
                  </span>
                </div>

                <svg aria-hidden="true" className="w-full h-24 overflow-visible" viewBox="0 0 320 90">
                  {/* Grid lines */}
                  <line className="text-outline-variant" stroke="currentColor" strokeDasharray="2" x1="60" x2="310" y1="20" y2="20" />
                  <line className="text-outline-variant" stroke="currentColor" strokeDasharray="2" x1="60" x2="310" y1="55" y2="55" />

                  {/* 2025-26 Bar */}
                  <text className="fill-current text-on-surface-variant text-[11px] font-sans" x="0" y="24">
                    2025-26
                  </text>
                  <rect className="fill-current text-primary" height="16" rx="4" width="160" x="65" y="12" />
                  <text className="fill-current text-on-surface text-[11px] font-bold" x="235" y="24">
                    ₹ ૪૨.૬ કરોડ
                  </text>

                  {/* 2026-27 Bar */}
                  <text className="fill-current text-on-surface-variant text-[11px] font-sans" x="0" y="59">
                    {selectedYear}
                  </text>
                  <rect
                    className="fill-current text-secondary"
                    height="16"
                    rx="4"
                    width={Math.min(235, Math.round(160 * (1 + budgetIncrease / 100)))}
                    x="65"
                    y="47"
                  />
                  <text className="fill-current text-secondary text-[11px] font-bold" x="235" y="59">
                    ₹ {projectedDisbursement} કરોડ
                  </text>
                </svg>

                <div className="mt-2 pt-2 border-t border-outline-variant/30 flex items-center justify-between text-caption font-caption text-on-surface-variant">
                  <span>
                    <T gu="તિજોરી સલામતી ગુણાંક:" en="Treasury Safety Coefficient:" hi="कोषागार सुरक्षा अनुपात:" />
                  </span>
                  <span className="text-primary font-bold">
                    <T gu="૯૪% ફાળવણી અંદર (Safe Surplus)" en="94% Within Allocation (Safe)" hi="94% सुरक्षित अधिशेष" />
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg bg-surface-container text-on-surface border border-outline-variant/30">
                <Icon name="shield" size={20} className="text-primary shrink-0" fill />
                <p className="font-caption text-caption">
                  <T
                    gu="આણંદ જિલ્લા સ્કોલરશિપ નોડલ ફંડ ૨૦૨૬ માટે પૂરતું ઉપલબ્ધ છે. કોઈ વધારાની ગ્રાન્ટ મંજૂરીની જરૂર નથી."
                    en="Anand district nodal fund is fully sufficient for the upcoming academic cycle. No supplementary grant required."
                    hi="आणंद जिला नोडल फंड आगामी शैक्षणिक चक्र के लिए पूर्णतः पर्याप्त है। अतिरिक्त अनुदान की आवश्यकता नहीं है।"
                  />
                </p>
              </div>
            </div>

            {/* Danger / Reset Zone Card */}
            <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/40">
              <div className="flex items-center gap-2 mb-2">
                <Icon name="history" size={24} className="text-error" />
                <h3 className="font-title-lg text-title-lg text-on-surface font-semibold">
                  <T
                    gu="ડેમો ડેટા રીસેટ (Reset Sandbox)"
                    en="Reset Sandbox Base State"
                    hi="डेमो डेटा रीसेट करें"
                  />
                </h3>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant mb-4">
                <T
                  gu="બધા સિમ્યુલેટેડ ફેરફારો સાફ કરી મૂળ ડેમો સ્થિતિ (Riya Patel Class 9 Base Profile) પર પાછા ફરો."
                  en="Clear all simulated scenario values and return to baseline demo profile (Riya Patel Class 9)."
                  hi="सभी सिम्युलेटेड परिवर्तनों को साफ़ करके मूल स्थिति पर वापस लौटें।"
                />
              </p>
              <button
                onClick={handleReset}
                className="w-full bg-surface-container-low hover:bg-error-container text-error hover:text-on-error-container p-3.5 rounded-xl font-title-sm text-title-sm transition-all flex items-center justify-center gap-2 border border-outline-variant/40 active:scale-95"
              >
                <Icon name="restart_alt" size={20} />
                <span>
                  <T
                    gu="મૂળ સ્થિતિમાં રીસેટ કરો (Reset Base State)"
                    en="Reset to Base State"
                    hi="मूल स्थिति में रीसेट करें"
                  />
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Back Link to Admin Overview */}
        <div className="pt-2 flex justify-between items-center text-caption font-caption text-on-surface-variant border-t border-outline-variant/40">
          <Link href="/admin" className="text-primary hover:underline flex items-center gap-1 font-label-md">
            <Icon name="arrow_back" size={16} />
            <T gu="રાજ્ય વિશ્લેષણ ડેશબોર્ડ પર પાછા જાઓ" en="Back to State Analytics Dashboard" hi="राज्य विश्लेषण डैशबोर्ड पर वापस जाएं" />
          </Link>
          <span>
            <T gu="આવૃત્તિ v3.2.0 • ગુજરાત સરકાર" en="Version v3.2.0 • Government of Gujarat" hi="संस्करण v3.2.0 • गुजरात सरकार" />
          </span>
        </div>
      </div>
    </OfficerShell>
  );
}
