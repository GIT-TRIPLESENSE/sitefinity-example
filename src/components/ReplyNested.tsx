import { ReactNode } from 'react';

export function ReplyNested({ children }: { children: ReactNode }) {
    return (
        <div>
            Nested Component
            <div
                style={{
                    padding: '2em',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                    gap: '2rem',
                }}
            >
                {children}
            </div>
        </div>
    );
}
