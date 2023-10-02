import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { SetLoading } from '../../../redux/loaderSlice';
import { Table, message,Modal } from 'antd';
import { getDateFormat } from '../../../utils/helpers';
import { GetAllOrganizationsOfADonar, GetAllOrganizationsOfAHospital } from '../../../apicalls/users';
import InventoryTable from '../../../components/InventoryTable';

function Organizations({userType}) {
    const [data,setData] = useState([]);
    const dispatch= useDispatch();
    const [selectedOrganization,setSelectedOrganization]= useState(null);
    const {currentUser} = useSelector((state)=>state.users);
    const [showHistoryModal, setShowHistoryModal] = useState(false);
   
    const columns = [
       {
           title: "Name",
           dataIndex: "organizationName",
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
       {
            title: "Action",
            dataIndex:"action",
            render: (text,record)=>
              <span className= "underline text-md cursor-pointer" onClick={()=>{
                setSelectedOrganization(record);
                setShowHistoryModal(true);
              }}> 
               History
              </span>
       }
     ];
   
       const getData = async() =>{
           try {
             dispatch(SetLoading(true));
             let response;
             if(userType==="hospital"){
                response= await GetAllOrganizationsOfAHospital();
             }
             else{
                response=await GetAllOrganizationsOfADonar(); 
             }
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
           <Table columns= {columns} dataSource ={data} scroll={{ x: true }}></Table>

        {showHistoryModal &&      <Modal
            title ={
               `${
                userType === "donar" ? "Donation History" : "Consumption History"
               } In ${selectedOrganization.organizationName}` 
            }
            centered
           open = {showHistoryModal}
           onClose={()=> setShowHistoryModal(false)}
           width= {1000}
           onCancel={()=>setShowHistoryModal(false)}
           onOk={()=>setShowHistoryModal(false)}
           >

           <InventoryTable 
           filters={{organization : selectedOrganization._id
           , [userType] : currentUser._id}
           }
            >
           </InventoryTable>
            
           </Modal>}
       </div>
     )
}

export default Organizations