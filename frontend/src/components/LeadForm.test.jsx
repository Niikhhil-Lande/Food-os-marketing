import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import LeadForm, { validate } from './LeadForm.jsx';

describe('validate', () => {
  const base = { whatsapp: '', email: '' };

  it('requires a contact method', () => {
    expect(validate(base, 'demo').whatsapp).toMatch(/WhatsApp/);
    expect(validate(base, 'contact').whatsapp).toMatch(/required/);
  });

  it('requires WhatsApp for both forms and accepts a valid number', () => {
    expect(validate({ whatsapp: '+91 98765 43210', email: '' }, 'demo')).toEqual({});
    expect(validate({ whatsapp: '+91 98765 43210', email: 'a@b.in' }, 'contact')).toEqual({});
    expect(validate({ whatsapp: '', email: 'a@b.in' }, 'contact').whatsapp).toMatch(/required/);
  });

  it('rejects malformed values', () => {
    expect(validate({ whatsapp: 'abc', email: '' }, 'demo').whatsapp).toBeDefined();
    expect(validate({ whatsapp: '', email: 'nope' }, 'contact').email).toBeDefined();
  });
});

describe('<LeadForm variant="demo">', () => {
  it('blocks submit without a contact method', async () => {
    const onSubmit = vi.fn();
    render(<LeadForm variant="demo" onSubmit={onSubmit} submitLabel="Book" privacyNote="note" />);
    await userEvent.click(screen.getByRole('button', { name: 'Book' }));
    expect(await screen.findByRole('alert')).toHaveTextContent(/WhatsApp/);
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('submits the payload and shows the confirmation', async () => {
    const onSubmit = vi.fn().mockResolvedValue({ message: 'Booked!' });
    render(<LeadForm variant="demo" onSubmit={onSubmit} submitLabel="Book" privacyNote="note" />);
    await userEvent.type(screen.getByLabelText(/WhatsApp number/), '+91 98765 43210');
    await userEvent.type(screen.getByLabelText(/Restaurant name/), 'Spice Route');
    await userEvent.click(screen.getByRole('button', { name: 'Book' }));

    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));
    expect(onSubmit.mock.calls[0][0]).toMatchObject({
      whatsapp: '+91 98765 43210',
      restaurantName: 'Spice Route',
      businessType: 'Restaurant / café',
      outletCount: '1',
    });
    expect(await screen.findByText('Booked!')).toBeInTheDocument();
  });

  it('shows a server error without losing the form', async () => {
    const onSubmit = vi.fn().mockRejectedValue(new Error('Server is down'));
    render(<LeadForm variant="demo" onSubmit={onSubmit} submitLabel="Book" privacyNote="note" />);
    await userEvent.type(screen.getByLabelText(/WhatsApp number/), '9876543210');
    await userEvent.click(screen.getByRole('button', { name: 'Book' }));
    expect(await screen.findByText('Server is down')).toBeInTheDocument();
    expect(screen.getByLabelText(/WhatsApp number/)).toHaveValue('9876543210');
  });
});
