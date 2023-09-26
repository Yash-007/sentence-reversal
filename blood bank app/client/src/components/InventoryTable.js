import React, { useEffect, useState } from 'react'
import { GetInventoryWithFilters } from '../apicalls/inventory';
import { getDateFormat } from '../utils/helpers';
import { Table, message } from 'antd';
import { useDispatch } from 'react-redux';
import { SetLoading } from '../redux/loaderSlice';

function InventoryTable({filters, userType, limit}) {
    const dispatch = useDispatch();
    const [open, setOpen] = useState(false);
    const [data, setData] = useState([]);
    const columns = [
      {
        title: "Inventory Type",
        dataIndex: "inventoryType",
        render: (text)=> text.toUpperCase(),
      },
      {
        title: "Blood Group",
        dataIndex: "bloodGroup",
        render: (text)=> text.toUpperCase(),
      },
      {
        title: "Quantity",
        dataIndex: "quantity",
        render: (text)=> text + "ML"
      },
      {
        title: "Reference",
        dataIndex: "reference",
        render: (text,record)=> {
          if(userType=== "organization"){
            return record.inventoryType==="in"
            ? record.donar?.name 
            : record.hospital?.hospitalName;
          }
          else{
            return record.organization.organizationName;
          }
        },
      },
      {
        title: "Date",
        dataIndex: "createdAt",
        render: (text)=> getDateFormat(text)
      },

    ]

  //  change columns for hospital or donor
  if(userType !== "organization"){
    // remove inventory type column 
    columns.splice(0,1);

    // change reference column to organization name 
    columns[2].title= "Organization Name";

    // date column should be renamed to Consumed On 
    columns[3].title= userType==="hospital"? "Taken Date" : "Donated Date";
  }


    const getData = async() =>{
      try {
        dispatch(SetLoading(true));
        const response = await GetInventoryWithFilters(filters,limit);
        dispatch(SetLoading(false));
        if(response.success){
          setData(response.data);
        }
        else{
          throw new Error(response.message);
        }
      } catch (error) {
        message.error(error.message);
        SetLoading(false);
      }
    }

    useEffect(()=>{
      getData();
    }, []);
  return (
    <div>
    <Table columns={columns} dataSource = {data}  className='mt-4'></Table>
    </div>
  )
}

export default InventoryTable