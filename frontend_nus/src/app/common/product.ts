// export class Product {
//     sellerid: string | undefined;
//     pdtid: string | undefined;
//     catid: string | undefined;
//     name: string | undefined;
//     description: string | undefined;
//     unitPrice: number | undefined;
//     // imageUrl: string | undefined;
//     unitsInStock: string | undefined;
//     dateCreated: Date | undefined;
//     lastUpdated: Date | undefined;
// }


export class Product {
    pdtid?: string;
    id?: string;
    sellerid?: string;
    catid?: string;
    name?: string ;
    description?: string;
    unitPrice?: number;
    imageUrl?: string;
    unitsInStock?: number;
    dateCreated?: Date;
    lastUpdated?: Date;
    categoryname?: string;
}