import { OrderItem } from './order-item';
import { Orders } from './orders';
import { Address } from './address';
import { Customer } from './customer';
export class Purchase {
    customer: Customer | undefined;
    order: Orders | undefined;
    orderItems: OrderItem[] | undefined;
}
