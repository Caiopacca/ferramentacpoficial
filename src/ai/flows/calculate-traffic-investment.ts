
'use server';

/**
 * @fileOverview A Genkit flow to calculate paid traffic investment needs.
 *
 * This flow takes sales goals, conversion metrics, and cost per click to
 * estimate the required advertising budget and potential return.
 *
 * @exports {
 *   calculateTrafficInvestment: (input: CalculateTrafficInvestmentInput) => Promise<CalculateTrafficInvestmentOutput>;
 *   CalculateTrafficInvestmentInput: The input type for the calculateTrafficInvestment function.
 *   CalculateTrafficInvestmentOutput: The return type for the calculateTrafficInvestment function.
 * }
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const CalculateTrafficInvestmentInputSchema = z.object({
  salesGoal: z.number().positive('A meta de vendas deve ser um número positivo.'),
  avgTicket: z.number().positive('O ticket médio deve ser um número positivo.'),
  leadToCustomerRate: z.number().positive('A taxa de conversão de lead para cliente deve ser positiva.'),
  visitorToLeadRate: z.number().positive('A taxa de conversão de visitante para lead deve ser positiva.'),
  avgCpc: z.number().positive('O CPC médio deve ser um número positivo.'),
});
export type CalculateTrafficInvestmentInput = z.infer<typeof CalculateTrafficInvestmentInputSchema>;

const CalculateTrafficInvestmentOutputSchema = z.object({
  requiredLeads: z.number(),
  requiredVisitors: z.number(),
  requiredBudget: z.number(),
  expectedProfit: z.number(),
  expectedRoi: z.number(),
});
export type CalculateTrafficInvestmentOutput = z.infer<typeof CalculateTrafficInvestmentOutputSchema>;


const calculateTrafficInvestmentFlow = ai.defineFlow(
  {
    name: 'calculateTrafficInvestmentFlow',
    inputSchema: CalculateTrafficInvestmentInputSchema,
    outputSchema: CalculateTrafficInvestmentOutputSchema,
  },
  async (input) => {
    const {
        salesGoal,
        avgTicket,
        leadToCustomerRate,
        visitorToLeadRate,
        avgCpc
    } = input;

    // Convert rates to decimals
    const leadToCustomerDecimal = leadToCustomerRate / 100;
    const visitorToLeadDecimal = visitorToLeadRate / 100;

    // 1. Calculate required leads
    const requiredLeads = salesGoal / leadToCustomerDecimal;

    // 2. Calculate required visitors
    const requiredVisitors = requiredLeads / visitorToLeadDecimal;

    // 3. Calculate required budget
    const requiredBudget = requiredVisitors * avgCpc;

    // 4. Calculate ROI
    const grossRevenue = salesGoal * avgTicket;
    // Assuming a 20% cost of service, this could be an input later
    const grossServiceCost = salesGoal * (avgTicket * 0.2); 
    const grossProfit = grossRevenue - grossServiceCost;
    const expectedProfit = grossProfit - requiredBudget;
    
    // Avoid division by zero
    const expectedRoi = requiredBudget > 0 ? (expectedProfit / requiredBudget) * 100 : 0;

    return {
        requiredLeads: Math.ceil(requiredLeads),
        requiredVisitors: Math.ceil(requiredVisitors),
        requiredBudget,
        expectedProfit,
        expectedRoi
    };
  }
);


export async function calculateTrafficInvestment(
  input: CalculateTrafficInvestmentInput
): Promise<CalculateTrafficInvestmentOutput> {
  return calculateTrafficInvestmentFlow(input);
}
