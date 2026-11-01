import { ProjectBlueprint } from '@/types';

export const generateDemoBlueprint = (): Omit<ProjectBlueprint, 'id' | 'createdAt' | 'updatedAt'> => {
  return {
    project: {
      name: 'TutorConnect',
      tagline: 'Empowering students to find the perfect tutor.',
      summary: 'TutorConnect is a platform connecting university students with qualified tutors. It facilitates finding, comparing, booking, and reviewing tutors to ensure a seamless educational experience.',
      problemStatement: 'University students often struggle to find reliable, qualified tutors for specific subjects, while tutors lack a centralized platform to offer their services and build reputation.',
      proposedSolution: 'A dual-sided marketplace web application where tutors can create professional profiles and students can easily search, book, and review them in a trusted environment.',
      objectives: [
        'Provide a centralized platform for tutor discovery.',
        'Simplify the booking and scheduling process.',
        'Build trust through a transparent review system.',
      ],
      targetUsers: [
        'University students seeking academic help.',
        'Qualified individuals or students wanting to offer tutoring services.',
        'Platform administrators managing quality and disputes.',
      ],
    },
    roles: [
      {
        name: 'Student',
        description: 'Searches for tutors, books sessions, communicates with tutors, and submits reviews.',
      },
      {
        name: 'Tutor',
        description: 'Creates a profile, manages availability, accepts bookings, and communicates with students.',
      },
      {
        name: 'Admin',
        description: 'Manages users, content, reports, and platform settings.',
      },
    ],
    features: [
      {
        name: 'Tutor Search & Filtering',
        description: 'Allows students to search tutors by subject, availability, rating, and price.',
        priority: 'Must Have',
        relatedRole: 'Student',
      },
      {
        name: 'Profile Management',
        description: 'Tutors can update their bio, subjects, pricing, and availability schedule.',
        priority: 'Must Have',
        relatedRole: 'Tutor',
      },
      {
        name: 'Booking System',
        description: 'Students can request a session based on the tutor\'s calendar.',
        priority: 'Must Have',
        relatedRole: 'Student',
      },
      {
        name: 'Review & Rating',
        description: 'Students can leave a rating and text review after a completed session.',
        priority: 'Should Have',
        relatedRole: 'Student',
      },
      {
        name: 'Admin Dashboard',
        description: 'Overview of platform metrics, user management, and moderation tools.',
        priority: 'Could Have',
        relatedRole: 'Admin',
      },
    ],
    functionalRequirements: [
      {
        id: 'FR-001',
        title: 'User Registration',
        description: 'The system shall allow users to register as either a Student or a Tutor using email and password.',
        priority: 'Must Have',
        actor: 'Student, Tutor',
        preconditions: ['User does not already have an account'],
        trigger: 'User submits the registration form',
        mainBehavior: [
          'System validates input fields.',
          'System securely hashes the password.',
          'System creates a new user account.',
          'System sends a welcome email.'
        ],
        alternativeFlow: ['If email is already registered, display an error message.'],
        postconditions: ['Account is created and user is logged in.'],
        acceptanceCriteria: [
          'Given valid credentials, when registration is submitted, the system creates the account.'
        ]
      },
      {
        id: 'FR-002',
        title: 'User Authentication',
        description: 'The system shall allow registered users to log in securely.',
        priority: 'Must Have',
      },
      {
        id: 'FR-003',
        title: 'Search Functionality',
        description: 'The system shall provide a search bar and filters for students to find tutors by subject.',
        priority: 'Must Have',
      },
      {
        id: 'FR-004',
        title: 'Booking Management',
        description: 'The system shall allow tutors to accept, decline, or reschedule booking requests.',
        priority: 'Should Have',
      },
    ],
    nonFunctionalRequirements: [
      {
        id: 'NFR-001',
        category: 'Performance',
        description: 'The search results must load within 2 seconds under normal load conditions.',
      },
      {
        id: 'NFR-002',
        category: 'Usability',
        description: 'The application must be fully responsive and accessible on mobile devices.',
      },
    ],
    userStories: [
      {
        id: 'US-001',
        role: 'Student',
        action: 'search for tutors by subject',
        benefit: 'I can find a suitable tutor for my specific course.',
        acceptanceCriteria: [
          'Given I am on the search page, when I enter "Calculus", then I see tutors teaching Calculus.',
          'Given I see search results, when I apply a price filter, then results update to match.',
        ],
      },
      {
        id: 'US-002',
        role: 'Tutor',
        action: 'set my availability schedule',
        benefit: 'students only book me when I am actually free.',
        acceptanceCriteria: [
          'Given I am on my profile settings, when I select free time slots, then those slots become bookable by students.',
        ],
      },
    ],
    useCases: [
      {
        id: 'UC-001',
        name: 'Book a Session',
        actor: 'Student',
        goal: 'Successfully schedule a tutoring session with a selected tutor.',
        description: 'A student finds a tutor and books an available time slot.',
        preconditions: ['Student is logged in.', 'Tutor has available time slots.'],
        trigger: 'Student clicks "Book Session" on a tutor\'s profile.',
        mainSuccessScenario: [
          'Student navigates to Tutor profile.',
          'Student clicks "Book Session".',
          'Student selects a time slot and confirms.',
          'System notifies Tutor of pending request.',
        ],
        alternativeFlows: [
          'Tutor declines the request: System notifies Student and restores availability.',
        ],
        exceptionFlows: [
          'Time slot gets booked by another user simultaneously: System alerts student and prompts to pick another slot.',
        ],
        postconditions: ['A pending booking record is created.', 'Time slot is temporarily reserved.'],
        relatedRequirements: ['FR-004'],
      },
    ],
    database: {
      entities: [
        {
          name: 'User',
          fields: [
            { name: 'id', type: 'UUID', description: 'Unique identifier' },
            { name: 'email', type: 'String', description: 'User email' },
            { name: 'passwordHash', type: 'String', description: 'Hashed password' },
            { name: 'role', type: 'Enum', description: 'Student, Tutor, Admin' },
          ],
        },
        {
          name: 'Booking',
          fields: [
            { name: 'id', type: 'UUID', description: 'Unique identifier' },
            { name: 'studentId', type: 'UUID', description: 'Reference to User' },
            { name: 'tutorId', type: 'UUID', description: 'Reference to User' },
            { name: 'status', type: 'Enum', description: 'Pending, Confirmed, Completed' },
          ],
        },
      ],
      relationships: [
        { source: 'User', relationship: 'creates', target: 'Booking (as Student)' },
        { source: 'User', relationship: 'receives', target: 'Booking (as Tutor)' },
      ],
    },
    techStack: [
      {
        name: 'Frontend',
        technologies: [
          { name: 'Next.js', reason: 'Provides SSR, SEO benefits, and a robust app router for dynamic views.' },
          { name: 'Tailwind CSS', reason: 'Enables rapid UI development with utility classes.' },
        ],
      },
      {
        name: 'Backend',
        technologies: [
          { name: 'Next.js API Routes', reason: 'Keeps the backend and frontend in a unified repository.' },
          { name: 'Prisma ORM', reason: 'Type-safe database access and easy schema migrations.' },
        ],
      },
      {
        name: 'Database',
        technologies: [
          { name: 'PostgreSQL', reason: 'Reliable, open-source relational database suitable for complex queries.' },
        ],
      },
    ],
    roadmap: [
      {
        name: 'Phase 1: Planning & Setup',
        goal: 'Finalize requirements and initialize project repository.',
        tasks: ['Approve SRS', 'Set up Next.js', 'Configure database and ORM'],
        dependencies: ['None'],
        effort: '1 Week',
      },
      {
        name: 'Phase 2: Authentication & Profiles',
        goal: 'Implement user login and basic profile editing.',
        tasks: ['Build auth flows', 'Create Student/Tutor dashboards', 'Profile schema implementation'],
        dependencies: ['Phase 1'],
        effort: '2 Weeks',
      },
      {
        name: 'Phase 3: Core Booking Flow',
        goal: 'Enable students to search and book tutors.',
        tasks: ['Implement search algorithm', 'Build booking calendar UI', 'Handle booking state transitions'],
        dependencies: ['Phase 2'],
        effort: '3 Weeks',
      },
    ],
    srs: {
      documentControl: {
        projectName: 'TutorConnect',
        documentVersion: '1.0',
        status: 'Draft / Proposed',
        date: new Date().toISOString().split('T')[0],
        preparedBy: 'Idea2App AI',
        revisionHistory: [
          { version: '1.0', date: new Date().toISOString().split('T')[0], description: 'Initial SRS Generation' }
        ]
      },
      introduction: {
        purpose: 'This document defines the software requirements for TutorConnect, a platform for university students to find and book tutors.',
        scope: 'The platform encompasses user registration, profile management, tutor search, booking management, and a review system. It does not include integrated video calling in version 1.0.',
        intendedAudience: ['End users (Students and Tutors)', 'Developers', 'Testers', 'Project Managers'],
        productOverview: 'A dual-sided marketplace web application connecting students with tutors.',
        definitionsAndAcronyms: [
          { term: 'SRS', definition: 'Software Requirements Specification' },
          { term: 'SSR', definition: 'Server-Side Rendering' }
        ],
        references: ['No external references were specified.']
      },
      overallDescription: {
        productPerspective: 'TutorConnect is a standalone web-based system operating on modern browsers.',
        productFunctions: 'User authentication, profile building, search engine, booking calendar, and review engine.',
        userClassesAndCharacteristics: [
          { role: 'Student', description: 'Consumers looking for academic help.', responsibilities: ['Search', 'Book', 'Review'], accessLevel: 'Standard' },
          { role: 'Tutor', description: 'Providers offering academic help.', responsibilities: ['Manage Profile', 'Accept Bookings'], accessLevel: 'Standard' }
        ],
        operatingEnvironment: 'Web browser (Chrome, Firefox, Safari, Edge) on desktop and mobile.',
        designConstraints: ['Must be responsive', 'Must run on standard cloud infrastructure'],
        assumptions: ['Users have access to reliable internet.'],
        dependencies: ['Email delivery service (e.g., SendGrid) for notifications.']
      },
      systemFeatures: [
        {
          name: 'Tutor Search & Filtering',
          description: 'Allows students to search tutors by subject, availability, rating, and price.',
          priority: 'Must Have',
          relatedRole: 'Student',
        }
      ],
      functionalRequirements: [
        {
          id: 'FR-001',
          title: 'User Registration',
          description: 'The system shall allow users to register as either a Student or a Tutor using email and password.',
          priority: 'Must Have',
          actor: 'Student, Tutor',
          preconditions: ['User does not already have an account'],
          trigger: 'User submits the registration form',
          mainBehavior: [
            'System validates input fields.',
            'System securely hashes the password.',
            'System creates a new user account.',
            'System sends a welcome email.'
          ],
          alternativeFlow: ['If email is already registered, display an error message.'],
          postconditions: ['Account is created and user is logged in.'],
          acceptanceCriteria: [
            'Given valid credentials, when registration is submitted, the system creates the account.'
          ]
        }
      ],
      nonFunctionalRequirements: [
        {
          id: 'NFR-001',
          category: 'Performance',
          description: 'The search results must load within 2 seconds under normal load conditions.',
        }
      ],
      interfaces: {
        userInterface: 'The application will be accessible via modern web browsers and mobile devices. Dashboards for Student and Tutor will be distinct.',
        softwareInterfaces: 'Integration with an Email service provider via standard REST API.',
        hardwareInterfaces: 'Not applicable to the current system scope.',
        communicationInterfaces: 'HTTP/HTTPS for all data transfer.'
      },
      dataRequirements: {
        dataEntities: [
          {
            name: 'User',
            fields: [
              { name: 'id', type: 'UUID', description: 'Unique identifier' },
              { name: 'email', type: 'String', description: 'User email' },
            ],
          }
        ],
        relationships: [
          { source: 'User', relationship: 'creates', target: 'Booking (as Student)' },
        ],
        dataValidation: 'All emails must be strictly validated. Passwords must be at least 8 characters long.',
        dataIntegrity: 'A Booking cannot exist without valid Student and Tutor foreign keys.',
        dataRetention: 'Inactive accounts will be retained for 1 year before archiving.'
      },
      userStories: [
        {
          id: 'US-001',
          role: 'Student',
          action: 'search for tutors by subject',
          benefit: 'I can find a suitable tutor for my specific course.',
          acceptanceCriteria: [
            'Given I am on the search page, when I enter "Calculus", then I see tutors teaching Calculus.'
          ],
        }
      ],
      useCases: [
        {
          id: 'UC-001',
          name: 'Book a Session',
          actor: 'Student',
          goal: 'Successfully schedule a tutoring session with a selected tutor.',
          description: 'A student finds a tutor and books an available time slot.',
          preconditions: ['Student is logged in.', 'Tutor has available time slots.'],
          trigger: 'Student clicks "Book Session" on a tutor\'s profile.',
          mainSuccessScenario: [
            'Student navigates to Tutor profile.',
            'Student clicks "Book Session".',
            'Student selects a time slot and confirms.',
            'System notifies Tutor of pending request.',
          ],
          alternativeFlows: [
            'Tutor declines the request: System notifies Student and restores availability.',
          ],
          exceptionFlows: [
            'Time slot gets booked by another user simultaneously: System alerts student and prompts to pick another slot.',
          ],
          postconditions: ['A pending booking record is created.', 'Time slot is temporarily reserved.'],
          relatedRequirements: ['FR-004'],
        }
      ],
      architecture: {
        description: 'A standard three-tier architecture utilizing Next.js for both frontend and API layers, backed by a PostgreSQL database.',
        components: [
          { name: 'Frontend (React/Next.js)', responsibility: 'User interaction and presentation.' },
          { name: 'Backend (Next.js API)', responsibility: 'Business logic and API processing.' },
          { name: 'Database (PostgreSQL)', responsibility: 'Persistent application data storage.' }
        ]
      },
      workflows: [
        {
          name: 'Student Registration',
          steps: [
            'Open registration page',
            'Select "Student" role',
            'Enter email and password',
            'Submit form',
            'System validates input and creates account',
            'Redirect to Student Dashboard'
          ]
        }
      ],
      securityRequirements: [
        { id: 'SEC-001', category: 'Authentication', description: 'Passwords must be hashed using bcrypt.' },
        { id: 'SEC-002', category: 'Communication', description: 'All communications must be encrypted via HTTPS.' }
      ],
      traceability: [
        {
          feature: 'Tutor Search & Filtering',
          userStory: 'US-001',
          functionalRequirement: 'FR-003',
          useCase: 'UC-001',
          acceptanceCriteria: 'Given I am on the search page, when I enter "Calculus", then I see tutors teaching Calculus.'
        }
      ],
      verification: {
        approach: 'A combination of automated unit testing for core business logic and manual acceptance testing for user workflows.',
        methods: [
          { requirementId: 'FR-001', method: 'Automated Integration Test' },
          { requirementId: 'FR-003', method: 'Manual Acceptance Test' }
        ]
      },
      constraints: {
        confirmed: ['Must be deployed on a standard cloud provider (e.g., Vercel, AWS).'],
        assumed: ['The system assumes standard timezone structures for calendar bookings.']
      },
      assumptions: [
        { id: 'A-001', description: 'Users have access to reliable internet.' },
        { id: 'A-002', description: 'Users possess a valid email address.' }
      ],
      dependencies: [
        { id: 'D-001', description: 'Email delivery service for notifications.' }
      ],
      futureEnhancements: [
        'In-app messaging between students and tutors.',
        'Integrated video calling for remote tutoring sessions.',
        'Stripe payment integration for automated payouts.'
      ],
      appendices: [
        { title: 'Appendix A - Glossary', content: 'SRS: Software Requirements Specification' }
      ]
    }
  };
};
