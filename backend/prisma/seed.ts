import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...");

  // ============================================
  // 1. CREATE MAJORS (Smjerovi)
  // ============================================
  const majors = await Promise.all([
    prisma.major.upsert({
      where: { code: "COMP" },
      update: {},
      create: {
        name: "Računarstvo",
        code: "COMP",
        description: "Smjer računarstva i softverskog inženjeringa",
        duration: 4,
      },
    }),
    prisma.major.upsert({
      where: { code: "IT" },
      update: {},
      create: {
        name: "Informacione tehnologije",
        code: "IT",
        description: "Smjer informacionih tehnologija i mrežnih sistema",
        duration: 4,
      },
    }),
    prisma.major.upsert({
      where: { code: "ACFI" },
      update: {},
      create: {
        name: "Računovodstvo i finansije",
        code: "ACFI",
        description: "Smjer računovodstva, finansija i poslovne ekonomije",
        duration: 4,
      },
    }),
  ]);

  console.log("✅ Created 3 majors");

  // ============================================
  // 2. CREATE YEAR PLANS (8 semestara po smjeru)
  // ============================================
  const yearPlans: any = {};

  for (const major of majors) {
    for (let year = 1; year <= 4; year++) {
      for (let semester = 1; semester <= 2; semester++) {
        const key = `${major.code}_Y${year}_S${semester}`;
        yearPlans[key] = await prisma.yearPlan.upsert({
          where: {
            majorId_year_semester: {
              majorId: major.id,
              year,
              semester,
            },
          },
          update: {},
          create: {
            majorId: major.id,
            year,
            semester,
          },
        });
      }
    }
  }

  console.log("✅ Created 24 year plans (3 majors × 4 years × 2 semesters)");

  // ============================================
  // 3. DEFINE SUBJECTS PER MAJOR
  // ============================================

  // ========== RAČUNARSTVO (COMP) ==========
  const compSubjects = [
    // GODINA 1 - Semestar 1
    {
      name: "Matematička analiza 1",
      code: "COMP101",
      ects: 8,
      year: 1,
      semester: 1,
      isElective: false,
    },
    {
      name: "Uvod u programiranje (C++)",
      code: "COMP102",
      ects: 7,
      year: 1,
      semester: 1,
      isElective: false,
    },
    {
      name: "Računarska arhitektura",
      code: "COMP103",
      ects: 6,
      year: 1,
      semester: 1,
      isElective: false,
    },
    {
      name: "Diskretna matematika",
      code: "COMP104",
      ects: 6,
      year: 1,
      semester: 1,
      isElective: false,
    },
    {
      name: "Tehnički engleski jezik",
      code: "COMP105",
      ects: 3,
      year: 1,
      semester: 1,
      isElective: false,
    },

    // GODINA 1 - Semestar 2
    {
      name: "Matematička analiza 2",
      code: "COMP106",
      ects: 8,
      year: 1,
      semester: 2,
      isElective: false,
    },
    {
      name: "Objektno-orijentisano programiranje (Java)",
      code: "COMP107",
      ects: 7,
      year: 1,
      semester: 2,
      isElective: false,
    },
    {
      name: "Algoritmi i strukture podataka",
      code: "COMP108",
      ects: 7,
      year: 1,
      semester: 2,
      isElective: false,
    },
    {
      name: "Fizika za računarstvo",
      code: "COMP109",
      ects: 5,
      year: 1,
      semester: 2,
      isElective: false,
    },
    {
      name: "IT komunikacijske vještine",
      code: "COMP110",
      ects: 3,
      year: 1,
      semester: 2,
      isElective: false,
    },

    // GODINA 2 - Semestar 1
    {
      name: "Relacione baze podataka",
      code: "COMP201",
      ects: 7,
      year: 2,
      semester: 1,
      isElective: false,
    },
    {
      name: "Unix/Linux operativni sistemi",
      code: "COMP202",
      ects: 7,
      year: 2,
      semester: 1,
      isElective: false,
    },
    {
      name: "Full-Stack Web Development",
      code: "COMP203",
      ects: 6,
      year: 2,
      semester: 1,
      isElective: false,
    },
    {
      name: "Računarske mreže i protokoli",
      code: "COMP204",
      ects: 6,
      year: 2,
      semester: 1,
      isElective: false,
    },
    {
      name: "Vjerovatnoća i statistika",
      code: "COMP205",
      ects: 4,
      year: 2,
      semester: 1,
      isElective: false,
    },

    // GODINA 2 - Semestar 2
    {
      name: "Softversko inženjerstvo i Agile",
      code: "COMP206",
      ects: 7,
      year: 2,
      semester: 2,
      isElective: false,
    },
    {
      name: "NoSQL baze podataka",
      code: "COMP207",
      ects: 6,
      year: 2,
      semester: 2,
      isElective: false,
    },
    {
      name: "Računarska grafika i vizualizacija",
      code: "COMP208",
      ects: 6,
      year: 2,
      semester: 2,
      isElective: false,
    },
    {
      name: "Kompajleri i interpreteri",
      code: "COMP209",
      ects: 5,
      year: 2,
      semester: 2,
      isElective: false,
    },
    {
      name: "React Native Development",
      code: "COMP210",
      ects: 6,
      year: 2,
      semester: 2,
      isElective: true,
    },

    // GODINA 3 - Semestar 1
    {
      name: "Artificial Intelligence (AI)",
      code: "COMP301",
      ects: 7,
      year: 3,
      semester: 1,
      isElective: false,
    },
    {
      name: "AWS Cloud Architecture",
      code: "COMP302",
      ects: 6,
      year: 3,
      semester: 1,
      isElective: false,
    },
    {
      name: "Application Security i OWASP",
      code: "COMP303",
      ects: 6,
      year: 3,
      semester: 1,
      isElective: false,
    },
    {
      name: "Projektni praktikum - Scrum Tim",
      code: "COMP304",
      ects: 5,
      year: 3,
      semester: 1,
      isElective: false,
    },
    {
      name: "Napredni algoritmi i optimizacija",
      code: "COMP305",
      ects: 6,
      year: 3,
      semester: 1,
      isElective: true,
    },
    {
      name: "IoT sa Raspberry Pi i Arduino",
      code: "COMP306",
      ects: 6,
      year: 3,
      semester: 1,
      isElective: true,
    },

    // GODINA 3 - Semestar 2
    {
      name: "Deep Learning i Neural Networks",
      code: "COMP307",
      ects: 7,
      year: 3,
      semester: 2,
      isElective: false,
    },
    {
      name: "Microservices Architecture",
      code: "COMP308",
      ects: 6,
      year: 3,
      semester: 2,
      isElective: false,
    },
    {
      name: "Jest, Cypress i E2E Testing",
      code: "COMP309",
      ects: 5,
      year: 3,
      semester: 2,
      isElective: false,
    },
    {
      name: "Startup projekt - MVP razvoj",
      code: "COMP310",
      ects: 6,
      year: 3,
      semester: 2,
      isElective: false,
    },
    {
      name: "Ethereum i Smart Contracts (Solidity)",
      code: "COMP311",
      ects: 6,
      year: 3,
      semester: 2,
      isElective: true,
    },
    {
      name: "Transformers i GPT modeli",
      code: "COMP312",
      ects: 6,
      year: 3,
      semester: 2,
      isElective: true,
    },

    // GODINA 4 - Semestar 1
    {
      name: "GitOps i ArgoCD",
      code: "COMP401",
      ects: 6,
      year: 4,
      semester: 1,
      isElective: false,
    },
    {
      name: "Apache Spark i Hadoop ekosistem",
      code: "COMP402",
      ects: 6,
      year: 4,
      semester: 1,
      isElective: false,
    },
    {
      name: "OpenCV i Computer Vision",
      code: "COMP403",
      ects: 6,
      year: 4,
      semester: 1,
      isElective: true,
    },
    {
      name: "Qubits i Kvantni algoritmi",
      code: "COMP404",
      ects: 6,
      year: 4,
      semester: 1,
      isElective: true,
    },
    {
      name: "AI Ethics i Responsible AI",
      code: "COMP405",
      ects: 4,
      year: 4,
      semester: 1,
      isElective: false,
    },
    {
      name: "Istraživački seminarski rad",
      code: "COMP406",
      ects: 8,
      year: 4,
      semester: 1,
      isElective: false,
    },

    // GODINA 4 - Semestar 2
    {
      name: "Diplomski rad",
      code: "COMP407",
      ects: 15,
      year: 4,
      semester: 2,
      isElective: false,
    },
    {
      name: "Startup Ecosystem i Pitching",
      code: "COMP408",
      ects: 5,
      year: 4,
      semester: 2,
      isElective: false,
    },
    {
      name: "Domain-Driven Design (DDD)",
      code: "COMP409",
      ects: 6,
      year: 4,
      semester: 2,
      isElective: true,
    },
    {
      name: "Unity i Unreal Engine Development",
      code: "COMP410",
      ects: 6,
      year: 4,
      semester: 2,
      isElective: true,
    },
  ];

  // ========== INFORMACIONE TEHNOLOGIJE (IT) ==========
  const itSubjects = [
    // GODINA 1 - Semestar 1
    {
      name: "Diskretne strukture",
      code: "IT101",
      ects: 8,
      year: 1,
      semester: 1,
      isElective: false,
    },
    {
      name: "Osnove IT sistema",
      code: "IT102",
      ects: 7,
      year: 1,
      semester: 1,
      isElective: false,
    },
    {
      name: "Programiranje u Pythonu",
      code: "IT103",
      ects: 7,
      year: 1,
      semester: 1,
      isElective: false,
    },
    {
      name: "Digitalne komunikacije",
      code: "IT104",
      ects: 5,
      year: 1,
      semester: 1,
      isElective: false,
    },
    {
      name: "Profesionalni engleski 1",
      code: "IT105",
      ects: 3,
      year: 1,
      semester: 1,
      isElective: false,
    },

    // GODINA 1 - Semestar 2
    {
      name: "Linearna algebra i geometrija",
      code: "IT106",
      ects: 8,
      year: 1,
      semester: 2,
      isElective: false,
    },
    {
      name: "Frontend Web Development",
      code: "IT107",
      ects: 7,
      year: 1,
      semester: 2,
      isElective: false,
    },
    {
      name: "Hardverska infrastruktura",
      code: "IT108",
      ects: 6,
      year: 1,
      semester: 2,
      isElective: false,
    },
    {
      name: "TCP/IP i mrežni protokoli",
      code: "IT109",
      ects: 6,
      year: 1,
      semester: 2,
      isElective: false,
    },
    {
      name: "Profesionalni engleski 2",
      code: "IT110",
      ects: 3,
      year: 1,
      semester: 2,
      isElective: false,
    },

    // GODINA 2 - Semestar 1
    {
      name: "SQL Server administracija",
      code: "IT201",
      ects: 7,
      year: 2,
      semester: 1,
      isElective: false,
    },
    {
      name: "Windows i Active Directory",
      code: "IT202",
      ects: 7,
      year: 2,
      semester: 1,
      isElective: false,
    },
    {
      name: "Cisco CCNA - Routing & Switching",
      code: "IT203",
      ects: 6,
      year: 2,
      semester: 1,
      isElective: false,
    },
    {
      name: "Red Hat Enterprise Linux",
      code: "IT204",
      ects: 6,
      year: 2,
      semester: 1,
      isElective: false,
    },
    {
      name: "ITIL Foundation i Service Desk",
      code: "IT205",
      ects: 4,
      year: 2,
      semester: 1,
      isElective: false,
    },

    // GODINA 2 - Semestar 2
    {
      name: "Cisco CCNP - Advanced Networking",
      code: "IT206",
      ects: 7,
      year: 2,
      semester: 2,
      isElective: false,
    },
    {
      name: "Docker i Podman kontejneri",
      code: "IT207",
      ects: 6,
      year: 2,
      semester: 2,
      isElective: false,
    },
    {
      name: "SAP i ERP integracije",
      code: "IT208",
      ects: 6,
      year: 2,
      semester: 2,
      isElective: false,
    },
    {
      name: "PowerShell i Bash Scripting",
      code: "IT209",
      ects: 6,
      year: 2,
      semester: 2,
      isElective: false,
    },
    {
      name: "Ansible i Terraform automatizacija",
      code: "IT210",
      ects: 5,
      year: 2,
      semester: 2,
      isElective: true,
    },

    // GODINA 3 - Semestar 1
    {
      name: "Penetration Testing (CEH)",
      code: "IT301",
      ects: 7,
      year: 3,
      semester: 1,
      isElective: false,
    },
    {
      name: "Azure Cloud Services",
      code: "IT302",
      ects: 7,
      year: 3,
      semester: 1,
      isElective: false,
    },
    {
      name: "Prometheus i Grafana Monitoring",
      code: "IT303",
      ects: 5,
      year: 3,
      semester: 1,
      isElective: false,
    },
    {
      name: "COBIT i IT Governance",
      code: "IT304",
      ects: 5,
      year: 3,
      semester: 1,
      isElective: false,
    },
    {
      name: "Firewall i IDS/IPS sistemi",
      code: "IT305",
      ects: 6,
      year: 3,
      semester: 1,
      isElective: true,
    },
    {
      name: "WiFi 6/6E i Enterprise WLAN",
      code: "IT306",
      ects: 6,
      year: 3,
      semester: 1,
      isElective: true,
    },

    // GODINA 3 - Semestar 2
    {
      name: "Kubernetes (CKA certificiranje)",
      code: "IT307",
      ects: 7,
      year: 3,
      semester: 2,
      isElective: false,
    },
    {
      name: "CI/CD sa Jenkins i GitLab",
      code: "IT308",
      ects: 6,
      year: 3,
      semester: 2,
      isElective: false,
    },
    {
      name: "Backup, Replication i HA Clustering",
      code: "IT309",
      ects: 6,
      year: 3,
      semester: 2,
      isElective: false,
    },
    {
      name: "Metasploit i Exploit Development",
      code: "IT310",
      ects: 6,
      year: 3,
      semester: 2,
      isElective: true,
    },
    {
      name: "Asterisk PBX i SIP protokol",
      code: "IT311",
      ects: 5,
      year: 3,
      semester: 2,
      isElective: true,
    },
    {
      name: "Wireshark i Packet Analysis",
      code: "IT312",
      ects: 5,
      year: 3,
      semester: 2,
      isElective: true,
    },

    // GODINA 4 - Semestar 1
    {
      name: "Hybrid Cloud i Multi-Cloud Strategy",
      code: "IT401",
      ects: 6,
      year: 4,
      semester: 1,
      isElective: false,
    },
    {
      name: "SIEM i Security Operations Center",
      code: "IT402",
      ects: 6,
      year: 4,
      semester: 1,
      isElective: false,
    },
    {
      name: "GDPR, ISO 27001 i Compliance",
      code: "IT403",
      ects: 5,
      year: 4,
      semester: 1,
      isElective: false,
    },
    {
      name: "VMware NSX i Software-Defined Networking",
      code: "IT404",
      ects: 6,
      year: 4,
      semester: 1,
      isElective: true,
    },
    {
      name: "5G Core i Network Slicing",
      code: "IT405",
      ects: 6,
      year: 4,
      semester: 1,
      isElective: true,
    },
    {
      name: "Završni seminarski rad",
      code: "IT406",
      ects: 7,
      year: 4,
      semester: 1,
      isElective: false,
    },

    // GODINA 4 - Semestar 2
    {
      name: "Diplomski rad",
      code: "IT407",
      ects: 15,
      year: 4,
      semester: 2,
      isElective: false,
    },
    {
      name: "CIO i Digital Transformation",
      code: "IT408",
      ects: 5,
      year: 4,
      semester: 2,
      isElective: false,
    },
    {
      name: "Cloudflare Workers i Edge Computing",
      code: "IT409",
      ects: 6,
      year: 4,
      semester: 2,
      isElective: true,
    },
    {
      name: "Zero Trust Network Access (ZTNA)",
      code: "IT410",
      ects: 6,
      year: 4,
      semester: 2,
      isElective: true,
    },
  ];

  // ========== RAČUNOVODSTVO I FINANSIJE (ACFI) ==========
  const acfiSubjects = [
    // GODINA 1 - Semestar 1
    {
      name: "Principi ekonomije",
      code: "ACFI101",
      ects: 8,
      year: 1,
      semester: 1,
      isElective: false,
    },
    {
      name: "Uvod u finansijsko računovodstvo",
      code: "ACFI102",
      ects: 7,
      year: 1,
      semester: 1,
      isElective: false,
    },
    {
      name: "Poslovna matematika i kamate",
      code: "ACFI103",
      ects: 6,
      year: 1,
      semester: 1,
      isElective: false,
    },
    {
      name: "Korporativni menadžment",
      code: "ACFI104",
      ects: 6,
      year: 1,
      semester: 1,
      isElective: false,
    },
    {
      name: "Business English Communication",
      code: "ACFI105",
      ects: 3,
      year: 1,
      semester: 1,
      isElective: false,
    },

    // GODINA 1 - Semestar 2
    {
      name: "Knjiženje i bilans stanja",
      code: "ACFI106",
      ects: 8,
      year: 1,
      semester: 2,
      isElective: false,
    },
    {
      name: "Mikroekonomska analiza tržišta",
      code: "ACFI107",
      ects: 7,
      year: 1,
      semester: 2,
      isElective: false,
    },
    {
      name: "Deskriptivna statistika i regresija",
      code: "ACFI108",
      ects: 6,
      year: 1,
      semester: 2,
      isElective: false,
    },
    {
      name: "Excel i QuickBooks za računovođe",
      code: "ACFI109",
      ects: 6,
      year: 1,
      semester: 2,
      isElective: false,
    },
    {
      name: "Akademsko pisanje na engleskom",
      code: "ACFI110",
      ects: 3,
      year: 1,
      semester: 2,
      isElective: false,
    },

    // GODINA 2 - Semestar 1
    {
      name: "Finansijski izvještaji (Balance Sheet, P&L)",
      code: "ACFI201",
      ects: 8,
      year: 2,
      semester: 1,
      isElective: false,
    },
    {
      name: "Makroekonomija i monetarna politika",
      code: "ACFI202",
      ects: 7,
      year: 2,
      semester: 1,
      isElective: false,
    },
    {
      name: "Corporate Finance i Capital Structure",
      code: "ACFI203",
      ects: 7,
      year: 2,
      semester: 1,
      isElective: false,
    },
    {
      name: "Porezi i poresko knjigovodstvo",
      code: "ACFI204",
      ects: 5,
      year: 2,
      semester: 1,
      isElective: false,
    },
    {
      name: "Etika u računovodstvu i CSR",
      code: "ACFI205",
      ects: 3,
      year: 2,
      semester: 1,
      isElective: false,
    },

    // GODINA 2 - Semestar 2
    {
      name: "Cost Accounting i Activity-Based Costing",
      code: "ACFI206",
      ects: 8,
      year: 2,
      semester: 2,
      isElective: false,
    },
    {
      name: "Berze i hartije od vrijednosti",
      code: "ACFI207",
      ects: 7,
      year: 2,
      semester: 2,
      isElective: false,
    },
    {
      name: "Financial Ratios i Liquidity Analysis",
      code: "ACFI208",
      ects: 6,
      year: 2,
      semester: 2,
      isElective: false,
    },
    {
      name: "Trgovačko i privredno pravo",
      code: "ACFI209",
      ects: 5,
      year: 2,
      semester: 2,
      isElective: false,
    },
    {
      name: "Digitalni marketing za finansije",
      code: "ACFI210",
      ects: 4,
      year: 2,
      semester: 2,
      isElective: true,
    },

    // GODINA 3 - Semestar 1
    {
      name: "Auditing Standards (ISA)",
      code: "ACFI301",
      ects: 8,
      year: 3,
      semester: 1,
      isElective: false,
    },
    {
      name: "M&A i Investment Banking",
      code: "ACFI302",
      ects: 7,
      year: 3,
      semester: 1,
      isElective: false,
    },
    {
      name: "IFRS i IAS standardi",
      code: "ACFI303",
      ects: 6,
      year: 3,
      semester: 1,
      isElective: false,
    },
    {
      name: "Management Accounting i Controlling",
      code: "ACFI304",
      ects: 6,
      year: 3,
      semester: 1,
      isElective: false,
    },
    {
      name: "NPV, IRR i Project Valuation",
      code: "ACFI305",
      ects: 6,
      year: 3,
      semester: 1,
      isElective: true,
    },
    {
      name: "Forensic Accounting i Fraud Detection",
      code: "ACFI306",
      ects: 5,
      year: 3,
      semester: 1,
      isElective: true,
    },

    // GODINA 3 - Semestar 2
    {
      name: "Budgeting i Rolling Forecast",
      code: "ACFI307",
      ects: 7,
      year: 3,
      semester: 2,
      isElective: false,
    },
    {
      name: "Transfer Pricing i Tax Avoidance",
      code: "ACFI308",
      ects: 6,
      year: 3,
      semester: 2,
      isElective: false,
    },
    {
      name: "Commercial Banking i Credit Risk",
      code: "ACFI309",
      ects: 6,
      year: 3,
      semester: 2,
      isElective: false,
    },
    {
      name: "CFO i Treasury Management",
      code: "ACFI310",
      ects: 6,
      year: 3,
      semester: 2,
      isElective: false,
    },
    {
      name: "VaR, CVaR i Stress Testing",
      code: "ACFI311",
      ects: 6,
      year: 3,
      semester: 2,
      isElective: true,
    },
    {
      name: "Monte Carlo Simulation u Excelu",
      code: "ACFI312",
      ects: 6,
      year: 3,
      semester: 2,
      isElective: true,
    },

    // GODINA 4 - Semestar 1
    {
      name: "Internal Audit i Sox Compliance",
      code: "ACFI401",
      ects: 7,
      year: 4,
      semester: 1,
      isElective: false,
    },
    {
      name: "KPI Dashboards i Power BI",
      code: "ACFI402",
      ects: 6,
      year: 4,
      semester: 1,
      isElective: false,
    },
    {
      name: "SAP FICO i Oracle Financials",
      code: "ACFI403",
      ects: 6,
      year: 4,
      semester: 1,
      isElective: false,
    },
    {
      name: "US GAAP vs IFRS Reconciliation",
      code: "ACFI404",
      ects: 6,
      year: 4,
      semester: 1,
      isElective: true,
    },
    {
      name: "Discounted Cash Flow (DCF) Modeling",
      code: "ACFI405",
      ects: 5,
      year: 4,
      semester: 1,
      isElective: true,
    },
    {
      name: "Istraživački seminarski rad",
      code: "ACFI406",
      ects: 8,
      year: 4,
      semester: 1,
      isElective: false,
    },

    // GODINA 4 - Semestar 2
    {
      name: "Diplomski rad",
      code: "ACFI407",
      ects: 15,
      year: 4,
      semester: 2,
      isElective: false,
    },
    {
      name: "Blue Ocean Strategy i Balanced Scorecard",
      code: "ACFI408",
      ects: 5,
      year: 4,
      semester: 2,
      isElective: false,
    },
    {
      name: "Blockchain u crypto valuama i DeFi",
      code: "ACFI409",
      ects: 6,
      year: 4,
      semester: 2,
      isElective: true,
    },
    {
      name: "ESG Reporting i Sustainability Accounting",
      code: "ACFI410",
      ects: 6,
      year: 4,
      semester: 2,
      isElective: true,
    },
  ];

  // ============================================
  // 4. INSERT SUBJECTS INTO DATABASE
  // ============================================

  // Helper function to create subjects for a major
  async function createSubjects(majorCode: string, subjects: any[]) {
    const major = majors.find((m) => m.code === majorCode)!;

    for (const subject of subjects) {
      const yearPlanKey = `${majorCode}_Y${subject.year}_S${subject.semester}`;
      const yearPlan = yearPlans[yearPlanKey];

      await prisma.subject.upsert({
        where: { code: subject.code },
        update: {},
        create: {
          name: subject.name,
          code: subject.code,
          ects: subject.ects,
          isElective: subject.isElective,
          description: `${subject.name} - ${
            subject.isElective ? "Izborni" : "Obavezni"
          } predmet (${subject.ects} ECTS)`,
          majorId: major.id,
          yearPlanId: yearPlan.id,
        },
      });
    }
  }

  console.log("📚 Creating subjects for RAČUNARSTVO...");
  await createSubjects("COMP", compSubjects);
  console.log(`✅ Created ${compSubjects.length} subjects for Računarstvo`);

  console.log("📚 Creating subjects for IT...");
  await createSubjects("IT", itSubjects);
  console.log(
    `✅ Created ${itSubjects.length} subjects for Informacione tehnologije`
  );

  console.log("📚 Creating subjects for RAČUNOVODSTVO I FINANSIJE...");
  await createSubjects("ACFI", acfiSubjects);
  console.log(
    `✅ Created ${acfiSubjects.length} subjects for Računovodstvo i finansije`
  );

  // ============================================
  // 5. SUMMARY
  // ============================================
  const totalSubjects = await prisma.subject.count();
  const totalElective = await prisma.subject.count({
    where: { isElective: true },
  });
  const totalRequired = await prisma.subject.count({
    where: { isElective: false },
  });

  console.log("\n✨ SEED COMPLETED ✨");
  console.log("=================================");
  console.log(`📊 Total Subjects: ${totalSubjects}`);
  console.log(`📌 Required (Obavezni): ${totalRequired}`);
  console.log(`🎯 Elective (Izborni): ${totalElective}`);
  console.log("=================================");
  console.log("🎓 Majors:");
  console.log(`   - Računarstvo (COMP): ${compSubjects.length} predmeta`);
  console.log(
    `   - Informacione tehnologije (IT): ${itSubjects.length} predmeta`
  );
  console.log(
    `   - Računovodstvo i finansije (ACFI): ${acfiSubjects.length} predmeta`
  );
  console.log("=================================\n");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Seed failed:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
