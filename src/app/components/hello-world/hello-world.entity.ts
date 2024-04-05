import { ContentSection, WidgetEntity, DataType, KnownFieldTypes} from '@progress/sitefinity-widget-designers-sdk';

@WidgetEntity('HelloWorld', 'Hello world')
export class HelloWorldEntity {
    @ContentSection('', 0)
    Content: string | null = null;

    @ContentSection('', 1)
    @DataType(KnownFieldTypes.Html)
    CodeReplyStart: string | null= null;

}
