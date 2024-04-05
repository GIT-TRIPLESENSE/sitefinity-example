import { ReactNode } from 'react';

export function ReplyNested({ children }: { children: ReactNode }) {
    return (
        <div>
            Nested Component
            <div style={{ padding: '3em' }}>
                <div>{children}</div>
            </div>
        </div>
    );
}
