import {PPOrderDetail} from './pporder-detail';

export class PPOrder {
  constructor(
    public id?: any,
    public supplierID?: any,
    public userStoreID?: any,
    public no?: any,
    public date?: any,
    public totalAmount?: any,
    public ppOrderDetails?: PPOrderDetail[],
    public supplierCode?: any,
    public total?: any
  ) {}
}
