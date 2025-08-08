
'use server';

/**
 * @fileOverview A Genkit flow to calculate paid traffic investment needs.
 *
 * This flow takes sales goals and campaign metrics to estimate the
 * required advertising budget and potential return. It supports two
 * campaign types: landing page and direct contact.
 *
 * @exports {
 *   calculateTrafficInvestment: (input: CalculateTrafficInvestmentInput) => Promise<CalculateTrafficInvestmentOutput>;
 *   CalculateTrafficInvestmentInput: The input type for the calculateTrafficInvestment function.
 *   CalculateTrafficInvestmentOutput: The return type for the calculateTrafficInvestment function.
 * }
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const BaseSchema = z.object({
  salesGoal: z.number().positive('A meta de vendas deve ser um número positivo.'),
  avgTicket: z.number().positive('O ticket médio deve ser um número positivo.'),
  leadToCustomerRate: z.number().positive('A taxa de conversão de lead para cliente deve ser positiva.'),
  costPerSale: z.number().nonnegative('O custo por venda não pode ser negativo.'),
});

const LandingPageSchema = BaseSchema.extend({
    campaignType: z.literal('landingPage'),
    visitorToLeadRate: z.number().positive('A taxa de conversão de visitante para lead deve ser positiva.'),
    avgCpc: z.number().positive('O CPC médio deve ser um número positivo.'),
});

const DirectContactSchema = BaseSchema.extend({
    campaignType: z.literal('directContact'),
    avgCpl: z.number().positive('O CPL médio deve ser um número positivo.'),
});

const CalculateTrafficInvestmentInputSchema = z.discriminatedUnion("campaignType", [
    LandingPageSchema,
    DirectContactSchema,
]);

export type CalculateTrafficInvestmentInput = z.infer<typeof CalculateTrafficInvestmentInputSchema>;

const CalculateTrafficInvestmentOutputSchema = z.object({
  requiredLeads: z.number(),
  requiredVisitors: z.number().optional(),
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
        costPerSale,
    } = input;

    // Convert rates to decimals
    const leadToCustomerDecimal = leadToCustomerRate / 100;

    // 1. Calculate required leads
    const requiredLeads = salesGoal / leadToCustomerDecimal;
    
    let requiredBudget = 0;
    let requiredVisitors: number | undefined = undefined;

    if (input.campaignType === 'landingPage') {
        const visitorToLeadDecimal = input.visitorToLeadRate / 100;
        requiredVisitors = requiredLeads / visitorToLeadDecimal;
        requiredBudget = requiredVisitors * input.avgCpc;
    } else { // directContact
        requiredBudget = requiredLeads * input.avgCpl;
    }


    // Calculate ROI
    const grossRevenue = salesGoal * avgTicket;
    const totalServiceCost = salesGoal * costPerSale; 
    const grossProfit = grossRevenue - totalServiceCost;
    const expectedProfit = grossProfit - requiredBudget;
    
    // Avoid division by zero
    const expectedRoi = requiredBudget > 0 ? (expectedProfit / requiredBudget) * 100 : 0;

    return {
        requiredLeads: Math.ceil(requiredLeads),
        requiredVisitors: requiredVisitors ? Math.ceil(requiredVisitors) : undefined,
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
