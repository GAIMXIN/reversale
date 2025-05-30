import React, { createContext, useContext, useState, ReactNode } from 'react';
import { generateDocument } from '../services/openaiService';

export interface RequestSummary {
  id: string;
  title: string;
  problem: string;
  impact: string;
  desiredOutcome: string;
  estPrice: number;
  estETA: string;
  originalText: string;
  createdAt: Date;
  status: 'draft' | 'confirmed' | 'sent' | 'processing' | 'completed';
  lastModified: Date;
}

// Notification data model
export interface InboxNotification {
  id: string;
  type: 'response' | 'status' | 'agent';
  postId: string;
  postTitle: string;
  message: string;
  createdAt: Date;
  read: boolean;
}

// Request Context with Inbox functionality
interface RequestContextType {
  currentRequest: RequestSummary | null;
  requestHistory: RequestSummary[];
  setCurrentRequest: (request: RequestSummary | null) => void;
  createRequestFromText: (text: string) => Promise<RequestSummary>;
  updateRequestStatus: (id: string, status: RequestSummary['status']) => void;
  getRequestById: (id: string) => RequestSummary | undefined;
  getInboxUnreadCount: () => number;
}

const RequestContext = createContext<RequestContextType | undefined>(undefined);

export const useRequest = () => {
  const context = useContext(RequestContext);
  if (context === undefined) {
    throw new Error('useRequest must be used within a RequestProvider');
  }
  return context;
};

interface RequestProviderProps {
  children: ReactNode;
}

export const RequestProvider: React.FC<RequestProviderProps> = ({ children }) => {
  const [currentRequest, setCurrentRequest] = useState<RequestSummary | null>(null);
  
  // Initialize with dummy posts for different statuses
  const [requestHistory, setRequestHistory] = useState<RequestSummary[]>([
    // Draft Posts
    {
      id: 'draft-1',
      title: 'AI Inventory Management Bot for Café',
      problem: 'Our small café struggles with inventory tracking. We run out of popular items frequently and over-order others, leading to waste. Manual counting takes hours each week.',
      impact: 'Reduce inventory waste by 30% and eliminate stockouts',
      desiredOutcome: 'Automated inventory tracking with predictive ordering suggestions',
      estPrice: 1500,
      estETA: '2-3 weeks',
      originalText: 'Need inventory bot for cafe',
      createdAt: new Date(2024, 5, 15),
      status: 'draft',
      lastModified: new Date(2024, 5, 15),
    },
    {
      id: 'draft-2',
      title: 'Therapist Notes Documentation Agent',
      problem: 'Therapists spend 2-3 hours daily on SOAP notes after patient sessions, affecting work-life balance and causing burnout.',
      impact: 'Save therapists 2-3 hours daily, improve work-life balance',
      desiredOutcome: 'AI-powered voice-to-text SOAP note generation during sessions',
      estPrice: 2200,
      estETA: '3-4 weeks',
      originalText: 'Therapist always brings SOAP notes home',
      createdAt: new Date(2024, 5, 14),
      status: 'draft',
      lastModified: new Date(2024, 5, 14),
    },
    {
      id: 'draft-3',
      title: 'E-commerce Customer Analytics Dashboard',
      problem: 'We have customer data scattered across multiple platforms but no unified view of customer behavior and purchasing patterns.',
      impact: 'Increase customer retention by 25% through better insights',
      desiredOutcome: 'Centralized dashboard showing customer journeys and predictive analytics',
      estPrice: 3500,
      estETA: '4-6 weeks',
      originalText: 'Need customer analytics for ecommerce',
      createdAt: new Date(2024, 5, 13),
      status: 'draft',
      lastModified: new Date(2024, 5, 13),
    },

    // Sent Posts
    {
      id: 'sent-1',
      title: 'Restaurant Self-Service Ordering System',
      problem: 'Long wait times during peak hours and staff shortage issues. Customers often leave due to slow service.',
      impact: 'Reduce wait times by 40% and increase table turnover',
      desiredOutcome: 'QR code-based ordering system with kitchen integration',
      estPrice: 4500,
      estETA: '4-5 weeks',
      originalText: 'Restaurant needs self-service ordering',
      createdAt: new Date(2024, 5, 10),
      status: 'sent',
      lastModified: new Date(2024, 5, 10),
    },
    {
      id: 'sent-2',
      title: 'Legal Document Review Automation',
      problem: 'Law firm spends countless hours on routine contract review that could be automated, leading to high billable hour costs.',
      impact: 'Reduce document review time by 60%, lower client costs',
      desiredOutcome: 'AI system to flag key clauses and potential issues in contracts',
      estPrice: 6000,
      estETA: '6-8 weeks',
      originalText: 'Automate legal document review',
      createdAt: new Date(2024, 5, 8),
      status: 'confirmed',
      lastModified: new Date(2024, 5, 8),
    },
    {
      id: 'sent-3',
      title: 'Real Estate Lead Qualification Bot',
      problem: 'Real estate agents waste time on unqualified leads and miss opportunities with serious buyers.',
      impact: 'Increase conversion rate by 35% and save 10 hours weekly',
      desiredOutcome: 'Chatbot that qualifies leads and schedules viewings automatically',
      estPrice: 2800,
      estETA: '3-4 weeks',
      originalText: 'Real estate lead qualification',
      createdAt: new Date(2024, 5, 7),
      status: 'sent',
      lastModified: new Date(2024, 5, 7),
    },

    // Ongoing Posts
    {
      id: 'ongoing-1',
      title: 'Custom CRM for Fitness Studio',
      problem: 'Generic CRM solutions don\'t handle class bookings, trainer schedules, and member progress tracking effectively.',
      impact: 'Improve member retention by 25% and streamline operations',
      desiredOutcome: 'Integrated system for bookings, payments, and progress tracking',
      estPrice: 5500,
      estETA: '5-6 weeks',
      originalText: 'Fitness studio needs custom CRM',
      createdAt: new Date(2024, 4, 25),
      status: 'processing',
      lastModified: new Date(2024, 5, 12),
    },
    {
      id: 'ongoing-2',
      title: 'Automated Social Media Manager',
      problem: 'Small business struggles to maintain consistent social media presence across multiple platforms.',
      impact: 'Increase social media engagement by 50% and save 8 hours weekly',
      desiredOutcome: 'AI-powered content creation and scheduling across all platforms',
      estPrice: 3200,
      estETA: '4-5 weeks',
      originalText: 'Social media automation needed',
      createdAt: new Date(2024, 4, 20),
      status: 'processing',
      lastModified: new Date(2024, 5, 11),
    },
    {
      id: 'ongoing-3',
      title: 'Supply Chain Optimization Tool',
      problem: 'Manufacturing company faces delays and cost overruns due to inefficient supplier coordination.',
      impact: 'Reduce supply chain costs by 20% and eliminate delays',
      desiredOutcome: 'Dashboard for real-time supplier tracking and predictive ordering',
      estPrice: 8000,
      estETA: '8-10 weeks',
      originalText: 'Supply chain optimization needed',
      createdAt: new Date(2024, 4, 15),
      status: 'processing',
      lastModified: new Date(2024, 5, 10),
    },

    // Completed Posts
    {
      id: 'completed-1',
      title: 'Appointment Scheduling Bot for Dental Office',
      problem: 'Dental office was losing patients due to phone tag and scheduling conflicts during busy periods.',
      impact: 'Increased appointment bookings by 40% and reduced no-shows',
      desiredOutcome: 'Automated scheduling with calendar integration and SMS reminders',
      estPrice: 2400,
      estETA: '3 weeks',
      originalText: 'Dental office appointment scheduling',
      createdAt: new Date(2024, 3, 15),
      status: 'completed',
      lastModified: new Date(2024, 4, 5),
    },
    {
      id: 'completed-2',
      title: 'Expense Tracking System for Freelancers',
      problem: 'Freelancers struggled with manual expense tracking and tax preparation, leading to missed deductions.',
      impact: 'Saved 15 hours monthly on bookkeeping and increased deductions by 25%',
      desiredOutcome: 'Automated expense categorization with receipt scanning',
      estPrice: 1800,
      estETA: '2-3 weeks',
      originalText: 'Freelancer expense tracking',
      createdAt: new Date(2024, 3, 1),
      status: 'completed',
      lastModified: new Date(2024, 3, 22),
    },
    {
      id: 'completed-3',
      title: 'Hotel Guest Experience Platform',
      problem: 'Boutique hotel had no way to personalize guest experiences or gather feedback effectively.',
      impact: 'Improved guest satisfaction scores by 35% and increased repeat bookings',
      desiredOutcome: 'Mobile app for room service, local recommendations, and feedback',
      estPrice: 7200,
      estETA: '6-8 weeks',
      originalText: 'Hotel guest experience improvement',
      createdAt: new Date(2024, 2, 10),
      status: 'completed',
      lastModified: new Date(2024, 4, 15),
    },
  ]);

  // Mock API call to create summary
  const createRequestFromText = async (text: string): Promise<RequestSummary> => {
    // Use OpenAI service to generate document
    try {
      const generatedDoc = await generateDocument({
        userInput: text,
        documentType: 'review_summary', // Can be made configurable
        context: 'Business operations analysis and improvement recommendations'
      });

      const requestId = Date.now().toString();
      
      const summary: RequestSummary = {
        id: requestId,
        title: generatedDoc.title,
        problem: generatedDoc.problem,
        impact: generatedDoc.impact,
        desiredOutcome: generatedDoc.desiredOutcome,
        estPrice: generatedDoc.estPrice,
        estETA: generatedDoc.estETA,
        originalText: text,
        createdAt: new Date(),
        status: 'draft',
        lastModified: new Date(),
      };

      setCurrentRequest(summary);
      setRequestHistory(prev => [summary, ...prev]);
      return summary;
      
    } catch (error) {
      console.error('Error generating document:', error);
      
      // Fallback to mock generation
      const requestId = Date.now().toString();
      
      const summary: RequestSummary = {
        id: requestId,
        title: generateTitle(text),
        problem: generateProblem(text),
        impact: generateImpact(text),
        desiredOutcome: generateDesiredOutcome(text),
        estPrice: generateEstPrice(text),
        estETA: generateEstETA(text),
        originalText: text,
        createdAt: new Date(),
        status: 'draft',
        lastModified: new Date(),
      };

      setCurrentRequest(summary);
      setRequestHistory(prev => [summary, ...prev]);
      return summary;
    }
  };

  const updateRequestStatus = (id: string, status: RequestSummary['status']) => {
    setRequestHistory(prev => 
      prev.map(request => 
        request.id === id 
          ? { ...request, status, lastModified: new Date() }
          : request
      )
    );
    
    if (currentRequest?.id === id) {
      setCurrentRequest(prev => 
        prev ? { ...prev, status, lastModified: new Date() } : null
      );
    }
  };

  const getRequestById = (id: string): RequestSummary | undefined => {
    return requestHistory.find(request => request.id === id);
  };

  const getInboxUnreadCount = (): number => {
    // Mock unread count for now - this would be from actual notification data
    return 3;
  };

  return (
    <RequestContext.Provider value={{
      currentRequest,
      requestHistory,
      setCurrentRequest,
      createRequestFromText,
      updateRequestStatus,
      getRequestById,
      getInboxUnreadCount,
    }}>
      {children}
    </RequestContext.Provider>
  );
};

// Helper functions to generate mock summaries
function generateTitle(text: string): string {
  const lowerText = text.toLowerCase();
  
  if (lowerText.includes('ecommerce') || lowerText.includes('online store') || lowerText.includes('selling')) {
    return 'E-commerce Platform Optimization';
  } else if (lowerText.includes('restaurant') || lowerText.includes('food') || lowerText.includes('cafe')) {
    return 'Restaurant Operations Enhancement';
  } else if (lowerText.includes('doctor') || lowerText.includes('medical') || lowerText.includes('healthcare') || lowerText.includes('soap')) {
    return 'Medical Practice Documentation Solution';
  } else if (lowerText.includes('marketing') || lowerText.includes('customers') || lowerText.includes('sales')) {
    return 'Customer Acquisition & Marketing Enhancement';
  } else if (lowerText.includes('inventory') || lowerText.includes('stock') || lowerText.includes('supplies')) {
    return 'Inventory Management System Implementation';
  } else {
    return 'Business Operations Optimization';
  }
}

function generateProblem(text: string): string {
  const lowerText = text.toLowerCase();
  
  if (lowerText.includes('ecommerce') || lowerText.includes('online store')) {
    return 'Current e-commerce operations are experiencing challenges with customer acquisition costs, cart abandonment rates, and inventory management. Competition from larger platforms is affecting margins and market share.';
  } else if (lowerText.includes('restaurant') || lowerText.includes('food')) {
    return 'Restaurant operations are facing high staff turnover, food waste issues, and limited online ordering capabilities. Current systems are not optimized for efficiency and customer satisfaction.';
  } else if (lowerText.includes('doctor') || lowerText.includes('medical') || lowerText.includes('healthcare')) {
    return 'Medical practice is struggling with excessive documentation time, particularly SOAP notes that extend work hours into personal time. Administrative burden is affecting work-life balance and potentially patient care quality.';
  } else {
    return 'Business operations are not running at optimal efficiency. Current processes may be manual, time-consuming, or not aligned with industry best practices, affecting productivity and growth potential.';
  }
}

function generateImpact(text: string): string {
  const lowerText = text.toLowerCase();
  
  if (lowerText.includes('ecommerce') || lowerText.includes('online store')) {
    return 'Reduced conversion rates (30% below industry average), increased customer acquisition costs, and inventory inefficiencies are costing approximately $15,000-25,000 monthly in lost revenue and operational waste.';
  } else if (lowerText.includes('restaurant') || lowerText.includes('food')) {
    return 'High staff turnover (75% annually) and food waste (8% of purchases) are creating operational costs of $8,000-12,000 monthly. Limited online presence is missing 30% of potential revenue.';
  } else if (lowerText.includes('doctor') || lowerText.includes('medical') || lowerText.includes('healthcare')) {
    return 'Physicians spending 2-3 hours daily on documentation outside patient care, leading to burnout, reduced patient satisfaction, and potential loss of 15-20% practice efficiency.';
  } else {
    return 'Current inefficiencies are estimated to cost 15-25% in operational efficiency, translating to $5,000-15,000 monthly in lost productivity and missed opportunities.';
  }
}

function generateDesiredOutcome(text: string): string {
  const lowerText = text.toLowerCase();
  
  if (lowerText.includes('ecommerce') || lowerText.includes('online store')) {
    return 'Achieve 25-40% increase in conversion rates, reduce customer acquisition costs by 30-50%, and implement automated inventory management. Target monthly revenue increase of $20,000-35,000 within 6 months.';
  } else if (lowerText.includes('restaurant') || lowerText.includes('food')) {
    return 'Reduce staff turnover to 50%, decrease food waste by 50%, and capture additional 30% revenue through optimized online ordering. Target operational cost reduction of $10,000 monthly.';
  } else if (lowerText.includes('doctor') || lowerText.includes('medical') || lowerText.includes('healthcare')) {
    return 'Reduce documentation time by 60-70%, eliminate after-hours note-taking, and improve work-life balance. Enable physicians to focus 100% on patient care during office hours.';
  } else {
    return 'Streamline operations to achieve 20-35% efficiency improvement, reduce manual processes by 80%, and implement scalable systems for sustainable growth.';
  }
}

function generateEstPrice(text: string): number {
  const lowerText = text.toLowerCase();
  
  if (lowerText.includes('ecommerce') || lowerText.includes('online store')) {
    return 15000;
  } else if (lowerText.includes('restaurant') || lowerText.includes('food')) {
    return 8500;
  } else if (lowerText.includes('doctor') || lowerText.includes('medical') || lowerText.includes('healthcare')) {
    return 12000;
  } else if (lowerText.includes('marketing') || lowerText.includes('sales')) {
    return 6500;
  } else {
    return 10000;
  }
}

function generateEstETA(text: string): string {
  const lowerText = text.toLowerCase();
  
  if (lowerText.includes('urgent') || lowerText.includes('asap') || lowerText.includes('immediate')) {
    return '2-3 weeks';
  } else if (lowerText.includes('complex') || lowerText.includes('comprehensive') || lowerText.includes('complete')) {
    return '8-12 weeks';
  } else {
    return '4-6 weeks';
  }
} 