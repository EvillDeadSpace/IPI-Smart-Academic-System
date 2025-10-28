import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient();

// Helper za generisanje IT predmeta
function generateITSubjects() {
  return [
    // GODINA 1 - OBAVEZNI (7)
    { name: 'IT Sistemi', code: 'IT101', ects: 8, year: 1, semester: 1, isElective: false },
    { name: 'Python', code: 'IT102', ects: 8, year: 1, semester: 1, isElective: false },
    { name: 'Networking', code: 'IT103', ects: 7, year: 1, semester: 1, isElective: false },
    { name: 'TCP/IP', code: 'IT104', ects: 7, year: 1, semester: 2, isElective: false },
    { name: 'OS Osnove', code: 'IT105', ects: 8, year: 1, semester: 2, isElective: false },
    { name: 'Hardware', code: 'IT106', ects: 6, year: 1, semester: 2, isElective: false },
    { name: 'Engleski', code: 'IT107', ects: 6, year: 1, semester: 2, isElective: false },
    // GODINA 1 - IZBORNI (7)
    { name: 'Windows Server', code: 'IT108', ects: 6, year: 1, semester: 1, isElective: true },
    { name: 'HTML/CSS', code: 'IT109', ects: 6, year: 1, semester: 1, isElective: true },
    { name: 'Cisco PT', code: 'IT110', ects: 5, year: 1, semester: 1, isElective: true },
    { name: 'PowerShell', code: 'IT111', ects: 5, year: 1, semester: 2, isElective: true },
    { name: 'VirtualBox', code: 'IT112', ects: 6, year: 1, semester: 2, isElective: true },
    { name: 'Helpdesk', code: 'IT113', ects: 5, year: 1, semester: 2, isElective: true },
    { name: 'Linux', code: 'IT114', ects: 6, year: 1, semester: 2, isElective: true },

    // GODINA 2 - OBAVEZNI (7)
    { name: 'SQL Server', code: 'IT201', ects: 8, year: 2, semester: 1, isElective: false },
    { name: 'AD', code: 'IT202', ects: 7, year: 2, semester: 1, isElective: false },
    { name: 'CCNA', code: 'IT203', ects: 8, year: 2, semester: 1, isElective: false },
    { name: 'Red Hat', code: 'IT204', ects: 7, year: 2, semester: 2, isElective: false },
    { name: 'ITIL', code: 'IT205', ects: 6, year: 2, semester: 2, isElective: false },
    { name: 'Security', code: 'IT206', ects: 8, year: 2, semester: 2, isElective: false },
    { name: 'Docker', code: 'IT207', ects: 6, year: 2, semester: 2, isElective: false },
    // GODINA 2 - IZBORNI (7)
    { name: 'VMware', code: 'IT208', ects: 6, year: 2, semester: 1, isElective: true },
    { name: 'Azure', code: 'IT209', ects: 6, year: 2, semester: 1, isElective: true },
    { name: 'Bash', code: 'IT210', ects: 5, year: 2, semester: 1, isElective: true },
    { name: 'DNS/DHCP', code: 'IT211', ects: 5, year: 2, semester: 2, isElective: true },
    { name: 'Backup', code: 'IT212', ects: 6, year: 2, semester: 2, isElective: true },
    { name: 'Ansible', code: 'IT213', ects: 6, year: 2, semester: 2, isElective: true },
    { name: 'Terraform', code: 'IT214', ects: 6, year: 2, semester: 2, isElective: true },

    // GODINA 3 - OBAVEZNI (7)
    { name: 'PenTest', code: 'IT301', ects: 8, year: 3, semester: 1, isElective: false },
    { name: 'Cloud', code: 'IT302', ects: 8, year: 3, semester: 1, isElective: false },
    { name: 'Monitoring', code: 'IT303', ects: 6, year: 3, semester: 1, isElective: false },
    { name: 'Kubernetes', code: 'IT304', ects: 8, year: 3, semester: 2, isElective: false },
    { name: 'CI/CD', code: 'IT305', ects: 7, year: 3, semester: 2, isElective: false },
    { name: 'Praktikum', code: 'IT306', ects: 8, year: 3, semester: 2, isElective: false },
    { name: 'Governance', code: 'IT307', ects: 5, year: 3, semester: 2, isElective: false },
    // GODINA 3 - IZBORNI (7)
    { name: 'Fortinet', code: 'IT308', ects: 6, year: 3, semester: 1, isElective: true },
    { name: 'WiFi 6', code: 'IT309', ects: 6, year: 3, semester: 1, isElective: true },
    { name: 'AWS', code: 'IT310', ects: 6, year: 3, semester: 1, isElective: true },
    { name: 'SIEM', code: 'IT311', ects: 6, year: 3, semester: 2, isElective: true },
    { name: 'Metasploit', code: 'IT312', ects: 6, year: 3, semester: 2, isElective: true },
    { name: 'OpenStack', code: 'IT313', ects: 6, year: 3, semester: 2, isElective: true },
    { name: 'GCP', code: 'IT314', ects: 6, year: 3, semester: 2, isElective: true },

    // GODINA 4 - OBAVEZNI (7)
    { name: 'Multi-Cloud', code: 'IT401', ects: 7, year: 4, semester: 1, isElective: false },
    { name: 'SOC', code: 'IT402', ects: 7, year: 4, semester: 1, isElective: false },
    { name: 'ISO', code: 'IT403', ects: 6, year: 4, semester: 1, isElective: false },
    { name: 'Seminarski', code: 'IT404', ects: 10, year: 4, semester: 1, isElective: false },
    { name: 'Diplomski', code: 'IT405', ects: 15, year: 4, semester: 2, isElective: false },
    { name: 'DevSecOps', code: 'IT406', ects: 6, year: 4, semester: 1, isElective: false },
    { name: 'Leadership', code: 'IT407', ects: 4, year: 4, semester: 2, isElective: false },
    // GODINA 4 - IZBORNI (7)
    { name: 'NSX', code: 'IT408', ects: 6, year: 4, semester: 1, isElective: true },
    { name: '5G', code: 'IT409', ects: 6, year: 4, semester: 1, isElective: true },
    { name: 'Zero Trust', code: 'IT410', ects: 6, year: 4, semester: 1, isElective: true },
    { name: 'OSCP', code: 'IT411', ects: 6, year: 4, semester: 1, isElective: true },
    { name: 'Citrix', code: 'IT412', ects: 6, year: 4, semester: 1, isElective: true },
    { name: 'Red Team', code: 'IT413', ects: 6, year: 4, semester: 1, isElective: true },
    { name: 'Audit', code: 'IT414', ects: 6, year: 4, semester: 1, isElective: true },
  ];
}

// Helper za generisanje ACFI predmeta
function generateACFISubjects() {
  return [
    // GODINA 1 - OBAVEZNI (7)
    { name: 'Ekonomija', code: 'ACFI101', ects: 8, year: 1, semester: 1, isElective: false },
    { name: 'Računovodstvo', code: 'ACFI102', ects: 8, year: 1, semester: 1, isElective: false },
    { name: 'Matematika', code: 'ACFI103', ects: 7, year: 1, semester: 1, isElective: false },
    { name: 'Menadžment', code: 'ACFI104', ects: 7, year: 1, semester: 2, isElective: false },
    { name: 'Finansije', code: 'ACFI105', ects: 8, year: 1, semester: 2, isElective: false },
    { name: 'Statistika', code: 'ACFI106', ects: 7, year: 1, semester: 2, isElective: false },
    { name: 'Engleski', code: 'ACFI107', ects: 5, year: 1, semester: 2, isElective: false },
    // GODINA 1 - IZBORNI (7)
    { name: 'Excel', code: 'ACFI108', ects: 6, year: 1, semester: 1, isElective: true },
    { name: 'Marketing', code: 'ACFI109', ects: 6, year: 1, semester: 1, isElective: true },
    { name: 'Komunikacija', code: 'ACFI110', ects: 5, year: 1, semester: 1, isElective: true },
    { name: 'E-commerce', code: 'ACFI111', ects: 5, year: 1, semester: 2, isElective: true },
    { name: 'Psihologija', code: 'ACFI112', ects: 6, year: 1, semester: 2, isElective: true },
    { name: 'Startup', code: 'ACFI113', ects: 6, year: 1, semester: 2, isElective: true },
    { name: 'PowerBI', code: 'ACFI114', ects: 5, year: 1, semester: 2, isElective: true },

    // GODINA 2 - OBAVEZNI (7)
    { name: 'Controlling', code: 'ACFI201', ects: 8, year: 2, semester: 1, isElective: false },
    { name: 'Analitika', code: 'ACFI202', ects: 7, year: 2, semester: 1, isElective: false },
    { name: 'Corporate Finance', code: 'ACFI203', ects: 8, year: 2, semester: 1, isElective: false },
    { name: 'Porezi', code: 'ACFI204', ects: 7, year: 2, semester: 2, isElective: false },
    { name: 'Revizija', code: 'ACFI205', ects: 8, year: 2, semester: 2, isElective: false },
    { name: 'Ekonometrija', code: 'ACFI206', ects: 7, year: 2, semester: 2, isElective: false },
    { name: 'SAP', code: 'ACFI207', ects: 5, year: 2, semester: 2, isElective: false },
    // GODINA 2 - IZBORNI (7)
    { name: 'QuickBooks', code: 'ACFI208', ects: 6, year: 2, semester: 1, isElective: true },
    { name: 'Modeling', code: 'ACFI209', ects: 6, year: 2, semester: 1, isElective: true },
    { name: 'VBA', code: 'ACFI210', ects: 5, year: 2, semester: 1, isElective: true },
    { name: 'BI', code: 'ACFI211', ects: 6, year: 2, semester: 2, isElective: true },
    { name: 'Tableau', code: 'ACFI212', ects: 6, year: 2, semester: 2, isElective: true },
    { name: 'SQL', code: 'ACFI213', ects: 5, year: 2, semester: 2, isElective: true },
    { name: 'Investicije', code: 'ACFI214', ects: 6, year: 2, semester: 2, isElective: true },

    // GODINA 3 - OBAVEZNI (7)
    { name: 'International Finance', code: 'ACFI301', ects: 8, year: 3, semester: 1, isElective: false },
    { name: 'Forenzika', code: 'ACFI302', ects: 7, year: 3, semester: 1, isElective: false },
    { name: 'IFRS', code: 'ACFI303', ects: 7, year: 3, semester: 1, isElective: false },
    { name: 'Portfolio', code: 'ACFI304', ects: 8, year: 3, semester: 2, isElective: false },
    { name: 'Risk', code: 'ACFI305', ects: 7, year: 3, semester: 2, isElective: false },
    { name: 'Praktikum', code: 'ACFI306', ects: 8, year: 3, semester: 2, isElective: false },
    { name: 'Strategija', code: 'ACFI307', ects: 5, year: 3, semester: 2, isElective: false },
    // GODINA 3 - IZBORNI (7)
    { name: 'Blockchain', code: 'ACFI308', ects: 6, year: 3, semester: 1, isElective: true },
    { name: 'M&A', code: 'ACFI309', ects: 6, year: 3, semester: 1, isElective: true },
    { name: 'VC', code: 'ACFI310', ects: 6, year: 3, semester: 1, isElective: true },
    { name: 'ESG', code: 'ACFI311', ects: 6, year: 3, semester: 2, isElective: true },
    { name: 'Python Finance', code: 'ACFI312', ects: 6, year: 3, semester: 2, isElective: true },
    { name: 'Crypto', code: 'ACFI313', ects: 6, year: 3, semester: 2, isElective: true },
    { name: 'Real Estate', code: 'ACFI314', ects: 6, year: 3, semester: 2, isElective: true },

    // GODINA 4 - OBAVEZNI (7)
    { name: 'CFO', code: 'ACFI401', ects: 7, year: 4, semester: 1, isElective: false },
    { name: 'AI Finance', code: 'ACFI402', ects: 7, year: 4, semester: 1, isElective: false },
    { name: 'Compliance', code: 'ACFI403', ects: 6, year: 4, semester: 1, isElective: false },
    { name: 'Seminarski', code: 'ACFI404', ects: 10, year: 4, semester: 1, isElective: false },
    { name: 'Diplomski', code: 'ACFI405', ects: 15, year: 4, semester: 2, isElective: false },
    { name: 'Governance', code: 'ACFI406', ects: 6, year: 4, semester: 1, isElective: false },
    { name: 'Finance Strategy', code: 'ACFI407', ects: 4, year: 4, semester: 2, isElective: false },
    // GODINA 4 - IZBORNI (7)
    { name: 'PE', code: 'ACFI408', ects: 6, year: 4, semester: 1, isElective: true },
    { name: 'Hedge Funds', code: 'ACFI409', ects: 6, year: 4, semester: 1, isElective: true },
    { name: 'Derivatives', code: 'ACFI410', ects: 6, year: 4, semester: 1, isElective: true },
    { name: 'Forensic', code: 'ACFI411', ects: 6, year: 4, semester: 1, isElective: true },
    { name: 'Sustainability', code: 'ACFI412', ects: 6, year: 4, semester: 1, isElective: true },
    { name: 'FinTech', code: 'ACFI413', ects: 6, year: 4, semester: 1, isElective: true },
    { name: 'Int Tax', code: 'ACFI414', ects: 6, year: 4, semester: 1, isElective: true },
  ];
}

async function main() {
  console.log('🌱 Starting database seed...');

  // ============================================
  // 1. CREATE MAJORS (Smjerovi)
  // ============================================
  const majors = await Promise.all([
    prisma.major.upsert({
      where: { code: 'COMP' },
      update: {},
      create: {
        name: 'Računarstvo',
        code: 'COMP',
        description: 'Smjer računarstva i softverskog inženjeringa',
        duration: 4,
      },
    }),
    prisma.major.upsert({
      where: { code: 'IT' },
      update: {},
      create: {
        name: 'Informacione tehnologije',
        code: 'IT',
        description: 'Smjer informacionih tehnologija i mrežnih sistema',
        duration: 4,
      },
    }),
    prisma.major.upsert({
      where: { code: 'ACFI' },
      update: {},
      create: {
        name: 'Računovodstvo i finansije',
        code: 'ACFI',
        description: 'Smjer računovodstva, finansija i poslovne ekonomije',
        duration: 4,
      },
    }),
  ]);

  console.log('✅ Created 3 majors');

  // ============================================
  // 2. CREATE YEAR PLANS
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

  console.log('✅ Created 24 year plans');

  // ============================================
  // 3. DEFINE SUBJECTS
  // Struktura: 7 obaveznih + 7 izbornih po semestru
  // ============================================

  const compSubjects = [
    // GODINA 1 - OBAVEZNI (7)
    { name: 'Matematika 1', code: 'COMP101', ects: 8, year: 1, semester: 1, isElective: false },
    { name: 'Programiranje C++', code: 'COMP102', ects: 8, year: 1, semester: 1, isElective: false },
    { name: 'Računarska arhitektura', code: 'COMP103', ects: 7, year: 1, semester: 1, isElective: false },
    { name: 'Algoritmi', code: 'COMP104', ects: 8, year: 1, semester: 2, isElective: false },
    { name: 'OOP Java', code: 'COMP105', ects: 8, year: 1, semester: 2, isElective: false },
    { name: 'Diskretna matematika', code: 'COMP106', ects: 6, year: 1, semester: 2, isElective: false },
    { name: 'Engleski', code: 'COMP107', ects: 5, year: 1, semester: 2, isElective: false },
    // GODINA 1 - IZBORNI (7)
    { name: 'Python', code: 'COMP108', ects: 6, year: 1, semester: 1, isElective: true },
    { name: 'Web Design', code: 'COMP109', ects: 6, year: 1, semester: 1, isElective: true },
    { name: 'Git', code: 'COMP110', ects: 5, year: 1, semester: 1, isElective: true },
    { name: 'Linux', code: 'COMP111', ects: 5, year: 1, semester: 2, isElective: true },
    { name: 'JavaScript', code: 'COMP112', ects: 6, year: 1, semester: 2, isElective: true },
    { name: 'AI Basics', code: 'COMP113', ects: 6, year: 1, semester: 2, isElective: true },
    { name: 'Photoshop', code: 'COMP114', ects: 5, year: 1, semester: 2, isElective: true },

    // GODINA 2 - OBAVEZNI (7)
    { name: 'Baze podataka', code: 'COMP201', ects: 8, year: 2, semester: 1, isElective: false },
    { name: 'OS Linux', code: 'COMP202', ects: 8, year: 2, semester: 1, isElective: false },
    { name: 'Web Dev', code: 'COMP203', ects: 7, year: 2, semester: 1, isElective: false },
    { name: 'Mreže', code: 'COMP204', ects: 7, year: 2, semester: 2, isElective: false },
    { name: 'SE', code: 'COMP205', ects: 8, year: 2, semester: 2, isElective: false },
    { name: 'Grafika', code: 'COMP206', ects: 6, year: 2, semester: 2, isElective: false },
    { name: 'Statistika', code: 'COMP207', ects: 6, year: 2, semester: 2, isElective: false },
    // GODINA 2 - IZBORNI (7)
    { name: 'React', code: 'COMP208', ects: 6, year: 2, semester: 1, isElective: true },
    { name: 'Data Science', code: 'COMP209', ects: 6, year: 2, semester: 1, isElective: true },
    { name: 'Flutter', code: 'COMP210', ects: 6, year: 2, semester: 1, isElective: true },
    { name: 'MongoDB', code: 'COMP211', ects: 5, year: 2, semester: 2, isElective: true },
    { name: 'Docker', code: 'COMP212', ects: 6, year: 2, semester: 2, isElective: true },
    { name: 'UI/UX', code: 'COMP213', ects: 5, year: 2, semester: 2, isElective: true },
    { name: 'Unity', code: 'COMP214', ects: 6, year: 2, semester: 2, isElective: true },

    // GODINA 3 - OBAVEZNI (7)
    { name: 'AI', code: 'COMP301', ects: 8, year: 3, semester: 1, isElective: false },
    { name: 'Cloud', code: 'COMP302', ects: 7, year: 3, semester: 1, isElective: false },
    { name: 'Security', code: 'COMP303', ects: 7, year: 3, semester: 1, isElective: false },
    { name: 'Deep Learning', code: 'COMP304', ects: 8, year: 3, semester: 2, isElective: false },
    { name: 'Microservices', code: 'COMP305', ects: 7, year: 3, semester: 2, isElective: false },
    { name: 'Praktikum', code: 'COMP306', ects: 8, year: 3, semester: 2, isElective: false },
    { name: 'Arhitektura', code: 'COMP307', ects: 5, year: 3, semester: 2, isElective: false },
    // GODINA 3 - IZBORNI (7)
    { name: 'Kubernetes', code: 'COMP308', ects: 6, year: 3, semester: 1, isElective: true },
    { name: 'IoT', code: 'COMP309', ects: 6, year: 3, semester: 1, isElective: true },
    { name: 'Quantum', code: 'COMP310', ects: 6, year: 3, semester: 1, isElective: true },
    { name: 'NLP', code: 'COMP311', ects: 6, year: 3, semester: 2, isElective: true },
    { name: 'Computer Vision', code: 'COMP312', ects: 6, year: 3, semester: 2, isElective: true },
    { name: 'Blockchain', code: 'COMP313', ects: 6, year: 3, semester: 2, isElective: true },
    { name: 'Big Data', code: 'COMP314', ects: 6, year: 3, semester: 2, isElective: true },

    // GODINA 4 - OBAVEZNI (7)
    { name: 'MLOps', code: 'COMP401', ects: 7, year: 4, semester: 1, isElective: false },
    { name: 'DevOps', code: 'COMP402', ects: 7, year: 4, semester: 1, isElective: false },
    { name: 'Enterprise', code: 'COMP403', ects: 6, year: 4, semester: 1, isElective: false },
    { name: 'Seminarski', code: 'COMP404', ects: 10, year: 4, semester: 1, isElective: false },
    { name: 'Diplomski', code: 'COMP405', ects: 15, year: 4, semester: 2, isElective: false },
    { name: 'Startup', code: 'COMP406', ects: 5, year: 4, semester: 1, isElective: false },
    { name: 'Leadership', code: 'COMP407', ects: 5, year: 4, semester: 2, isElective: false },
    // GODINA 4 - IZBORNI (7)
    { name: 'Edge AI', code: 'COMP408', ects: 6, year: 4, semester: 1, isElective: true },
    { name: 'RL', code: 'COMP409', ects: 6, year: 4, semester: 1, isElective: true },
    { name: 'Unreal', code: 'COMP410', ects: 6, year: 4, semester: 1, isElective: true },
    { name: 'Web3', code: 'COMP411', ects: 6, year: 4, semester: 1, isElective: true },
    { name: 'Serverless', code: 'COMP412', ects: 6, year: 4, semester: 1, isElective: true },
    { name: 'Robotics', code: 'COMP413', ects: 6, year: 4, semester: 1, isElective: true },
    { name: 'AR/VR', code: 'COMP414', ects: 6, year: 4, semester: 1, isElective: true },
  ];

  // Helper function
  async function createSubjects(majorCode: string, subjects: any[]) {
    const major = majors.find((m) => m.code === majorCode)!;
    let created = 0;

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
          description: `${subject.name} - ${subject.isElective ? 'Izborni' : 'Obavezni'} predmet (${subject.ects} ECTS)`,
          majorId: major.id,
          yearPlanId: yearPlan.id,
        },
      });
      created++;
    }
    return created;
  }

  console.log('📚 Creating subjects for RAČUNARSTVO...');
  const compCount = await createSubjects('COMP', compSubjects);
  console.log(`✅ Created ${compCount} subjects for Računarstvo`);

  // IT SUBJECTS - samo definicija, ista struktura
  const itSubjects = generateITSubjects();
  console.log('📚 Creating subjects for IT...');
  const itCount = await createSubjects('IT', itSubjects);
  console.log(`✅ Created ${itCount} subjects for IT`);

  // ACFI SUBJECTS
  const acfiSubjects = generateACFISubjects();
  console.log('📚 Creating subjects for RAČUNOVODSTVO I FINANSIJE...');
  const acfiCount = await createSubjects('ACFI', acfiSubjects);
  console.log(`✅ Created ${acfiCount} subjects for ACFI`);

  // Summary
  const totalSubjects = await prisma.subject.count();
  const totalRequired = await prisma.subject.count({ where: { isElective: false } });
  const totalElective = await prisma.subject.count({ where: { isElective: true } });

  console.log('\n✨ SEED COMPLETED ✨');
  console.log('=================================');
  console.log(`📊 Total Subjects: ${totalSubjects}`);
  console.log(`📌 Required: ${totalRequired}`);
  console.log(`🎯 Elective: ${totalElective}`);
  console.log('=================================');
  console.log('📝 Struktura: 7 obaveznih + 7 izbornih (student bira 3) po semestru');
  console.log('=================================\n');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Seed failed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
