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

interface RequestContextType {
  currentRequest: RequestSummary | null;
  requestHistory: RequestSummary[];
  setCurrentRequest: (request: RequestSummary | null) => void;
  createRequestFromText: (text: string) => Promise<RequestSummary>;
  updateRequestStatus: (id: string, status: RequestSummary['status']) => void;
  getRequestById: (id: string) => RequestSummary | undefined;
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
  const [requestHistory, setRequestHistory] = useState<RequestSummary[]>([]);

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

  return (
    <RequestContext.Provider value={{
      currentRequest,
      requestHistory,
      setCurrentRequest,
      createRequestFromText,
      updateRequestStatus,
      getRequestById,
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