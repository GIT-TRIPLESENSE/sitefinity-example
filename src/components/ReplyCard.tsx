import React from 'react';
import type { ImageItem } from '@progress/sitefinity-nextjs-sdk/rest-sdk';

export type ReplyCardProps = {
    title?: string;
    image?: ImageItem;
};

export function ReplyCard({ title, image }: ReplyCardProps) {
    return (
        <div>
            <h1>{title}</h1>
            <img src={image?.Url} />
        </div>
    );
}
