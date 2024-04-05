import { RootUrlService } from './root-url.service';
import { ServiceMetadata } from './service-metadata';
import { ODataFilterSerializer } from './services/odata-filter-serializer';
import { getProxyHeaders } from '../proxy/headers';
import { ErrorCodeException } from './errors/error-code.exception';
export class RestClient {
    static contextQueryParams;
    static getItemWithFallback(args) {
        let queryParams = {
            sf_fallback_prop_names: '*',
            $select: '*'
        };
        const wholeUrl = `${RestClient.buildItemBaseUrl(args.type)}(${args.id})/Default.GetItemWithFallback()${RestClient.buildQueryParams(RestClient.getQueryParams(args, queryParams))}`;
        return this.sendRequest({ url: wholeUrl });
    }
    static getTaxons(args) {
        const queryParams = {
            'showEmpty': args.showEmpty.toString(),
            '$orderby': args.orderBy,
            '@param': `[${(args.taxaIds || []).map(x => `'${x}'`).toString()}]`
        };
        const taxonomy = ServiceMetadata.taxonomies.find(x => x.Id === args.taxonomyId);
        if (!taxonomy) {
            throw `The taxonomy with id ${args.taxonomyId} does not exist`;
        }
        const action = `Default.GetTaxons(taxonomyId=${args.taxonomyId},selectedTaxaIds=@param,selectionMode='${args.selectionMode}',contentType='${args.contentType}')`;
        const wholeUrl = `${RestClient.buildItemBaseUrl(taxonomy['TaxaUrl'])}/${action}${RestClient.buildQueryParams(RestClient.getQueryParams(undefined, queryParams))}`;
        return this.sendRequest({ url: wholeUrl }).then(x => x.value);
    }
    static getItemWithStatus(args) {
        let queryParams = {
            $select: '*'
        };
        const wholeUrl = `${RestClient.buildItemBaseUrl(args.type)}(${args.id})/Default.GetItemWithStatus()${RestClient.buildQueryParams(RestClient.getQueryParams(args, queryParams))}`;
        return this.sendRequest({ url: wholeUrl });
    }
    static getItem(args) {
        let queryParams = {
            $select: '*'
        };
        const wholeUrl = `${this.buildItemBaseUrl(args.type)}(${args.id})${this.buildQueryParams(RestClient.getQueryParams(args, queryParams))}`;
        return this.sendRequest({ url: wholeUrl });
    }
    static getSharedContent(id, cultureName) {
        let queryParams = {
            sf_fallback_prop_names: 'Content'
        };
        if (cultureName) {
            queryParams['sf_culture'] = cultureName;
        }
        const wholeUrl = `${RestClient.buildItemBaseUrl(RestSdkTypes.GenericContent)}/Default.GetItemById(itemId=${id})${RestClient.buildQueryParams(RestClient.getQueryParams(undefined, queryParams))}`;
        return this.sendRequest({ url: wholeUrl });
    }
    static getItems(args) {
        const filteredSimpleFields = this.getSimpleFields(args.type, args.fields || []);
        const filteredRelatedFields = this.getRelatedFields(args.type, args.fields || []);
        let queryParams = {
            '$count': args.count,
            '$orderby': args.orderBy ? args.orderBy.map(x => `${x.Name} ${x.Type}`) : null,
            '$select': filteredSimpleFields.join(','),
            '$expand': filteredRelatedFields.join(','),
            '$skip': args.skip,
            '$top': args.take,
            '$filter': args.filter ? new ODataFilterSerializer().serialize({ Type: args.type, Filter: args.filter }) : null
        };
        const wholeUrl = `${this.buildItemBaseUrl(args.type)}${this.buildQueryParams(RestClient.getQueryParams(undefined, queryParams))}`;
        return this.sendRequest({ url: wholeUrl }).then((x) => {
            return { Items: x.value, TotalCount: x['@odata.count'] };
        });
    }
    static createItem(args) {
        let taxonomyPrefix = 'Taxonomy_';
        if (args.type.startsWith(taxonomyPrefix)) {
            const actualTaxonomyType = args.type.substring(taxonomyPrefix.length);
            const taxonomy = ServiceMetadata.taxonomies.find(x => x['Name'] === actualTaxonomyType);
            if (!taxonomy) {
                throw `Taxonomy with the name ${taxonomy} does not exist`;
            }
            args.type = taxonomy['TaxaUrl'];
            args.data['TaxonomyId'] = taxonomy.Id;
        }
        const wholeUrl = `${RestClient.buildItemBaseUrl(args.type)}${RestClient.buildQueryParams(RestClient.getQueryParams(args, undefined))}`;
        return RestClient.sendRequest({
            url: wholeUrl,
            data: args.data,
            method: 'POST',
            headers: args.additionalHeaders
        }).then((x) => {
            return x;
        });
    }
    static scheduleItem(args) {
        const wholeUrl = `${RestClient.buildItemBaseUrl(args.type)}(${args.id})/Default.Operation()${RestClient.buildQueryParams(RestClient.getQueryParams(args, undefined))}`;
        return RestClient.sendRequest({
            url: wholeUrl,
            data: {
                action: 'Schedule',
                actionParameters: {
                    PublicationDate: args.publicationDate.toISOString(),
                    ExpirationDate: args.expirationDate?.toISOString()
                }
            },
            method: 'POST',
            headers: args.additionalHeaders
        });
    }
    static updateItem(args) {
        const wholeUrl = `${RestClient.buildItemBaseUrl(args.type)}(${args.id})${RestClient.buildQueryParams(RestClient.getQueryParams(args, undefined))}`;
        return RestClient.sendRequest({
            url: wholeUrl,
            data: args.data,
            method: 'PATCH',
            headers: args.additionalHeaders
        });
    }
    static deleteItem(args) {
        const wholeUrl = `${RestClient.buildItemBaseUrl(args.type)}(${args.id})${RestClient.buildQueryParams(RestClient.getQueryParams(args, undefined))}`;
        return RestClient.sendRequest({
            url: wholeUrl,
            method: 'DELETE',
            headers: args.additionalHeaders
        }).then((x) => {
            return x;
        });
    }
    static publishItem(args) {
        const wholeUrl = `${RestClient.buildItemBaseUrl(args.type)}(${args.id})/Default.Operation()${RestClient.buildQueryParams(RestClient.getQueryParams(args, undefined))}`;
        return RestClient.sendRequest({
            url: wholeUrl,
            data: {
                action: 'Publish',
                actionParameters: {}
            },
            method: 'POST',
            headers: args.additionalHeaders
        });
    }
    static syncPage(args) {
        const wholeUrl = `${RestClient.buildItemBaseUrl(args.type)}(${args.id})${RestClient.buildQueryParams(RestClient.getQueryParams(args, undefined))}`;
        return RestClient.sendRequest({
            url: wholeUrl,
            data: Object.assign({}, args.data, { EnableSync: true }),
            method: 'PATCH',
            headers: args.additionalHeaders
        });
    }
    static lockItem(args) {
        const wholeUrl = `${RestClient.buildItemBaseUrl(args.type)}(${args.id})/Default.SaveTemp()${RestClient.buildQueryParams(RestClient.getQueryParams(args, undefined))}`;
        return RestClient.sendRequest({
            url: wholeUrl,
            data: {
                model: {}
            },
            method: 'POST',
            headers: args.additionalHeaders
        });
    }
    static relateItem(args) {
        const wholeUrl = `${RestClient.buildItemBaseUrl(args.type)}(${args.id})/${args.relationName}/$ref${RestClient.buildQueryParams(RestClient.getQueryParams(args, undefined))}`;
        const relatedTypeName = ServiceMetadata.getRelatedType(args.type, args.relationName);
        if (!relatedTypeName) {
            throw `Cannot find the type behind the field -> ${args.relationName}`;
        }
        const relatedItemUri = `${RestClient.buildItemBaseUrl(relatedTypeName)}(${args.relatedItemId})`;
        return RestClient.sendRequest({
            url: wholeUrl,
            data: {
                '@odata.id': relatedItemUri
            },
            method: 'POST',
            headers: args.additionalHeaders
        });
    }
    static lockPage(args) {
        const wholeUrl = `${RestClient.buildItemBaseUrl(args.type)}(${args.id})/Default.Lock()${RestClient.buildQueryParams(RestClient.getQueryParams(args, undefined))}`;
        return RestClient.sendRequest({
            url: wholeUrl,
            data: {
                state: {
                    Version: args.version
                }
            },
            method: 'POST',
            headers: args.additionalHeaders
        });
    }
    static createWidget(args) {
        const wholeUrl = `${RestClient.buildItemBaseUrl(args.type)}(${args.id})/Default.AddWidget()${RestClient.buildQueryParams(RestClient.getQueryParams(args, undefined))}`;
        const properties = [];
        if (args.properties) {
            Object.keys(args.properties).forEach((x) => {
                properties.push({
                    Name: x,
                    Value: args.properties[x]
                });
            });
        }
        const dto = {
            widget: {
                Id: null,
                Name: args.name,
                SiblingKey: args.siblingKey,
                ParentPlaceholderKey: args.parentPlaceholderKey,
                PlaceholderName: args.placeholderName,
                Properties: properties
            }
        };
        return RestClient.sendRequest({
            url: wholeUrl,
            data: dto,
            method: 'POST',
            headers: args.additionalHeaders
        });
    }
    static uploadItem(args) {
        const wholeUrl = `${RestClient.buildItemBaseUrl(args.type)}${RestClient.buildQueryParams(RestClient.getQueryParams(args, undefined))}`;
        const headers = args.additionalHeaders || {};
        const data = Object.assign({}, args.fields, { Title: args.title, ParentId: args.parentId, UrlName: args.urlName });
        headers['X-Sf-Properties'] = JSON.stringify(data);
        headers['X-File-Name'] = args.fileName;
        headers['Content-Type'] = args.contentType;
        headers['Content-Length'] = args.binaryData.length.toString();
        headers['Content-Encoding'] = 'base64';
        headers['DirectUpload'] = true.toString();
        return RestClient.sendRequest({
            url: wholeUrl,
            data: args.binaryData,
            method: 'POST',
            headers
        }).then((x) => {
            return x;
        });
    }
    static performSearch(args) {
        const query = {
            ['indexCatalogue']: args.indexCatalogue,
            ['searchQuery']: encodeURIComponent(args.searchQuery).toLowerCase(),
            ['wordsMode']: args.wordsMode,
            ['$orderBy']: args.orderBy,
            ['sf_culture']: args.culture,
            ['$skip']: args.skip?.toString(),
            ['$top']: args.take?.toString(),
            ['searchFields']: args.searchFields,
            ['highlightedFields']: args.highlightedFields,
            ['resultsForAllSites']: '',
            ['scoringInfo']: args.scoringInfo,
            ['filter']: args.filter
        };
        if (!!args.resultsForAllSites) {
            if (args.resultsForAllSites === true) {
                query['resultsForAllSites'] = '1';
            }
            else {
                query['resultsForAllSites'] = '2';
            }
        }
        const serviceUrl = RootUrlService.getServerCmsServiceUrl();
        const wholeUrl = `${serviceUrl}/Default.PerformSearch()${RestClient.buildQueryParams(RestClient.getQueryParams(undefined, query))}`;
        return RestClient.sendRequest({ url: wholeUrl }).then(x => {
            return {
                totalCount: x.TotalCount,
                searchResults: x.SearchResults
            };
        });
    }
    static getFacatebleFields(indexCatalogue) {
        const serviceUrl = RootUrlService.getServerCmsServiceUrl();
        const wholeUrl = `${serviceUrl}/Default.GetFacetableFields(indexCatalogName='${indexCatalogue}')`;
        return RestClient.sendRequest({ url: wholeUrl }).then(x => x.value);
    }
    static async getFacets(args) {
        const facetsStr = JSON.stringify(args.facets);
        const additionalQueryParams = {
            ['searchQuery']: args.searchQuery,
            ['sf_culture']: args.culture,
            ['indexCatalogName']: args.indexCatalogue,
            ['filter']: args.filter,
            ['resultsForAllSites']: args.resultsForAllSites,
            ['searchFields']: args.searchFields,
            ['facetFields']: facetsStr
        };
        const serviceUrl = RootUrlService.getServerCmsServiceUrl();
        const wholeUrl = `${serviceUrl}/Default.GetFacets()${RestClient.buildQueryParams(RestClient.getQueryParams(undefined, additionalQueryParams))}`;
        return RestClient.sendRequest({ url: wholeUrl }).then(x => x.value);
    }
    static getResetPasswordModel(token) {
        const serviceUrl = RootUrlService.getServerCmsServiceUrl();
        const wholeUrl = `${serviceUrl}/Default.GetResetPasswordModel()`;
        return RestClient.sendRequest({ url: wholeUrl, data: { securityToken: token }, method: 'POST' });
    }
    static getRegistrationSettings() {
        const serviceUrl = RootUrlService.getServerCmsServiceUrl();
        const wholeUrl = `${serviceUrl}/Default.RegistrationSettings()`;
        return RestClient.sendRequest({ url: wholeUrl });
    }
    static activateAccount(encryptedParam) {
        const serviceUrl = RootUrlService.getServerCmsServiceUrl();
        const wholeUrl = `${serviceUrl}/Default.AccountActivation()${RestClient.buildQueryParams({ qs: encodeURIComponent(encryptedParam) })}`;
        return RestClient.sendRequest({ url: wholeUrl });
    }
    static getExternalProviders() {
        const serviceUrl = RootUrlService.getServerCmsServiceUrl();
        const wholeUrl = `${serviceUrl}/Default.GetExternalProviders()`;
        return RestClient.sendRequest({ url: wholeUrl }).then((x) => x.value);
    }
    static getCurrentUser() {
        const wholeUrl = `${RestClient.buildItemBaseUrl('users')}/current`;
        return RestClient.sendRequest({
            url: wholeUrl,
            method: 'GET'
        }).then((x) => {
            return x.value;
        });
    }
    static getNavigation(args) {
        let queryMap = {
            'selectionModeString': args.selectionMode,
            'showParentPage': args.showParentPage ? args.showParentPage.toString() : undefined,
            'sf_page_node': args.currentPage,
            'selectedPages': args.selectedPages && args.selectedPages.length > 0 ? JSON.stringify(args.selectedPages) : undefined,
            'levelsToInclude': args.levelsToInclude ? args.levelsToInclude.toString() : 'all',
            'selectedPageId': args.selectedPageId
        };
        const wholeUrl = `${RestClient.buildItemBaseUrl(RestSdkTypes.Pages)}/Default.HierarhicalByLevelsResponse()${RestClient.buildQueryParams(RestClient.getQueryParams(undefined, queryMap))}`;
        return this.sendRequest({ url: wholeUrl }).then((x) => {
            return x.value;
        });
    }
    static getBreadcrumb(args) {
        let queryMap = {};
        Object.keys(args).filter(x => args[x]).map((x) => {
            if (x === 'detailItemInfo') {
                queryMap[x] = JSON.stringify(args[x]);
            }
            else {
                queryMap[x] = args[x].toString();
            }
        });
        const wholeUrl = `${RestClient.buildItemBaseUrl(RestSdkTypes.Pages)}/Default.GetBreadcrumb()${RestClient.buildQueryParams(RestClient.getQueryParams(undefined, queryMap))}`;
        return this.sendRequest({ url: wholeUrl }).then((x) => {
            return x.value;
        });
    }
    static async getFormLayout(args) {
        const wholeUrl = `${RestClient.buildItemBaseUrl(RestSdkTypes.Form)}(${args.id})/Default.Model()${RestClient.buildQueryParams(RestClient.getQueryParams(undefined, args.additionalQueryParams))}`;
        return RestClient.sendRequest({ url: wholeUrl, headers: args.additionalHeaders });
    }
    static async getWidgetModel(args) {
        args.additionalQueryParams = args.additionalQueryParams || {};
        args.additionalQueryParams.sfwidgetsegment = args.widgetSegmentId || '';
        args.additionalQueryParams.segment = args.segmentId || '';
        const wholeUrl = `${RestClient.buildItemBaseUrl(args.type)}(${args.id})/Default.HierarchicalWidgetModel(componentId='${args.widgetId}')${RestClient.buildQueryParams(RestClient.getQueryParams(undefined, args.additionalQueryParams))}`;
        return RestClient.sendRequest({ url: wholeUrl, headers: args.additionalHeaders });
    }
    static async getLazyWidgets(args) {
        let url = encodeURIComponent(args.url);
        let concatChar = '?';
        if (url.indexOf('?')) {
            concatChar = '&';
        }
        let lazyComponentsUrl = RootUrlService.getServerCmsServiceUrl() + `/Default.LazyComponents(url=@param)?@param='${url}'${concatChar}correlationId=${args.correlationId}`;
        const headers = { 'Cookie': args.cookie };
        const referrer = args.referrer;
        if (referrer && referrer.length > 0) {
            headers['SF_URL_REFERER'] = referrer;
        }
        else {
            headers['SF_NO_URL_REFERER'] = 'true';
        }
        return RestClient.sendRequest({ url: lazyComponentsUrl, headers }).then(x => x.Components);
    }
    static async getPageLayout(args) {
        const pagePath = args.pagePath;
        const queryParams = args.queryParams || {};
        let url = null;
        const whiteListedParams = ['sfaction', 'sf_version', 'segment', 'isBackend', 'sf_site', 'sf_site_temp', 'sf-auth', 'abTestVariationKey', 'sf-content-action', 'sf-lc-status'];
        let whitelistedParamDic = {};
        whiteListedParams.forEach(x => {
            whitelistedParamDic[x] = queryParams[x];
        });
        let indexOfSitefinityForms = pagePath.indexOf('Sitefinity/Forms/');
        if (indexOfSitefinityForms !== -1) {
            let name = null;
            let indexOfFormName = indexOfSitefinityForms + 'Sitefinity/Forms/'.length;
            let nextIndexOfSlash = pagePath.indexOf('/', indexOfFormName);
            if (nextIndexOfSlash === -1) {
                name = pagePath.substring(indexOfFormName);
            }
            else {
                name = pagePath.substring(indexOfFormName, nextIndexOfSlash);
            }
            const headers = {};
            RestClient.addAuthHeaders(args.cookie, headers);
            const formResponse = await RestClient.sendRequest({
                url: RootUrlService.getServerCmsUrl() + `/sf/system/forms?$filter=Name eq \'${name}\'`,
                headers
            });
            url = `/api/default/forms(${formResponse.value[0].Id})/Default.Model()`;
        }
        else {
            let indexOfSitefinityTemplate = pagePath.indexOf('Sitefinity/Template/');
            if (indexOfSitefinityTemplate > -1) {
                let id = null;
                let indexOfGuid = indexOfSitefinityTemplate + 'Sitefinity/Template/'.length;
                let nextIndexOfSlash = pagePath.indexOf('/', indexOfGuid);
                if (nextIndexOfSlash === -1) {
                    id = pagePath.substring(indexOfGuid);
                }
                else {
                    id = pagePath.substring(indexOfGuid, nextIndexOfSlash);
                }
                url = `/api/default/templates/${id}/Default.Model()`;
            }
            else {
                url = '/api/default/pages/Default.Model(url=@param)';
                let pageParamsDic = {};
                Object.keys(queryParams).filter(x => !whiteListedParams.some(y => y === x)).forEach(x => {
                    pageParamsDic[x] = queryParams[x];
                });
                let pagePramsQueryString = RestClient.buildQueryParams(pageParamsDic);
                whitelistedParamDic['@param'] = `'${encodeURIComponent(pagePath + pagePramsQueryString)}'`;
            }
        }
        let sysParamsQueryString = RestClient.buildQueryParams(whitelistedParamDic);
        url += `${sysParamsQueryString}`;
        let headers = args.additionalHeaders || {};
        if (args.cookie) {
            headers['Cookie'] = args.cookie;
            const proxyHeaders = getProxyHeaders();
            Object.keys(proxyHeaders).forEach((header) => {
                headers[header] = proxyHeaders[header];
            });
        }
        let requestData = { url: RootUrlService.getServerCmsUrl() + url, headers: headers, method: 'GET' };
        headers = this.buildHeaders(requestData);
        const requestInit = { headers, method: requestData.method, redirect: 'manual' };
        let layoutResponse;
        try {
            layoutResponse = await fetch(requestData.url, requestInit).then((x) => {
                if (x.status === 302 && x.headers.has('urlparameters')) {
                    const urlParameters = x.headers.get('urlparameters').split('/');
                    args.pagePath = x.headers.get('location');
                    return this.getPageLayout(args).then(y => {
                        y.UrlParameters = urlParameters;
                        return y;
                    });
                }
                return RestClient.handleApiResponse(x, requestData, true);
            });
        }
        catch (error) {
            if (error instanceof ErrorCodeException && error.code === 'NotFound') {
                throw error;
            }
            if (error instanceof ErrorCodeException && error.code === 'Unauthorized') {
                throw `Could not authorize fetching layout for url '${pagePath}'. Contact your system administator or check your access token.`;
            }
        }
        if (!layoutResponse) {
            throw `Could not fetch layout for url -> ${pagePath}`;
        }
        return layoutResponse;
    }
    static async getTemplates(args) {
        const wholeUrl = `${RootUrlService.getServerCmsUrl()}/sf/system/${args.type}/Default.GetPageTemplates(selectedPages=[${args.selectedPages.join(',')}])${RestClient.buildQueryParams(RestClient.getQueryParams(undefined, args.additionalQueryParams))}`;
        return RestClient.sendRequest({ url: wholeUrl, headers: args.additionalHeaders }).then(x => x.value);
    }
    static getSimpleFields(type, fields) {
        let star = '*';
        if (fields != null && fields.length === 1 && fields[0] === star) {
            return [star];
        }
        let simpleFields = ServiceMetadata.getSimpleFields(type);
        return fields.filter(x => simpleFields.some(y => y === x));
    }
    static getRelatedFields(type, fields) {
        let star = '*';
        if (fields != null && fields.length === 1 && fields[0] === star) {
            return [star];
        }
        const result = [];
        const relatedFields = ServiceMetadata.getRelationFields(type);
        const pattern = /(?<fieldName>.+?)\((?<nested>.+)\)/;
        fields.forEach((field) => {
            const fieldMatch = field.match(pattern);
            if (!fieldMatch && relatedFields.some(x => x === field)) {
                result.push(field);
            }
            else if (fieldMatch && fieldMatch.groups) {
                const fieldName = fieldMatch.groups['fieldName'];
                if (relatedFields.some(x => x === fieldName)) {
                    const innerFields = fieldMatch.groups['nested'];
                    const relatedFieldsInput = this.parseInnerFields(innerFields);
                    const relatedTypeName = ServiceMetadata.getRelatedType(type, fieldName);
                    if (relatedTypeName) {
                        let relatedSimpleFields = ServiceMetadata.getSimpleFields(relatedTypeName);
                        relatedSimpleFields = relatedFieldsInput.filter(x => relatedSimpleFields.some(y => y === x));
                        let simpleFieldsJoined = null;
                        if (relatedSimpleFields.length > 0) {
                            simpleFieldsJoined = relatedSimpleFields.join(',');
                            simpleFieldsJoined = `$select=${simpleFieldsJoined}`;
                        }
                        const relatedRelationFields = RestClient.getRelatedFields(relatedTypeName, relatedFieldsInput);
                        let relatedRelationFieldsJoined = null;
                        if (relatedRelationFields.length > 0) {
                            relatedRelationFieldsJoined = relatedRelationFields.join(',');
                            relatedRelationFieldsJoined = `$expand=${relatedRelationFieldsJoined}`;
                        }
                        let resultString = null;
                        if (relatedRelationFieldsJoined && simpleFieldsJoined) {
                            resultString = `${fieldName}(${simpleFieldsJoined};${relatedRelationFieldsJoined})`;
                        }
                        else if (relatedRelationFieldsJoined) {
                            resultString = `${fieldName}(${relatedRelationFieldsJoined})`;
                        }
                        else if (simpleFieldsJoined) {
                            resultString = `${fieldName}(${simpleFieldsJoined})`;
                        }
                        if (resultString) {
                            result.push(resultString);
                        }
                    }
                }
            }
        });
        return result;
    }
    static parseInnerFields(input) {
        const allFields = [];
        let fieldStartIndex = 0;
        let charIterator = 0;
        let openingBraceCounter = 0;
        let closingBraceCounter = 0;
        for (let i = 0; i < input.length; i++) {
            charIterator++;
            const character = input[i];
            if (character === '(') {
                openingBraceCounter++;
            }
            if (character === ')') {
                closingBraceCounter++;
            }
            if (character === ',') {
                if (openingBraceCounter > 0 && openingBraceCounter === closingBraceCounter) {
                    let relatedField = input.substring(fieldStartIndex, charIterator - fieldStartIndex - 1).trim();
                    allFields.push(relatedField);
                    fieldStartIndex = charIterator + 1;
                    openingBraceCounter = 0;
                    closingBraceCounter = 0;
                }
                else if (openingBraceCounter === 0 && closingBraceCounter === 0) {
                    let basicField = input.substring(fieldStartIndex, charIterator - fieldStartIndex - 1).trim();
                    allFields.push(basicField);
                    fieldStartIndex = charIterator + 1;
                }
            }
        }
        if (fieldStartIndex < charIterator) {
            let lastField = input.substring(fieldStartIndex, charIterator - fieldStartIndex).trim();
            allFields.push(lastField);
        }
        return allFields;
    }
    static buildQueryParams(queryParams) {
        if (!queryParams) {
            return '';
        }
        if (!queryParams) {
            queryParams = {};
        }
        queryParams = Object.assign({}, RestClient.contextQueryParams || {}, queryParams);
        let result = '';
        Object.keys(queryParams).forEach((key) => {
            const value = queryParams[key];
            if (value) {
                result += `${key}=${value}&`;
            }
        });
        if (result !== '') {
            result = '?' + result;
            result = result.substring(0, result.length - 1);
        }
        return result;
    }
    static addAuthHeaders(cookie, headers) {
        if (!!cookie) {
            headers['Cookie'] = cookie;
        }
        else if (process.env['SF_ACCESS_KEY']) {
            headers['X-SF-Access-Key'] = process.env['SF_ACCESS_KEY'];
        }
    }
    static getQueryParams(args, queryParams) {
        let queryParamsFromArgs = {};
        if (args) {
            queryParamsFromArgs = {
                'sf_provider': args.provider,
                'sf_culture': args.culture
            };
        }
        return Object.assign({}, RestClient.contextQueryParams || {}, queryParamsFromArgs, args?.additionalQueryParams || {}, queryParams || {});
    }
    static buildHeaders(requestData) {
        let headers = { 'X-Requested-With': 'react' };
        if ((requestData.method === 'POST' || requestData.method === 'PATCH') && !headers['Content-Type']) {
            headers['Content-Type'] = 'application/json';
        }
        const proxyHeaders = getProxyHeaders();
        Object.keys(proxyHeaders).forEach((headerKey) => {
            headers[headerKey] = proxyHeaders[headerKey];
        });
        if (!requestData.headers) {
            return headers;
        }
        return Object.assign(headers, requestData.headers);
    }
    static sendRequest(request) {
        const headers = this.buildHeaders(request);
        request.method = request.method || 'GET';
        const args = { headers, method: request.method };
        if (request.data && headers['Content-Type'] === 'application/json') {
            args.body = JSON.stringify(request.data);
        }
        if (headers['Content-Encoding'] === 'base64') {
            args.body = request.data;
        }
        if (process.env.NODE_ENV === 'development') {
            args.cache = 'no-cache';
        }
        return fetch(request.url, args).then((x => {
            return RestClient.handleApiResponse(x, request);
        }));
    }
    static buildItemBaseUrl(itemType) {
        let serviceUrl = null;
        if (typeof window === 'undefined') {
            serviceUrl = RootUrlService.getServerCmsServiceUrl();
        }
        else {
            serviceUrl = RootUrlService.getClientServiceUrl();
        }
        const setName = ServiceMetadata.getSetNameFromType(itemType);
        return `${serviceUrl}/${setName}`;
    }
    static handleApiResponse(x, request, throwErrorAsJson) {
        const contentTypeHeader = x.headers.get('content-type');
        if (contentTypeHeader) {
            if (x.status > 399) {
                if (contentTypeHeader.indexOf('application/json') !== -1) {
                    return x.json().then((y) => {
                        if (throwErrorAsJson && y.error && y.error.code && y.error.message) {
                            throw new ErrorCodeException(y.error.code, y.error.message);
                        }
                        const message = `${request.method} ${request.url} failed. Response -> ${y.error.code}: ${y.error.message}`;
                        throw message;
                    });
                }
                return x.text().then((html) => {
                    const message = `${request.method} ${request.url} failed. Response -> ${x.status}: ${x.statusText} ${html}`;
                    throw message;
                });
            }
            if (contentTypeHeader.indexOf('application/json') !== -1) {
                return x.json().then(x => x);
            } else {
                return x.text().then((text) => {
                    let ret = {};
                    try {
                        ret = JSON.parse(text);
                    } catch (error) {
                        throw `Failed to parse response as JSON. Url -> ${x.url}`;
                    }

                    return ret;
                });
            }
        }
        return Promise.resolve(undefined);
    }
}
export class RestSdkTypes {
    static Video = 'Telerik.Sitefinity.Libraries.Model.Video';
    static Image = 'Telerik.Sitefinity.Libraries.Model.Image';
    static News = 'Telerik.Sitefinity.News.Model.NewsItem';
    static Taxonomies = 'Telerik.Sitefinity.Taxonomies.Model.Taxonomy';
    static Tags = 'Taxonomy_Tags';
    static GenericContent = 'Telerik.Sitefinity.GenericContent.Model.ContentItem';
    static Pages = 'Telerik.Sitefinity.Pages.Model.PageNode';
    static Form = 'Telerik.Sitefinity.Forms.Model.FormDescription';
    static Site = 'Telerik.Sitefinity.Multisite.Model.Site';
}
