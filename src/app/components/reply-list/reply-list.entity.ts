import { Model, WidgetEntity, ComplexType, DataModel, DataType, DisplayName} from '@progress/sitefinity-widget-designers-sdk';


@WidgetEntity('ReplyList', 'Reply list')


export class ReplyListEntity {
    // invalid properties
    // would receive Type=null
    @DataType(ComplexType.Enumerable)
    InvalidCollection: boolean[] | number[] | null = null;
    @DataType(ComplexType.Enumerable, 'string')
    ValidStringCollection: string[] | null = null;

    // would receive Type='enumerable'
    @DataModel('string')
    @DataType(ComplexType.Enumerable)
    AlsoValidStringCollection: string[] | null = null;


   
    
}

