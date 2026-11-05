"use client";

import { useState, useRef, useEffect, useTransition } from "react";
import Link from "next/link";
import { StudentShell } from "@/components/shell/StudentShell";
import { T } from "@/components/T";
import { Icon } from "@/components/Icon";

interface RichCardItem {
  type: "status_card" | "recommendation" | "advisory" | "action_card";
  title?: { gu: string; en: string; hi: string };
  subtitle?: { gu: string; en: string; hi: string };
  badge?: {
    gu: string;
    en: string;
    hi: string;
    icon: string;
    className: string;
  };
  amount?: string;
  amountLabel?: { gu: string; en: string; hi: string };
  info?: { gu: string; en: string; hi: string };
  subInfo?: { gu: string; en: string; hi: string };
  otp?: string;
  tip?: { gu: string; en: string; hi: string };
  actionLink?: string;
  actionText?: { gu: string; en: string; hi: string };
  actionIcon?: string;
}

interface ChatMessage {
  id: string;
  sender: "bot" | "user";
  text?: { gu: string; en: string; hi: string } | string;
  time: string;
  readStatus?: boolean;
  richCards?: RichCardItem[];
}

export default function AssistantPage() {
  const [showStudentBanner, setShowStudentBanner] = useState(true);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [copiedOtp, setCopiedOtp] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  const handleCopyOtp = (otp: string = "482913") => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(otp);
    }
    setCopiedOtp(true);
    showToast(`OTP ${otp} કોપી થઈ ગયું! / Copied!`);
    setTimeout(() => setCopiedOtp(false), 2000);
  };

  // Initial Sample Conversation matching Stitch HTML S12 screen
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg-1",
      sender: "bot",
      text: {
        gu: "નમસ્તે રિયા! 🙏 હું તમારો વિદ્યા મિત્ર છું. તમારી સ્કોલરશિપ, સાયકલ ડિલિવરી OTP અથવા યોજના પાત્રતા બાબતે પૂછી શકો છો. આજે હું તમને કેવી રીતે મદદ કરું?",
        en: "Namaste Riya! 🙏 I am your Vidya Mitra AI assistant. You can ask me about scholarships, bicycle delivery OTP, or scheme eligibility. How can I help you today?",
        hi: "नमस्ते रिया! 🙏 मैं आपका विद्या मित्र AI सहायक हूँ। आप मुझसे छात्रवृत्ति, साइकिल डिलीवरी OTP या योजना पात्रता के बारे में पूछ सकते हैं। आज मैं आपकी क्या सहायता करूँ?",
      },
      time: "૧૦:૧૫ AM",
    },
    {
      id: "msg-2",
      sender: "user",
      text: {
        gu: "મારી નમો લક્ષ્મી યોજના અને સાયકલનું સ્ટેટસ શું છે? ક્યારે મળશે?",
        en: "What is the status of my Namo Lakshmi Scheme and bicycle? When will I receive them?",
        hi: "मेरी नमो लक्ष्मी योजना और साइकिल की स्थिति क्या है? कब मिलेगी?",
      },
      time: "૧૦:૧૬ AM",
      readStatus: true,
    },
    {
      id: "msg-3",
      sender: "bot",
      text: {
        gu: "મેં તમારા રેકોર્ડ્સ ચકાસી લીધા છે! અહીં તમારી અરજીઓનું તાજેતરનું લાઈવ સ્ટેટસ છે:",
        en: "I have verified your records! Here is the latest live status of your applications:",
        hi: "मैंने आपके रिकॉर्ड सत्यापित कर लिए हैं! यहाँ आपके आवेदनों की नवीनतम स्थिति है:",
      },
      time: "૧૦:૧૭ AM",
      richCards: [
        {
          type: "status_card",
          title: {
            gu: "નમો લક્ષ્મી યોજના",
            en: "Namo Lakshmi Scheme",
            hi: "नमो लक्ष्मी योजना",
          },
          subtitle: {
            gu: "ધોરણ ૯ વાર્ષિક સહાય",
            en: "Class 9 Annual Aid",
            hi: "कक्षा 9 वार्षिक सहायता",
          },
          badge: {
            gu: "DEO મંજૂર",
            en: "DEO Approved",
            hi: "DEO स्वीकृत",
            icon: "check_circle",
            className: "bg-emerald-100 text-emerald-800",
          },
          amount: "₹ ૨,૫૦૦",
          amountLabel: {
            gu: "પ્રથમ હપ્તો:",
            en: "First Installment:",
            hi: "पहली किस्त:",
          },
          info: {
            gu: "માતાના SBI બેંક ખાતામાં DBT દ્વારા જમા થશે.",
            en: "Will be credited to Mother's SBI bank account via DBT.",
            hi: "माता के SBI बैंक खाते में DBT द्वारा जमा किया जाएगा।",
          },
          subInfo: {
            gu: "ટ્રેઝરી DBT ક્રેડિટ અંદાજિત ૨-૩ દિવસમાં",
            en: "Treasury DBT credit estimated in 2-3 days",
            hi: "ट्रेजरी DBT क्रेडिट अनुमानित 2-3 दिनों में",
          },
        },
        {
          type: "status_card",
          title: {
            gu: "સરસ્વતી સાધના સાયકલ",
            en: "Saraswati Sadhna Cycle",
            hi: "सरस्वती साधना साइकिल",
          },
          subtitle: {
            gu: "મોડેલ: Atlas 22T ગર્લ્સ",
            en: "Model: Atlas 22T Girls",
            hi: "मॉडल: Atlas 22T गर्ल्स",
          },
          badge: {
            gu: "શાળા પહોંચી ગઈ",
            en: "Arrived at School",
            hi: "स्कूल पहुंच गई",
            icon: "local_shipping",
            className: "bg-amber-100 text-amber-900",
          },
          info: {
            gu: "શ્રી સરદાર પટેલ હાઇસ્કૂલ, આણંદ ખાતે સાયકલ ઉપલબ્ધ છે.",
            en: "Cycle is available at Shree Sardar Patel High School, Anand.",
            hi: "साइकिल श्री सरदार पटेल हाई स्कूल, आणंद में उपलब्ध है।",
          },
          otp: "482913",
          actionLink: "/student/cycle",
          actionText: {
            gu: "OTP વિગત અને QR જુઓ",
            en: "View OTP Details & QR",
            hi: "OTP विवरण और QR देखें",
          },
          actionIcon: "qr_code_2",
        },
      ],
    },
    {
      id: "msg-4",
      sender: "user",
      text: {
        gu: "ધોરણ ૧૦ માં મને કઈ નવી સ્કોલરશિપ મળશે?",
        en: "Which new scholarship will I be eligible for in Class 10?",
        hi: "कक्षा 10 में मुझे कौन सी नई छात्रवृत्ति मिलेगी?",
      },
      time: "૧૦:૧૮ AM",
      readStatus: true,
    },
    {
      id: "msg-5",
      sender: "bot",
      text: {
        gu: "તમારા ૮મા ધોરણના ૭૮% ગુણ અને ૮૨% શાળા હાજરી મુજબ, ધોરણ ૧૦ માટે નીચે મુજબની મોટી યોજના માટે તમે સીધા પાત્ર છો:",
        en: "Based on your Class 8 score of 78% and 82% school attendance, you are directly eligible for this major scheme for Class 10:",
        hi: "कक्षा 8 के 78% अंकों और 82% उपस्थिति के आधार पर, आप कक्षा 10 के लिए निम्नलिखित प्रमुख योजना के सीधे पात्र हैं:",
      },
      time: "૧૦:૧૯ AM",
      richCards: [
        {
          type: "recommendation",
          badge: {
            gu: "ટોચની ભલામણ • મેરિટ સ્કોલરશિપ",
            en: "Top Recommendation • Merit Scholarship",
            hi: "शीर्ष सिफारिश • मेरिट छात्रवृत्ति",
            icon: "stars",
            className: "text-secondary font-bold",
          },
          title: {
            gu: "મુખ્યમંત્રી જ્ઞાન સાધના સ્કોલરશિપ",
            en: "Mukhyamantri Gyan Sadhana Scholarship",
            hi: "मुख्यमंत्री ज्ञान साधना छात्रवृत्ति",
          },
          amount: "₹ ૧૫,૦૦૦",
          amountLabel: {
            gu: "/ વાર્ષિક રકમ",
            en: "/ annual benefit",
            hi: "/ वार्षिक राशि",
          },
          tip: {
            gu: "વાર્ષિક આવક પ્રમાણપત્ર ૧૨ માર્ચ ૨૦૨૬ પહેલાં રિન્યુ કરાવવું જરૂરી છે.",
            en: "Annual income certificate must be renewed before 12 March 2026.",
            hi: "वार्षिक आय प्रमाण पत्र 12 मार्च 2026 से पहले नवीनीकृत करना आवश्यक है।",
          },
          actionLink: "/student/schemes/list",
          actionText: {
            gu: "પાત્રતા નિયમો અને અરજી ફોર્મ",
            en: "Eligibility Rules & Application Form",
            hi: "पात्रता नियम और आवेदन फॉर्म",
          },
          actionIcon: "arrow_forward",
        },
      ],
    },
  ]);

  // Suggested Quick Replies list
  const quickReplies = [
    {
      id: "namo",
      icon: "account_balance",
      color: "text-primary",
      gu: "નમો લક્ષ્મી ક્યારે મળશે?",
      en: "When will Namo Lakshmi arrive?",
      hi: "नमो लक्ष्मी कब मिलेगी?",
    },
    {
      id: "cycle",
      icon: "local_shipping",
      color: "text-secondary",
      gu: "સાયકલ ક્યારે મળશે?",
      en: "When will cycle arrive?",
      hi: "साइकिल कब मिलेगी?",
    },
    {
      id: "docs",
      icon: "pending_actions",
      color: "text-amber-600",
      gu: "કયા દસ્તાવેજો ખૂટે છે?",
      en: "Which docs are missing?",
      hi: "कौन से दस्तावेज़ गायब हैं?",
    },
    {
      id: "obc",
      icon: "verified",
      color: "text-emerald-600",
      gu: "ઓબીસી સ્ટેટસ શું છે?",
      en: "What is OBC status?",
      hi: "ओबीसी स्थिति क्या है?",
    },
    {
      id: "eligibility",
      icon: "auto_awesome",
      color: "text-primary",
      gu: "મારી પાત્રતા ચકાસો",
      en: "Check my eligibility",
      hi: "मेरी पात्रता जांचें",
    },
    {
      id: "teacher",
      icon: "contact_phone",
      color: "text-tertiary",
      gu: "નોડલ શિક્ષક સાથે વાત કરો",
      en: "Talk to nodal teacher",
      hi: "नोडल शिक्षक से बात करें",
    },
    {
      id: "grievance",
      icon: "report_problem",
      color: "text-danger",
      gu: "ફરિયાદ નોંધાવો",
      en: "Register grievance",
      hi: "शिकायत दर्ज करें",
    },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Mock AI response generator matching user queries
  const generateBotReply = (userQueryText: string, timeStr: string): ChatMessage => {
    const q = userQueryText.toLowerCase();

    if (q.includes("સાયકલ") || q.includes("cycle") || q.includes("સાઇકલ")) {
      return {
        id: `bot-${Date.now()}`,
        sender: "bot",
        text: {
          gu: "તમારી સરસ્વતી સાધના સાયકલ (Atlas 22T Girls) શ્રી સરદાર પટેલ હાઇસ્કૂલમાં આવી ગઈ છે! શાળાએ જઈને તમારા વર્ગ શિક્ષક અથવા નોડલ અધિકારીને નીચેનો ડિલિવરી OTP બતાવી સાયકલ મેળવી લો:",
          en: "Your Saraswati Sadhna Cycle (Atlas 22T Girls) has arrived at Shree Sardar Patel High School! Visit your school and show the OTP below to your class teacher or nodal officer to receive it:",
          hi: "आपकी सरस्वती साधना साइकिल (Atlas 22T Girls) श्री सरदार पटेल हाई स्कूल में आ चुकी है! स्कूल जाकर अपने कक्षा शिक्षक या नोडल अधिकारी को नीचे दिया गया OTP दिखाकर साइकिल प्राप्त करें:",
        },
        time: timeStr,
        richCards: [
          {
            type: "action_card",
            title: {
              gu: "સરસ્વતી સાધના સાયકલ ઉપલબ્ધ છે",
              en: "Saraswati Sadhna Bicycle Available",
              hi: "सरस्वती साधना साइकिल उपलब्ध है",
            },
            badge: {
              gu: "ડિલિવરી તૈયાર",
              en: "Ready for Pickup",
              hi: "पिकअप के लिए तैयार",
              icon: "pedal_bike",
              className: "bg-emerald-100 text-emerald-800",
            },
            info: {
              gu: "શ્રી સરદાર પટેલ હાઇસ્કૂલ, આણંદ • સ્ટોક રૂમ-A",
              en: "Shree Sardar Patel High School, Anand • Stock Room-A",
              hi: "श्री सरदार पटेल हाई स्कूल, आणंद • स्टॉक रूम-A",
            },
            otp: "482913",
            actionLink: "/student/cycle",
            actionText: {
              gu: "ડિલિવરી QR & વિગતો ખોલો",
              en: "Open Delivery QR & Details",
              hi: "वितरण QR और विवरण खोलें",
            },
            actionIcon: "qr_code_2",
          },
        ],
      };
    }

    if (q.includes("નમો") || q.includes("lakshmi") || q.includes("લક્ષ્મી") || q.includes("હપ્તો") || q.includes("rupee") || q.includes("મળશે")) {
      return {
        id: `bot-${Date.now()}`,
        sender: "bot",
        text: {
          gu: "નમો લક્ષ્મી યોજના હેઠળ ધોરણ ૯ નો પ્રથમ હપ્તો ₹ ૨,૫૦૦ DEO કચેરી, આણંદ દ્વારા મંજૂર થઈ ચૂક્યો છે. ટ્રેઝરી વિભાગ તરફથી માતાના આધાર લિન્ક્ડ SBI બેંક ખાતામાં ૨-૩ કાર્યકારી દિવસમાં રકમ જમા થઈ જશે.",
          en: "Under Namo Lakshmi Scheme, the 1st installment of ₹ 2,500 has been approved by DEO Office, Anand. The amount will be directly deposited via DBT into your mother's Aadhaar-linked SBI bank account within 2-3 working days.",
          hi: "नमो लक्ष्मी योजना के तहत कक्षा 9 की पहली किस्त ₹ 2,500 DEO कार्यालय, आणंद द्वारा स्वीकृत कर दी गई है। ट्रेजरी विभाग की ओर से माता के आधार लिंक्ड SBI बैंक खाते में 2-3 कार्य दिवसों में DBT द्वारा राशि जमा हो जाएगी।",
        },
        time: timeStr,
        richCards: [
          {
            type: "status_card",
            title: {
              gu: "નમો લક્ષ્મી યોજના (DBT ટ્રેકિંગ)",
              en: "Namo Lakshmi Scheme (DBT Tracking)",
              hi: "नमो लक्ष्मी योजना (DBT ट्रैकिंग)",
            },
            amount: "₹ ૨,૫૦૦",
            amountLabel: {
              gu: "મંજૂર રકમ:",
              en: "Approved Amount:",
              hi: "स्वीकृत राशि:",
            },
            badge: {
              gu: "PFMS પ્રોસેસિંગ",
              en: "PFMS Processing",
              hi: "PFMS प्रोसेसिंग",
              icon: "schedule",
              className: "bg-blue-100 text-primary font-semibold",
            },
            info: {
              gu: "માતાનું બેંક ખાતું: SBI ****4012 (DBT Active)",
              en: "Mother's Account: SBI ****4012 (DBT Active)",
              hi: "माता का बैंक खाता: SBI ****4012 (DBT Active)",
            },
            actionLink: "/student/payments",
            actionText: {
              gu: "DBT પાસબુક & ચુકવણી સ્થિતિ જુઓ",
              en: "View DBT Passbook & Payment Status",
              hi: "DBT पासबुक और भुगतान स्थिति देखें",
            },
            actionIcon: "payments",
          },
        ],
      };
    }

    if (q.includes("દસ્તાવેજ") || q.includes("document") || q.includes("ખૂટે") || q.includes("missing") || q.includes("દાખલો")) {
      return {
        id: `bot-${Date.now()}`,
        sender: "bot",
        text: {
          gu: "મેં તમારું દસ્તાવેજ વૉલ્ટ ચકાસ્યું છે! તમારી પાસે ૧ દસ્તાવેજ ખૂટે છે: 'તાજેતરનો વાર્ષિક આવક દાખલો (Income Certificate)'. આ દસ્તાવેજ અપલોડ કરવાથી ઓબીસી કેટેગરી સ્કોલરશિપ હેઠળ ₹ ૬,૦૦૦ ની વધારાની સહાય માન્ય થશે.",
          en: "I checked your Document Vault! You have 1 missing document: 'Latest Annual Income Certificate'. Uploading this document will approve the OBC Category Scholarship with ₹ 6,000 additional financial aid.",
          hi: "मैंने आपका दस्तावेज़ वॉल्ट जांचा है! आपका 1 दस्तावेज़ बाकी है: 'नवीनतम वार्षिक आय प्रमाण पत्र'। इस दस्तावेज़ को अपलोड करने से ओबीसी श्रेणी छात्रवृत्ति के तहत ₹ 6,000 की अतिरिक्त सहायता स्वीकृत होगी।",
        },
        time: timeStr,
        richCards: [
          {
            type: "action_card",
            title: {
              gu: "તાકીદ: આવકનો દાખલો અપલોડ કરો",
              en: "Action Required: Upload Income Certificate",
              hi: "आवश्यक कार्रवाई: आय प्रमाण पत्र अपलोड करें",
            },
            badge: {
              gu: "૧ દસ્તાવેજ બાકી",
              en: "1 Pending Doc",
              hi: "1 लंबित दस्तावेज़",
              icon: "warning",
              className: "bg-amber-100 text-amber-900",
            },
            info: {
              gu: "DigiLocker અથવા GSRDA થી સીધું ઓટો-ફેચ કરી શકો છો.",
              en: "Auto-fetch directly from DigiLocker or GSRDA.",
              hi: "डिजीलॉकर या GSRDA से सीधे ऑटो-फ़ेच कर सकते हैं।",
            },
            actionLink: "/student/vault",
            actionText: {
              gu: "દસ્તાવેજ વૉલ્ટમાં અપલોડ કરો",
              en: "Upload to Document Vault",
              hi: "दस्तावेज़ वॉल्ट में अपलोड करें",
            },
            actionIcon: "upload_file",
          },
        ],
      };
    }

    if (q.includes("ઓબીસી") || q.includes("obc") || q.includes("કેટેગરી")) {
      return {
        id: `bot-${Date.now()}`,
        sender: "bot",
        text: {
          gu: "તમારી 'ઓબીસી પ્રિ-મેટ્રિક શિષ્યવૃત્તિ' અરજી પોર્ટલ પર ડ્રાફ્ટ થયેલી છે. તમારી જાતિ અને આધાર વેરિફિકેશન સફળ રહ્યું છે. માત્ર વાર્ષિક આવક પ્રમાણપત્ર અપલોડ કરતાં જ આ યોજના DEO સ્તરે મંજૂર થઈ જશે.",
          en: "Your 'OBC Pre-Matric Scholarship' application is drafted on the portal. Your caste and Aadhaar verification succeeded. As soon as you upload the annual income certificate, this scheme will be approved at the DEO level.",
          hi: "आपकी 'ओबीसी प्री-मैट्रिक छात्रवृत्ति' का आवेदन पोर्टल पर ड्राफ्ट है। आपकी जाति और आधार सत्यापन सफल रहा है। केवल वार्षिक आय प्रमाण पत्र अपलोड करते ही यह योजना DEO स्तर पर स्वीकृत हो जाएगी।",
        },
        time: timeStr,
        richCards: [
          {
            type: "status_card",
            title: {
              gu: "ઓબીસી પ્રિ-મેટ્રિક શિષ્યવૃત્તિ",
              en: "OBC Pre-Matric Scholarship",
              hi: "ओबीसी प्री-मैट्रिक छात्रवृत्ति",
            },
            amount: "₹ ૬,૦૦૦",
            amountLabel: {
              gu: "સંભવિત સહાય:",
              en: "Potential Benefit:",
              hi: "संभावित सहायता:",
            },
            badge: {
              gu: "દસ્તાવેજ જરૂરી",
              en: "Document Needed",
              hi: "दस्तावेज़ आवश्यक",
              icon: "pending_actions",
              className: "bg-amber-100 text-amber-900",
            },
            info: {
              gu: "આવક દાખલો અપલોડ કરી ૧-ક્લિકથી સબમિટ કરો.",
              en: "Upload income proof and submit with 1-click.",
              hi: "आय प्रमाण पत्र अपलोड करके 1-क्लिक में सबमिट करें।",
            },
            actionLink: "/student/vault",
            actionText: {
              gu: "અરજી પૂર્ણ કરો",
              en: "Complete Application",
              hi: "आवेदन पूरा करें",
            },
            actionIcon: "edit_document",
          },
        ],
      };
    }

    if (q.includes("પાત્રતા") || q.includes("eligibility") || q.includes("સ્કોલરશિપ")) {
      return {
        id: `bot-${Date.now()}`,
        sender: "bot",
        text: {
          gu: "તમારી શાળા હાજરી (૮૨%) અને અગાઉના ધોરણના ગુણ (૭૮%) ના આધારે તમે ૪ સરકારી યોજનાઓ માટે સંપૂર્ણ પાત્ર છો: (૧) નમો લક્ષ્મી યોજના, (૨) સરસ્વતી સાધના સાયકલ, (૩) મુખ્યમંત્રી જ્ઞાન સાધના, (૪) ઓબીસી સહાય. કુલ વાર્ષિક આર્થિક લાભ ₹ ૨૫,૦૦૦ + ૧ મફત સાયકલ છે!",
          en: "Based on your 82% school attendance and 78% marks in previous class, you are fully eligible for 4 government schemes: (1) Namo Lakshmi Scheme, (2) Saraswati Sadhna Cycle, (3) Mukhyamantri Gyan Sadhana, (4) OBC Aid. Total annual financial benefit is ₹ 25,000 + 1 free bicycle!",
          hi: "आपकी 82% स्कूल उपस्थिति और पिछली कक्षा के 78% अंकों के आधार पर आप 4 सरकारी योजनाओं के लिए पूरी तरह पात्र हैं: (1) नमो लक्ष्मी योजना, (2) सरस्वती साधना साइकिल, (3) मुख्यमंत्री ज्ञान साधना, (4) ओबीसी सहायता। कुल वार्षिक वित्तीय लाभ ₹ 25,000 + 1 मुफ्त साइकिल है!",
        },
        time: timeStr,
        richCards: [
          {
            type: "action_card",
            title: {
              gu: "૪ યોજનાઓમાં ૧-ક્લિક અરજી",
              en: "1-Click Apply to 4 Schemes",
              hi: "4 योजनाओं में 1-क्लिक आवेदन",
            },
            badge: {
              gu: "૧૦૦% પાત્રતા પ્રમાણિત",
              en: "100% Eligible Verified",
              hi: "100% पात्रता प्रमाणित",
              icon: "verified",
              className: "bg-emerald-100 text-emerald-800",
            },
            info: {
              gu: "GSRDA અને RTE ડેટાબેઝ દ્વારા ઓટો-મેચિંગ પૂર્ણ થયેલ છે.",
              en: "Auto-matching completed via GSRDA and RTE database.",
              hi: "GSRDA और RTE डेटाबेस के माध्यम से ऑटो-मैचिंग पूर्ण।",
            },
            actionLink: "/student/apply",
            actionText: {
              gu: "બધી યોજનાઓમાં એકસાથે અરજી કરો",
              en: "Apply to All Eligible Schemes",
              hi: "सभी पात्र योजनाओं में आवेदन करें",
            },
            actionIcon: "bolt",
          },
        ],
      };
    }

    if (q.includes("શિક્ષક") || q.includes("teacher") || q.includes("નોડલ") || q.includes("contact")) {
      return {
        id: `bot-${Date.now()}`,
        sender: "bot",
        text: {
          gu: "તમારી શાળા 'શ્રી સરદાર પટેલ હાઇસ્કૂલ, આણંદ' ખાતે સરકારી શિષ્યવૃત્તિ માટે નોડલ શિક્ષક શ્રી રમેશભાઈ પટેલ છે. તમે શાળા સમય (૧૧:૦૦ AM થી ૫:૦૦ PM) દરમિયાન રૂબરૂ મળી શકો છો અથવા હેલ્પલાઈન પર કૉલ કરી શકો છો.",
          en: "At your school 'Shree Sardar Patel High School, Anand', the scholarship nodal teacher is Shri Rameshbhai Patel. You can meet him during school hours (11:00 AM to 5:00 PM) or contact the state helpline.",
          hi: "आपके स्कूल 'श्री सरदार पटेल हाई स्कूल, आणंद' में छात्रवृत्ति नोडल शिक्षक श्री रमेशभाई पटेल हैं। आप स्कूल समय (11:00 AM से 5:00 PM) के दौरान मिल सकते हैं या हेल्पलाइन पर संपर्क कर सकते हैं।",
        },
        time: timeStr,
        richCards: [
          {
            type: "action_card",
            title: {
              gu: "શિક્ષણ સહાય હેલ્પલાઇન",
              en: "Education Support Helpline",
              hi: "शिक्षा सहायता हेल्पलाइन",
            },
            badge: {
              gu: "ટોલ-ફ્રી સેવા",
              en: "Toll-Free Service",
              hi: "टोल-फ्री सेवा",
              icon: "call",
              className: "bg-blue-100 text-primary font-semibold",
            },
            info: {
              gu: "ટોલ ફ્રી નંબર: 1800 233 5500 (સોમ-શનિ 10:30-18:10)",
              en: "Toll Free Number: 1800 233 5500 (Mon-Sat 10:30-18:10)",
              hi: "टोल फ्री नंबर: 1800 233 5500 (सोम-शनि 10:30-18:10)",
            },
            actionLink: "tel:18002335500",
            actionText: {
              gu: "હમણાં કૉલ કરો (1800-233-5500)",
              en: "Call Helpline (1800-233-5500)",
              hi: "अभी कॉल करें (1800-233-5500)",
            },
            actionIcon: "support_agent",
          },
        ],
      };
    }

    if (q.includes("ફરિયાદ") || q.includes("grievance") || q.includes("complain") || q.includes("સમસ્યા")) {
      return {
        id: `bot-${Date.now()}`,
        sender: "bot",
        text: {
          gu: "જો તમને શિષ્યવૃત્તિ જમા થવામાં, સાયકલ ડિલિવરીમાં કે દસ્તાવેજ ચકાસણીમાં કોઈ અડચણ હોય, તો તમે સીધી સત્તાવાર ફરિયાદ નોંધાવી શકો છો. શિક્ષણ વિભાગની ટીમ ૨૪ થી ૪૮ કલાકમાં ઉકેલ લાવશે.",
          en: "If you face any issues with scholarship DBT, cycle delivery, or document verification, you can file an official grievance. The Education Department will resolve it within 24 to 48 hours.",
          hi: "यदि आपको छात्रवृत्ति DBT, साइकिल वितरण या दस्तावेज़ सत्यापन में कोई समस्या है, तो आप आधिकारिक शिकायत दर्ज कर सकते हैं। शिक्षा विभाग 24 से 48 घंटों में समाधान करेगा।",
        },
        time: timeStr,
        richCards: [
          {
            type: "action_card",
            title: {
              gu: "ઓનલાઈન ફરિયાદ નિવારણ",
              en: "Online Grievance Redressal",
              hi: "ऑनलाइन शिकायत निवारण",
            },
            badge: {
              gu: "૪૮ કલાકમાં નિવારણ",
              en: "Resolved in 48h",
              hi: "48 घंटे में समाधान",
              icon: "gavel",
              className: "bg-amber-100 text-amber-900 font-semibold",
            },
            info: {
              gu: "ટિકિટ ID સાથે SMS ટ્રેકિંગ મળશે.",
              en: "You will receive an SMS tracking ticket ID.",
              hi: "टिकट ID के साथ SMS ट्रैकिंग प्राप्त होगी।",
            },
            actionLink: "/student/grievances",
            actionText: {
              gu: "ફરિયાદ ફોર્મ ખોલો",
              en: "Open Grievance Form",
              hi: "शिकायत फॉर्म खोलें",
            },
            actionIcon: "report_problem",
          },
        ],
      };
    }

    // Default intelligent response
    return {
      id: `bot-${Date.now()}`,
      sender: "bot",
      text: {
        gu: `મેં તમારો પ્રશ્ન "${userQueryText}" નોંધી લીધો છે. ગુજરાત શિક્ષણ વિભાગ અને વિદ્યા સમીક્ષા કેન્દ્રના નિયમો અનુસાર તમારી વિદ્યાર્થી પ્રોફાઇલ સંપૂર્ણ સુરક્ષિત છે. તમે નીચેના વિકલ્પોમાંથી સીધી વિગત મેળવી શકો છો:`,
        en: `I have received your query: "${userQueryText}". As per Gujarat Education Department and Vidya Samiksha Kendra records, your student profile is active. You can explore relevant services below:`,
        hi: `मैंने आपका प्रश्न "${userQueryText}" नोट कर लिया है। गुजरात शिक्षा विभाग और विद्या समीक्षा केंद्र के नियमों के अनुसार आपकी छात्र प्रोफ़ाइल पूरी तरह सुरक्षित है। आप नीचे दिए गए विकल्पों से अधिक विवरण प्राप्त कर सकते हैं:`,
      },
      time: timeStr,
      richCards: [
        {
          type: "action_card",
          title: {
            gu: "સરકારી યોજનાઓ & અરજી ટ્રેકર",
            en: "Government Schemes & Application Tracker",
            hi: "सरकारी योजनाएं और आवेदन ट्रैकर",
          },
          badge: {
            gu: "વિદ્યા સમીક્ષા કેન્દ્ર",
            en: "Vidya Samiksha Kendra",
            hi: "विद्या समीक्षा केंद्र",
            icon: "verified_user",
            className: "bg-emerald-100 text-emerald-800",
          },
          info: {
            gu: "તમારી બધી સક્રિય અરજીઓ અને મળવાપાત્ર રકમ અહીં તપાસો.",
            en: "Check all your active applications and disbursable amounts here.",
            hi: "अपने सभी सक्रिय आवेदन और प्राप्य राशि यहाँ जांचें।",
          },
          actionLink: "/student/applications",
          actionText: {
            gu: "અરજી ટ્રેકર જુઓ",
            en: "View Applications Tracker",
            hi: "आवेदन ट्रैकर देखें",
          },
          actionIcon: "timeline",
        },
      ],
    };
  };

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend ?? inputText).trim();
    if (!text) return;

    const now = new Date();
    const timeStr = `${now.getHours() % 12 || 12}:${String(now.getMinutes()).padStart(2, "0")} ${now.getHours() >= 12 ? "PM" : "AM"}`;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: text,
      time: timeStr,
      readStatus: true,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setIsTyping(true);

    // After 800ms show mock AI response
    setTimeout(() => {
      startTransition(() => {
        setIsTyping(false);
        const botReply = generateBotReply(text, timeStr);
        setMessages((prev) => [...prev, botReply]);
      });
    }, 800);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleVoiceInput = () => {
    showToast("સાંભળી રહ્યું છે... બોલો: 'નમો લક્ષ્મી ક્યારે મળશે?'");
    setTimeout(() => {
      setInputText("નમો લક્ષ્મી ક્યારે મળશે?");
      inputRef.current?.focus();
    }, 1200);
  };

  const handleAttachClick = () => {
    showToast("દસ્તાવેજ વૉલ્ટમાંથી ફાઇલ પસંદ કરવા રીડાયરેક્ટ કરી રહ્યું છે...");
  };

  return (
    <StudentShell>
      <div className="flex flex-col relative w-full pb-48 max-w-[430px] mx-auto min-h-[calc(100vh-3.5rem)]">
        {/* Toast Alert */}
        {toastMessage && (
          <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-on-surface text-surface px-4 py-2 rounded-full text-xs font-medium shadow-level-3 flex items-center gap-2 animate-fade-in">
            <Icon name="check_circle" size={16} className="text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* 1. Assistant Identity & Status Bar */}
        <section className="bg-surface-container-lowest px-4 py-3 shadow-xs border-b border-outline-variant">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative shrink-0">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-secondary to-primary p-0.5 flex items-center justify-center shadow-xs">
                  <div className="w-full h-full rounded-full bg-primary flex items-center justify-center font-bold text-on-primary text-sm tracking-wide">
                    VM
                  </div>
                </div>
                <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white animate-pulse" />
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h1 className="font-title-md text-title-md text-on-surface truncate">
                    <T
                      gu="વિદ્યા મિત્ર (Vidya Mitra)"
                      en="Vidya Mitra AI"
                      hi="विद्या मित्र (Vidya Mitra)"
                    />
                  </h1>
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-label-md bg-secondary-fixed text-on-secondary-fixed font-bold tracking-wider">
                    AI
                  </span>
                </div>
                <p className="font-caption text-caption text-on-surface-variant truncate">
                  <T
                    gu="AI સહાયક • સરકારી શિષ્યવૃત્તિ સહાય"
                    en="AI Assistant • Govt Scholarship Support"
                    hi="AI सहायक • सरकारी छात्रवृत्ति सहायता"
                  />
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <a
                href="tel:18002335500"
                aria-label="Toll Free Helpline"
                title="Toll Free Helpline: 1800 233 5500"
                className="w-9 h-9 rounded-full bg-surface-container-low flex items-center justify-center text-primary hover:bg-surface-container transition-colors shadow-xs"
              >
                <Icon name="support_agent" size={20} />
              </a>
            </div>
          </div>

          {/* Student Mini Context Banner (Dismissible) */}
          {showStudentBanner && (
            <div className="mt-2.5 rounded-xl bg-surface-container-low p-2.5 flex items-center justify-between gap-2 border border-outline-variant animate-fade-in">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-surface-container-highest flex items-center justify-center shrink-0 text-primary">
                  <Icon name="badge" size={18} />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-label-md text-label-md text-on-surface font-bold truncate">
                      <T gu="રિયા પટેલ" en="Riya Patel" hi="रिया पटेल" />
                    </span>
                    <span className="font-caption text-caption text-on-surface-variant">
                      <T
                        gu="ધોરણ ૯-બી • CTS: GJ-AND-2026-004512"
                        en="Class 9-B • CTS: GJ-AND-2026-004512"
                        hi="कक्षा 9-बी • CTS: GJ-AND-2026-004512"
                      />
                    </span>
                  </div>
                  <p className="font-caption text-caption text-secondary font-medium truncate">
                    <T
                      gu="૪ સક્રિય અરજીઓ • ૧ સાયકલ ટ્રાન્ઝિટમાં (તૈયાર)"
                      en="4 Active Applications • 1 Cycle Ready"
                      hi="4 सक्रिय आवेदन • 1 साइकिल तैयार"
                    />
                  </p>
                </div>
              </div>
              <button
                type="button"
                aria-label="Dismiss banner"
                onClick={() => setShowStudentBanner(false)}
                className="text-on-surface-variant hover:text-on-surface p-1 rounded-full shrink-0 transition-colors"
              >
                <Icon name="close" size={16} />
              </button>
            </div>
          )}
        </section>

        {/* 2. Chat Stream Container */}
        <section className="flex flex-col px-4 py-4 space-y-4">
          {messages.map((msg) => {
            if (msg.sender === "user") {
              // User message bubble (Right-aligned, primary blue)
              return (
                <div
                  key={msg.id}
                  className="flex flex-col items-end self-end max-w-[85%] animate-fade-in"
                >
                  <div className="rounded-2xl rounded-tr-sm bg-primary text-on-primary p-3.5 shadow-xs">
                    <p className="font-body-sm text-body-sm leading-relaxed whitespace-pre-wrap">
                      {typeof msg.text === "string" ? (
                        msg.text
                      ) : msg.text ? (
                        <T gu={msg.text.gu} en={msg.text.en} hi={msg.text.hi} />
                      ) : null}
                    </p>
                  </div>
                  <span className="font-caption text-[11px] text-on-surface-variant mt-1 mr-1 flex items-center gap-1">
                    <span>{msg.time}</span>
                    {msg.readStatus && (
                      <>
                        <span>•</span>
                        <span className="text-primary font-medium">
                          <T gu="વંચાઈ ગયું" en="Read" hi="पढ़ा गया" />
                        </span>
                      </>
                    )}
                  </span>
                </div>
              );
            }

            // Bot message bubble (Left-aligned, bg-surface-container-lowest)
            return (
              <div
                key={msg.id}
                className="flex items-start gap-2.5 max-w-[96%] animate-fade-in"
              >
                {/* Bot Avatar: 'VM' initials in primary circle */}
                <div className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-xs shrink-0 shadow-xs mt-0.5">
                  VM
                </div>

                <div className="flex flex-col w-full space-y-2">
                  <div className="rounded-2xl rounded-tl-sm bg-surface-container-lowest border border-outline-variant p-3.5 shadow-xs text-on-surface">
                    {msg.text && (
                      <p className="font-body-sm text-body-sm leading-relaxed mb-1">
                        {typeof msg.text === "string" ? (
                          msg.text
                        ) : (
                          <T gu={msg.text.gu} en={msg.text.en} hi={msg.text.hi} />
                        )}
                      </p>
                    )}

                    {/* Rich Cards (if any) */}
                    {msg.richCards && msg.richCards.length > 0 && (
                      <div className="space-y-2.5 mt-2.5">
                        {msg.richCards.map((card, idx) => {
                          if (card.type === "recommendation") {
                            return (
                              <div
                                key={idx}
                                className="rounded-xl bg-gradient-to-r from-surface-container-high to-surface-container-low p-3.5 border border-outline-variant shadow-xs"
                              >
                                {card.badge && (
                                  <div className="flex items-center gap-1 mb-1">
                                    <Icon
                                      name={card.badge.icon}
                                      size={14}
                                      className="text-secondary"
                                    />
                                    <span className="text-[11px] font-label-md text-secondary font-bold">
                                      <T
                                        gu={card.badge.gu}
                                        en={card.badge.en}
                                        hi={card.badge.hi}
                                      />
                                    </span>
                                  </div>
                                )}

                                {card.title && (
                                  <h4 className="font-title-md text-title-md text-on-surface font-bold">
                                    <T
                                      gu={card.title.gu}
                                      en={card.title.en}
                                      hi={card.title.hi}
                                    />
                                  </h4>
                                )}

                                {card.amount && (
                                  <div className="my-2 flex items-baseline gap-1.5">
                                    <span className="font-title-lg text-title-lg text-primary font-bold">
                                      {card.amount}
                                    </span>
                                    {card.amountLabel && (
                                      <span className="font-caption text-caption text-on-surface-variant">
                                        <T
                                          gu={card.amountLabel.gu}
                                          en={card.amountLabel.en}
                                          hi={card.amountLabel.hi}
                                        />
                                      </span>
                                    )}
                                  </div>
                                )}

                                {card.tip && (
                                  <div className="p-2.5 bg-surface-container-lowest rounded-lg mb-2.5 border border-outline-variant">
                                    <p className="font-caption text-caption text-on-surface leading-snug">
                                      ⚠️{" "}
                                      <strong className="text-on-surface font-bold">
                                        <T
                                          gu="મહત્વપૂર્ણ ટીપ: "
                                          en="Important Tip: "
                                          hi="महत्वपूर्ण सुझाव: "
                                        />
                                      </strong>
                                      <T
                                        gu={card.tip.gu}
                                        en={card.tip.en}
                                        hi={card.tip.hi}
                                      />
                                    </p>
                                  </div>
                                )}

                                {card.actionLink && card.actionText && (
                                  <Link
                                    href={card.actionLink}
                                    className="w-full py-2 px-3 rounded-lg bg-primary-fixed text-on-primary-fixed font-label-md text-label-md font-semibold flex items-center justify-center gap-1.5 hover:bg-primary hover:text-on-primary transition-colors shadow-xs"
                                  >
                                    <span>
                                      <T
                                        gu={card.actionText.gu}
                                        en={card.actionText.en}
                                        hi={card.actionText.hi}
                                      />
                                    </span>
                                    <Icon
                                      name={card.actionIcon || "arrow_forward"}
                                      size={15}
                                    />
                                  </Link>
                                )}
                              </div>
                            );
                          }

                          // Default status / action card (Namo Lakshmi, Cycle, OBC)
                          return (
                            <div
                              key={idx}
                              className="rounded-xl bg-surface-container-low p-3 border border-outline-variant"
                            >
                              <div className="flex items-start justify-between gap-2 mb-2">
                                <div className="flex items-center gap-2">
                                  <div className="w-7 h-7 rounded-lg bg-surface-container-lowest flex items-center justify-center shadow-xs text-primary shrink-0">
                                    <Icon
                                      name={
                                        card.otp
                                          ? "pedal_bike"
                                          : card.actionIcon === "payments"
                                          ? "account_balance"
                                          : card.badge?.icon || "account_balance"
                                      }
                                      size={18}
                                      className={card.otp ? "text-secondary" : "text-primary"}
                                    />
                                  </div>
                                  <div className="min-w-0">
                                    {card.title && (
                                      <h3 className="font-label-lg text-label-lg text-on-surface font-bold leading-tight">
                                        <T
                                          gu={card.title.gu}
                                          en={card.title.en}
                                          hi={card.title.hi}
                                        />
                                      </h3>
                                    )}
                                    {card.subtitle && (
                                      <p className="font-caption text-caption text-on-surface-variant truncate">
                                        <T
                                          gu={card.subtitle.gu}
                                          en={card.subtitle.en}
                                          hi={card.subtitle.hi}
                                        />
                                      </p>
                                    )}
                                  </div>
                                </div>

                                {card.badge && (
                                  <span
                                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-label-md font-semibold shrink-0 ${card.badge.className}`}
                                  >
                                    <Icon name={card.badge.icon} size={13} />
                                    <span>
                                      <T
                                        gu={card.badge.gu}
                                        en={card.badge.en}
                                        hi={card.badge.hi}
                                      />
                                    </span>
                                  </span>
                                )}
                              </div>

                              <div className="bg-surface-container-lowest rounded-lg p-2.5 space-y-1.5 text-on-surface border border-outline-variant/60">
                                {card.amount && (
                                  <div className="flex justify-between items-center text-[13px]">
                                    <span className="text-on-surface-variant font-caption text-caption">
                                      {card.amountLabel ? (
                                        <T
                                          gu={card.amountLabel.gu}
                                          en={card.amountLabel.en}
                                          hi={card.amountLabel.hi}
                                        />
                                      ) : (
                                        <T
                                          gu="પ્રથમ હપ્તો:"
                                          en="Installment:"
                                          hi="किस्त:"
                                        />
                                      )}
                                    </span>
                                    <span className="font-label-md text-label-md text-primary font-bold">
                                      {card.amount}
                                    </span>
                                  </div>
                                )}

                                {card.info && (
                                  <p className="font-caption text-caption text-on-surface-variant leading-relaxed">
                                    <T
                                      gu={card.info.gu}
                                      en={card.info.en}
                                      hi={card.info.hi}
                                    />
                                  </p>
                                )}

                                {card.subInfo && (
                                  <div className="pt-1 flex items-center gap-1.5 text-emerald-700 font-caption text-caption font-medium">
                                    <Icon name="schedule" size={14} />
                                    <span>
                                      <T
                                        gu={card.subInfo.gu}
                                        en={card.subInfo.en}
                                        hi={card.subInfo.hi}
                                      />
                                    </span>
                                  </div>
                                )}

                                {/* OTP Display & Copy Button */}
                                {card.otp && (
                                  <div className="pt-1 space-y-2">
                                    <div className="flex items-center justify-between bg-surface-container-low px-2.5 py-1.5 rounded-lg border border-outline-variant/70">
                                      <span className="font-caption text-caption text-on-surface-variant">
                                        <T
                                          gu="ડિલિવરી OTP:"
                                          en="Delivery OTP:"
                                          hi="वितरण OTP:"
                                        />
                                      </span>
                                      <div className="flex items-center gap-1.5">
                                        <span className="font-mono text-title-md font-bold tracking-widest text-primary">
                                          {card.otp}
                                        </span>
                                        <button
                                          type="button"
                                          onClick={() => handleCopyOtp(card.otp)}
                                          title="Copy OTP"
                                          className="text-on-surface-variant hover:text-primary p-1 transition-colors"
                                        >
                                          <Icon
                                            name={copiedOtp ? "check" : "content_copy"}
                                            size={14}
                                          />
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                )}

                                {/* Action button */}
                                {card.actionLink && card.actionText && (
                                  <div className="pt-1">
                                    {card.actionLink.startsWith("tel:") ? (
                                      <a
                                        href={card.actionLink}
                                        className="w-full py-2 px-3 rounded-lg bg-primary text-on-primary font-label-md text-label-md flex items-center justify-center gap-1.5 shadow-xs active:scale-[0.98] transition-all font-semibold"
                                      >
                                        <Icon
                                          name={card.actionIcon || "call"}
                                          size={16}
                                        />
                                        <span>
                                          <T
                                            gu={card.actionText.gu}
                                            en={card.actionText.en}
                                            hi={card.actionText.hi}
                                          />
                                        </span>
                                      </a>
                                    ) : (
                                      <Link
                                        href={card.actionLink}
                                        className="w-full py-2 px-3 rounded-lg bg-secondary text-on-secondary font-label-md text-label-md flex items-center justify-center gap-1.5 shadow-xs active:scale-[0.98] transition-all font-semibold hover:brightness-105"
                                      >
                                        <Icon
                                          name={card.actionIcon || "arrow_forward"}
                                          size={16}
                                        />
                                        <span>
                                          <T
                                            gu={card.actionText.gu}
                                            en={card.actionText.en}
                                            hi={card.actionText.hi}
                                          />
                                        </span>
                                      </Link>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  <span className="font-caption text-[11px] text-on-surface-variant ml-1">
                    {msg.time}
                  </span>
                </div>
              </div>
            );
          })}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex items-start gap-2.5 max-w-[85%] animate-fade-in">
              <div className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-xs shrink-0 shadow-xs mt-0.5">
                VM
              </div>
              <div className="rounded-2xl rounded-tl-sm bg-surface-container-lowest border border-outline-variant p-3 shadow-xs flex items-center gap-2">
                <span className="font-caption text-xs text-on-surface-variant">
                  <T
                    gu="વિદ્યા મિત્ર વિચારી રહ્યો છે..."
                    en="Vidya Mitra is typing..."
                    hi="विद्या मित्र सोच रहा है..."
                  />
                </span>
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" />
                </div>
              </div>
            </div>
          )}

          {/* Official Advisory Note (Disclaimer that AI is not official advice) */}
          <div className="rounded-xl bg-surface-container-low p-3 flex items-start gap-2.5 border border-outline-variant shadow-xs mt-2">
            <Icon
              name="verified_user"
              size={18}
              className="text-outline shrink-0 mt-0.5"
            />
            <p className="font-caption text-caption text-on-surface-variant leading-relaxed">
              <strong className="text-on-surface font-bold">
                <T
                  gu="સત્તાવાર નોંધ: "
                  en="Official Advisory: "
                  hi="आधिकारिक सलाह: "
                />
              </strong>
              <T
                gu="વિદ્યા મિત્ર AI માર્ગદર્શન માટે છે. અંતિમ ચકાસણી શાળાના આચાર્ય અને જિલ્લા શિક્ષણ અધિકારી (DEO કચેરી, આણંદ) દ્વારા માન્ય થાય છે."
                en="Vidya Mitra AI is for guidance only. Final verification is approved by the School Principal and District Education Officer (DEO Office, Anand)."
                hi="विद्या मित्र AI मार्गदर्शन के लिए है। अंतिम सत्यापन स्कूल के प्रधानाचार्य और जिला शिक्षा अधिकारी (DEO कार्यालय, आणंद) द्वारा मान्य होता है।"
              />
            </p>
          </div>

          <div ref={messagesEndRef} />
        </section>

        {/* 3. Bottom Fixed Area: Suggested Interactive Quick Actions + Chat Input */}
        <section className="fixed bottom-16 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-30 bg-surface/95 backdrop-blur-md border-t border-outline-variant shadow-level-2">
          {/* Quick-reply chip bar */}
          <div className="pt-2">
            <div className="px-4 mb-1.5 flex items-center justify-between">
              <span className="font-label-md text-xs text-on-surface-variant font-medium">
                <T
                  gu="વારંવાર પૂછાતા પ્રશ્નો:"
                  en="Suggested Questions:"
                  hi="अक्सर पूछे जाने वाले प्रश्न:"
                />
              </span>
              <span className="font-caption text-[11px] text-primary flex items-center gap-0.5 font-semibold">
                <Icon name="tune" size={13} />
                <T gu="વિકલ્પો" en="Options" hi="विकल्प" />
              </span>
            </div>

            <div className="flex gap-2 px-4 overflow-x-auto pb-2 scrollbar-none no-scrollbar">
              {quickReplies.map((chip) => (
                <button
                  key={chip.id}
                  type="button"
                  onClick={() => handleSendMessage(chip.gu)}
                  className="shrink-0 px-3 py-1.5 rounded-full bg-surface-container-lowest border border-outline-variant/80 shadow-xs text-on-surface font-label-md text-xs flex items-center gap-1.5 active:bg-surface-container-high hover:border-primary/50 transition-all cursor-pointer whitespace-nowrap"
                >
                  <Icon name={chip.icon} size={14} className={chip.color} />
                  <span>
                    <T gu={chip.gu} en={chip.en} hi={chip.hi} />
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Multilingual Interactive Chat Input Bar */}
          <div className="px-4 py-2 bg-surface-container-lowest border-t border-outline-variant/60 shadow-xs">
            <div className="flex items-center gap-2">
              {/* Attach File Button */}
              <button
                type="button"
                aria-label="Attach File"
                title="Attach Document from Vault"
                onClick={handleAttachClick}
                className="w-10 h-10 rounded-full bg-surface-container-low text-on-surface flex items-center justify-center shrink-0 hover:bg-surface-container active:scale-95 transition-transform"
              >
                <Icon name="attach_file" size={20} />
              </button>

              {/* Text Input */}
              <div className="flex-1 flex items-center bg-surface-container-low rounded-full px-3 py-1 gap-2 border border-outline-variant/60 focus-within:border-primary transition-colors">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  aria-label="તમારો પ્રશ્ન લખો"
                  placeholder="તમારો પ્રશ્ન અહીં લખો અથવા બોલો..."
                  className="w-full bg-transparent text-on-surface font-body-sm text-body-sm placeholder:text-outline focus:outline-none py-1.5"
                />

                {/* Voice Input Button */}
                <button
                  type="button"
                  aria-label="Voice Input Gujarati"
                  title="Voice Input (Gujarati)"
                  onClick={handleVoiceInput}
                  className="relative w-8 h-8 rounded-full bg-surface-container-highest text-secondary flex items-center justify-center shrink-0 active:scale-90 transition-transform"
                >
                  <Icon name="mic" size={18} />
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-secondary animate-ping" />
                </button>
              </div>

              {/* Send Message Button */}
              <button
                type="button"
                aria-label="Send Message"
                title="Send Message"
                disabled={!inputText.trim()}
                onClick={() => handleSendMessage()}
                className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-xs transition-all ${
                  inputText.trim()
                    ? "bg-primary text-on-primary hover:bg-primary-container active:scale-95 cursor-pointer"
                    : "bg-surface-container-high text-outline cursor-not-allowed"
                }`}
              >
                <Icon name="send" size={18} fill />
              </button>
            </div>

            {/* Bottom Security Trust Note */}
            <div className="mt-1.5 flex items-center justify-center gap-1 text-[10px] text-outline font-caption truncate">
              <Icon name="security" size={12} className="text-primary" />
              <span>
                <T
                  gu="સુરક્ષિત સરકારી પોર્ટલ • ડેટા ગુજરાત શિક્ષણ વિભાગ સાથે સંરક્ષિત"
                  en="Secure Govt Portal • Data protected with Gujarat Education Department"
                  hi="सुरक्षित सरकारी पोर्टल • डेटा गुजरात शिक्षा विभाग के साथ सुरक्षित"
                />
              </span>
            </div>
          </div>
        </section>
      </div>
    </StudentShell>
  );
}
