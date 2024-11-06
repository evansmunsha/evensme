"use client"
import { useState } from 'react';
import { Button } from '../../components/ui/button';
import Modal from '../../components/Model';
import { BadgeDollarSign } from 'lucide-react';

interface MenuBarProps {
    className?: string;
}

export async function SubscribeForm({ className }: MenuBarProps) {
    const [email, setEmail] = useState<string>('');
    const [message, setMessage] = useState<string>('');

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const response = await fetch('/api/subscribe/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
        });

        const data = await response.json();
        setMessage(data.message);
        setEmail(''); // Reset the email input
    };

    
  const [isModalOpen, setIsModalOpen] = useState(false); // State to manage modal visibility

    return (
        <div className={className}>
            <Button
            variant="secondary"
            className="flex items-center justify-start gap-3 bg-white w-full"
            title="Affiliates"
            onClick={() => setIsModalOpen(true)} // Open the modal on button click
            aria-label="Open Affiliates link"
            >
            <BadgeDollarSign />
            <span className="hidden lg:inline">Newsletter</span>
            </Button>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} >
                <div>
                    <h1>Subscribe to Our Newsletter</h1>
                    <form onSubmit={handleSubmit}>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            required
                        />
                        <button type="submit">Subscribe</button>
                    </form>
                    {message && <p>{message}</p>}
                </div>
            </Modal>
        </div>
    );
};
