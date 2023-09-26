import React, { useState,useEffect } from 'react'
import { useDispatch } from 'react-redux';
import { SetLoading } from '../../../redux/loaderSlice';
import {message,Table} from 'antd';
import { GetAllDonarsOfAnOrganization } from '../../../apicalls/users';
import { getDateFormat } from '../../../utils/helpers';


function Donars() {
 const [data,setData] = useState([]);
 const dispatch= useDispatch();

 const columns = [
    {
        title: "Name",
        dataIndex: "name",
    },
    {
        title: "Email",
        dataIndex: "email",
    },
    {
         title: "Phone",
         dataIndex: "phone",
    },
    {
         title: "Created At",
         dataIndex:"createdAt",
         render : (text)=> getDateFormat(text),
    },
  ];

    const getData = async() =>{
        try {
          dispatch(SetLoading(true));
          const response = await GetAllDonarsOfAnOrganization();
          dispatch(SetLoading(false));
          if(response.success){
            setData(response.data);
            console.log(response.data);
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
        <Table columns= {columns} dataSource ={data}></Table>
    </div>
  )
}

export default Donars