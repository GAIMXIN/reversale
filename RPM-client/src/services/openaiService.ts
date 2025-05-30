import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Only for client-side usage in development
});

export interface DocumentGenerationParams {
  userInput: string;
  documentType: 'review_summary' | 'complaint_response' | 'business_proposal' | 'general';
  context?: string;
}

export interface GeneratedDocument {
  title: string;
  problem: string;
  impact: string;
  desiredOutcome: string;
  estPrice: number;
  estETA: string;
  fullContent: string;
}

export async function generateDocument(params: DocumentGenerationParams): Promise<GeneratedDocument> {
  const { userInput, documentType, context } = params;

  try {
    const systemPrompt = getSystemPrompt(documentType);
    const userPrompt = formatUserPrompt(userInput, context);

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) {
      throw new Error('No response from OpenAI');
    }

    return parseAIResponse(response, userInput);

  } catch (error) {
    console.error('OpenAI API Error:', error);
    
    // Fallback to mock generation if API fails
    return generateMockDocument(userInput);
  }
}

function getSystemPrompt(documentType: string): string {
  const basePrompt = `You are an expert business consultant and document generator. Your task is to analyze user business problems and generate structured, professional documents.

Always respond in the following JSON format:
{
  "title": "Clear, concise title for the business issue",
  "problem": "Detailed problem statement describing the current situation",
  "impact": "Business impact and cost analysis with specific numbers when possible",
  "desiredOutcome": "Clear goals and expected results with measurable outcomes",
  "estPrice": "Estimated cost as a number (USD, no commas or symbols)",
  "estETA": "Estimated timeline as a string (e.g., '4-6 weeks')",
  "fullContent": "Complete formatted document content in HTML format"
}`;

  switch (documentType) {
    case 'review_summary':
      return basePrompt + `\n\nSpecialize in creating business operation review summaries that identify inefficiencies, propose solutions, and provide ROI estimates.`;
    
    case 'complaint_response':
      return basePrompt + `\n\nSpecialize in creating professional complaint response documents that address customer concerns with empathy and propose concrete resolution steps.`;
    
    case 'business_proposal':
      return basePrompt + `\n\nSpecialize in creating business improvement proposals with detailed implementation plans, cost-benefit analysis, and success metrics.`;
    
    default:
      return basePrompt + `\n\nGenerate comprehensive business analysis documents based on the user's specific needs and industry context.`;
  }
}

function formatUserPrompt(userInput: string, context?: string): string {
  let prompt = `Please analyze the following business situation and generate a structured document:\n\n"${userInput}"`;
  
  if (context) {
    prompt += `\n\nAdditional context: ${context}`;
  }
  
  prompt += `\n\nPlease provide realistic cost estimates and timelines based on industry standards. Make the document professional and actionable.`;
  
  return prompt;
}

function parseAIResponse(response: string, userInput: string): GeneratedDocument {
  try {
    // Try to extract JSON from the response
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        title: parsed.title || 'Business Operations Analysis',
        problem: parsed.problem || 'Business challenge identified',
        impact: parsed.impact || 'Impact analysis pending',
        desiredOutcome: parsed.desiredOutcome || 'Improved business operations',
        estPrice: typeof parsed.estPrice === 'number' ? parsed.estPrice : parseInt(parsed.estPrice) || 10000,
        estETA: parsed.estETA || '4-6 weeks',
        fullContent: parsed.fullContent || `<h1>${parsed.title}</h1><p>${parsed.problem}</p>`
      };
    }
  } catch (error) {
    console.error('Error parsing AI response:', error);
  }
  
  // Fallback parsing if JSON extraction fails
  return generateMockDocument(userInput);
}

function generateMockDocument(userInput: string): GeneratedDocument {
  const lowerInput = userInput.toLowerCase();
  
  if (lowerInput.includes('ecommerce') || lowerInput.includes('online store')) {
    return {
      title: 'E-commerce Platform Optimization',
      problem: 'Current e-commerce operations are experiencing challenges with customer acquisition costs, cart abandonment rates, and inventory management.',
      impact: 'Reduced conversion rates (30% below industry average), increased customer acquisition costs, and inventory inefficiencies are costing approximately $15,000-25,000 monthly.',
      desiredOutcome: 'Achieve 25-40% increase in conversion rates, reduce customer acquisition costs by 30-50%, and implement automated inventory management.',
      estPrice: 15000,
      estETA: '6-8 weeks',
      fullContent: `
        <h1>E-commerce Platform Optimization</h1>
        <h2>Problem Statement</h2>
        <p>Current e-commerce operations are experiencing challenges with customer acquisition costs, cart abandonment rates, and inventory management.</p>
        <h2>Business Impact</h2>
        <p>Reduced conversion rates (30% below industry average), increased customer acquisition costs, and inventory inefficiencies are costing approximately $15,000-25,000 monthly.</p>
        <h2>Desired Outcome</h2>
        <p>Achieve 25-40% increase in conversion rates, reduce customer acquisition costs by 30-50%, and implement automated inventory management.</p>
      `
    };
  } else if (lowerInput.includes('restaurant') || lowerInput.includes('food')) {
    return {
      title: 'Restaurant Operations Enhancement',
      problem: 'Restaurant operations are facing high staff turnover, food waste issues, and limited online ordering capabilities.',
      impact: 'High staff turnover (75% annually) and food waste (8% of purchases) are creating operational costs of $8,000-12,000 monthly.',
      desiredOutcome: 'Reduce staff turnover to 50%, decrease food waste by 50%, and capture additional 30% revenue through optimized online ordering.',
      estPrice: 8500,
      estETA: '4-6 weeks',
      fullContent: `
        <h1>Restaurant Operations Enhancement</h1>
        <h2>Problem Statement</h2>
        <p>Restaurant operations are facing high staff turnover, food waste issues, and limited online ordering capabilities.</p>
        <h2>Business Impact</h2>
        <p>High staff turnover (75% annually) and food waste (8% of purchases) are creating operational costs of $8,000-12,000 monthly.</p>
        <h2>Desired Outcome</h2>
        <p>Reduce staff turnover to 50%, decrease food waste by 50%, and capture additional 30% revenue through optimized online ordering.</p>
      `
    };
  }
  
  // Default fallback
  return {
    title: 'Business Operations Optimization',
    problem: 'Business operations are not running at optimal efficiency with manual processes affecting productivity.',
    impact: 'Current inefficiencies are estimated to cost 15-25% in operational efficiency, translating to $5,000-15,000 monthly in lost productivity.',
    desiredOutcome: 'Streamline operations to achieve 20-35% efficiency improvement and implement scalable systems for sustainable growth.',
    estPrice: 10000,
    estETA: '4-6 weeks',
    fullContent: `
      <h1>Business Operations Optimization</h1>
      <h2>Problem Statement</h2>
      <p>Business operations are not running at optimal efficiency with manual processes affecting productivity.</p>
      <h2>Business Impact</h2>
      <p>Current inefficiencies are estimated to cost 15-25% in operational efficiency, translating to $5,000-15,000 monthly in lost productivity.</p>
      <h2>Desired Outcome</h2>
      <p>Streamline operations to achieve 20-35% efficiency improvement and implement scalable systems for sustainable growth.</p>
    `
  };
} 