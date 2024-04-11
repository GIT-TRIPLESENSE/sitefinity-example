import { htmlAttributes, RenderWidgetService, WidgetContext } from '@progress/sitefinity-nextjs-sdk';
import React from 'react';

export function SitefinityWrapper<P>({ context, children }: { context: WidgetContext<P>; children: React.ReactNode }) {
    // attributes are needed for the widget to be visible in edit mode
    const dataAttributes = htmlAttributes(context);
    return <div {...dataAttributes}>{children}</div>;
}

export function SitefinityComponent<P>(
    Component: React.ComponentType<P>,
    allowChildren: AllowChildren = AllowChildren.No,
): React.ComponentType<WidgetContext<P>> {
    return (context) => {
        return (
            <SitefinityWrapper context={context}>
                <Component key={context.model.Id} {...context.model.Properties}>
                    {allowChildren === AllowChildren.Yes ? (
                        <SitefinityChildren context={context}></SitefinityChildren>
                    ) : null}
                </Component>
            </SitefinityWrapper>
        );
    };
}

export function SitefinityChildren<P>({ context, id = 'default' }: { context: WidgetContext<P>; id?: string }) {
    return (
        <>
            {context.model.Children.toReversed().map((c) =>
                RenderWidgetService.createComponent(c, context.requestContext),
            )}
            {context.requestContext.isEdit ? <div id={'childrenHolder'} data-sfcontainer={id}></div> : null}
        </>
    );
}

export enum AllowChildren {
    Yes = 1,
    No = 0,
}
