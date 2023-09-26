import React, { useEffect, useState } from 'react'
import InventoryForm from './InventoryForm';
import {Button, message} from 'antd';
import { useDispatch } from 'react-redux';
import { SetLoading } from '../../../redux/loaderSlice';
import { GetInventory } from '../../../apicalls/inventory';
import {Table} from 'antd';
import { getDateFormat } from '../../../utils/helpers';
function Inventory() {
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
          if(record.inventoryType==="in")
          return record.donar.name;
          else
          return record.hospital.hospitalName;
        } 
      },
      {
        title: "Date",
        dataIndex: "createdAt",
        render: (text)=> getDateFormat(text)
      },

    ]

    const getData = async() =>{
      try {
        dispatch(SetLoading(true));
        const response = await GetInventory();
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
        <div className='flex justify-end'>
          <Button type= "default" onClick={()=> setOpen(true)}>
            Add Inventory
          </Button>
        </div>
     
     <Table columns={columns} dataSource = {data}  className='mt-4'></Table>

    {open && <InventoryForm open={open} setOpen={setOpen}
      reloadData={getData}
     />}
    </div>
  )
}

export default Inventory