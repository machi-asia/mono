"use client";

import React from "react";
import { Accordion, MarkdownRenderer } from "@mono/components";

export interface FaqItem {
    id: string;
    question: string;
    answer: string;
}

export interface FaqSectionProps {
    faqItems?: FaqItem[];
}

export const defaultFaqItems: FaqItem[] = [
    {
        id: "1",
        question: "What is your primary engineering & architecture stack?",
        answer: "I specialize in **TypeScript**, **Next.js**, **React**, **Node.js**, **Tailwind CSS**, and **PostgreSQL/Supabase**.",
    },
    {
        id: "2",
        question: "Are you available for contract architecture or development?",
        answer: "Yes, I am available for select high-impact engineering projects, consulting, and full-stack development.",
    },
];

export default function FaqSection({ faqItems = defaultFaqItems }: FaqSectionProps) {
    const accordionItems = faqItems.map((item, index) => ({
        title: `${String(index + 1).padStart(2, '0')} // ${item.question}`,
        content: (
            <div className="faq-answer">
                <MarkdownRenderer content={item.answer} />
            </div>
        ),
    }));

    return (
        <section
            id="faq"
            className="section"
            style={{ position: "relative" }}
        >
            {/* Background Pattern */}
            <div className="section-bg-wrapper">
                <div className="bg-pattern-circuit" />
            </div>

            <div className="section-header-wrap" style={{ position: "relative", zIndex: 1 }}>
                <div className="section-header-top">
                    <h2 className="section-title">
                        Frequently Asked <span className="gradient-text">Questions</span>
                    </h2>
                </div>
            </div>

            <div className="faq-container">
                <Accordion items={accordionItems} multiple />
            </div>
        </section>
    );
}
