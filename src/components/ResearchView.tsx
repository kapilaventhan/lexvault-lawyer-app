import React, { useState, useEffect } from "react";
import { Case } from "../types";
import { 
  LEGAL_CATEGORIES, 
  STATUTORY_SECTIONS, 
  CASE_LAWS, 
  StatutorySection, 
  CaseLaw, 
  LegalCategory 
} from "../data/legalPrecedents";
import Markdown from "react-markdown";
import { 
  Search, 
  Bookmark, 
  NotebookTabs, 
  Download, 
  Share2, 
  Sparkles, 
  BookMarked,
  Scale, 
  ExternalLink, 
  FileText, 
  HelpCircle,
  Clock, 
  Heart, 
  ShieldAlert, 
  Home, 
  Building2, 
  ShoppingBag, 
  Users2, 
  Percent, 
  Lightbulb, 
  Globe,
  PlusCircle,
  X,
  RefreshCw,
  StickyNote,
  ChevronRight,
  BookmarkCheck,
  Check,
  Trash2
} from "lucide-react";

interface ResearchViewProps {
  cases: Case[];
}

export default function ResearchView({ cases }: ResearchViewProps) {
  // Navigation / Filter States
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  // Search state
  const [searchTerm, setSearchTerm] = useState("");
  const [searchSectionNumber, setSearchSectionNumber] = useState("");
  const [searchCourt, setSearchCourt] = useState("");
  const [searchCategoryDropdown, setSearchCategoryDropdown] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchJudgeName, setSearchJudgeName] = useState("");
  const [searchCitation, setSearchCitation] = useState("");
  const [searchYear, setSearchYear] = useState("");

  // Live Repository & Custom Index State
  const [repositorySections, setRepositorySections] = useState<StatutorySection[]>([]);
  const [repositoryCaseLaws, setRepositoryCaseLaws] = useState<CaseLaw[]>([]);
  const [isSearchingRepository, setIsSearchingRepository] = useState(false);
  const [useLiveRepositoryFlag, setUseLiveRepositoryFlag] = useState(false);
  const [repositoryMessage, setRepositoryMessage] = useState<string | null>(null);

  // Custom user-added index states
  const [customSections, setCustomSections] = useState<StatutorySection[]>([]);
  const [customCaseLaws, setCustomCaseLaws] = useState<CaseLaw[]>([]);
  const [isCustomLoading, setIsCustomLoading] = useState(false);

  // Forms for adding custom Records
  const [showAddCustomModal, setShowAddCustomModal] = useState<"section" | "caselaw" | null>(null);
  
  // Custom Statutory Form State
  const [newActName, setNewActName] = useState("");
  const [newSectionNumber, setNewSectionNumber] = useState("");
  const [newSectionTitle, setNewSectionTitle] = useState("");
  const [newSectionDesc, setNewSectionDesc] = useState("");
  const [newSectionKeywords, setNewSectionKeywords] = useState("");
  const [newSectionCategory, setNewSectionCategory] = useState("Corporate");
  const [newChapterName, setNewChapterName] = useState("");
  const [newExplanations, setNewExplanations] = useState("");
  const [newAmendments, setNewAmendments] = useState("");

  // Custom Case Form State
  const [newCaseName, setNewCaseName] = useState("");
  const [newCaseCitation, setNewCaseCitation] = useState("");
  const [newCaseCourt, setNewCaseCourt] = useState("");
  const [newCaseDate, setNewCaseDate] = useState("");
  const [newCaseJudge, setNewCaseJudge] = useState("");
  const [newCaseSummary, setNewCaseSummary] = useState("");
  const [newCasePrinciples, setNewCasePrinciples] = useState("");
  const [newCaseAppSections, setNewCaseAppSections] = useState("");
  const [newCasePrecedents, setNewCasePrecedents] = useState("");
  const [newCaseCategory, setNewCaseCategory] = useState("Corporate");
  const [newCaseIsLandmark, setNewCaseIsLandmark] = useState(true);

  // Bookmark / Save list states (Loaded from localStorage)
  const [bookmarkedCases, setBookmarkedCases] = useState<string[]>([]);
  const [savedSections, setSavedSections] = useState<string[]>([]);
  const [caseNotes, setCaseNotes] = useState<{ [key: string]: string }>({});

  // Active viewing panels / modal triggers
  const [activeTab, setActiveTab] = useState<"database" | "ai-engine" | "notebook">("database");
  const [selectedSectionForDetail, setSelectedSectionForDetail] = useState<StatutorySection | null>(null);
  const [selectedCaseForDetail, setSelectedCaseForDetail] = useState<CaseLaw | null>(null);
  
  // AI Recommendation engine state
  const [recommendationCategory, setRecommendationCategory] = useState("Corporate");
  const [recommendationTiedCase, setRecommendationTiedCase] = useState("");
  const [customSituationText, setCustomSituationText] = useState("");
  const [recommendationResult, setRecommendationResult] = useState("");
  const [isLoadingRecommendation, setIsLoadingRecommendation] = useState(false);
  const [copiedNotification, setCopiedNotification] = useState<string | null>(null);

  // Fetch custom database tables
  const fetchCustomData = async () => {
    try {
      setIsCustomLoading(true);
      const [secRes, caseRes] = await Promise.all([
        fetch("/api/research/custom-statutory"),
        fetch("/api/research/custom-cases")
      ]);
      if (secRes.ok && caseRes.ok) {
        setCustomSections(await secRes.json());
        setCustomCaseLaws(await caseRes.json());
      }
    } catch (err) {
      console.error("Failed fetching custom indexed data", err);
    } finally {
      setIsCustomLoading(false);
    }
  };

  // Load localStorage states and custom DB data on mount
  useEffect(() => {
    fetchCustomData();
    try {
      const storedCases = localStorage.getItem("legal_bookmarked_cases");
      const storedSecs = localStorage.getItem("legal_saved_sections");
      const storedNotes = localStorage.getItem("legal_case_notes");

      if (storedCases) setBookmarkedCases(JSON.parse(storedCases));
      if (storedSecs) setSavedSections(JSON.parse(storedSecs));
      if (storedNotes) setCaseNotes(JSON.parse(storedNotes));
    } catch (e) {
      console.error("Failed to read local storage preferences", e);
    }
  }, []);

  // Helper to persist bookmarks
  const toggleCaseBookmark = (caseId: string) => {
    let next;
    if (bookmarkedCases.includes(caseId)) {
      next = bookmarkedCases.filter(id => id !== caseId);
    } else {
      next = [...bookmarkedCases, caseId];
    }
    setBookmarkedCases(next);
    localStorage.setItem("legal_bookmarked_cases", JSON.stringify(next));
    showCopiedBanner(bookmarkedCases.includes(caseId) ? "Bookmark removed." : "Added case law to private bookmarks ledger!");
  };

  const toggleSectionSave = (secId: string) => {
    let next;
    if (savedSections.includes(secId)) {
      next = savedSections.filter(id => id !== secId);
    } else {
      next = [...savedSections, secId];
    }
    setSavedSections(next);
    localStorage.setItem("legal_saved_sections", JSON.stringify(next));
    showCopiedBanner(savedSections.includes(secId) ? "Removed from saved sections." : "Successfully saved statutory section!");
  };

  const savePersonalNote = (caseId: string, noteText: string) => {
    const next = { ...caseNotes, [caseId]: noteText };
    setCaseNotes(next);
    localStorage.setItem("legal_case_notes", JSON.stringify(next));
    showCopiedBanner("Personal legal counsel notes updated successfully!");
  };

  const showCopiedBanner = (msg: string) => {
    setCopiedNotification(msg);
    setTimeout(() => {
      setCopiedNotification(null);
    }, 2500);
  };

  // CRUD actions for user-added / indexed Acts and Precedents
  const handleAddCustomSection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newActName || !newSectionNumber || !newSectionTitle || !newSectionDesc) {
      showCopiedBanner("Please fill in all required statutory fields.");
      return;
    }
    try {
      const res = await fetch("/api/research/custom-statutory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          actName: newActName,
          sectionNumber: newSectionNumber,
          title: newSectionTitle,
          description: newSectionDesc,
          keyKeywords: newSectionKeywords.split(",").map(k => k.trim()).filter(Boolean),
          category: newSectionCategory,
          chapterName: newChapterName || undefined,
          explanationsProvisos: newExplanations || undefined,
          amendmentsNotifications: newAmendments || undefined
        })
      });
      if (res.ok) {
        showCopiedBanner("Successfully indexed new statutory section in repository!");
        setNewActName("");
        setNewSectionNumber("");
        setNewSectionTitle("");
        setNewSectionDesc("");
        setNewSectionKeywords("");
        setNewChapterName("");
        setNewExplanations("");
        setNewAmendments("");
        setShowAddCustomModal(null);
        await fetchCustomData();
      } else {
        throw new Error();
      }
    } catch (err) {
      showCopiedBanner("Failed to index statutory section. Check server state.");
    }
  };

  const handleAddCustomCase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCaseName || !newCaseCitation || !newCaseCourt || !newCaseSummary) {
      showCopiedBanner("Please fill in all required fields.");
      return;
    }
    try {
      const res = await fetch("/api/research/custom-cases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          caseName: newCaseName,
          citation: newCaseCitation,
          court: newCaseCourt,
          judgmentDate: newCaseDate || new Date().toISOString().split("T")[0],
          judgeName: newCaseJudge || undefined,
          summary: newCaseSummary,
          keyPrinciples: newCasePrinciples.split("\n").map(l => l.trim()).filter(Boolean),
          applicableSections: newCaseAppSections.split(",").map(s => s.trim()).filter(Boolean),
          relatedPrecedents: newCasePrecedents.split(",").map(p => p.trim()).filter(Boolean),
          category: newCaseCategory,
          isLandmark: newCaseIsLandmark
        })
      });
      if (res.ok) {
        showCopiedBanner("Successfully indexed landmark judicial precedent!");
        setNewCaseName("");
        setNewCaseCitation("");
        setNewCaseCourt("");
        setNewCaseDate("");
        setNewCaseJudge("");
        setNewCaseSummary("");
        setNewCasePrinciples("");
        setNewCaseAppSections("");
        setNewCasePrecedents("");
        setShowAddCustomModal(null);
        await fetchCustomData();
      } else {
        throw new Error();
      }
    } catch (err) {
      showCopiedBanner("Failed to save precedent case. Check system.");
    }
  };

  const handleDeleteCustomSection = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const res = await fetch(`/api/research/custom-statutory/${id}`, { method: "DELETE" });
      if (res.ok) {
        showCopiedBanner("Successfully deregistured custom statutory section.");
        await fetchCustomData();
      }
    } catch (err) {
      showCopiedBanner("Deletion action rejected.");
    }
  };

  const handleDeleteCustomCase = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const res = await fetch(`/api/research/custom-cases/${id}`, { method: "DELETE" });
      if (res.ok) {
        showCopiedBanner("Successfully purged custom case precedent record.");
        await fetchCustomData();
      }
    } catch (err) {
      showCopiedBanner("purging action failed.");
    }
  };

  // Real-time AI Complete Indian Legal Repository search action
  const handleRepositorySearch = async () => {
    try {
      setIsSearchingRepository(true);
      setRepositoryMessage(null);
      setRepositorySections([]);
      setRepositoryCaseLaws([]);

      const res = await fetch("/api/research/search-repository", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: selectedCategory || searchCategoryDropdown || undefined,
          searchTerm: searchTerm || undefined,
          sectionNumber: searchSectionNumber || undefined,
          court: searchCourt || undefined,
          citation: searchCitation || undefined,
          year: searchYear || undefined,
          judgeName: searchJudgeName || undefined,
          keyword: searchKeyword || undefined
        })
      });

      if (!res.ok) {
        throw new Error("Web network server offline or index query failed.");
      }

      const data = await res.json();
      if (data.isSandboxMode) {
        setRepositoryMessage(data.message || "Live repository search requires a real GEMINI_API_KEY.");
      } else {
        setRepositorySections(data.statutorySections || []);
        setRepositoryCaseLaws(data.caseLaws || []);
        showCopiedBanner(`Retrieved ${data.statutorySections?.length || 0} statutes and ${data.caseLaws?.length || 0} precedents from complete live database!`);
      }
    } catch (err) {
      console.error(err);
      setRepositoryMessage("Failed crawling complete Indian legal index databases. Please check system key configs.");
    } finally {
      setIsSearchingRepository(false);
    }
  };

  const fallbackCopyText = (text: string) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.opacity = "0";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand("copy");
    } catch (err) {
      console.error("Fallback copy failed", err);
    }
    document.body.removeChild(textArea);
  };

  // Virtual brief downloader
  const downloadCaseBrief = (caseLaw: CaseLaw) => {
    const note = caseNotes[caseLaw.id] || "No personal notes logged yet.";
    const textContent = `======================================================================
CONFIDENTIAL LAW RESEARCH LEGAL STANDING BRIEF
Generated at: ${new Date().toLocaleDateString()}
======================================================================

CASE LAW CITATION:  ${caseLaw.caseName} [${caseLaw.citation}]
COURT VENUE:        ${caseLaw.court}
JUDGMENT ADJUDICATED DATE:  ${caseLaw.judgmentDate}
CATEGORY OF JURISPRIDENCE:  ${caseLaw.category} Law

----------------------------------------------------------------------
1. CASE EXECUTIVE DISPUTE SYNOPSIS:
----------------------------------------------------------------------
${caseLaw.summary}

----------------------------------------------------------------------
2. FUNDAMENTAL RATIO & KEY LEGAL PRINCIPLES:
----------------------------------------------------------------------
${caseLaw.keyPrinciples.map((p, idx) => `   * [P-${idx + 1}] ${p}`).join("\n")}

----------------------------------------------------------------------
3. CROSS-REFERENCED STATUTES & APPLICABLE CODES:
----------------------------------------------------------------------
${caseLaw.applicableSections.join("\n")}

----------------------------------------------------------------------
4. RELEVANT PRECEDENTS OR SIMILAR CASES:
----------------------------------------------------------------------
${caseLaw.relatedPrecedents.join("\n")}

----------------------------------------------------------------------
5. LAWYER'S PRIVATE ASSESSMENT NOTES:
----------------------------------------------------------------------
${note}

======================================================================
DossierLegal - System Consolidated Portal. Confidential Use Only.
======================================================================`;

    try {
      const file = new Blob([textContent], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(file);
      const element = document.createElement("a");
      element.setAttribute("href", url);
      element.setAttribute("download", `${caseLaw.caseName.replace(/\s+/g, "_")}_Brief.txt`);
      element.style.display = "none";
      document.body.appendChild(element);
      element.click();
      setTimeout(() => {
        document.body.removeChild(element);
        URL.revokeObjectURL(url);
      }, 100);

      try {
        if (navigator.clipboard) {
          navigator.clipboard.writeText(textContent);
        } else {
          fallbackCopyText(textContent);
        }
        showCopiedBanner("Brief downloaded! Also copied to clipboard as fallback.");
      } catch (clipErr) {
        showCopiedBanner("Case Summary text brief successfully generated & downloaded!");
      }
    } catch (err) {
      console.error("Download blocked or failed, using robust clipboard fallback: ", err);
      try {
        if (navigator.clipboard) {
          navigator.clipboard.writeText(textContent);
        } else {
          fallbackCopyText(textContent);
        }
        showCopiedBanner("Download blocked inside sandbox. Brief copied to clipboard!");
      } catch (clipboardErr) {
        showCopiedBanner("Unable to download or copy. Please view or copy directly.");
      }
    }
  };

  const shareCaseSummary = (caseLaw: CaseLaw) => {
    const shareText = `⚖️ *LEGAL PRECEDENT BRIEFING* ⚖️\n\n*Case*: ${caseLaw.caseName}\n*Citation*: ${caseLaw.citation}\n*Court*: ${caseLaw.court}\n*Date*: ${caseLaw.judgmentDate}\n\n*Key Principle*: ${caseLaw.keyPrinciples[0] || "N/A"}\n\n*Summary*: ${caseLaw.summary}\n\n_Retrieved via DocketLegal Portal_`;
    try {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(shareText);
      } else {
        fallbackCopyText(shareText);
      }
      showCopiedBanner("Copied formatted litigation briefing to clipboard!");
    } catch (e) {
      fallbackCopyText(shareText);
      showCopiedBanner("Copied formatted litigation briefing to clipboard!");
    }
  };

  // Cross reference handler: click a cross ref to select that section/law
  const handleCrossRefClick = (sectionText: string) => {
    // Attempt to match text with any section number or act name
    const found = STATUTORY_SECTIONS.find(item => 
      sectionText.toLowerCase().includes(item.sectionNumber.toLowerCase()) || 
      item.sectionNumber.toLowerCase().includes(sectionText.toLowerCase())
    );
    if (found) {
      setSelectedSectionForDetail(found);
      setSelectedCategory(found.id.split("-")[1].toUpperCase()); // Match category from id (sec-fam-1)
    } else {
      showCopiedBanner(`Navigating code database regarding: ${sectionText}`);
      setSearchTerm(sectionText);
      setSelectedCategory(null);
    }
  };

  // AI Precedents suggestions engine trigger
  const handleRequestAIRecommendation = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoadingRecommendation(true);
      setRecommendationResult("");

      // Find matching case description if selected
      const matchedCaseObj = cases.find(c => c.id === recommendationTiedCase);

      const res = await fetch("/api/ai/recommend-laws", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: recommendationCategory,
          caseTitle: matchedCaseObj ? matchedCaseObj.title : undefined,
          caseDescription: matchedCaseObj ? matchedCaseObj.description : undefined,
          customSituation: customSituationText || undefined
        })
      });

      if (!res.ok) {
        throw new Error("Precedent recommendation query timed out.");
      }

      const data = await res.json();
      setRecommendationResult(data.recommendation);
    } catch (err) {
      console.error(err);
      setRecommendationResult("### ERROR GENERATING AI LITIGATION PATHWAY\n\nUnable to reach server-side analytical reasoning models. Please check your system endpoints.");
    } finally {
      setIsLoadingRecommendation(false);
    }
  };

  // Render Category specific Icons
  const renderCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case "Heart": return <Heart className="h-5 w-5 text-rose-500 shrink-0" />;
      case "ShieldAlert": return <ShieldAlert className="h-5 w-5 text-red-500 shrink-0" />;
      case "Balance": return <Scale className="h-5 w-5 text-indigo-500 shrink-0" />;
      case "Home": return <Home className="h-5 w-5 text-emerald-500 shrink-0" />;
      case "Building": return <Building2 className="h-5 w-5 text-blue-500 shrink-0" />;
      case "ShoppingBag": return <ShoppingBag className="h-5 w-5 text-amber-500 shrink-0" />;
      case "Users2": return <Users2 className="h-5 w-5 text-teal-500 shrink-0" />;
      case "Percent": return <Percent className="h-5 w-5 text-purple-500 shrink-0" />;
      case "Lightbulb": return <Lightbulb className="h-5 w-5 text-orange-500 shrink-0" />;
      case "Globe": return <Globe className="h-5 w-5 text-sky-500 shrink-0" />;
      default: return <FileText className="h-5 w-5 text-slate-500 shrink-0" />;
    }
  };

  // Search filter logic
  const sectionListToFilter = [...repositorySections, ...customSections, ...STATUTORY_SECTIONS];
  const caseListToFilter = [...repositoryCaseLaws, ...customCaseLaws, ...CASE_LAWS];

  const filteredSections = sectionListToFilter.filter(sec => {
    // Filter by selected category card
    if (selectedCategory) {
      if (sec.category !== selectedCategory) {
        return false;
      }
    }

    // Filter by advanced options / search term
    if (searchTerm) {
      const s = searchTerm.toLowerCase();
      const matchAct = sec.actName.toLowerCase().includes(s);
      const matchTitle = sec.title.toLowerCase().includes(s);
      const matchSecNum = sec.sectionNumber.toLowerCase().includes(s);
      const matchDesc = sec.description.toLowerCase().includes(s);
      const matchKeywords = sec.keyKeywords.some(kw => kw.toLowerCase().includes(s));
      const matchCat = sec.category.toLowerCase().includes(s) || (sec.category === "Labor" && s.includes("labour"));

      if (!matchAct && !matchTitle && !matchSecNum && !matchDesc && !matchKeywords && !matchCat) {
        return false;
      }
    }

    if (searchSectionNumber && !sec.sectionNumber.toLowerCase().includes(searchSectionNumber.toLowerCase())) {
      return false;
    }

    if (searchCategoryDropdown) {
      const catLower = searchCategoryDropdown.toLowerCase();
      const secCatLower = sec.category.toLowerCase();
      if (secCatLower !== catLower && !(catLower === "labor" && secCatLower === "labour") && !(catLower === "labour" && secCatLower === "labor")) {
        return false;
      }
    }
    
    // Keyword searches both title, summary and tag list
    if (searchKeyword) {
      const keywordLower = searchKeyword.toLowerCase();
      const matchTag = sec.keyKeywords.some(tag => tag.toLowerCase().includes(keywordLower));
      const matchDesc = sec.description.toLowerCase().includes(keywordLower);
      const matchTitle = sec.title.toLowerCase().includes(keywordLower);
      if (!matchTag && !matchDesc && !matchTitle) {
        return false;
      }
    }

    return true;
  });

  const filteredCaseLaws = caseListToFilter.filter(caseItem => {
    // Filter by selected category card 
    if (selectedCategory) {
      if (caseItem.category !== selectedCategory) {
        return false;
      }
    }

    // Advanced search terms / unified search term
    if (searchTerm) {
      const s = searchTerm.toLowerCase();
      const matchCaseName = caseItem.caseName.toLowerCase().includes(s);
      const matchCitation = caseItem.citation.toLowerCase().includes(s);
      const matchCourt = caseItem.court.toLowerCase().includes(s);
      const matchSummary = caseItem.summary.toLowerCase().includes(s);
      const matchPrinciples = caseItem.keyPrinciples.some(p => p.toLowerCase().includes(s));
      const matchCategory = caseItem.category.toLowerCase().includes(s) || (caseItem.category === "Labor" && s.includes("labour"));
      const matchSecRefs = caseItem.applicableSections.some(secRef => secRef.toLowerCase().includes(s));

      if (!matchCaseName && !matchCitation && !matchCourt && !matchSummary && !matchPrinciples && !matchCategory && !matchSecRefs) {
        return false;
      }
    }

    if (searchCourt && !caseItem.court.toLowerCase().includes(searchCourt.toLowerCase())) {
      return false;
    }

    if (searchCategoryDropdown) {
      const catLower = searchCategoryDropdown.toLowerCase();
      const caseCatLower = caseItem.category.toLowerCase();
      if (caseCatLower !== catLower && !(catLower === "labor" && caseCatLower === "labour") && !(catLower === "labour" && caseCatLower === "labor")) {
        return false;
      }
    }
    
    if (searchKeyword) {
      const kw = searchKeyword.toLowerCase();
      const matchSummary = caseItem.summary.toLowerCase().includes(kw);
      const matchPrinciples = caseItem.keyPrinciples.some(p => p.toLowerCase().includes(kw));
      if (!matchSummary && !matchPrinciples) {
        return false;
      }
    }

    // Section number check
    if (searchSectionNumber) {
      const secNum = searchSectionNumber.toLowerCase();
      const matchSecRef = caseItem.applicableSections.some(sec => sec.toLowerCase().includes(secNum));
      if (!matchSecRef) {
        return false;
      }
    }

    // Judge Name check
    if (searchJudgeName && (!caseItem.judgeName || !caseItem.judgeName.toLowerCase().includes(searchJudgeName.toLowerCase()))) {
      return false;
    }

    // Citation check
    if (searchCitation && (!caseItem.citation || !caseItem.citation.toLowerCase().includes(searchCitation.toLowerCase()))) {
      return false;
    }

    // Adjudication Year check
    if (searchYear && (!caseItem.judgmentDate || !caseItem.judgmentDate.toLowerCase().includes(searchYear.toLowerCase()))) {
      return false;
    }

    return true;
  });

  return (
    <div className="space-y-6" id="legal-case-laws-and-precedents">
      {/* Dynamic Popups for Success Notifications */}
      {copiedNotification && (
        <div className="fixed bottom-5 right-5 bg-slate-900 text-white text-xs font-bold px-4 py-3 rounded-xl shadow-xl z-50 flex items-center gap-2 border border-slate-800 animate-slide-in">
          <Check className="h-4 w-4 text-emerald-400" />
          <span>{copiedNotification}</span>
        </div>
      )}

      {/* Header section with tab navigations */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 font-sans">Statutory Sections & Precedents Binder</h2>
          <p className="text-slate-500 text-xs mt-1">
            Browse landmark rulings, find statutory acts, bookmark sections for active briefs drafting, and generate advice on trial strategies.
          </p>
        </div>

        {/* Tab Selection */}
        <div className="flex bg-slate-200/60 p-1 border border-slate-205 rounded-xl text-xs gap-1 font-sans w-full lg:max-w-md">
          <button
            onClick={() => setActiveTab("database")}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg font-bold transition-all cursor-pointer ${
              activeTab === "database" ? "bg-blue-600 text-white shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Scale className="h-4 w-4" /> Code Database
          </button>
          <button
            onClick={() => setActiveTab("ai-engine")}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg font-bold transition-all cursor-pointer ${
              activeTab === "ai-engine" ? "bg-blue-600 text-white shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Sparkles className="h-4 w-4" /> AI Recommendation Engine
          </button>
          <button
            onClick={() => setActiveTab("notebook")}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg font-bold transition-all cursor-pointer ${
              activeTab === "notebook" ? "bg-blue-600 text-white shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <NotebookTabs className="h-4 w-4" /> Lawyer's Brief Notes
          </button>
        </div>
      </div>

      {activeTab === "database" && (
        <div className="space-y-6">
          {/* Section 1: Responsive Category Cards Carousel */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-10 gap-3">
            {LEGAL_CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(isSelected ? null : cat.id)}
                  className={`p-3.5 border rounded-xl flex flex-col items-center justify-center text-center gap-2 transition-all cursor-pointer text-xs group ${
                    isSelected 
                      ? "bg-blue-600 border-blue-600 text-white shadow-md scale-102"
                      : "bg-white border-slate-200 hover:border-slate-300 hover:shadow-xs text-slate-800"
                  }`}
                  title={cat.description}
                >
                  <div className={`p-2 rounded-lg transition-transform group-hover:scale-105 duration-150 ${isSelected ? "bg-white/10" : "bg-slate-50"}`}>
                    {renderCategoryIcon(cat.icon)}
                  </div>
                  <span className={`font-bold tracking-tight block text-[10px] leading-tight ${isSelected ? "text-white" : "text-slate-700"}`}>
                    {cat.name.replace(" Law", "")}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Section 2: Advanced Search Filtering Panels */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Search className="h-4.5 w-4.5 text-blue-600" />
              <h3 className="text-[11px] font-extrabold uppercase tracking-widest text-slate-800 font-mono">Advanced Jurisprudence Query Indices</h3>
              { (searchTerm || searchSectionNumber || searchCourt || searchCategoryDropdown || searchKeyword || searchJudgeName || searchCitation || searchYear || selectedCategory) && (
                <button 
                  onClick={() => {
                    setSearchTerm("");
                    setSearchSectionNumber("");
                    setSearchCourt("");
                    setSearchCategoryDropdown("");
                    setSearchKeyword("");
                    setSearchJudgeName("");
                    setSearchCitation("");
                    setSearchYear("");
                    setSelectedCategory(null);
                  }}
                  className="ml-auto text-[10px] font-extrabold text-blue-600 hover:text-blue-900 bg-blue-50 px-2 py-1 rounded-md"
                >
                  Reset Query
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 font-sans text-xs">
              <div className="space-y-1">
                <label className="text-slate-500 font-bold uppercase tracking-wider text-[9px]">Case name / Act title</label>
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 h-3.5 w-3.5" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="e.g. Nanavati, Bipinchandra..."
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 pl-8.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 font-serif"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-500 font-bold uppercase tracking-wider text-[9px]">Section or Rule ID</label>
                <input
                  type="text"
                  value={searchSectionNumber}
                  onChange={(e) => setSearchSectionNumber(e.target.value)}
                  placeholder="e.g. Section 13-B, 300..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-500 font-bold uppercase tracking-wider text-[9px]">Presiding Court / Venue</label>
                <input
                  type="text"
                  value={searchCourt}
                  onChange={(e) => setSearchCourt(e.target.value)}
                  placeholder="e.g. Supreme Court, High Court..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-905 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-500 font-bold uppercase tracking-wider text-[9px]">Legal Class Dropdown</label>
                <select
                  value={searchCategoryDropdown}
                  onChange={(e) => setSearchCategoryDropdown(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 cursor-pointer"
                >
                  <option value="">All Categories...</option>
                  {LEGAL_CATEGORIES.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-slate-500 font-bold uppercase tracking-wider text-[9px]">Concept / Principles Keywords</label>
                <input
                  type="text"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  placeholder="e.g. intent, evergreening, efficacy..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-1000 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-500 font-bold uppercase tracking-wider text-[9px]">Citation Number</label>
                <input
                  type="text"
                  value={searchCitation}
                  onChange={(e) => setSearchCitation(e.target.value)}
                  placeholder="e.g. AIR 2015 SC 1523..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-500 font-bold uppercase tracking-wider text-[9px]">Presiding Judge Name</label>
                <input
                  type="text"
                  value={searchJudgeName}
                  onChange={(e) => setSearchJudgeName(e.target.value)}
                  placeholder="e.g. Justice Chandrachud..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-500 font-bold uppercase tracking-wider text-[9px]">Adjudication Year</label>
                <input
                  type="text"
                  value={searchYear}
                  onChange={(e) => setSearchYear(e.target.value)}
                  placeholder="e.g. 2023, 2015..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 font-mono"
                />
              </div>
            </div>

            {/* Custom indexing and dynamic Live-search controls bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs font-sans">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleRepositorySearch}
                  disabled={isSearchingRepository}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:text-slate-500 text-white font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer shadow-xs font-sans text-xs"
                >
                  {isSearchingRepository ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" /> Indexing Live Repository...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" /> Query Complete Indian Legal Repository (AI Live Index)
                    </>
                  )}
                </button>
                <div className="text-[10px] text-slate-500 max-w-xs font-serif leading-tight">
                  Queries complete active Indian Central/State statutes & case precedents.
                </div>
              </div>

              <div className="flex items-center gap-2 ml-auto">
                <button
                  type="button"
                  onClick={() => setShowAddCustomModal("section")}
                  className="bg-slate-905 hover:bg-slate-800 bg-slate-900 text-white font-bold px-3 py-2 rounded-xl flex items-center gap-1 transition-all cursor-pointer font-sans text-xs"
                >
                  <PlusCircle className="h-3.5 w-3.5" /> Index Custom Act Section
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddCustomModal("caselaw")}
                  className="bg-slate-905 hover:bg-slate-800 bg-slate-900 text-white font-bold px-3 py-2 rounded-xl flex items-center gap-1 transition-all cursor-pointer font-sans text-xs"
                >
                  <PlusCircle className="h-3.5 w-3.5" /> Index Custom Precedent
                </button>
              </div>
            </div>

            {/* Live Repository status message or sandbox alerts */}
            {repositoryMessage && (
              <div className="p-3.5 bg-indigo-50 border border-indigo-200 text-indigo-900 rounded-xl text-xs space-y-1">
                <p className="font-bold">Live Search Notice:</p>
                <p className="font-serif leading-relaxed text-[11.5px]">{repositoryMessage}</p>
              </div>
            )}
          </div>

          {/* Section 3: Two Column Layout: Statutes vs Precedent Cases */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* COLUMN 1: ACTS & STATUTORIES */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <FileText className="h-5 w-5 text-slate-700" />
                  <h3 className="text-base font-bold text-slate-900">Acts and Codified Statutory Sections</h3>
                </div>
                <span className="text-[10px] font-bold bg-slate-200 text-slate-800 px-2 py-0.5 rounded-full">
                  {filteredSections.length} Sections
                </span>
              </div>

              <div className="space-y-3">
                {filteredSections.map((sec) => {
                  const isSaved = savedSections.includes(sec.id);
                  const isCustom = sec.id.startsWith("custom-") || customSections.some(cs => cs.id === sec.id);
                  const isRepoResult = repositorySections.some(rs => rs.id === sec.id);

                  return (
                    <div 
                      key={sec.id}
                      className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-slate-300 hover:shadow-xs transition-all space-y-3"
                    >
                      <div className="flex justify-between items-start gap-2">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[9.5px] font-bold text-blue-600 uppercase tracking-widest font-mono">
                              {sec.actName}
                            </span>
                            {isCustom && (
                              <span className="text-[8px] bg-slate-900 text-white font-mono rounded px-1 font-bold">
                                Custom Index
                              </span>
                            )}
                            {isRepoResult && (
                              <span className="text-[8px] bg-indigo-600 text-white font-mono rounded px-1 font-bold">
                                Live Repository
                              </span>
                            )}
                          </div>
                          <h4 
                            onClick={() => setSelectedSectionForDetail(sec)}
                            className="text-sm font-extrabold text-slate-800 hover:text-blue-600 cursor-pointer transition-colors"
                          >
                            {sec.sectionNumber} : {sec.title}
                          </h4>
                        </div>
                        
                        <div className="flex items-center gap-1.5 shrink-0 ml-auto">
                          {isCustom && (
                            <button
                              onClick={(e) => handleDeleteCustomSection(sec.id, e)}
                              className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition-colors cursor-pointer border border-rose-100"
                              title="Delete from Index"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                          <button
                            onClick={() => toggleSectionSave(sec.id)}
                            className={`p-1.5 rounded-lg border transition-colors cursor-pointer shrink-0 ${
                              isSaved 
                                ? "bg-blue-50 border-blue-200 text-blue-600 hover:bg-rose-50 hover:border-rose-100 hover:text-rose-600"
                                : "bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-805 hover:bg-slate-100"
                            }`}
                            title={isSaved ? "Remove from Saved" : "Save Section"}
                          >
                            <BookmarkCheck className={`h-4 w-4 ${isSaved ? "fill-blue-600" : ""}`} />
                          </button>
                        </div>
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed font-sans">
                        {sec.description}
                      </p>

                      <div className="flex flex-wrap items-center gap-1.5 pt-2">
                        {sec.keyKeywords.map((tag) => (
                          <span 
                            key={tag} 
                            onClick={() => setSearchKeyword(tag)}
                            className="text-[9px] font-medium bg-slate-100 text-slate-550 border border-slate-200 hover:border-slate-300 px-2 py-0.5 rounded-md cursor-pointer transition-colors"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}

                {filteredSections.length === 0 && (
                  <div className="text-center py-12 bg-slate-100/50 border border-dashed border-slate-200 rounded-2xl p-5">
                    <p className="text-xs text-slate-400 italic">No statutory acts matching active filter queries.</p>
                  </div>
                )}
              </div>
            </div>

            {/* COLUMN 2: LANDMARK CASE LAWS & RECENT JUDGMENTS */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Scale className="h-5 w-5 text-slate-700" />
                  <h3 className="text-base font-bold text-slate-900">Landmark Precedents & Judgments</h3>
                </div>
                <span className="text-[10px] font-bold bg-slate-200 text-slate-800 px-2 py-0.5 rounded-full">
                  {filteredCaseLaws.length} Precedents
                </span>
              </div>

              <div className="space-y-3">
                {filteredCaseLaws.map((caseItem) => {
                  const isBookmarked = bookmarkedCases.includes(caseItem.id);
                  const activeNote = caseNotes[caseItem.id] || "";
                  return (
                    <div 
                      key={caseItem.id}
                      className={`bg-white border rounded-2xl p-5 hover:border-slate-300 hover:shadow-xs transition-all space-y-3.5 relative overflow-hidden ${
                        caseItem.isLandmark ? "border-l-4 border-l-blue-600 border-slate-200" : "border-slate-200"
                      }`}
                    >
                      {caseItem.isLandmark && (
                        <div className="absolute top-0 right-14 bg-blue-600 text-white font-mono font-bold text-[8px] uppercase tracking-wider px-2 py-0.5 rounded-b-md">
                          Landmark Precedent
                        </div>
                      )}

                      <div className="flex justify-between items-start gap-4">
                        <div className="space-y-0.5 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[10.5px] font-bold text-slate-500 font-mono">
                              {caseItem.citation}
                            </span>
                            <span className="text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-md font-extrabold uppercase shrink-0">
                              {caseItem.category} Law
                            </span>
                            {caseItem.id.startsWith("custom-") || customCaseLaws.some(cc => cc.id === caseItem.id) ? (
                              <span className="text-[8px] bg-slate-900 text-white font-mono rounded px-1 font-bold shrink-0">
                                Custom Index
                              </span>
                            ) : null}
                            {repositoryCaseLaws.some(rc => rc.id === caseItem.id) ? (
                              <span className="text-[8px] bg-indigo-600 text-white font-mono rounded px-1 font-bold shrink-0">
                                Live Repository
                              </span>
                            ) : null}
                          </div>
                          <h4 
                            onClick={() => setSelectedCaseForDetail(caseItem)}
                            className="text-sm font-extrabold text-slate-900 leading-tight hover:text-blue-600 cursor-pointer transition-colors max-w-sm truncate"
                          >
                            {caseItem.caseName}
                          </h4>
                          <span className="text-[10px] text-slate-400 font-serif italic block">
                            {caseItem.court} • Adjudication: {caseItem.judgmentDate}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0 ml-auto font-sans">
                          {(caseItem.id.startsWith("custom-") || customCaseLaws.some(cc => cc.id === caseItem.id)) && (
                            <button
                              onClick={(e) => handleDeleteCustomCase(caseItem.id, e)}
                              className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition-colors cursor-pointer border border-rose-100"
                              title="Delete from Index"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                          <button
                            onClick={() => toggleCaseBookmark(caseItem.id)}
                            className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                              isBookmarked 
                                ? "bg-blue-50 border-blue-200 text-blue-600 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-100"
                                : "bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-805 hover:bg-slate-100"
                            }`}
                            title="Bookmark Precedent"
                          >
                            <BookmarkCheck className={`h-4 w-4 ${isBookmarked ? "fill-blue-600" : ""}`} />
                          </button>
                          <button
                            onClick={() => shareCaseSummary(caseItem)}
                            className="p-1.5 bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-600 rounded-lg transition-colors cursor-pointer"
                            title="Share Briefing"
                          >
                            <Share2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => downloadCaseBrief(caseItem)}
                            className="p-1.5 bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-600 rounded-lg transition-colors cursor-pointer"
                            title="Download TXT Brief"
                          >
                            <Download className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      {/* Summary Section */}
                      <p className="text-xs text-slate-600 leading-relaxed font-sans mt-1">
                        <span className="font-bold text-slate-700">Adjudicated Summary:</span> {caseItem.summary}
                      </p>

                      {/* Key Principles */}
                      <div className="space-y-1">
                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Key Legal Ratio Decidendi:</span>
                        <ul className="list-disc list-inside space-y-0.5 text-xs text-slate-700 pl-1">
                          {caseItem.keyPrinciples.map((principle, idx) => (
                            <li key={idx} className="leading-snug list-style-none flex items-start gap-1 pr-1">
                              <ChevronRight className="h-3 w-3 text-blue-600 shrink-0 mt-0.5" />
                              <span>{principle}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Legal Cross Reference & Related judgments */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-[10px] font-sans">
                        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-150/60 space-y-1">
                          <span className="text-[9px] font-bold text-slate-450 uppercase tracking-widest block font-mono">Applicable Statutes Cites</span>
                          {caseItem.applicableSections.map((sec, i) => (
                            <button
                              key={i}
                              onClick={() => handleCrossRefClick(sec)}
                              className="text-blue-600 font-bold hover:underline flex items-center gap-1 text-left w-full truncate"
                            >
                              <ExternalLink className="h-3 w-3 inline shrink-0" /> {sec}
                            </button>
                          ))}
                        </div>

                        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-150/60 space-y-1">
                          <span className="text-[9px] font-bold text-slate-450 uppercase tracking-widest block font-mono">Similar Precedents</span>
                          {caseItem.relatedPrecedents.map((pre, i) => (
                            <button
                              key={i}
                              onClick={() => {
                                setSearchTerm(pre);
                                showCopiedBanner(`Searching binder regarding related precedent: ${pre}`);
                              }}
                              className="text-amber-705 font-bold hover:underline flex items-center gap-1 text-left w-full truncate"
                            >
                              <FileText className="h-3 w-3 inline shrink-0 text-amber-600" /> {pre}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Recent Update Banner if available */}
                      {caseItem.recentUpdate && (
                        <div className="bg-amber-50 p-3.5 rounded-xl border border-dashed border-amber-200 text-xs text-amber-800 leading-snug flex items-start gap-2">
                          <Sparkles className="h-4.5 w-4.5 text-amber-600 shrink-0 mt-0.5 animate-pulse" />
                          <div>
                            <span className="font-bold block">Law Amendment & Update:</span>
                            {caseItem.recentUpdate}
                          </div>
                        </div>
                      )}

                      {/* Case Specific Notes Panel */}
                      <div className="border-t border-slate-100 pt-3 space-y-2">
                        <div className="flex items-center gap-1.5 text-slate-500 font-bold">
                          <StickyNote className="h-4 w-4 text-indigo-500" />
                          <span className="text-[10px] uppercase tracking-wider text-slate-500">Lawyer's Active Brief Notes</span>
                        </div>
                        <div className="flex gap-2">
                          <textarea
                            rows={1}
                            placeholder="Type personal strategy, active notes, or hearing dates relative to this precedent..."
                            defaultValue={activeNote}
                            onBlur={(e) => savePersonalNote(caseItem.id, e.target.value)}
                            className="bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 rounded-lg p-2 text-xs w-full focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white resize-none"
                          />
                        </div>
                        <p className="text-[9px] text-slate-400 italic font-mono">Autosaves securely inside browser space on text unfocus (blur).</p>
                      </div>
                    </div>
                  );
                })}

                {filteredCaseLaws.length === 0 && (
                  <div className="text-center py-12 bg-slate-100/50 border border-dashed border-slate-200 rounded-2xl p-5">
                    <p className="text-xs text-slate-400 italic">No landmark case precedents match your query boundaries.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "ai-engine" && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Sparkles className="h-5 w-5 text-blue-600" />
            <div>
              <h3 className="text-base font-bold text-slate-900 font-sans">AI Precedent Recommendation Engine</h3>
              <p className="text-slate-500 text-xs">Simulate dynamic query analysis: supply fact parameters, choose an active trial case, and retrieve citation advice.</p>
            </div>
          </div>

          <form onSubmit={handleRequestAIRecommendation} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Input Form Column */}
            <div className="lg:col-span-1 space-y-4 text-xs font-sans">
              <div className="space-y-1.5">
                <label className="text-slate-705 font-bold uppercase tracking-wider text-[10px]">Trial Domain Category</label>
                <select
                  value={recommendationCategory}
                  onChange={(e) => setRecommendationCategory(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-950 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-xs cursor-pointer"
                >
                  {LEGAL_CATEGORIES.map(c => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-705 font-bold uppercase tracking-wider text-[10px]">Link to Active Matter File (Optional)</label>
                <select
                  value={recommendationTiedCase}
                  onChange={(e) => setRecommendationTiedCase(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-950 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-xs cursor-pointer"
                >
                  <option value="">-- No connected active matter --</option>
                  {cases.map(c => (
                    <option key={c.id} value={c.id}>{c.title} ({c.caseNumber})</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-705 font-bold uppercase tracking-wider text-[10px]">Fact Scenario / Dispute Particulars</label>
                <textarea
                  rows={6}
                  value={customSituationText}
                  onChange={(e) => setCustomSituationText(e.target.value)}
                  placeholder="e.g. A pharmaceutical provider is filing to block generic drug packaging citing patent expansions. Analyze evergreening boundaries."
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-950 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-xs leading-relaxed"
                />
              </div>

              <button
                type="submit"
                disabled={isLoadingRecommendation}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:text-slate-500 text-white font-bold rounded-xl py-3 flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs text-xs"
              >
                {isLoadingRecommendation ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" /> Querying litigation matrices...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" /> Recommend Precedents
                  </>
                )}
              </button>
            </div>

            {/* Results Display Column */}
            <div className="lg:col-span-2 bg-slate-50 border border-slate-200 rounded-2xl p-5 relative overflow-hidden min-h-[350px]">
              {recommendationResult ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                    <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                      <Scale className="h-3.5 w-3.5 text-blue-600" /> Precedent Recommendation Output
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(recommendationResult);
                        showCopiedBanner("Copied AI precedent advice to clipboard!");
                      }}
                      className="text-[10px] bg-white border border-slate-200 text-slate-700 hover:text-blue-600 hover:bg-slate-100 p-1.5 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Share2 className="h-3.5 w-3.5" /> Copy Analysis
                    </button>
                  </div>
                  
                  {/* Markdown Renderer in Compliance with Standards */}
                  <div className="prose prose-sm max-w-none text-slate-800 text-xs leading-relaxed font-sans overflow-y-auto max-h-[50vh] pr-2">
                    <div className="markdown-body">
                      <Markdown>{recommendationResult}</Markdown>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 space-y-3">
                  {isLoadingRecommendation ? (
                    <div className="flex flex-col items-center gap-3">
                      <RefreshCw className="h-8 w-8 text-blue-600 animate-spin" />
                      <p className="text-xs text-slate-650 font-semibold">Gemini AI is parsing legal briefs, historical supreme cases, and statutory codes...</p>
                    </div>
                  ) : (
                    <>
                      <div className="p-4 bg-blue-50 text-blue-600 rounded-full border border-blue-105">
                        <Sparkles className="h-6 w-6" />
                      </div>
                      <h4 className="text-sm font-bold text-slate-800">No Precedent Advice Loaded</h4>
                      <p className="text-xs text-slate-500 max-w-md">
                        Please construct your situation in the left input terminal, linking it optionally to active dockets, then trigger the recommendation query.
                      </p>
                    </>
                  )}
                </div>
              )}
            </div>
          </form>
        </div>
      )}

      {activeTab === "notebook" && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-101 border-b-slate-100">
            <NotebookTabs className="h-5 w-5 text-blue-600" />
            <div>
              <h3 className="text-base font-bold text-slate-900 font-sans">Lawyer's Notebook Ledger</h3>
              <p className="text-slate-500 text-xs">A comprehensive catalog of your saved statutory codes, bookmarked cases, and custom trial strategy notes.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* SAVED STATUTES COLUMN */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-705 uppercase tracking-wider font-mono border-b border-slate-100 pb-2">
                Saved Codified Statutory Sections ({savedSections.length})
              </h4>
              
              <div className="space-y-3.5 max-h-[60vh] overflow-y-auto pr-2">
                {savedSections.map(secId => {
                  const sec = STATUTORY_SECTIONS.find(s => s.id === secId);
                  if (!sec) return null;
                  return (
                    <div key={sec.id} className="p-4 bg-slate-50 border border-slate-205 rounded-xl space-y-1.5">
                      <div className="flex justify-between items-start gap-2">
                        <span className="text-[9px] font-bold text-blue-600 uppercase font-mono tracking-wide">{sec.actName}</span>
                        <button
                          onClick={() => toggleSectionSave(sec.id)}
                          className="text-[10px] text-rose-600 hover:underline font-bold"
                        >
                          Unsave
                        </button>
                      </div>
                      <h5 className="font-extrabold text-xs text-slate-800">{sec.sectionNumber}: {sec.title}</h5>
                      <p className="text-[11px] text-slate-600 leading-relaxed font-sans">{sec.description.slice(0, 160)}...</p>
                    </div>
                  );
                })}

                {savedSections.length === 0 && (
                  <p className="text-xs text-slate-400 italic">No saved statutory sections recorded. Browse Code Database to pin sections of interest.</p>
                )}
              </div>
            </div>

            {/* BOOKMARKED PRECEDENTS COLUMN */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-705 uppercase tracking-wider font-mono border-b border-slate-100 pb-2">
                Bookmarked Precedents & Action Notes ({bookmarkedCases.length})
              </h4>

              <div className="space-y-3.5 max-h-[60vh] overflow-y-auto pr-2">
                {bookmarkedCases.map(caseId => {
                  const caseItem = CASE_LAWS.find(c => c.id === caseId);
                  if (!caseItem) return null;
                  return (
                    <div key={caseItem.id} className="p-4 bg-slate-50 border border-slate-205 rounded-xl space-y-2.5">
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <span className="text-[10px] font-bold text-slate-500 font-mono block">{caseItem.citation}</span>
                          <h5 className="font-extrabold text-xs text-slate-800">{caseItem.caseName}</h5>
                        </div>
                        <button
                          onClick={() => toggleCaseBookmark(caseItem.id)}
                          className="text-[10px] text-rose-605 hover:underline font-bold shrink-0"
                        >
                          Erase Bookmark
                        </button>
                      </div>
                      
                      <p className="text-[11px] text-slate-600 leading-snug">{caseItem.summary.slice(0, 180)}...</p>
                      
                      {/* Active strategy note input */}
                      <div className="space-y-1">
                        <span className="text-[9px] font-bold text-indigo-650 uppercase tracking-wider block">Trial Strategy & Assessment Notes:</span>
                        <textarea
                          rows={2}
                          placeholder="Type notes..."
                          defaultValue={caseNotes[caseItem.id] || ""}
                          onBlur={(e) => savePersonalNote(caseItem.id, e.target.value)}
                          className="bg-white border border-slate-200 text-[11px] p-2 rounded-lg text-slate-800 w-full focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                      </div>
                    </div>
                  );
                })}

                {bookmarkedCases.length === 0 && (
                  <p className="text-xs text-slate-400 italic">No bookmarked precedents. Browse case laws list and bookmark rulings you cite heavily.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      {selectedSectionForDetail && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in font-sans">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-6 relative">
            <button
              onClick={() => setSelectedSectionForDetail(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 p-2 rounded-full transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="space-y-2 border-b border-slate-100 pb-4 pr-8">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md font-mono tracking-wide">
                  {selectedSectionForDetail.actName}
                </span>
                <span className="text-[11px] font-bold text-slate-500 bg-slate-50 px-2.5 py-1 rounded-md">
                  {selectedSectionForDetail.category} Law Category
                </span>
              </div>
              <h3 className="text-xl font-black text-slate-900 leading-snug font-sans">
                {selectedSectionForDetail.sectionNumber}: {selectedSectionForDetail.title}
              </h3>
            </div>

            {selectedSectionForDetail.chapterName && (
              <div className="bg-slate-50 border border-slate-150 rounded-xl p-3 text-xs leading-snug">
                <span className="font-extrabold text-slate-700 uppercase font-mono tracking-wider block text-[9.5px]">Act Chapter Reference:</span>
                <p className="text-slate-800 font-bold">{selectedSectionForDetail.chapterName}</p>
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-widest font-mono block text-[10px]">Statutory Codified Provision (Verbatim)</span>
                <p className="text-sm text-slate-805 leading-relaxed font-serif bg-slate-50/50 p-4 rounded-xl border border-slate-100 whitespace-pre-wrap">
                  {selectedSectionForDetail.description}
                </p>
              </div>

              {selectedSectionForDetail.explanationsProvisos && (
                <div className="space-y-1.5">
                  <span className="text-xs font-bold text-indigo-700 uppercase tracking-widest font-mono block text-[10px]">Explanations, Exceptions & Provisos</span>
                  <p className="text-xs text-slate-700 leading-relaxed font-sans bg-indigo-50/20 p-4 rounded-xl border border-indigo-100/60 italic whitespace-pre-wrap">
                    {selectedSectionForDetail.explanationsProvisos}
                  </p>
                </div>
              )}

              {selectedSectionForDetail.amendmentsNotifications && (
                <div className="space-y-1.5 border-t border-slate-100 pt-3">
                  <span className="text-xs font-bold text-amber-700 uppercase tracking-widest font-mono block text-[10px]">Amendments, Appendices & State Modifications</span>
                  <p className="text-xs text-slate-701 leading-relaxed bg-amber-50/30 p-3.5 rounded-xl border border-amber-100/60 font-serif whitespace-pre-wrap">
                    {selectedSectionForDetail.amendmentsNotifications}
                  </p>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {selectedSectionForDetail.keyKeywords.map((tag) => (
                <span
                  key={tag}
                  className="text-xs bg-slate-100 border border-slate-200 text-slate-650 px-2.5 py-1 rounded-lg"
                >
                  #{tag}
                </span>
              ))}
            </div>

            <div className="border-t border-slate-100 pt-4 flex justify-end gap-3">
              <button
                onClick={() => {
                  toggleSectionSave(selectedSectionForDetail.id);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all cursor-pointer shadow-xs flex items-center gap-1"
              >
                <BookmarkCheck className="h-4 w-4 font-bold" />
                {savedSections.includes(selectedSectionForDetail.id) ? "Saved (Unsave)" : "Save Section"}
              </button>
              <button
                onClick={() => {
                  setSelectedSectionForDetail(null);
                }}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-4 py-2.5 rounded-xl transition-all cursor-pointer"
              >
                Close Back
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedCaseForDetail && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in font-sans">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-6 relative">
            <button
              onClick={() => setSelectedCaseForDetail(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 p-2 rounded-full transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="space-y-2 border-b border-slate-100 pb-4 pr-8">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500 bg-slate-50 px-2.5 py-1 rounded-md font-mono tracking-wide">
                  {selectedCaseForDetail.citation}
                </span>
                <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md uppercase font-mono">
                  {selectedCaseForDetail.category} Precedent
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 font-serif leading-tight">
                {selectedCaseForDetail.caseName}
              </h3>
              <p className="text-xs text-slate-500 font-serif italic">
                {selectedCaseForDetail.court} • Judgment Date: {selectedCaseForDetail.judgmentDate}
              </p>
            </div>

            {selectedCaseForDetail.judgeName && (
              <div className="bg-slate-50 border border-slate-150 rounded-xl p-3 text-xs leading-none flex gap-2 items-center">
                <Users2 className="h-4 w-4 text-slate-600" />
                <div>
                  <span className="text-[9px] font-bold text-slate-400 uppercase block font-mono">Presiding Bench / Judicial Coram:</span>
                  <span className="text-slate-800 font-bold font-serif">{selectedCaseForDetail.judgeName}</span>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-widest font-mono block text-[10px]">Holding / Judgment Summary</span>
                  <div className="text-xs text-slate-800 leading-relaxed font-sans bg-slate-50/50 p-4 rounded-xl border border-slate-100 whitespace-pre-wrap">
                    {selectedCaseForDetail.summary}
                  </div>
                </div>

                <div className="space-y-1.5 border-t border-slate-100 pt-3">
                  <span className="text-xs font-bold text-blue-700 uppercase tracking-widest font-mono block text-[10px]">Ratio Decidendi / Legal Principles</span>
                  <ul className="list-disc list-inside space-y-1 text-xs text-slate-700">
                    {selectedCaseForDetail.keyPrinciples.map((pri, idx) => (
                      <li key={idx} className="leading-relaxed font-serif pl-1 flex items-start gap-1">
                        <ChevronRight className="h-3.5 w-3.5 text-blue-600 shrink-0 mt-0.5" />
                        <span>{pri}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-150/60 space-y-2 text-xs">
                  <span className="text-[10px] font-bold text-slate-700 uppercase tracking-widest block font-mono">Applicable Statutes & Cites</span>
                  <div className="grid grid-cols-1 gap-1.5">
                    {selectedCaseForDetail.applicableSections.map((sec, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setSelectedCaseForDetail(null);
                          handleCrossRefClick(sec);
                        }}
                        className="text-blue-600 font-bold hover:underline flex items-center gap-1.5 text-left bg-white p-2 rounded border border-slate-200"
                      >
                        <ExternalLink className="h-3.5 w-3.5 text-blue-600 inline shrink-0" /> {sec}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-150/60 space-y-2 text-xs">
                  <span className="text-[10px] font-bold text-slate-700 uppercase tracking-widest block font-mono">Similar / Overruled Precedents</span>
                  <div className="grid grid-cols-1 gap-1.5">
                    {selectedCaseForDetail.relatedPrecedents.map((pre, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setSelectedCaseForDetail(null);
                          setSearchTerm(pre);
                          showCopiedBanner(`Searching binder regarding related precedent: ${pre}`);
                        }}
                        className="text-amber-700 font-bold hover:underline flex items-center gap-1.5 text-left bg-white p-2 rounded border border-slate-200"
                      >
                        <FileText className="h-3.5 w-3.5 text-amber-600 inline shrink-0" /> {pre}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {selectedCaseForDetail.recentUpdate && (
              <div className="bg-amber-50 p-3.5 rounded-xl border border-dashed border-amber-200 text-xs text-amber-800 leading-snug flex items-start gap-2">
                <Sparkles className="h-4.5 w-4.5 text-amber-600 shrink-0 mt-0.5 antialiased" />
                <div>
                  <span className="font-extrabold block">Historic Amendment or Key Regulatory Update:</span>
                  {selectedCaseForDetail.recentUpdate}
                </div>
              </div>
            )}

            {/* Case Specific Notes Panel */}
            <div className="bg-indigo-50/20 p-4 rounded-xl border border-indigo-100 space-y-2">
              <div className="flex items-center gap-1.5 text-indigo-700 font-bold text-xs uppercase tracking-wider">
                <StickyNote className="h-4.5 w-4.5 text-indigo-650" />
                <span>Your counsel strategy docket notes</span>
              </div>
              <textarea
                rows={3}
                placeholder="Write confidential counsel briefings relative to this landmark ruling..."
                defaultValue={caseNotes[selectedCaseForDetail.id] || ""}
                onBlur={(e) => savePersonalNote(selectedCaseForDetail.id, e.target.value)}
                className="bg-white border border-slate-200 text-slate-800 placeholder-slate-400 rounded-lg p-2.5 text-xs w-full focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div className="border-t border-slate-100 pt-4 flex justify-end gap-3 text-xs">
              <button
                onClick={() => {
                  toggleCaseBookmark(selectedCaseForDetail.id);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2.5 rounded-xl transition-all cursor-pointer shadow-xs flex items-center gap-1"
              >
                <BookmarkCheck className="h-4 w-4" />
                {bookmarkedCases.includes(selectedCaseForDetail.id) ? "Bookmarked (Erase)" : "Bookmark Precedent"}
              </button>
              <button
                onClick={() => {
                  setSelectedCaseForDetail(null);
                }}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-4 py-2.5 rounded-xl transition-all cursor-pointer"
              >
                Close Back
              </button>
            </div>
          </div>
        </div>
      )}

      {showAddCustomModal === "section" && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in font-sans">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-6 relative">
            <button
              onClick={() => setShowAddCustomModal(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 p-2 rounded-full transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="space-y-1">
              <h3 className="text-lg font-black text-slate-900 font-sans">Index Custom Statutory Section</h3>
              <p className="text-xs text-slate-500 font-serif">Insert customized Central or State-specific statutes, rules, or notify sections into the local search index.</p>
            </div>

            <form onSubmit={handleAddCustomSection} className="space-y-4 text-xs font-sans">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-slate-700 font-bold uppercase tracking-wider text-[9px]">Act / Code Name (e.g., BNS 2023)</label>
                  <input
                    type="text"
                    required
                    value={newActName}
                    onChange={(e) => setNewActName(e.target.value)}
                    placeholder="Bharatiya Nyaya Sanhita, 2023"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-950 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-slate-700 font-bold uppercase tracking-wider text-[9px]">Section or Rule Number</label>
                  <input
                    type="text"
                    required
                    value={newSectionNumber}
                    onChange={(e) => setNewSectionNumber(e.target.value)}
                    placeholder="Section 45"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-950 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-700 font-bold uppercase tracking-wider text-[9px]">Section Title / Heading</label>
                <input
                  type="text"
                  required
                  value={newSectionTitle}
                  onChange={(e) => setNewSectionTitle(e.target.value)}
                  placeholder="Punishment for Dishonest Misappropriation"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-950 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-serif"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-slate-700 font-bold uppercase tracking-wider text-[9px]">Chapter Reference (Optional)</label>
                  <input
                    type="text"
                    value={newChapterName}
                    onChange={(e) => setNewChapterName(e.target.value)}
                    placeholder="Chapter XVII: Of Offences Against Property"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-950 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-slate-700 font-bold uppercase tracking-wider text-[9px]">Trial Domain Category</label>
                  <select
                    value={newSectionCategory}
                    onChange={(e) => setNewSectionCategory(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-950 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
                  >
                    {LEGAL_CATEGORIES.map(c => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-700 font-bold uppercase tracking-wider text-[9px]">Verbatim Section / Rule Content Description</label>
                <textarea
                  rows={4}
                  required
                  value={newSectionDesc}
                  onChange={(e) => setNewSectionDesc(e.target.value)}
                  placeholder="Where the accused commits criminal misappropriation of movable property, penal consequences dictate..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-950 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-serif leading-relaxed"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-700 font-bold uppercase tracking-wider text-[9px]">Statutory Explanations & Provisos (Optional)</label>
                <textarea
                  rows={2}
                  value={newExplanations}
                  onChange={(e) => setNewExplanations(e.target.value)}
                  placeholder="Explanation I: A partner converting firm asset with dishonest intent commits criminal misappropriation..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-950 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-sans"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-700 font-bold uppercase tracking-wider text-[9px]">Amendments Ledger (Optional)</label>
                <input
                  type="text"
                  value={newAmendments}
                  onChange={(e) => setNewAmendments(e.target.value)}
                  placeholder="Amended by Parliament Act 25 of 2024 to increase maximum penalty..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-950 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-700 font-bold uppercase tracking-wider text-[9px]">Search Index Tags (Comma separated list)</label>
                <input
                  type="text"
                  value={newSectionKeywords}
                  onChange={(e) => setNewSectionKeywords(e.target.value)}
                  placeholder="property, thief, dishonest intent, misappropriation"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-950 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl py-3 cursor-pointer shadow-xs font-sans text-xs"
                >
                  Confirm Indexing & Save
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddCustomModal(null)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl py-3 cursor-pointer font-sans text-xs"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showAddCustomModal === "caselaw" && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in font-sans">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-6 relative">
            <button
              onClick={() => setShowAddCustomModal(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 p-2 rounded-full transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="space-y-1">
              <h3 className="text-lg font-black text-slate-900 font-sans">Index Landmark Precedent Judgement</h3>
              <p className="text-xs text-slate-500 font-serif">Add Supreme Court or High Court landmark precedents into the searchable precedent binder.</p>
            </div>

            <form onSubmit={handleAddCustomCase} className="space-y-4 text-xs font-sans">
              <div className="space-y-1.5">
                <label className="text-slate-705 font-bold uppercase tracking-wider text-[9px]">Case Title / Cause List name</label>
                <input
                  type="text"
                  required
                  value={newCaseName}
                  onChange={(e) => setNewCaseName(e.target.value)}
                  placeholder="e.g. State of Maharashtra v. Balakrishna"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-950 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-serif font-bold text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-slate-755 font-bold uppercase tracking-wider text-[9px]">Official Law Journal Citation</label>
                  <input
                    type="text"
                    required
                    value={newCaseCitation}
                    onChange={(e) => setNewCaseCitation(e.target.value)}
                    placeholder="e.g. (2024) 4 SCC 122"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-950 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-mono"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-slate-755 font-bold uppercase tracking-wider text-[9px]">Adjudicating Bench Court</label>
                  <input
                    type="text"
                    required
                    value={newCaseCourt}
                    onChange={(e) => setNewCaseCourt(e.target.value)}
                    placeholder="Supreme Court of India"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-950 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-slate-755 font-bold uppercase tracking-wider text-[9px]">Judgment Pronouncement Date</label>
                  <input
                    type="date"
                    value={newCaseDate}
                    onChange={(e) => setNewCaseDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-955 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-slate-755 font-bold uppercase tracking-wider text-[9px]">Presiding Coram Bench / Judges</label>
                  <input
                    type="text"
                    value={newCaseJudge}
                    onChange={(e) => setNewCaseJudge(e.target.value)}
                    placeholder="Chandrachud CJ, Gavai J"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-950 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-slate-755 font-bold uppercase tracking-wider text-[9px]">Trial Category</label>
                  <select
                    value={newCaseCategory}
                    onChange={(e) => setNewCaseCategory(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-955 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
                  >
                    {LEGAL_CATEGORIES.map(c => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5 flex flex-col justify-center">
                  <span className="text-slate-700 font-bold uppercase tracking-wider text-[9px] mb-2">Precedent Authority</span>
                  <label className="inline-flex items-center gap-1.5 text-slate-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newCaseIsLandmark}
                      onChange={(e) => setNewCaseIsLandmark(e.target.checked)}
                      className="h-4 w-4 rounded text-blue-600 focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
                    />
                    <span>Yes, Flag as Primary Landmark Authority</span>
                  </label>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-700 font-bold uppercase tracking-wider text-[9px]">Judgment Summary of Facts & Ratio Decidendi</label>
                <textarea
                  rows={4}
                  required
                  value={newCaseSummary}
                  onChange={(e) => setNewCaseSummary(e.target.value)}
                  placeholder="Briefly state facts, legal question, holding decisions, and analytical rationale..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-950 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-serif leading-relaxed text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-700 font-bold uppercase tracking-wider text-[9px]">Key Legal Directives / Ratios (One per line)</label>
                <textarea
                  rows={3}
                  value={newCasePrinciples}
                  onChange={(e) => setNewCasePrinciples(e.target.value)}
                  placeholder="Requirement of proof beyond reasonable doubt is heightened...&#10;Subsequent amendments cannot alter the vested contractual rights..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-905 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 leading-relaxed font-serif text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-slate-700 font-bold uppercase tracking-wider text-[9px]">Applicable Sections Cites (Comma separated)</label>
                  <input
                    type="text"
                    value={newCaseAppSections}
                    onChange={(e) => setNewCaseAppSections(e.target.value)}
                    placeholder="BNS Section 300, BNSS Section 438"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-950 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-mono"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-slate-700 font-bold uppercase tracking-wider text-[9px]">Similar Precedents (Comma separated)</label>
                  <input
                    type="text"
                    value={newCasePrecedents}
                    onChange={(e) => setNewCasePrecedents(e.target.value)}
                    placeholder="Mithu v. State of Punjab, Kehar Singh v. State"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-950 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-serif"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl py-3 cursor-pointer shadow-xs font-sans text-xs"
                >
                  Confirm Indexing & Save
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddCustomModal(null)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl py-3 cursor-pointer font-sans text-xs"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
