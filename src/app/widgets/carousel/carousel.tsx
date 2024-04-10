import React from 'react';
import { WidgetContext, htmlAttributes } from '@progress/sitefinity-nextjs-sdk';
import { RestClient, SdkItem } from '@progress/sitefinity-nextjs-sdk/rest-sdk';

import { CarouselClient } from './carousel-client';
import { CarouselEntity } from './carousel.entity';

// Gets the content items that were selected in the widget editor (can be any content type, but for now "Slider" supported))
async function getItems(selectedItems: any) {
    let sliderItems;
    let contentItem = selectedItems.Content[0];
    if (contentItem.Variations) {
        let combinedFilter;
        if ((contentItem.Variations[0].Filter.Key = 'Ids')) {
            let itemIds = contentItem.Variations[0].Filter.Value.split(',');
            let filters = itemIds.map((x: any) => {
                return {
                    FieldName: 'Id',
                    FieldValue: x.trim(),
                    Operator: 'eq',
                };
            });
            combinedFilter = {
                Operator: 'OR',
                ChildFilters: filters,
            };
        }
        sliderItems = await RestClient.getItems<SdkItem>({
            type: contentItem.Type,
            provider: contentItem.Variations[0].Source,
            fields: ['Headline', 'Image'],
            filter: combinedFilter,
        });
        return await sliderItems.Items;
    }
}
export async function CarouselWidget(props: WidgetContext<CarouselEntity>) {
    const dataAttributes = htmlAttributes(props);

    let properties = props.model.Properties;
    let viewModel = await getItems(properties.SelectedItems);

    return (
        <div {...dataAttributes}>
            {viewModel ? <CarouselClient data={viewModel} /> : <h2>IMAGE CAROUSEL PLACEHOLDER</h2>}
        </div>
    );
}
