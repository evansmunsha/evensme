
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { sendNewsletter } from '@/lib/sendEmail';

const prisma = new PrismaClient();

export async function POST(request: Request) {
    const { email, content , subject} = await request.json();

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return NextResponse.json({ message: 'Invalid email address.' }, { status: 400 });
    }

    try {
        // Save the email to the database
        await sendNewsletter([{ email }], content, subject);
        await prisma.subscription.create({
            data: {
                email,
            },
        });
        return NextResponse.json({ message: 'Thank you for subscribing!' });
    } catch (error: any) {
        if (error.code === 'P2002') {
            // Unique constraint violation
            return NextResponse.json({ message: 'Email already subscribed.' }, { status: 409 });
        }
        return NextResponse.json({ message: 'Failed to save email.' }, { status: 500 });
    }
}
