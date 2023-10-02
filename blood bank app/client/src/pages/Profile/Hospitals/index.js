import React, { useState,useEffect } from 'react'
import { useDispatch } from 'react-redux';
import { SetLoading } from '../../../redux/loaderSlice';
import {message,Table} from 'antd';
import {GetAllHospitalsOfAnOrganization } from '../../../apicalls/users';
import { getDateFormat } from '../../../utils/helpers';


function Hospitals () {
 const [data,setData] = useState([]);
 const dispatch= useDispatch();

 const columns = [
    {
        title: "Hospital Name",
        dataIndex: "hospitalName",
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
        title: "Address",
        dataIndex: "address",
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
          const response = await GetAllHospitalsOfAnOrganization();
          dispatch(SetLoading(false));
          if(response.success){
            setData(response.data);
            console.log(response.data);
            // console.log((data[0]\\).name);
            // console.log(data);
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
        <Table columns= {columns} dataSource ={data} scroll={{ x: true }}></Table>
    </div>
  )
}

export default Hospitals