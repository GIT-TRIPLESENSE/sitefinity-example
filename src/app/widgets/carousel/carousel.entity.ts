import { ContentContext, MixedContentContext } from '@progress/sitefinity-nextjs-sdk';
import {
    ComplexType,
    Content,
    ContentSection,
    DataType,
    Description,
    DisplayName,
    FieldMapping,
    FieldMappings,
    Model,
    WidgetEntity,
} from '@progress/sitefinity-widget-designers-sdk';

const viewMeta = {
    CardsList: [
        { fieldTitle: 'Image', fieldType: 'RelatedImage' },
        { fieldTitle: 'Title', fieldType: 'ShortText' },
        { fieldTitle: 'Text', fieldType: 'Text' },
    ],
};

@WidgetEntity('Carousel', 'Carousel')
export class CarouselEntity {
    //Content: string | null = null;

    @Content()
    @DisplayName('')
    @ContentSection('Select content to display', 0)
    SelectedItems: MixedContentContext | null = null;

    @DisplayName('Field mapping')
    @ContentSection('Select content to display', 1)
    @Description('Specify which fields from the content type you have selected to be displayed in the list.')
    @FieldMappings(viewMeta)
    ListFieldMapping: Array<FieldMapping> | null = null;
}
