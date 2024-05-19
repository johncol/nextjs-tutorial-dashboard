'use server';

import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { Invoice } from './definitions';

const InvoiceFormSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  amount: z.coerce.number(),
  status: z.enum(['pending', 'paid']),
  date: z.string(),
});

const CreateInvoiceSchema = InvoiceFormSchema.omit({ id: true, date: true });

export async function createInvoice(formData: FormData) {
  const { amount, customerId, status } = CreateInvoiceSchema.parse(
    Object.fromEntries(formData.entries()),
  );
  const amountInCents = amount * 100;
  const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

  await insertInvoiceInDB({
    customer_id: customerId,
    amount: amountInCents,
    status,
    date,
  });

  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

const insertInvoiceInDB = ({
  customer_id,
  amount,
  status,
  date,
}: Omit<Invoice, 'id'>) => {
  return sql`
    INSERT INTO Invoices
      (customer_id, amount, status, date)
    VALUES
      (${customer_id}, ${amount}, ${status}, ${date})
  `;
};
