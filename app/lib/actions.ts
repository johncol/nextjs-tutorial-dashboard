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
const UpdateInvoiceSchema = InvoiceFormSchema.omit({ id: true, date: true });

export async function createInvoice(formData: FormData) {
  const { amount, customerId, status } = CreateInvoiceSchema.parse(
    Object.fromEntries(formData.entries()),
  );
  const amountInCents = amount * 100;
  const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

  try {
    await insertInvoiceInDB({
      customer_id: customerId,
      amount: amountInCents,
      status,
      date,
    });
  } catch (error) {
    return {
      message: 'DB Error: failed to create invoice',
    }
  }

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

export async function updateInvoice(id: string, formData: FormData) {
  const { amount, customerId, status } = UpdateInvoiceSchema.parse(
    Object.fromEntries(formData.entries()),
  );
  const amountInCents = amount * 100;

  try {
    await updateInvoiceInDB({
      id,
      customer_id: customerId,
      amount: amountInCents,
      status,
    });
  } catch (error) {
    return {
      message: 'DB Error: failed to update invoice',
    }
  }

  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

const updateInvoiceInDB = ({
  id,
  customer_id,
  amount,
  status,
}: Omit<Invoice, 'date'>) => {
  return sql`
    UPDATE Invoices
    SET
      customer_id = ${customer_id},
      amount = ${amount},
      status = ${status}
    WHERE
      id = ${id}
  `;
};

export async function deleteInvoice(id: string) {
  throw new Error('Failed to Delete Invoice');

  try {
    await deleteInvoiceFromDB(id);
    revalidatePath('/dashboard/invoices');
    return {
      message: 'Invoice deleted',
    }
  } catch (error) {
    return {
      message: 'DB Error: failed to delete invoice',
    }
  }

}

const deleteInvoiceFromDB = (id: string) => {
  return sql`
    DELETE FROM Invoices
    WHERE
      id = ${id}
  `;
};
