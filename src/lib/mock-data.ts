// Mock API responses for development/testing
export const mockApiData = {
    systemSettings: {
        id: 1,
        job_description: `We are seeking a Senior Full Stack Developer with 5+ years of experience in modern web technologies. 

Required Skills:
- Proficiency in React, Node.js, and TypeScript
- Experience with AWS cloud services (Lambda, S3, RDS)
- Strong understanding of database design (PostgreSQL, MongoDB)
- Familiarity with AI/ML integration
- Experience with microservices architecture

Responsibilities:
- Develop and maintain scalable web applications
- Implement AI-powered features using AWS Bedrock
- Collaborate with cross-functional teams
- Write clean, testable, and maintainable code
- Participate in code reviews and technical discussions

Qualifications:
- Bachelor's degree in Computer Science or related field
- Strong problem-solving and analytical skills
- Excellent communication and teamwork abilities
- Experience with agile development methodologies`,
        candidate_threshold: 15,
        candidate_limit: 5,
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-15T14:30:00Z',
    },

    dashboardStats: {
        total_candidates: 7,
        selected_candidates: 3,
        current_threshold: 15,
        threshold_reached: false,
    },

    dashboardStatsCompleted: {
        total_candidates: 15,
        selected_candidates: 3,
        current_threshold: 15,
        threshold_reached: true,
    },

    cvScores: [
        {
            id: 1,
            cv_s3_key: 'cvs/candidate_001.pdf',
            extracted_text: 'John Smith - Senior Full Stack Developer with 6 years of experience...',
            ai_score: 92,
            created_at: '2025-01-20T10:30:00Z',
        },
        {
            id: 2,
            cv_s3_key: 'cvs/candidate_002.pdf',
            extracted_text: 'Sarah Johnson - Software Engineer with expertise in React and Node.js...',
            ai_score: 87,
            created_at: '2025-01-20T11:15:00Z',
        },
        // ... more candidates
    ],

    finalSelectedCandidates: [
        {
            id: 1,
            cv_s3_key: 'cvs/candidate_001.pdf',
            extracted_text: `John Smith
Senior Full Stack Developer

Contact Information:
Email: john.smith@email.com
Phone: +1 (555) 123-4567
Location: San Francisco, CA

Professional Experience:

Senior Full Stack Developer - TechCorp Inc. (2020 - Present)
• Led development of microservices architecture serving 1M+ users
• Implemented AI-powered recommendation system using AWS Bedrock
• Built scalable React applications with TypeScript and Next.js
• Designed and optimized PostgreSQL databases for high-performance queries
• Mentored junior developers and conducted code reviews

Full Stack Developer - StartupXYZ (2018 - 2020)
• Developed end-to-end web applications using React, Node.js, and MongoDB
• Integrated third-party APIs and payment processing systems
• Implemented automated testing and CI/CD pipelines
• Collaborated with UX/UI designers to create responsive interfaces

Technical Skills:
• Frontend: React, TypeScript, Next.js, HTML5, CSS3, Tailwind CSS
• Backend: Node.js, Express.js, Python, RESTful APIs
• Databases: PostgreSQL, MongoDB, Redis
• Cloud: AWS (Lambda, S3, RDS, EC2), Docker, Kubernetes
• AI/ML: AWS Bedrock, TensorFlow, OpenAI API integration
• Tools: Git, Jest, ESLint, Webpack, GitHub Actions

Education:
• Bachelor of Science in Computer Science - Stanford University (2014-2018)
• Relevant Coursework: Data Structures, Algorithms, Machine Learning, Database Systems

Certifications:
• AWS Solutions Architect Associate
• MongoDB Certified Developer

Projects:
• E-commerce Platform: Built a full-stack e-commerce solution with React, Node.js, and PostgreSQL
• AI Content Generator: Created an AI-powered content generation tool using AWS Bedrock
• Real-time Analytics Dashboard: Developed a real-time data visualization platform using WebSockets`,
            ai_score: 92,
            profile_summary: `John Smith is an exceptional Senior Full Stack Developer with 6 years of comprehensive experience. He demonstrates strong expertise in the required tech stack, particularly React, Node.js, TypeScript, and AWS services. His experience with AI/ML integration using AWS Bedrock directly aligns with the job requirements. He has proven leadership skills, having mentored junior developers and led microservices architecture projects. His educational background from Stanford and AWS certifications further validate his technical competency. John's experience with scalable systems serving 1M+ users shows he can handle enterprise-level challenges.`,
            created_at: '2025-01-22T09:00:00Z',
        },
        {
            id: 2,
            cv_s3_key: 'cvs/candidate_002.pdf',
            extracted_text: `Sarah Johnson
Software Engineer

Contact Information:
Email: sarah.johnson@email.com
Phone: +1 (555) 987-6543
Location: Austin, TX

Professional Experience:

Software Engineer - CloudTech Solutions (2019 - Present)
• Developed React-based dashboard applications with TypeScript
• Built RESTful APIs using Node.js and Express.js
• Worked with PostgreSQL and implemented database optimization strategies
• Integrated AWS services including Lambda and S3 for serverless applications
• Participated in agile development processes and sprint planning

Junior Developer - WebDev Agency (2017 - 2019)
• Created responsive websites using modern JavaScript frameworks
• Collaborated with design teams to implement pixel-perfect UIs
• Wrote unit tests and participated in code review processes
• Maintained and updated existing web applications

Technical Skills:
• Frontend: React, JavaScript, TypeScript, HTML5, CSS3, Bootstrap
• Backend: Node.js, Express.js, RESTful API development
• Databases: PostgreSQL, MySQL
• Cloud: AWS (Lambda, S3, CloudWatch), Basic Docker knowledge
• Tools: Git, npm, Webpack, Jest

Education:
• Bachelor of Science in Software Engineering - University of Texas at Austin (2013-2017)

Projects:
• Project Management Tool: Built a team collaboration platform using React and Node.js
• Weather App: Created a responsive weather application with geolocation features
• Blog Platform: Developed a content management system with user authentication`,
            ai_score: 87,
            profile_summary: `Sarah Johnson is a solid Software Engineer with 5+ years of experience that aligns well with the job requirements. She has strong proficiency in React, Node.js, and TypeScript, and practical experience with AWS services including Lambda and S3. Her PostgreSQL experience and API development skills are valuable assets. While she lacks specific AI/ML integration experience, her strong foundation in the core technologies and collaborative approach to development make her a promising candidate who could quickly adapt to AI-powered features.`,
            created_at: '2025-01-22T09:01:00Z',
        },
        {
            id: 3,
            cv_s3_key: 'cvs/candidate_003.pdf',
            extracted_text: `Michael Chen
Full Stack Developer

Contact Information:
Email: michael.chen@email.com
Phone: +1 (555) 456-7890
Location: Seattle, WA

Professional Experience:

Full Stack Developer - InnovateTech (2018 - Present)
• Designed and implemented microservices using Node.js and TypeScript
• Built responsive web applications with React and modern CSS frameworks
• Integrated machine learning models using AWS SageMaker and Bedrock
• Optimized database performance for PostgreSQL and MongoDB
• Led migration of monolithic applications to cloud-native architecture

Software Developer - DataCorp (2016 - 2018)
• Developed data visualization tools using React and D3.js
• Created ETL pipelines for processing large datasets
• Implemented user authentication and authorization systems
• Collaborated with data scientists to productionize ML models

Technical Skills:
• Frontend: React, TypeScript, JavaScript, Vue.js, HTML5, CSS3
• Backend: Node.js, Python, Express.js, FastAPI
• Databases: PostgreSQL, MongoDB, Redis
• Cloud: AWS (Lambda, S3, RDS, SageMaker, Bedrock), Google Cloud Platform
• AI/ML: TensorFlow, PyTorch, scikit-learn, AWS Bedrock, OpenAI API
• DevOps: Docker, Kubernetes, Jenkins, GitHub Actions

Education:
• Master of Science in Computer Science - University of Washington (2014-2016)
• Bachelor of Science in Mathematics - UC Berkeley (2010-2014)

Certifications:
• AWS Certified Solutions Architect
• Google Cloud Professional Developer

Projects:
• AI-Powered Analytics Platform: Led development of an analytics dashboard with ML predictions
• Real-time Chat Application: Built a scalable chat system using WebSockets and Redis
• Automated Trading System: Created a cryptocurrency trading bot with ML price prediction`,
            ai_score: 95,
            profile_summary: `Michael Chen is an outstanding Full Stack Developer who exceeds the job requirements in multiple areas. With 7+ years of experience, he has deep expertise in React, Node.js, TypeScript, and extensive AWS experience including direct work with AWS Bedrock for AI integration. His Master's degree in Computer Science and additional AI/ML experience with TensorFlow and PyTorch make him particularly valuable for AI-powered feature development. His leadership in cloud migration projects and experience with microservices architecture demonstrate senior-level capabilities. Michael's combination of technical depth and practical AI implementation experience makes him an exceptional candidate.`,
            created_at: '2025-01-22T09:02:00Z',
        },
        {
            id: 4,
            cv_s3_key: 'cvs/candidate_004.pdf',
            extracted_text: `Emma Rodriguez
Senior Software Engineer

Contact Information:
Email: emma.rodriguez@email.com
Phone: +1 (555) 321-0987
Location: New York, NY

Professional Experience:

Senior Software Engineer - FinTech Innovations (2020 - Present)
• Architected and developed high-performance trading applications using React and TypeScript
• Built secure RESTful APIs with Node.js handling millions of transactions
• Implemented real-time data streaming with WebSockets and Redis
• Designed database schemas and optimized queries for PostgreSQL
• Integrated AWS services for scalable cloud infrastructure

Software Engineer - E-commerce Giant (2017 - 2020)
• Developed customer-facing features for web and mobile platforms
• Worked on recommendation algorithms and A/B testing frameworks
• Collaborated with ML engineers to integrate personalization features
• Maintained high code quality through automated testing and peer reviews

Frontend Developer - Digital Agency (2015 - 2017)
• Created responsive websites and web applications using modern JavaScript
• Worked closely with UX/UI designers to implement intuitive interfaces
• Optimized application performance and implemented SEO best practices

Technical Skills:
• Frontend: React, TypeScript, JavaScript, Next.js, HTML5, CSS3, SASS
• Backend: Node.js, Express.js, Python, RESTful APIs, GraphQL
• Databases: PostgreSQL, MongoDB, Redis, DynamoDB
• Cloud: AWS (EC2, Lambda, S3, RDS, CloudFront), Azure basics
• Testing: Jest, Cypress, Unit Testing, Integration Testing
• Tools: Git, Docker, Webpack, npm, Jenkins

Education:
• Bachelor of Science in Computer Engineering - Columbia University (2011-2015)

Certifications:
• AWS Certified Developer Associate

Projects:
• Real-time Trading Dashboard: Built a complex financial dashboard with live data updates
• Payment Processing System: Developed a secure payment gateway with fraud detection
• Social Media Analytics Tool: Created a platform for social media performance tracking`,
            ai_score: 89,
            profile_summary: `Emma Rodriguez is a highly skilled Senior Software Engineer with 8+ years of progressive experience. She demonstrates excellent proficiency in the required tech stack including React, TypeScript, Node.js, and AWS services. Her experience in FinTech with high-performance applications and secure systems shows she can handle complex, mission-critical development. While she has some exposure to ML integration through recommendation systems, she could benefit from more direct AI/ML experience. Her strong educational background from Columbia and proven track record with scalable systems make her a strong candidate for senior-level responsibilities.`,
            created_at: '2025-01-22T09:03:00Z',
        },
        {
            id: 5,
            cv_s3_key: 'cvs/candidate_005.pdf',
            extracted_text: `David Park
Full Stack Engineer

Contact Information:
Email: david.park@email.com
Phone: +1 (555) 654-3210
Location: Los Angeles, CA

Professional Experience:

Full Stack Engineer - HealthTech Startup (2019 - Present)
• Developed HIPAA-compliant web applications using React and Node.js
• Integrated telemedicine features with video conferencing APIs
• Built data analytics dashboards for healthcare professionals
• Implemented machine learning models for patient risk assessment
• Worked with PostgreSQL and ensured data security compliance

Software Developer - EdTech Company (2017 - 2019)
• Created interactive learning platforms using React and TypeScript
• Developed content management systems with Node.js backend
• Integrated third-party educational tools and assessment platforms
• Collaborated with UX designers to create engaging user experiences

Junior Developer - Local Development Agency (2015 - 2017)
• Built websites and web applications for various clients
• Gained experience with different JavaScript frameworks and libraries
• Learned agile development methodologies and client communication

Technical Skills:
• Frontend: React, TypeScript, JavaScript, HTML5, CSS3, Material-UI
• Backend: Node.js, Express.js, Python (basic), RESTful APIs
• Databases: PostgreSQL, MongoDB
• Cloud: AWS (EC2, S3, Lambda), Google Cloud Platform (basic)
• ML/AI: Basic machine learning with Python, TensorFlow (learning)
• Tools: Git, npm, Docker (basic), Jest

Education:
• Bachelor of Science in Information Systems - UCLA (2011-2015)

Certifications:
• AWS Cloud Practitioner

Projects:
• Healthcare Analytics Platform: Built a dashboard for tracking patient outcomes
• Learning Management System: Created an LMS with progress tracking and assessments
• Appointment Booking System: Developed a scheduling platform for medical practices`,
            ai_score: 84,
            profile_summary: `David Park is a competent Full Stack Engineer with 6+ years of experience in specialized domains like HealthTech and EdTech. He has solid proficiency in React, TypeScript, and Node.js, with basic AWS knowledge and PostgreSQL experience. His exposure to machine learning in healthcare applications shows potential for AI integration work, though he would need to strengthen his AWS and AI/ML skills. His experience with HIPAA compliance and data security demonstrates attention to quality and regulatory requirements. David would be a good cultural fit and has the foundation to grow into the AI-powered development aspects of the role.`,
            created_at: '2025-01-22T09:04:00Z',
        },
    ],
};

// Export individual mock responses
export const mockResponses = {
    '/api/system-settings': {
        GET: () => mockApiData.systemSettings,
        PUT: (data: any) => ({ ...mockApiData.systemSettings, ...data, updated_at: new Date().toISOString() }),
    },

    '/api/dashboard/stats': {
        GET: () => {
            // Simulate different states based on conditions
            const shouldShowCompleted = Math.random() > 0.5; // 50% chance to show completed state
            return shouldShowCompleted ? mockApiData.dashboardStatsCompleted : mockApiData.dashboardStats;
        },
    },

    '/api/cv-scores': {
        GET: () => mockApiData.cvScores,
    },

    '/api/final-selected-candidates': {
        GET: () => mockApiData.finalSelectedCandidates,
    },
};