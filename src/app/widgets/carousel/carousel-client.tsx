/* eslint-disable react/jsx-indent */
'use client';

import React, { useState } from 'react';
import Carousel from 'react-bootstrap/Carousel';

export function CarouselClient(carouselModel: any) {
    const [index, setIndex] = useState(0);

    const handleSelect = (selectedIndex: number) => {
        setIndex(selectedIndex);
    };

    return (
        <Carousel activeIndex={index} onSelect={handleSelect}>
            {carouselModel.data?.map((item: any) => {
                return (
                    <Carousel.Item>
                        <img className='d-block w-100' alt={item.Headline} src={item.Image[0].Url} />
                        <Carousel.Caption>
                            <h1>{item.Headline}</h1>
                        </Carousel.Caption>
                    </Carousel.Item>
                );
            })}
        </Carousel>
    );
}
