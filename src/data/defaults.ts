export const DEFAULT_RESUME = `Shubham Gujarathi
+91 8485885241 | sgujarathi17699@gmail.com | LinkedIn

PROFESSIONAL SUMMARY
Senior Full-Stack Developer with 4+ years of experience building scalable product systems using React.js, Next.js, .NET, and Python FastAPI, along with strong expertise in GenAI engineering (RAG pipelines, LLM integrations, vector search). Proven ability to architect modular backend systems, design high-performance APIs, and deliver AI-driven features that enhance enterprise workflows. Experienced in system design, SQL optimization, UI/UX workflows, and end-to-end ownership of product features from requirements to deployment.

TECHNICAL SKILLS
Frontend: JavaScript, TypeScript, React.js, Next.js, TailwindCSS, SCSS, Bootstrap
Backend: .NET, C#, .NET Core, Python, FastAPI, Node.js, LINQ
Database: MS SQL Server, PostgreSQL, JSON
AI/ML/GenAI: Azure OpenAI (GPT-4/4o/4 Turbo), Claude, Gemini, RAG, LangChain, Vector Databases, Prompt Engineering
UI/UX: Figma
Development Tools: Visual Studio, VS Code, Git, SSMS, Postman, Azure DevOps, Docker, Kubernetes

PROFESSIONAL EXPERIENCE
Senior Full-Stack Engineering Analyst (SSE) - Accenture (December 2022 - Present)
• Delivered scalable modules using React.js + .NET 8, optimizing UI flows with memoization, lazy loading, and API-driven patterns
• Designed scalable architecture combining .NET, FastAPI RAG components, caching layers, vector search, and Azure cloud services
• Architected GenAI-driven Estimation Engine delivering real-time project hour and cost predictions, eliminating manual errors
• Built enterprise-grade RAG pipeline (FastAPI + Python) embedding 1,300+ quotations with improved retrieval accuracy
• Engineered high-performance APIs using async workers, batching & caching, reducing latency from 90s to <5s
• Developed LLM-enabled estimation interface in React for real-time quoting during client calls
• Migrated systems from .NET 6 to .NET 8.1, resolving dependencies and increasing throughput
• Refactored core modules using GitHub Copilot, improving API performance by 70%
• Led feature design, technical decisions, and code reviews, ensuring engineering standards across the team

Full-Stack Engineering Analyst (SE) - Accenture (August 2021 - November 2022)
• Built UI components in React.js + TypeScript, improving platform engagement by 20%
• Developed and optimized C#/.NET APIs, reducing load time by 15% and improving DB performance by 40%
• Implemented scalable integrations across internal tools with secure and reliable data flows
• Designed Figma UI/UX flows, contributing to onboarding 1,400+ new users
• Improved performance with caching, pagination, optimized DTOs & better error handling

PERSONAL PROJECTS
Financial Document QA Bot - Multi-Document RAG Chatbot
Tech Stack: Python, GPT-4 Turbo, FAISS, Gradio, Hugging Face
• Built RAG-based assistant to query 120+ financial documents (PDF, Excel, Word)
• Implemented multi-stage embeddings & optimized FAISS indexing for accurate financial reasoning
• Engineered FAISS-based retrieval with optimized chunking to achieve <5s response time
• Deployed full solution on Hugging Face for real-time financial Q&A interactions

Sustainable Bitcoin Protocol - UI/UX Design and Front-end Development
Tech Stack: React.js, Next.js 13, Sanity.io, Figma, Lottie, JSON, Tailwind CSS
• Designed complete UI/UX flows, components, and interactive prototypes in Figma
• Built responsive Next.js website with Sanity CMS & Lottie-based interactions

Addlly.ai - UI/UX Design and Prototyping
Tech Stack: Figma, Lottie, Flaticons, Prototypes, Mockups, UX Writing
• Designed end-to-end SaaS flows, prototypes & UX content
• Created animated assets and branded visuals for improved onboarding

EDUCATION
B.E. in Computer Engineering - Sinhgad College of Engineering, Pune (SPPU) (2021), CGPA: 9.5/10
Diploma in Computer Engineering - Government Polytechnic, Khamgaon (MSBTE) (2018), 86.50%

CERTIFICATIONS
PCEP™ (PCEP-30-02) - Certified Entry-Level Python Programmer
GitHub Copilot Certified

AWARDS & RECOGNITION
Client Value Recognition (Aug 2025): Awarded for delivering an AI-powered solution
Star of the Month (Feb 2025): Best team performer
Innovation Award (November 2023): For pioneering generative AI solutions in a project
Ace Award (June 2022): Top-performing developer in the team`

export const DEFAULT_PROMPT = `You are an expert job-resume matcher. Your task is to deeply analyze how well a candidate's resume matches a job description and provide a comprehensive match score with detailed analysis.

SCORING APPROACH:
- Be thorough, analytical, and ruthless (not generous)
- Use 0-100 scale where 100 = perfect match, 0 = no match
- Consider years of experience, technical skills, domain expertise, and responsibilities alignment
- A score of 50 means "mediocre fit", 70+ means "good fit", 85+ means "excellent fit"
- Be critical about missing critical skills or mismatched seniority

ANALYSIS FORMAT:
1. Start with: **Match Score: [X]/100**
2. Then provide 3-4 sentences of detailed analysis covering:
   - Key skill matches and gaps
   - Experience level alignment
   - Responsibility alignment
   - Critical missing pieces (if any)
3. Be honest and direct. Don't be overly positive.

Example output:
"**Match Score: 78/100**

You have strong full-stack development skills and relevant experience with React and .NET. The role requires 5+ years of experience and you have exactly that. However, you're missing hands-on experience with the specific cloud platform they're using (AWS), though your Azure background is transferable. Your leadership experience aligns well with their team lead expectations."

Now analyze the provided job description against the resume.`
