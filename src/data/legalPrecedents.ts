export interface StatutorySection {
  id: string;
  actName: string;
  sectionNumber: string;
  title: string;
  description: string;
  keyKeywords: string[];
  category: string;
  chapterName?: string;
  explanationsProvisos?: string;
  amendmentsNotifications?: string;
  schedules?: string;
}

export interface CaseLaw {
  id: string;
  caseName: string;
  citation: string;
  court: string;
  judgmentDate: string;
  summary: string;
  keyPrinciples: string[];
  applicableSections: string[]; // cross-reference section descriptions or sectionNumbers
  relatedPrecedents: string[]; // citations/names of related judgments
  category: string;
  isLandmark: boolean;
  recentUpdate?: string;
  judgeName?: string;
}

export interface LegalCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export const LEGAL_CATEGORIES: LegalCategory[] = [
  {
    id: "Family",
    name: "Family Law",
    description: "Marriage dissolution, Hindu and Special matrimonial laws, child custody, alimony, and partition suits.",
    icon: "Heart"
  },
  {
    id: "Criminal",
    name: "Criminal Law",
    description: "Offenses under BNS, BNSS procedural acts, bails, trial stages, and fundamental liberty protections.",
    icon: "ShieldAlert"
  },
  {
    id: "Civil",
    name: "Civil Law",
    description: "Contractual breach damages, Specific Relief act, civil dispute procedure, and general civil tort liability.",
    icon: "Balance"
  },
  {
    id: "Property",
    name: "Property Law",
    description: "Immovable estate transfers, GPA validation, easements, land registry deeds, and partition disputes.",
    icon: "Home"
  },
  {
    id: "Corporate",
    name: "Corporate Law",
    description: "Companies Act compliance, board governance, minority shareholder protection, and corporate restructuring.",
    icon: "Building"
  },
  {
    id: "Consumer",
    name: "Consumer Law",
    description: "Defect in goods, deficiency in service, unfair trade practices, and consumer forum filings.",
    icon: "ShoppingBag"
  },
  {
    id: "Labor",
    name: "Labour & Employment Law",
    description: "Industrial relations code, unlawful retrenchments, salary compliance, and mandatory worker benefits.",
    icon: "Users2"
  },
  {
    id: "Tax",
    name: "Tax Law",
    description: "Corporate taxation, offshore capital transfer rules, business deductions, and tax dispute litigation.",
    icon: "Percent"
  },
  {
    id: "Intellectual Property",
    name: "Intellectual Property Law",
    description: "Patent evergreening barriers, trademarks originality, fair dealing exemptions, and copyright protection.",
    icon: "Lightbulb"
  },
  {
    id: "Cyber",
    name: "Cyber Law",
    description: "Information Technology Act, data breach liabilities, electronic verification under BSA, and privacy laws.",
    icon: "Globe"
  },
  {
    id: "Constitutional",
    name: "Constitutional Law",
    description: "Fundamental rights enforcement, writ jurisdictions (Article 226/32), federal distribution of power.",
    icon: "Balance"
  },
  {
    id: "Banking",
    name: "Banking & Finance Law",
    description: "SARFAESI debt recovery, RBI regulatory guidelines, banking regulations, and negotiable instrument breaches.",
    icon: "Percent"
  },
  {
    id: "Arbitration",
    name: "Arbitration Law",
    description: "Arbitral awards, mediation rules, international commercial arbitrations, and interim measures.",
    icon: "Users2"
  },
  {
    id: "Environmental",
    name: "Environmental Law",
    description: "National Green Tribunal (NGT) audits, Forest conservation rules, pollution controls, and air/water acts.",
    icon: "Globe"
  },
  {
    id: "Real Estate",
    name: "Real Estate Law",
    description: "RERA authority filings, plot delay compensation, builder agreements, and flat buyer associations.",
    icon: "Building"
  },
  {
    id: "Insurance",
    name: "Insurance Law",
    description: "IRDAI structures, claim denials, active policies indemnity clauses, and life or accident dockets.",
    icon: "ShieldAlert"
  },
  {
    id: "Telecom",
    name: "Telecom Law",
    description: "Spectrum sharing agreements, TRAI guidance directives, cybersecurity liabilities, and licensing rules.",
    icon: "Globe"
  },
  {
    id: "Competition",
    name: "Competition Law",
    description: "Anti-competitive agreements, anti-trust litigation, abuse of dominance, and CCI notification codes.",
    icon: "Building"
  },
  {
    id: "Securities",
    name: "Securities & Capital Markets",
    description: "SEBI disclosure regulations, insider trading protections, corporate listing codes, and mutual fund filings.",
    icon: "Balance"
  }
];

export const STATUTORY_SECTIONS: StatutorySection[] = [
  // 1. Family Law
  {
    id: "sec-fam-1",
    actName: "Hindu Marriage Act, 1955",
    sectionNumber: "Section 13-B",
    title: "Divorce by Mutual Consent",
    description: "Provides for a petition for dissolution of marriage by a decree of divorce to be presented to the district court by both parties together, on the ground that they have been living separately for a period of one year or more, and that they have not been able to live together.",
    keyKeywords: ["divorce", "mutual consent", "marriage", "separation", "dissolution"],
    category: "Family"
  },
  {
    id: "sec-fam-2",
    actName: "Special Marriage Act, 1954",
    sectionNumber: "Section 28",
    title: "Divorce by Mutual Consent in Secular Marriage",
    description: "Allows registered inter-faith marriages to be dissolved by mutual consent on filing joint declarations after a period of split cohabitation of at least one year.",
    keyKeywords: ["inter-faith", "secular", "marriage", "separation", "dissolution"],
    category: "Family"
  },
  {
    id: "sec-fam-3",
    actName: "Hindu Marriage Act, 1955",
    sectionNumber: "Section 9",
    title: "Restitution of Conjugal Rights",
    description: "When either the husband or the wife has, without reasonable excuse, withdrawn from the society of the other, the aggrieved party may apply, by petition to the district court, for restitution of conjugal rights.",
    keyKeywords: ["restitution", "conjugal rights", "matrimonial", "petition"],
    category: "Family"
  },

  // 2. Criminal Law
  {
    id: "sec-crim-1",
    actName: "Bharatiya Nyaya Sanhita, 2023 (BNS)",
    sectionNumber: "Section 103",
    title: "Punishment for Murder",
    description: "Specifies that whoever commits murder shall be punished with death or imprisonment for life, and shall also be liable to fine. Replaces Section 302 of the legacy Indian Penal Code (IPC), and includes specific penal structures for group-based offenses.",
    keyKeywords: ["murder", "homicide", "bns", "penal", "punishment"],
    category: "Criminal"
  },
  {
    id: "sec-crim-2",
    actName: "Bharatiya Nagarik Suraksha Sanhita, 2023 (BNSS)",
    sectionNumber: "Section 482",
    title: "Directions for Grant of Bail to Person Anticipating Arrest",
    description: "Replaces Section 438 of the legacy Code of Criminal Procedure (CrPC). Empowers High Courts and Sessions Courts to direct the grant of anticipatory bail to individuals who have a reasonable apprehension of arrest on accusation of having committed non-bailable offences.",
    keyKeywords: ["bail", "anticipatory", "bnss", "arrest", "court"],
    category: "Criminal"
  },
  {
    id: "sec-crim-3",
    actName: "Bharatiya Sakshya Adhiniyam, 2023 (BSA)",
    sectionNumber: "Section 63",
    title: "Admissibility of Electronic Records",
    description: "Establishes conditions for the admissibility of electronic evidence in judicial proceedings. Replaces Section 65-B of the legacy Indian Evidence Act, 1872. Outlines requirements for certificates of service verifying machine integrity and data authenticity.",
    keyKeywords: ["evidence", "electronic record", "bsa", "certificate", "admissibility", "data"],
    category: "Criminal"
  },
  {
    id: "sec-crim-4",
    actName: "Bharatiya Nagarik Suraksha Sanhita, 2023 (BNSS)",
    sectionNumber: "Section 173",
    title: "Information in Cognizable Cases",
    description: "Relates to the entry of information on cognizable offenses (FIR registration). Introduces electronic communication/e-FIR channels, allowing zero-FIR setups and mandate timelines for inquiry prior to arrest.",
    keyKeywords: ["fir", "registration", "cognizable", "e-fir", "investigation"],
    category: "Criminal"
  },

  // 3. Civil Law
  {
    id: "sec-civ-1",
    actName: "Code of Civil Procedure, 1908 (CPC)",
    sectionNumber: "Section 11",
    title: "Res Judicata",
    description: "Prevents any court from trying any suit or issue in which the matter directly and substantially in issue has been directly and substantially in issue in a former suit between the same parties, litigating under the same title in a court of competent jurisdiction.",
    keyKeywords: ["res judicata", "civil suit", "jurisdiction", "former suit", "bars", "cpc"],
    category: "Civil"
  },
  {
    id: "sec-civ-2",
    actName: "Indian Contract Act, 1872",
    sectionNumber: "Section 73",
    title: "Compensation for Loss or Damage caused by Breach of Contract",
    description: "Entitles the party who suffers from a breach of contract to receive, from the party who broke the contract, compensation for any loss or damage caused thereby, which naturally arose in the usual course of things, or which the parties knew to be likely to result.",
    keyKeywords: ["contract", "breach", "damages", "liquidated", "indemnity", "unusual"],
    category: "Civil"
  },
  {
    id: "sec-civ-3",
    actName: "Specific Relief Act, 1963",
    sectionNumber: "Section 10",
    title: "Specific Performance in Respect of Contracts",
    description: "Subject to provisions, the specific performance of a contract shall be enforced by the court unless specific statutory exceptions apply, making specific performance a regular rule rather than an exception.",
    keyKeywords: ["specific performance", "contract", "enforcement", "injunction"],
    category: "Civil"
  },

  // 4. Property Law
  {
    id: "sec-prop-1",
    actName: "Transfer of Property Act, 1882",
    sectionNumber: "Section 53-A",
    title: "Part Performance Protection",
    description: "Protects a transferee's possession under a contract of transfer for consideration, in writing, of any immovable property, even if the instrument of transfer has not been registered in accordance with local filing acts.",
    keyKeywords: ["property", "part performance", "possession", "registration", "immovable"],
    category: "Property"
  },
  {
    id: "sec-prop-2",
    actName: "Registration Act, 1908",
    sectionNumber: "Section 17",
    title: "Documents of Which Registration is Compulsory",
    description: "Declares that non-testamentary instruments which purport or operate to create, declare, assign, limit or extinguish any right or title in immovable property worth 100 rupees and upwards must undergo compulsory registration.",
    keyKeywords: ["deed", "registration", "title", "gift deed", "sale agreement", "compulsory"],
    category: "Property"
  },
  {
    id: "sec-prop-3",
    actName: "Transfer of Property Act, 1882",
    sectionNumber: "Section 54",
    title: "Definition of 'Sale' and Mode of Transfer",
    description: "Defines 'Sale' as a transfer of ownership in exchange for a price paid or promised or part-paid. Specifies that in case of tangible immovable property of value one hundred rupees and upwards, transfer can only be made by a registered instrument.",
    keyKeywords: ["sale", "conveyance", "deed", "transfer", "immovable"],
    category: "Property"
  },

  // 5. Corporate Law
  {
    id: "sec-corp-1",
    actName: "Companies Act, 2013",
    sectionNumber: "Section 241",
    title: "Application to Tribunal for Relief in Cases of Oppression",
    description: "Any member has the right to apply to the National Company Law Tribunal (NCLT) for relief if the affairs of the company are being conducted in a manner prejudicial to public interest, members, or interests of the company.",
    keyKeywords: ["corporate", "tribunal", "oppression", "minority rights", "mismanagement", "nclt"],
    category: "Corporate"
  },
  {
    id: "sec-corp-2",
    actName: "Companies Act, 2013",
    sectionNumber: "Section 135",
    title: "Corporate Social Responsibility (CSR)",
    description: "Requires companies exceeding specified net worth, turnover, or net profit limits to constitute a CSR Committee and ensure that the company spends at least two percent of average net profits on corporate social responsibility actions.",
    keyKeywords: ["csr", "governance", "compliance", "board", "profits"],
    category: "Corporate"
  },
  {
    id: "sec-corp-3",
    actName: "Companies Act, 2013",
    sectionNumber: "Section 186",
    title: "Loans and Investment by Company",
    description: "Specifies limits and regulations on the loan amounts, guarantees, security, and acquisition of securities by companies, requiring special board permissions and auditor filings.",
    keyKeywords: ["loan", "investment", "audit", "guarantee", "board resolution"],
    category: "Corporate"
  },

  // 6. Consumer Law
  {
    id: "sec-cons-1",
    actName: "Consumer Protection Act, 2019",
    sectionNumber: "Section 2(11)",
    title: "Definition of Deficiency in Service",
    description: "Defines deficiency as any fault, imperfection, shortcoming or inadequacy in the quality, nature and manner of performance which is required to be maintained by any person in pursuance of a contract or otherwise in relation to any service.",
    keyKeywords: ["deficiency", "service quality", "damages", "faulty", "consumer rights"],
    category: "Consumer"
  },
  {
    id: "sec-cons-2",
    actName: "Consumer Protection Act, 2019",
    sectionNumber: "Section 35",
    title: "Manner in Which Complaint Shall be Filed",
    description: "Lays down the strict procedure and simplified guidelines for filing an action or complaints before the District Consumer Commission regarding goods defects or services deficiencies.",
    keyKeywords: ["complaint", "procedural", "forum", "compensation", "mediation", "district commission"],
    category: "Consumer"
  },

  // 7. Labor Law
  {
    id: "sec-lab-1",
    actName: "Industrial Disputes Act, 1947",
    sectionNumber: "Section 2(j)",
    title: "Comprehensive Meaning of 'Industry'",
    description: "Defines an industry as any systematic activity carried on by co-operation between an employer and workpeople for the production, supply or distribution of goods or services, with a view to satisfy human wants or desires.",
    keyKeywords: ["industry", "dispute", "employer", "systematic activity", "employee"],
    category: "Labor"
  },
  {
    id: "sec-lab-2",
    actName: "Industrial Disputes Act, 1947",
    sectionNumber: "Section 25-F",
    title: "Conditions Precedent to Retrenchment of Workmen",
    description: "Mandates that no workman employed in any continuous service for not less than one year shall be retrenched until they receive one month's notice in writing or equivalent pay, along with continuous severance compensation.",
    keyKeywords: ["retrenchment", "severance", "workman", "layoff", "compensation"],
    category: "Labor"
  },
  {
    id: "sec-lab-3",
    actName: "Industrial Relations Code, 2020",
    sectionNumber: "Section 84",
    title: "Unified Layoff and Retrenchment Terms",
    description: "Modern code incorporating rules for prior permission from the government before laying off, retrenching, or closing industrial establishments with 300 or more workers, replacing absolute sections of the 1947 Act.",
    keyKeywords: ["labour code", "retrenchment", "industrial relations", "workforce", "layoff"],
    category: "Labor"
  },

  // 8. Tax Law
  {
    id: "sec-tax-1",
    actName: "Income Tax Act, 1961",
    sectionNumber: "Section 9(1)(i)",
    title: "Income Deemed to Accrue or Arise in India",
    description: "States that all income accruing or arising, whether directly or indirectly, through or from any business connection in India, or through or from any property or asset in India, shall be subject to tax assessments, including indirect offshore asset transmissions.",
    keyKeywords: ["tax", "deemed", "capital gains", "offshore restructure", "indirect transfer", "business connection"],
    category: "Tax"
  },
  {
    id: "sec-tax-2",
    actName: "Income Tax Act, 1961",
    sectionNumber: "Section 37",
    title: "General Business Expenditure Allowability",
    description: "Provides deduction for any expenditure not being capital, personal, or illegal, laid out wholly and exclusively for the purposes of the business or profession during the assessment cycle.",
    keyKeywords: ["deduction", "business expenditure", "tax audit", "exemption", "allowability"],
    category: "Tax"
  },

  // 9. Intellectual Property Law
  {
    id: "sec-ip-1",
    actName: "Patents Act, 1970",
    sectionNumber: "Section 3(d)",
    title: "Non-Patentable Material: Evergreening Bar",
    description: "Excludes from patentability the mere discovery of a new form of a known substance which does not result in the enhancement of the known efficacy of that substance, or the mere discovery of any new property or new use, preventing artificial monopoly extensions.",
    keyKeywords: ["patent", "evergreening", "efficacy", "pharmaceuticals", "monopoly", "novartis"],
    category: "Intellectual Property"
  },
  {
    id: "sec-ip-2",
    actName: "Copyright Act, 1957",
    sectionNumber: "Section 52",
    title: "Fair Dealing Exemptions",
    description: "Defines positive acts that do not constitute an infringement of copyright, including fair dealing with a literary, dramatic, musical or artistic work for private use, research, criticism, news reporting, or education.",
    keyKeywords: ["copyright", "fair dealing", "exceptions", "educational", "infringement"],
    category: "Intellectual Property"
  },

  // 10. Cyber Law
  {
    id: "sec-cyb-1",
    actName: "Information Technology Act, 2000",
    sectionNumber: "Section 43-A",
    title: "Compensation for Failure to Protect Sensitive Personal Data",
    description: "Where a body corporate possessing, dealing or handling any sensitive personal data or information in a computer resource which it owns, controls or operates, is negligent in implementing reasonable security practices, it is liable to pay damages.",
    keyKeywords: ["data breach", "negligence", "compensation", "sensitive data", "privacy", "body corporate"],
    category: "Cyber"
  },
  {
    id: "sec-cyb-2",
    actName: "Information Technology Act, 2000",
    sectionNumber: "Section 69-A",
    title: "Power to Issue Directions for Blocking Public Access of Information",
    description: "Empowers central authorities to block public web content or access in the interest of the sovereignty and integrity of India, defense of India, security of the State, or public order.",
    keyKeywords: ["blocking order", "censorship", "sovereignty", "national security", "it act", "blocking"],
    category: "Cyber"
  }
];

export const CASE_LAWS: CaseLaw[] = [
  // 1. Family Law Case Precedents
  {
    id: "case-fam-1",
    caseName: "Bipinchandra Jaisinghbhai Shah v. Prabhavati",
    citation: "1957 AIR 176",
    court: "Supreme Court of India",
    judgmentDate: "1956-11-08",
    summary: "A landmark judgment establishing the legal essentials of 'desertion' as a ground for matrimonial relief. The Court held that desertion requires two essential elements: the factum of separation and the animus deserendi (intention to desert), both occurring concurrently without the other spouse's consent.",
    keyPrinciples: ["Desertion requires both physical separation and intent to desert", "The burden of proof remains on the spouse alleging desertion", "No consent to split must exist"],
    applicableSections: ["Hindu Marriage Act, 1955 - Section 13-B", "Hindu Marriage Act, 1955 - Section 9"],
    relatedPrecedents: ["Lachman Utamchand Kirpalani v. Meena (1964)"],
    category: "Family",
    isLandmark: true
  },
  {
    id: "case-fam-2",
    caseName: "Sureshter Devi v. Om Prakash",
    citation: "1991 (1) SCR 274",
    court: "Supreme Court of India",
    judgmentDate: "1991-02-12",
    summary: "Addresses mutual consent divorce under the Hindu Marriage Act. The Court ruled that agreement to seek a mutual divorce must persist throughout the cooling-off period, and any party may withdraw their consent unilaterally at any time prior to the final decree of dissolution.",
    keyPrinciples: ["Mutual consent must be present during the entire waiting period", "Withdrawal of petition consent is permitted prior to final adjudication", "Cooling-off timeline balances compromise"],
    applicableSections: ["Hindu Marriage Act, 1955 - Section 13-B"],
    relatedPrecedents: ["Amardeep Singh v. Harveen Kaur (2017)"],
    category: "Family",
    isLandmark: false,
    recentUpdate: "Recent citations in State registries confirm the six-month statutory waiting window can now be waived under extraordinary circumstances."
  },

  // 2. Criminal Law Cases
  {
    id: "case-crim-1",
    caseName: "K.M. Nanavati v. State of Maharashtra",
    citation: "1962 AIR 605",
    court: "Supreme Court of India",
    judgmentDate: "1961-11-24",
    summary: "A classic criminal appeal concerning the bounds of 'grave and sudden provocation'. The Navy Commander was tried for killing his wife's lover. The Court clarified that the test is whether a reasonable person, in similar shoes, would temporarily lose power of self-control, and calculated intervals between provocation and act negate suddenness.",
    keyPrinciples: ["Interval for passion cooling defeats sudden provocation exception", "Revenge motives negate the exception to murder under Section 103 BNS / Section 300 IPC", "Jury systems dismantled in India post-judgment"],
    applicableSections: ["Bharatiya Nyaya Sanhita, 2023 (BNS) - Section 103"],
    relatedPrecedents: ["State of AP v. Rayavarapu Punnayya (1976)"],
    category: "Criminal",
    isLandmark: true
  },
  {
    id: "case-crim-2",
    caseName: "Gurbaksh Singh Sibbia v. State of Punjab",
    citation: "1980 AIR 1632",
    court: "Supreme Court of India",
    judgmentDate: "1980-04-09",
    summary: "A constitution bench ruling outlining wide-reaching guidelines for anticipatory bail under Section 438 of CrPC (now Section 482 of BNSS). Placed significant emphasis on personal liberty, stating court powers to grant anticipatory relief must not be choked by narrow boundaries or technical requirements.",
    keyPrinciples: ["Apprehension of arrest must be based on concrete, objective facts", "Anticipatory bails should not unnecessarily restrict trial investigation", "Liberty protection under Article 21 out-values procedural delays"],
    applicableSections: ["Bharatiya Nagarik Suraksha Sanhita, 2023 (BNSS) - Section 482"],
    relatedPrecedents: ["Sushila Aggarwal v. State (NCT of Delhi) (2020)"],
    category: "Criminal",
    isLandmark: true,
    recentUpdate: "2020 Sushila Supreme Court decision confirmed anticipatory bail does not carry a hard fixed expiration timeline and persists until the end of trial."
  },

  // 3. Civil Law Cases
  {
    id: "case-civ-1",
    caseName: "Lalman Shukla v. Gauri Datt",
    citation: "1913 11 ALJ 489",
    court: "Allahabad High Court",
    judgmentDate: "1913-05-18",
    summary: "A core contracts precedent regarding offer and acceptance. The defendant's nephew went missing; plaintiff went searching and found him. Later, plaintiff learned of a reward offer and filed suit. The court dismissed, stating a contract requires knowledge of offer preceding performance.",
    keyPrinciples: ["Offer must be communicated before acceptance is legally possible", "No private contract can arise without meeting of minds", "Gratuitous service generates no debt claims"],
    applicableSections: ["Indian Contract Act, 1872 - Section 73"],
    relatedPrecedents: ["Fitch v. Snedaker (NY, 1868)"],
    category: "Civil",
    isLandmark: true
  },
  {
    id: "case-civ-2",
    caseName: "Hadley v. Baxendale",
    citation: "[1854] EWHC J70",
    court: "Court of Exchequer (United Kingdom)",
    judgmentDate: "1854-02-23",
    summary: "The global foundational precedent on remoteness of contract damages. Mill shaft broke, shipping delayed, mill remained idle. Defendant didn't know delay would stop mill. Held: Damages must be such as may reasonably be supposed to have been in contemplation of both parties at time of contracting.",
    keyPrinciples: ["Remoteness of damages checks for natural course of events", "Special circumstances must be expressly communicated prior to contract signing", "No general compensation for unforeseeable down-time casualties"],
    applicableSections: ["Indian Contract Act, 1872 - Section 73"],
    relatedPrecedents: ["Victoria Laundry v. Newman Industries (UK, 1949)"],
    category: "Civil",
    isLandmark: true
  },

  // 4. Property Law Cases
  {
    id: "case-prop-1",
    caseName: "Suraj Lamp & Industries v. State of Haryana",
    citation: "(2012) 1 SCC 656",
    court: "Supreme Court of India",
    judgmentDate: "2011-10-11",
    summary: "Invaluable decision clarifying the limits of real estate transfers of title. The Court held that transfer of immovable estates can only be achieved via registered deeds of conveyance. Power of Attorney, Sale Agreements, and Wills do not transfer title.",
    keyPrinciples: ["General Power of Attorney (GPA) transfers agency, not ownership", "Registered deed of conveyance is mandatory for legal title transfer", "Deception of local land revenue acts is severely restricted"],
    applicableSections: ["Transfer of Property Act, 1882 - Section 53-A", "Registration Act, 1908 - Section 17", "Transfer of Property Act, 1882 - Section 54"],
    relatedPrecedents: ["State of Rajasthan v. Basant Nahata (2005)"],
    category: "Property",
    isLandmark: true
  },

  // 5. Corporate Law Cases
  {
    id: "case-corp-1",
    caseName: "Salomon v. A. Salomon & Co. Ltd",
    citation: "[1897] AC 22",
    court: "House of Lords (United Kingdom)",
    judgmentDate: "1896-11-16",
    summary: "The cornerstone corporate precedent validating the doctrine of separate legal personality. The promoter sold his leather business to his company, accepting shares and debentures. Company crashed; non-secured creditors claimed priority over promoter's debentures. The Lords ruled the corporate entity is separate.",
    keyPrinciples: ["Corporate entity is separate and distinct from its members", "Secured debenture holders take priority in general bankruptcy liquidity", "No personal liability exists for directors under standard corporate shells"],
    applicableSections: ["Companies Act, 2013 - Section 241"],
    relatedPrecedents: ["Macaura v. Northern Assurance Co. Ltd (1925)"],
    category: "Corporate",
    isLandmark: true
  },
  {
    id: "case-corp-2",
    caseName: "Tata Consultancy Services v. Cyrus Investments",
    citation: "Civil Appeal No. 2402 of 2021",
    court: "Supreme Court of India",
    judgmentDate: "2021-03-26",
    summary: "The prime dispute concerning Cyrus Mistry's dismissal as Tata chairman. The Court examined what constitutes oppression of minority shareholders under Section 241/242, deciding that removing a chairman from board seats does not equate to oppression or mismanagement.",
    keyPrinciples: ["Oppression claims require continuous conduct prejudicial to minority", "Board room seat removals do not generate claims of generic oppression", "Judicial interference in standard corporate governance is highly limited"],
    applicableSections: ["Companies Act, 2013 - Section 241"],
    relatedPrecedents: ["Shanti Prasad Jain v. Kalinga Tubes (1965)"],
    category: "Corporate",
    isLandmark: false,
    recentUpdate: "Recent amendments to NCLT rules have set strict timeline caps within which oppression trials must finish."
  },

  // 6. Consumer Law Cases
  {
    id: "case-cons-1",
    caseName: "Indian Medical Association v. V.P. Shantha",
    citation: "1996 AIR 550",
    court: "Supreme Court of India",
    judgmentDate: "1995-11-13",
    summary: "A major consumer rights expansion. The Court held that medical professions and hospital treatment fall under the definitions of 'service' inside the Consumer Protection Act. Defective surgeries and medical negligence generate civil damages.",
    keyPrinciples: ["Medical services represent actionable commercial service agreements", "No absolute immunity exists for practicing medical staff under negligence claims", "Free services do not escape consumer action if paid services fund them"],
    applicableSections: ["Consumer Protection Act, 2019 - Section 2(11)"],
    relatedPrecedents: ["Jacob Mathew v. State of Punjab (2005)"],
    category: "Consumer",
    isLandmark: true
  },

  // 7. Labor Law Cases
  {
    id: "case-lab-1",
    caseName: "Bangalore Water Supply v. A. Rajappa",
    citation: "1978 AIR 548",
    court: "Supreme Court of India",
    judgmentDate: "1978-02-21",
    summary: "Establishing the famous 'Triple Test' to determine whether an enterprise qualifies as an 'industry' under labor acts. Industry exists if there is a systematic activity, co-operation of workers and employers, and target service distribution.",
    keyPrinciples: ["Triple test regulates systematic corporate activities with labor", "Profit motives are not required to form an industry", "Clerical, Municipal, and educational staff qualify for collective unions"],
    applicableSections: ["Industrial Disputes Act, 1947 - Section 2(j)"],
    relatedPrecedents: ["State of UP v. Jai Bir Singh (2005)"],
    category: "Labor",
    isLandmark: true
  },
  {
    id: "case-lab-2",
    caseName: "Lal & Co. v. Union of India",
    citation: "(2024) LLN 382",
    court: "Delhi High Court",
    judgmentDate: "2024-02-15",
    summary: "Addresses structural updates under the Industrial Relations Code, 2020. Validated government requirements on mandatory prior permissions for retrenchments in larger industrial establishments.",
    keyPrinciples: ["Thresholds for layoffs are governed under unified code updates", "Worker union notification timelines are compulsory", "Retrenchment without compliance triggers statutory reinstatement"],
    applicableSections: ["Industrial Relations Code, 2020 - Section 84"],
    relatedPrecedents: ["Bangalore Water Supply v. A. Rajappa"],
    category: "Labor",
    isLandmark: false
  },

  // 8. Tax Law Cases
  {
    id: "case-tax-1",
    caseName: "Vodafone International Holdings v. Union of India",
    citation: "(2012) 6 SCC 613",
    court: "Supreme Court of India",
    judgmentDate: "2012-01-20",
    summary: "Analyzing corporate share transfers occurring outside the jurisdiction but affecting domestic assets. The Supreme Court decided tax authorities had no right to assess capital transmission gains on transfers between offshore holding firms.",
    keyPrinciples: ["Direct or indirect domestic taxation requires explicit statutory wording", "Offshore structural holding is valid tax-planning", "Judicial re-characterization of legitimate transactions is restricted"],
    applicableSections: ["Income Tax Act, 1961 - Section 9(1)(i)"],
    relatedPrecedents: ["Union of India v. Azadi Bachao Andolan (2003)"],
    category: "Tax",
    isLandmark: true,
    recentUpdate: "This led to the retrospective tax amendment of 2012, which was subsequently repealed in 2021."
  },

  // 9. Intellectual Property Cases
  {
    id: "case-ip-1",
    caseName: "Novartis AG v. Union of India",
    citation: "(2013) 6 SCC 1",
    court: "Supreme Court of India",
    judgmentDate: "2013-04-01",
    summary: "Critical international patents dispute regarding Novartis's leukemia drug Glivec. Novartis sought patent protection for a beta crystalline form, claiming increased bioavailability. The court rejected the application, ruling that incremental chemical variations failing to demonstrate 'therapeutical efficacy' do not qualify under Section 3(d).",
    keyPrinciples: ["Enhanced bioavailability does not equate to increased legal efficacy", "Evergreening patent strategies by big-pharma are strictly barred", "Public medicine access outweighs chemical product monopoly rights"],
    applicableSections: ["Patents Act, 1970 - Section 3(d)"],
    relatedPrecedents: ["Monsanto v. Nuziveedu Seeds (2019)"],
    category: "Intellectual Property",
    isLandmark: true
  },
  {
    id: "case-ip-2",
    caseName: "Eastern Book Company v. D.B. Modak",
    citation: "(2008) 1 SCC 1",
    court: "Supreme Court of India",
    judgmentDate: "2007-12-12",
    summary: "Establishes copyright eligibility thresholds for public filings collections. EBC parsed court opinions, adding headnotes and formatting. Modak copied EBC registries. The Court rejected simple 'sweat of the brow' labor, demanding a minimum 'modicum of selection and creativity'.",
    keyPrinciples: ["Standard copyright requires minimum creative modifications", "Sweat of the brow claims do not generate author rights", "Compilation formatting is protected but raw case law reports are free"],
    applicableSections: ["Copyright Act, 1957 - Section 52"],
    relatedPrecedents: ["Feist Publications v. Rural Telephone (US, 1991)"],
    category: "Intellectual Property",
    isLandmark: true
  },

  // 10. Cyber Law Cases
  {
    id: "case-cyb-1",
    caseName: "Shreya Singhal v. Union of India",
    citation: "(2015) 5 SCC 1",
    court: "Supreme Court of India",
    judgmentDate: "2015-03-24",
    summary: "Landmark fundamental rights and Internet freedom case. Two individuals were arrested under Section 66-A for digital posts criticized as offensive. The Court found Section 66-A unconstitutional because it cast a vast, chilling net over free speech on web services, leaving no clear definitions of legal boundaries.",
    keyPrinciples: ["Chilling effects on digital speech invalidate vague IT provisions", "Freedom of speech extends fully to social/internet resources", "Intermediary safe harbors require judicial blocking notices first"],
    applicableSections: ["Information Technology Act, 2000 - Section 69-A"],
    relatedPrecedents: ["Kartar Singh v. State of Punjab (1994)"],
    category: "Cyber",
    isLandmark: true
  },
  {
    id: "case-cyb-2",
    caseName: "Justice K. S. Puttaswamy v. Union of India",
    citation: "(2017) 10 SCC 1",
    court: "Supreme Court of India",
    judgmentDate: "2017-08-24",
    summary: "Foundational privacy right supreme ruling. A nine-judge bench unanimously declared that Article 21's Right to Life inherently encompasses the Fundamental Right to Privacy, extending directly to electronic tracking, state surveillance, and biometric databases.",
    keyPrinciples: ["Privacy is an essential right under civil liberty definitions", "State data processing must satisfy proportionality tests", "Invaluable framework for data protection legislative acts"],
    applicableSections: ["Information Technology Act, 2000 - Section 43-A"],
    relatedPrecedents: ["Kharak Singh v. State of UP (1963)"],
    category: "Cyber",
    isLandmark: true,
    recentUpdate: "This ruling directly seeded the enactment of the Digital Personal Data Protection Act of 2023."
  },
  {
    id: "case-cyb-3",
    caseName: "Arjun Panditrao Khotkar v. Kailash Kushanrao Gorantyal",
    citation: "(2020) 7 SCC 1",
    court: "Supreme Court of India",
    judgmentDate: "2020-07-14",
    summary: "Affirmed that the certificate under Section 65-B(4) (now Section 63 of Bharatiya Sakshya Adhiniyam, BSA) is a condition precedent to the admissibility of evidence by way of electronic record in trial courts.",
    keyPrinciples: ["Certificate requirement for electronic devices is mandatory", "Oral evidence cannot substitute the written digital certification", "Active measures must be taken to request electronic records timely during discovery"],
    applicableSections: ["Bharatiya Sakshya Adhiniyam, 2023 (BSA) - Section 63", "Information Technology Act, 2000 - Section 43-A"],
    relatedPrecedents: ["Anvar P.V. v. P.K. Basheer (2014)", "Shafhi Mohammad v. State of Himachal Pradesh (2018)"],
    category: "Cyber",
    isLandmark: true
  }
];
