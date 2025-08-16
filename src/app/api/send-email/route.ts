
import { NextResponse } from 'next/server';
import sgMail from '@sendgrid/mail';

if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

export async function POST(request: Request) {
  if (!process.env.SENDGRID_API_KEY || !process.env.TO_EMAIL || !process.env.FROM_EMAIL) {
    console.error('SendGrid environment variables not set');
    return NextResponse.json({ error: 'Server configuration error.' }, { status: 500 });
  }

  try {
    const data = await request.json();

    const emailHtml = `
      <h1>Novo Lead Cadastrado nas Ferramentas de IA</h1>
      <p>Um novo usuário se cadastrou e preencheu o formulário de qualificação. Seguem os detalhes:</p>
      <ul>
        <li><strong>Nome:</strong> ${data.name}</li>
        <li><strong>Email:</strong> ${data.email}</li>
        <li><strong>Telefone:</strong> ${data.phone}</li>
        <li><strong>Instagram:</strong> ${data.instagram}</li>
        <li><strong>Empresa:</strong> ${data.company}</li>
        <li><strong>Cidade/Estado:</strong> ${data.cityState}</li>
        <li><strong>Segmento:</strong> ${data.segment}</li>
        <li><strong>Faturamento Mensal:</strong> ${data.monthlyBilling}</li>
        <li><strong>Experiência com Marketing:</strong> ${data.marketingExperience}</li>
        <li><strong>Principal Desafio:</strong> ${data.mainChallenge}</li>
        <li><strong>Urgência:</strong> ${data.urgency}</li>
        <li><strong>Disponibilidade para Investir:</strong> ${data.willInvest}</li>
      </ul>
    `;

    const msg = {
      to: process.env.TO_EMAIL,
      from: process.env.FROM_EMAIL,
      subject: 'Novo Lead Qualificado | Ferramentas de IA CP Marketing',
      html: emailHtml,
    };

    await sgMail.send(msg);

    return NextResponse.json({ message: 'Email sent successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error sending email:', error);
    // Para depuração, podemos logar mais detalhes do erro
    if (error instanceof Error && 'response' in error) {
        const err = error as any;
        console.error(err.response.body);
    }
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
