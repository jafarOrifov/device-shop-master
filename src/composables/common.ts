import { Pagination } from "src/components/models";
import { api } from "src/boot/axios";
import {date} from "quasar";

export const dateutil = (() => {
  return date;
})();

export const formatPrice = (value:number) => {
  let val = (value / 1).toFixed(0).replace('.', ',')
  return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")
}

function parsePaginationQuery(pagination?: Pagination) {
    let queryArray = [];
  
    if (!pagination) {
      return "";
    }
    if (pagination.sortBy) {
      queryArray.push('_sort=' + pagination.sortBy);
  
    }
    if (pagination.descending !== undefined)
      queryArray.push('order=' + '');
  
    if (pagination.page)
      queryArray.push('_page=' + pagination.page);
    if (pagination.rowsPerPage)
      queryArray.push('_per_page=' + pagination.rowsPerPage);
  
    if (queryArray.length !== 0)
      return '?' + queryArray.join('&');
    else return ""
  
  }
  
function filterQuery(filter: any) {
    if (!filter) return '';
    let queryArray:any = [];
    Object.keys(filter).map((objectKey, index) => {
      const value = filter[objectKey];
      if (value === undefined || value === null || value.length === 0)
        return;
      queryArray.push(objectKey + '=' + value);
    });
  
    if (queryArray.length !== 0)
      return '&' + queryArray.join('&');
    else return ""
}

export function PagedGet(url?:string, pagination?: Pagination, filter?:object, config?:object):any {
    const p = url + parsePaginationQuery(pagination) + filterQuery(filter);
  
    return api.get(encodeURI(p), config);
}