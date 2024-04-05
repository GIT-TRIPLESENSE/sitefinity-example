import {
    ContentSection,
    WidgetEntity,
    DataType,
    KnownFieldTypes,
    MediaItem,
    Model,
} from '@progress/sitefinity-widget-designers-sdk';
import { ImageItem } from '@progress/sitefinity-nextjs-sdk/rest-sdk';

@Model()
export class ReplyCardModel {
    @ContentSection('Title', 0)
    Title: string | null = null;

    @MediaItem('images', false)
    @DataType('media')
    Image: ImageItem | null = null;
}

@WidgetEntity('ReplyCard', 'Reply card')
export class ReplyCardEntity extends ReplyCardModel {}
