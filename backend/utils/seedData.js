const User = require('../models/User');
const Project = require('../models/Project');
const Proposal = require('../models/Proposal');
const Milestone = require('../models/Milestone');
const Message = require('../models/Message');
const Review = require('../models/Review');

const seedDatabase = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount > 0) {
      console.log('Database already contains data. Skipping initial seeding.');
      return;
    }

    console.log('Seeding initial marketplace data...');

    // 1. Create Users (Admin, Clients, Freelancers)
    const admin = await User.create({
      name: 'System Admin',
      email: 'admin@platform.com',
      password: 'admin123',
      role: 'admin',
      verificationStatus: 'verified',
      bio: 'Platform Operations & Support Admin'
    });

    const client1 = await User.create({
      name: 'Acme Software Corp',
      email: 'client@acme.com',
      password: 'client123',
      role: 'client',
      title: 'VP of Engineering',
      companyName: 'Acme Software',
      bio: 'Building enterprise AI solutions and modern web applications.',
      verificationStatus: 'verified',
      spent: 4500,
      rating: 4.9
    });

    const client2 = await User.create({
      name: 'Elena Rostova',
      email: 'elena@designhub.io',
      password: 'client123',
      role: 'client',
      title: 'Design Director',
      companyName: 'DesignHub Studio',
      bio: 'Creative agency seeking top-tier UI design and frontend talent.',
      verificationStatus: 'verified',
      spent: 2800,
      rating: 4.8
    });

    const freelancer1 = await User.create({
      name: 'Alex Rivera',
      email: 'freelancer@dev.com',
      password: 'free123',
      role: 'freelancer',
      title: 'Full-Stack React & Node Architect',
      skills: ['React', 'Node.js', 'MongoDB', 'Tailwind CSS', 'TypeScript', 'GraphQL'],
      bio: 'Senior full-stack engineer with 6+ years experience building scalable Web Apps and REST APIs.',
      experience: '6 Years in Full Stack Dev',
      hourlyRate: 65,
      earnings: 8200,
      rating: 4.9,
      reviewsCount: 12,
      verificationStatus: 'verified'
    });

    const freelancer2 = await User.create({
      name: 'Sophia Chen',
      email: 'sophia@ui.dev',
      password: 'free123',
      role: 'freelancer',
      title: 'Product Designer & UI/UX Specialist',
      skills: ['UI/UX Design', 'Figma', 'Tailwind CSS', 'React', 'Prototyping'],
      bio: 'Passionate UI/UX designer crafting intuitive digital experiences and high-converting interfaces.',
      experience: '4 Years Design Experience',
      hourlyRate: 50,
      earnings: 5400,
      rating: 5.0,
      reviewsCount: 8,
      verificationStatus: 'pending'
    });

    // 2. Create Sample Projects
    const p1 = await Project.create({
      title: 'E-Commerce SaaS Dashboard with Real-Time Analytics',
      description: 'We need an experienced React & Node developer to build a modern analytics dashboard with custom chart components, real-time web sockets, and MongoDB backend.',
      category: 'Web Development',
      requiredSkills: ['React', 'Node.js', 'MongoDB', 'Tailwind CSS', 'Socket.io'],
      budget: 2500,
      budgetType: 'fixed',
      deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      clientId: client1._id,
      status: 'open'
    });

    const p2 = await Project.create({
      title: 'Mobile Healthcare & Telemedicine React Native App',
      description: 'Looking for a cross-platform mobile developer to implement patient appointment booking, video consultation interface, and secure medical file sharing.',
      category: 'Mobile Development',
      requiredSkills: ['React', 'Mobile Development', 'UI/UX Design'],
      budget: 3500,
      budgetType: 'fixed',
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      clientId: client1._id,
      status: 'in_progress',
      hiredFreelancerId: freelancer1._id,
      escrowTotal: 1500
    });

    const p3 = await Project.create({
      title: 'Fintech Mobile Wallet UI/UX Redesign in Figma',
      description: 'Redesign our crypto and fiat wallet mobile app interface. Deliverables include high-fidelity wireframes, interactive prototype, and design system design tokens.',
      category: 'UI/UX Design',
      requiredSkills: ['UI/UX Design', 'Figma', 'Prototyping'],
      budget: 1800,
      budgetType: 'fixed',
      deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      clientId: client2._id,
      status: 'open'
    });

    // 3. Create Sample Proposals
    await Proposal.create({
      projectId: p1._id,
      freelancerId: freelancer1._id,
      coverLetter: 'Hi Acme Software team! I have built over 15 React analytics dashboards. I can deliver a crisp, responsive dashboard with Tailwind CSS and Socket.io live updates within 10 days.',
      bidAmount: 2400,
      estimatedDays: 10,
      status: 'pending'
    });

    await Proposal.create({
      projectId: p1._id,
      freelancerId: freelancer2._id,
      coverLetter: 'Hello! I can handle both the UI design and React frontend integration for your SaaS dashboard to make it feel extremely modern and responsive.',
      bidAmount: 2200,
      estimatedDays: 12,
      status: 'pending'
    });

    // Accepted proposal for p2
    await Proposal.create({
      projectId: p2._id,
      freelancerId: freelancer1._id,
      coverLetter: 'Exited to collaborate on the Healthcare App! I have previous experience with HIPAA compliant data architecture and WebRTC video flows.',
      bidAmount: 3500,
      estimatedDays: 21,
      status: 'accepted'
    });

    // 4. Create Sample Milestones for Project 2
    const m1 = await Milestone.create({
      projectId: p2._id,
      title: 'Architecture Setup & User Auth API',
      description: 'Setup JWT authentication, database schemas, and initial screens.',
      amount: 1500,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      status: 'funded',
      fundedAt: new Date()
    });

    await Milestone.create({
      projectId: p2._id,
      title: 'Telemedicine Booking & Consultation Flow',
      description: 'Patient appointment scheduling and real-time messaging UI.',
      amount: 2000,
      dueDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
      status: 'pending'
    });

    // 5. Create Sample Chat Messages
    await Message.create({
      senderId: client1._id,
      receiverId: freelancer1._id,
      projectId: p2._id,
      message: 'Hi Alex! Welcome to the project. Have you started setting up the patient authentication routes?'
    });

    await Message.create({
      senderId: freelancer1._id,
      receiverId: client1._id,
      projectId: p2._id,
      message: 'Hey Acme team! Yes, I have configured JWT auth middleware and the first milestone is funded. Ill share a demo link tomorrow!'
    });

    // 6. Sample Reviews
    await Review.create({
      reviewerId: client2._id,
      reviewedUserId: freelancer1._id,
      projectId: p2._id,
      rating: 5,
      comment: 'Alex is a world-class developer! Delivered ahead of schedule with clean code and great communication.'
    });

    console.log('Database successfully seeded with demo accounts & sample projects!');
  } catch (err) {
    console.error('Error seeding database:', err.message);
  }
};

module.exports = seedDatabase;
