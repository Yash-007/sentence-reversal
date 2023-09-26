import React, { useState } from 'react'
import { Modal, Form, Radio, Input, message } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { AddInventory } from '../../../apicalls/inventory';
import { SetLoading } from '../../../redux/loaderSlice';
function InventoryForm({ open, setOpen, reloadData }) {
  const {currentUser} = useSelector((state)=> state.users);
  const [inventoryType, setInventoryType] = useState("in");
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const onFinish= async (values)=>{
  try {
    dispatch(SetLoading(true));
    const response= await AddInventory({
      ...values,
      inventoryType,
      organization: currentUser._id,
    });
    dispatch(SetLoading(false));
    if(response.success){
      reloadData();
      message.success("Inventory Added Successfylly");
      setOpen(false);
    }
    else{
      throw new Error(response.message);
    }
  } catch (error) {
    message.error(error.message);
    dispatch(SetLoading(false));
  }
  }

  return (
    <>
      <Modal
        title="ADD INVENTORY"
        open={open}
        onCancel={() => setOpen(false)}
        centered
        onOk={()=> form.submit()}
      >

        <Form layout="vertical" className='flex flex-col gap-3' form={form} onFinish={onFinish}>
          <Form.Item label="Inventory Type">
            <Radio.Group value={inventoryType} onChange={(e)=> setInventoryType(e.target.value)}>
              <Radio value="in">In</Radio>
              <Radio value="out">Out</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item label="Blood Group" name="bloodGroup">
            <select name="" id="">
              <option value="a+">A+</option>
              <option value="a-">A-</option>
              <option value="b+">B+</option>
              <option value="b-">B-</option>
              <option value="ab+">AB+</option>
              <option value="ab-">AB-</option>
              <option value="o+">O+</option>
              <option value="o-">O-</option>
            </select>
          </Form.Item>

          <Form.Item label= {inventoryType==="out" ? "Hospital Email" : "Donar Email"} name="email">
           <Input type="email"/>
          </Form.Item>

          <Form.Item label="Quantity (ML)" name="quantity">
           <Input type="number"/>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default InventoryForm